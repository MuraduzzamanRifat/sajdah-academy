-- Migration 0004 — security hardening, audit-log policy, storage RLS,
-- privileged-column lock on profiles, enrollment-capacity transaction,
-- and missing indexes flagged in the system audit.
-- Paste-and-run in the Supabase SQL editor.

-- =====================================================================
-- 1. AUDIT LOG INSERT POLICY
-- Audit writes were silently failing because RLS was on but no INSERT
-- policy existed. Allow any authenticated session to insert their own
-- actor_id; allow service-role inserts unconditionally (used by
-- lib/audit.ts which now goes through the service client).
-- =====================================================================

drop policy if exists "audit_log_insert_self" on public.audit_log;
create policy "audit_log_insert_self"
  on public.audit_log
  for insert
  to authenticated, anon
  with check (
    actor_id is null
    or actor_id = auth.uid()
  );

-- =====================================================================
-- 2. STORAGE BUCKETS + POLICIES
-- The audit caught that buckets are created out-of-band with no RLS,
-- which lets ANY authenticated user upload arbitrary files (XSS via
-- SVG, etc). This codifies the buckets and locks writes to admins.
-- =====================================================================

insert into storage.buckets (id, name, public)
values
  ('blog-images', 'blog-images', true),
  ('site-images', 'site-images', true)
on conflict (id) do update set public = true;

-- Drop any prior permissive policies before recreating them strict.
drop policy if exists "Public read blog-images" on storage.objects;
drop policy if exists "Admin upload blog-images" on storage.objects;
drop policy if exists "Admin update blog-images" on storage.objects;
drop policy if exists "Admin delete blog-images" on storage.objects;
drop policy if exists "Public read site-images" on storage.objects;
drop policy if exists "Admin upload site-images" on storage.objects;
drop policy if exists "Admin update site-images" on storage.objects;
drop policy if exists "Admin delete site-images" on storage.objects;

-- Public read for both buckets (these are the customer-facing assets).
create policy "Public read blog-images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "Public read site-images"
  on storage.objects for select
  using (bucket_id = 'site-images');

-- Admin/instructor write only. Mirror the role allow-list used in
-- public.is_admin() so a single source of truth governs both DB and
-- storage authorization.
create policy "Admin upload blog-images"
  on storage.objects for insert
  with check (
    bucket_id = 'blog-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('super_admin', 'academic_admin', 'finance', 'instructor')
    )
  );

create policy "Admin update blog-images"
  on storage.objects for update
  using (
    bucket_id = 'blog-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('super_admin', 'academic_admin', 'finance', 'instructor')
    )
  );

create policy "Admin delete blog-images"
  on storage.objects for delete
  using (
    bucket_id = 'blog-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('super_admin', 'academic_admin', 'finance', 'instructor')
    )
  );

create policy "Admin upload site-images"
  on storage.objects for insert
  with check (
    bucket_id = 'site-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('super_admin', 'academic_admin', 'finance', 'instructor')
    )
  );

create policy "Admin update site-images"
  on storage.objects for update
  using (
    bucket_id = 'site-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('super_admin', 'academic_admin', 'finance', 'instructor')
    )
  );

create policy "Admin delete site-images"
  on storage.objects for delete
  using (
    bucket_id = 'site-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('super_admin', 'academic_admin', 'finance', 'instructor')
    )
  );

-- =====================================================================
-- 3. PROFILES — LOCK PRIVILEGED COLUMNS
-- The original profiles_self_update policy let students change their
-- own status, batch_id, student_id, joined_at — granting paid-batch
-- access without payment. Add a row-level trigger that raises if a
-- non-admin tries to flip any privileged column.
-- =====================================================================

create or replace function public.profiles_lock_privileged()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_actor_admin boolean;
begin
  -- Service-role bypass: superuser context (e.g. trigger from auth)
  -- has no auth.uid() — let it through.
  if auth.uid() is null then
    return new;
  end if;

  -- Always allow when the row is not changing privileged columns.
  if  new.role        is not distinct from old.role
  and new.status      is not distinct from old.status
  and new.batch_id    is not distinct from old.batch_id
  and new.student_id  is not distinct from old.student_id
  and new.joined_at   is not distinct from old.joined_at
  then
    return new;
  end if;

  -- Privileged column changed — actor must be admin.
  select role in ('super_admin', 'academic_admin', 'finance')
    into is_actor_admin
  from public.profiles
  where id = auth.uid();

  if coalesce(is_actor_admin, false) then
    return new;
  end if;

  raise exception 'profiles: only admin can change role/status/batch_id/student_id/joined_at';
