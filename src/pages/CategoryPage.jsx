import React, { useEffect } from 'react';
import { initialProducts } from '../data/initialProducts';
import ProductCard from '../components/ProductCard';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Info,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';
import customFramesImg from '../assets/hero/custom-frames.jpg';
import giftBoxImg from '../assets/hero/gift-box.jpg';
import polaroidBouquetImg from '../assets/hero/polaroid-bouquet.jpg';

const categoryMeta = {
  frames: {
    id: 'frames',
    title: 'Custom Frames Collection',
    tagline: 'Timeless wooden & acrylic frames crafted to immortalize your most cherished moments.',
    image: customFramesImg,
    badge: 'Archival Photo Framing',
    features: [
      '4+ Custom Sizes (Mini to Gallery)',
      'Tabletop Stand & Wall Mount Hooks',
      'Ultra-HD Lab Photographic Printing',
      'Free Name & Date Personalization',
    ],
    guideTitle: 'Frame Sizing & Placement Guide',
    guideItems: [
      { size: '4x6 in (Mini)', bestFor: 'Office Desks & Bedside Tables', details: 'Compact, intimate portrait frame with stand.' },
      { size: '5x7 in (Classic)', bestFor: 'Living Room Consoles & Mantels', details: 'Our most popular couple gift size.' },
      { size: '8x10 in (Portrait Grand)', bestFor: 'Feature Shelves & Wall Display', details: 'Perfect for family portraits & milestone celebrations.' },
      { size: '12x18 in (Gallery Wall)', bestFor: 'Statement Wall Focal Point', details: 'Large-scale collage or dramatic single focal photo.' },
    ],
  },
  magazines: {
    id: 'magazines',
    title: 'Personalized Photo Magazines',
    tagline: 'Make your loved one the cover star with bespoke editorial spreads, love stories & glossy covers.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    badge: 'Editorial Keepsake Issues',
    features: [
      'Vogue / Forbes / Storybook Themes',
      'High-Gloss 250 GSM Art Paper',
      'Digital WhatsApp Proof Before Printing',
      'Custom Articles, Captions & Horoscopes',
    ],
    guideTitle: 'Magazine Editions & Page Options',
    guideItems: [
      { size: 'A4 Poster Cover', bestFor: 'Framed Wall Keepsake', details: 'Single-sheet glossy high-impact magazine cover print.' },
      { size: '4-Page Edition', bestFor: 'Birthdays & Quick Celebrations', details: 'Cover, 2 inside story spreads & back collage.' },
      { size: '8-Page Storybook', bestFor: 'Anniversaries & Relationship Milestones', details: 'Complete narrative timeline with photo spreads.' },
      { size: '12-16 Page Deluxe', bestFor: 'Weddings & Lifetime Journeys', details: 'Hardbound magazine book with premium luxury feel.' },
    ],
  },
  hampers: {
    id: 'hampers',
    title: 'Curated Luxury Gift Hampers',
    tagline: 'Exquisite rigid gift boxes & explosion boxes loaded with handmade surprises, frames & figurines.',
    image: giftBoxImg,
    badge: 'Signature Keepsake Hampers',
    features: [
      'Signature Black & Gold MB Seal Packaging',
      'Includes Couple Figurines & Custom Frames',
      'Interactive Multi-Layer Explosion Boxes',
      'Durable Rigid Boxes for Lifelong Storage',
    ],
    guideTitle: 'Hamper Tiers & Box Dimensions',
    guideItems: [
      { size: 'Mini Hamper', bestFor: 'Thoughtful Surprise Gifts', details: 'Keepsake box with figurine, mini photo frame & card.' },
      { size: 'Couple Luxe Box', bestFor: 'Anniversaries & Special Days', details: 'Figurines + 5x7 frame + embroidered hanky + chocolates.' },
      { size: 'Grand Royal Hamper', bestFor: 'Weddings & Grand Milestones', details: 'Complete luxury ensemble with bouquet, large frame & treats.' },
      { size: 'Explosion Surprise Box', bestFor: 'Unboxing Delight', details: 'Cascading photo layers, secret notes & center trinket.' },
    ],
  },
  addons: {
    id: 'addons',
    title: 'Handmade Add-ons & Keepsakes',
    tagline: 'Forever floral bouquets, polaroid arrangements & personalized embroidered treasures.',
    image: polaroidBouquetImg,
    badge: 'Bespoke Artisan Add-ons',
    features: [
      'Real Polaroid Memory Bouquets',
      'Custom Embroidered Handkerchiefs',
      'Handcrafted Pipe-Cleaner Forever Lilies',
      'Warm Fairy Lights & Butterfly Accents',
    ],
    guideTitle: 'Add-on Details & Customizations',
    guideItems: [
      { size: '6 Photos Bouquet', bestFor: 'Mini Memory Surprise', details: '6 polaroid prints wrapped in waterproof Korean paper.' },
      { size: '9-12 Photos Bouquet', bestFor: 'Full Visual Memory Walk', details: 'Adorned with delicate butterfly accents & fairy lights.' },
      { size: 'Embroidered Hanky', bestFor: 'Sentimental Keepsake for Him/Her', details: 'Premium cotton with bespoke love message in red/gold.' },
      { size: 'Pipe Cleaner Lilies', bestFor: 'Forever Floral Decor', details: 'Artisan hand-twisted pastel petals that never fade.' },
    ],
  },
};

