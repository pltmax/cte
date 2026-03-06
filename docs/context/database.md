# Database Context — Supabase

> Auto-generated on 2026-03-06 15:46
> Do not edit manually. Regenerate with: `npm run context:db`

## Extensions

| Extension | Version |
|-----------|---------|
| `pg_graphql` | 1.5.11 |
| `pg_stat_statements` | 1.11 |
| `pgcrypto` | 1.3 |
| `plpgsql` | 1.0 |
| `supabase_vault` | 0.3.1 |
| `uuid-ossp` | 1.1 |

## Tables (10)

### `mock_exams` — ✅ RLS enabled


**Columns:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | `uuid` | ✗ | `gen_random_uuid()` |
| `user_id` | `uuid` | ✗ | — |
| `created_at` | `timestamp with time zone` | ✗ | `now()` |
| `completed_at` | `timestamp with time zone` | ✓ | — |
| `status` | `text` | ✗ | `'pending'::text` |
| `score` | `integer` | ✓ | — |
| `listening_score` | `integer` | ✓ | — |
| `reading_score` | `integer` | ✓ | — |
| `dataset_id` | `smallint` | ✓ | — |
| `answers` | `jsonb` | ✓ | — |

**RLS Policies:**

- **Users can insert their own mock exams** (INSERT, PERMISSIVE)
  - WITH CHECK: `(auth.uid() = user_id)`
- **Users can view their own mock exams** (SELECT, PERMISSIVE)
  - USING: `(auth.uid() = user_id)`

### `profiles` — ✅ RLS enabled


**Columns:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | `uuid` | ✗ | — |
| `full_name` | `text` | ✓ | — |
| `email` | `text` | ✓ | — |
| `role` | `text` | ✓ | `'user'::text` |
| `created_at` | `timestamp with time zone` | ✗ | `now()` |
| `updated_at` | `timestamp with time zone` | ✗ | `now()` |
| `first_name` | `text` | ✓ | — |
| `last_name` | `text` | ✓ | — |
| `phone` | `text` | ✓ | — |
| `how_heard` | `text` | ✓ | — |
| `phone_e164` | `text` | ✓ | — |
| `credit_number` | `integer` | ✗ | `0` |
| `stripe_customer_id` | `text` | ✓ | — |

**RLS Policies:**

- **Profiles are viewable by the owner.** (SELECT, PERMISSIVE)
  - USING: `(auth.uid() = id)`
- **Users can update their own profiles.** (UPDATE, PERMISSIVE)
  - USING: `(auth.uid() = id)`
  - WITH CHECK: `((auth.uid() = id) AND (role = ( SELECT profiles_1.role
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid()))) AND (credit_number = ( SELECT profiles_1.credit_number
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid()))) AND (NOT (stripe_customer_id IS DISTINCT FROM ( SELECT profiles_1.stripe_customer_id
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid())))))`

### `subscriptions` — ✅ RLS enabled


**Columns:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | `text` | ✗ | — |
| `user_id` | `uuid` | ✗ | — |
| `stripe_customer_id` | `text` | ✗ | — |
| `status` | `text` | ✗ | — |
| `current_period_end` | `timestamp with time zone` | ✓ | — |
| `cancel_at` | `timestamp with time zone` | ✓ | — |
| `created_at` | `timestamp with time zone` | ✗ | `now()` |
| `updated_at` | `timestamp with time zone` | ✗ | `now()` |

**RLS Policies:**

- **Users can view their own subscriptions** (SELECT, PERMISSIVE)
  - USING: `(auth.uid() = user_id)`

### `toeic_listening_part1` — ✅ RLS enabled


**Columns:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | `uuid` | ✗ | `gen_random_uuid()` |
| `position` | `integer` | ✗ | — |
| `image` | `text` | ✓ | — |
| `statements` | `jsonb` | ✗ | — |
| `answer` | `text` | ✗ | — |
| `image_url` | `text` | ✓ | — |
| `audio_urls` | `jsonb` | ✓ | — |
| `is_exam` | `boolean` | ✗ | `true` |
| `created_at` | `timestamp with time zone` | ✓ | `now()` |
| `dataset_id` | `smallint` | ✓ | — |

**RLS Policies:**

- **premium users can read toeic_listening_part1** (SELECT, PERMISSIVE)
  - USING: `(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['premium'::text, 'admin'::text])))))`

### `toeic_listening_part2` — ✅ RLS enabled


**Columns:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | `uuid` | ✗ | `gen_random_uuid()` |
| `position` | `integer` | ✗ | — |
| `category` | `text` | ✓ | — |
| `question` | `text` | ✗ | — |
| `options` | `jsonb` | ✗ | — |
| `answer` | `text` | ✗ | — |
| `question_audio_url` | `text` | ✓ | — |
| `option_audio_urls` | `jsonb` | ✓ | — |
| `is_exam` | `boolean` | ✗ | `true` |
| `created_at` | `timestamp with time zone` | ✓ | `now()` |
| `dataset_id` | `smallint` | ✓ | — |

**RLS Policies:**

- **premium users can read toeic_listening_part2** (SELECT, PERMISSIVE)
  - USING: `(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['premium'::text, 'admin'::text])))))`

### `toeic_listening_part3` — ✅ RLS enabled


