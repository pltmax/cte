-- Upgrade diagnostic_config p6 from a single passage to an array of 2 passages.
UPDATE public.diagnostic_config
SET questions = jsonb_set(
  questions, '{p6}',
  (SELECT jsonb_agg(to_jsonb(t))
   FROM (SELECT id::text, doctype, title, text, questions
         FROM toeic_reading_part6
         WHERE is_exam = false
         ORDER BY position
         LIMIT 2 OFFSET 2) t)
)
WHERE id = 1;
