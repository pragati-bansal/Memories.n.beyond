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

