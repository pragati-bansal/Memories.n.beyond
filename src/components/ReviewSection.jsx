import React, { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { reviews } from '../data/reviews';

export default function ReviewSection() {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="reviews" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Navigation Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-rose-deep text-xs font-bold uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-rose-deep" />
              <span>Real Customer Stories</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-burgundy-deep mb-3 leading-tight">
              Customer love, unboxed
            </h2>
            <p className="text-base text-ink-soft">
              Real notes from people who've gifted (and kept) something made by us.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="w-11 h-11 rounded-full border border-burgundy/20 bg-paper hover:bg-blush/40 text-burgundy-deep flex items-center justify-center transition-colors shadow-craft-sm"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-11 h-11 rounded-full border border-burgundy/20 bg-paper hover:bg-blush/40 text-burgundy-deep flex items-center justify-center transition-colors shadow-craft-sm"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonials Horizontal Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 custom-scrollbar snap-x snap-mandatory"
        >
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="flex-shrink-0 w-80 sm:w-96 bg-paper rounded-3xl p-7 border border-burgundy/10 shadow-craft-soft flex flex-col justify-between snap-start"
            >
              <div>
                {/* Real Customer Unboxing Photo */}
                {rev.image && (
                  <div className="relative mb-5 rounded-2xl overflow-hidden aspect-[4/3] bg-blush/20 border border-burgundy/10 group shadow-xs">
                    <img
                      src={rev.image}
                      alt={`${rev.name}'s keepsake`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-1 rounded-full bg-cream/95 backdrop-blur-sm text-[11px] font-bold text-burgundy-deep shadow-sm">
                        {rev.productName || 'Verified Unboxing'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-burgundy/85 backdrop-blur-sm text-[10px] font-bold text-cream">
                        Verified Order ✓
                      </span>
                    </div>
                  </div>
                )}

                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-3 text-gold">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold" />
                  ))}
                </div>

                {/* Review Quote */}
                <p className="font-serif italic text-sm sm:text-base text-ink leading-relaxed mb-6">
                  "{rev.text}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="flex items-center gap-3 pt-4 border-t border-burgundy/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose to-burgundy text-cream font-bold text-sm flex items-center justify-center shadow-sm">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm text-burgundy-deep">
                    {rev.name}
                  </div>
                  <div className="text-xs text-ink-soft">
                    {rev.city}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
