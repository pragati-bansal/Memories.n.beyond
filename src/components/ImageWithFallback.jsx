import React, { useState, useEffect } from 'react';
import { resolveProductImage } from '../lib/productImages';

/**
 * ImageWithFallback
 * Guarantees real image rendering with safe image fallback to authentic product assets.
 * Never renders an empty placeholder or gradient box in place of an actual product photo.
 */
export default function ImageWithFallback({
  src,
  alt = 'Memories n Beyond handcrafted keepsake',
  className = '',
  gradient,
  style = {},
  loading = 'lazy',
  ...props
}) {
  const resolvedInitial = typeof src === 'string' && src ? src : resolveProductImage({ title: alt });
  const [imgSrc, setImgSrc] = useState(resolvedInitial);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setHasFailed(false);
    } else {
      setImgSrc(resolveProductImage({ title: alt }));
    }
  }, [src, alt]);

  const handleError = () => {
    if (!hasFailed) {
      setHasFailed(true);
      const fallback = resolveProductImage({ image: src, imageUrl: src, title: alt });
      if (fallback && fallback !== imgSrc) {
        setImgSrc(fallback);
      }
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={handleError}
      {...props}
    />
  );
}
