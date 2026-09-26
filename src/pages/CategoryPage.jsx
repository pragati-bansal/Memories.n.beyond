import React, { useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import {
  ArrowLeft,
  ShieldCheck,
  MessageCircle,
  Info,
} from 'lucide-react';
import customFramesImg from '../assets/hero/custom-frames.jpg';
import giftBoxImg from '../assets/hero/gift-box.jpg';
import polaroidBouquetImg from '../assets/hero/polaroid-bouquet.jpg';
import hamperBouquetImg from '../assets/hero/hamper-bouquet.jpg';
import embroideredKeepsakeImg from '../assets/hero/embroidered-keepsake.jpg';
import foreverFlowerBouquetImg from '../assets/hero/forever-flower-bouquet.png';

const frameGuideItems = [
  { size: '4x4 in (Mini Square Tabletop)', bestFor: 'Workstations, Desks & Nightstands', details: 'Compact square cutout frame with radiating retro heart aesthetic (₹299).' },
  { size: '5x7 in (Classic Tabletop)', bestFor: 'Desks, Bedside Tables & Consoles', details: 'Our most popular tabletop size for couples and friends (₹399).' },
  { size: 'A4 Dimension (8.3 x 11.7 in)', bestFor: 'Living Rooms & Milestone Displays', details: 'Spacious wall or desk format with elevated presence (₹499).' },
  { size: '18x24 in (Grand Showcase)', bestFor: 'Living Room Centerpieces & Large Families', details: 'Grand statement wall piece accommodating large multi-photo family collages (₹1499).' },
];

const categoryMeta = {
  frames: {
    id: 'frames',
    title: 'Custom Frames Collection',
    tagline: 'Timeless wooden & acrylic frames crafted to immortalize your most cherished moments across 12 signature handcrafted formats.',
    image: customFramesImg,
    badge: '12 Signature Frame Styles',
  },
  magazines: {
    id: 'magazines',
    title: 'Personalized Photo Magazines',
    tagline: 'Make your loved one the cover star with bespoke editorial spreads, love stories & glossy covers.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    badge: 'Editorial Keepsake Issues',
  },
  hampers: {
    id: 'hampers',
    title: 'Curated Luxury Gift Hampers',
    tagline: 'Bespoke handcrafted hamper bouquets & polaroid memory arrangements loaded with personalized surprises.',
    image: hamperBouquetImg,
    badge: 'Signature Keepsake Bouquets',
  },
  addons: {
    id: 'addons',
    title: 'Handmade Add-ons & Keepsakes',
    tagline: 'Forever floral bouquets, polaroid arrangements & personalized embroidered treasures.',
    image: embroideredKeepsakeImg,
    badge: 'Bespoke Artisan Add-ons',
  },
  general: {
    id: 'general',
    title: 'Generalised Gifts & Forever Bouquets',
    tagline: 'Artisan velvet pipe-cleaner floral bouquets that never fade, tied with luxury satin ribbons and handwritten greeting cards.',
    image: foreverFlowerBouquetImg,
    badge: 'Artisan Forever Floral Sets',
  },
};

const categoryTabs = [
  { id: 'frames', label: '1. Frames' },
  { id: 'magazines', label: '2. Magazines' },
  { id: 'hampers', label: '3. Hampers' },
  { id: 'addons', label: '4. Add ons' },
  { id: 'general', label: '5. Generalised Gifts' },
];

export default function CategoryPage({
  categoryId = 'frames',
  onSelectCategory,
  onBackToHome,
  onSelectProduct,
}) {
  const { products: allProducts, loading } = useProducts();
  const meta = categoryMeta[categoryId] || categoryMeta.frames;
  const products = allProducts.filter((p) => p.category === categoryId);
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919368606771';

  // Smooth scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Category Page Sub-Navbar & Breadcrumbs */}
      <div className="bg-cream-deep/60 border-b border-burgundy/10 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Breadcrumb + Back Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-paper border border-burgundy/15 text-burgundy-deep font-semibold text-xs hover:bg-burgundy hover:text-cream transition-all shadow-craft-soft"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <div className="text-xs text-ink-soft hidden xs:flex items-center gap-1.5">
              <span>Home</span>
              <span>/</span>
              <button
                type="button"
                onClick={onBackToHome}
                className="hover:text-burgundy transition-colors"
              >
                Categories
              </button>
              <span>/</span>
              <span className="font-bold text-burgundy-deep">{meta.title}</span>
            </div>
          </div>

          {/* Quick Switcher Between the 4 Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categoryTabs.map((tab) => {
              const isActive = tab.id === categoryId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-burgundy text-cream shadow-craft-soft scale-105'
                      : 'bg-paper text-ink-soft border border-burgundy/10 hover:border-burgundy/30 hover:text-burgundy-deep'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom Dimension / WhatsApp Help Banner (Sabse Upar) */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 pt-4 sm:pt-8 mb-6 sm:mb-10">
        <div className="rounded-2xl sm:rounded-3xl bg-burgundy text-cream p-4 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-craft-modal">
          {categoryId === 'general' ? (
            <div className="text-center md:text-left">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blush block mb-1">
                Make Every Celebration Extraordinary
              </span>
              <h3 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold text-cream mb-1.5 sm:mb-2">
                Get your generalised hamper &amp; make your day more special!
              </h3>
              <p className="text-[11px] sm:text-sm text-cream/80 max-w-xl">
                Surprise your loved ones with handcrafted everlasting floral bouquets, custom cards, and heartwarming gifts made to bring pure joy to any occasion.
              </p>
            </div>
          ) : (
            <div className="text-center md:text-left">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blush block mb-1">
                Need a Custom Size or Bulk Order?
              </span>
              <h3 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold text-cream mb-1.5 sm:mb-2">
                Have a custom dimension or special vision?
              </h3>
              <p className="text-[11px] sm:text-sm text-cream/80 max-w-xl">
                Our artisans can craft custom multi-frame layouts, custom magazine page counts, or corporate gift hampers tailored exactly to your requirement.
              </p>
            </div>
          )}

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              categoryId === 'general'
                ? `Hi Memories n Beyond! 🌸 I would like to get a generalised gift / bouquet to make our day more special.`
                : `Hi Memories n Beyond! I'm looking at your ${meta.title} and want to discuss custom sizing/requirements.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-cream hover:bg-white text-burgundy-deep font-bold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full shadow-lg transition-all hover:scale-105 text-xs sm:text-sm"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-burgundy" />
            <span>
              {categoryId === 'general' ? 'Order on WhatsApp' : 'Chat with Artisan on WhatsApp'}
            </span>
          </a>
        </div>
      </div>

      {/* Product Cards Grid: 2 columns on mobile (Meesho / Myntra style) */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : products.length === 0 ? (
          <EmptyState
            title={`No items currently in ${meta.title}`}
            description="We are crafting new bespoke items for this category. Contact our artisan team directly on WhatsApp to place a custom request."
            actionText="Browse Categories"
            onAction={onBackToHome}
          />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-7">
            {products.map((product) => (
              <ProductCard
                key={product.id || product.slug}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Frame Sizing & Format Guide - STRICTLY ONLY FOR FRAMES SECTION */}
      {categoryId === 'frames' && (
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 mb-20">
          <div className="bg-paper rounded-2xl sm:rounded-3xl border border-burgundy/15 p-5 sm:p-8 shadow-craft-soft">
            <div className="flex items-start gap-3 mb-6 sm:mb-8">
              <div className="w-9 h-9 rounded-full bg-blush flex items-center justify-center text-burgundy shrink-0 mt-0.5 shadow-xs">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-burgundy-deep">
                  Frame Sizing &amp; Format Guide
                </h3>
                <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
                  Everything you need to know about dimensions, formats and best placement.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {frameGuideItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-cream/60 hover:bg-cream rounded-2xl p-4 sm:p-5 border border-burgundy/10 flex flex-col justify-between transition-all"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-deep block mb-1">
                      Option {idx + 1}
                    </span>
                    <h4 className="font-serif text-base font-bold text-burgundy-deep mb-2">
                      {item.size}
                    </h4>
                    <span className="inline-block text-[11px] font-semibold text-burgundy bg-blush/80 px-2.5 py-0.5 rounded-full mb-3">
                      {item.bestFor}
                    </span>
                    <p className="text-xs text-ink-soft leading-relaxed">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
