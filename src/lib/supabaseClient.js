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
 * Fetch all products from Supabase `products` table
 */
export async function fetchProductsFromDb() {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      logger.warn('supabaseClient', 'Failed to fetch products from Supabase', error);
      return null;
    }
    return data;
  } catch (err) {
    logger.warn('supabaseClient', 'Error during products fetch from Supabase', err);
    return null;
  }
}

/**
 * Upsert (insert or update) a product in Supabase `products` table
 */
export async function upsertProductInDb(product) {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const rawImages = Array.isArray(product.images) && product.images.length > 0
      ? product.images.filter(Boolean)
      : [product.imageUrl || product.image_url].filter(Boolean);

    const payload = {
      title: product.title,
      slug: product.slug || product.id,
      category: product.category || 'frames',
      price: Number(product.price) || 299,
      description: product.description || '',
      tag: product.tag || '',
      gradient: product.gradient || 'linear-gradient(150deg,#FFE5EC,#FB6F92 55%,#881337)',
      images: rawImages,
      sizes: product.sizes || [],
      customization_options: product.customization_options || {},
      details: product.details || [],
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(product.id);
    if (isUUID) {
      payload.id = product.id;
    }

    const { data, error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'slug' })
      .select()
      .maybeSingle();

    if (error) {
      logger.warn('supabaseClient', 'Failed to upsert product in Supabase', error);
      return null;
    }
    return data;
  } catch (err) {
    logger.warn('supabaseClient', 'Error during product upsert in Supabase', err);
    return null;
  }
}

/**
 * Delete / soft-delete a product from Supabase `products` table
 */
export async function deleteProductFromDb(productId) {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(productId);
    const query = isUUID
      ? supabase.from('products').update({ is_active: false }).eq('id', productId)
      : supabase.from('products').update({ is_active: false }).eq('slug', productId);

    const { error } = await query;
    if (error) {
      logger.warn('supabaseClient', 'Failed to delete product in Supabase', error);
      return false;
    }
    return true;
  } catch (err) {
    logger.warn('supabaseClient', 'Error deleting product in Supabase', err);
    return false;
  }
}

/**
 * Fetch public approved reviews from Supabase `reviews` table
 */
export async function fetchReviewsFromDb() {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

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
 */
export async function saveReviewInDb(review) {
  if (!supabase || !isSupabaseConfigured) {
    return {
      id: review.id || `local-${Date.now()}`,
      name: review.name,
      rating: Number(review.rating || review.stars) || 5,
      comment: review.comment || review.text,
      city: review.city || 'Verified Buyer',
      product_name: review.product_name || review.productName || 'Handmade Keepsake',
      image_url: review.image_url || review.image || null,
      is_approved: true,
      created_at: new Date().toISOString(),
    };
  }

  try {
    const payload = {
      name: review.name.trim(),
      rating: Number(review.rating || review.stars) || 5,
      comment: (review.comment || review.text || '').trim(),
      city: (review.city || 'Verified Buyer').trim(),
      product_name: (review.product_name || review.productName || 'Handmade Keepsake').trim(),
      image_url: review.image_url || review.image || null,
      is_approved: true,
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert([payload])
      .select()
      .single();

    if (error) {
      logger.error('supabaseClient', 'Failed to insert review in Supabase', error);
      throw error;
    }
    return data;
  } catch (err) {
    logger.error('supabaseClient', 'Error inserting review in Supabase', err);
    throw err;
  }
}


