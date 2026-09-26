-- ==============================================================================
-- Memories n Beyond - Recovered Products Full Migration Seed (23 Products)
-- Run this in the Supabase SQL Editor to permanently populate all products.
-- ==============================================================================

-- 1. Ensure RLS Policy allows public insert/update
DROP POLICY IF EXISTS "Allow public insert/update products" ON public.products;
CREATE POLICY "Allow public insert/update products"
    ON public.products
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- 2. Populate / Upsert all 23 products

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'frame-bw-popup',
  'B&W Pop-up Frame',
  'frames',
  399,
  'Monochrome minimalist elegance with 3D pop-up photo cutouts, waterproof archival matte prints, and a protective acrylic glass shield.',
  'B&W Pop-up',
  'linear-gradient(150deg,#2B2D42,#8D99AE 55%,#EDF2F4)',
  ARRAY['/src/assets/frames/frame-bw-popup.png']::text[],
  '[{"size":"5x7","label":"5x7 in (Tabletop)","price":399},{"size":"A4","label":"A4 Size (8.3 x 11.7 in)","price":499}]'::jsonb,
  '{"requires_photo":true,"max_photos":5,"requires_text":true,"text_placeholder":"Custom caption / names / special date","requires_date":true}'::jsonb,
  ARRAY['Layered 3D pop-up depth with precision laser cutouts', 'Timeless black and white aesthetic framing', 'Includes sturdy tabletop stand and wall mounting hooks', 'Premium archival matte photo print finish']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'frame-cutout-sticker',
  'Cutout Sticker Frame',
  'frames',
  399,
  'Playful customized photo cutout with waterproof gloss vinyl stickers, aesthetic doodles, and protective clear acrylic glass.',
  'Cutout Sticker',
  'linear-gradient(150deg,#FFE5EC,#FB6F92 55%,#881337)',
  ARRAY['/src/assets/frames/frame-cutout-sticker.png']::text[],
  '[{"size":"5x7","label":"5x7 in (Tabletop)","price":399},{"size":"A4","label":"A4 Size (8.3 x 11.7 in)","price":499}]'::jsonb,
  '{"requires_photo":true,"max_photos":4,"requires_text":true,"text_placeholder":"Nicknames, inside jokes or sticker captions","requires_date":false}'::jsonb,
  ARRAY['Artisan handcrafted silhouette cutouts', 'High-gloss vinyl stickers and theme embellishments', 'Protective clear acrylic glass front', 'Free personalization with recipient names']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'frame-4x4-heart-cutout',
  'Popup Frame',
  'frames',
  299,
  'Pocket-sized charm featuring precision photo cutout, waterproof archival matte print, and green radiating retro heart backdrop in a 4x4 tabletop black frame.',
  '4x4 Mini Popup',
  'linear-gradient(150deg,#D8F3DC,#95D5B2 55%,#2D6A4F)',
  ARRAY['/src/assets/frames/frame-mini-square.png']::text[],
  '[{"size":"4x4","label":"4x4 in (Tabletop Mini)","price":299}]'::jsonb,
  '{"requires_photo":true,"max_photos":1,"requires_text":true,"text_placeholder":"Custom caption, name or special date (optional)","requires_date":false}'::jsonb,
  ARRAY['Compact 4x4 inch square desktop & tabletop frame', 'Precision handcrafted silhouette cutout with clean white outline', 'Trendy retro radiating heart aesthetic background in sage green', 'High-definition archival photo print with protective front', 'Sturdy kickstand easel ready for desks, consoles & nightstands']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'frame-4x4-aesthetic-cutout',
  'Popup Frame',
  'frames',
  299,
  'Chic portrait cutout with waterproof archival print and concentric heart contours in a sleek 4x4 desktop frame with protective shield.',
  '4x4 Mini Popup',
  'linear-gradient(150deg,#E8F5E9,#A5D6A7 55%,#1B4332)',
  ARRAY['/src/assets/frames/frame-mini-square-2.png']::text[],
  '[{"size":"4x4","label":"4x4 in (Tabletop Mini)","price":299}]'::jsonb,
  '{"requires_photo":true,"max_photos":1,"requires_text":true,"text_placeholder":"Custom caption, name or special date (optional)","requires_date":false}'::jsonb,
  ARRAY['Compact 4x4 inch square desktop & tabletop frame', 'Artisan crafted photo cutout with concentric heart tunnel backdrop', 'Minimalist modern dark frame with crystal-clear shield', 'Archival matte finish print that never fades', 'Ideal keepsake gift for besties, partners & birthday surprises']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'frame-popup-with-text',
  'Popup with Text Frame',
  'frames',
  299,
  'Layered 3D photo cutout with waterproof print, custom message bubbles, aesthetic bow, and a dreamy blue glowing heart backdrop in a 4x4 tabletop frame.',
  '4x4 Popup',
  'linear-gradient(150deg,#E0F2FE,#38BDF8 55%,#0284C7)',
  ARRAY['/src/assets/frames/frame-popup-with-text.png']::text[],
  '[{"size":"4x4","label":"4x4 in (Tabletop Mini)","price":299}]'::jsonb,
  '{"requires_photo":true,"max_photos":1,"requires_text":true,"text_placeholder":"Custom caption, text bubble or names (e.g. \"I love you\", \"my whole heart\")","requires_date":false}'::jsonb,
  ARRAY['Exclusively available in 4x4 inch compact square tabletop format', 'Layered 3D photo popup cutout with clean outline', 'Custom text bubbles, nicknames & aesthetic bow accents', 'Radiant glowing heart gradient background in sky blue', 'Includes sturdy kickstand easel for desks, nightstands & workstations']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'frame-instagram-layout',
  'Instagram Layout Frame',
  'frames',
  399,
  'Recreate your iconic social moments with Instagram UI elements, custom song badge, like counter, and waterproof ultra-HD lab prints.',
  'Instagram Layout',
  'linear-gradient(150deg,#FDF2F8,#E0A96D 55%,#833AB4)',
  ARRAY['/src/assets/frames/frame-instagram-layout.png']::text[],
  '[{"size":"5x7","label":"5x7 in (Tabletop)","price":399},{"size":"A4","label":"A4 Size (8.3 x 11.7 in)","price":499}]'::jsonb,
  '{"requires_photo":true,"max_photos":2,"requires_text":true,"text_placeholder":"@YourHandle, like count & custom caption","requires_date":true}'::jsonb,
  ARRAY['Authentic Instagram post and story feed layout', 'Customizable likes, comments & audio tag display', 'Ultra-HD vibrant laboratory photo print', 'Ideal for couples, best friends & birthday celebrations']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'frame-quote',
  'Quote Frame',
  'frames',
  399,
  'Evocative typography, heartfelt quotes, and cherished portraits paired with waterproof non-glare archival protective glass front.',
  'Quote Frame',
  'linear-gradient(150deg,#FAF0CA,#EE964B 55%,#6E1F2B)',
  ARRAY['/src/assets/frames/frame-quote.png']::text[],
  '[{"size":"5x7","label":"5x7 in (Tabletop)","price":399},{"size":"A4","label":"A4 Size (8.3 x 11.7 in)","price":499}]'::jsonb,
  '{"requires_photo":true,"max_photos":1,"requires_text":true,"text_placeholder":"Your heartfelt quote, song lyrics, or personal note","requires_date":true}'::jsonb,
  ARRAY['Elegant modern serif & calligraphy typography', 'High-resolution portrait pairing with custom message', 'Tabletop kickstand and dual wall hanging hooks', 'Non-glare archival protective glass front']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'frame-scrapbook',
  'Scrapbook Frame',
  'frames',
  399,
  'Artisan scrapbook collage featuring real waterproof polaroid photo prints, custom Spotify lyrics card, textured fabric swatch & floral charms in a classic frame.',
  'Scrapbook',
  'linear-gradient(150deg,#FCE7F3,#F472B6 55%,#9D174D)',
  ARRAY['/src/assets/frames/frame-scrapbook-spotify.png', '/src/assets/frames/frame-scrapbook-2.png', '/src/assets/frames/frame-scrapbook.png']::text[],
  '[{"size":"5x7","label":"5x7 in (Tabletop)","price":399},{"size":"A4","label":"A4 Size (8.3 x 11.7 in)","price":499}]'::jsonb,
  '{"requires_photo":true,"max_photos":4,"requires_text":true,"text_placeholder":"Song title, artist name, favorite lyrics & custom note","requires_date":true}'::jsonb,
  ARRAY['Available in 5x7 in Tabletop and A4 Size formats', 'Personalized with your favorite photo styled as an authentic polaroid', 'Custom Spotify song card with track title, artist name & heartfelt lyrics', 'Pink woven burlap backdrop, gingham fabric accents & hand-cut floral charms', 'Includes sturdy tabletop kickstand and wall mounting hardware']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'frame-birthday-special',
  'Birthday Special Milestone Frame',
  'frames',
  499,
  'Expansive gallery statement frame honoring milestones with waterproof multi-photo timeline prints, hero portrait, and personalized tribute message.',
  'Birthday Special',
  'linear-gradient(150deg,#FFE5D9,#D88373 55%,#6E1F2B)',
  ARRAY['/src/assets/frames/frame-birthday-special.png']::text[],
  '[{"size":"A4","label":"A4 Size (8.3 x 11.7 in)","price":499},{"size":"18x24","label":"18x24 in (Grand Showcase)","price":1499}]'::jsonb,
  '{"requires_photo":true,"max_photos":15,"requires_text":true,"text_placeholder":"Celebrant name, milestone age, and special birthday tribute message","requires_date":true}'::jsonb,
  ARRAY['Grand gallery-grade statement wall frame', 'Features 1 primary hero photo + milestone snapshots', 'Heavy-duty hanging hardware pre-installed for easy wall mounting', 'Digital WhatsApp proof shared before final lab printing']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'frame-birthday-board',
  'Birthday Board Frame',
  'frames',
  399,
  'Charming milestone board displaying life achievements, favorite memories, and birthday portraits with waterproof anti-reflective matte print.',
  'Birthday Board',
  'linear-gradient(150deg,#E8ECE9,#7BAE7F 55%,#2A4736)',
  ARRAY['/src/assets/frames/frame-birthday-board.png']::text[],
  '[{"size":"5x7","label":"5x7 in (Tabletop)","price":399},{"size":"A4","label":"A4 Size (8.3 x 11.7 in)","price":499}]'::jsonb,
  '{"requires_photo":true,"max_photos":3,"requires_text":true,"text_placeholder":"Name, age, birthday date, 3-5 favorite things/stats","requires_date":true}'::jsonb,
  ARRAY['Customized milestone chalkboard / aesthetic infographic', 'Full premium lab print in matte anti-reflective acrylic', 'Includes dual easel stand for table display & wall hook', 'A memorable keepsake for 1st, 18th, 21st, 25th & 50th birthdays']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'frame-memory-grid',
  'Memory Grid Frame',
  'frames',
  399,
  'Clean modern grid of 9 to 16 curated snapshots with waterproof archival lab prints, precision borders, and personalized title plaque.',
  'Memory Grid',
  'linear-gradient(150deg,#F0EFEB,#D6CCC2 55%,#4A4E69)',
  ARRAY['/src/assets/frames/frame-memory-grid.png']::text[],
  '[{"size":"5x7","label":"5x7 in (Tabletop)","price":399},{"size":"A4","label":"A4 Size (8.3 x 11.7 in)","price":499}]'::jsonb,
  '{"requires_photo":true,"max_photos":16,"requires_text":true,"text_placeholder":"Grid title / year / couple name (e.g. 2024 Memories)","requires_date":true}'::jsonb,
  ARRAY['Balanced 9-photo (3x3) or 16-photo (4x4) high-definition grid', 'Sleek contemporary framing in obsidian black or warm oak', 'Premium thick mount board with bevelled precision', 'Easy photo upload with WhatsApp digital preview check']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'frame-family-grid-collage',
  'Family "This is Us" Grid Collage Frame',
  'frames',
  499,
  'Grand family multi-photo story collage showcasing 10 to 16 snapshots with waterproof archival print and elegant typography in a classic frame.',
  'Grid Collage',
  'linear-gradient(150deg,#FFF3E0,#FFE0B2 55%,#5D4037)',
  ARRAY['/src/assets/frames/frame-family-grid-collage.png']::text[],
  '[{"size":"A4","label":"A4 Size (8.3 x 11.7 in)","price":499},{"size":"18x24","label":"18x24 in (Grand Showcase)","price":1499}]'::jsonb,
  '{"requires_photo":true,"max_photos":16,"requires_text":true,"text_placeholder":"Custom header/surname (e.g. \"family this is us\" or \"The Sharmas\")","requires_date":true}'::jsonb,
  ARRAY['Available in A4 Size and 18x24 in Grand Statement format', 'Curated collage layout accommodating up to 16 family memories', 'Custom calligraphy title: "family this is us" or personalized family name', 'Ultra-HD archival photographic print with anti-glare protective cover', 'Includes tabletop easel for A4 & heavy-duty wall hangers for 18x24']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'frame-polaroid-popup',
  'Polaroid Pop-up Frame',
  'frames',
  399,
  '3D dimensional shadow-box frame with suspended waterproof polaroid photo prints, miniature pegs, and warm depth effects.',
  'Polaroid Pop-up',
  'linear-gradient(150deg,#FBE0E0,#E29578 55%,#832161)',
  ARRAY['/src/assets/frames/frame-polaroid-popup.png']::text[],
  '[{"size":"5x7","label":"5x7 in (Tabletop)","price":399},{"size":"A4","label":"A4 Size (8.3 x 11.7 in)","price":499}]'::jsonb,
  '{"requires_photo":true,"max_photos":8,"requires_text":true,"text_placeholder":"Short handwritten captions for polaroids & header text","requires_date":true}'::jsonb,
  ARRAY['Floating 3D multi-level polaroid layout with physical depth', 'Mini decorative accents and rustic jute/peg styling', 'Deep shadow-box wooden frame construction', 'Crystal clear shatter-proof acrylic shield']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'frame-3d-popup',
  '3D Pop-up Frame',
  'frames',
  399,
  'Multi-layered 3D pop-up frame with waterproof HD cutouts, dramatic dimensional elevation, and deep wooden shadow-box construction.',
  '3D Pop-up',
  'linear-gradient(150deg,#FDE2E4,#C5DEDD 55%,#3D5A80)',
  ARRAY['/src/assets/frames/frame-3d-popup.png']::text[],
  '[{"size":"5x7","label":"5x7 in (Tabletop)","price":399},{"size":"A4","label":"A4 Size (8.3 x 11.7 in)","price":499}]'::jsonb,
  '{"requires_photo":true,"max_photos":4,"requires_text":true,"text_placeholder":"Main focal message, names, anniversary or celebration date","requires_date":true}'::jsonb,
  ARRAY['Multi-tiered dimensional elevation of subject silhouette', 'Atmospheric backdrop with fairy light glow effect option', 'Premium deep wooden shadow-box framing', 'Ready to display on table stands or hang prominently on walls']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'm1',
  'Vogue & Celebrity Memory Magazine Issue',
  'magazines',
  499,
  'Personalized celebrity magazine printed on 250 GSM high-gloss waterproof-coated art paper with custom headlines, stories, and editorial photo spreads.',
  'Personalized Magazine',
  'linear-gradient(150deg,#FDF2F8,#EFC6C0 55%,#881337)',
  ARRAY['https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80']::text[],
  '[{"size":"A4 Poster Cover","label":"Framed A4 Magazine Cover Poster","price":499},{"size":"4-Page Edition","label":"4-Page Glossy Mini Magazine","price":899},{"size":"8-Page Storybook","label":"8-Page Full Feature Magazine","price":1399},{"size":"12-Page Hardcover","label":"12-Page Deluxe Hardbound Edition","price":1899}]'::jsonb,
  '{"requires_photo":true,"max_photos":15,"requires_text":true,"text_placeholder":"Magazine title, issue month & headline stories","requires_date":true}'::jsonb,
  ARRAY['High-gloss 250 GSM premium art paper printing', 'Customized headlines, barcodes, and editorial layout', 'Design proof shared on WhatsApp for approval before print', 'Includes protective keepsake sleeve or luxury box']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'm2',
  'Our Love Story — Special Anniversary Magazine',
  'magazines',
  899,
  'Glossy relationship tribute magazine printed on thick waterproof-coated satin stock with story timelines, inside jokes, and full-page HD photograph spreads.',
  'Anniversary Edition',
  'linear-gradient(150deg,#FBEFE8,#C98D89 55%,#4A141D)',
  ARRAY['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80']::text[],
  '[{"size":"4-Page Issue","label":"4-Page Romantic Edition","price":899},{"size":"8-Page Issue","label":"8-Page Complete Story Issue","price":1399},{"size":"16-Page Deluxe","label":"16-Page Coffee Table Book Edition","price":2199}]'::jsonb,
  '{"requires_photo":true,"max_photos":20,"requires_text":true,"text_placeholder":"Couples names, anniversary date & quote","requires_date":true}'::jsonb,
  ARRAY['Full colour duplex printing on thick satin finish stock', 'Curated editorial style crafted by our designers', 'Delivered in gold-foiled satin ribbon wrap']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'hamper-bouquet',
  'Hamper Bouquet',
  'hampers',
  899,
  'Artisan handcrafted bouquet hamper wrapped in vintage newspaper prints, thoughtfully filled with personalized polaroid photo prints, your favorite snacks, chocolates, and handwritten notes.',
  'Hamper Bouquet',
  'linear-gradient(150deg,#FFF3E0,#FFE0B2 50%,#D97706)',
  ARRAY['/src/assets/hero/hamper-bouquet.jpg']::text[],
  '[{"size":"Standard Bouquet","label":"Standard Snack & Polaroid Bouquet (5 Photos + Snacks)","price":899},{"size":"Grand Deluxe Bouquet","label":"Grand Deluxe Bouquet (10 Photos + Premium Treats + Fairy Lights)","price":1299}]'::jsonb,
  '{"requires_photo":true,"max_photos":10,"requires_text":true,"text_placeholder":"Custom headline, personal message notes & snack preferences","requires_date":true}'::jsonb,
  ARRAY['Artisan crafted vintage newspaper wrapper with custom typography', 'Curated mix of favorite snacks, chips, and chocolates', 'Personalized waterproof polaroid photo prints attached', 'Hand-tied with signature satin ribbon bow and occasion gift tag']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'polaroid-bouquet',
  'Polaroid Bouquet',
  'hampers',
  449,
  '16 waterproof, fade resistant polaroids with gloss finish with some pretty stickers.',
  'Polaroid Bouquet',
  'linear-gradient(150deg,#E9C7C2,#A9645F 55%,#4A141D)',
  ARRAY['/src/assets/hero/polaroid-bouquet.jpg']::text[],
  '[]'::jsonb,
  '{"requires_photo":true,"max_photos":16,"requires_text":true,"text_placeholder":"Custom gift note & sticker themes (optional)","requires_date":false}'::jsonb,
  ARRAY['16 waterproof, fade-resistant polaroid photo prints', 'Ultra-gloss protective finish with pretty aesthetic stickers', 'Hand-wrapped in premium Korean marble packaging with satin ribbon']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'a2',
  'Timeless Lily',
  'addons',
  150,
  'Intricately handcrafted pipe-cleaner lily flower in soft blush pink with realistic stamen, deep green leaves, and gold-trimmed waterproof wrapping. A flower that never withers.',
  'Add-on Keepsake',
  'linear-gradient(150deg,#F7E1E3,#EFC6C0 55%,#C98D89)',
  ARRAY['/src/assets/hero/pipe-cleaner-lily.jpg']::text[],
  '[]'::jsonb,
  '{"requires_photo":false,"max_photos":0,"requires_text":true,"text_placeholder":"Handwritten message card (e.g. For my favorite person)","requires_date":false}'::jsonb,
  ARRAY['100% handcrafted velvety pipe-cleaner petals', 'Never fades or wilts — stays fresh forever', 'Includes miniature message card & gift ribbon']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'a3',
  'Embroidered Handkerchief',
  'addons',
  199,
  'Fine 100% breathable cotton handkerchief with hand-embroidered romantic lettering ("Hi Handsome ❤️" or custom text) and red heart stitching. An intimate, sentimental keepsake.',
  'Add-on Keepsake',
  'linear-gradient(150deg,#FBF6F2,#E8B8AE 55%,#8A4A47)',
  ARRAY['/src/assets/hero/embroidered-keepsake.jpg']::text[],
  '[]'::jsonb,
  '{"requires_photo":false,"max_photos":0,"requires_text":true,"text_placeholder":"Text to embroider (e.g. Hi Handsome / Yours Always / Initials)","requires_date":false}'::jsonb,
  ARRAY['100% breathable fine cotton with stitched borders', 'Hand-stitched embroidery thread with heart motif']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'addon-clay-goodies',
  'Clay Goodies',
  'addons',
  60,
  'Adorable miniature handcrafted clay figurine lovingly sculpted with smooth air-dry clay. Perfect as a pocket charm or sweet companion keepsake to elevate any gift setup.',
  'Add-on Keepsake',
  'linear-gradient(150deg,#EFEBE9,#D7CCC8 55%,#5D4037)',
  ARRAY['/src/assets/hero/clay-goodies.png']::text[],
  '[]'::jsonb,
  '{"requires_photo":false,"max_photos":0,"requires_text":true,"text_placeholder":"Character / color preference or special request (optional)","requires_date":false}'::jsonb,
  ARRAY['100% artisan handcrafted lightweight clay figurine', 'Intricately detailed with expressive hand-sculpted features', 'Perfect miniature companion keepsake for gift frames & hampers']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'gift-forever-bloom-bouquet',
  'Timeless Lily Bouquet',
  'general',
  349,
  'Bespoke handcrafted velvet pipe-cleaner floral bouquet featuring blooming purple lilies, bud, cute heart stem, waterproof premium wrapping, occasion greeting card & luxury satin bow.',
  'Handmade Forever Bouquet',
  'linear-gradient(150deg,#F3E8FF,#E9D5FF 50%,#7E22CE)',
  ARRAY['/src/assets/hero/forever-flower-bouquet.png']::text[],
  '[{"size":"2 lilies + 1 bud + 1 heart","label":"2 lilies + 1 bud + 1 heart","price":349},{"size":"2 lilies + 1 bud + 1 heart + 1 card","label":"2 lilies + 1 bud + 1 heart + 1 card","price":399}]'::jsonb,
  '{"requires_photo":false,"max_photos":0,"requires_text":true,"text_placeholder":"Occasion & custom card message (e.g. \"Happy Birthday Samiksha\")","requires_date":false}'::jsonb,
  ARRAY['100% artisan handcrafted velvet pipe-cleaner flowers that never wilt or fade', 'Includes 2 blooming lilies, 1 bud & signature velvet heart stem', 'Personalized handwritten greeting card (e.g. Happy Birthday / Anniversary)', 'Perfect standalone thoughtful gift or companion piece with frames & hampers']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();

INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  'gift-pink-forever-bouquet',
  'Timeless Lily Bouquet',
  'general',
  399,
  'Artisan handcrafted velvet pipe-cleaner floral arrangement featuring 3 vibrant pink lilies, delicate bud, cute heart stem, luxury waterproof gift wrapping & crimson satin ribbon bow.',
  'Handmade Forever Bouquet',
  'linear-gradient(150deg,#FDF2F8,#FCE7F3 50%,#DB2777)',
  ARRAY['/src/assets/hero/pink-lily-forever-bouquet.png']::text[],
  '[{"size":"3 lilies + 1 bud + 1 heart","label":"3 lilies + 1 bud + 1 heart","price":399},{"size":"3 lilies + 1 bud + 1 heart + 1 card","label":"3 lilies + 1 bud + 1 heart + 1 card","price":449}]'::jsonb,
  '{"requires_photo":false,"max_photos":0,"requires_text":true,"text_placeholder":"Occasion & custom card message","requires_date":false}'::jsonb,
  ARRAY['100% handcrafted velvety pink petals with realistic pollen stems', 'Includes 3 blooming lilies, 1 bud & signature velvet heart stem', 'Personalized handwritten greeting card (e.g. Happy Birthday / Anniversary)', 'Everlasting keepsake flowers that stay fresh and vibrant forever']::text[],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  tag = EXCLUDED.tag,
  gradient = EXCLUDED.gradient,
  images = EXCLUDED.images,
  sizes = EXCLUDED.sizes,
  customization_options = EXCLUDED.customization_options,
  details = EXCLUDED.details,
  is_active = true,
  updated_at = now();
