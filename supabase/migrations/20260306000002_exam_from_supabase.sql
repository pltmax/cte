-- ─────────────────────────────────────────────────────────────────────────────
-- exam_from_supabase migration
--
-- 1. user_question_priorities table + RLS
-- 2. exam_data + exam_question_ids columns on mock_exams
-- 3. Replace launch_exam() with DB-backed weighted sampling
-- 4. Replace 5-arg complete_exam with 6-arg version + p_priority_updates
-- ─────────────────────────────────────────────────────────────────────────────


-- ── 1. user_question_priorities ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_question_priorities (
  user_id              UUID      NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id          UUID      NOT NULL,
  part                 SMALLINT  NOT NULL CHECK (part BETWEEN 1 AND 7),
  priority             SMALLINT  NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 3),
  last_seen_exam_count INTEGER,
  updated_at           TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, question_id)
);

ALTER TABLE public.user_question_priorities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own priorities"
  ON public.user_question_priorities
  FOR SELECT
  USING (auth.uid() = user_id);
-- Writes happen only via SECURITY DEFINER RPCs (complete_exam)


-- ── 2. New columns on mock_exams ─────────────────────────────────────────────

ALTER TABLE public.mock_exams
  ADD COLUMN IF NOT EXISTS exam_data         JSONB,
  ADD COLUMN IF NOT EXISTS exam_question_ids JSONB;
-- exam_data: full question content (including correct answers), ~100KB per row
-- exam_question_ids: {"p1":[uuid,...],...,"p7_question_counts":[2,3,...]}


-- ── 3. Replace launch_exam() with DB-backed weighted sampling ─────────────────

CREATE OR REPLACE FUNCTION public.launch_exam()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_rows integer;
  v_exam_id    uuid;
  caller_role  text;
  v_exam_count integer;
  v_exam_data  jsonb;
  v_exam_ids   jsonb;
BEGIN
  -- ── Role check + credit deduction ─────────────────────────────────────────
  SELECT COALESCE(role, 'user')
  INTO   caller_role
  FROM   public.profiles
  WHERE  id = auth.uid();

  IF caller_role <> 'admin' THEN
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

  -- ── Count completed exams for freshness scoring ────────────────────────────
  SELECT COUNT(*)::integer
  INTO   v_exam_count
  FROM   public.mock_exams
  WHERE  user_id = auth.uid()
  AND    status  = 'completed';

  -- ── Weighted sample from all 7 part tables + build JSONB ──────────────────
  --
  -- Exponential reservation sampling: ORDER BY -LN(RANDOM()) / weight
  -- Higher weight (priority) → smaller expected value → appears first in ASC
  -- Weight = LEAST(3, base_priority + freshness_bump)
  -- freshness_bump = 1 if not seen in last 2 exams, else 0
  --
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

  -- ── Insert exam row with embedded data ────────────────────────────────────
  INSERT INTO public.mock_exams (user_id, status, exam_data, exam_question_ids)
  VALUES (auth.uid(), 'in_progress', v_exam_data, v_exam_ids)
  RETURNING id INTO v_exam_id;

  RETURN v_exam_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.launch_exam() TO authenticated;


-- ── 4. Replace 5-arg complete_exam with 6-arg version ────────────────────────

DROP FUNCTION IF EXISTS public.complete_exam(uuid, integer, integer, integer, jsonb);

CREATE FUNCTION public.complete_exam(
  exam_id             uuid,
  p_listening_score   integer  DEFAULT NULL,
  p_reading_score     integer  DEFAULT NULL,
  p_score             integer  DEFAULT NULL,
  p_answers           jsonb    DEFAULT NULL,
  p_priority_updates  jsonb    DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_count integer;
  v_eqi       jsonb;
BEGIN
  UPDATE public.mock_exams
  SET    status          = 'completed',
         completed_at    = now(),
         listening_score = COALESCE(p_listening_score, listening_score),
         reading_score   = COALESCE(p_reading_score,   reading_score),
         score           = COALESCE(p_score,            score),
         answers         = COALESCE(p_answers,          answers)
  WHERE  id      = exam_id
  AND    user_id = auth.uid()
  AND    status  = 'in_progress';

  -- ── Upsert priority updates when provided ─────────────────────────────────
  IF p_priority_updates IS NOT NULL THEN
    -- Count includes the exam we just completed
    SELECT COUNT(*)::integer
    INTO   v_new_count
    FROM   public.mock_exams
    WHERE  user_id = auth.uid()
    AND    status  = 'completed';

    -- Read exam_question_ids to determine part for each question
    SELECT exam_question_ids
    INTO   v_eqi
    FROM   public.mock_exams
    WHERE  id = exam_id;

    INSERT INTO public.user_question_priorities
      (user_id, question_id, part, priority, last_seen_exam_count, updated_at)
    SELECT
      auth.uid(),
      (upd.key)::uuid,
      CASE
        WHEN v_eqi->'p1' @> to_jsonb(upd.key) THEN 1
        WHEN v_eqi->'p2' @> to_jsonb(upd.key) THEN 2
        WHEN v_eqi->'p3' @> to_jsonb(upd.key) THEN 3
        WHEN v_eqi->'p4' @> to_jsonb(upd.key) THEN 4
        WHEN v_eqi->'p5' @> to_jsonb(upd.key) THEN 5
        WHEN v_eqi->'p6' @> to_jsonb(upd.key) THEN 6
        ELSE 7
      END::smallint,
      CASE upd.value
        WHEN 'correct'  THEN 1
        WHEN 'partial'  THEN 2
        ELSE                 3  -- incorrect
      END::smallint,
      v_new_count,
      now()
    FROM jsonb_each_text(p_priority_updates) upd
    ON CONFLICT (user_id, question_id) DO UPDATE
      SET priority             = EXCLUDED.priority,
          last_seen_exam_count = EXCLUDED.last_seen_exam_count,
          updated_at           = EXCLUDED.updated_at;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.complete_exam(uuid, integer, integer, integer, jsonb, jsonb)
  TO authenticated;
