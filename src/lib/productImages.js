import { frameImages } from '../assets/frames/index.js';
import customFramesImg from '../assets/hero/custom-frames.jpg';
import giftBoxImg from '../assets/hero/gift-box.jpg';
import polaroidBouquetImg from '../assets/hero/polaroid-bouquet.jpg';
import lilyBouquetImg from '../assets/hero/pipe-cleaner-lily.jpg';
import embroideredImg from '../assets/hero/embroidered-keepsake.jpg';
import hamperBouquetImg from '../assets/hero/hamper-bouquet.jpg';
import foreverFlowerBouquetImg from '../assets/hero/forever-flower-bouquet.png';
import pinkLilyBouquetImg from '../assets/hero/pink-lily-forever-bouquet.png';
import clayGoodiesImg from '../assets/hero/clay-goodies.png';

/**
 * Mapping of all catalog slugs / IDs to their authentic imported product images
 */
export const PRODUCT_ASSET_MAP = {
  // Frames
  'frame-bw-popup': [frameImages.bwPopup],
  'frame-cutout-sticker': [frameImages.cutoutSticker],
  'frame-4x4-heart-cutout': [frameImages.miniSquare],
  'frame-4x4-aesthetic-cutout': [frameImages.miniSquare2],
  'frame-popup-with-text': [frameImages.popupWithText],
  'frame-instagram-layout': [frameImages.instagramLayout],
  'frame-quote': [frameImages.quote],
  'frame-scrapbook': [frameImages.scrapbookSpotify, frameImages.scrapbook2, frameImages.scrapbook],
  'frame-birthday-special': [frameImages.birthdaySpecial],
  'frame-birthday-board': [frameImages.a4BirthdayBoard],
  'frame-memory-grid': [frameImages.a4MemoryGrid],
  'frame-family-grid-collage': [frameImages.familyGridCollage],
  'frame-polaroid-popup': [frameImages.a4PolaroidPopup],
  'frame-3d-popup': [frameImages.a4Popup],
  'Moonlight Memory Frame': [frameImages.scrapbook2],
  'Vintage Wooden Frame Set': [customFramesImg],
  'Us, In Every Season Frame': [frameImages.scrapbookSpotify],

  // Magazines
  'm1': ['https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80'],
  'm2': ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'],

  // Hampers
  'hamper-bouquet': [hamperBouquetImg, giftBoxImg],
  'polaroid-bouquet': [polaroidBouquetImg],
  'Rosewood Polaroid Bunch': [polaroidBouquetImg],
  'Blush Polaroid Bouquet': [polaroidBouquetImg],
  'Love Letter Keepsake Box': [giftBoxImg],
  'Milestone Memory Box': [giftBoxImg],
  'Birthday Wish Jar': [giftBoxImg],

  // Add-ons
  'a2': [lilyBouquetImg],
  'a3': [embroideredImg],
  'addon-clay-goodies': [clayGoodiesImg],

  // General Gifts
  'gift-forever-bloom-bouquet': [foreverFlowerBouquetImg],
  'gift-pink-forever-bouquet': [pinkLilyBouquetImg],
};

/**
 * Mapping of keywords / file paths to real imported assets
 */
