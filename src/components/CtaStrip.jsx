import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';

export default function CtaStrip() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';
  const customOrderUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi Memories n Beyond, I have a bespoke gift idea and would like to discuss a custom order."
  )}`;

  return (
    <section className="pb-20 sm:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl sm:rounded-4xl p-8 sm:p-14 bg-gradient-to-br from-burgundy-deep via-burgundy to-[#881337] text-cream shadow-craft-modal overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Decorative floral/sparkle glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream/10 text-blush-100 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Gifting Service</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium mb-3">
              Have something specific in mind?
            </h2>
            <p className="text-sm sm:text-base text-cream/85 leading-relaxed">
              Tell us your story, the person, and the occasion — we'll turn it into a
              one-of-a-kind handcrafted piece that will be cherished forever.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <a
              href={customOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-cream hover:bg-white text-burgundy-deep px-8 py-4 rounded-full font-bold text-sm sm:text-base shadow-lg hover:scale-105 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 text-burgundy" />
              <span>Start a Custom Order</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
