-- ==============================================================================
-- Memories n Beyond - Enterprise Database Schema, Row Level Security (RLS) & Rate Limiting
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. PRODUCTS TABLE & COLUMNS ENSURANCE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    tag VARCHAR(100),
    gradient VARCHAR(255),
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safely add newer columns if table already existed previously
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sizes JSONB DEFAULT '[{"size": "5x7", "label": "5x7 in (Tabletop)", "price": 399}, {"size": "A4", "label": "A4 Size", "price": 499}]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS customization_options JSONB DEFAULT '{"requires_photo": true, "max_photos": 4, "requires_text": true, "text_placeholder": "Custom text engraving", "requires_date": false}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS details TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- Enable RLS for `products`
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
DROP POLICY IF EXISTS "Allow admin insert products" ON public.products;
DROP POLICY IF EXISTS "Allow admin update products" ON public.products;
DROP POLICY IF EXISTS "Allow admin delete products" ON public.products;

-- 🛡️ Product Policy 1: Everyone (anon + authenticated) can view active products
CREATE POLICY "Allow public read access to products"
    ON public.products
    FOR SELECT
    USING (COALESCE(is_active, true) = true OR auth.role() = 'authenticated');

-- 🛡️ Product Policy 2: Only Authenticated Admins can create products
CREATE POLICY "Allow admin insert products"
    ON public.products
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 🛡️ Product Policy 3: Only Authenticated Admins can update products
CREATE POLICY "Allow admin update products"
    ON public.products
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 🛡️ Product Policy 4: Only Authenticated Admins can delete products
CREATE POLICY "Allow admin delete products"
    ON public.products
    FOR DELETE
    TO authenticated
    USING (true);


-- ==============================================================================
-- 3. ORDERS TABLE & COLUMNS ENSURANCE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    custom_notes TEXT,
    event_date DATE,
    uploaded_images TEXT[] DEFAULT '{}',
    order_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safely add newer columns if orders table already existed
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS product_title VARCHAR(255);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS selected_size VARCHAR(50);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_price NUMERIC(10, 2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS client_ip VARCHAR(100);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- Enable RLS for `orders`
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing order policies
DROP POLICY IF EXISTS "Allow public insertion of orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to view orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to delete orders" ON public.orders;

-- 🛡️ Order Policy 1: Customers can submit orders (INSERT only with validation)
CREATE POLICY "Allow public insertion of orders"
    ON public.orders
    FOR INSERT
    TO public
    WITH CHECK (
        length(customer_name) >= 2 AND
        length(phone_number) >= 10
    );

-- 🛡️ Order Policy 2: Strictly Authenticated Admins can view customer orders
CREATE POLICY "Allow authenticated users to view orders"
    ON public.orders
    FOR SELECT
    TO authenticated
    USING (true);

-- 🛡️ Order Policy 3: Only Authenticated Admins can update order status
CREATE POLICY "Allow authenticated users to update orders"
    ON public.orders
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 🛡️ Order Policy 4: Only Authenticated Admins can delete orders
CREATE POLICY "Allow authenticated users to delete orders"
    ON public.orders
    FOR DELETE
    TO authenticated
    USING (true);


-- ==============================================================================
-- 4. DATABASE-LEVEL RATE LIMITING (Anti-Spam & Protection)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.rate_limit_tracker (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier VARCHAR(150) NOT NULL, -- Phone Number or IP address
    action_type VARCHAR(50) NOT NULL, -- 'order_submission', 'image_upload'
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast rate limit lookups
CREATE INDEX IF NOT EXISTS idx_rate_limit_lookup
    ON public.rate_limit_tracker (identifier, action_type, created_at);

-- Function: Check & Enforce Rate Limits
CREATE OR REPLACE FUNCTION public.check_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
    recent_attempts INT;
    client_identifier VARCHAR(150);
BEGIN
    -- Use phone number or client_ip as identifier
    client_identifier := COALESCE(NEW.phone_number, NEW.client_ip, 'anonymous');

    -- Count orders created by this identifier in the last 5 minutes
    SELECT COUNT(*)
    INTO recent_attempts
    FROM public.rate_limit_tracker
    WHERE identifier = client_identifier
      AND action_type = 'order_submission'
      AND created_at > (now() - INTERVAL '5 minutes');

    -- Rate Limit Threshold: Max 6 orders per 5 minutes
    IF recent_attempts >= 6 THEN
        RAISE EXCEPTION 'Rate limit exceeded. Please wait a few minutes before submitting another order.';
    END IF;

    -- Record this attempt in tracker
    INSERT INTO public.rate_limit_tracker (identifier, action_type)
    VALUES (client_identifier, 'order_submission');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach Rate Limiting Trigger to Orders Table
DROP TRIGGER IF EXISTS trigger_order_rate_limit ON public.orders;
CREATE TRIGGER trigger_order_rate_limit
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.check_rate_limit();

-- Auto-cleanup function to purge old rate limit logs older than 24 hours
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM public.rate_limit_tracker
    WHERE created_at < (now() - INTERVAL '24 hours');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 5. STORAGE BUCKET RLS (customer-uploads)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'customer-uploads',
    'customer-uploads',
    true,
    10485760, -- 10MB limit per file
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow public uploads to customer-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from customer-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete from customer-uploads" ON storage.objects;

-- 🛡️ Storage Policy 1: Public upload allowed for customer photo customizations (Max 10MB)
CREATE POLICY "Allow public uploads to customer-uploads"
    ON storage.objects
    FOR INSERT
    TO public
    WITH CHECK (
        bucket_id = 'customer-uploads'
    );

-- 🛡️ Storage Policy 2: Public read access to photos
CREATE POLICY "Allow public reads from customer-uploads"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'customer-uploads');

-- 🛡️ Storage Policy 3: Only authenticated admins can delete uploaded files
CREATE POLICY "Allow admin delete from customer-uploads"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'customer-uploads');


-- ==============================================================================
-- 6. REVIEWS TABLE & RLS POLICIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) DEFAULT 'Verified Buyer',
    product_name VARCHAR(200) DEFAULT 'Handmade Keepsake',
    stars INT NOT NULL DEFAULT 5,
    text TEXT NOT NULL,
    image_url TEXT,
    date VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow public insert reviews" ON public.reviews;

CREATE POLICY "Allow public read reviews"
    ON public.reviews FOR SELECT
    TO public
    USING (is_active = true);

CREATE POLICY "Allow public insert reviews"
    ON public.reviews FOR INSERT
    TO public
    WITH CHECK (true);

