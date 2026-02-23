-- =============================================================================
-- Golden Dragon / Chinese Restaurant – Full schema (idempotent, safe to re-run)
-- =============================================================================
-- Run this in Supabase SQL Editor or via migration. You can run it multiple
-- times; it uses IF NOT EXISTS, DROP IF EXISTS, ON CONFLICT DO NOTHING,
-- CREATE OR REPLACE, and ADD COLUMN IF NOT EXISTS where possible.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Profiles
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

alter table public.profiles enable row level security;

alter table public.profiles
  add column if not exists role text not null default 'customer'
  check (role in ('admin', 'staff', 'customer'));

-- Triggers: updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_profile_updated_at on public.profiles;
create trigger on_profile_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

-- Helper: avoid RLS recursion when checking admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Profiles policies (drop first so re-run is safe)
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone."
  on public.profiles for select using (true);

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile."
  on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile."
  on public.profiles for update using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select to authenticated using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 2. Orders
-- -----------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total_amount integer not null,
  status text not null default 'pending',
  payment_screenshot_path text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure status check allows all required values (idempotent: drop then add)
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check check (
  status in ('pending', 'approved', 'declined', 'cancelled', 'preparing', 'shipped')
);

alter table public.orders enable row level security;

drop trigger if exists on_order_updated_at on public.orders;
create trigger on_order_updated_at
  before update on public.orders
  for each row
  execute procedure public.handle_updated_at();

drop policy if exists "Users can insert their own orders" on public.orders;
create policy "Users can insert their own orders"
  on public.orders for insert with check (auth.uid() = user_id);

drop policy if exists "Users can view their own orders" on public.orders;
create policy "Users can view their own orders"
  on public.orders for select using (auth.uid() = user_id);

drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders"
  on public.orders for select to authenticated using (public.is_admin());

drop policy if exists "Admins can update all orders" on public.orders;
create policy "Admins can update all orders"
  on public.orders for update to authenticated using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 2b. Order items (line items per order)
-- -----------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id text not null,
  quantity integer not null check (quantity > 0),
  unit_price integer not null
);

alter table public.order_items enable row level security;

drop policy if exists "Users can insert order items for own orders" on public.order_items;
create policy "Users can insert order items for own orders"
  on public.order_items for insert
  with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

drop policy if exists "Users can view order items for own orders or admin" on public.order_items;
create policy "Users can view order items for own orders or admin"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
      and (o.user_id = auth.uid() or public.is_admin())
    )
  );

-- -----------------------------------------------------------------------------
-- 3. Storage: payment-proofs bucket and policies
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can upload payment proofs" on storage.objects;
create policy "Authenticated users can upload payment proofs"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'payment-proofs');

drop policy if exists "Authenticated users can view payment proofs" on storage.objects;
create policy "Authenticated users can view payment proofs"
  on storage.objects for select to authenticated
  using (bucket_id = 'payment-proofs');

drop policy if exists "Owners can delete their payment proofs" on storage.objects;
create policy "Owners can delete their payment proofs"
  on storage.objects for delete to authenticated
  using (bucket_id = 'payment-proofs' and owner = auth.uid());

-- -----------------------------------------------------------------------------
-- 4. Auth: new user → profile (trigger + backfill)
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'customer'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill: ensure existing auth.users have a profile
insert into public.profiles (id, full_name, role)
select id, raw_user_meta_data->>'full_name', 'customer'
from auth.users
on conflict (id) do nothing;
