-- Sajdah Academy — initial schema
-- Run this once in Supabase SQL Editor (Dashboard → SQL → New query → paste → Run)
-- Idempotent: safe to re-run; uses IF NOT EXISTS / OR REPLACE.

-- ============================================================
-- 1. Extensions
-- ============================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- 2. Enums
-- ============================================================
do $$ begin
  create type user_role as enum ('super_admin', 'academic_admin', 'finance', 'instructor', 'student');
exception when duplicate_object then null; end $$;

do $$ begin
  create type student_status as enum ('active', 'pending', 'inactive', 'graduated');
exception when duplicate_object then null; end $$;

do $$ begin
  create type batch_status as enum ('open', 'running', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type course_phase as enum ('Foundation', 'Understanding', 'Transformation');
exception when duplicate_object then null; end $$;

do $$ begin
  create type enrollment_status as enum ('submitted', 'reviewing', 'accepted', 'rejected', 'waitlisted');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pending', 'received', 'overdue', 'refunded', 'failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type attendance_state as enum ('present', 'late', 'absent', 'excused');
exception when duplicate_object then null; end $$;

-- ============================================================
-- 3. profiles  (1-to-1 with auth.users)
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique not null,
  full_name text,
  full_name_bn text,
  phone text,
  whatsapp text,
  city text,
  date_of_birth date,
  avatar_url text,
  role user_role not null default 'student',
  student_id text unique,                       -- e.g. SA-2026-0418
  batch_id uuid,                                -- FK added later
  status student_status not null default 'pending',
  joined_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on profiles(role);
create index if not exists profiles_status_idx on profiles(status);
create index if not exists profiles_batch_idx on profiles(batch_id);

-- ============================================================
-- 4. instructors  (extended profile for teachers)
-- ============================================================
create table if not exists instructors (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid unique references profiles(id) on delete cascade,
  name text not null,
  name_bn text,
  role_label text,                              -- "ফিকহ ও আক্বীদা প্রধান"
  bio text,
  rating numeric(3,2),
  is_guest boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 5. courses  (modules — replaces app/data/modules.ts)
-- ============================================================
create table if not exists courses (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  title_bn text,
  phase course_phase not null,
  duration text,                                -- "৪ ক্লাস · ৬ ঘণ্টা"
  summary text,
  learning_outcomes text[] not null default '{}',
  topics text[] not null default '{}',
  module_number int,
  primary_instructor_id uuid references instructors(id) on delete set null,
  is_published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists courses_phase_idx on courses(phase);
create index if not exists courses_published_idx on courses(is_published);

-- ============================================================
-- 6. batches
-- ============================================================
create table if not exists batches (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,                    -- "B5-2026-AUG"
  name text not null,                           -- "ব্যাচ-৫"
  status batch_status not null default 'open',
  starts_at date,
  ends_at date,
  location text,
  capacity int not null default 40,
  fee_bdt numeric(10,2),
  installments int not null default 4,
  enrollment_closes_at date,
  notes text,
  created_at timestamptz not null default now()
);

-- now wire profiles.batch_id FK
do $$ begin
  alter table profiles add constraint profiles_batch_fk
    foreign key (batch_id) references batches(id) on delete set null;
exception when duplicate_object then null; end $$;

-- ============================================================
-- 7. enrollments  (admission applications)
-- ============================================================
create table if not exists enrollments (
  id uuid primary key default uuid_generate_v4(),
  applicant_email text not null,
  applicant_name text not null,
  age int,
  profession text,
  city text,
  phone text,
  motivation text,
  referral_source text,
  target_batch_id uuid references batches(id) on delete set null,
  status enrollment_status not null default 'submitted',
  match_score int,                              -- 0-100 fit score
  payment_received boolean not null default false,
  docs_complete boolean not null default false,
  reviewed_by uuid references profiles(id) on delete set null,
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists enrollments_status_idx on enrollments(status);

-- ============================================================
-- 8. payments
-- ============================================================
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  txn_code text unique not null default ('TXN-' || lpad(nextval('payments_seq')::text, 6, '0')),
  student_id uuid references profiles(id) on delete set null,
  enrollment_id uuid references enrollments(id) on delete set null,
  amount_bdt numeric(10,2) not null,
  method text,                                  -- "bKash", "Nagad", "Bank transfer"
  kind text,                                    -- "১ম কিস্তি", "ভর্তি ফি"
  status payment_status not null default 'pending',
  due_date date,
  paid_at timestamptz,
  reference text,                               -- gateway reference
  created_at timestamptz not null default now()
);

create sequence if not exists payments_seq start 1000;
create index if not exists payments_student_idx on payments(student_id);
create index if not exists payments_status_idx on payments(status);

-- ============================================================
-- 9. assignments
-- ============================================================
create table if not exists assignments (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references courses(id) on delete cascade,
  batch_id uuid references batches(id) on delete cascade,
  title text not null,
  description text,
  kind text,                                    -- "Audio", "Essay", "Online quiz"
  due_at timestamptz,
  total_points int not null default 100,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists submissions (
  id uuid primary key default uuid_generate_v4(),
  assignment_id uuid references assignments(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  submitted_at timestamptz,
  body text,
  attachment_url text,
  score int,
  graded_at timestamptz,
  graded_by uuid references profiles(id) on delete set null,
  feedback text,
  unique (assignment_id, student_id)
);

create index if not exists submissions_student_idx on submissions(student_id);

-- ============================================================
-- 10. grades  (per-course aggregate grade)
-- ============================================================
create table if not exists grades (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references profiles(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  batch_id uuid references batches(id) on delete cascade,
  quiz_scores int[] not null default '{}',
  midterm int,
  final int,
  composite numeric(5,2),
  letter text,                                  -- "A+", "A", ...
  updated_at timestamptz not null default now(),
  unique (student_id, course_id, batch_id)
);

-- ============================================================
-- 11. attendance
-- ============================================================
create table if not exists attendance (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references profiles(id) on delete cascade,
  batch_id uuid references batches(id) on delete cascade,
  course_id uuid references courses(id) on delete set null,
  class_label text,                             -- "Class-3 Hadith"
  date date not null,
  state attendance_state not null default 'absent',
  notes text,
  recorded_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (student_id, date, class_label)
);

create index if not exists attendance_date_idx on attendance(date);

-- ============================================================
-- 12. schedule_events
-- ============================================================
create table if not exists schedule_events (
  id uuid primary key default uuid_generate_v4(),
  batch_id uuid references batches(id) on delete cascade,
  course_id uuid references courses(id) on delete set null,
  instructor_id uuid references instructors(id) on delete set null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  color text not null default 'emerald',        -- emerald, amber, purple, blue, rose
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists schedule_starts_idx on schedule_events(starts_at);

-- ============================================================
-- 13. announcements
-- ============================================================
create table if not exists announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  body text not null,
  audience text not null default 'all',          -- 'all' | 'batch:<id>' | 'role:<role>' | 'public'
  channels text[] not null default '{app}',     -- app, email, whatsapp, sms
  scheduled_for timestamptz,
  published_at timestamptz,
  is_published boolean not null default false,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 14. messages
-- ============================================================
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid not null default uuid_generate_v4(),
  from_user_id uuid references profiles(id) on delete set null,
  from_email text,                               -- for public form submissions
  to_user_id uuid references profiles(id) on delete set null,
  subject text,
  body text not null,
  is_read boolean not null default false,
  is_urgent boolean not null default false,
  parent_id uuid references messages(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists messages_thread_idx on messages(thread_id);
create index if not exists messages_to_idx on messages(to_user_id) where is_read = false;

-- ============================================================
-- 15. resources  (library)
-- ============================================================
create table if not exists resources (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  course_id uuid references courses(id) on delete set null,
  kind text not null,                           -- 'pdf' | 'video' | 'audio' | 'book'
  storage_path text,                            -- in supabase storage bucket
  size_bytes bigint,
  uploaded_by uuid references profiles(id) on delete set null,
  download_count int not null default 0,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 16. certificates
-- ============================================================
create table if not exists certificates (
  id uuid primary key default uuid_generate_v4(),
  cert_no text unique not null,                 -- "SA-CERT-2026-014"
  student_id uuid references profiles(id) on delete cascade,
  phase course_phase not null,
  grade text,
  composite_score numeric(5,2),
  issued_at timestamptz,
  verification_hash text,
  pdf_url text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 17. posts (blog — replaces app/data/posts.ts)
-- ============================================================
create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body text not null,
  category text,
  author text,
  reading_minutes int,
  published_at date,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_idx on posts(is_published, published_at desc);

-- ============================================================
-- 18. site_settings (singleton key-value)
-- ============================================================
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 19. audit_log  (everything admins do)
-- ============================================================
create table if not exists audit_log (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,                         -- 'student.create', 'grade.update', ...
  entity_type text,                             -- 'student', 'course', ...
  entity_id uuid,
  diff jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists audit_actor_idx on audit_log(actor_id, created_at desc);

-- ============================================================
-- 20. Auto-create profile row when a new auth.users row appears
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 21. updated_at autobump
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$ declare t text;
begin
  for t in select unnest(array['profiles','courses','grades','posts']) loop
    execute format('drop trigger if exists set_updated_at on %I', t);
    execute format('create trigger set_updated_at before update on %I for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ============================================================
-- 22. ROW-LEVEL SECURITY  — enable on every table
-- ============================================================
alter table profiles enable row level security;
alter table instructors enable row level security;
alter table courses enable row level security;
alter table batches enable row level security;
alter table enrollments enable row level security;
alter table payments enable row level security;
alter table assignments enable row level security;
alter table submissions enable row level security;
alter table grades enable row level security;
alter table attendance enable row level security;
alter table schedule_events enable row level security;
alter table announcements enable row level security;
alter table messages enable row level security;
alter table resources enable row level security;
alter table certificates enable row level security;
alter table posts enable row level security;
alter table site_settings enable row level security;
alter table audit_log enable row level security;

-- helper: is the current request from an admin?
create or replace function public.is_admin()
returns boolean
language sql security definer set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and role in ('super_admin','academic_admin','finance')
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql security definer set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'super_admin'
  );
$$;

-- ============================================================
-- 23. RLS POLICIES
-- ============================================================

-- profiles: users see own; admins see all; only super_admin can change role
drop policy if exists "profiles_self_read" on profiles;
create policy "profiles_self_read" on profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_self_update" on profiles;
create policy "profiles_self_update" on profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (
    auth.uid() = id and role = (select role from profiles where id = auth.uid())
    or public.is_admin()
  );

drop policy if exists "profiles_admin_insert" on profiles;
create policy "profiles_admin_insert" on profiles for insert
  with check (public.is_admin() or auth.uid() = id);

-- public-readable content (courses, batches, posts, instructors, schedule)
drop policy if exists "courses_public_read" on courses;
create policy "courses_public_read" on courses for select using (is_published or public.is_admin());

drop policy if exists "courses_admin_write" on courses;
create policy "courses_admin_write" on courses for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "batches_public_read" on batches;
create policy "batches_public_read" on batches for select using (true);

drop policy if exists "batches_admin_write" on batches;
create policy "batches_admin_write" on batches for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "instructors_public_read" on instructors;
create policy "instructors_public_read" on instructors for select using (true);

drop policy if exists "instructors_admin_write" on instructors;
create policy "instructors_admin_write" on instructors for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "posts_public_read" on posts;
create policy "posts_public_read" on posts for select using (is_published or public.is_admin());

drop policy if exists "posts_admin_write" on posts;
create policy "posts_admin_write" on posts for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "schedule_read" on schedule_events;
create policy "schedule_read" on schedule_events for select using (true);

drop policy if exists "schedule_admin_write" on schedule_events;
create policy "schedule_admin_write" on schedule_events for all using (public.is_admin()) with check (public.is_admin());

-- enrollments: anyone can submit (public form), only admins read/manage
drop policy if exists "enrollments_public_insert" on enrollments;
create policy "enrollments_public_insert" on enrollments for insert with check (true);

drop policy if exists "enrollments_admin_read" on enrollments;
create policy "enrollments_admin_read" on enrollments for select using (public.is_admin());

drop policy if exists "enrollments_admin_write" on enrollments;
create policy "enrollments_admin_write" on enrollments for update using (public.is_admin()) with check (public.is_admin());

-- payments: students see own; admins see all
drop policy if exists "payments_student_read" on payments;
create policy "payments_student_read" on payments for select
  using (student_id = auth.uid() or public.is_admin());

drop policy if exists "payments_admin_write" on payments;
create policy "payments_admin_write" on payments for all using (public.is_admin()) with check (public.is_admin());

-- assignments: students see published for their batch; admins see all
drop policy if exists "assignments_read" on assignments;
create policy "assignments_read" on assignments for select using (is_published or public.is_admin());

drop policy if exists "assignments_admin_write" on assignments;
create policy "assignments_admin_write" on assignments for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "submissions_student" on submissions;
create policy "submissions_student" on submissions for all
  using (student_id = auth.uid() or public.is_admin())
  with check (student_id = auth.uid() or public.is_admin());

-- grades: students see own; admins see all
drop policy if exists "grades_student_read" on grades;
create policy "grades_student_read" on grades for select
  using (student_id = auth.uid() or public.is_admin());

drop policy if exists "grades_admin_write" on grades;
create policy "grades_admin_write" on grades for all using (public.is_admin()) with check (public.is_admin());

-- attendance: students see own; admins see all
drop policy if exists "attendance_student_read" on attendance;
create policy "attendance_student_read" on attendance for select
  using (student_id = auth.uid() or public.is_admin());

drop policy if exists "attendance_admin_write" on attendance;
create policy "attendance_admin_write" on attendance for all using (public.is_admin()) with check (public.is_admin());

-- announcements: published visible to all logged-in; admins can write
drop policy if exists "announcements_read" on announcements;
create policy "announcements_read" on announcements for select using (is_published);

drop policy if exists "announcements_admin_write" on announcements;
create policy "announcements_admin_write" on announcements for all using (public.is_admin()) with check (public.is_admin());

-- messages: own threads only; admins see all
drop policy if exists "messages_own" on messages;
create policy "messages_own" on messages for select
  using (from_user_id = auth.uid() or to_user_id = auth.uid() or public.is_admin());

drop policy if exists "messages_send" on messages;
create policy "messages_send" on messages for insert
  with check (from_user_id = auth.uid() or public.is_admin() or from_user_id is null);

-- resources: public ones visible to all; private to logged-in students; admins all
drop policy if exists "resources_read" on resources;
create policy "resources_read" on resources for select
  using (is_public or auth.uid() is not null);

drop policy if exists "resources_admin_write" on resources;
create policy "resources_admin_write" on resources for all using (public.is_admin()) with check (public.is_admin());

-- certificates: students see own; admins see all
drop policy if exists "certificates_student_read" on certificates;
create policy "certificates_student_read" on certificates for select
  using (student_id = auth.uid() or public.is_admin());

drop policy if exists "certificates_admin_write" on certificates;
create policy "certificates_admin_write" on certificates for all using (public.is_admin()) with check (public.is_admin());

-- site_settings: read public; write super-admin only
drop policy if exists "settings_read" on site_settings;
create policy "settings_read" on site_settings for select using (true);

drop policy if exists "settings_super_write" on site_settings;
create policy "settings_super_write" on site_settings for all using (public.is_super_admin()) with check (public.is_super_admin());

-- audit_log: insert from server only (service role bypasses RLS); admins read
drop policy if exists "audit_admin_read" on audit_log;
create policy "audit_admin_read" on audit_log for select using (public.is_admin());

-- ============================================================
-- 24. Convenience views
-- ============================================================
create or replace view student_directory as
  select p.id, p.email, p.full_name, p.full_name_bn, p.phone, p.student_id,
         p.status, p.joined_at, b.code as batch_code, b.name as batch_name
  from profiles p
  left join batches b on b.id = p.batch_id
  where p.role = 'student';

-- ============================================================
-- DONE.  Next step: sign up via /login/, then run:
--   update profiles set role = 'super_admin' where email = 'YOUR-EMAIL';
-- ============================================================
