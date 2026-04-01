-- ─────────────────────────────────────────────────────────────────────────────
-- Deferred credit deduction
--
-- prepare_exam()      → samples questions, inserts as 'pending' (no credit)
-- activate_exam(uuid) → transitions 'pending' → 'in_progress' + deducts credit
-- ─────────────────────────────────────────────────────────────────────────────


-- ── 1. prepare_exam ──────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.prepare_exam()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exam_id    uuid;
  v_exam_count integer;
  v_exam_data  jsonb;
  v_exam_ids   jsonb;
BEGIN
  -- Clean up any stale pending exams for this user before creating a new one
  DELETE FROM public.mock_exams
  WHERE  user_id = auth.uid()
  AND    status  = 'pending';

  -- Count completed exams for freshness scoring
  SELECT COUNT(*)::integer
  INTO   v_exam_count
  FROM   public.mock_exams
  WHERE  user_id = auth.uid()
  AND    status  = 'completed';

  -- Weighted sample from all 7 part tables (identical logic to launch_exam)
  WITH
  p1_sel AS (
    SELECT p.id, p.image, p.statements, p.answer, p.image_url, p.audio_urls
    FROM   public.toeic_listening_part1 p
    LEFT JOIN public.user_question_priorities uqp
      ON uqp.question_id = p.id AND uqp.user_id = auth.uid()
    WHERE  p.is_exam = true
    ORDER BY -LN(RANDOM()) / LEAST(3,
      COALESCE(uqp.priority, 3)::float +
      CASE WHEN v_exam_count - COALESCE(uqp.last_seen_exam_count, -999) >= 2
           THEN 1.0 ELSE 0.0 END
    )
    LIMIT 6
  ),
  p2_sel AS (
    SELECT p.id, p.category, p.question, p.options, p.answer,
           p.question_audio_url, p.option_audio_urls
    FROM   public.toeic_listening_part2 p
    LEFT JOIN public.user_question_priorities uqp
      ON uqp.question_id = p.id AND uqp.user_id = auth.uid()
    WHERE  p.is_exam = true
    ORDER BY -LN(RANDOM()) / LEAST(3,
      COALESCE(uqp.priority, 3)::float +
      CASE WHEN v_exam_count - COALESCE(uqp.last_seen_exam_count, -999) >= 2
           THEN 1.0 ELSE 0.0 END
    )
    LIMIT 25
  ),
  p3_sel AS (
    SELECT p.id, p.dialogue, p.questions, p.audio_url
    FROM   public.toeic_listening_part3 p
    LEFT JOIN public.user_question_priorities uqp
      ON uqp.question_id = p.id AND uqp.user_id = auth.uid()
    WHERE  p.is_exam = true
    ORDER BY -LN(RANDOM()) / LEAST(3,
      COALESCE(uqp.priority, 3)::float +
      CASE WHEN v_exam_count - COALESCE(uqp.last_seen_exam_count, -999) >= 2
           THEN 1.0 ELSE 0.0 END
    )
    LIMIT 13
  ),
  p4_sel AS (
    SELECT p.id, p.title, p.text, p.questions, p.audio_url,
           p.graphic_title, p.graphic_doctype, p.graphic
    FROM   public.toeic_listening_part4 p
    LEFT JOIN public.user_question_priorities uqp
      ON uqp.question_id = p.id AND uqp.user_id = auth.uid()
    WHERE  p.is_exam = true
    ORDER BY -LN(RANDOM()) / LEAST(3,
      COALESCE(uqp.priority, 3)::float +
      CASE WHEN v_exam_count - COALESCE(uqp.last_seen_exam_count, -999) >= 2
           THEN 1.0 ELSE 0.0 END
    )
    LIMIT 10
  ),
  p5_sel AS (
    SELECT p.id, p.text, p.options, p.answer
    FROM   public.toeic_reading_part5 p
    LEFT JOIN public.user_question_priorities uqp
      ON uqp.question_id = p.id AND uqp.user_id = auth.uid()
    WHERE  p.is_exam = true
    ORDER BY -LN(RANDOM()) / LEAST(3,
      COALESCE(uqp.priority, 3)::float +
      CASE WHEN v_exam_count - COALESCE(uqp.last_seen_exam_count, -999) >= 2
           THEN 1.0 ELSE 0.0 END
    )
    LIMIT 30
  ),
  p6_sel AS (
    SELECT p.id, p.doctype, p.text, p.questions
    FROM   public.toeic_reading_part6 p
    LEFT JOIN public.user_question_priorities uqp
      ON uqp.question_id = p.id AND uqp.user_id = auth.uid()
    WHERE  p.is_exam = true
    ORDER BY -LN(RANDOM()) / LEAST(3,
      COALESCE(uqp.priority, 3)::float +
      CASE WHEN v_exam_count - COALESCE(uqp.last_seen_exam_count, -999) >= 2
           THEN 1.0 ELSE 0.0 END
    )
    LIMIT 4
  ),
  p7_sel AS (
    SELECT p.id, p.documents, p.questions,
           jsonb_array_length(p.questions) AS q_count
    FROM   public.toeic_reading_part7 p
    LEFT JOIN public.user_question_priorities uqp
      ON uqp.question_id = p.id AND uqp.user_id = auth.uid()
    WHERE  p.is_exam = true
    ORDER BY -LN(RANDOM()) / LEAST(3,
      COALESCE(uqp.priority, 3)::float +
      CASE WHEN v_exam_count - COALESCE(uqp.last_seen_exam_count, -999) >= 2
           THEN 1.0 ELSE 0.0 END
    )
    LIMIT 13
  )
  SELECT
    jsonb_build_object(
      'exam_number', 0,
      'part1', COALESCE(
        (SELECT jsonb_agg(jsonb_build_object(
          'image', image, 'statements', statements, 'answer', answer,
          'image_url', image_url, 'audio_urls', audio_urls
        )) FROM p1_sel), '[]'::jsonb),
      'part2', COALESCE(
        (SELECT jsonb_agg(jsonb_build_object(
          'category', category, 'question', question, 'options', options,
          'answer', answer, 'question_audio_url', question_audio_url,
          'option_audio_urls', option_audio_urls
        )) FROM p2_sel), '[]'::jsonb),
      'part3', COALESCE(
        (SELECT jsonb_agg(jsonb_build_object(
          'dialogue', dialogue, 'questions', questions, 'audio_url', audio_url
        )) FROM p3_sel), '[]'::jsonb),
      'part4', COALESCE(
        (SELECT jsonb_agg(jsonb_build_object(
          'title', title, 'text', text, 'questions', questions,
          'audio_url', audio_url, 'graphic_title', graphic_title,
          'graphic_doctype', graphic_doctype, 'graphic', graphic
        )) FROM p4_sel), '[]'::jsonb),
      'part5', COALESCE(
        (SELECT jsonb_agg(jsonb_build_object(
          'text', text, 'options', options, 'answer', answer
        )) FROM p5_sel), '[]'::jsonb),
      'part6', COALESCE(
        (SELECT jsonb_agg(jsonb_build_object(
          'doctype', doctype, 'text', text, 'questions', questions
        )) FROM p6_sel), '[]'::jsonb),
      'part7', COALESCE(
        (SELECT jsonb_agg(jsonb_build_object(
          'documents', documents, 'questions', questions
        )) FROM p7_sel), '[]'::jsonb)
    ),
    jsonb_build_object(
      'p1', COALESCE((SELECT jsonb_agg(id::text) FROM p1_sel), '[]'::jsonb),
      'p2', COALESCE((SELECT jsonb_agg(id::text) FROM p2_sel), '[]'::jsonb),
      'p3', COALESCE((SELECT jsonb_agg(id::text) FROM p3_sel), '[]'::jsonb),
      'p4', COALESCE((SELECT jsonb_agg(id::text) FROM p4_sel), '[]'::jsonb),
      'p5', COALESCE((SELECT jsonb_agg(id::text) FROM p5_sel), '[]'::jsonb),
      'p6', COALESCE((SELECT jsonb_agg(id::text) FROM p6_sel), '[]'::jsonb),
      'p7', COALESCE((SELECT jsonb_agg(id::text) FROM p7_sel), '[]'::jsonb),
      'p7_question_counts', COALESCE(
        (SELECT jsonb_agg(q_count) FROM p7_sel), '[]'::jsonb)
    )
  INTO v_exam_data, v_exam_ids;

  INSERT INTO public.mock_exams (user_id, status, exam_data, exam_question_ids)
  VALUES (auth.uid(), 'pending', v_exam_data, v_exam_ids)
  RETURNING id INTO v_exam_id;

  RETURN v_exam_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.prepare_exam() TO authenticated;


