ALTER TABLE public.mock_exams
  DROP CONSTRAINT mock_exams_status_check,
  ADD CONSTRAINT mock_exams_status_check
    CHECK (status IN ('pending', 'in_progress', 'abandoned', 'completed'));
