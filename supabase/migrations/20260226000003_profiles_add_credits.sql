alter table public.profiles
  add column if not exists credit_number integer not null default 0;
