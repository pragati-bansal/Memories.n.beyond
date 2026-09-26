import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/initialProducts';
import { logger } from '../lib/logger';
import { safeParseLegacyProducts } from '../lib/validation';

const ProductContext = createContext();

const STORAGE_KEY = 'mnb_all_products_v2';

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Non-destructively parse legacy products - never drops or removes legacy records
          const parsedProducts = safeParseLegacyProducts(parsed);

          // Non-destructively merge factory default items from initialProducts
          // This ensures newly added categories (hampers, magazines, addons, general) appear
          // even if the user's browser had an older cached product list from localStorage.
          const existingIds = new Set(
            parsedProducts.map((p) => p.id || p.slug).filter(Boolean)
          );
          const missingDefaults = initialProducts.filter(
            (p) => !existingIds.has(p.id || p.slug)
          );

          if (missingDefaults.length > 0) {
            return [...parsedProducts, ...missingDefaults];
          }
          return parsedProducts;
        }
      }
    } catch (err) {
      logger.error('ProductContext', 'Failed to load products from localStorage', err);
    }
    // Default initial seed
    return initialProducts;
  });

  // Ensure any missing factory products are also merged into active state on mount
  useEffect(() => {
    setProducts((prev) => {
      const existingIds = new Set(prev.map((p) => p.id || p.slug).filter(Boolean));
      const missingDefaults = initialProducts.filter(
        (p) => !existingIds.has(p.id || p.slug)
      );
      if (missingDefaults.length > 0) {
        return [...prev, ...missingDefaults];
      }
      return prev;
    });
  }, []);

  // Persist products state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (err) {
      logger.error('ProductContext', 'Failed to save products to localStorage', err);
    }
  }, [products]);

  /**
   * Add a new product to the unified catalogue
   */
  const addProduct = (newProductData) => {
    const id = newProductData.id || `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    // Process sizes if formatted as array of strings or objects
    let processedSizes = [];
    if (Array.isArray(newProductData.sizes) && newProductData.sizes.length > 0) {
      processedSizes = newProductData.sizes.map((s) => {
        if (typeof s === 'string') {
          return {
            size: s,
            label: s.includes('Size') || s.includes('in') ? s : `${s} Format`,
            price: Number(newProductData.price) || 299,
          };
        }
        return {
          size: s.size || 'Standard',
          label: s.label || `${s.size || 'Standard'} Format`,
          price: Number(s.price) || Number(newProductData.price) || 299,
        };
      });
    } else {
      processedSizes = [
        {
          size: 'Standard',
          label: 'Standard Format',
          price: Number(newProductData.price) || 299,
        },
      ];
    }

    const rawImages =
      Array.isArray(newProductData.images) && newProductData.images.length > 0
        ? newProductData.images.filter(Boolean)
        : newProductData.imageUrl || newProductData.image_url
        ? [newProductData.imageUrl || newProductData.image_url]
        : ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'];

    const formattedProduct = {
      id,
      category: newProductData.category || 'frames',
      tag: newProductData.tag || 'New Arrival',
      title: newProductData.title || 'Custom Keepsake',
      price: Number(newProductData.price) || (processedSizes[0]?.price ?? 299),
      description: newProductData.description || 'Artisan handcrafted customized memory gift.',
      gradient: newProductData.gradient || 'linear-gradient(150deg,#FFE5EC,#FB6F92 55%,#881337)',
      images: rawImages,
      imageUrl: rawImages[0] || '',
      image_url: rawImages[0] || '',
      sizes: processedSizes,
      customization_options: {
        requires_photo: newProductData.requires_photo ?? true,
        max_photos: typeof newProductData.max_photos === 'number' ? newProductData.max_photos : 4,
        requires_text: newProductData.requires_text ?? true,
        text_placeholder: newProductData.text_placeholder || 'Custom names, quote or message',
        requires_date: newProductData.requires_date ?? false,
      },
      details: Array.isArray(newProductData.details) && newProductData.details.length > 0
        ? newProductData.details
        : [
            'Artisan handcrafted with love and utmost attention to detail',
            'Includes safe and secure protective packaging',
            'Personalized with your cherished memories & custom messages',
          ],
      updatedAt: new Date().toISOString(),
    };

      setProducts((prev) => [formattedProduct, ...prev]);
      return formattedProduct;
    };

    /**
     * Update any product (pre-existing or newly added)
     */
    const updateProduct = (productId, updatedData) => {
      setProducts((prev) =>
        prev.map((item) => {
          if (item.id === productId || item.slug === productId) {
            // Process updated sizes
            let processedSizes = item.sizes || [];
            if (Array.isArray(updatedData.sizes) && updatedData.sizes.length > 0) {
              processedSizes = updatedData.sizes.map((s) => {
                if (typeof s === 'string') {
                  return {
                    size: s,
                    label: s.includes('Size') || s.includes('in') ? s : `${s} Format`,
                    price: Number(updatedData.price) || item.price || 299,
                  };
                }
                return {
                  size: s.size || 'Standard',
                  label: s.label || `${s.size || 'Standard'} Format`,
                  price: Number(s.price) || Number(updatedData.price) || item.price || 299,
                };
              });
            }

            const mergedImages =
              Array.isArray(updatedData.images) && updatedData.images.length > 0
                ? updatedData.images.filter(Boolean)
                : updatedData.imageUrl || updatedData.image_url
                ? [updatedData.imageUrl || updatedData.image_url]
                : Array.isArray(item.images) && item.images.length > 0
                ? item.images
                : item.imageUrl || item.image_url
                ? [item.imageUrl || item.image_url]
                : ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'];

            return {
              ...item,
              ...updatedData,
              price: Number(updatedData.price) || item.price,
              sizes: processedSizes,
              images: mergedImages,
              imageUrl: mergedImages[0] || '',
              image_url: mergedImages[0] || '',
              customization_options: {
                ...item.customization_options,
                ...(updatedData.customization_options || {}),
                requires_photo: updatedData.requires_photo ?? item.customization_options?.requires_photo ?? true,
                max_photos: typeof updatedData.max_photos === 'number' ? updatedData.max_photos : item.customization_options?.max_photos ?? 4,
                requires_text: updatedData.requires_text ?? item.customization_options?.requires_text ?? true,
                requires_date: updatedData.requires_date ?? item.customization_options?.requires_date ?? false,
              },
              updatedAt: new Date().toISOString(),
            };
          }
          return item;
        })
      );
    };

  /**
   * Delete any product from catalogue
   */
  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId && p.slug !== productId));
    return true;
  };

  /**
   * Reset all products back to original default dataset
   */
  const resetToOriginalProducts = () => {
    setProducts(initialProducts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    } catch (err) {
      logger.error('ProductContext', 'Failed to reset products in localStorage', err);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        initialProducts,
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
