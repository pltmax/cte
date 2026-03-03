-- ─────────────────────────────────────────────────────────────────────────────
-- complete_exam(exam_id uuid)
--
-- Called by an authenticated user from the browser when all 7 parts are done.
-- Marks the exam as completed with a timestamp.
-- Score columns remain null until a scoring system is implemented.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.complete_exam(exam_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.mock_exams
  set    status       = 'completed',
         completed_at = now()
  where  id      = exam_id
  and    user_id = auth.uid()
  and    status  = 'in_progress';

  -- If no row was updated the exam either doesn't belong to this user,
  -- doesn't exist, or was already completed — all safe to ignore silently.
end;
$$;

grant execute on function public.complete_exam(uuid) to authenticated;
