-- Botanical Aid — admin CMS
-- Adds the columns the storefront needs, an admin allowlist, editable site copy,
-- write policies and a product-image storage bucket.
-- Run in the Supabase SQL editor (or via the CLI) AFTER supabase-schema.sql.

-- ─────────────────────────────────────────────────────────────
-- 1. Columns the hardcoded product data has but the tables don't
-- ─────────────────────────────────────────────────────────────
alter table public.products
  add column if not exists original_price numeric(10,2),
  add column if not exists warnings        text[] not null default '{}',
  add column if not exists disclaimers     text[] not null default '{}',
  add column if not exists max_quantity    integer not null default 10,
  add column if not exists sort_order      integer not null default 0;

alter table public.product_variants
  add column if not exists variant_key     text,
  add column if not exists quantity        integer not null default 1,
  add column if not exists discount_percent numeric(5,2) not null default 0,
  add column if not exists total_price     numeric(10,2);

create unique index if not exists product_variants_product_key_idx
  on public.product_variants (product_id, variant_key);

-- ─────────────────────────────────────────────────────────────
-- 2. Who is allowed into /admin
-- ─────────────────────────────────────────────────────────────
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users a where a.user_id = auth.uid());
$$;

drop policy if exists "Admins can read the admin list" on public.admin_users;
create policy "Admins can read the admin list" on public.admin_users
  for select using (public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- 3. (removed) site_copy — superseded by page_overrides in section 6.
--     Safe to run on a database where the earlier version of this file was applied.
-- ─────────────────────────────────────────────────────────────
drop table if exists public.site_copy;

-- ─────────────────────────────────────────────────────────────
-- 4. Admin write policies on the product tables
--    (public read policies already exist in supabase-schema.sql)
-- ─────────────────────────────────────────────────────────────
drop policy if exists "Admins can write products" on public.products;
create policy "Admins can write products" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can write product variants" on public.product_variants;
create policy "Admins can write product variants" on public.product_variants
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can read orders" on public.orders;
create policy "Admins can read orders" on public.orders
  for select using (public.is_admin());

drop policy if exists "Admins can read order items" on public.order_items;
create policy "Admins can read order items" on public.order_items
  for select using (public.is_admin());

-- admins need to see inactive products in the CMS list
drop policy if exists "Admins can read all products" on public.products;
create policy "Admins can read all products" on public.products
  for select using (public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- 5. Product image storage
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Product images are publicly readable" on storage.objects;
create policy "Product images are publicly readable" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "Admins can manage product images" on storage.objects;
create policy "Admins can manage product images" on storage.objects
  for all using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- 6. Page copy overrides for the hardcoded pages
-- ─────────────────────────────────────────────────────────────
create table if not exists public.page_overrides (
  slug       text primary key,
  blocks     jsonb not null default '{}'::jsonb,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists page_overrides_updated_at on public.page_overrides;
create trigger page_overrides_updated_at
  before update on public.page_overrides
  for each row execute function public.update_updated_at();

alter table public.page_overrides enable row level security;

drop policy if exists "Published page copy is viewable by everyone" on public.page_overrides;
create policy "Published page copy is viewable by everyone" on public.page_overrides
  for select using (published = true);

drop policy if exists "Admins can write page copy" on public.page_overrides;
create policy "Admins can write page copy" on public.page_overrides
  for all using (public.is_admin()) with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- 7. CMS pages (new pages built from blocks, served by /[...slug])
-- ─────────────────────────────────────────────────────────────
create table if not exists public.pages (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  title            text not null,
  hero_subtitle    text,
  sections         jsonb not null default '[]'::jsonb,
  meta_title       text,
  meta_description text,
  custom_css       text,
  published        boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists pages_published_idx on public.pages (published);
create index if not exists pages_created_at_idx on public.pages (created_at desc);

drop trigger if exists pages_updated_at on public.pages;
create trigger pages_updated_at
  before update on public.pages
  for each row execute function public.update_updated_at();

alter table public.pages enable row level security;

drop policy if exists "Published pages are viewable by everyone" on public.pages;
create policy "Published pages are viewable by everyone" on public.pages
  for select using (published = true);

drop policy if exists "Admins can read all pages" on public.pages;
create policy "Admins can read all pages" on public.pages
  for select using (public.is_admin());

drop policy if exists "Admins can write pages" on public.pages;
create policy "Admins can write pages" on public.pages
  for all using (public.is_admin()) with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- 8. Remove the seed purchase options
--    supabase-schema.sql seeds variants ("Single Bottle", "5 x Bottles", "10 x Bottles",
--    "30g Bottle"/"50ml Tub", "Single Balm", "3 x Balms") with no variant_key, at the old
--    $24.95 pricing and with quantity defaulting to 1. They duplicate the options the
--    admin import creates, and several quantity-1 rows per product make checkout's
--    quantity match ambiguous. Anything an order references is kept, and given a key so
--    it stays unique.
-- ─────────────────────────────────────────────────────────────
delete from public.product_variants pv
where pv.variant_key is null
  and not exists (select 1 from public.order_items oi where oi.variant_id = pv.id);

-- and by name, in case an earlier run of this file already gave them keys: the 5 and 10
-- packs were never sold at current pricing and are not offered on the site
delete from public.product_variants pv
where pv.name in ('Single Bottle', '5 x Bottles', '10 x Bottles', 'Single Balm', '3 x Balms', '30g Bottle', '50ml Tub')
  and not exists (select 1 from public.order_items oi where oi.variant_id = pv.id);

with numbered as (
  select id, row_number() over (partition by product_id order by sort_order, created_at) as n
  from public.product_variants
  where variant_key is null
)
update public.product_variants pv
set variant_key = 'legacy-' || numbered.n
from numbered
where pv.id = numbered.id;
