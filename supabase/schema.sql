-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text default 'customer'::text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Store Settings (Single row configuration)
create table public.store_settings (
  id integer primary key default 1,
  store_name text not null default 'My E-Commerce Store',
  logo_url text,
  hero_headline text default 'Welcome to our store',
  hero_subheadline text default 'Discover amazing products',
  contact_email text,
  currency_symbol text default '$',
  banner_message text,
  -- Ensure only one row exists
  constraint single_row check (id = 1)
);

-- Insert default settings row
insert into public.store_settings (id) values (1) on conflict do nothing;


-- 3. Categories
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  slug text not null unique,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Products
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  price numeric not null,
  compare_at_price numeric,
  image_urls text[] default '{}',
  category_id uuid references public.categories on delete set null,
  stock_quantity integer default 0,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Wishlists
create table public.wishlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references public.products on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);


-- Setup Row Level Security (RLS) policies

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.store_settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.wishlists enable row level security;


-- Profiles: Users can read and update their own profile. Admins can read all.
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Store Settings: Anyone can read settings. Only admins can update.
create policy "Anyone can view store settings" on public.store_settings for select using (true);
create policy "Admins can update store settings" on public.store_settings for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Categories: Anyone can read. Only admins can insert/update/delete.
create policy "Anyone can view categories" on public.categories for select using (true);
create policy "Admins can insert categories" on public.categories for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update categories" on public.categories for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can delete categories" on public.categories for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Products: Anyone can read. Only admins can insert/update/delete.
create policy "Anyone can view products" on public.products for select using (true);
create policy "Admins can insert products" on public.products for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update products" on public.products for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can delete products" on public.products for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Wishlists: Users can only see, insert, and delete their own wishlists.
create policy "Users can view their own wishlists" on public.wishlists for select using (auth.uid() = user_id);
create policy "Users can insert their own wishlists" on public.wishlists for insert with check (auth.uid() = user_id);
create policy "Users can delete their own wishlists" on public.wishlists for delete using (auth.uid() = user_id);

-- Storage (For product images)
-- You will need to manually create the 'product-images' and 'site-assets' buckets in the Storage UI, and make them Public.
