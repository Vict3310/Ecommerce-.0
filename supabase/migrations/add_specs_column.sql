-- Add specifications column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS specifications jsonb DEFAULT '{}';
