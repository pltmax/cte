-- ─────────────────────────────────────────────────────────────────────────────
-- Add missing columns to profiles that are required for premium access control,
-- idempotent payment processing, and contact rate limiting.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS premium_expires_at      TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS plan_type               TEXT,
  ADD COLUMN IF NOT EXISTS stripe_last_session_id  TEXT,
  ADD COLUMN IF NOT EXISTS last_contact_at         TIMESTAMP WITH TIME ZONE;
