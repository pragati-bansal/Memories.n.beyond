import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Eye } from 'lucide-react';
import customFramesImg from '../assets/hero/custom-frames.jpg';
import giftBoxImg from '../assets/hero/gift-box.jpg';
import polaroidBouquetImg from '../assets/hero/polaroid-bouquet.jpg';

export default function ProductGrid({ onNavigateToCategory }) {
  // 4 Big Category Definitions (Strictly NO prices mentioned here)
  const mainCategories = [
    {
      id: 'frames',
      title: 'Frames',
      subtitle: 'Tabletop, desk & wall gallery frames crafted with your favourite memories in custom dimensions.',
      tag: 'Custom Frames',
      image: customFramesImg,
      highlights: ['4+ Custom Dimensions', 'Matte & Gloss Archival Prints', 'Tabletop & Wall Mount Ready'],
      badge: 'Bestseller',
      actionText: 'Explore Frames & Sizes',
    },
    {
      id: 'magazines',
      title: 'Magazines',
      subtitle: 'Make your loved one the cover star! Personalized Vogue, anniversary & storybook glossy memory issues.',
      tag: 'Photo Magazines',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      highlights: ['A4 Posters & Multi-Page Issues', 'Glossy 250 GSM Art Paper', 'Custom Story & Headline Layouts'],
      badge: 'Trending',
      actionText: 'Explore Magazines & Sizes',
    },
    {
      id: 'hampers',
      title: 'Hampers',
      subtitle: 'Curated luxury keepsake boxes, explosion surprise boxes & themed gift sets sealed with gold foil elegance.',
      tag: 'Gift Hampers',
      image: giftBoxImg,
      highlights: ['Multiple Box Sizes & Configurations', 'Rigid Reusable Keepsake Boxes', 'Couple Figurines & Treats Included'],
      badge: 'Luxury Packaging',
      actionText: 'Explore Hampers & Sizes',
    },
    {
      id: 'addons',
      title: 'Add ons',
      subtitle: 'Handmade forever flowers, polaroid memory bouquets, customized handkerchiefs & delicate keepsakes.',
      tag: 'Handmade Add-ons',
      image: polaroidBouquetImg,
      highlights: ['Polaroid Memory Bouquets', 'Embroidered Keepsake Hankies', 'Pipe Cleaner Forever Lilies'],
      badge: 'Handcrafted',
      actionText: 'Explore Add-ons & Sizes',
    },
  ];

  const craftPromises = [
    {
      icon: Sparkles,
      title: '100% Bespoke Crafting',
      desc: 'Each creation is customized by hand specifically around your personal photographs and words.',
    },
    {
      icon: Eye,
      title: 'WhatsApp Proof Approval',
      desc: 'We preview your magazine spread and frame layouts on WhatsApp before we print or craft.',
    },
    {
      icon: ShieldCheck,
      title: 'Archival Museum Quality',
      desc: 'Non-fading photo prints, shatter-resistant acrylic, and durable luxury rigid boxes.',
    },
    {
      icon: Truck,
      title: 'Safe PAN-India Shipping',
      desc: 'Multi-layer bubble cushioning ensuring your gift arrives pristine and ready to surprise.',
    },
  ];

  return (
    <section id="collection" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Main Bold in One Line, No Sub-paragraph */}
        <div className="mb-10 sm:mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-deep leading-tight">
            Every piece starts with your photograph
          </h2>
        </div>

        {/* 4 Big Category Sections (NO prices mentioned on these cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 mb-14">
          {mainCategories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => onNavigateToCategory(cat.id)}
              className="group relative bg-paper rounded-3xl overflow-hidden border border-burgundy/15 shadow-craft-soft hover:shadow-craft-modal cursor-pointer transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 hover:border-burgundy/40"
            >
              {/* Visual Thumbnail Banner */}
              <div className="relative h-60 sm:h-64 overflow-hidden bg-blush/30">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/85 via-burgundy-deep/30 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-cream/95 text-burgundy-deep backdrop-blur-sm shadow-sm">
                    {cat.tag}
                  </span>
                </div>

                <div className="absolute top-3.5 right-3.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-burgundy/90 text-cream backdrop-blur-sm shadow-sm">
                    {cat.badge}
                  </span>
                </div>

                {/* Bottom Image Title */}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[11px] font-bold text-cream/75 uppercase tracking-wider block">
                    Collection {idx + 1}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream drop-shadow-sm">
                    {cat.title}
                  </h3>
                </div>
              </div>

              {/* Card Body & Feature Highlights (NO PRICE) */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
                <div>
                  <p className="text-xs text-ink-soft leading-relaxed mb-4">
                    {cat.subtitle}
                  </p>

                  {/* Highlights checklist */}
                  <ul className="space-y-1.5 mb-6">
                    {cat.highlights.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] text-ink-soft/90 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-deep flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to Action Bar */}
                <div className="pt-4 border-t border-burgundy/10 flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-burgundy group-hover:text-burgundy-deep inline-flex items-center gap-1.5 transition-colors">
                    <span>{cat.actionText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>

                  <span className="w-8 h-8 rounded-full bg-blush/70 flex items-center justify-center text-burgundy group-hover:bg-burgundy group-hover:text-cream transition-all shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Supportive Craft Promise Banner */}
        <div className="bg-gradient-to-r from-paper via-cream-deep to-paper rounded-3xl border border-burgundy/15 p-6 sm:p-8 shadow-craft-soft">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-rose-deep text-xs font-bold uppercase tracking-widest block mb-1">
              Handcrafted With Love &amp; Care
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-deep">
              How our 4 collections bring your memories to life
            </h3>
            <p className="text-xs sm:text-sm text-ink-soft mt-1">
              Click into any collection above to view available sizes, layout dimensions, and prices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {craftPromises.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-cream/70 rounded-2xl p-4 sm:p-5 border border-burgundy/10 flex flex-col justify-start hover:border-rose/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-blush flex items-center justify-center text-burgundy mb-3 shadow-craft-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-burgundy-deep mb-1 font-serif">
                    {item.title}
                  </h4>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
