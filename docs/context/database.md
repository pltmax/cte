# Database Context — Supabase

> Auto-generated on 2026-02-26 13:49
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

## Tables (2)

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

**RLS Policies:**

- **Users can insert their own mock exams** (INSERT, PERMISSIVE)
  - WITH CHECK: `(auth.uid() = user_id)`
- **Users can update their own mock exams** (UPDATE, PERMISSIVE)
  - USING: `(auth.uid() = user_id)`
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

**RLS Policies:**

- **Profiles are viewable by the owner.** (SELECT, PERMISSIVE)
  - USING: `(auth.uid() = id)`
- **Users can update their own profiles.** (UPDATE, PERMISSIVE)
  - USING: `(auth.uid() = id)`

## RPC Functions (4)

| Function | Arguments | Returns | Security |
|----------|-----------|---------|----------|
| `handle_new_user` | `none` | `trigger` | SECURITY DEFINER |
| `is_phone_available` | `p_phone_e164 text` | `boolean` | SECURITY DEFINER |
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

