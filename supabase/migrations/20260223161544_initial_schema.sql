-- 1. Create the profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  email text, -- Mirrored from auth.users for convenience
  role text default 'user' check (role in ('admin', 'premium', 'user')),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- 2. Enable Row Level Security
alter table public.profiles enable row level security;

-- 3. RLS Policies
create policy "Profiles are viewable by the owner."
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profiles."
  on profiles for update
  using ( auth.uid() = id );

-- 4. Function to handle new user signups
-- This extracts the email and full_name from the auth metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email, 
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 5. Trigger to execute function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Function to handle updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- 7. Trigger to auto-update the 'updated_at' field
create trigger update_profiles_updated_at
    before update on profiles
    for each row execute procedure update_updated_at_column();