**Columns:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | `uuid` | ✗ | `gen_random_uuid()` |
| `position` | `integer` | ✗ | — |
| `dialogue` | `jsonb` | ✗ | — |
| `questions` | `jsonb` | ✗ | — |
| `audio_url` | `text` | ✓ | — |
| `is_exam` | `boolean` | ✗ | `true` |
| `created_at` | `timestamp with time zone` | ✓ | `now()` |
| `dataset_id` | `smallint` | ✓ | — |

**RLS Policies:**

- **premium users can read toeic_listening_part3** (SELECT, PERMISSIVE)
  - USING: `(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['premium'::text, 'admin'::text])))))`

### `toeic_listening_part4` — ✅ RLS enabled


**Columns:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | `uuid` | ✗ | `gen_random_uuid()` |
| `position` | `integer` | ✗ | — |
| `title` | `text` | ✓ | — |
| `text` | `text` | ✗ | — |
| `questions` | `jsonb` | ✗ | — |
| `audio_url` | `text` | ✓ | — |
| `graphic_title` | `text` | ✓ | — |
| `graphic_doctype` | `text` | ✓ | — |
| `graphic` | `jsonb` | ✓ | — |
| `is_exam` | `boolean` | ✗ | `true` |
| `created_at` | `timestamp with time zone` | ✓ | `now()` |
| `dataset_id` | `smallint` | ✓ | — |

**RLS Policies:**

- **premium users can read toeic_listening_part4** (SELECT, PERMISSIVE)
  - USING: `(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['premium'::text, 'admin'::text])))))`

### `toeic_reading_part5` — ✅ RLS enabled


**Columns:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | `uuid` | ✗ | `gen_random_uuid()` |
| `position` | `integer` | ✗ | — |
| `text` | `text` | ✗ | — |
| `options` | `jsonb` | ✗ | — |
| `answer` | `text` | ✗ | — |
| `is_exam` | `boolean` | ✗ | `true` |
| `created_at` | `timestamp with time zone` | ✓ | `now()` |
| `dataset_id` | `smallint` | ✓ | — |

**RLS Policies:**

- **premium users can read toeic_reading_part5** (SELECT, PERMISSIVE)
  - USING: `(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['premium'::text, 'admin'::text])))))`

### `toeic_reading_part6` — ✅ RLS enabled


**Columns:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | `uuid` | ✗ | `gen_random_uuid()` |
| `position` | `integer` | ✗ | — |
| `doctype` | `text` | ✓ | — |
| `text` | `text` | ✗ | — |
| `questions` | `jsonb` | ✗ | — |
| `is_exam` | `boolean` | ✗ | `true` |
| `created_at` | `timestamp with time zone` | ✓ | `now()` |
| `dataset_id` | `smallint` | ✓ | — |

**RLS Policies:**

- **premium users can read toeic_reading_part6** (SELECT, PERMISSIVE)
  - USING: `(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['premium'::text, 'admin'::text])))))`

### `toeic_reading_part7` — ✅ RLS enabled


**Columns:**

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | `uuid` | ✗ | `gen_random_uuid()` |
| `position` | `integer` | ✗ | — |
| `documents` | `jsonb` | ✗ | — |
| `questions` | `jsonb` | ✗ | — |
| `is_exam` | `boolean` | ✗ | `true` |
| `created_at` | `timestamp with time zone` | ✓ | `now()` |
| `dataset_id` | `smallint` | ✓ | — |

**RLS Policies:**

- **premium users can read toeic_reading_part7** (SELECT, PERMISSIVE)
  - USING: `(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['premium'::text, 'admin'::text])))))`

## RPC Functions (7)

| Function | Arguments | Returns | Security |
|----------|-----------|---------|----------|
| `complete_exam` | `exam_id uuid` | `void` | SECURITY DEFINER |
| `complete_exam` | `exam_id uuid, p_listening_score integer DEFAULT NULL::integer, p_reading_score integer DEFAULT NULL::integer, p_score integer DEFAULT NULL::integer, p_answers jsonb DEFAULT NULL::jsonb` | `void` | SECURITY DEFINER |
| `handle_new_user` | `none` | `trigger` | SECURITY DEFINER |
| `is_phone_available` | `p_phone_e164 text` | `boolean` | SECURITY DEFINER |
| `launch_exam` | `none` | `uuid` | SECURITY DEFINER |
| `rls_auto_enable` | `none` | `event_trigger` | SECURITY DEFINER |
| `update_updated_at_column` | `none` | `trigger` | SECURITY INVOKER |

## Applied Migrations

- `20260223161544_initial_schema.sql`
- `20260226000001_profiles_add_fields.sql`
- `20260226000002_profiles_phone_e164.sql`
- `20260226000003_profiles_add_credits.sql`
- `20260226000004_mock_exams.sql`
- `20260226120000_profiles_phone_unique.sql`
- `20260226130000_profiles_phone_required.sql`
- `20260227000001_admin_rpcs.sql`
- `20260227000002_stripe.sql`
- `20260227000003_toeic_listening_tables.sql`
- `20260227000004_mock_exams_dataset_id.sql`
- `20260227000005_toeic_reading_tables.sql`
- `20260227000006_toeic_parts_dataset_id.sql`
- `20260228000001_launch_exam_admin_bypass.sql`
- `20260301000001_complete_exam.sql`
- `20260301000002_mock_exams_answers.sql`
- `20260302000001_security_hardening.sql`
- `20260306000001_pool_migration.sql`

