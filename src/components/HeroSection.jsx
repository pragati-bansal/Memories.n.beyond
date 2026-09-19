import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, MessageCircle, Heart, Truck, Gift } from 'lucide-react';

export default function HeroSection() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';
  const shouldReduceMotion = useReducedMotion();

  // Floating micro-animation
  const floatAnim = shouldReduceMotion
    ? {}
    : {
        y: [-5, 5, -5],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };

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
              gift that feels made{' '}
              <span className="italic font-normal text-rose-deep">specifically</span> for that person
            </h1>

            {/* Lede paragraph */}
            <p className="text-base sm:text-lg text-ink-soft max-w-xl leading-relaxed">
              I help people turn memories into gifts their loved ones actually keep without spending hours searching for the perfect present
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
          {/* Right Column: Handcrafted Gift Wrapping Composition (Mockup) */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center items-center py-4 lg:py-6 select-none">
            <motion.div
              animate={floatAnim}
              className="relative w-full max-w-[430px] sm:max-w-[490px] lg:max-w-[530px] aspect-[1/1.05] flex items-center justify-center"
            >
              {/* 1. Large Soft Warm Beige Organic Backdrop Blob */}
              <div
                className="absolute inset-2 sm:inset-3 rounded-[46%_54%_60%_40%_/_42%_50%_50%_58%] pointer-events-none -z-10 shadow-[0_20px_50px_-20px_rgba(74,20,29,0.08)]"
                style={{
                  background: 'radial-gradient(ellipse at 40% 35%, #FAF4ED 0%, #F5EAE0 55%, #EADBCC 100%)',
                }}
              />

              {/* 2. Delicate Botanical Dried Sprig with Berries (Far Right) */}
              <div className="absolute right-0 sm:-right-2 top-1/4 w-20 sm:w-28 h-56 sm:h-72 pointer-events-none z-0 opacity-80">
                <svg viewBox="0 0 100 240" fill="none" className="w-full h-full">
                  <path
                    d="M30 230 C45 170 55 110 65 30"
                    stroke="#C8B39B"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M48 150 C65 135 78 115 85 90"
                    stroke="#C8B39B"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M58 85 C75 70 85 55 88 35"
                    stroke="#C8B39B"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M40 185 C25 170 18 150 15 130"
                    stroke="#C8B39B"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  {/* Soft round beige/tan berries */}
                  <circle cx="65" cy="28" r="4.5" fill="#E4D3C0" stroke="#BCA78E" strokeWidth="1" />
                  <circle cx="85" cy="34" r="4" fill="#EBDDCF" stroke="#BCA78E" strokeWidth="1" />
                  <circle cx="86" cy="88" r="4.5" fill="#E4D3C0" stroke="#BCA78E" strokeWidth="1" />
                  <circle cx="72" cy="115" r="3.8" fill="#EFE5D9" stroke="#BCA78E" strokeWidth="1" />
                  <circle cx="15" cy="128" r="4" fill="#E4D3C0" stroke="#BCA78E" strokeWidth="1" />
                  <circle cx="26" cy="155" r="3.5" fill="#EFE5D9" stroke="#BCA78E" strokeWidth="1" />
                  <circle cx="56" cy="140" r="3.2" fill="#E4D3C0" stroke="#BCA78E" strokeWidth="1" />
                </svg>
              </div>

              {/* 3. Curved Maroon Line Arrow (Top Right) */}
              <div className="absolute top-2 sm:top-4 right-5 sm:right-9 w-20 sm:w-28 h-20 sm:h-28 pointer-events-none z-10">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <path
                    d="M15 80 C 25 35, 55 18, 88 12"
                    stroke="#6E1F2B"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M72 6 L 90 12 L 82 28"
                    stroke="#6E1F2B"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* 4. Tiny Floating Maroon Outline Hearts */}
              <div className="absolute top-6 left-[42%] pointer-events-none z-10 text-[#6E1F2B]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div className="absolute top-[42%] left-3 sm:left-5 pointer-events-none z-10 text-[#6E1F2B]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div className="absolute top-1/3 right-4 sm:right-6 pointer-events-none z-10 text-[#6E1F2B]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div className="absolute bottom-5 left-[48%] pointer-events-none z-10 text-[#6E1F2B]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>

              {/* ============================================================ */}
              {/* 5. The Top-Left Kraft Note: "You won't get this kind..."      */}
              {/* ============================================================ */}
              <div
                className="absolute top-6 sm:top-8 left-2 sm:left-5 z-20 w-40 sm:w-48 bg-[#F2E5D4] border border-[#DFCDBA] p-3 sm:p-4 -rotate-3 shadow-[0_8px_20px_-6px_rgba(74,20,29,0.18)]"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 2%, 98% 96%, 86% 100%, 72% 96%, 54% 100%, 38% 96%, 22% 100%, 0% 96%)',
                }}
              >
                {/* Washi tape on top */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-5 bg-[#E6D4BE]/90 -rotate-1 border-t border-b border-[#D4BFAB] shadow-sm pointer-events-none"
                  style={{ clipPath: 'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)' }}
                />
                <p className="font-handwriting text-base sm:text-[20px] text-[#6E1F2B] font-bold leading-[1.25] text-center pt-1">
                  You won't<br />
                  get this kind<br />
                  of wrapping<br />
                  anywhere<br />
                  else.
                </p>
              </div>

              {/* ============================================================ */}
              {/* 6. The Big Pink Origami Wrapped Gift (Top Right)              */}
              {/* ============================================================ */}
              <div
                className="absolute top-10 sm:top-12 right-6 sm:right-8 w-52 sm:w-64 h-72 sm:h-88 z-10 rotate-3 transition-transform duration-300 hover:scale-102"
                style={{ filter: 'drop-shadow(0 20px 30px rgba(74, 20, 29, 0.22))' }}
              >
                {/* Main Pink Wrapped Base */}
                <div className="relative w-full h-full bg-[#F6D0D6] rounded-sm overflow-hidden border border-[#EAAFB9]">
                  
                  {/* Rose floral spots pattern */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-4 -left-4 w-32 h-32 rounded-full bg-[#E56A86]/70 blur-[0.5px]" />
                    <div className="absolute top-8 -right-6 w-36 h-36 rounded-full bg-[#E56A86]/65 blur-[0.5px]" />
                    <div className="absolute top-44 -left-6 w-40 h-40 rounded-full bg-[#DE5373]/80 blur-[0.5px]" />
                    <div className="absolute bottom-4 right-1 w-36 h-36 rounded-full bg-[#E56A86]/75 blur-[0.5px]" />
                  </div>

                  {/* Envelope Origami Diagonal Folds */}
                  <svg viewBox="0 0 200 280" className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Top triangular fold flap */}
                    <path
                      d="M0 0 L100 85 L200 0 Z"
                      fill="#FCE5E9"
                      fillOpacity="0.85"
                      stroke="#E5ACB6"
                      strokeWidth="1.2"
                    />
                    {/* Left diagonal fold crease */}
                    <line x1="0" y1="280" x2="100" y2="85" stroke="#DDA0AC" strokeWidth="1.2" />
                    {/* Right diagonal fold crease */}
                    <line x1="200" y1="280" x2="100" y2="85" stroke="#DDA0AC" strokeWidth="1.2" />
                    
                    {/* Vertical twine string */}
                    <line x1="100" y1="85" x2="100" y2="280" stroke="#B89B7A" strokeWidth="2" strokeDasharray="6 2" />
                    {/* Horizontal twine string */}
                    <line x1="0" y1="165" x2="200" y2="165" stroke="#B89B7A" strokeWidth="2" strokeDasharray="6 2" />
                  </svg>

                  {/* "thank you" small white note tucked in top flap */}
                  <div className="absolute top-6 sm:top-8 left-6 sm:left-8 z-20 bg-paper px-2.5 sm:px-3 py-1 -rotate-6 shadow-sm border border-[#EAD8CE]">
                    <span className="font-handwriting text-xs sm:text-sm text-[#4E6282] font-bold block leading-tight">
                      thank you
                    </span>
                  </div>

                  {/* "happy birthday" label pinned across the twine (left of MB seal) */}
                  <div className="absolute top-[152px] sm:top-[188px] -translate-y-1/2 left-2 sm:left-3 z-30 bg-paper px-2.5 sm:px-3 py-1 -rotate-2 shadow-sm border border-[#EAD8CE]">
                    <span className="font-handwriting text-xs sm:text-[15px] text-[#4A141D] font-bold block leading-tight whitespace-nowrap">
                      happy birthday
                    </span>
                  </div>

                  {/* Golden Embossed MB Circular Wax Seal in Center */}
                  <div className="absolute top-[152px] sm:top-[188px] left-[55%] -translate-x-1/2 -translate-y-1/2 z-40 w-11 sm:w-13 h-11 sm:h-13 rounded-full bg-gradient-to-br from-[#E8C88B] via-[#C8A261] to-[#9C7332] shadow-[0_4px_12px_rgba(0,0,0,0.25)] flex items-center justify-center border border-[#FFE7B8]">
                    <span className="font-serif font-bold text-xs sm:text-sm text-[#4A141D] tracking-wider drop-shadow-sm">
                      MB
                    </span>
                  </div>

                </div>
              </div>

              {/* ============================================================ */}
              {/* 7. The Black Luxury Gift Box (Foreground Left Overlapping)    */}
              {/* ============================================================ */}
              <div
                className="absolute top-[165px] sm:top-[200px] left-[15%] sm:left-[17%] w-44 sm:w-54 h-56 sm:h-68 z-30 -rotate-6 transition-transform duration-300 hover:scale-103"
                style={{ filter: 'drop-shadow(0 22px 35px rgba(0, 0, 0, 0.35))' }}
              >
                <div className="relative w-full h-full bg-[#1A1816] rounded-sm overflow-hidden border border-[#2E2924] p-3 sm:p-4">
                  
                  {/* Diagonal Gold Ribbon Corner */}
                  <div
                    className="absolute top-0 left-0 w-32 sm:w-40 h-32 sm:h-40 pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, transparent 40%, #B89047 41%, #DFC07D 50%, #C8A261 58%, transparent 59%)',
                    }}
                  />

                  {/* "thank you" small white note tucked in top */}
                  <div className="absolute top-2.5 left-7 z-20 bg-paper px-2.5 sm:px-3 py-1 rotate-2 shadow-sm border border-[#EAD8CE]">
                    <span className="font-handwriting text-xs sm:text-sm text-[#4E6282] font-bold block leading-tight">
                      thank you
                    </span>
                  </div>

                  {/* Gold Line Hearts scattered on black box */}
                  <div className="absolute top-12 right-4 text-[#D4AF37]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <div className="absolute top-24 right-8 text-[#D4AF37]">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-16 left-6 text-[#D4AF37]">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-14 right-5 text-[#D4AF37]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-5 left-9 text-[#D4AF37]">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>

                  {/* Golden MB Emblem on Black Box */}
                  <div className="absolute top-20 left-4 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-br from-[#F5D89F] via-[#D4AF37] to-[#A87E22] shadow-[0_3px_8px_rgba(0,0,0,0.4)] flex items-center justify-center border border-[#FFE7B8]">
                    <span className="font-serif font-bold text-xs sm:text-sm text-[#2A1D0D] tracking-wider">
                      MB
                    </span>
                  </div>

                </div>
              </div>

              {/* ============================================================ */}
              {/* 8. Small Pink Box (Bottom Right Behind Note)                  */}
              {/* ============================================================ */}
              <div
                className="absolute bottom-8 sm:bottom-10 right-10 sm:right-14 w-28 sm:w-36 h-28 sm:h-36 bg-[#F6D0D6] z-15 rounded-sm border border-[#EAAFB9] shadow-md overflow-hidden"
              >
                {/* Petal spots */}
                <div className="absolute -top-2 -left-2 w-20 h-20 rounded-full bg-[#E56A86]/70" />
                <div className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full bg-[#E56A86]/70" />
                {/* Twine lines */}
                <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-[#B89B7A]" />
                <div className="absolute top-0 bottom-0 left-1/2 w-[1.5px] bg-[#B89B7A]" />
              </div>

              {/* ============================================================ */}
              {/* 9. The Bottom-Right Torn Kraft Note with Paperclip            */}
              {/* ============================================================ */}
              <div
                className="absolute -bottom-2 sm:bottom-1 right-2 sm:right-5 z-40 w-40 sm:w-50 bg-[#F5ECE0] border border-[#E2D2BE] p-3 sm:p-4 rotate-2 shadow-[0_12px_24px_-6px_rgba(74,20,29,0.22)]"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 2%, 96% 96%, 84% 100%, 70% 96%, 52% 100%, 34% 96%, 18% 100%, 0% 97%)',
                }}
              >
                {/* Gold wire paperclip */}
                <div className="absolute -top-3.5 right-4 z-50">
                  <svg width="18" height="34" viewBox="0 0 18 34" fill="none">
                    <path
                      d="M5 10V24C5 27.3137 7.68629 30 11 30C14.3137 30 17 27.3137 17 24V7C17 3.68629 14.3137 1 11 1C7.68629 1 5 3.68629 5 7V22C5 23.6569 6.34315 25 8 25C9.65685 25 11 23.6569 11 22V8"
                      stroke="#C8A261"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <p className="font-handwriting text-base sm:text-[21px] text-[#6E1F2B] font-bold leading-[1.2] text-center pt-1">
                  Memories<br />
                  today.<br />
                  Treasures<br />
                  forever.
                </p>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
