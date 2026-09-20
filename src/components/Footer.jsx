import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Heart,
  X,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Package,
} from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Footer() {
  const [activePolicy, setActivePolicy] = useState(null); // 'about' | 'cancellation' | 'shipping' | null
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919368606771';

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActivePolicy(null);
    };
    if (activePolicy) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activePolicy]);

  return (
    <footer id="contact" className="bg-burgundy text-cream/90 pt-16 pb-12 border-t border-cream/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-cream/10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="memories n beyond"
                className="w-12 h-12 rounded-full object-cover shadow-sm border border-cream/20"
              />
              <div className="flex flex-col justify-center">
                <span className="font-script text-2xl sm:text-[32px] text-cream block leading-none pt-1">
                  memories n beyond
                </span>
                <span className="font-sans text-xs tracking-wide text-blush block font-medium mt-2 sm:mt-2.5">
                  Where feelings find forms
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-cream/70 leading-relaxed max-w-sm">
              Handmade, personalized keepsakes crafted from your photographs — made in small
              batches with love, safely delivered across India.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/memories.n.beyond/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center text-cream/80 hover:text-cream hover:bg-cream/10 hover:border-cream/40 transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center text-cream/80 hover:text-cream hover:bg-cream/10 hover:border-cream/40 transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-base font-semibold text-cream">Collection</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#category/frames" className="hover:text-cream transition-colors">
                  Custom Photo Frames
                </a>
              </li>
              <li>
                <a href="#category/magazines" className="hover:text-cream transition-colors">
                  Personalized Magazines
                </a>
              </li>
              <li>
                <a href="#category/hampers" className="hover:text-cream transition-colors">
                  Luxury Gift Hampers
                </a>
              </li>
              <li>
                <a href="#category/addons" className="hover:text-cream transition-colors">
                  Handmade Add-ons &amp; Bouquets
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-base font-semibold text-cream">Support</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('about')}
                  className="hover:text-cream text-left transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('cancellation')}
                  className="hover:text-cream text-left transition-colors cursor-pointer"
                >
                  Cancellation Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('shipping')}
                  className="hover:text-cream text-left transition-colors cursor-pointer"
                >
                  Shipping &amp; Return Policy
                </button>
              </li>
              <li>
                <a href="#custom" className="hover:text-cream transition-colors block">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-cream transition-colors block">
                  Reviews &amp; Trust
                </a>
              </li>
            </ul>
          </div>

          {/* Reach Us Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-base font-semibold text-cream">Reach Us</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-cream/75">
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-blush shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <a
                  href="https://www.instagram.com/memories.n.beyond/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream transition-colors"
                >
                  @memories.n.beyond
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blush shrink-0" />
                <a
                  href="mailto:memoriesnbeyond.mnb@gmail.com"
                  className="hover:text-cream transition-colors"
                >
                  memoriesnbeyond.mnb@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blush shrink-0" />
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream transition-colors"
                >
                  +91 93686 06771
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blush shrink-0" />
                <span>Meerut, UP, India - 250001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/50">
          <div>© 2026 Memories n Beyond. All rights reserved.</div>
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => setActivePolicy('about')}
              className="hover:text-cream transition-colors cursor-pointer"
            >
              About Us
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActivePolicy('cancellation')}
              className="hover:text-cream transition-colors cursor-pointer"
            >
              Cancellation
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActivePolicy('shipping')}
              className="hover:text-cream transition-colors cursor-pointer"
            >
              Shipping &amp; Return Policy
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Policy & About Us Modal */}
      <AnimatePresence>
        {activePolicy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0"
              onClick={() => setActivePolicy(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-paper text-ink rounded-3xl shadow-craft-modal border border-burgundy/15 overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-burgundy/10 bg-cream/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blush/60 flex items-center justify-center text-burgundy">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-burgundy-deep">
                      Memories n Beyond
                    </h3>
                    <p className="text-[11px] text-ink-soft">Transparency &amp; Handcrafted Trust</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePolicy(null)}
                  className="w-8 h-8 rounded-full bg-cream hover:bg-blush/80 flex items-center justify-center text-ink-soft hover:text-burgundy transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center gap-1.5 px-6 pt-4 pb-2 bg-cream/30 border-b border-burgundy/5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActivePolicy('about')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activePolicy === 'about'
                      ? 'bg-burgundy text-cream shadow-sm'
                      : 'bg-white text-ink-soft hover:text-burgundy hover:bg-blush/30'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  About Us
                </button>
                <button
                  type="button"
                  onClick={() => setActivePolicy('cancellation')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activePolicy === 'cancellation'
                      ? 'bg-burgundy text-cream shadow-sm'
                      : 'bg-white text-ink-soft hover:text-burgundy hover:bg-blush/30'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Cancellation Policy
                </button>
                <button
                  type="button"
                  onClick={() => setActivePolicy('shipping')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activePolicy === 'shipping'
                      ? 'bg-burgundy text-cream shadow-sm'
                      : 'bg-white text-ink-soft hover:text-burgundy hover:bg-blush/30'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  Shipping &amp; Return Policy
                </button>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 overflow-y-auto space-y-6 text-sm text-ink-soft leading-relaxed custom-scrollbar">
                {/* ABOUT US TAB */}
                {activePolicy === 'about' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="bg-blush/30 p-4 rounded-2xl border border-blush">
                      <h4 className="font-serif text-lg font-bold text-burgundy-deep mb-1">
                        Where feelings find forms.
                      </h4>
                      <p className="text-xs text-ink-soft">
                        We transform your everyday photos and quiet love stories into timeless keepsakes that are treasured forever.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-serif text-sm font-bold text-ink flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-burgundy" />
                        Our Story &amp; Philosophy
                      </h5>
                      <p className="text-xs leading-relaxed">
                        At <strong>Memories n Beyond</strong>, we believe the most meaningful gifts aren't picked from mass-produced store shelves. They are born from late-night laughter, unhurried journeys, shared anniversaries, and honest affection.
                      </p>
                      <p className="text-xs leading-relaxed">
                        Every frame, personalized editorial magazine, and celebration hamper is curated, printed on archival photo paper, and hand-bound with meticulous care in small artisan batches.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3.5 rounded-xl bg-cream border border-burgundy/10">
                        <div className="font-semibold text-xs text-burgundy-deep mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-burgundy" /> 1-on-1 WhatsApp Touch
                        </div>
                        <p className="text-[11px] text-ink-soft">
                          Speak directly with the designer behind your order. We share digital previews before printing so everything is perfect.
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-cream border border-burgundy/10">
                        <div className="font-semibold text-xs text-burgundy-deep mb-1 flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-burgundy" /> Free Signature Packaging
                        </div>
                        <p className="text-[11px] text-ink-soft">
                          Delivered gift-ready with real wax seals, satin ribbons, dried flora, and handwritten personal notes at no extra charge.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* CANCELLATION POLICY TAB */}
                {activePolicy === 'cancellation' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="bg-blush/30 p-4 rounded-2xl border border-blush">
                      <h4 className="font-serif text-lg font-bold text-burgundy-deep mb-1">
                        Cancellation &amp; Modification Policy
                      </h4>
                      <p className="text-xs text-ink-soft">
                        Fair, straightforward guidelines for personalized, custom-crafted items.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-cream border border-burgundy/10 space-y-1.5">
                        <div className="font-semibold text-xs text-burgundy-deep flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-burgundy" />
                          12-Hour Modification &amp; Cancellation Window
                        </div>
                        <p className="text-xs">
                          Because all keepsakes are custom designed with your personal photographs, orders can be cancelled or edited (photos, text, dates) within <strong>12 hours</strong> of placing your order.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-cream border border-burgundy/10 space-y-1.5">
                        <div className="font-semibold text-xs text-burgundy-deep flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-burgundy" />
                          Before Production (100% Refund)
                        </div>
                        <p className="text-xs">
                          If you cancel before custom layout designing and photo printing has begun, you will receive a <strong>100% full refund</strong> immediately via UPI / original payment method.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-cream border border-burgundy/10 space-y-1.5">
                        <div className="font-semibold text-xs text-burgundy-deep flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-burgundy" />
                          After Crafting Has Begun
                        </div>
                        <p className="text-xs">
                          Once printing, photo cutting, or wood framing is underway, cancellations cannot be processed since custom personalized materials cannot be reused. However, we are always happy to help you adjust captions or delivery address via WhatsApp.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SHIPPING & RETURN POLICY TAB */}
                {activePolicy === 'shipping' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="bg-blush/30 p-4 rounded-2xl border border-blush">
                      <h4 className="font-serif text-lg font-bold text-burgundy-deep mb-1">
                        Shipping &amp; Return Policy
                      </h4>
                      <p className="text-xs text-ink-soft">
                        PAN-India safe transit guarantee &amp; free damage replacement.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-cream border border-burgundy/10 space-y-1.5">
                        <div className="font-semibold text-xs text-burgundy-deep flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-burgundy" />
                          Delivery Timelines (All Over India)
                        </div>
                        <ul className="text-xs space-y-1 list-disc list-inside text-ink-soft">
                          <li><strong>Crafting Time:</strong> 2 to 3 business days for printing &amp; finishing.</li>
                          <li><strong>Shipping Transit:</strong> 4 to 7 business days via Bluedart, Delhivery &amp; DTDC.</li>
                          <li><strong>Urgent Orders:</strong> Need it urgently for an anniversary or birthday? WhatsApp us for expedited priority dispatch.</li>
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-cream border border-burgundy/10 space-y-1.5">
                        <div className="font-semibold text-xs text-burgundy-deep flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-burgundy" />
                          Zero-Breakage Packaging Guarantee
                        </div>
                        <p className="text-xs">
                          All fragile glass frames, magazine booklets, and hampers are wrapped in multiple layers of shock-absorbent bubble wrap, corner protectors, and heavy-duty corrugated outer boxes to ensure they arrive in pristine condition.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-cream border border-burgundy/10 space-y-1.5">
                        <div className="font-semibold text-xs text-burgundy-deep flex items-center gap-1.5">
                          <RotateCcw className="w-3.5 h-3.5 text-burgundy" />
                          100% Free Replacement in Case of Transit Damage
                        </div>
                        <p className="text-xs">
                          Since personalized products are custom printed with your photos, general returns for change of mind are not accepted. However, if your package arrives broken or damaged during transit:
                        </p>
                        <p className="text-xs font-medium text-burgundy pt-1">
                          👉 Record a continuous parcel unboxing video and message us on WhatsApp within 48 hours of delivery. We will immediately craft &amp; ship a brand-new replacement at zero extra cost.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer with Direct WhatsApp Contact */}
              <div className="px-6 py-4 border-t border-burgundy/10 bg-cream/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-ink-soft text-center sm:text-left">
                  Have a specific question about your order?
                </p>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    'Hi Memories n Beyond, I have a question regarding policies / custom order.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-semibold shadow-sm transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