export const PATH_TO_ASSET_MAP = {
  'frame-bw-popup': frameImages.bwPopup,
  'frame-cutout-sticker': frameImages.cutoutSticker,
  'frame-mini-square-2': frameImages.miniSquare2,
  'frame-mini-square': frameImages.miniSquare,
  'frame-popup-with-text': frameImages.popupWithText,
  'frame-instagram-layout': frameImages.instagramLayout,
  'frame-quote': frameImages.quote,
  'frame-scrapbook-spotify': frameImages.scrapbookSpotify,
  'frame-scrapbook-2': frameImages.scrapbook2,
  'frame-scrapbook': frameImages.scrapbook,
  'frame-birthday-special': frameImages.birthdaySpecial,
  'frame-birthday-board': frameImages.a4BirthdayBoard,
  'frame-memory-grid': frameImages.a4MemoryGrid,
  'frame-polaroid-popup': frameImages.a4PolaroidPopup,
  'frame-3d-popup': frameImages.a4Popup,
  'frame-family-grid-collage': frameImages.familyGridCollage,
  'custom-frames': customFramesImg,
  'gift-box': giftBoxImg,
  'polaroid-bouquet': polaroidBouquetImg,
  'pipe-cleaner-lily': lilyBouquetImg,
  'embroidered-keepsake': embroideredImg,
  'hamper-bouquet': hamperBouquetImg,
  'forever-flower-bouquet': foreverFlowerBouquetImg,
  'pink-lily-forever-bouquet': pinkLilyBouquetImg,
  'clay-goodies': clayGoodiesImg,
};

/**
 * Resolves the genuine, working image URL for any product record.
 * @param {Object} product
 * @returns {string} Genuine image URL
 */
export function resolveProductImage(product) {
  if (!product) return customFramesImg;

  // 1. Check raw image candidates
  const candidates = [
    product.image_url,
    product.image,
    product.imageUrl,
    Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null,
  ].filter(Boolean);

  for (const raw of candidates) {
    if (typeof raw !== 'string') continue;

    // A. Remote URLs or base64 data URLs work directly
    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
      return raw;
    }

    // B. Check if it matches a known imported asset in PATH_TO_ASSET_MAP
    for (const [key, assetUrl] of Object.entries(PATH_TO_ASSET_MAP)) {
      if (raw.includes(key)) {
        return assetUrl;
      }
    }

    // C. Convert relative '/src/assets/' path to public '/assets/' path
    if (raw.startsWith('/src/assets/')) {
      return raw.replace('/src/assets/', '/assets/');
    }

    if (raw.startsWith('/') || raw.startsWith('./')) {
      return raw;
    }
  }

  // 2. Check by product slug or id or title in PRODUCT_ASSET_MAP
  const key = product.slug || product.id || product.title;
  if (key && PRODUCT_ASSET_MAP[key]) {
    return PRODUCT_ASSET_MAP[key][0];
  }

  // Match by title
  if (product.title) {
    for (const [mapKey, imgs] of Object.entries(PRODUCT_ASSET_MAP)) {
      if (product.title.toLowerCase().includes(mapKey.toLowerCase())) {
        return imgs[0];
      }
    }
  }

  // 3. Category based fallback
  if (product.category === 'magazines') {
    return 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80';
  }
  if (product.category === 'hampers') {
    return hamperBouquetImg;
  }
  if (product.category === 'addons') {
    return embroideredImg;
  }
  if (product.category === 'general') {
    return foreverFlowerBouquetImg;
  }
  return frameImages.bwPopup || customFramesImg;
}

/**
 * Resolves the complete array of images for a product
 * @param {Object} product
 * @returns {string[]} Array of image URLs
 */
export function resolveProductImages(product) {
  if (!product) return [customFramesImg];

  const primary = resolveProductImage(product);

  const rawList =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.filter(Boolean)
      : [primary];

  const resolved = rawList.map((item) => {
    if (typeof item === 'string') {
      if (item.startsWith('http://') || item.startsWith('https://') || item.startsWith('data:')) {
        return item;
      }
      for (const [key, assetUrl] of Object.entries(PATH_TO_ASSET_MAP)) {
        if (item.includes(key)) return assetUrl;
      }
      if (item.startsWith('/src/assets/')) {
        return item.replace('/src/assets/', '/assets/');
      }
    }
    return item;
  });

  const key = product.slug || product.id;
  if (key && PRODUCT_ASSET_MAP[key] && PRODUCT_ASSET_MAP[key].length > 1) {
    const mapImgs = PRODUCT_ASSET_MAP[key];
    const set = new Set([...resolved, ...mapImgs]);
    return Array.from(set);
  }

  return resolved.length > 0 ? resolved : [primary];
}
