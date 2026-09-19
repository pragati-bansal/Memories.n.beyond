import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { initialProducts } from '../data/initialProducts';
import ProductCard from './ProductCard';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function ProductGrid({ onSelectProduct }) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [isFromSupabase, setIsFromSupabase] = useState(false);

  // Fetch products from Supabase
  useEffect(() => {
    async function loadProducts() {
      if (!isSupabaseConfigured || !supabase) {
        setProducts(initialProducts);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase fetch error, falling back to initial products:', error.message);
          setProducts(initialProducts);
        } else if (data && data.length > 0) {
          setProducts(data);
          setIsFromSupabase(true);
        } else {
          // If Supabase table is empty, display local catalog
          setProducts(initialProducts);
        }
      } catch (err) {
        console.error('Unexpected error fetching products:', err);
        setProducts(initialProducts);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'frames', label: 'Custom Photo Frames' },
    { id: 'bouquets', label: 'Polaroid Bouquets' },
    { id: 'birthday', label: 'Birthday Specials' },
    { id: 'couple', label: 'Couple Keepsakes' },
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section id="collection" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-rose-deep text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Handmade Catalog</span>
            {isFromSupabase && (
              <span className="ml-2 px-2 py-0.5 text-[10px] bg-green-100 text-green-700 rounded-full font-semibold">
                Live Supabase Connected
              </span>
            )}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-burgundy-deep mb-4 leading-tight">
            Every piece starts with your photograph
          </h2>
          <p className="text-base text-ink-soft">
            Browse by what you're celebrating — each item is made to order, so sizes and
            finishes can flex around your gift.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-12">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                  isActive
                    ? 'bg-burgundy text-cream border-burgundy shadow-craft-soft'
                    : 'bg-paper text-ink-soft border-burgundy/15 hover:border-rose hover:text-burgundy-deep'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-paper rounded-3xl p-6 border border-burgundy/10 animate-pulse space-y-4"
              >
                <div className="h-48 bg-blush/40 rounded-2xl" />
                <div className="h-4 bg-blush/60 rounded w-1/3" />
                <div className="h-6 bg-blush/60 rounded w-3/4" />
                <div className="h-4 bg-blush/40 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-cream-deep/50 rounded-3xl border border-burgundy/10">
            <p className="text-ink-soft font-serif text-lg">
              No handcrafted items found in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id || product.slug}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
