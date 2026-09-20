import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Heart, Truck, Gift, ChevronDown, CheckCircle2 } from 'lucide-react';
import heroGiftsPhoto from '../assets/hero-gifts-photo.jpg';

export default function HeroSection() {
  const [isUnwrapped, setIsUnwrapped] = useState(false);
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';

  return (
    <section id="home" className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blush/40 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 w-80 h-80 bg-blush-deep/30 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* ============================================================ */}
          {/* Left Column: Heading, Subtext, CTAs, & Stats (100% UNCHANGED) */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 xl:col-span-6 space-y-6"
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blush/60 border border-rose/20 text-rose-deep text-xs sm:text-sm font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-rose-deep" />
              <span>Where feelings find forms</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-burgundy-deep leading-[1.12] tracking-tight">
              gifts that feels made{' '}
              <span className="italic font-normal text-rose-deep">specifically</span> for that person
            </h1>

            {/* Lede paragraph */}
            <p className="text-base sm:text-lg text-ink-soft max-w-xl leading-relaxed">
              I help people turn memories into gifts their loved ones actually keep without spending hours searching for the perfect present
            </p>

            {/* Interactive "A Little Extra Love" Unwrap Card */}
            <div className="max-w-xl">
              <motion.div
                layout
                onClick={() => setIsUnwrapped(!isUnwrapped)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-rose/30 bg-gradient-to-r from-blush/65 via-[#FAF1EB] to-cream/90 p-3.5 sm:p-4 shadow-[0_4px_20px_-6px_rgba(110,31,43,0.1)] transition-all duration-300 hover:border-burgundy/40 hover:shadow-craft-soft"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-3.5">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: [0, -8, 8, -4, 0] }}
                      transition={{ duration: 0.4 }}
                      className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-burgundy to-burgundy-deep text-cream shadow-craft-sm"
                    >
                      <Gift className="h-5 w-5 text-cream" />
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-light opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-burgundy-light border-2 border-cream"></span>
                      </span>
                    </motion.div>

                    <div>
                      <div className="font-serif text-base sm:text-lg font-bold text-burgundy-deep tracking-tight leading-snug group-hover:text-burgundy transition-colors">
                        A Little Extra Love, At No Extra Cost.
                      </div>
                    </div>
                  </div>

                  {/* Interactive Toggle Badge */}
                  <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-cream border border-rose/25 text-xs font-bold text-burgundy shadow-xs group-hover:bg-burgundy group-hover:text-cream transition-all duration-300">
                    <span className="hidden sm:inline text-[11px] font-semibold">
                      {isUnwrapped ? 'Hide' : 'Tap to unwrap'}
                    </span>
                    <motion.div
                      animate={{ rotate: isUnwrapped ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </motion.div>
                  </div>
                </div>

                {/* Unwrapped Perks Tray (Animated Expand) */}
                <AnimatePresence>
                  {isUnwrapped && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden pt-3.5 mt-3.5 border-t border-burgundy/10"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-1">
                        {/* Perk 1 */}
                        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-paper/90 border border-rose/20 shadow-xs">
                          <div className="w-6 h-6 rounded-full bg-blush/80 flex items-center justify-center text-burgundy shrink-0">
                            <Sparkles className="w-3.5 h-3.5 text-burgundy" />
                          </div>
                          <div className="text-xs font-bold text-burgundy-deep flex items-center gap-1.5">
                            <span>Signature Wrapping</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-burgundy/10 text-burgundy font-bold rounded">₹0 FREE</span>
                          </div>
                        </div>

                        {/* Perk 2 */}
                        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-paper/90 border border-rose/20 shadow-xs">
                          <div className="w-6 h-6 rounded-full bg-blush/80 flex items-center justify-center text-burgundy shrink-0">
                            <Truck className="w-3.5 h-3.5 text-burgundy" />
                          </div>
                          <div className="text-xs font-bold text-burgundy-deep flex items-center gap-1.5">
                            <span>PAN India Delivery</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-burgundy/10 text-burgundy font-bold rounded">₹0 FREE</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-rose-deep font-semibold">
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-burgundy" /> Automatically applied to every order
                        </span>
                        <span className="text-burgundy font-bold italic">With love ♡</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#collection"
                className="bg-burgundy hover:bg-burgundy-deep text-cream px-8 py-4 rounded-full font-bold text-sm sm:text-base shadow-craft-soft hover:shadow-craft-lg hover:-translate-y-1 transition-all duration-300"
              >
                Explore Collection
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-bold text-sm sm:text-base border-2 border-burgundy/80 text-burgundy-deep hover:bg-burgundy hover:text-cream transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Trust Markers */}
            <div className="pt-8 border-t border-burgundy/10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
              <div className="flex items-center sm:block gap-3">
                <div className="w-9 h-9 rounded-full bg-blush/80 flex items-center justify-center text-burgundy mb-1 sm:mb-2 shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-serif text-2xl font-semibold text-burgundy-deep">1000+</div>
                  <div className="text-xs font-semibold text-ink-soft">Orders Delivered</div>
                </div>
              </div>

              <div className="flex items-center sm:block gap-3 sm:border-l sm:border-burgundy/10 sm:pl-5">
                <div className="w-9 h-9 rounded-full bg-blush/80 flex items-center justify-center text-burgundy mb-1 sm:mb-2 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-serif text-2xl font-semibold text-burgundy-deep">PAN India</div>
                  <div className="text-xs font-semibold text-ink-soft">Shipping to every pincode</div>
                </div>
              </div>

              <div className="flex items-center sm:block gap-3 sm:border-l sm:border-burgundy/10 sm:pl-5">
                <div className="w-9 h-9 rounded-full bg-blush/80 flex items-center justify-center text-burgundy mb-1 sm:mb-2 shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-serif text-2xl font-semibold text-burgundy-deep">100%</div>
                  <div className="text-xs font-semibold text-ink-soft">Handcrafted with Love</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ============================================================ */}
          {/* Right Column: Real Handcrafted Gifts Photo Merging with BG    */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center items-center py-2 lg:py-4 select-none">
            <div
              className="relative w-full max-w-[540px] sm:max-w-[620px] lg:max-w-[700px] aspect-square flex items-center justify-center"
            >
              {/* Soft Warm Ambient Glow Behind Photo */}
              <div
                className="absolute -inset-4 sm:-inset-8 rounded-full pointer-events-none -z-10 blur-3xl opacity-90"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, #F5EAE0 0%, #FAF4ED 60%, transparent 85%)',
                }}
              />

              {/* The Real Photo with Natural Edge Merging Feather Mask (Bottom-Left Box Solid & Crisp) */}
              <div
                className="relative w-full h-full flex items-center justify-center overflow-visible pointer-events-none"
                style={{
                  maskImage: 'radial-gradient(ellipse 80% 80% at 44% 50%, black 48%, rgba(0,0,0,0.95) 62%, rgba(0,0,0,0.4) 78%, transparent 90%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 44% 50%, black 48%, rgba(0,0,0,0.95) 62%, rgba(0,0,0,0.4) 78%, transparent 90%)',
                }}
              >
                <img
                  src={heroGiftsPhoto}
                  alt="Handcrafted gifts beautifully wrapped with dried flowers and custom seals - memories n beyond"
                  className="w-full h-full object-cover select-none"
                  loading="eager"
                />
              </div>

              {/* Floating Maroon Outline Hearts */}
              <div className="absolute top-5 left-[38%] pointer-events-none z-20 text-[#6E1F2B]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div className="absolute top-[48%] left-1 sm:left-2 pointer-events-none z-20 text-[#6E1F2B]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div className="absolute top-1/3 -right-2 sm:-right-1 pointer-events-none z-20 text-[#6E1F2B]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div className="absolute -bottom-1 left-[45%] pointer-events-none z-20 text-[#6E1F2B]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
