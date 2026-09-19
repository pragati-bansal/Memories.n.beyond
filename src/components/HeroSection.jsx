import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Heart, Truck, Gift } from 'lucide-react';

export default function HeroSection() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';

  return (
    <section id="home" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blush/60 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 w-80 h-80 bg-blush-deep/40 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blush/60 border border-rose/20 text-rose-deep text-xs sm:text-sm font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-rose-deep" />
              <span>Where feelings find forms</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-burgundy-deep leading-[1.12] tracking-tight">
              Turning Your Precious Moments Into{' '}
              <span className="italic font-normal text-rose-deep">Timeless</span> Keepsakes.
            </h1>

            {/* Lede paragraph */}
            <p className="text-base sm:text-lg text-ink-soft max-w-xl leading-relaxed">
              Send us your favourite photographs and a few words, and we'll turn them into a
              frame, a bouquet, or a keepsake box that's made to be kept — not scrolled past.
            </p>

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
                  <div className="font-serif text-2xl font-semibold text-burgundy-deep">100+</div>
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

          {/* Right Column: Polaroid Visual Stack */}
          <div className="lg:col-span-5 flex justify-center items-center py-6">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] h-[400px] sm:h-[440px]">
              {/* Twine decoration */}
              <div className="absolute top-8 -left-4 w-[112%] h-[2px] bg-gradient-to-r from-transparent via-rose-deep/40 to-transparent rotate-[-2deg] z-20 pointer-events-none" />

              {/* Polaroid 2: Right tilt */}
              <motion.div
                initial={{ opacity: 0, rotate: 0, scale: 0.9 }}
                animate={{ opacity: 1, rotate: 8, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                whileHover={{ rotate: 11, scale: 1.04, zIndex: 25 }}
                className="absolute top-12 right-0 w-52 sm:w-56 bg-paper p-3 pb-8 rounded-lg shadow-craft-lg border border-burgundy/10 cursor-pointer"
              >
                <div className="w-full h-36 rounded-sm overflow-hidden bg-gradient-to-tr from-[#F0D6C8] via-[#D9A5A0] to-[#8E4147]">
                  <img
                    src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop&q=80"
                    alt="Couple frame keepsake"
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="font-serif italic text-xs text-ink-soft text-center mt-3 font-medium">
                  forever &amp; always
                </div>
              </motion.div>

              {/* Polaroid 3: Bottom tilt */}
              <motion.div
                initial={{ opacity: 0, rotate: 0, scale: 0.9 }}
                animate={{ opacity: 1, rotate: 3, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                whileHover={{ rotate: 0, scale: 1.04, zIndex: 25 }}
                className="absolute bottom-2 left-10 w-48 sm:w-52 bg-paper p-3 pb-8 rounded-lg shadow-craft-soft border border-burgundy/10 cursor-pointer"
              >
                <div className="w-full h-32 rounded-sm overflow-hidden bg-gradient-to-tr from-[#F3E2D4] via-[#CE9A96] to-[#6E1F2B]">
                  <img
                    src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&auto=format&fit=crop&q=80"
                    alt="Polaroid bouquet"
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="font-serif italic text-xs text-ink-soft text-center mt-3 font-medium">
                  our little world
                </div>
              </motion.div>

              {/* Polaroid 1: Main front left tilt */}
              <motion.div
                initial={{ opacity: 0, rotate: 0, scale: 0.9 }}
                animate={{ opacity: 1, rotate: -8, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                whileHover={{ rotate: -5, scale: 1.05, zIndex: 30 }}
                className="absolute top-2 left-2 w-56 sm:w-60 bg-paper p-3.5 pb-9 rounded-lg shadow-craft-modal border border-burgundy/15 z-10 cursor-pointer"
              >
                <div className="w-full h-40 rounded-sm overflow-hidden bg-gradient-to-tr from-[#E8B8AE] via-[#C98D89] to-[#8A4A47]">
                  <img
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80"
                    alt="Moonlight Memory Frame"
                    className="w-full h-full object-cover opacity-95 hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="font-serif italic text-sm text-ink-soft text-center mt-3 font-medium">
                  that summer, us ♡
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
