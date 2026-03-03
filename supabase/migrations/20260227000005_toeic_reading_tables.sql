-- ─────────────────────────────────────────────────────────────────────────────
-- TOEIC Reading Parts 5–7
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Part 5 — Incomplete Sentences (120 questions) ────────────────────────────

create table public.toeic_reading_part5 (
  id         uuid        primary key default gen_random_uuid(),
  position   int         not null,
  text       text        not null,  -- sentence containing ______
  options    jsonb       not null,  -- ["(A)…", "(B)…", "(C)…", "(D)…"]
  answer     text        not null,  -- A | B | C | D
  is_exam    boolean     not null default true,
  created_at timestamptz default now()
);

alter table public.toeic_reading_part5 enable row level security;

create policy "authenticated users can read toeic_reading_part5"
  on public.toeic_reading_part5
  for select
  using (auth.role() = 'authenticated');


-- ── Part 6 — Text Completion (16 passages × 4 questions) ─────────────────────

create table public.toeic_reading_part6 (
  id         uuid        primary key default gen_random_uuid(),
  position   int         not null,
  doctype    text,                  -- e.g. "memo", "email", "letter"
  text       text        not null,  -- passage with ______ blanks
  questions  jsonb       not null,  -- [{"options": […], "answer": "A"}, …]  (4 per passage)
  is_exam    boolean     not null default true,
  created_at timestamptz default now()
);

alter table public.toeic_reading_part6 enable row level security;

create policy "authenticated users can read toeic_reading_part6"
  on public.toeic_reading_part6
  for select
  using (auth.role() = 'authenticated');


-- ── Part 7 — Reading Comprehension (57 passages, 1–3 documents each) ─────────

create table public.toeic_reading_part7 (
  id         uuid        primary key default gen_random_uuid(),
  position   int         not null,
  documents  jsonb       not null,  -- [{"doctype": "…", "text": "…"}, …]  (1, 2 or 3 docs)
  questions  jsonb       not null,  -- [{"text": "…", "options": […], "answer": "A"}, …]
  is_exam    boolean     not null default true,
  created_at timestamptz default now()
);

alter table public.toeic_reading_part7 enable row level security;

create policy "authenticated users can read toeic_reading_part7"
  on public.toeic_reading_part7
  for select
  using (auth.role() = 'authenticated');
