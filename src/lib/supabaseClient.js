import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id')
);

// Initialize client if credentials are provided
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Upload a product image to Supabase Storage bucket `product-images`
 * @param {File} file 
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadProductImage(file) {
  if (!supabase || !isSupabaseConfigured) {
    console.warn('Supabase not configured. Using local FileReader preview URL.');
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    console.error('Error uploading product image:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Fetch all products from Supabase `products` table
 * @returns {Promise<Array>}
 */
export async function fetchProductsFromSupabase() {
  if (!supabase || !isSupabaseConfigured) {
    return [];
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    throw error;
  }

  return data || [];
}

/**
 * Insert a new product row into Supabase `products` table
 * @param {Object} product
 * @param {string} product.title
 * @param {number} product.price
 * @param {string} product.category
 * @param {string} product.description
 * @param {string} product.image_url
 */
export async function insertProductToSupabase({ title, price, category, description, image_url }) {
  if (!supabase || !isSupabaseConfigured) {
    const mockRow = {
      id: 'local-' + Date.now(),
      title,
      price: Number(price),
      category,
      description,
      image_url,
      created_at: new Date().toISOString(),
    };
    return { data: mockRow, error: null };
  }

  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        title: title.trim(),
        price: Number(price),
        category: category.toLowerCase().trim(),
        description: description ? description.trim() : '',
        image_url: image_url || '',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error inserting product into Supabase:', error);
    throw error;
  }

  return { data, error: null };
}

/**
 * Delete a product row from Supabase `products` table by ID
 * @param {string|number} id 
 */
export async function deleteProductFromSupabase(id) {
  if (!supabase || !isSupabaseConfigured) {
    return { success: true };
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product from Supabase:', error);
    throw error;
  }

  return { success: true };
}

/**
 * Subscribe to real-time changes on the Supabase `products` table
 * @param {Function} onChangeCallback 
 * @returns {Function} unsubscribe function
 */
export function subscribeToProducts(onChangeCallback) {
  if (!supabase || !isSupabaseConfigured) {
    return () => {};
  }

  const channel = supabase
    .channel('public:products')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      (payload) => {
        onChangeCallback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Upload a customer customization image to Supabase Storage bucket `customer-uploads`
 * @param {File} file 
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadCustomerPhoto(file) {
  if (!supabase || !isSupabaseConfigured) {
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
    console.error('Error uploading customer photo:', uploadError);
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
  if (!supabase || !isSupabaseConfigured) {
    return { data: { id: 'local-' + Date.now(), ...orderData }, error: null };
  }

  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (error) {
    console.error('Error saving order into Supabase:', error);
    throw error;
  }

  return { data, error: null };
}
