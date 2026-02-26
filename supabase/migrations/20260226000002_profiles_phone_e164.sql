-- Add normalised E.164 phone column with uniqueness constraint
alter table public.profiles
  add column if not exists phone_e164 text unique;

-- Update trigger to also store phone_e164 from signup metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, full_name, first_name, last_name,
    email, phone, phone_e164, how_heard, role
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
$$ language plpgsql security definer;

-- RPC callable by anon: returns true if the E.164 number is not taken.
-- SECURITY DEFINER so the anon role can check without reading profiles directly.
-- Returns only a boolean — no user data is exposed.
create or replace function public.is_phone_available(p_phone_e164 text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return not exists (
    select 1 from public.profiles where phone_e164 = p_phone_e164
  );
end;
$$;

grant execute on function public.is_phone_available(text) to anon, authenticated;
