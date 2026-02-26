-- Add signup-form fields to profiles
alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name  text,
  add column if not exists phone      text,
  add column if not exists how_heard  text;

-- Update trigger to populate new fields from auth metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, first_name, last_name, email, phone, how_heard, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'how_heard',
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;
