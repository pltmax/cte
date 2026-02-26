# ADR-002: Extend Profiles Table with Name Split, Phone, and Marketing Attribution
**Date**: 2026-02-26
**Status**: Accepted

## Context
The initial `profiles` table (migration `20260223161544_initial_schema.sql`) stored a single
`full_name` text column alongside `email`, `role`, and timestamps. As the platform grows
toward personalisation features and SaaS-standard growth tracking, three gaps emerged:

1. Personalised UI greetings ("Bonjour Jean") require the first name in isolation — parsing
   `full_name` at render time is fragile and locale-sensitive.
2. Phone numbers may be needed for SMS notifications or account recovery. Collecting them
   at signup maximises fill rate; retrofitting a collection flow later is costly.
3. Marketing attribution (`how_heard`) is a standard SaaS growth metric. It must be
   captured at signup — the only moment users reliably answer it.

All fields must be queryable through normal RLS-controlled SQL without bypassing auth layers.

## Decision
Migration `20260226000001_profiles_add_fields.sql` adds four nullable columns to `profiles`:

| Column | Type | Allowed values / notes |
|---|---|---|
| `first_name` | `text` | Free text |
| `last_name` | `text` | Free text |
| `phone` | `text` | Optional, E.164 format recommended |
| `how_heard` | `text` | `reseaux_sociaux`, `ami`, `moteur_recherche`, `publicite`, `ecole`, `autre` |

The `handle_new_user()` trigger is updated to populate these columns from
`raw_user_meta_data` passed during `supabase.auth.signUp()`, keeping the signup flow
as the single write path for initial profile data.

`full_name` is retained for backward compatibility and may be deprecated in a future ADR.

## Consequences
- POSITIVE: First name is available directly for personalised greetings without string parsing.
- POSITIVE: Phone collected at signup; no separate re-engagement flow required when SMS is added.
- POSITIVE: `how_heard` captured at the highest-fill-rate moment; data immediately usable for growth analysis.
- POSITIVE: All fields live in `profiles` under existing RLS policies — no new policies required.
- TRADEOFF: `full_name` and `first_name`/`last_name` now coexist; the frontend must decide which to display and keep them consistent on profile updates.
- TRADEOFF: `how_heard` values are validated in application code (signup form), not at the DB level — a CHECK constraint was not added to keep the migration simple and values extensible without future migrations.
- CONSTRAINT: `phone` is stored as plain text with no uniqueness constraint or format validation at the DB level; deduplication and format enforcement are the application's responsibility.

## Rejected Alternatives
- **Store first/last name only in `auth.users` metadata**: Rejected — `raw_user_meta_data` bypasses RLS, is not queryable via standard SQL joins, and couples profile data to the auth layer.
- **Collect phone via a separate post-signup flow**: Rejected — secondary collection flows have significantly lower completion rates; upfront collection at signup is the industry standard.
- **Separate `marketing_attribution` table**: Rejected — over-engineered for a single scalar field; a dedicated table would add a join to every profile query for no structural benefit at this stage.
