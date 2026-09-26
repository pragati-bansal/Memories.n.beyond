import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Layers } from 'lucide-react';
import { resolveProductImage, resolveProductImages } from '../lib/productImages';

export default function ProductCard({ product, onSelect }) {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  const images = resolveProductImages(product);
  const initialImage = resolveProductImage(product);
  const [currentImage, setCurrentImage] = useState(initialImage);
  const imageCount = images.length;

  const hasSizes = product.sizes && product.sizes.length > 0;
  const activeSize = hasSizes ? product.sizes[selectedSizeIndex] : null;
  const displayPrice = activeSize ? activeSize.price : product.price;

  const handleCardClick = () => {
    onSelect({
      ...product,
      images,
      imageUrl: currentImage,
      image_url: currentImage,
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
      className="group bg-paper rounded-xl sm:rounded-3xl overflow-hidden border border-burgundy/10 shadow-craft-soft hover:shadow-craft-modal cursor-pointer flex flex-col justify-between transition-all duration-300"
    >
      {/* Visual Thumbnail Area */}
      <div className="relative h-44 sm:h-64 bg-blush/30 flex items-center justify-center overflow-hidden p-2 sm:p-5">
        {/* Multi-Image Counter Badge */}
        {imageCount > 1 && (
          <div className="absolute top-2.5 right-2.5 z-10 bg-burgundy-deep/85 backdrop-blur-sm text-cream px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold flex items-center gap-1 shadow-craft-soft border border-cream/15">
            <Layers className="w-3 h-3 text-blush" />
            <span>
              {imageCount} {product.category === 'magazines' ? 'pages' : 'views'}
            </span>
          </div>
        )}

        {/* Craft Polaroid Mini Card Effect */}
        <div className="w-28 xs:w-32 sm:w-36 h-36 xs:h-38 sm:h-44 bg-paper rounded-none p-1.5 sm:p-2 pb-3.5 sm:pb-6 shadow-craft-soft border border-burgundy/10 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-1 flex flex-col">
          <div className="w-full flex-grow rounded-none overflow-hidden relative bg-blush/20 flex items-center justify-center">
            <img
              src={currentImage || product.image_url || product.image}
              alt={product.title ? `${product.title} - Handcrafted personalized memory gift` : 'Handcrafted personalized memory gift'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                // If remote or relative URL fails, immediately switch to authentic local asset fallback
                const fallback = resolveProductImage({ ...product, image_url: null, image: null, images: [] });
                if (fallback && currentImage !== fallback) {
                  setCurrentImage(fallback);
                }
              }}
            />
          </div>
        </div>

        {/* Hover Quick View Ribbon (Desktop) */}
        <div className="hidden sm:flex absolute inset-x-0 bottom-0 py-3 bg-gradient-to-t from-burgundy-deep/90 to-transparent text-cream items-center justify-center gap-1.5 text-xs font-bold tracking-wide transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-2.5 sm:p-5 sm:p-6 flex flex-col flex-grow justify-between">
        <div>
          <span className="text-[9px] sm:text-[11px] uppercase tracking-wider font-bold text-rose-deep block mb-0.5 sm:mb-1 truncate">
            {product.tag || 'Handmade Keepsake'}
          </span>
          <h3 className="font-serif text-xs sm:text-lg font-bold sm:font-medium text-burgundy-deep mb-1 sm:mb-2 line-clamp-2 break-words [overflow-wrap:anywhere] group-hover:text-rose-deep transition-colors">
            {product.title}
          </h3>
          <p className="text-[10px] sm:text-xs text-ink-soft line-clamp-1 sm:line-clamp-2 break-words mb-2 sm:mb-3 leading-snug sm:leading-relaxed">
            {product.description}
          </p>

          {/* Size & Variant Selector (if product has multiple sizes) */}
          {hasSizes && (
            <div className="mb-2 sm:mb-3.5" onClick={(e) => e.stopPropagation()}>
              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-ink-soft/80 block mb-1">
                Available in:
              </span>
              <div className="flex flex-wrap gap-1">
                {product.sizes.map((s, idx) => {
                  const isSelected = selectedSizeIndex === idx;
                  return (
                    <button
                      key={s.size}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`text-[8px] sm:text-[11px] px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-full border font-semibold transition-all ${
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
        <div className="pt-2 sm:pt-3 border-t border-burgundy/10 flex items-center justify-between gap-1 mt-auto">
          <div>
            <div className="text-[8px] sm:text-[11px] text-ink-soft leading-none mb-0.5">
              {activeSize ? activeSize.size : 'Starting'}
            </div>
            <div className="font-bold text-xs sm:text-lg md:text-xl text-burgundy">
              ₹{displayPrice}
            </div>
          </div>

          <button
            type="button"
            aria-label={`View details for ${product.title || 'this product'}`}
            className="text-[9px] sm:text-xs font-bold bg-burgundy/10 hover:bg-burgundy hover:text-cream text-burgundy px-2 sm:px-3.5 py-1 sm:py-2 rounded-full transition-all inline-flex items-center gap-0.5 sm:gap-1 whitespace-nowrap cursor-pointer"
          >
            <span>View Details</span>
            <span className="hidden sm:inline">&rarr;</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
