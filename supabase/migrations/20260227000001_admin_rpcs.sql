-- ─────────────────────────────────────────────────────────────────────────────
-- launch_exam()
--
-- Called by an authenticated user from the browser.
-- Atomically deducts 1 credit and inserts a new mock_exam row.
-- Returns the new exam UUID; raises an exception if no credits are available.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.launch_exam()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_rows integer;
  exam_id      uuid;
begin
  -- Deduct 1 credit only if available (atomic: WHERE prevents negative credits)
  update public.profiles
  set    credit_number = credit_number - 1
  where  id = auth.uid()
  and    credit_number > 0;

  get diagnostics updated_rows = row_count;

  if updated_rows = 0 then
    raise exception 'insufficient_credits'
      using hint = 'The user has no credits available';
  end if;

  -- Create the exam record
  insert into public.mock_exams (user_id, status)
  values (auth.uid(), 'in_progress')
  returning id into exam_id;

  return exam_id;
end;
$$;

grant execute on function public.launch_exam() to authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- increment_credits(target_user_id uuid, amount integer)
--
-- Called exclusively by the FastAPI backend with the service role.
-- NOT granted to anon or authenticated — backend authorization handles access.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.increment_credits(
  target_user_id uuid,
  amount         integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if amount <= 0 then
    raise exception 'amount must be a positive integer';
  end if;

  if not exists (select 1 from public.profiles where id = target_user_id) then
    raise exception 'user_not_found'
      using hint = 'No profile found for the given user_id';
  end if;

  update public.profiles
  set    credit_number = credit_number + amount
  where  id = target_user_id;
end;
$$;

-- Deliberately NOT granted to anon/authenticated — service role only.
