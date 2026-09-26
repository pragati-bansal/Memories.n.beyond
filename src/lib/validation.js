import { z } from 'zod';
import { logger } from './logger';

/**
 * -------------------------------------------------------------
 * 1. Strict Validation Schemas for NEW User Submissions
 * -------------------------------------------------------------
 */

// User Review Form submission validation
export const newReviewSubmissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Please enter your name.')
    .max(100, 'Name must be within 100 characters.'),
  city: z
    .string()
    .trim()
    .max(100, 'City name is too long.')
    .optional()
    .default('Verified Buyer'),
  productName: z
    .string()
    .trim()
    .max(150, 'Product name is too long.')
    .optional()
    .default('Handmade Keepsake'),
  stars: z
    .number()
    .int('Rating must be an integer.')
    .min(1, 'Please select at least 1 star.')
    .max(5, 'Rating cannot exceed 5 stars.'),
  text: z
    .string()
    .trim()
    .min(3, 'Review must be at least 3 characters.')
    .max(3000, 'Review cannot exceed 3000 characters.'),
  image: z.string().nullable().optional(),
});

// Admin Product Create / Update Form submission validation
export const newProductSubmissionSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Product title is required.')
      .max(200, 'Title cannot exceed 200 characters.'),
    category: z.enum(['frames', 'magazines', 'hampers', 'addons', 'general'], {
      errorMap: () => ({ message: 'Please select a valid category.' }),
    }),
    tag: z.string().trim().max(100, 'Tag is too long.').optional(),
    price: z
      .number({ invalid_type_error: 'Price must be a valid number.' })
      .positive('Price must be greater than 0.'),
    description: z
      .string()
      .trim()
      .max(2500, 'Description cannot exceed 2500 characters.')
      .optional(),
    sizes: z
      .array(
        z.object({
          size: z.string().min(1, 'Size key is required.'),
          label: z.string().optional(),
          price: z.number().positive().optional(),
        })
      )
      .optional(),
    images: z
      .array(z.string().min(1, 'Image link cannot be empty.'))
      .min(1, 'Please upload or add at least one product image.'),
    imageUrl: z.string().optional(),
    image_url: z.string().optional(),
    requires_photo: z.boolean().optional(),
    max_photos: z.number().int().min(1).max(50).optional(),
    requires_text: z.boolean().optional(),
    requires_date: z.boolean().optional(),
    details: z.array(z.string()).optional(),
  })
  .passthrough();

// Order Record submission validation
export const newOrderSubmissionSchema = z
  .object({
    customer_name: z.string().trim().max(120).optional(),
    customer_phone: z.string().trim().max(25).optional(),
    product_id: z.string().optional(),
    product_title: z.string().optional(),
    selected_size: z.string().optional(),
    price: z.number().optional(),
    customization_text: z.string().max(1000).optional(),
    photo_url: z.string().optional(),
    special_notes: z.string().max(1000).optional(),
  })
  .passthrough();

/**
 * -------------------------------------------------------------
 * 2. Non-Destructive Legacy Data Schemas (.optional() / .nullable())
 * CRITICAL: Legacy or existing database records are NEVER dropped
 * -------------------------------------------------------------
 */

export const legacyProductSchema = z
  .object({
    id: z.string().nullable().optional(),
    slug: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
    tag: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    price: z.union([z.number(), z.string()]).nullable().optional(),
    description: z.string().nullable().optional(),
    gradient: z.string().nullable().optional(),
    images: z.array(z.string()).nullable().optional(),
    imageUrl: z.string().nullable().optional(),
    image_url: z.string().nullable().optional(),
    sizes: z.array(z.any()).nullable().optional(),
    customization_options: z.record(z.any()).nullable().optional(),
    details: z.array(z.string()).nullable().optional(),
    updatedAt: z.string().nullable().optional(),
  })
  .passthrough();

export const legacyReviewSchema = z
  .object({
    id: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    productName: z.string().nullable().optional(),
    stars: z.number().nullable().optional(),
    text: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    date: z.string().nullable().optional(),
    isUserSubmitted: z.boolean().nullable().optional(),
  })
  .passthrough();

/**
 * Safely parses an array of legacy products without dropping or removing any item.
 * If validation fails or has unexpected types, the original item is safely preserved.
 */
export function safeParseLegacyProducts(products) {
  if (!Array.isArray(products)) return [];
  return products.map((item) => {
    try {
      const res = legacyProductSchema.safeParse(item);
      return res.success ? res.data : item;
    } catch (err) {
      logger.warn('validation', 'Legacy product parsing fallback applied', { id: item?.id });
      return item;
    }
  });
}

/**
 * Safely parses an array of legacy reviews without dropping or removing any item.
 */
export function safeParseLegacyReviews(reviews) {
  if (!Array.isArray(reviews)) return [];
  return reviews.map((item) => {
    try {
      const res = legacyReviewSchema.safeParse(item);
      return res.success ? res.data : item;
    } catch (err) {
      logger.warn('validation', 'Legacy review parsing fallback applied', { id: item?.id });
      return item;
    }
  });
}

/**
 * Safely extracts the first human-readable validation error from a ZodError,
 * supporting both Zod v3 (error.errors) and Zod v4 (error.issues).
 */
export function getFirstZodErrorMessage(error, fallback = 'Invalid input provided.') {
  if (!error) return fallback;
  if (Array.isArray(error.issues) && error.issues.length > 0) {
    return error.issues[0]?.message || fallback;
  }
  if (Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors[0]?.message || fallback;
  }
  return error.message || fallback;
}

