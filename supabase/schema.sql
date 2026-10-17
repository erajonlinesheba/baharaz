-- Run this file in Supabase Dashboard > SQL Editor.
-- It creates the marketplace tables used by the BAHARAZ app.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'seller', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sellers (
  id uuid primary key references public.profiles(id) on delete cascade,
  shop_name text not null,
  email text,
  phone text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'suspended')),
  commission_rate numeric(5,2) not null default 10,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references public.categories(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.sellers(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  brand text,
  price numeric(12,2) not null check (price >= 0),
  original_price numeric(12,2) check (original_price is null or original_price >= price),
  image_url text,
  stock integer not null default 0 check (stock >= 0),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'archived')),
  rating numeric(3,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete set null,
  seller_id uuid references public.sellers(id) on delete set null,
  customer_name text,
  customer_phone text,
  shipping_address jsonb,
  total numeric(12,2) not null default 0 check (total >= 0),
  payment_method text not null default 'cod' check (payment_method in ('cod', 'bkash', 'nagad', 'card', 'rocket', 'bank')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'packed', 'ready_to_ship', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'return_requested', 'refund_pending', 'refunded', 'disputed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  customer_id uuid references public.profiles(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(12,2) not null check (discount_value > 0),
  minimum_order numeric(12,2) not null default 0,
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  link_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.affiliate_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  channel text not null,
  audience text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users(id) on delete set null,
  seller_id uuid references auth.users(id) on delete set null,
  subject text not null default 'Support chat',
  status text not null default 'open' check (status in ('open', 'pending', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete cascade,
  sender_type text not null default 'user' check (sender_type in ('user', 'ai')),
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ) or exists (
    select 1 from auth.users where id = auth.uid() and lower(email) = 'erajshophelp@gmail.com'
  );
$$;

alter table public.profiles enable row level security;
alter table public.sellers enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;
alter table public.banners enable row level security;
alter table public.affiliate_applications enable row level security;
alter table public.support_tickets enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

create policy "public can read approved products" on public.products for select using (status = 'approved' or seller_id = auth.uid() or public.is_admin());
create policy "sellers can insert own products" on public.products for insert with check (seller_id = auth.uid());
create policy "sellers can update own products" on public.products for update using (seller_id = auth.uid() or public.is_admin()) with check (seller_id = auth.uid() or public.is_admin());
create policy "sellers and admins can delete products" on public.products for delete using (seller_id = auth.uid() or public.is_admin());

create policy "users can read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "users can update own profile" on public.profiles for update using (id = auth.uid() or public.is_admin());
create policy "admins manage sellers" on public.sellers for all using (public.is_admin()) with check (public.is_admin());
create policy "sellers read own shop" on public.sellers for select using (id = auth.uid());
create policy "customers can read approved shops" on public.sellers for select using (status = 'approved');
create policy "chat participants read threads" on public.chat_threads for select using (customer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());
create policy "chat participants create threads" on public.chat_threads for insert with check (customer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());
create policy "chat participants update threads" on public.chat_threads for update using (customer_id = auth.uid() or seller_id = auth.uid() or public.is_admin()) with check (customer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());
create policy "chat participants read messages" on public.chat_messages for select using (exists (select 1 from public.chat_threads t where t.id = thread_id and (t.customer_id = auth.uid() or t.seller_id = auth.uid() or public.is_admin())));
create policy "chat participants send messages" on public.chat_messages for insert with check ((sender_id = auth.uid() or (sender_type = 'ai' and sender_id is null)) and exists (select 1 from public.chat_threads t where t.id = thread_id and (t.customer_id = auth.uid() or t.seller_id = auth.uid() or public.is_admin())));
create policy "public can read active categories" on public.categories for select using (is_active = true or public.is_admin());
create policy "admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "customers read own orders" on public.orders for select using (customer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());
create policy "customers create orders" on public.orders for insert with check (customer_id = auth.uid());
create policy "sellers and admins update orders" on public.orders for update using (seller_id = auth.uid() or public.is_admin()) with check (seller_id = auth.uid() or public.is_admin());
create policy "order participants read items" on public.order_items for select using (exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or o.seller_id = auth.uid() or public.is_admin())));
create policy "customers create order items" on public.order_items for insert with check (exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or public.is_admin())));
create policy "customers read reviews" on public.reviews for select using (true);
create policy "customers write own reviews" on public.reviews for insert with check (customer_id = auth.uid());
create policy "public can read active coupons" on public.coupons for select using (is_active = true or public.is_admin());
create policy "admins manage coupons" on public.coupons for all using (public.is_admin()) with check (public.is_admin());
create policy "public can read active banners" on public.banners for select using (is_active = true or public.is_admin());
create policy "admins manage banners" on public.banners for all using (public.is_admin()) with check (public.is_admin());
create policy "anyone can submit affiliate application" on public.affiliate_applications for insert with check (true);
create policy "applicants and admins read affiliate applications" on public.affiliate_applications for select using (user_id = auth.uid() or email = (select email from auth.users where id = auth.uid()) or public.is_admin());
create policy "anyone can submit support ticket" on public.support_tickets for insert with check (true);
create policy "ticket owners and admins read support tickets" on public.support_tickets for select using (user_id = auth.uid() or email = (select email from auth.users where id = auth.uid()) or public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- Optional marketplace management extensions for the unified admin dashboard.
alter table public.products add column if not exists sku text;
alter table public.products add column if not exists discount_price numeric(12,2);
alter table public.products add column if not exists gallery jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists tags jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists variants jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists specifications jsonb not null default '{}'::jsonb;
alter table public.products add column if not exists subcategory text;
alter table public.products add column if not exists slug text;
alter table public.products add column if not exists seo_title text;
alter table public.products add column if not exists meta_description text;
alter table public.products add column if not exists seo_keywords text;
alter table public.products add column if not exists alt_text text;
alter table public.products add column if not exists is_published boolean not null default false;

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null,
  movement_type text not null check (movement_type in ('stock_in', 'stock_out', 'adjustment')),
  warehouse text default 'default',
  note text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.inventory_movements enable row level security;
alter table public.admin_activity_logs enable row level security;
create policy "admins manage inventory movements" on public.inventory_movements for all using (public.is_admin()) with check (public.is_admin());
create policy "admins read activity logs" on public.admin_activity_logs for select using (public.is_admin());
create policy "admins create activity logs" on public.admin_activity_logs for insert with check (public.is_admin());
