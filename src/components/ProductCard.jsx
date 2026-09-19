import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye } from 'lucide-react';

export default function ProductCard({ product, onSelect }) {
  const displayImage =
    product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(product)}
      className="group bg-paper rounded-2xl sm:rounded-3xl overflow-hidden border border-burgundy/10 shadow-craft-soft hover:shadow-craft-modal cursor-pointer flex flex-col transition-all duration-300"
    >
      {/* Visual Thumbnail Area */}
      <div className="relative h-56 sm:h-64 bg-blush/50 flex items-center justify-center overflow-hidden p-6">
        {/* Craft Polaroid Mini Card Effect */}
        <div className="w-32 h-40 bg-paper rounded-md p-2 pb-6 shadow-craft-soft border border-burgundy/10 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-2">
          <div
            className="w-full h-full rounded-sm overflow-hidden flex items-center justify-center"
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
          <span>Quick View · Customize</span>
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
        </div>

        <div className="pt-3 border-t border-burgundy/10 flex items-center justify-between">
          <div className="text-xs text-ink-soft">
            Starting at{' '}
            <span className="font-bold text-base sm:text-lg text-burgundy">
              ₹{product.price}
            </span>
          </div>

          <button
            type="button"
            className="text-xs font-bold text-burgundy hover:text-burgundy-deep inline-flex items-center gap-1"
          >
            Details &rarr;
          </button>
        </div>
      </div>
    </motion.div>
  );
}
