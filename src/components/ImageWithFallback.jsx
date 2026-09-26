import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * ImageWithFallback
 * Non-destructively handles broken image URLs by rendering a gradient placeholder
 * with an icon without altering existing image sizes, aspect ratios, or visual layouts.
 */
export default function ImageWithFallback({
  src,
  alt = 'Memories n Beyond handcrafted keepsake',
  className = '',
  gradient = 'linear-gradient(150deg,#FFE5EC,#FB6F92 55%,#881337)',
  style = {},
  loading = 'lazy',
  ...props
}) {
  const [hasError, setHasError] = useState(false);

  // If source is missing or image errored out
  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden transition-all select-none ${className}`}
        style={{
          background: gradient || 'linear-gradient(150deg,#FFE5EC,#FB6F92 55%,#881337)',
          ...style,
        }}
        role="img"
        aria-label={alt}
      >
        <div className="flex flex-col items-center justify-center p-2 text-cream/80 pointer-events-none">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 opacity-80" />
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
