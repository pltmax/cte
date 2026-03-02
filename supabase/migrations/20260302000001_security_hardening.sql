-- ─────────────────────────────────────────────────────────────────────────────
-- Security hardening
--
-- 1. profiles UPDATE — add WITH CHECK to prevent users from self-escalating
--    role, self-assigning credits, or hijacking a Stripe customer identity
--    via a direct REST API PATCH on their own row.
--
-- 2. mock_exams UPDATE — drop the broad update policy entirely. All writes
--    to score/status/answers must go through the complete_exam() SECURITY
--    DEFINER RPC, which bypasses RLS. Direct REST updates are now denied.
--
-- 3. TOEIC content tables — replace the permissive "any authenticated user"
--    SELECT policy with one that requires premium or admin role.
--    NOTE: this makes exercise pages premium-only. If free-tier access to
--    exercises is desired, adjust the policy to include role = 'user' or use
--    a dataset_id filter to separate free vs. premium content.
-- ─────────────────────────────────────────────────────────────────────────────


-- ─── 1. profiles — lock sensitive columns on update ──────────────────────────

drop policy if exists "Users can update their own profiles." on public.profiles;

create policy "Users can update their own profiles."
  on public.profiles
  for update
  using ( auth.uid() = id )
  with check (
    auth.uid() = id
    -- role must not change (prevents self-promotion to admin/premium)
    and role = (select role from public.profiles where id = auth.uid())
    -- credit_number must not change (prevents self-crediting)
    and credit_number = (select credit_number from public.profiles where id = auth.uid())
    -- stripe_customer_id must not change (handles null correctly via IS NOT DISTINCT FROM)
    and stripe_customer_id is not distinct from (
      select stripe_customer_id from public.profiles where id = auth.uid()
    )
  );


-- ─── 2. mock_exams — remove broad update policy ───────────────────────────────
-- All score/status/answers writes go through complete_exam() (SECURITY DEFINER).
-- Without a matching UPDATE policy, RLS denies direct REST API updates.

drop policy if exists "Users can update their own mock exams" on public.mock_exams;


-- ─── 3. TOEIC content tables — require premium or admin role ─────────────────

-- Part 1
drop policy if exists "authenticated users can read toeic_listening_part1" on public.toeic_listening_part1;
create policy "premium users can read toeic_listening_part1"
  on public.toeic_listening_part1
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('premium', 'admin')
    )
  );

-- Part 2
drop policy if exists "authenticated users can read toeic_listening_part2" on public.toeic_listening_part2;
create policy "premium users can read toeic_listening_part2"
  on public.toeic_listening_part2
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('premium', 'admin')
    )
  );

-- Part 3
drop policy if exists "authenticated users can read toeic_listening_part3" on public.toeic_listening_part3;
create policy "premium users can read toeic_listening_part3"
  on public.toeic_listening_part3
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('premium', 'admin')
    )
  );

-- Part 4
drop policy if exists "authenticated users can read toeic_listening_part4" on public.toeic_listening_part4;
create policy "premium users can read toeic_listening_part4"
  on public.toeic_listening_part4
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('premium', 'admin')
    )
  );

-- Part 5
drop policy if exists "authenticated users can read toeic_reading_part5" on public.toeic_reading_part5;
create policy "premium users can read toeic_reading_part5"
  on public.toeic_reading_part5
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('premium', 'admin')
    )
  );

-- Part 6
drop policy if exists "authenticated users can read toeic_reading_part6" on public.toeic_reading_part6;
create policy "premium users can read toeic_reading_part6"
  on public.toeic_reading_part6
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('premium', 'admin')
    )
  );

-- Part 7
drop policy if exists "authenticated users can read toeic_reading_part7" on public.toeic_reading_part7;
create policy "premium users can read toeic_reading_part7"
  on public.toeic_reading_part7
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('premium', 'admin')
    )
  );
