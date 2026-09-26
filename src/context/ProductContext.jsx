import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialProducts } from '../data/initialProducts';
import {
  supabase,
  isSupabaseConfigured,
  syncInitialProducts,
  fetchProductsFromDb,
  insertProductInDb,
  updateProductInDb,
  deleteProductFromDb,
} from '../lib/supabaseClient';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  // Initialize with original recovered catalog so site NEVER looks blank while fetching
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all products dynamically from Supabase with safe fallback
   */
  const refreshProducts = useCallback(async () => {
    try {
      setError(null);

      // Perform dynamic Supabase fetch & automatic migration check
      const list = await syncInitialProducts(initialProducts);

      // Normalise database products so client components can read images / imageUrl uniformly
      const normalised = (list && list.length > 0 ? list : initialProducts).map((p) => {
        const imgs = Array.isArray(p.images) && p.images.length > 0 ? p.images.filter(Boolean) : [];
        const primaryImg = imgs[0] || p.imageUrl || p.image_url || '';
        return {
          ...p,
          images: imgs.length > 0 ? imgs : primaryImg ? [primaryImg] : [],
          imageUrl: primaryImg,
          image_url: primaryImg,
        };
      });

      setProducts(normalised);
      return normalised;
    } catch (err) {
      console.error('Failed to retrieve products from Supabase:', err);
      setError(err.message || 'Failed to fetch products');
      // Safe fallback so site NEVER looks blank
      setProducts(initialProducts);
      return initialProducts;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch exclusively from Supabase on mount
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  /**
   * Add a new product directly to Supabase products table
   */
  const addProduct = async (newProductData) => {
    try {
      const insertedProduct = await insertProductInDb(newProductData);

      // Normalise image fields for UI consistency
      const imgs =
        Array.isArray(insertedProduct.images) && insertedProduct.images.length > 0
          ? insertedProduct.images.filter(Boolean)
          : [];
      const primaryImg = imgs[0] || insertedProduct.imageUrl || insertedProduct.image_url || '';

      const normalisedProduct = {
        ...insertedProduct,
        images: imgs.length > 0 ? imgs : primaryImg ? [primaryImg] : [],
        imageUrl: primaryImg,
        image_url: primaryImg,
      };

      // Immediately update local state without requiring manual page refresh
      setProducts((prev) => [normalisedProduct, ...prev]);
      return normalisedProduct;
    } catch (err) {
      console.error('Failed to add product in ProductContext:', err);
      throw err;
    }
  };

  /**
   * Update an existing product in Supabase products table
   */
  const updateProduct = async (productId, updatedData) => {
    try {
      const updatedProduct = await updateProductInDb(productId, updatedData);

      const imgs =
        Array.isArray(updatedProduct.images) && updatedProduct.images.length > 0
          ? updatedProduct.images.filter(Boolean)
          : [];
      const primaryImg = imgs[0] || updatedProduct.imageUrl || updatedProduct.image_url || '';

      const normalisedProduct = {
        ...updatedProduct,
        images: imgs.length > 0 ? imgs : primaryImg ? [primaryImg] : [],
        imageUrl: primaryImg,
        image_url: primaryImg,
      };

      // Immediately update state
      setProducts((prev) =>
        prev.map((item) =>
          item.id === productId || item.slug === productId ? normalisedProduct : item
        )
      );
      return normalisedProduct;
    } catch (err) {
      console.error('Failed to update product in ProductContext:', err);
      throw err;
    }
  };

  /**
   * Delete a product directly from Supabase products table
   */
  const deleteProduct = async (productId) => {
    try {
      await deleteProductFromDb(productId);

      // Immediately remove from local state
      setProducts((prev) => prev.filter((p) => p.id !== productId && p.slug !== productId));
      return true;
    } catch (err) {
      console.error('Failed to delete product in ProductContext:', err);
      throw err;
    }
  };

  /**
   * Reset / Seed factory products into Supabase products table
   * Only triggered when an admin explicitly requests catalogue reset
   */
  const resetToOriginalProducts = async () => {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error('Supabase client is not configured.');
    }

    try {
      setLoading(true);
      // Format initial factory products for Supabase schema
      const seedPayloads = initialProducts.map((p) => {
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
          updated_at: new Date().toISOString(),
        };
      });

      const { error: seedError } = await supabase
        .from('products')
        .upsert(seedPayloads, { onConflict: 'slug' });

      if (seedError) {
        console.error('Failed to seed factory products to Supabase:', seedError);
        throw seedError;
      }

      await refreshProducts();
    } catch (err) {
      console.error('Error resetting products in Supabase:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToOriginalProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
