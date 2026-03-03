-- ─────────────────────────────────────────────────────────────────────────────
-- launch_exam() — updated to allow admin users to bypass credit check.
--
-- Regular users: must have ≥ 1 credit; 1 credit is deducted on launch.
-- Admin users:   no credit check or deduction.
-- Returns the new exam UUID in both cases.
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
  caller_role  text;
begin
  -- Fetch the caller's role (null-safe: defaults to 'user' if profile missing)
  select coalesce(role, 'user')
  into   caller_role
  from   public.profiles
  where  id = auth.uid();

  if caller_role <> 'admin' then
    -- Deduct 1 credit atomically; WHERE prevents going negative
    update public.profiles
    set    credit_number = credit_number - 1
    where  id = auth.uid()
    and    credit_number > 0;

    get diagnostics updated_rows = row_count;

    if updated_rows = 0 then
      raise exception 'insufficient_credits'
        using hint = 'The user has no credits available';
    end if;
  end if;

  -- Create the exam record
  insert into public.mock_exams (user_id, status)
  values (auth.uid(), 'in_progress')
  returning id into exam_id;

  return exam_id;
end;
$$;

grant execute on function public.launch_exam() to authenticated;
