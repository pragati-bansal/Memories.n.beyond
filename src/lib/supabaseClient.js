import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';
import { newOrderSubmissionSchema } from './validation';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id')
);

// Initialize client if credentials are provided, or create null/fallback wrapper
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Upload a customer customization image to Supabase Storage bucket `customer-uploads`
 * @param {File} file 
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadCustomerPhoto(file) {
  if (!supabase || !isSupabaseConfigured) {
    logger.info('supabaseClient', 'Supabase is not configured yet. Returning simulated preview data URL.');
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `customizations/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('customer-uploads')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    logger.error('supabaseClient', 'Error uploading file to Supabase Storage', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('customer-uploads')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Insert an order record into the Supabase `orders` table
 * @param {Object} orderData 
 */
export async function createOrderRecord(orderData) {
  // Validate order data payload safely
  const validation = newOrderSubmissionSchema.safeParse(orderData);
  const payload = validation.success ? validation.data : orderData;

  if (!supabase || !isSupabaseConfigured) {
    logger.info('supabaseClient', 'Mock Order Created in local state', payload);
    return { data: { id: 'local-' + Date.now(), ...payload }, error: null };
  }

  const { data, error } = await supabase
    .from('orders')
    .insert([payload])
    .select()
    .single();

  if (error) {
    logger.error('supabaseClient', 'Error saving order into Supabase', error);
    throw error;
  }

  return { data, error: null };
}

/**
 * Upload a product image to Supabase Storage bucket (`product-images` with fallback to `customer-uploads`)
 * @param {File} file
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadProductImage(file) {
  if (!supabase || !isSupabaseConfigured) {
    const err = new Error('Supabase client is not configured.');
    console.error('Supabase storage error:', err);
    throw err;
  }

  const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
  const cleanExt = fileExt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'jpg';
  const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;
  const filePath = `products/${fileName}`;

  // Try 'product-images' bucket first, fall back to 'customer-uploads' if not found
  let targetBucket = 'product-images';
  let uploadRes = await supabase.storage
    .from(targetBucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (
    uploadRes.error &&
    (uploadRes.error.statusCode === '404' ||
      uploadRes.error.code === 'NoSuchBucket' ||
      uploadRes.error.message?.includes('not found'))
  ) {
    targetBucket = 'customer-uploads';
    uploadRes = await supabase.storage
      .from(targetBucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
  }

  if (uploadRes.error) {
    console.error('Error uploading product image to Supabase Storage:', uploadRes.error);
    throw uploadRes.error;
  }

  const { data } = supabase.storage
    .from(targetBucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

const isUUID = (str) =>
  typeof str === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

/**
 * One-time / Startup automatic migration to sync initial products to Supabase.
 * Checks the Supabase `products` table:
 * - If empty: automatically bulk-inserts all recovered products from initialProducts.
 * - If partial data: inserts any missing products without duplicating records.
 * - Returns the unified list of products, with safe local fallback if DB returns zero items.
 * @param {Array} initialProductsList
 * @returns {Promise<Array>}
 */
export async function syncInitialProducts(initialProductsList) {
  if (!supabase || !isSupabaseConfigured) {
    console.info('Supabase is not configured; returning local catalog.');
    return initialProductsList;
  }

  try {
    const { data: dbProducts, error: fetchErr } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchErr) {
      console.warn('Failed to query Supabase products table:', fetchErr);
      return initialProductsList;
    }

    const currentDbItems = dbProducts || [];

    // Check which items from initialProductsList are missing from Supabase
    const existingSlugs = new Set(
      currentDbItems.map((p) => p.slug || p.id || p.title)
    );

    const missingProducts = initialProductsList.filter(
      (p) => !existingSlugs.has(p.slug || p.id) && !existingSlugs.has(p.title)
    );

    if (missingProducts.length > 0) {
      console.log(`🚀 Automatic migration: Attempting to insert ${missingProducts.length} missing products to Supabase...`);

      const migrationPayloads = missingProducts.map((p) => {
        const rawImgs =
          Array.isArray(p.images) && p.images.length > 0
            ? p.images.filter(Boolean)
            : [p.imageUrl || p.image_url].filter(Boolean);

        return {
          slug: p.slug || p.id,
          title: p.title,
          category: p.category || 'frames',
          price: Number(p.price) || 299,
          description: p.description || '',
          tag: p.tag || '',
          gradient: p.gradient || 'linear-gradient(150deg,#FFE5EC,#FB6F92 55%,#881337)',
          images: rawImgs,
          sizes: p.sizes || [],
          customization_options: p.customization_options || {},
          details: p.details || [],
          is_active: true,
        };
      });

      const { data: inserted, error: insertErr } = await supabase
        .from('products')
        .insert(migrationPayloads)
        .select();

      if (insertErr) {
        console.warn('Supabase automatic product migration insert blocked or failed:', insertErr);
      } else if (inserted && inserted.length > 0) {
        console.log(`✅ Successfully migrated ${inserted.length} products to Supabase!`);
        // Re-fetch all products
        const { data: refreshed } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (refreshed && refreshed.length > 0) {
          return refreshed;
        }
      }
    }

    // Safe fallback: if Supabase returned 0 items, use recovered catalog so site NEVER looks blank
    if (currentDbItems.length === 0) {
      return initialProductsList;
    }

    // If Supabase has some items, merge any missing defaults so all categories remain visible
    const dbSlugs = new Set(currentDbItems.map((p) => p.slug || p.id || p.title));
    const missingDefaults = initialProductsList.filter(
      (p) => !dbSlugs.has(p.slug || p.id) && !dbSlugs.has(p.title)
    );

    return [...currentDbItems, ...missingDefaults];
  } catch (err) {
    console.error('Exception during syncInitialProducts:', err);
    return initialProductsList;
  }
}

/**
 * Fetch all products EXCLUSIVELY from Supabase `products` table
 */
export async function fetchProductsFromDb() {
  if (!supabase || !isSupabaseConfigured) {
    console.error('Supabase is not configured. Cannot fetch products.');
    throw new Error('Supabase client is not configured.');
  }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch products from Supabase:', error);
      throw error;
    }
    return data || [];
  } catch (err) {
    console.error('Error during products fetch from Supabase:', err);
    throw err;
  }
}

/**
 * Insert a product directly into Supabase `products` table
 * @param {Object} productData
 */
export async function insertProductInDb(productData) {
  if (!supabase || !isSupabaseConfigured) {
    const err = new Error('Supabase client is not configured.');
    console.error('Supabase product insert error:', err);
    throw err;
  }

  const rawImages =
    Array.isArray(productData.images) && productData.images.length > 0
      ? productData.images.filter(Boolean)
      : [productData.imageUrl || productData.image_url].filter(Boolean);

  const payload = {
    title: productData.title?.trim() || 'Untitled Product',
    slug:
      productData.slug ||
      (productData.title
        ? productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : null) ||
      `product-${Date.now()}`,
    category: productData.category || 'frames',
    price: Number(productData.price) || 299,
    description: productData.description || '',
    tag: productData.tag || '',
    gradient: productData.gradient || 'linear-gradient(150deg,#FFE5EC,#FB6F92 55%,#881337)',
    images: rawImages,
    sizes: productData.sizes || [],
    customization_options: productData.customization_options || {
      requires_photo: productData.requires_photo ?? true,
      max_photos: typeof productData.max_photos === 'number' ? productData.max_photos : 4,
      requires_text: productData.requires_text ?? true,
      text_placeholder: productData.text_placeholder || 'Custom names, quote or message',
      requires_date: productData.requires_date ?? false,
    },
    details: productData.details || [],
    is_active: productData.is_active ?? true,
  };

  // Only pass id if it is a valid UUID, otherwise omit it so Postgres gen_random_uuid() generates it
  if (productData.id && isUUID(productData.id)) {
    payload.id = productData.id;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select();

    if (error) {
      console.error('Supabase product insert error:', error);
      throw error;
    }

    return data && data[0] ? data[0] : payload;
  } catch (err) {
    console.error('Exception during product insert in Supabase:', err);
    throw err;
  }
}

/**
 * Update an existing product in Supabase `products` table
 * @param {string} productId - ID or slug of product to update
 * @param {Object} updatedData - Updated fields
 */
export async function updateProductInDb(productId, updatedData) {
  if (!supabase || !isSupabaseConfigured) {
    const err = new Error('Supabase client is not configured.');
    console.error('Supabase product update error:', err);
    throw err;
  }

  const rawImages =
    Array.isArray(updatedData.images) && updatedData.images.length > 0
      ? updatedData.images.filter(Boolean)
      : [updatedData.imageUrl || updatedData.image_url].filter(Boolean);

  const payload = {
    updated_at: new Date().toISOString(),
  };

  if (updatedData.title !== undefined) payload.title = updatedData.title.trim();
  if (updatedData.category !== undefined) payload.category = updatedData.category;
  if (updatedData.price !== undefined) payload.price = Number(updatedData.price) || 0;
  if (updatedData.description !== undefined) payload.description = updatedData.description;
  if (updatedData.tag !== undefined) payload.tag = updatedData.tag;
  if (updatedData.gradient !== undefined) payload.gradient = updatedData.gradient;
  if (rawImages.length > 0) payload.images = rawImages;
  if (updatedData.sizes !== undefined) payload.sizes = updatedData.sizes;
  if (updatedData.customization_options !== undefined) {
    payload.customization_options = updatedData.customization_options;
  } else if (
    updatedData.requires_photo !== undefined ||
    updatedData.max_photos !== undefined ||
    updatedData.requires_text !== undefined ||
    updatedData.requires_date !== undefined
  ) {
    payload.customization_options = {
      requires_photo: updatedData.requires_photo ?? true,
      max_photos: typeof updatedData.max_photos === 'number' ? updatedData.max_photos : 4,
      requires_text: updatedData.requires_text ?? true,
      text_placeholder: updatedData.text_placeholder || 'Custom names, quote or message',
      requires_date: updatedData.requires_date ?? false,
    };
  }
  if (updatedData.details !== undefined) payload.details = updatedData.details;
  if (updatedData.is_active !== undefined) payload.is_active = updatedData.is_active;

  try {
    const idKey = isUUID(productId) ? 'id' : 'slug';
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq(idKey, productId)
      .select();

    if (error) {
      console.error('Supabase product update error:', error);
      throw error;
    }

    return data && data[0] ? data[0] : { id: productId, ...payload };
  } catch (err) {
    console.error('Exception during product update in Supabase:', err);
    throw err;
  }
}

/**
 * Delete a product from Supabase `products` table
 * @param {string} productId
 */
export async function deleteProductFromDb(productId) {
  if (!supabase || !isSupabaseConfigured) {
    const err = new Error('Supabase client is not configured.');
    console.error('Supabase product delete error:', err);
    throw err;
  }

  try {
    const idKey = isUUID(productId) ? 'id' : 'slug';
    const { error } = await supabase
      .from('products')
      .delete()
      .eq(idKey, productId);

    if (error) {
      console.error('Supabase product delete error:', error);
      throw error;
    }

    return true;
  } catch (err) {
    console.error('Exception during product delete in Supabase:', err);
    throw err;
  }
}

/**
 * Fetch public reviews from Supabase `reviews` table
 */
export async function fetchReviewsFromDb() {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('Supabase fetch reviews response:', { data, error });

    if (error) {
      logger.warn('supabaseClient', 'Failed to fetch reviews from Supabase', error);
      return null;
    }
    return data;
  } catch (err) {
    logger.warn('supabaseClient', 'Error fetching reviews from Supabase', err);
    return null;
  }
}

/**
 * Insert a customer review into Supabase `reviews` table
 * Columns: id, name, city, product_name, rating, comment, image_url, created_at
 */
export async function saveReviewInDb(review) {
  if (!supabase || !isSupabaseConfigured) {
    console.warn('⚠️ Supabase client not configured; review saved to local fallback state.');
    return {
      data: {
        id: `local-${Date.now()}`,
        name: review.name,
        city: review.city || null,
        product_name: review.product_name || review.productName || null,
        rating: Number(review.rating || review.stars) || 5,
        comment: review.comment || review.text,
        image_url: review.image_url || review.image || null,
        created_at: new Date().toISOString(),
      },
      error: null,
    };
  }

  try {
    const payload = {
      name: review.name ? review.name.trim() : '',
      city: review.city && review.city.trim() ? review.city.trim() : null,
      product_name:
        (review.product_name || review.productName) && (review.product_name || review.productName).trim()
          ? (review.product_name || review.productName).trim()
          : null,
      rating: Number(review.rating || review.stars) || 5,
      comment: (review.comment || review.text || '').trim(),
      image_url: review.image_url || review.image || null,
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert([payload])
      .select()
      .single();

    console.log('Supabase insert response:', { data, error });

    if (error) {
      logger.error('supabaseClient', 'Supabase review insert error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Supabase review insert exception:', err);
    return { data: null, error: err };
  }
}



