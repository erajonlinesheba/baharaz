-- Run this once in Supabase SQL Editor if the full admin migration has not
-- been applied. It enables customer, seller and admin realtime chat.
create extension if not exists "pgcrypto";

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

alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "chat participants read threads" on public.chat_threads;
create policy "chat participants read threads" on public.chat_threads for select
using (customer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());
drop policy if exists "chat participants create threads" on public.chat_threads;
create policy "chat participants create threads" on public.chat_threads for insert
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

alter table public.chat_threads replica identity full;
alter table public.chat_messages replica identity full;
do $$ begin
  alter publication supabase_realtime add table public.chat_threads;
exception when duplicate_object then null; when undefined_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.chat_messages;
exception when duplicate_object then null; when undefined_object then null; end $$;
notify pgrst, 'reload schema';
