import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919368606771';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi Memories n Beyond, I'd like to place an order."
  )}`;

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-burgundy hover:bg-burgundy-deep text-cream flex items-center justify-center shadow-craft-modal border-2 border-cream transition-colors duration-200"
      aria-label="Order via WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      {/* Subtle pulse ring */}
      <span className="absolute -inset-1 rounded-full bg-burgundy/30 animate-ping pointer-events-none -z-10" />
    </motion.a>
  );
}
