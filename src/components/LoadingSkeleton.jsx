import React from 'react';

/**
 * ProductCardSkeleton
 * Loading placeholder that matches the exact visual proportions of ProductCard.
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-paper rounded-xl sm:rounded-3xl overflow-hidden border border-burgundy/10 shadow-craft-soft flex flex-col justify-between animate-pulse">
      {/* Visual Thumbnail Area */}
      <div className="h-44 sm:h-64 bg-blush/30 flex items-center justify-center p-2 sm:p-5">
        <div className="w-28 xs:w-32 sm:w-36 h-36 xs:h-38 sm:h-44 bg-paper/80 rounded-none p-1.5 sm:p-2 pb-3.5 sm:pb-6 shadow-xs flex flex-col">
          <div className="w-full flex-grow bg-blush-deep/20 rounded-none" />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2.5 sm:p-5 sm:p-6 space-y-3">
        <div className="w-20 h-3 bg-blush-deep/30 rounded-full" />
        <div className="w-3/4 h-5 bg-blush-deep/40 rounded-md" />
        <div className="space-y-1.5">
          <div className="w-full h-3 bg-blush/40 rounded" />
          <div className="w-2/3 h-3 bg-blush/30 rounded" />
        </div>
        <div className="pt-3 border-t border-burgundy/10 flex items-center justify-between">
          <div className="w-16 h-6 bg-blush-deep/30 rounded-md" />
          <div className="w-20 h-7 bg-blush/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-7">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}
