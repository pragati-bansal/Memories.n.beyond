import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye } from 'lucide-react';

export default function ProductCard({ product, onSelect }) {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  const displayImage =
    product.images && product.images.length > 0 ? product.images[0] : null;

  const hasSizes = product.sizes && product.sizes.length > 0;
  const activeSize = hasSizes ? product.sizes[selectedSizeIndex] : null;
  const displayPrice = activeSize ? activeSize.price : product.price;

  const handleCardClick = () => {
    onSelect({
      ...product,
      selectedSize: activeSize,
      price: displayPrice,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className="group bg-paper rounded-2xl sm:rounded-3xl overflow-hidden border border-burgundy/10 shadow-craft-soft hover:shadow-craft-modal cursor-pointer flex flex-col transition-all duration-300"
    >
      {/* Visual Thumbnail Area */}
      <div className="relative h-56 sm:h-64 bg-blush/40 flex items-center justify-center overflow-hidden p-6">
        {/* Craft Polaroid Mini Card Effect */}
        <div className="w-36 h-44 bg-paper rounded-none p-2 pb-6 shadow-craft-soft border border-burgundy/10 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-1">
          <div
            className="w-full h-full rounded-none overflow-hidden flex items-center justify-center"
            style={{ background: product.gradient || '#EFC6C0' }}
          >
            {displayImage ? (
              <img
                src={displayImage}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <Sparkles className="w-6 h-6 text-cream/80" />
            )}
          </div>
        </div>

        {/* Hover Quick View Ribbon */}
        <div className="absolute inset-x-0 bottom-0 py-3 bg-gradient-to-t from-burgundy-deep/90 to-transparent text-cream flex items-center justify-center gap-1.5 text-xs font-bold tracking-wide transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Eye className="w-3.5 h-3.5" />
          <span>Customize &amp; Order</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-rose-deep block mb-1">
            {product.tag || 'Handmade Keepsake'}
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-medium text-burgundy-deep mb-2 line-clamp-1 group-hover:text-rose-deep transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-ink-soft line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>

          {/* Size & Variant Selector (if product has multiple sizes) */}
          {hasSizes && (
            <div className="mb-4" onClick={(e) => e.stopPropagation()}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft block mb-1.5">
                Available in:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((s, idx) => {
                  const isSelected = selectedSizeIndex === idx;
                  return (
                    <button
                      key={s.size}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold transition-all ${
                        isSelected
                          ? 'bg-burgundy text-cream border-burgundy shadow-sm'
                          : 'bg-cream text-ink-soft border-burgundy/15 hover:border-rose/60 hover:text-burgundy-deep'
                      }`}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-burgundy/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-ink-soft">
              {activeSize ? activeSize.size : 'Price'}
            </div>
            <div className="font-bold text-base sm:text-xl text-burgundy">
              ₹{displayPrice}
            </div>
          </div>

          <button
            type="button"
            className="text-xs font-bold bg-burgundy/10 hover:bg-burgundy hover:text-cream text-burgundy px-3.5 py-2 rounded-full transition-all inline-flex items-center gap-1"
          >
            Customize &rarr;
          </button>
        </div>
      </div>
    </motion.div>
  );
}
