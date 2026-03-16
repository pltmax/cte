-- Drop the direct INSERT policy on mock_exams.
-- All exam creation must go through launch_exam() SECURITY DEFINER RPC,
-- which atomically checks and deducts credits before inserting.
-- Leaving this policy active allowed any authenticated user to create exam
-- rows directly via the REST API, bypassing credit deduction entirely.

drop policy if exists "Users can insert their own mock exams" on public.mock_exams;
