-- exercises_to_supabase: Add exercise-specific columns to TOEIC question tables
-- Exercise rows are identified by is_exam = false.

-- Part 1: category (une_personne / plusieurs_personnes / scene_vide) + per-question explanation
ALTER TABLE toeic_listening_part1
  ADD COLUMN IF NOT EXISTS category    text,
  ADD COLUMN IF NOT EXISTS explanation jsonb;

-- Part 2: per-question explanation (category column already exists)
ALTER TABLE toeic_listening_part2
  ADD COLUMN IF NOT EXISTS explanation jsonb;

-- Part 3: conversation type label (e.g. "Business strategy — …")
ALTER TABLE toeic_listening_part3
  ADD COLUMN IF NOT EXISTS conv_type text;

-- Part 5: category (word_form / vocabulary / …) + per-question explanation
ALTER TABLE toeic_reading_part5
  ADD COLUMN IF NOT EXISTS category    text,
  ADD COLUMN IF NOT EXISTS explanation jsonb;

-- Part 6: passage title (exam data stores title in the text body; exercises need it separate)
ALTER TABLE toeic_reading_part6
  ADD COLUMN IF NOT EXISTS title text;

-- Part 7: doc_count distinguishes single-document (=1) from multi-document (>1) passages
ALTER TABLE toeic_reading_part7
  ADD COLUMN IF NOT EXISTS doc_count integer;
