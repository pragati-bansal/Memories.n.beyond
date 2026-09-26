import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, MessageCircle, ArrowRight, Heart, Flower2 } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from './LoadingSkeleton';

export default function GeneralGiftsSection({ onSelectProduct, onNavigateToCategory }) {
  const { products, loading } = useProducts();
  const generalProducts = products.filter((p) => p.category === 'general');

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919368606771';
  const customComboWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi Memories n Beyond! 🌸 I would like to inquire about your handcrafted forever flower bouquets and custom gift combos."
  )}`;

  return (
    <section id="general-gifts" className="py-16 sm:py-24 bg-gradient-to-b from-cream via-blush/20 to-cream relative overflow-hidden">
      {/* Ambient background blur blobs */}
      <div className="absolute top-1/4 -left-32 w-72 h-72 bg-blush/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-80 h-80 bg-blush-deep/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blush/60 border border-burgundy/15 text-rose-deep text-xs font-bold uppercase tracking-wider mb-3">
              <Flower2 className="w-3.5 h-3.5 text-burgundy" />
              <span>Handmade Forever Floral Collection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-burgundy-deep leading-tight">
              Generalised Gifts &amp; Bouquets
            </h2>
            <p className="text-sm sm:text-base text-ink-soft mt-3 leading-relaxed">
              Timeless artisan velvet pipe-cleaner floral bouquets that never fade — paired with personalized greeting cards &amp; luxury satin ribbons.
            </p>
          </div>

          {/* Quick Category Link */}
          {onNavigateToCategory && (
            <button
              type="button"
              onClick={() => onNavigateToCategory('general')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-burgundy hover:text-burgundy-deep hover:underline transition-all cursor-pointer shrink-0 self-start md:self-end"
            >
              <span>Explore All Generalised Gifts</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            <AnimatePresence>
              {generalProducts.map((product) => (
                <ProductCard
                  key={product.id || product.slug}
                  product={product}
                  onSelect={(p) => onSelectProduct && onSelectProduct(p)}
                />
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Custom Combo WhatsApp Callout Strip */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-paper via-blush/30 to-paper border border-burgundy/15 shadow-craft-soft flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blush flex items-center justify-center text-burgundy shrink-0 shadow-sm">
              <Gift className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-burgundy-deep">
                Want custom colors or special greeting cards?
              </h3>
              <p className="text-xs sm:text-sm text-ink-soft mt-0.5 leading-snug">
                Personalize flower petal colors, bouquet wrapping styles, and custom handwritten message cards on WhatsApp.
              </p>
            </div>
          </div>

          <a
            href={customComboWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm shadow-craft-soft hover:shadow-craft-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
