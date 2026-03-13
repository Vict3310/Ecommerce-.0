-- 1. Create the 'product-images' bucket
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 2. Allow public access to 'product-images' for reading
create policy "Public Access to Product Images"
on storage.objects for select
using ( bucket_id = 'product-images' );

-- 3. Allow admins to upload images to 'product-images'
create policy "Admins can upload product images"
on storage.objects for insert
with check (
  bucket_id = 'product-images' 
  AND exists (
    select 1 from public.profiles
    where id = auth.uid() 
    AND role = 'admin'
  )
);

-- 4. Allow admins to update/delete images in 'product-images'
create policy "Admins can update product images"
on storage.objects for update
using (
  bucket_id = 'product-images' 
  AND exists (
    select 1 from public.profiles
    where id = auth.uid() 
    AND role = 'admin'
  )
);

create policy "Admins can delete product images"
on storage.objects for delete
using (
  bucket_id = 'product-images' 
  AND exists (
    select 1 from public.profiles
    where id = auth.uid() 
    AND role = 'admin'
  )
);
