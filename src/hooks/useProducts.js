import { useState, useEffect, useCallback } from 'react';
import { initialProducts } from '../data/initialProducts';
import {
  fetchProductsFromSupabase,
  subscribeToProducts,
  isSupabaseConfigured,
} from '../lib/supabaseClient';

const CATEGORY_TAG_MAP = {
  frames: 'Handcrafted Frame',
  magazines: 'Editorial Magazine',
  hampers: 'Gift Hamper',
  addons: 'Add-on Keepsake',
  general: 'Forever Floral Set',
};

const CATEGORY_GRADIENT_MAP = {
  frames: 'linear-gradient(150deg,#2B2D42,#8D99AE 55%,#EDF2F4)',
  magazines: 'linear-gradient(150deg,#E8B8AE,#C98D89 55%,#8A4A47)',
  hampers: 'linear-gradient(150deg,#FFF3E0,#FFE0B2 50%,#D97706)',
  addons: 'linear-gradient(150deg,#F7E1E3,#EFC6C0 55%,#C98D89)',
  general: 'linear-gradient(150deg,#F3E8FF,#E9D5FF 50%,#7E22CE)',
};

/**
 * Standardize Supabase DB row to the frontend Product schema
 */
export function formatSupabaseProduct(row) {
  const category = (row.category || 'frames').toLowerCase().trim();
  return {
    id: row.id,
    category: category,
    tag: row.tag || CATEGORY_TAG_MAP[category] || 'Handmade Keepsake',
    title: row.title,
    price: Number(row.price) || 0,
    description: row.description || '',
    gradient: row.gradient || CATEGORY_GRADIENT_MAP[category] || 'linear-gradient(150deg,#F6DEDA,#EFC6C0 50%,#B4884E)',
    images: row.image_url ? [row.image_url] : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    customization_options: row.customization_options || {
      requires_photo: category !== 'general' && category !== 'addons',
      max_photos: category === 'magazines' ? 20 : category === 'hampers' ? 16 : 8,
      requires_text: true,
      text_placeholder: 'Custom caption, names, special date or message',
      requires_date: category === 'frames' || category === 'magazines' || category === 'hampers',
    },
    details: Array.isArray(row.details) && row.details.length > 0
      ? row.details
      : [
          '100% artisan handcrafted with meticulous care',
          'Premium archival grade materials and crystal-clear finish',
          'Customized with your memorable photos and special messages',
        ],
    is_supabase: true,
    created_at: row.created_at,
  };
}

export function useProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);

  const loadProducts = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setProducts(initialProducts);
      setLoading(false);
      setIsUsingSupabase(false);
      return;
    }

    try {
      setLoading(true);
      const rows = await fetchProductsFromSupabase();
      if (rows && rows.length > 0) {
        const formatted = rows.map(formatSupabaseProduct);
        setProducts(formatted);
        setIsUsingSupabase(true);
      } else {
        // If Supabase table is initialized but empty, keep initial products as base
        setProducts(initialProducts);
        setIsUsingSupabase(false);
      }
      setError(null);
    } catch (err) {
      console.warn('Falling back to local product catalogue:', err);
      setProducts(initialProducts);
      setError(err.message);
      setIsUsingSupabase(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();

    if (isSupabaseConfigured) {
      // Real-time synchronization
      const unsubscribe = subscribeToProducts(() => {
        loadProducts();
      });
      return () => unsubscribe();
    }
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    isUsingSupabase,
    refreshProducts: loadProducts,
  };
}
