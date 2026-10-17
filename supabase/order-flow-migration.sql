-- Baharaz persistent order flow. Run in Supabase SQL Editor.

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check check (
  status in ('pending', 'confirmed', 'processing', 'packed', 'ready_to_ship',
  'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned',
  'return_requested', 'refund_pending', 'refunded', 'disputed')
);

alter table public.order_items enable row level security;
drop policy if exists "customers create order items" on public.order_items;
create policy "customers create order items" on public.order_items for insert
with check (exists (
  select 1 from public.orders o
  where o.id = order_id and (o.customer_id = auth.uid() or public.is_admin())
));

drop policy if exists "customers read own orders" on public.orders;
create policy "customers read own orders" on public.orders for select
using (customer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());

drop policy if exists "customers create orders" on public.orders;
create policy "customers create orders" on public.orders for insert
with check (customer_id = auth.uid() or public.is_admin());

notify pgrst, 'reload schema';
