import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Truck,
  Gift,
  Tag,
  Zap,
  ShieldCheck,
  ArrowRight,
  Palette,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';

export default function ProductModal({ product, onClose, onOpenCancellationPolicy }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const thumbnailContainerRef = useRef(null);

  // Selected size & dynamic price
  const [selectedSize, setSelectedSize] = useState(
    product?.selectedSize || (product?.sizes && product?.sizes.length > 0 ? product.sizes[0] : null)
  );

  // Update selected size when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(
        product.selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : null)
      );
      setActiveImageIndex(0);
    }
  }, [product]);

  const rawImages =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images.filter(Boolean)
      : product?.imageUrl || product?.image_url
      ? [product.imageUrl || product.image_url]
      : ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'];

  const images = rawImages.length > 0 ? rawImages : ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'];
  const isMagazine = product?.category === 'magazines';

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation for arrow keys and escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        handlePrevImage();
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        handleNextImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, images.length]);

  // Auto scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const activeEl = thumbnailContainerRef.current.querySelector(`[data-thumb-idx="${activeImageIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeImageIndex]);

  const currentPrice = selectedSize ? selectedSize.price : product?.price;
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919368606771';

  if (!product) return null;

  // Direct WhatsApp Inquiry / Order Action
  const handleProceedToWhatsApp = () => {
    const sizeInfo = selectedSize ? ` (${selectedSize.label || selectedSize.size})` : '';
    const messageLines = [
      `🌸 *PRODUCT INQUIRY — Memories n Beyond* 🌸`,
      `*Product:* ${product.title}`,
      `*Selected Option / Size:* ${selectedSize ? (selectedSize.label || selectedSize.size) : 'Standard'}`,
      `*Price:* ₹${currentPrice}`,
      ``,
      `Hi! I saw this in your catalogue and would love to know more / place an order with personalization. Please guide me with the details!`,
    ];

    const messageText = messageLines.join('\n');
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop blur overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-burgundy-deep/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative bg-paper rounded-3xl shadow-craft-modal border border-burgundy/15 max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col z-10 my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-cream/90 hover:bg-cream text-burgundy-deep flex items-center justify-center shadow-craft-soft transition-all hover:scale-110 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Content Grid */}
          <div className="overflow-y-auto grid grid-cols-1 md:grid-cols-12 flex-grow">
            {/* Left Column: Visual Gallery & Details */}
            <div className="md:col-span-5 bg-gradient-to-br from-blush via-blush-deep/50 to-cream p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-burgundy/10">
              <div className="space-y-4">
                {/* Main Image Frame Preview with Carousel Controls */}
                <div className="w-full aspect-[4/5] bg-paper rounded-2xl p-3 shadow-craft-lg border border-burgundy/10 overflow-hidden flex items-center justify-center relative group">
                  <div
                    className="w-full h-full rounded-xl overflow-hidden relative flex items-center justify-center"
                    style={{ background: product.gradient || '#F6DEDA' }}
                  >
                    <img
                      key={activeImageIndex}
                      src={images[activeImageIndex] || images[0]}
                      alt={`${product.title} - ${isMagazine ? `Page ${activeImageIndex + 1}` : `Preview ${activeImageIndex + 1}`}`}
                      className="w-full h-full object-cover transition-all duration-300"
                    />

                    {/* Badge Counter */}
                    {images.length > 1 && (
                      <div className="absolute top-3 left-3 bg-burgundy-deep/85 backdrop-blur-md text-cream text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-cream/20 pointer-events-none">
                        <Layers className="w-3 h-3 text-blush" />
                        <span>
                          {isMagazine
                            ? `Page ${activeImageIndex + 1} of ${images.length}`
                            : `${activeImageIndex + 1} / ${images.length}`}
                        </span>
                      </div>
                    )}

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-paper/90 hover:bg-paper text-burgundy-deep shadow-craft-soft flex items-center justify-center transition-all hover:scale-110 opacity-80 group-hover:opacity-100 cursor-pointer"
                          aria-label="Previous Image"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-paper/90 hover:bg-paper text-burgundy-deep shadow-craft-soft flex items-center justify-center transition-all hover:scale-110 opacity-80 group-hover:opacity-100 cursor-pointer"
                          aria-label="Next Image"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Interactive Thumbnails Strip Slider */}
                {images.length > 1 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-ink-soft px-0.5">
                      <span className="font-bold text-burgundy flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {isMagazine ? 'Browse All Magazine Pages' : 'Browse All Photo Previews'}
                      </span>
                      <span className="text-[10px] text-ink-soft">
                        {images.length} {isMagazine ? 'pages total' : 'views'}
                      </span>
                    </div>

                    <div
                      ref={thumbnailContainerRef}
                      className="flex gap-2 overflow-x-auto py-1 px-0.5 scrollbar-thin scrollbar-thumb-burgundy/20"
                    >
                      {images.map((img, idx) => {
                        const isActive = activeImageIndex === idx;
                        return (
                          <button
                            key={idx}
                            data-thumb-idx={idx}
                            type="button"
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative w-14 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer flex flex-col items-center justify-center bg-paper ${
                              isActive
                                ? 'border-burgundy ring-2 ring-burgundy/30 scale-105 shadow-craft-sm'
                                : 'border-burgundy/15 opacity-70 hover:opacity-100 hover:border-burgundy/40'
                            }`}
                          >
                            <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                            <span
                              className={`absolute bottom-0 inset-x-0 text-[8px] font-bold py-0.5 text-center truncate ${
                                isActive ? 'bg-burgundy text-cream' : 'bg-burgundy-deep/75 text-cream'
                              }`}
                            >
                              {idx === 0 ? 'Cover' : isMagazine ? `P${idx + 1}` : `#${idx + 1}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Delivery & Shipping Info */}
                <div className="pt-3 border-t border-burgundy/15 space-y-2.5">
                  {/* Shipping & Delivery OR Add-On Exclusive Notice */}
                  {product.category === 'addons' ? (
                    <div className="bg-paper/95 rounded-2xl p-3.5 border-2 border-dashed border-burgundy/30 shadow-xs space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-burgundy flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-burgundy shrink-0" />
                        <span>Add-On Exclusive Keepsake</span>
                      </div>
                      <div className="space-y-1 text-xs text-burgundy-deep">
                        <p className="font-semibold text-burgundy leading-snug">
                          This add-on item can only be ordered when paired with a main product (Frame, Hamper, or Magazine).
                        </p>
                        <p className="text-[11px] text-ink-soft leading-snug">
                          It is not available for standalone purchase.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-paper/95 rounded-2xl p-3 border border-burgundy/10 shadow-xs space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-rose-deep flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-burgundy" />
                        <span>Shipping &amp; Delivery</span>
                      </div>

                      <div className="space-y-1.5 text-xs text-burgundy-deep">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                          <span className="font-semibold text-emerald-800">Free shipping</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-deep shrink-0" />
                          <span>Delivery within 10-14 days</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-burgundy shrink-0" />
                          <span>Delivery within Meerut : <strong>5 days</strong></span>
                        </div>

                        <div className="flex items-start gap-2 pt-0.5">
                          <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <div className="text-[11px] text-ink leading-snug">
                            <span className="font-bold text-burgundy">Next day delivery : 200/- extra</span>
                            <span className="text-ink-soft block text-[10px]">(Applicable on Meerut residents only)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Perks & Referral Rewards */}
                  <div className="bg-paper/95 rounded-2xl p-3 border border-burgundy/10 shadow-xs space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-rose-deep flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-burgundy" />
                      <span>Order Perks &amp; Rewards</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-burgundy-deep">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-burgundy-deep">Free gift wrapping</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Unlock your own referral code</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-rose-deep shrink-0" />
                        <span>Get exclusive offers for your next purchase</span>
                      </div>
                    </div>
                  </div>

                  {/* Return and Cancellation Policy Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenCancellationPolicy) {
                        onOpenCancellationPolicy();
                      } else {
                        window.location.hash = '#policy/cancellation';
                      }
                    }}
                    className="w-full bg-cream hover:bg-paper border border-burgundy/20 hover:border-burgundy/40 text-burgundy-deep p-3 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-between group cursor-pointer hover:shadow-craft-soft"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-burgundy group-hover:scale-110 transition-transform" />
                      <span>Return and Cancellation Policy</span>
                    </div>
                    <span className="text-[11px] text-rose-deep group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>View Policy</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Catalogue Product Details & Direct WhatsApp Inquire */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-5">
                {/* Header info */}
                <div>
                  <span className="text-xs font-bold text-rose-deep uppercase tracking-wider block mb-1">
                    {product.tag || 'Personalized Gift'}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-burgundy-deep mb-2">
                    {product.title}
                  </h2>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-burgundy">
                      ₹{currentPrice}
                    </span>
                  </div>
                  {product.description && (
                    <p className="text-sm text-ink-soft leading-relaxed">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Size / Variant Options Picker */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="bg-blush/30 p-4 rounded-2xl border border-burgundy/10">
                    <span className="block text-xs font-bold text-burgundy-deep uppercase tracking-wider mb-2.5">
                      Choose Size / Format:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {product.sizes.map((s) => {
                        const isSelected = selectedSize?.size === s.size;
                        return (
                          <button
                            key={s.size}
                            type="button"
                            onClick={() => setSelectedSize(s)}
                            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-burgundy text-cream border-burgundy shadow-sm ring-2 ring-burgundy/20'
                                : 'bg-paper text-ink-soft border-burgundy/15 hover:border-rose/50 hover:bg-cream'
                            }`}
                          >
                            <span className="text-xs font-semibold">{s.label || s.size}</span>
                            <span className={`text-xs font-bold ${isSelected ? 'text-cream' : 'text-burgundy'}`}>
                              ₹{s.price}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Customization Details Callout */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blush/50 via-blush/30 to-cream border border-burgundy/15 flex items-start gap-3 text-xs text-burgundy-deep shadow-xs">
                  <Palette className="w-5 h-5 text-burgundy shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-burgundy mb-0.5">100% Customisable on WhatsApp</span>
                    <span className="text-ink-soft leading-relaxed">
                      You can customise photos, names, dates, quotes, and colours for this template directly with us over WhatsApp.
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA Section */}
              <div className="pt-6 mt-4 border-t border-burgundy/10">
                <button
                  type="button"
                  onClick={handleProceedToWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-4 px-6 rounded-2xl font-bold text-sm sm:text-base shadow-craft-soft hover:shadow-craft-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Order &amp; Inquire on WhatsApp</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </button>
                <p className="text-[11px] text-center text-ink-soft mt-2.5">
                  Tap to chat directly on WhatsApp to personalize &amp; place your order.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
