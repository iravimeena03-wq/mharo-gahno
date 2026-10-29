-- Paste this once into Supabase Dashboard > SQL Editor > New query, then click Run.
-- Public visitors can read active products. Only signed-in users can change products/images.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  legacy_key text unique,
  name text not null,
  description text not null default '',
  offer_price numeric(10,2) not null check (offer_price >= 0),
  original_price numeric(10,2) not null check (original_price >= offer_price),
  image_urls text[] not null default '{}',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;
revoke all on public.products from anon, authenticated;
grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
drop policy if exists "Visitors read active products" on public.products;
create policy "Visitors read active products" on public.products for select to anon using (active = true);
drop policy if exists "Signed-in admin manages products" on public.products;
create policy "Signed-in admin manages products" on public.products for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 10485760, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Public product photos are viewable" on storage.objects;
create policy "Public product photos are viewable" on storage.objects for select to anon, authenticated using (bucket_id = 'product-images');
drop policy if exists "Signed-in admin uploads product photos" on storage.objects;
create policy "Signed-in admin uploads product photos" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
drop policy if exists "Signed-in admin updates product photos" on storage.objects;
create policy "Signed-in admin updates product photos" on storage.objects for update to authenticated using (bucket_id = 'product-images') with check (bucket_id = 'product-images');
drop policy if exists "Signed-in admin deletes product photos" on storage.objects;
create policy "Signed-in admin deletes product photos" on storage.objects for delete to authenticated using (bucket_id = 'product-images');
