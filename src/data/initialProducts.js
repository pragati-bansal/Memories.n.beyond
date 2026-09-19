import customFramesImg from '../assets/hero/custom-frames.jpg';
import giftBoxImg from '../assets/hero/gift-box.jpg';
import polaroidBouquetImg from '../assets/hero/polaroid-bouquet.jpg';
import lilyBouquetImg from '../assets/hero/pipe-cleaner-lily.jpg';
import embroideredImg from '../assets/hero/embroidered-keepsake.jpg';

export const initialProducts = [
  // ===================== 1. FRAMES =====================
  {
    id: 'f1',
    category: 'frames',
    tag: 'Custom Photo Frame',
    title: 'Signature Memories Frame Collection',
    price: 399,
    description: 'Bespoke photo frames crafted with your favourite memories. Available in multiple tabletop and wall sizes with premium matte or gloss print finish and protective glass acrylic.',
    gradient: 'linear-gradient(150deg,#F2E5DC,#C98D89 55%,#6E1F2B)',
    images: [
      customFramesImg,
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: [
      { size: '4x6 in', label: 'Mini Desk (4x6 in)', price: 399 },
      { size: '5x7 in', label: 'Classic Tabletop (5x7 in)', price: 499 },
      { size: '8x10 in', label: 'Portrait Grand (8x10 in)', price: 749 },
      { size: '12x18 in', label: 'Gallery Wall Collage (12x18 in)', price: 1299 },
    ],
    customization_options: {
      requires_photo: true,
      max_photos: 10,
      requires_text: true,
      text_placeholder: 'Custom text / name / date (e.g. Happy Birthday / Us Forever)',
      requires_date: true,
    },
    details: [
      'Available in 4 versatile sizes with wooden borders',
      'High definition archival photo print included',
      'Tabletop stand and wall mount hooks provided',
      'Free personalization of name and special date',
    ],
  },
  {
    id: 'f2',
    category: 'frames',
    tag: 'Custom Photo Frame',
    title: 'Moonlight Glow Memory Frame',
    price: 499,
    description: 'Warm ambient wooden frame with high-resolution photo print and gold foiled lettering. Ideal for couple anniversaries, birthdays, and bedroom desks.',
    gradient: 'linear-gradient(150deg,#E8B8AE,#C98D89 55%,#8A4A47)',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: [
      { size: '5x7 in', label: '5x7 in Desk Frame', price: 499 },
      { size: '6x8 in', label: '6x8 in Portrait', price: 599 },
      { size: '8x10 in', label: '8x10 in Large Frame', price: 799 },
      { size: 'A4 Size', label: 'A4 Wall Hanging Frame', price: 899 },
    ],
    customization_options: {
      requires_photo: true,
      max_photos: 2,
      requires_text: true,
      text_placeholder: 'Engraved caption or quote',
      requires_date: false,
    },
    details: [
      'High-grade border in walnut or natural pine finish',
      'UV protective coating to prevent fading',
      'Option for warm fairy LED backlight on request',
    ],
  },
  {
    id: 'f3',
    category: 'frames',
    tag: 'Multi-Photo Frame',
    title: 'Vintage Multi-Photo Story Frame',
    price: 899,
    description: 'Display a journey of photos in one gorgeous multi-window frame. Solid wood framing with antique textured finish and personalized engraved plaque.',
    gradient: 'linear-gradient(150deg,#F0D6C8,#B98A4E 55%,#6E1F2B)',
    images: [
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&auto=format&fit=crop&q=80',
      customFramesImg,
    ],
    sizes: [
      { size: 'Triple Window (3 Photos)', label: 'Triple Frame Set (3 Photos)', price: 899 },
      { size: 'Four Seasons (4 Photos)', label: 'Quad Frame Set (4 Photos)', price: 1199 },
      { size: 'Family Story (6 Photos)', label: 'Deluxe Story Wall (6 Photos)', price: 1599 },
    ],
    customization_options: {
      requires_photo: true,
      max_photos: 6,
      requires_text: true,
      text_placeholder: 'Plaque message & family/couple name',
      requires_date: true,
    },
    details: [
      'Multi-aperture bevelled photo mount',
      'Personalized plaque with date & custom heading',
      'Solid wood frame with antique distressed polish',
    ],
  },

  // ===================== 2. MAGAZINES =====================
  {
    id: 'm1',
    category: 'magazines',
    tag: 'Personalized Magazine',
    title: 'Vogue & Celebrity Memory Magazine Issue',
    price: 499,
    description: 'Make your loved one the cover star! Complete with custom headline, inside articles, romantic love stories, funny horoscopes, and glossy photo spreads.',
    gradient: 'linear-gradient(150deg,#FDF2F8,#EFC6C0 55%,#881337)',
    images: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: [
      { size: 'A4 Poster Cover', label: 'Framed A4 Magazine Cover Poster', price: 499 },
      { size: '4-Page Edition', label: '4-Page Glossy Mini Magazine', price: 899 },
      { size: '8-Page Storybook', label: '8-Page Full Feature Magazine', price: 1399 },
      { size: '12-Page Hardcover', label: '12-Page Deluxe Hardbound Edition', price: 1899 },
    ],
    customization_options: {
      requires_photo: true,
      max_photos: 15,
      requires_text: true,
      text_placeholder: 'Magazine title, issue month & headline stories',
      requires_date: true,
    },
    details: [
      'High-gloss 250 GSM premium art paper printing',
      'Customized headlines, barcodes, and editorial layout',
      'Design proof shared on WhatsApp for approval before print',
      'Includes protective keepsake sleeve or luxury box',
    ],
  },
  {
    id: 'm2',
    category: 'magazines',
    tag: 'Anniversary Edition',
    title: 'Our Love Story — Special Anniversary Magazine',
    price: 899,
    description: 'A glossy tribute to your relationship journey. Includes your first date story, memorable trips, inside jokes, and full-page high-definition photograph layouts.',
    gradient: 'linear-gradient(150deg,#FBEFE8,#C98D89 55%,#4A141D)',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: [
      { size: '4-Page Issue', label: '4-Page Romantic Edition', price: 899 },
      { size: '8-Page Issue', label: '8-Page Complete Story Issue', price: 1399 },
      { size: '16-Page Deluxe', label: '16-Page Coffee Table Book Edition', price: 2199 },
    ],
    customization_options: {
      requires_photo: true,
      max_photos: 20,
      requires_text: true,
      text_placeholder: 'Couples names, anniversary date & quote',
      requires_date: true,
    },
    details: [
      'Full colour duplex printing on thick satin finish stock',
      'Curated editorial style crafted by our designers',
      'Delivered in gold-foiled satin ribbon wrap',
    ],
  },

  // ===================== 3. HAMPERS =====================
  {
    id: 'h1',
    category: 'hampers',
    tag: 'Luxury Gift Hamper',
    title: 'Signature MB Heart Keepsake Hamper',
    price: 999,
    description: 'Black and gold heart wrapped luxury gift hamper boxes sealed with custom MB emblem. Packed with couple figurines, custom frames, personalized letters, and artisanal chocolates.',
    gradient: 'linear-gradient(150deg,#EFC6C0,#C98D89 50%,#6E1F2B)',
    images: [
      giftBoxImg,
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: [
      { size: 'Mini Hamper', label: 'Mini Keepsake Box (Figurine + Mini Frame + Card)', price: 999 },
      { size: 'Couple Luxe Box', label: 'Couple Luxe Box (Figurines + 5x7 Frame + Hanky + Treats)', price: 1699 },
      { size: 'Grand Royal Hamper', label: 'Grand Royal Hamper (Complete Set + Bouquet + Large Frame)', price: 2499 },
    ],
    customization_options: {
      requires_photo: true,
      max_photos: 8,
      requires_text: true,
      text_placeholder: 'Occasion, recipient name & card message',
      requires_date: true,
    },
    details: [
      'Includes authentic MB gold foil seal packaging',
      'Rigid keepsake storage box made to be reused forever',
      'Packed with decorative shred, warm lights & gift message',
      'Carefully bubble-cushioned for safe PAN-India delivery',
    ],
  },
  {
    id: 'h2',
    category: 'hampers',
    tag: 'Surprise Box',
    title: 'Milestone Memory Surprise Explosion Box',
    price: 1199,
    description: 'A multi-layered explosion keepsake box that blossoms open with cascading photos, pull-out love letters, and a center gift surprise compartment.',
    gradient: 'linear-gradient(150deg,#F6DEDA,#EFC6C0 50%,#B4884E)',
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
      giftBoxImg,
    ],
    sizes: [
      { size: 'Standard 2-Layer', label: 'Standard 2-Layer Box (15 Photos)', price: 1199 },
      { size: 'Mega 3-Layer', label: 'Mega 3-Layer Box (25 Photos + Center Trinket)', price: 1699 },
    ],
    customization_options: {
      requires_photo: true,
      max_photos: 25,
      requires_text: true,
      text_placeholder: 'Personalized messages for each pocket',
      requires_date: true,
    },
    details: [
      'Handcrafted heavy cardstock construction',
      'Interactive flip-cards, accordion folds, and secret pockets',
      'Center compartment fits figurines, jewelry, or chocolates',
    ],
  },

  // ===================== 4. ADD ONS =====================
  {
    id: 'a1',
    category: 'addons',
    tag: 'Add-on Keepsake',
    title: 'Polaroid Memory Photo Bouquet',
    price: 599,
    description: 'A stunning bouquet arrangement of your real polaroid memories wrapped in luxury waterproof paper, adorned with butterfly motifs, fairy lights, and a satin bow.',
    gradient: 'linear-gradient(150deg,#E9C7C2,#A9645F 55%,#4A141D)',
    images: [
      polaroidBouquetImg,
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&auto=format&fit=crop&q=80',
    ],
    sizes: [
      { size: '6 Photos', label: 'Mini Bouquet (6 Polaroid Photos)', price: 599 },
      { size: '9 Photos', label: 'Classic Bouquet (9 Polaroid Photos + Lights)', price: 799 },
      { size: '12 Photos', label: 'Grand Deluxe Bouquet (12 Polaroid Photos + Lights)', price: 999 },
    ],
    customization_options: {
      requires_photo: true,
      max_photos: 12,
      requires_text: true,
      text_placeholder: 'Ribbon color & personal gift note',
      requires_date: false,
    },
    details: [
      'Authentic glossy photo card polaroids with custom captions',
      'Warm LED micro-string fairy lights with battery switch included',
      'Luxury wrapping paper with gold accents and ribbon bow',
    ],
  },
  {
    id: 'a2',
    category: 'addons',
    tag: 'Add-on Keepsake',
    title: 'Everlasting Handmade Lily Flower Bouquet',
    price: 349,
    description: 'Intricately handcrafted pipe-cleaner lily flower in soft blush pink with realistic stamen, deep green leaves, and gold-trimmed wrapping. A flower that never withers.',
    gradient: 'linear-gradient(150deg,#F7E1E3,#EFC6C0 55%,#C98D89)',
    images: [
      lilyBouquetImg,
    ],
    sizes: [
      { size: 'Single Stem', label: 'Single Lily Stem Bouquet', price: 349 },
      { size: '3-Stem Bunch', label: '3-Stem Full Lily Bloom Bouquet', price: 749 },
      { size: '5-Stem Deluxe', label: '5-Stem Grand Lily Arrangement', price: 1199 },
    ],
    customization_options: {
      requires_photo: false,
      max_photos: 0,
      requires_text: true,
      text_placeholder: 'Handwritten message card (e.g. For my favorite person)',
      requires_date: false,
    },
    details: [
      '100% handcrafted velvety pipe-cleaner petals',
      'Never fades or wilts — stays fresh forever',
      'Includes miniature message card & gift ribbon',
    ],
  },
  {
    id: 'a3',
    category: 'addons',
    tag: 'Add-on Keepsake',
    title: 'Embroidered Keepsake Handkerchief',
    price: 399,
    description: 'Fine white cotton handkerchief with hand-embroidered romantic lettering ("Hi Handsome ❤️" or custom text) and red heart stitching. An intimate, sentimental gift.',
    gradient: 'linear-gradient(150deg,#FBF6F2,#E8B8AE 55%,#8A4A47)',
    images: [
      embroideredImg,
    ],
    sizes: [
      { size: 'Single Piece', label: 'Single Custom Embroidered Handkerchief', price: 399 },
      { size: 'Couple Set (2 Pcs)', label: 'His & Hers Couple Pair (2 Handkerchiefs)', price: 699 },
    ],
    customization_options: {
      requires_photo: false,
      max_photos: 0,
      requires_text: true,
      text_placeholder: 'Text to embroider (e.g. Hi Handsome / Yours Always / Initials)',
      requires_date: false,
    },
    details: [
      '100% breathable fine cotton with stitched borders',
      'Hand-stitched embroidery thread with heart motif',
      'Folded neatly in wax-sealed translucent parchment envelope',
    ],
  },
  {
    id: 'a4',
    category: 'addons',
    tag: 'Add-on Keepsake',
    title: 'Couple Miniature Figurine & Wish Jar Set',
    price: 299,
    description: 'Charming romantic couple figurines and mini wish jars to complete any gift setup. Placed lovingly inside hampers or alongside photo frames.',
    gradient: 'linear-gradient(150deg,#F6DEDA,#EFC6C0 50%,#B4884E)',
    images: [
      'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&auto=format&fit=crop&q=80',
      giftBoxImg,
    ],
    sizes: [
      { size: 'Couple Figurine', label: 'Hand-painted Couple Figurine', price: 299 },
      { size: 'Wish Jar with Scroll', label: 'Glass Wish Jar with 10 Rolled Notes', price: 449 },
      { size: 'Figurine + Jar Duo', label: 'Complete Figurine & Wish Jar Combo', price: 649 },
    ],
    customization_options: {
      requires_photo: true,
      max_photos: 5,
      requires_text: true,
      text_placeholder: 'Wishes or personal notes to roll inside the jar',
      requires_date: false,
    },
    details: [
      'High-detail hand-painted polymer resin figurines',
      'Cork-stoppered glass jar with miniature rolled parchment notes',
      'Great companion addition for gift hampers and desk setups',
    ],
  },
];