-- ── 2. activate_exam ─────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.activate_exam(exam_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status      text;
  v_caller_role text;
  updated_rows  integer;
BEGIN
  -- Validate ownership and fetch current status
  SELECT status INTO v_status
  FROM   public.mock_exams
  WHERE  id = exam_id AND user_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'exam_not_found'
      USING HINT = 'No exam found for this user with the given ID';
  END IF;

  -- Idempotent: already activated (backward-compat with exams created by launch_exam)
  IF v_status = 'in_progress' THEN
    RETURN;
  END IF;

  IF v_status <> 'pending' THEN
    RAISE EXCEPTION 'exam_not_activatable'
      USING HINT = 'Exam must be in pending status to activate';
  END IF;

  -- Role check + credit deduction (skip for admins)
  SELECT COALESCE(role, 'user')
  INTO   v_caller_role
  FROM   public.profiles
  WHERE  id = auth.uid();

  IF v_caller_role <> 'admin' THEN
    UPDATE public.profiles
    SET    credit_number = credit_number - 1
    WHERE  id = auth.uid()
    AND    credit_number > 0;

    GET DIAGNOSTICS updated_rows = ROW_COUNT;

    IF updated_rows = 0 THEN
      RAISE EXCEPTION 'insufficient_credits'
        USING HINT = 'The user has no credits available';
    END IF;
  END IF;

  -- Transition to in_progress
  UPDATE public.mock_exams
  SET    status = 'in_progress'
  WHERE  id      = exam_id
  AND    user_id = auth.uid()
  AND    status  = 'pending';
END;
$$;

GRANT EXECUTE ON FUNCTION public.activate_exam(uuid) TO authenticated;
