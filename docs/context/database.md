# Database Context — Supabase

> Auto-generated on 2026-02-26 08:22
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

## Tables (1)

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
- `20260226120000_profiles_phone_unique.sql`

