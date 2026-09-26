import React from 'react';
import { PackageOpen, ArrowRight, MessageCircle } from 'lucide-react';

export default function EmptyState({
  title = 'No items found in this collection',
  description = "We're currently preparing new artisan pieces for this section. Chat with us directly on WhatsApp to explore custom requests.",
  actionText = 'Browse All Collections',
  onAction,
  onContactWhatsApp,
}) {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919368606771';
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hi Memories n Beyond! I am looking for custom gift options.'
  )}`;

  return (
    <div className="bg-paper rounded-3xl p-8 sm:p-12 border border-burgundy/10 shadow-craft-soft text-center max-w-xl mx-auto space-y-5 my-8">
      <div className="w-14 h-14 rounded-full bg-blush flex items-center justify-center text-burgundy mx-auto shadow-xs">
        <PackageOpen className="w-7 h-7" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-burgundy-deep">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-ink-soft leading-relaxed max-w-md mx-auto">
          {description}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-burgundy hover:bg-burgundy-deep text-cream px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-craft-soft transition-all cursor-pointer"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cream hover:bg-paper text-burgundy-deep border border-burgundy/20 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-burgundy" />
          <span>Ask on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
