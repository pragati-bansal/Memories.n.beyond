import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Heart,
  Upload,
  X,
  Camera,
  PenLine,
  CheckCircle2,
  ZoomIn,
  AlertCircle,
} from 'lucide-react';
import { logger } from '../lib/logger';
import { newReviewSubmissionSchema, safeParseLegacyReviews, getFirstZodErrorMessage } from '../lib/validation';
import {
  fetchReviewsFromDb,
  saveReviewInDb,
  uploadCustomerPhoto,
  isSupabaseConfigured,
} from '../lib/supabaseClient';
import ImageWithFallback from './ImageWithFallback';

const STORAGE_KEY = 'mb_real_user_reviews_v1';

// Client-side image compression helper to avoid localStorage quota issues
function compressImageToDataUrl(file, maxDimension = 600, quality = 0.7) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(readerEvent.target.result);
      img.src = readerEvent.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export default function ReviewSection() {
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  // Reviews state with localStorage persistence - strictly user-added reviews only
  const [reviewsList, setReviewsList] = useState(() => {
    try {
      // Clean up legacy dummy reviews keys
      localStorage.removeItem('mb_customer_reviews_v2');
      localStorage.removeItem('mb_customer_reviews_v3');

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const parsedReviews = safeParseLegacyReviews(parsed);
          // Strictly keep only real user submitted reviews
          return parsedReviews.filter(
            (r) =>
              r &&
              r.isUserSubmitted === true &&
              r.id &&
              String(r.id).startsWith('rev-')
          );
        }
      }
    } catch (e) {
      logger.error('ReviewSection', 'Failed to load reviews from localStorage', e);
    }
    return [];
  });

  // Write Review Modal & Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [productName, setProductName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formValidationError, setFormValidationError] = useState('');

  // Lightbox Zoom Modal State
  const [zoomImage, setZoomImage] = useState(null);

  // Fetch only real user reviews from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    if (isSupabaseConfigured) {
      fetchReviewsFromDb()
        .then((dbReviews) => {
          if (!isMounted || !Array.isArray(dbReviews) || dbReviews.length === 0) return;
          setReviewsList((prev) => {
            const dbMap = new Map();
            dbReviews.forEach((r) => {
              const key = String(r.id);
              dbMap.set(key, {
                id: r.id,
                name: r.name,
                city: r.city,
                productName: r.product_name || r.productName,
                stars: r.stars,
                text: r.text,
                image: r.image_url || r.image,
                date: r.date,
                isUserSubmitted: true,
              });
            });

            const merged = prev.map((item) => {
              const key = String(item.id);
              return dbMap.has(key) ? { ...item, ...dbMap.get(key) } : item;
            });

            const existingKeys = new Set(merged.map((r) => String(r.id)));
            dbReviews.forEach((r) => {
              const key = String(r.id);
              if (!existingKeys.has(key)) {
                merged.unshift({
                  id: r.id,
                  name: r.name,
                  city: r.city,
                  productName: r.product_name || r.productName,
                  stars: r.stars,
                  text: r.text,
                  image: r.image_url || r.image,
                  date: r.date,
                  isUserSubmitted: true,
                });
              }
            });

            return merged;
          });
        })
        .catch((err) => {
          logger.warn('ReviewSection', 'Failed to fetch Supabase reviews', err);
        });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage safely with quota exhaustion fallback
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewsList));
    } catch (e) {
      logger.warn('ReviewSection', 'Quota exceeded when saving full reviews, trimming heavy images', e);
      try {
        const lightweightList = reviewsList.map((rev) => ({
          ...rev,
          image: rev.image && rev.image.length > 50000 ? null : rev.image,
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweightList));
      } catch (innerErr) {
        logger.error('ReviewSection', 'Failed to save fallback reviews to localStorage', innerErr);
      }
    }
  }, [reviewsList]);

  // Handle Carousel Scroll
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

  // Handle Photo Selection with automatic compression
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      try {
        const compressedDataUrl = await compressImageToDataUrl(file);
        setImagePreview(compressedDataUrl);
      } catch (err) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImagePreview = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle Submit with validation, cloud upload and database sync
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const validation = newReviewSubmissionSchema.safeParse({
      name: name.trim(),
      city: city.trim() || undefined,
      productName: productName.trim() || undefined,
      stars: Number(rating),
      text: text.trim(),
      image: imagePreview || null,
    });

    if (!validation.success) {
      const errorMsg = getFirstZodErrorMessage(
        validation.error,
        'Please check the review information entered.'
      );
      setFormValidationError(errorMsg);
      logger.warn('ReviewSection', 'Review validation rejected', errorMsg);
      return;
    }

    setFormValidationError('');
    setIsSubmitting(true);
    const validData = validation.data;

    let finalImageUrl = imagePreview || null;

    // Upload to Supabase Storage if configured
    if (imageFile && isSupabaseConfigured) {
      try {
        const publicUrl = await Promise.race([
          uploadCustomerPhoto(imageFile),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 6000)),
        ]);
        if (publicUrl && typeof publicUrl === 'string' && publicUrl.startsWith('http')) {
          finalImageUrl = publicUrl;
        }
      } catch (err) {
        logger.warn('ReviewSection', 'Supabase image upload fallback to local preview', err);
      }
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const newReview = {
      id: `rev-${Date.now()}`,
      name: validData.name,
      city: validData.city || 'Verified Buyer',
      productName: validData.productName || 'Handmade Keepsake',
      stars: validData.stars,
      text: validData.text,
      image: finalImageUrl,
      date: formattedDate,
      isUserSubmitted: true,
    };

    setReviewsList((prev) => [newReview, ...prev]);
    setIsSubmitted(true);
    setIsSubmitting(false);

    // Save to Supabase DB in background
    if (isSupabaseConfigured) {
      saveReviewInDb(newReview).catch((err) =>
        logger.warn('ReviewSection', 'Background review save in Supabase failed', err)
      );
    }

    // Reset Form
    setTimeout(() => {
      setName('');
      setCity('');
      setProductName('');
      setRating(5);
      setText('');
      setImageFile(null);
      setImagePreview(null);
      setFormValidationError('');
      setIsSubmitted(false);
      setIsFormOpen(false);

      // Scroll to start
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 1200);
  };

  return (
    <section id="reviews" className="py-20 sm:py-28 relative bg-cream/40 border-t border-burgundy/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Navigation Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-rose-deep text-xs font-bold uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-rose-deep" />
              <span>Real Customer Stories</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-burgundy-deep mb-3 leading-tight">
              Customer love, unboxed
            </h2>
            <p className="text-sm sm:text-base text-ink-soft">
              Real notes and unboxing photos from people who've gifted (and kept) something made by us.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Write a Review CTA Button */}
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 bg-burgundy hover:bg-burgundy-deep text-cream px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm shadow-craft-soft hover:shadow-craft-lg hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <PenLine className="w-4 h-4" />
              <span>Write a Review</span>
            </button>

            {/* Scroll Navigation (visible only when reviews exist) */}
            {reviewsList.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-burgundy/20 bg-paper hover:bg-blush/40 text-burgundy-deep flex items-center justify-center transition-colors shadow-craft-sm cursor-pointer"
                  aria-label="Previous testimonials"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-burgundy/20 bg-paper hover:bg-blush/40 text-burgundy-deep flex items-center justify-center transition-colors shadow-craft-sm cursor-pointer"
                  aria-label="Next testimonials"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Empty State vs Testimonials Horizontal Carousel */}
        {reviewsList.length === 0 ? (
          <div className="bg-paper rounded-3xl p-8 sm:p-12 border border-burgundy/10 shadow-craft-soft text-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-blush/60 text-burgundy flex items-center justify-center mx-auto shadow-xs">
              <Heart className="w-7 h-7 text-burgundy fill-rose-deep/30" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-burgundy-deep">
                Be the First to Share Your Story
              </h3>
              <p className="text-xs sm:text-sm text-ink-soft max-w-md mx-auto">
                Received something handcrafted by Memories n Beyond? Share your unboxing moment with photo &amp; rating.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 bg-burgundy hover:bg-burgundy-deep text-cream px-6 py-3 rounded-full font-bold text-xs sm:text-sm shadow-craft-soft hover:shadow-craft-lg transition-all cursor-pointer"
            >
              <PenLine className="w-4 h-4" />
              <span>Write the First Review</span>
            </button>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 custom-scrollbar snap-x snap-mandatory"
          >
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="flex-shrink-0 w-[280px] xs:w-80 sm:w-96 bg-paper rounded-3xl p-5 sm:p-7 border border-burgundy/10 shadow-craft-soft hover:shadow-craft-modal transition-all duration-300 flex flex-col justify-between snap-start"
              >
              <div>
                {/* Real Customer Unboxing Photo with Zoom/Lightbox Trigger */}
                {rev.image && (
                  <div
                    onClick={() => setZoomImage({ src: rev.image, title: `${rev.name}'s Keepsake`, sub: rev.productName })}
                    className="relative mb-4 sm:mb-5 rounded-2xl overflow-hidden aspect-[4/3] bg-blush/20 border border-burgundy/10 group shadow-xs cursor-zoom-in"
                  >
                    <ImageWithFallback
                      src={rev.image}
                      alt={rev.name ? `${rev.name}'s customer keepsake unboxing photo` : 'Customer unboxing keepsake photo'}
                      gradient="linear-gradient(150deg,#FFE5EC,#FB6F92 55%,#881337)"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-burgundy-deep/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-full bg-cream/90 text-burgundy shadow-sm">
                        <ZoomIn className="w-4 h-4" />
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-1 rounded-full bg-cream/95 backdrop-blur-sm text-[10px] sm:text-[11px] font-bold text-burgundy-deep shadow-sm truncate max-w-[170px]">
                        {rev.productName || 'Verified Unboxing'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-burgundy/90 backdrop-blur-sm text-[9px] sm:text-[10px] font-bold text-cream shrink-0">
                        Verified Order ✓
                      </span>
                    </div>
                  </div>
                )}

                {/* Rating & Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.stars ? 'fill-amber-400 text-amber-500' : 'text-burgundy/20'
                        }`}
                      />
                    ))}
                  </div>
                  {rev.date && (
                    <span className="text-[11px] font-medium text-ink-soft/75">
                      {rev.date}
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className="font-serif italic text-xs sm:text-sm text-ink leading-relaxed mb-5 sm:mb-6 break-words [overflow-wrap:anywhere]">
                  "{rev.text}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="flex items-center gap-3 pt-4 border-t border-burgundy/10 mt-auto">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-rose to-burgundy text-cream font-bold text-xs sm:text-sm flex items-center justify-center shadow-sm shrink-0">
                  {rev.name ? rev.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-burgundy-deep truncate break-words">
                    {rev.name}
                  </div>
                  <div className="text-[11px] sm:text-xs text-ink-soft truncate break-words">
                    {rev.city || 'Verified Buyer'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

      {/* ================= Write Review Modal Form (No Login Required) ================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop blur overlay */}
          <div
            onClick={() => !isSubmitted && setIsFormOpen(false)}
            className="fixed inset-0 bg-burgundy-deep/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Card */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-form-title"
            className="relative bg-paper rounded-3xl shadow-craft-modal border border-burgundy/15 max-w-lg w-full p-6 sm:p-8 z-10 my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-cream hover:bg-blush/50 text-burgundy-deep flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close review form"
            >
              <X className="w-4 h-4" />
            </button>

            {isSubmitted ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-burgundy-deep">
                  Thank You for Your Love!
                </h3>
                <p className="text-xs sm:text-sm text-ink-soft max-w-sm mx-auto">
                  Your review has been shared and added to our customer stories.
                </p>
              </div>
            ) : (
              <div>
                {/* Form Header */}
                <div className="mb-6">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-deep block mb-1">
                    Share Your Experience
                  </span>
                  <h3 id="review-form-title" className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-deep">
                    Write a Product Review
                  </h3>
                  <p className="text-xs text-ink-soft mt-1">
                    No sign-in needed. Your feedback helps our artisans grow!
                  </p>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-bold text-burgundy-deep uppercase tracking-wider mb-1.5">
                      Your Rating *
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = (hoverRating || rating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="p-1 text-amber-500 hover:scale-125 transition-transform cursor-pointer"
                            aria-label={`Rate ${star} star`}
                          >
                            <Star
                              className={`w-6 h-6 ${
                                isFilled
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'text-burgundy/20'
                              }`}
                            />
                          </button>
                        );
                      })}
                      <span className="text-xs font-bold text-burgundy ml-2">
                        {rating === 5
                          ? '5.0 — Excellent! ❤️'
                          : rating === 4
                          ? '4.0 — Very Good'
                          : rating === 3
                          ? '3.0 — Good'
                          : `${rating}.0`}
                      </span>
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-bold text-burgundy-deep uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/15 bg-cream/50 text-ink text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy transition-all"
                    />
                  </div>

                  {/* City & Product Name (Two Columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-burgundy-deep uppercase tracking-wider mb-1">
                        City / Location (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Meerut, Delhi, Mumbai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/15 bg-cream/50 text-ink text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-burgundy-deep uppercase tracking-wider mb-1">
                        Product Ordered (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Scrapbook Frame / Lily Bouquet"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/15 bg-cream/50 text-ink text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy transition-all"
                      />
                    </div>
                  </div>

                  {/* Review Message */}
                  <div>
                    <label className="block text-xs font-bold text-burgundy-deep uppercase tracking-wider mb-1">
                      Review Message *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tell us how you liked the unboxing, packaging, quality & craft..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/15 bg-cream/50 text-ink text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy resize-none transition-all"
                    />
                  </div>

                  {/* Product Photo Upload */}
                  <div>
                    <label className="block text-xs font-bold text-burgundy-deep uppercase tracking-wider mb-1">
                      Upload Unboxing / Product Photo (Optional)
                    </label>

                    {imagePreview ? (
                      <div className="relative inline-block mt-1">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-burgundy/20 shadow-xs">
                          <img
                            src={imagePreview}
                            alt="Uploaded keepsake photo preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeImagePreview}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-burgundy text-cream flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                          aria-label="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 border-dashed border-burgundy/20 bg-cream/40 hover:bg-cream hover:border-burgundy/40 text-burgundy cursor-pointer transition-all">
                        <Camera className="w-4 h-4 text-burgundy" />
                        <span className="text-xs font-bold">
                          Add Photo (JPG, PNG, HEIC)
                        </span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Validation Error Alert */}
                  {formValidationError && (
                    <div
                      role="alert"
                      className="p-3 rounded-xl bg-rose/15 border border-rose/30 text-rose-deep text-xs flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-burgundy" />
                      <span>{formValidationError}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full bg-burgundy hover:bg-burgundy-deep text-cream py-3.5 px-6 rounded-2xl font-bold text-sm shadow-craft-soft hover:shadow-craft-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Review</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= Photo Lightbox / Zoom Modal ================= */}
      {zoomImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Customer review photo preview"
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-deep/80 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-paper rounded-3xl overflow-hidden shadow-craft-modal border border-burgundy/20"
          >
            <button
              type="button"
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-cream text-burgundy flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
              aria-label="Close photo preview"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="aspect-[4/3] sm:aspect-[16/10] bg-blush/20 overflow-hidden flex items-center justify-center">
              <ImageWithFallback
                src={zoomImage.src}
                alt={zoomImage.title || 'Customer unboxing full view'}
                gradient="linear-gradient(150deg,#FFE5EC,#FB6F92 55%,#881337)"
                className="w-full h-full object-contain bg-black/5"
              />
            </div>
            <div className="p-4 sm:p-5 flex items-center justify-between bg-paper border-t border-burgundy/10">
              <div className="min-w-0 pr-3">
                <div className="font-serif text-base sm:text-lg font-bold text-burgundy-deep truncate break-words">
                  {zoomImage.title}
                </div>
                {zoomImage.sub && (
                  <div className="text-xs text-rose-deep font-semibold truncate break-words">
                    {zoomImage.sub}
                  </div>
                )}
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-cream text-burgundy-deep border border-burgundy/15 shrink-0">
                Verified Keepsake
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
