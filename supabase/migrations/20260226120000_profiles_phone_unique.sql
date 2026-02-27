-- 1. Add phone_e164 column for the normalized canonical phone number
alter table public.profiles
  add column if not exists phone_e164 text
  check (phone_e164 ~ '^\+[1-9]\d{1,14}$');

-- 2. Partial unique index: allows multiple NULLs but rejects duplicate non-null values
create unique index if not exists profiles_phone_e164_unique
  on public.profiles (phone_e164)
  where phone_e164 is not null;

-- 3. Update handle_new_user() to also persist phone_e164 from auth metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, full_name, first_name, last_name, email, phone, phone_e164, how_heard, role
  )
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'phone_e164',
    new.raw_user_meta_data->>'how_heard',
    'user'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- 4. RPC: anon-callable boolean check — does not leak any user data
create or replace function public.is_phone_available(p_phone_e164 text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select not exists (
    select 1
    from public.profiles
    where phone_e164 = p_phone_e164
  );
$$;

-- Grant execute to anon (unauthenticated signup flow) and authenticated users
grant execute on function public.is_phone_available(text) to anon, authenticated;
