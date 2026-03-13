-- Add specifications JSONB column to products table
alter table public.products add column if not exists specifications jsonb default '{}'::jsonb;