end;
$$;

drop trigger if exists profiles_lock_privileged_trg on public.profiles;
create trigger profiles_lock_privileged_trg
  before update on public.profiles
  for each row
  execute function public.profiles_lock_privileged();

-- =====================================================================
-- 4. MESSAGES — DROP NULL ACTOR LOOPHOLE
-- The original messages_send policy permitted from_user_id IS NULL
-- which lets anyone (incl. anon) inject phishing into the platform.
-- Replace with a signed-in-only policy.
-- =====================================================================

drop policy if exists "messages_send" on public.messages;
create policy "messages_send"
  on public.messages
  for insert
  to authenticated
  with check (
    from_user_id = auth.uid()
    or public.is_admin()
  );

-- =====================================================================
-- 5. ENROLLMENT CAPACITY — TRANSACTIONAL CHECK
-- Prevent over-enrollment under concurrent submissions. Replaces the
-- TOCTOU pattern in app/(marketing)/enroll/actions.ts with a single
-- atomic call that:
--   - takes a row-lock on the batch
--   - re-counts current accepted+submitted enrollments
--   - rejects if at or above capacity
--   - inserts otherwise
-- The Server Action calls this RPC instead of a bare INSERT.
-- =====================================================================

create or replace function public.enroll_applicant(
  p_batch_id        uuid,
  p_applicant_name  text,
  p_applicant_email text,
  p_phone           text,
  p_age             int,
  p_city            text,
  p_profession      text,
  p_motivation      text,
  p_referral        text,
  p_notes           text
)
returns table (id uuid, status enrollment_status)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_capacity int;
  v_taken    int;
  v_closes   timestamptz;
  v_id       uuid;
begin
  /* If a batch isn't supplied, accept the application without a seat
     reservation. The capacity check applies only when a batch is set. */
  if p_batch_id is not null then
    /* Row-lock the batch so two concurrent enroll calls serialize. */
    select capacity, enrollment_closes_at
      into v_capacity, v_closes
    from public.batches
    where id = p_batch_id
    for update;

    if not found then
      raise exception 'enroll_applicant: batch not found';
    end if;

    if v_closes is not null and v_closes < now() then
      raise exception 'enroll_applicant: enrollment window closed';
    end if;

    /* Count enrollments that hold a seat (submitted/reviewing/accepted/
       waitlisted — only "rejected" frees a seat). */
    select count(*)::int
      into v_taken
    from public.enrollments
    where target_batch_id = p_batch_id
      and status in ('submitted', 'reviewing', 'accepted', 'waitlisted');

    if v_taken >= v_capacity then
      raise exception 'enroll_applicant: batch full';
    end if;
  end if;

  insert into public.enrollments (
    target_batch_id,
    applicant_name,
    applicant_email,
    phone,
    age,
    city,
    profession,
    motivation,
    referral_source,
    notes,
    status
  ) values (
    p_batch_id,
    p_applicant_name,
    p_applicant_email,
    p_phone,
    p_age,
    p_city,
    p_profession,
    p_motivation,
    p_referral,
    p_notes,
    'submitted'
  )
  returning enrollments.id into v_id;

  return query select v_id, 'submitted'::enrollment_status;
end;
$$;

revoke all on function public.enroll_applicant(
  uuid, text, text, text, int, text, text, text, text, text
) from public;

grant execute on function public.enroll_applicant(
  uuid, text, text, text, int, text, text, text, text, text
) to anon, authenticated;

-- =====================================================================
-- 6. MISSING INDEXES (rate-limit + lookup hotpaths)
-- =====================================================================

create index if not exists enrollments_email_created_idx
  on public.enrollments (applicant_email, created_at desc);

create index if not exists enrollments_phone_created_idx
  on public.enrollments (phone, created_at desc);

create index if not exists enrollments_batch_idx
  on public.enrollments (target_batch_id);

create index if not exists batches_status_idx
  on public.batches (status);

create index if not exists payments_enrollment_idx
  on public.payments (enrollment_id);

create index if not exists site_settings_key_prefix_idx
  on public.site_settings (key text_pattern_ops);

-- =====================================================================
-- 7. ENROLLMENTS — DELETE POLICY
-- Admins need to be able to delete spam/test enrollments.
-- =====================================================================

drop policy if exists "enrollments_admin_delete" on public.enrollments;
create policy "enrollments_admin_delete"
  on public.enrollments
  for delete
  to authenticated
  using (public.is_admin());
