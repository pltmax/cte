-- Add dataset_id (1-4) to mock_exams so each exam row knows which
-- pre-built question set to load. Default 1 keeps existing rows valid.
alter table public.mock_exams
  add column if not exists dataset_id smallint not null default 1
    check (dataset_id between 1 and 4);
