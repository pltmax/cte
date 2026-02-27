-- ─────────────────────────────────────────────────────────────────────────────
-- TOEIC Listening Parts 1–4
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Part 1 — Photographs (24 questions) ─────────────────────────────────────

create table public.toeic_listening_part1 (
  id         uuid        primary key default gen_random_uuid(),
  position   int         not null,
  image      text,
  statements jsonb       not null,  -- ["(A)…", "(B)…", "(C)…", "(D)…"]
  answer     text        not null,  -- A | B | C | D
  image_url  text,                  -- GCS public URL
  audio_urls jsonb,                 -- {"A": "url", "B": "url", "C": "url", "D": "url"}
  is_exam    boolean     not null default true,
  created_at timestamptz default now()
);

alter table public.toeic_listening_part1 enable row level security;

create policy "authenticated users can read toeic_listening_part1"
  on public.toeic_listening_part1
  for select
  using (auth.role() = 'authenticated');


-- ── Part 2 — Question-Response (125 questions) ──────────────────────────────

create table public.toeic_listening_part2 (
  id                  uuid        primary key default gen_random_uuid(),
  position            int         not null,
  category            text,                  -- e.g. "requests_suggestions"
  question            text        not null,  -- the spoken question text
  options             jsonb       not null,  -- ["(A)…", "(B)…", "(C)…"]
  answer              text        not null,  -- A | B | C
  question_audio_url  text,                  -- GCS URL
  option_audio_urls   jsonb,                 -- {"A": "url", "B": "url", "C": "url"}
  is_exam             boolean     not null default true,
  created_at          timestamptz default now()
);

alter table public.toeic_listening_part2 enable row level security;

create policy "authenticated users can read toeic_listening_part2"
  on public.toeic_listening_part2
  for select
  using (auth.role() = 'authenticated');


-- ── Part 3 — Conversations (52 rows) ────────────────────────────────────────

create table public.toeic_listening_part3 (
  id         uuid        primary key default gen_random_uuid(),
  position   int         not null,
  dialogue   jsonb       not null,  -- [{"speaker": "M"/"F", "text": "…"}, …]
  questions  jsonb       not null,  -- [{"text": "…", "options": […], "answer": "B"}, …]
  audio_url  text,                  -- GCS URL
  is_exam    boolean     not null default true,
  created_at timestamptz default now()
);

alter table public.toeic_listening_part3 enable row level security;

create policy "authenticated users can read toeic_listening_part3"
  on public.toeic_listening_part3
  for select
  using (auth.role() = 'authenticated');


-- ── Part 4 — Talks (40 rows) ─────────────────────────────────────────────────

create table public.toeic_listening_part4 (
  id               uuid        primary key default gen_random_uuid(),
  position         int         not null,
  title            text,
  text             text        not null,  -- spoken monologue transcript
  questions        jsonb       not null,  -- [{"text": "…", "options": […], "answer": "B"}, …]
  audio_url        text,                  -- GCS URL
  graphic_title    text,                  -- nullable
  graphic_doctype  text,                  -- nullable (e.g. "directory", "weather_chart")
  graphic          jsonb,                 -- nullable key-value graphic data
  is_exam          boolean     not null default true,
  created_at       timestamptz default now()
);

alter table public.toeic_listening_part4 enable row level security;

create policy "authenticated users can read toeic_listening_part4"
  on public.toeic_listening_part4
  for select
  using (auth.role() = 'authenticated');
