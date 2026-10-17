-- Run once in Supabase SQL Editor to unlock the existing BAHARAZ admin account.
-- This is repeat-safe and does not expose service-role credentials.

alter table public.products alter column seller_id drop not null;

insert into public.profiles (id, full_name, role)
select id, coalesce(raw_user_meta_data->>'full_name', 'BAHARAZ Admin'), 'admin'
from auth.users
where lower(email) = 'erajshophelp@gmail.com'
on conflict (id) do update set role = 'admin', updated_at = now();

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

notify pgrst, 'reload schema';
