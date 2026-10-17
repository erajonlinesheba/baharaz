-- Run in Supabase Dashboard > SQL Editor.
-- This migration is safe to run more than once.

alter table public.products alter column seller_id drop not null;

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

drop policy if exists "admins manage inventory movements" on public.inventory_movements;
create policy "admins manage inventory movements"
on public.inventory_movements for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins read activity logs" on public.admin_activity_logs;
create policy "admins read activity logs"
on public.admin_activity_logs for select
using (public.is_admin());

drop policy if exists "admins create activity logs" on public.admin_activity_logs;
create policy "admins create activity logs"
on public.admin_activity_logs for insert
with check (public.is_admin());

-- V50 marketplace operations. These tables keep approvals and operational
-- signals separate from the core order/product tables so they can be enabled
-- incrementally without changing existing customer flows.

-- Promote the configured owner account when it already exists in Supabase Auth.
-- This is repeat-safe and fixes the common "account does not have admin access"
-- case after the user creates the account.
insert into public.profiles (id, full_name, role)
select id, coalesce(raw_user_meta_data->>'full_name', 'Baharaz Admin'), 'admin'
from auth.users
where lower(email) = 'erajshophelp@gmail.com'
on conflict (id) do update set role = 'admin', updated_at = now();

create table if not exists public.seller_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  shop_name text not null,
  business_info jsonb not null default '{}'::jsonb,
  documents jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (status in ('new', 'pending', 'approved', 'rejected', 'needs_info', 'suspended', 'banned')),
  risk_score integer check (risk_score between 0 and 100),
  commission_rate numeric(5,2) not null default 10,
  performance_score numeric(5,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists seller_applications_user_id_idx on public.seller_applications(user_id);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  approval_type text not null check (approval_type in ('seller', 'product', 'campaign', 'coupon', 'withdrawal', 'dispute')),
  entity_id uuid,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'needs_info')),
  risk_score integer check (risk_score between 0 and 100),
  notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.sellers(id) on delete set null,
  name text not null,
  campaign_type text not null check (campaign_type in ('flash_sale', 'voucher', 'coupon', 'free_shipping', 'bogo', 'bundle', 'seller_sale', 'category_sale', 'festival_sale')),
  rules jsonb not null default '{}'::jsonb,
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'pending', 'approved', 'scheduled', 'live', 'ended', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.seller_wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.sellers(id) on delete cascade,
  amount numeric(12,2) not null,
  transaction_type text not null check (transaction_type in ('sale', 'commission', 'refund', 'withdrawal', 'adjustment')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'processing', 'paid', 'failed')),
  reference_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.sellers(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  payment_details jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'approved', 'processing', 'paid', 'rejected')),
  risk_score integer check (risk_score between 0 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.fraud_alerts (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  risk_level text not null check (risk_level in ('low', 'medium', 'high')),
  reason text not null,
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed', 'blocked')),
  created_at timestamptz not null default now()
);

create table if not exists public.warehouses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

create table if not exists public.customer_rewards (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  points integer not null default 0,
  tier text not null default 'bronze' check (tier in ('bronze', 'silver', 'gold', 'vip')),
  wallet_balance numeric(12,2) not null default 0,
  referral_code text unique,
  updated_at timestamptz not null default now()
);

create table if not exists public.disputes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  opened_by uuid references auth.users(id) on delete set null,
  reason text not null,
  evidence jsonb not null default '[]'::jsonb,
  ai_summary text,
  resolution text,
  status text not null default 'open' check (status in ('open', 'evidence', 'review', 'resolved')),
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.seller_applications enable row level security;
alter table public.approvals enable row level security;
alter table public.campaigns enable row level security;
alter table public.seller_wallet_transactions enable row level security;
alter table public.withdrawal_requests enable row level security;
alter table public.fraud_alerts enable row level security;
alter table public.warehouses enable row level security;
alter table public.suppliers enable row level security;
alter table public.customer_rewards enable row level security;
alter table public.disputes enable row level security;
alter table public.marketplace_settings enable row level security;

-- Admin access is intentionally explicit; seller/customer-specific policies
-- can be added when those portals start writing these records.
do $$
declare
  table_name text;
begin
  foreach table_name in array array['seller_applications','approvals','campaigns','seller_wallet_transactions','withdrawal_requests','fraud_alerts','warehouses','suppliers','customer_rewards','disputes','marketplace_settings']
  loop
    execute format('drop policy if exists "admins manage %1$s" on public.%1$s', table_name);
    execute format('create policy "admins manage %1$s" on public.%1$s for all using (public.is_admin()) with check (public.is_admin())', table_name);
  end loop;
end $$;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

drop policy if exists "users manage own seller application" on public.seller_applications;
create policy "users manage own seller application" on public.seller_applications
for all using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "users read own notifications" on public.notifications;
create policy "users read own notifications" on public.notifications
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "users manage own price alerts" on public.price_alerts;
create policy "users manage own price alerts" on public.price_alerts
for all using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "users manage own preorders" on public.preorders;
create policy "users manage own preorders" on public.preorders
for all using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "users manage own recurring orders" on public.recurring_orders;
create policy "users manage own recurring orders" on public.recurring_orders
for all using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create index if not exists approvals_status_idx on public.approvals(status, approval_type);
create index if not exists fraud_alerts_status_idx on public.fraud_alerts(status, risk_level);
create index if not exists campaigns_status_idx on public.campaigns(status, starts_at, ends_at);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  trigger_type text not null check (trigger_type in ('stock_below', 'seller_cancellation', 'high_risk_order', 'product_score', 'inactive_customer')),
  condition jsonb not null default '{}'::jsonb,
  action_type text not null check (action_type in ('notify_seller', 'manual_review', 'send_coupon', 'recommend_campaign', 'send_comeback_coupon')),
  enabled boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  last_run_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_marketplace_reports (
  id uuid primary key default gen_random_uuid(),
  report_date date not null default current_date,
  report jsonb not null default '{}'::jsonb,
  generated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.product_events (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null check (event_type in ('view', 'wishlist', 'cart', 'purchase', 'share')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.product_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  reason text not null,
  score numeric(8,4) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.brand_stores (
  id uuid primary key default gen_random_uuid(),
  brand text unique not null,
  slug text unique not null,
  description text,
  logo_url text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.seller_storefronts (
  seller_id uuid primary key references public.sellers(id) on delete cascade,
  slug text unique not null,
  description text,
  logo_url text,
  cover_url text,
  is_featured boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.finance_ledger (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.sellers(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  entry_type text not null check (entry_type in ('sale', 'commission', 'tax', 'refund', 'adjustment', 'settlement')),
  debit numeric(12,2) not null default 0,
  credit numeric(12,2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_type text not null check (actor_type in ('admin', 'seller', 'customer', 'system')),
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip_hash text,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid references public.notifications(id) on delete cascade,
  channel text not null check (channel in ('web', 'email', 'sms', 'whatsapp', 'push')),
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed')),
  provider_id text,
  sent_at timestamptz
);

create table if not exists public.live_commerce_sessions (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.sellers(id) on delete set null,
  title text not null,
  stream_url text,
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'ended')),
  starts_at timestamptz,
  ends_at timestamptz,
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
alter table public.chat_messages add column if not exists sender_type text not null default 'user';
alter table public.chat_messages drop constraint if exists chat_messages_sender_id_fkey;
alter table public.chat_messages alter column sender_id drop not null;
alter table public.chat_messages add constraint chat_messages_sender_id_fkey foreign key (sender_id) references auth.users(id) on delete cascade;
alter table public.chat_messages drop constraint if exists chat_messages_sender_type_check;
alter table public.chat_messages add constraint chat_messages_sender_type_check check (sender_type in ('user', 'ai'));

drop policy if exists "customers can read approved shops" on public.sellers;
create policy "customers can read approved shops" on public.sellers for select using (status = 'approved');

alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "chat participants read threads" on public.chat_threads;
create policy "chat participants read threads" on public.chat_threads for select
using (customer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());
drop policy if exists "customers and sellers create threads" on public.chat_threads;
create policy "customers and sellers create threads" on public.chat_threads for insert
with check (customer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());
drop policy if exists "chat participants update threads" on public.chat_threads;
create policy "chat participants update threads" on public.chat_threads for update
using (customer_id = auth.uid() or seller_id = auth.uid() or public.is_admin())
with check (customer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());
drop policy if exists "chat participants read messages" on public.chat_messages;
create policy "chat participants read messages" on public.chat_messages for select
using (exists (select 1 from public.chat_threads t where t.id = thread_id and (t.customer_id = auth.uid() or t.seller_id = auth.uid() or public.is_admin())));
drop policy if exists "chat participants send messages" on public.chat_messages;
create policy "chat participants send messages" on public.chat_messages for insert
with check ((sender_id = auth.uid() or (sender_type = 'ai' and sender_id is null)) and exists (select 1 from public.chat_threads t where t.id = thread_id and (t.customer_id = auth.uid() or t.seller_id = auth.uid() or public.is_admin())));

create index if not exists chat_messages_thread_created_idx on public.chat_messages(thread_id, created_at);
alter table public.chat_messages replica identity full;
alter table public.chat_threads replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.chat_threads;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.chat_messages;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

notify pgrst, 'reload schema';

alter table public.automation_rules enable row level security;
alter table public.ai_marketplace_reports enable row level security;
alter table public.product_events enable row level security;
alter table public.product_recommendations enable row level security;
alter table public.brand_stores enable row level security;
alter table public.seller_storefronts enable row level security;
alter table public.finance_ledger enable row level security;
alter table public.audit_events enable row level security;
alter table public.notification_deliveries enable row level security;
alter table public.live_commerce_sessions enable row level security;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['automation_rules','ai_marketplace_reports','brand_stores','seller_storefronts','finance_ledger','audit_events','notification_deliveries','live_commerce_sessions']
  loop
    execute format('drop policy if exists "admins manage %1$s" on public.%1$s', table_name);
    execute format('create policy "admins manage %1$s" on public.%1$s for all using (public.is_admin()) with check (public.is_admin())', table_name);
  end loop;
end $$;

drop policy if exists "users create product events" on public.product_events;
create policy "users create product events" on public.product_events for insert with check (user_id = auth.uid() or user_id is null);
drop policy if exists "users read own recommendations" on public.product_recommendations;
create policy "users read own recommendations" on public.product_recommendations for select using (user_id = auth.uid() or public.is_admin());

create table if not exists public.approval_rules (
  approval_type text primary key check (approval_type in ('seller', 'product', 'brand', 'category', 'campaign', 'coupon', 'price_change', 'withdrawal', 'refund', 'dispute')),
  mode text not null default 'manual' check (mode in ('auto', 'ai_review', 'manual')),
  min_risk_score integer not null default 0 check (min_risk_score between 0 and 100),
  enabled boolean not null default true,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.approval_rules (approval_type)
values ('seller'), ('product'), ('brand'), ('category'), ('campaign'), ('coupon'), ('price_change'), ('withdrawal'), ('refund'), ('dispute')
on conflict (approval_type) do nothing;

create table if not exists public.seller_tiers (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid unique not null references public.sellers(id) on delete cascade,
  tier text not null default 'new' check (tier in ('new', 'standard', 'premium', 'top_seller')),
  score numeric(5,2) not null default 0,
  sla_metrics jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.commission_rules (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.sellers(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  rate numeric(5,2) not null check (rate between 0 and 100),
  priority integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text unique not null check (name in ('free', 'pro', 'business')),
  monthly_price numeric(12,2) not null default 0,
  benefits jsonb not null default '{}'::jsonb,
  is_active boolean not null default true
);

insert into public.subscription_plans (name, monthly_price)
values ('free', 0), ('pro', 999), ('business', 2999)
on conflict (name) do nothing;

create table if not exists public.seller_subscriptions (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.sellers(id) on delete cascade,
  plan_id uuid not null references public.subscription_plans(id),
  status text not null default 'active' check (status in ('trial', 'active', 'past_due', 'cancelled')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz
);

create table if not exists public.price_history (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  price numeric(12,2) not null,
  original_price numeric(12,2),
  discount_price numeric(12,2),
  changed_by uuid references auth.users(id) on delete set null,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_fulfillments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  seller_id uuid references public.sellers(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'returned')),
  tracking_number text,
  courier text,
  created_at timestamptz not null default now()
);

create table if not exists public.return_policies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rules jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.feature_flags (
  key text primary key,
  enabled boolean not null default false,
  rollout_percent integer not null default 0 check (rollout_percent between 0 and 100),
  seller_ids uuid[] not null default '{}',
  user_ids uuid[] not null default '{}',
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.api_webhooks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  endpoint_url text not null,
  event_types text[] not null default '{}',
  secret_hash text,
  active boolean not null default true,
  last_status integer,
  created_at timestamptz not null default now()
);

create table if not exists public.price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  alert_type text not null check (alert_type in ('price_drop', 'back_in_stock')),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, product_id, alert_type)
);

create table if not exists public.gift_cards (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  balance numeric(12,2) not null check (balance >= 0),
  expires_at timestamptz,
  status text not null default 'active' check (status in ('active', 'redeemed', 'expired', 'disabled'))
);

create table if not exists public.preorders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  status text not null default 'placed' check (status in ('placed', 'ready', 'converted', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.recurring_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  frequency text not null check (frequency in ('weekly', 'monthly', 'quarterly')),
  next_run_at timestamptz not null,
  status text not null default 'active' check (status in ('active', 'paused', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.approval_rules enable row level security;
alter table public.seller_tiers enable row level security;
alter table public.commission_rules enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.seller_subscriptions enable row level security;
alter table public.price_history enable row level security;
alter table public.order_fulfillments enable row level security;
alter table public.return_policies enable row level security;
alter table public.notifications enable row level security;
alter table public.feature_flags enable row level security;
alter table public.api_webhooks enable row level security;
alter table public.price_alerts enable row level security;
alter table public.gift_cards enable row level security;
alter table public.preorders enable row level security;
alter table public.recurring_orders enable row level security;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['approval_rules','seller_tiers','commission_rules','subscription_plans','seller_subscriptions','price_history','order_fulfillments','return_policies','notifications','feature_flags','api_webhooks','price_alerts','gift_cards','preorders','recurring_orders']
  loop
    execute format('drop policy if exists "admins manage %1$s" on public.%1$s', table_name);
    execute format('create policy "admins manage %1$s" on public.%1$s for all using (public.is_admin()) with check (public.is_admin())', table_name);
  end loop;
end $$;
