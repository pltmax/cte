CREATE OR REPLACE FUNCTION public.abandon_exam(
  exam_id           uuid,
  p_answers         jsonb    DEFAULT NULL,
  p_listening_score integer  DEFAULT NULL,
  p_reading_score   integer  DEFAULT NULL,
  p_score           integer  DEFAULT NULL
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.mock_exams
  SET status          = 'abandoned',
      completed_at    = now(),
      answers         = COALESCE(p_answers, answers),
      listening_score = COALESCE(p_listening_score, listening_score),
      reading_score   = COALESCE(p_reading_score, reading_score),
      score           = COALESCE(p_score, score)
  WHERE id      = exam_id
  AND   user_id = auth.uid()
  AND   status  = 'in_progress';
END;
$$;

GRANT EXECUTE ON FUNCTION public.abandon_exam(uuid,jsonb,integer,integer,integer) TO authenticated;
