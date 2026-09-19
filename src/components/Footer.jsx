import React from 'react';
import { MessageCircle, Mail, Phone, MapPin, Heart } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Footer() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';

  return (
    <footer id="contact" className="bg-burgundy-deep text-cream/80 pt-16 pb-12 border-t border-burgundy/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-cream/10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="Memories n Beyond"
                className="w-11 h-11 rounded-xl object-cover shadow-sm border border-cream/20"
              />
              <div>
                <span className="font-serif text-2xl font-medium text-cream block leading-tight">
                  Memories n Beyond
                </span>
                <span className="font-sans text-xs tracking-wide text-blush block font-medium">
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
                href="https://instagram.com/memories.n.beyond"
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
                <a href="#collection" className="hover:text-cream transition-colors">
                  Custom Photo Frames
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-cream transition-colors">
                  Polaroid Bouquets
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-cream transition-colors">
                  Birthday Specials &amp; Wish Jars
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-cream transition-colors">
                  Couple Keepsake Boxes
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-base font-semibold text-cream">Support</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#custom" className="hover:text-cream transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-cream transition-colors">
                  Reviews &amp; Trust
                </a>
              </li>
              <li>
                <a href="#custom" className="hover:text-cream transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-cream transition-colors">
                  Care Instructions
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
                <span>@memories.n.beyond</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blush shrink-0" />
                <span>hello@memoriesnbeyond.in</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blush shrink-0" />
                <span>+91 99999 99999</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blush shrink-0" />
                <span>Handcrafted with love · Shipping PAN India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/50">
          <div>© 2026 Memories n Beyond. All rights reserved.</div>
          <div className="flex items-center gap-1">
            <span>Made with care</span>
            <Heart className="w-3.5 h-3.5 text-rose fill-rose" />
            <span>one photograph at a time.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
