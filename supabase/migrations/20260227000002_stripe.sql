-- ─────────────────────────────────────────────────────────────────────────────
-- Stripe integration
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Stripe customer ID on profiles (unique: one Stripe customer per user)
alter table public.profiles
  add column if not exists stripe_customer_id text unique;

-- 2. Subscriptions table — tracks active Stripe subscriptions
create table public.subscriptions (
  id                 text primary key,          -- Stripe subscription ID (sub_xxx)
  user_id            uuid references auth.users on delete cascade not null,
  stripe_customer_id text                       not null,
  status             text                       not null,  -- active | canceled | past_due | …
  current_period_end timestamp with time zone,
  cancel_at          timestamp with time zone,
  created_at         timestamp with time zone   default now() not null,
  updated_at         timestamp with time zone   default now() not null
);

create index subscriptions_user_id_idx           on public.subscriptions (user_id);
create index subscriptions_stripe_customer_id_idx on public.subscriptions (stripe_customer_id);

alter table public.subscriptions enable row level security;

-- Users can read their own subscriptions (e.g. to show active plan in UI)
create policy "Users can view their own subscriptions"
  on subscriptions for select
  using (auth.uid() = user_id);

-- All writes come from the backend service role — no INSERT/UPDATE/DELETE policies needed.

-- Auto-update updated_at
create trigger update_subscriptions_updated_at
  before update on subscriptions
  for each row execute procedure update_updated_at_column();
