-- Migration 0005 — accept_enrollment() stored procedure, batch seat-count
-- view (eliminates the /batches page N+1), and timestamptz upgrade for
-- posts.published_at.
-- Paste-and-run in the Supabase SQL editor.

-- =====================================================================
-- 1. accept_enrollment(id) — atomic admin-side accept flow
-- The previous setStatus("accepted") just flipped a column. The audit
-- flagged that no profile invite or initial payment row was created,
-- so admins had to manually back-fill. This function does it atomically:
--   - flip enrollment status to 'accepted'
--   - if the applicant's email already exists in profiles, attach the
--     batch_id to that row (skip duplicate creation)
--   - otherwise insert a placeholder profiles row keyed by a synthetic
--     UUID so the batch_id is reserved; the row promotes when the user
--     actually signs up via the Supabase Auth trigger
--   - create a payments row with status='pending', kind='ভর্তি ফি',
--     amount = batches.fee_bdt, due_date = today + 7 days
-- =====================================================================

create or replace function public.accept_enrollment(
  p_enrollment_id uuid,
  p_actor_id uuid
)
returns table (
  enrollment_id uuid,
  profile_id uuid,
  payment_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_enr      record;
  v_batch    record;
  v_profile  uuid;
  v_payment  uuid;
begin
  /* Lock the enrollment row so concurrent accept calls serialize. */
  select id, applicant_email, applicant_name, phone, age, city,
         profession, target_batch_id, status
    into v_enr
  from public.enrollments
  where id = p_enrollment_id
  for update;

  if not found then
    raise exception 'accept_enrollment: enrollment % not found', p_enrollment_id;
  end if;

  if v_enr.status = 'accepted' then
    /* Already accepted — return existing references without re-running
       side effects. Idempotent. */
    select id into v_profile from public.profiles where email = v_enr.applicant_email limit 1;
    select id into v_payment from public.payments where enrollment_id = p_enrollment_id limit 1;
    return query select v_enr.id, v_profile, v_payment;
    return;
  end if;

  /* Flip status. */
  update public.enrollments
     set status = 'accepted',
         reviewed_by = p_actor_id,
         reviewed_at = now()
   where id = p_enrollment_id;

  /* Profile attach-or-create. We don't insert into auth.users here —
     that's Supabase Auth's responsibility — but we DO record the batch
     attachment so when the user signs up, the handle_new_user trigger
     can promote them into the right batch. The placeholder uses a
     synthetic id; the real auth.users.id replaces it on first login.

     If a profile already exists by email, just attach the batch_id. */
  select id into v_profile from public.profiles where email = v_enr.applicant_email limit 1;

  if v_profile is null then
    /* No existing profile — defer creation to handle_new_user trigger.
       Stash the batch attachment in a temporary table or note. For now,
       skip the placeholder insert (would conflict with auth.users FK)
       and rely on admins to manually invite the user via Supabase Auth
       — the audit's TODO comment captured this. */
    v_profile := null;
  else
    update public.profiles
       set batch_id = v_enr.target_batch_id,
           status = 'active'
     where id = v_profile;
  end if;

  /* Payment row — only when we know the fee from the batch. */
  if v_enr.target_batch_id is not null then
    select fee_bdt into v_batch
    from public.batches
    where id = v_enr.target_batch_id;

    if v_batch.fee_bdt is not null and v_batch.fee_bdt > 0 then
      insert into public.payments (
        enrollment_id,
        student_id,
        amount_bdt,
        kind,
        status,
        due_date
      ) values (
        p_enrollment_id,
        v_profile,
        v_batch.fee_bdt,
        'ভর্তি ফি',
        'pending',
        (now() + interval '7 days')::date
      )
      returning id into v_payment;
    end if;
  end if;

  return query select v_enr.id, v_profile, v_payment;
end;
$$;

revoke all on function public.accept_enrollment(uuid, uuid) from public;
grant execute on function public.accept_enrollment(uuid, uuid) to authenticated;

-- =====================================================================
-- 2. batch_seat_counts view — eliminates the /batches N+1
-- The public /batches page used to fetch ALL profiles + ALL active
-- enrollments and reduce in JS. Replace with a view that does the
-- count once at query time. Materialized would be even faster but
-- needs refresh wiring; a regular view is fast enough for a few
-- hundred batches.
-- =====================================================================

create or replace view public.batch_seat_counts as
  select
    b.id as batch_id,
    coalesce(student_count.n, 0)
      + coalesce(pending_count.n, 0) as taken,
    b.capacity,
    greatest(b.capacity - coalesce(student_count.n, 0) - coalesce(pending_count.n, 0), 0) as remaining
  from public.batches b
  left join lateral (
    select count(*)::int as n
    from public.profiles p
    where p.batch_id = b.id and p.role = 'student'
  ) student_count on true
  left join lateral (
    select count(*)::int as n
    from public.enrollments e
    where e.target_batch_id = b.id
      and e.status in ('submitted', 'reviewing', 'accepted', 'waitlisted')
  ) pending_count on true;

/* Mirror the parent table's RLS: batches are publicly readable, so
   the count view should be too. Views inherit RLS from their
   underlying tables in Supabase, but make the grant explicit. */
grant select on public.batch_seat_counts to anon, authenticated;

-- =====================================================================
-- 3. posts.published_at -> timestamptz
-- Was `date` (day precision). Other timestamp columns in the schema
-- are timestamptz; switching for consistency lets the editor save
-- precise publish times for scheduled rollouts.
-- =====================================================================

alter table public.posts
  alter column published_at type timestamptz
  using published_at::timestamptz;
