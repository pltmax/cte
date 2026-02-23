---
description: "Supabase Environment, RLS Security, and RBAC Enforcement"
alwaysApply: true
---

# Supabase Security & Key Management

## 1. Environment Variables & Scope
- **Frontend (Public):** Use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. These are for client-side routing and RLS-restricted queries only.
- **Backend (Private):** - `SUPABASE_URL` & `SUPABASE_ANON_KEY`: Use via `get_supabase_client()` in `app.db`.
  - `SUPABASE_SERVICE_ROLE_KEY`: **Strictly Backend-only.** Bypasses RLS. Use ONLY for system-level migrations, admin overrides, or initial data seeding.
- **Critical Guardrail:** Never prefix the Service Role Key with `NEXT_PUBLIC_`.

## 2. Row Level Security (RLS) & Access Control
- **RLS is Mandatory:** Every table must have RLS enabled. If a query returns an empty set unexpectedly, the first step is to verify the SQL Policy, not the application logic.
- **RBAC (Role Based Access Control):** - Do not use different "keys" for user tiers (e.g., premium/admin). 
  - Use `auth.jwt()` or a `profiles` table to check user claims within SQL policies.
  - *Example Policy:* `USING ( (auth.jwt() ->> 'role') = 'premium' )`


## 3. Implementation Standards
- **Route Protection:** Use Next.js Middleware/SSR for authentication gates. **Prohibited:** Manually checking `supabase.auth.getSession()` inside every individual `page.tsx`.
- **Backend Ops:** Always use the centralized `app.db` provider. Do not instantiate the Supabase client manually in routers.
- **Data Integrity:** When performing actions on behalf of a user in FastAPI, attempt to use the user's JWT to ensure RLS is respected, rather than defaulting to the Service Role bypass.

## 4. Policy Verification
- Before suggesting any DB schema change or new table, you MUST provide the corresponding `CREATE POLICY` SQL statements for `anon`, `authenticated`, and `admin` roles.