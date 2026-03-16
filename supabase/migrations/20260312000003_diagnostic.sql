-- diagnostic: fixed 16-question diagnostic test (once-only, all authenticated users)

-- ─── diagnostic_config ───────────────────────────────────────────────────────
-- Single-row table seeded at migration time from exercise rows.
CREATE TABLE public.diagnostic_config (
  id        int PRIMARY KEY DEFAULT 1,
  questions jsonb NOT NULL
);

ALTER TABLE public.diagnostic_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "any authenticated user can read diagnostic config"
  ON public.diagnostic_config
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ─── Seed the single row ─────────────────────────────────────────────────────
-- P1: last 2 'scene_vide' exercises by position
-- P2: last 2 'choice_or_questions' exercises by position
-- P3: 3rd exercise row (all 3 questions stored; frontend slices -2)
-- P4: 3rd exercise row (all 3 questions stored; frontend slices -2)
-- P5: last 2 'verb_tense' exercises by position
-- P6: 3rd exercise row (all 4 questions stored; frontend slices -2)
-- P7: 3rd+4th single-doc exercise rows (all questions stored; frontend slices -2 each)

INSERT INTO public.diagnostic_config (id, questions)
SELECT 1, jsonb_build_object(
  'p1', (
    SELECT jsonb_agg(q ORDER BY (q->>'position')::int)
    FROM (
      SELECT to_jsonb(t) AS q
      FROM (
        SELECT id::text, image_url, audio_urls, statements, answer, position
        FROM toeic_listening_part1
        WHERE is_exam = false AND category = 'scene_vide'
        ORDER BY position DESC
        LIMIT 2
      ) t
    ) sub
  ),
  'p2', (
    SELECT jsonb_agg(q ORDER BY (q->>'position')::int)
    FROM (
      SELECT to_jsonb(t) AS q
      FROM (
        SELECT id::text, question, options, answer, question_audio_url, option_audio_urls, position
        FROM toeic_listening_part2
        WHERE is_exam = false AND category = 'choice_or_questions'
        ORDER BY position DESC
        LIMIT 2
      ) t
    ) sub
  ),
  'p3', (
    SELECT to_jsonb(t)
    FROM (
      SELECT id::text, audio_url, questions
      FROM toeic_listening_part3
      WHERE is_exam = false
      ORDER BY position
      LIMIT 1 OFFSET 2
    ) t
  ),
  'p4', (
    SELECT to_jsonb(t)
    FROM (
      SELECT id::text, title, audio_url, graphic_title, graphic_doctype, graphic, questions
      FROM toeic_listening_part4
      WHERE is_exam = false
      ORDER BY position
      LIMIT 1 OFFSET 2
    ) t
  ),
  'p5', (
    SELECT jsonb_agg(q ORDER BY (q->>'position')::int)
    FROM (
      SELECT to_jsonb(t) AS q
      FROM (
        SELECT id::text, text, options, answer, position
        FROM toeic_reading_part5
        WHERE is_exam = false AND category = 'verb_tense'
        ORDER BY position DESC
        LIMIT 2
      ) t
    ) sub
  ),
  'p6', (
    SELECT to_jsonb(t)
    FROM (
      SELECT id::text, doctype, title, text, questions
      FROM toeic_reading_part6
      WHERE is_exam = false
      ORDER BY position
      LIMIT 1 OFFSET 2
    ) t
  ),
  'p7', (
    SELECT jsonb_agg(to_jsonb(t))
    FROM (
      SELECT id::text, documents, questions
      FROM toeic_reading_part7
      WHERE is_exam = false AND doc_count = 1
      ORDER BY position
      LIMIT 2 OFFSET 2
    ) t
  )
);

-- ─── diagnostic_results ──────────────────────────────────────────────────────
-- One row per user; PRIMARY KEY enforces once-only semantics.
CREATE TABLE public.diagnostic_results (
  user_id      uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  score        int NOT NULL CHECK (score BETWEEN 0 AND 100),
  answers      jsonb NOT NULL DEFAULT '{}'
);

ALTER TABLE public.diagnostic_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users own diagnostic result"
  ON public.diagnostic_results
  FOR ALL
  USING (user_id = auth.uid());

-- ─── save_diagnostic RPC ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.save_diagnostic(p_score int, p_answers jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.diagnostic_results (user_id, score, answers)
  VALUES (auth.uid(), p_score, p_answers)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

GRANT EXECUTE ON FUNCTION public.save_diagnostic(int, jsonb) TO authenticated;