const categoryTabs = [
  { id: 'frames', label: '1. Frames' },
  { id: 'magazines', label: '2. Magazines' },
  { id: 'hampers', label: '3. Hampers' },
  { id: 'addons', label: '4. Add ons' },
];

export default function CategoryPage({
  categoryId = 'frames',
  onSelectCategory,
  onBackToHome,
  onSelectProduct,
}) {
  const meta = categoryMeta[categoryId] || categoryMeta.frames;
  const products = initialProducts.filter((p) => p.category === categoryId);
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';

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

      {/* Category Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 mb-12 sm:mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-paper via-blush/30 to-cream-deep border border-burgundy/15 shadow-craft-modal p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center gap-8">
          {/* Left Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-burgundy/10 text-burgundy mb-4">
              <Sparkles className="w-3.5 h-3.5 text-rose-deep" />
              <span>{meta.badge}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-deep mb-4 leading-tight">
              {meta.title}
            </h1>

            <p className="text-sm sm:text-base text-ink-soft max-w-xl leading-relaxed mb-6">
              {meta.tagline}
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg mb-6">
              {meta.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-ink-soft">
                  <CheckCircle2 className="w-4 h-4 text-burgundy flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-rose-deep font-semibold">
              Select any design below, pick your desired size, and see exact prices accordingly.
            </p>
          </div>

          {/* Right Visual Image */}
          <div className="w-full lg:w-80 h-64 sm:h-72 lg:h-80 rounded-2xl overflow-hidden shadow-craft-lg border-4 border-paper flex-shrink-0 relative group">
            <img
              src={meta.image}
              alt={meta.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs text-cream font-bold drop-shadow-sm">
                100% Handcrafted to Order
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Grid Section with Size Selector & Prices */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-8 pb-4 border-b border-burgundy/10">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-deep">
              Available Designs &amp; Formats
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
              Click on different size pills below each product to update prices and customize with your photos.
            </p>
          </div>

          <span className="text-xs font-bold text-rose-deep bg-blush/60 px-3 py-1 rounded-full self-start sm:self-auto">
            {products.length} Designs Ready to Personalize
          </span>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {products.map((product) => (
            <ProductCard
              key={product.id || product.slug}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </div>

      {/* Size, Dimension & Material Guide */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-paper rounded-3xl border border-burgundy/15 p-6 sm:p-10 shadow-craft-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-blush flex items-center justify-center text-burgundy shadow-sm">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-burgundy-deep">
                {meta.guideTitle}
              </h3>
              <p className="text-xs text-ink-soft">
                Everything you need to know about dimensions, formats and best placement.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {meta.guideItems.map((item, index) => (
              <div
                key={index}
                className="bg-cream/50 rounded-2xl p-5 border border-burgundy/10 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-deep block mb-1">
                    Option {index + 1}
                  </span>
                  <h4 className="font-serif font-bold text-lg text-burgundy-deep mb-1">
                    {item.size}
                  </h4>
                  <div className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-blush/80 text-burgundy mb-3">
                    {item.bestFor}
                  </div>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Dimension / WhatsApp Help Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-burgundy-deep text-cream p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-craft-modal">
          <div className="text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-blush block mb-1">
              Need a Custom Size or Bulk Order?
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream mb-2">
              Have a custom dimension or special vision?
            </h3>
            <p className="text-xs sm:text-sm text-cream/80 max-w-xl">
              Our artisans can craft custom multi-frame layouts, custom magazine page counts, or corporate gift hampers tailored exactly to your requirement.
            </p>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              `Hi Memories n Beyond! I'm looking at your ${meta.title} and want to discuss custom sizing/requirements.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2.5 bg-cream hover:bg-white text-burgundy-deep font-bold px-6 py-3.5 rounded-full shadow-lg transition-all hover:scale-105 text-sm"
          >
            <MessageCircle className="w-4 h-4 text-burgundy" />
            <span>Chat with Artisan on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
