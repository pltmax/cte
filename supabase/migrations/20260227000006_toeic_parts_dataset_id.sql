-- Add dataset_id (1–4) to all 7 TOEIC part tables so that exam-specific
-- question subsets can be fetched directly from Supabase.
-- NULL = not assigned to any exam dataset (future standalone exercises).

alter table public.toeic_listening_part1
  add column if not exists dataset_id smallint check (dataset_id between 1 and 4);

alter table public.toeic_listening_part2
  add column if not exists dataset_id smallint check (dataset_id between 1 and 4);

alter table public.toeic_listening_part3
  add column if not exists dataset_id smallint check (dataset_id between 1 and 4);

alter table public.toeic_listening_part4
  add column if not exists dataset_id smallint check (dataset_id between 1 and 4);

alter table public.toeic_reading_part5
  add column if not exists dataset_id smallint check (dataset_id between 1 and 4);

alter table public.toeic_reading_part6
  add column if not exists dataset_id smallint check (dataset_id between 1 and 4);

alter table public.toeic_reading_part7
  add column if not exists dataset_id smallint check (dataset_id between 1 and 4);

-- Indexes for the exam page's per-dataset queries
create index if not exists toeic_listening_part1_dataset_id_idx on public.toeic_listening_part1 (dataset_id);
create index if not exists toeic_listening_part2_dataset_id_idx on public.toeic_listening_part2 (dataset_id);
create index if not exists toeic_listening_part3_dataset_id_idx on public.toeic_listening_part3 (dataset_id);
create index if not exists toeic_listening_part4_dataset_id_idx on public.toeic_listening_part4 (dataset_id);
create index if not exists toeic_reading_part5_dataset_id_idx   on public.toeic_reading_part5   (dataset_id);
create index if not exists toeic_reading_part6_dataset_id_idx   on public.toeic_reading_part6   (dataset_id);
create index if not exists toeic_reading_part7_dataset_id_idx   on public.toeic_reading_part7   (dataset_id);
