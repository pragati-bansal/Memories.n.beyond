-- =========================================================
-- Memories n Beyond - Supabase Database Schema & Storage Setup
-- =========================================================

-- 1. Enable UUID Extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------
-- 2. Create `products` table
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'frames', 'bouquets', 'birthday', 'couple'
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    tag VARCHAR(100),
    gradient VARCHAR(255),
    images TEXT[] DEFAULT '{}',
    customization_options JSONB DEFAULT '{
        "requires_photo": true,
        "max_photos": 1,
        "requires_text": true,
        "text_placeholder": "Custom text engraving",
        "requires_date": false
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for `products`
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active products
CREATE POLICY "Allow public read access to products"
    ON public.products
    FOR SELECT
    USING (true);

-- ---------------------------------------------------------
-- 3. Create `orders` table
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    custom_notes TEXT,
    event_date DATE,
    uploaded_images TEXT[] DEFAULT '{}',
    order_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'in_crafting', 'dispatched', 'delivered'
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for `orders`
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public to insert orders from website
CREATE POLICY "Allow public insertion of orders"
    ON public.orders
    FOR INSERT
    WITH CHECK (true);

-- Allow authenticated admins to view/manage orders
CREATE POLICY "Allow authenticated users to view orders"
    ON public.orders
    FOR SELECT
    TO authenticated
    USING (true);

-- ---------------------------------------------------------
-- 4. Setup Supabase Storage Bucket: `customer-uploads`
-- ---------------------------------------------------------
-- Insert the bucket into storage.buckets if it does not already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('customer-uploads', 'customer-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Allow anyone (anon + auth) to upload customization photos
CREATE POLICY "Allow public uploads to customer-uploads"
    ON storage.objects
    FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'customer-uploads');

-- Storage Policy: Allow public read access to uploaded images
CREATE POLICY "Allow public reads from customer-uploads"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'customer-uploads');

-- ---------------------------------------------------------
-- 5. Seed Catalog Products
-- ---------------------------------------------------------
INSERT INTO public.products (title, slug, category, price, description, tag, gradient, images, customization_options)
VALUES
(
    'Moonlight Memory Frame',
    'moonlight-memory-frame',
    'frames',
    499.00,
    'Upload 1 photograph in high resolution. Custom text engraving up to 40 characters. Available in 5x7in and 8x10in frame sizes with matte or gloss print finish.',
    'Custom Photo Frame',
    'linear-gradient(150deg,#E8B8AE,#C98D89 55%,#8A4A47)',
    ARRAY['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'],
    '{"requires_photo": true, "max_photos": 1, "requires_text": true, "text_placeholder": "E.g. Forever & Always - 2026", "requires_date": false}'::jsonb
),
(
    'Vintage Wooden Frame Set',
    'vintage-wooden-frame-set',
    'frames',
    899.00,
    'Upload up to 3 photographs for a triple-frame set. Personalized nameplate with date up to 25 characters. Solid wood frame with antique finish, free-standing or wall-mount.',
    'Custom Photo Frame',
    'linear-gradient(150deg,#F0D6C8,#B98A4E 55%,#6E1F2B)',
    ARRAY['https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&auto=format&fit=crop&q=80'],
    '{"requires_photo": true, "max_photos": 3, "requires_text": true, "text_placeholder": "Names & short anniversary note", "requires_date": true}'::jsonb
),
(
    'Blush Polaroid Bouquet',
    'blush-polaroid-bouquet',
    'bouquets',
    649.00,
    'Upload 6–9 photographs for individual polaroid prints. Handmade paper flower stems in blush & cream, wrapped in kraft paper with a satin ribbon and custom note card.',
    'Polaroid Bouquet',
    'linear-gradient(150deg,#F3E2D4,#EFC6C0 55%,#C98D89)',
    ARRAY['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&auto=format&fit=crop&q=80'],
    '{"requires_photo": true, "max_photos": 9, "requires_text": true, "text_placeholder": "Message on gift card (up to 60 characters)", "requires_date": false}'::jsonb
),
(
    'Rosewood Polaroid Bunch',
    'rosewood-polaroid-bunch',
    'bouquets',
    799.00,
    'Upload up to 12 photographs, mixed portrait & landscape. Dried rose accents between each polaroid stem. Comes in a rigid gift box ready to present.',
    'Polaroid Bouquet',
    'linear-gradient(150deg,#E9C7C2,#A9645F 55%,#4A141D)',
    ARRAY['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80'],
    '{"requires_photo": true, "max_photos": 12, "requires_text": true, "text_placeholder": "Ribbon color preference / custom message", "requires_date": false}'::jsonb
),
(
    'Birthday Wish Jar',
    'birthday-wish-jar',
    'birthday',
    549.00,
    'Upload up to 10 photographs for mini keepsake cards. Each card can carry a handwritten wish (30 chars). Glass jar with a hand-tied twine bow. Perfect for milestone birthdays.',
    'Birthday Special',
    'linear-gradient(150deg,#F6DEDA,#EFC6C0 50%,#B4884E)',
    ARRAY['https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&auto=format&fit=crop&q=80'],
    '{"requires_photo": true, "max_photos": 10, "requires_text": true, "text_placeholder": "Recipient name & birthday age (e.g. Maya turns 21)", "requires_date": true}'::jsonb
),
(
    'Milestone Memory Box',
    'milestone-memory-box',
    'birthday',
    1299.00,
    'Upload up to 20 photographs spanning the years. Compartments for small mementos alongside prints. Engraved wooden lid with name and milestone age.',
    'Birthday Special',
    'linear-gradient(150deg,#EFC6C0,#C98D89 50%,#6E1F2B)',
    ARRAY['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80'],
    '{"requires_photo": true, "max_photos": 20, "requires_text": true, "text_placeholder": "Engraving for box lid", "requires_date": true}'::jsonb
),
(
    'Us, In Every Season Frame',
    'us-in-every-season-frame',
    'couple',
    999.00,
    'Upload 4 photographs, one for each season together. Custom text for a relationship date or shared quote. Four-panel frame in warm walnut finish.',
    'Couple Keepsake',
    'linear-gradient(150deg,#E8B8AE,#8A4A47 55%,#4A141D)',
    ARRAY['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop&q=80'],
    '{"requires_photo": true, "max_photos": 4, "requires_text": true, "text_placeholder": "Special relationship quote or date", "requires_date": true}'::jsonb
),
(
    'Love Letter Keepsake Box',
    'love-letter-keepsake-box',
    'couple',
    1199.00,
    'Upload up to 15 photographs for a layered flip-book. Space for a heartfelt letter up to 300 characters. Velvet-lined wooden box with brass clasp.',
    'Couple Keepsake',
    'linear-gradient(150deg,#F0D6C8,#C98D89 50%,#6E1F2B)',
    ARRAY['https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80'],
    '{"requires_photo": true, "max_photos": 15, "requires_text": true, "text_placeholder": "Love letter content / custom message", "requires_date": true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE
SET
    title = EXCLUDED.title,
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    tag = EXCLUDED.tag,
    gradient = EXCLUDED.gradient,
    images = EXCLUDED.images,
    customization_options = EXCLUDED.customization_options;
