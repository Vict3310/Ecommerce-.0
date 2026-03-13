-- Add dynamic hero and promo fields to store settings
ALTER TABLE public.store_settings 
ADD COLUMN IF NOT EXISTS hero_images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS promo_banner jsonb DEFAULT '{
  "title": "Enhance Your Music Experience",
  "category": "category",
  "image_url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
  "button_text": "Buy Now",
  "countdown_date": null
}';

-- Update default settings with some placeholder hero images if empty
UPDATE public.store_settings
SET hero_images = ARRAY[
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200'
]
WHERE id = 1 AND (hero_images IS NULL OR array_length(hero_images, 1) IS NULL);
