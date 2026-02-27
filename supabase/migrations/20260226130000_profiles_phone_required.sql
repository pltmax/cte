-- Enforce phone_e164 is non-null for NEW rows only (NOT VALID skips existing rows).
-- Run `alter table public.profiles validate constraint profiles_phone_e164_required;`
-- once all existing users have been backfilled.
alter table public.profiles
  add constraint profiles_phone_e164_required
  check (phone_e164 is not null)
  not valid;

-- Tighten trigger: raise an explicit error if phone_e164 is missing at signup.
-- This prevents account creation via direct API calls that omit the phone.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  if coalesce(trim(new.raw_user_meta_data->>'phone_e164'), '') = '' then
    raise exception 'phone_e164 is required for new user registration';
  end if;

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
