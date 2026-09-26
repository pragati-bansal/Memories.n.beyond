import fs from 'fs';
import { initialProducts } from '../src/data/initialProducts.js';

console.log('Generating seed SQL for', initialProducts.length, 'products...');

let sql = `-- ==============================================================================
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
`;

initialProducts.forEach((p) => {
  const slug = p.slug || p.id;
  const title = (p.title || '').replace(/'/g, "''");
  const category = (p.category || 'frames').replace(/'/g, "''");
  const price = Number(p.price) || 299;
  const description = (p.description || '').replace(/'/g, "''");
  const tag = (p.tag || '').replace(/'/g, "''");
  const gradient = (p.gradient || 'linear-gradient(150deg,#FFE5EC,#FB6F92 55%,#881337)').replace(/'/g, "''");
  
  const rawImgs = Array.isArray(p.images) && p.images.length > 0 ? p.images.filter(Boolean) : [p.imageUrl || p.image_url].filter(Boolean);
  const imagesSql = 'ARRAY[' + rawImgs.map(img => "'" + String(img).replace(/'/g, "''") + "'").join(', ') + ']::text[]';
  
  const sizesJson = JSON.stringify(p.sizes || []).replace(/'/g, "''");
  const customizationJson = JSON.stringify(p.customization_options || {}).replace(/'/g, "''");
  const detailsSql = 'ARRAY[' + (p.details || []).map(d => "'" + String(d).replace(/'/g, "''") + "'").join(', ') + ']::text[]';

  sql += `
INSERT INTO public.products (slug, title, category, price, description, tag, gradient, images, sizes, customization_options, details, is_active)
VALUES (
  '${slug}',
  '${title}',
  '${category}',
  ${price},
  '${description}',
  '${tag}',
  '${gradient}',
  ${imagesSql},
  '${sizesJson}'::jsonb,
  '${customizationJson}'::jsonb,
  ${detailsSql},
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
`;
});

fs.writeFileSync('supabase/seed_products.sql', sql, 'utf8');
console.log('✅ Generated supabase/seed_products.sql successfully with all', initialProducts.length, 'products!');
