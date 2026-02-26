create table public.mock_exams (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references auth.users on delete cascade not null,
  created_at       timestamp with time zone default now() not null,
  completed_at     timestamp with time zone,
  status           text not null default 'pending'
                     check (status in ('pending', 'in_progress', 'completed')),
  score            integer check (score >= 0 and score <= 990),
  listening_score  integer check (listening_score >= 0 and listening_score <= 495),
  reading_score    integer check (reading_score >= 0 and reading_score <= 495)
);

create index mock_exams_user_id_idx on public.mock_exams (user_id);

alter table public.mock_exams enable row level security;

create policy "Users can view their own mock exams"
  on mock_exams for select
  using (auth.uid() = user_id);

create policy "Users can insert their own mock exams"
  on mock_exams for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own mock exams"
  on mock_exams for update
  using (auth.uid() = user_id);
