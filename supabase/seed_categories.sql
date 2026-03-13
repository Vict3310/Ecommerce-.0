-- Insert standard categories for the seeding script
insert into public.categories (name, slug) values
('Electronics', 'electronics'),
('Fashion', 'fashion'),
('Home & Kitchen', 'home-kitchen'),
('Beauty', 'beauty'),
('Sports', 'sports')
on conflict (slug) do nothing;
