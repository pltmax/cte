-- ─────────────────────────────────────────────────────────────────────────────
-- Add answers column to mock_exams and update complete_exam() to accept
-- scores and the full answers blob.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.mock_exams
  add column if not exists answers jsonb;

-- ─────────────────────────────────────────────────────────────────────────────
-- complete_exam(exam_id, p_listening_score, p_reading_score, p_score, p_answers)
--
-- All score/answer params are optional (default null) so callers that can't
-- compute scores (local-JSON fallback) still work without passing them.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.complete_exam(
  exam_id           uuid,
  p_listening_score integer default null,
  p_reading_score   integer default null,
  p_score           integer default null,
  p_answers         jsonb   default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.mock_exams
  set    status          = 'completed',
         completed_at    = now(),
         listening_score = coalesce(p_listening_score, listening_score),
         reading_score   = coalesce(p_reading_score,   reading_score),
         score           = coalesce(p_score,            score),
         answers         = coalesce(p_answers,          answers)
  where  id      = exam_id
  and    user_id = auth.uid()
  and    status  = 'in_progress';
end;
$$;

grant execute on function public.complete_exam(uuid, integer, integer, integer, jsonb) to authenticated;
