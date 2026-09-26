import React, { useState } from 'react';
import { MessageCircle, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/logo.png';

export default function Navbar({ onNavigateHome, onNavigateCategories }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919368606771';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi Memories n Beyond, I'd like to place an order."
  )}`;

  const handleLinkClick = (e, href) => {
    if (href === '#home' && onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    } else if ((href === '#collection' || href === '#category/frames') && onNavigateCategories) {
      e.preventDefault();
      onNavigateCategories();
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Categories', href: '#category/frames' },
    { name: 'How It Works', href: '#custom' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-cream/85 backdrop-blur-md border-b border-burgundy/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, '#home')}
          className="flex items-center gap-3 group"
        >
          <img
            src={logoImg}
            alt="Memories n Beyond logo - Where feelings find forms"
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-full object-cover shadow-craft-sm group-hover:scale-105 transition-transform border-2 border-burgundy/15"
          />
          <div className="flex flex-col justify-center">
            <span className="font-script text-2xl sm:text-[32px] text-burgundy-deep block leading-none pt-1">
              memories n beyond
            </span>
            <span className="block font-sans text-[11px] sm:text-xs tracking-wide text-rose-deep font-semibold mt-2 sm:mt-2.5">
              Where feelings find forms
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-sm font-semibold text-ink-soft hover:text-burgundy-deep relative py-1 transition-colors group"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-burgundy rounded-full transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-burgundy hover:bg-burgundy-deep text-cream px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm shadow-craft-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-craft-lg"
          >
            <MessageCircle className="w-4 h-4 text-blush-100" />
            <span className="hidden xs:inline">Order via WhatsApp</span>
            <span className="xs:hidden">WhatsApp</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-burgundy-deep hover:bg-blush/50 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-burgundy/10 bg-cream-deep/95 backdrop-blur-lg px-6 py-6 shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleLinkClick(e, link.href);
                  }}
                  className="font-serif text-xl font-medium text-burgundy-deep hover:text-rose-deep transition-colors py-1"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 border-t border-burgundy/10">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-burgundy text-cream py-3 rounded-full font-semibold text-sm shadow-craft-soft"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
