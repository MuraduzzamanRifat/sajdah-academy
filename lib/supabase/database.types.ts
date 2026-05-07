/* Supabase types — manually transcribed from supabase/migrations/0001_initial_schema.sql.

   THIS FILE WILL DRIFT. Regenerate from the live database whenever you
   apply a migration:

     # one-time setup (uses SUPABASE_ACCESS_TOKEN from env)
     supabase login
     supabase link --project-ref <your-project-ref>

     # on every schema change
     npm run db:types        # → writes lib/supabase/database.types.ts

   In CI, add SUPABASE_ACCESS_TOKEN as a secret and run:
     supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
     npm run db:types
     git diff --exit-code lib/supabase/database.types.ts
   to fail the build if the types don't match the live schema.

   Until the CI job exists, treat any failed query against a column you
   added in a recent migration as "regen the types first." */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ============================================================
// Enums
// ============================================================
export type UserRole =
  | "super_admin" | "academic_admin" | "finance" | "instructor" | "student";
export type StudentStatus = "active" | "pending" | "inactive" | "graduated";
export type BatchStatus = "open" | "running" | "completed" | "cancelled";
export type CoursePhase = "Foundation" | "Understanding" | "Transformation";
export type EnrollmentStatus =
  | "submitted" | "reviewing" | "accepted" | "rejected" | "waitlisted";
export type PaymentStatus =
  | "pending" | "received" | "overdue" | "refunded" | "failed";
export type AttendanceState = "present" | "late" | "absent" | "excused";

// ============================================================
// Row types — one per table
// ============================================================
export type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  full_name_bn: string | null;
  phone: string | null;
  whatsapp: string | null;
  city: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  role: UserRole;
  student_id: string | null;
  batch_id: string | null;
  status: StudentStatus;
  joined_at: string;
  metadata: Json;
  created_at: string;
  updated_at: string;
};

export type InstructorRow = {
  id: string;
  profile_id: string | null;
  name: string;
  name_bn: string | null;
  role_label: string | null;
  bio: string | null;
  rating: number | null;
  is_guest: boolean;
  created_at: string;
};

export type CourseRow = {
  id: string;
  slug: string;
  title: string;
  title_bn: string | null;
  phase: CoursePhase;
  duration: string | null;
  summary: string | null;
  learning_outcomes: string[];
  topics: string[];
  module_number: number | null;
  primary_instructor_id: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type BatchRow = {
  id: string;
  code: string;
  name: string;
  status: BatchStatus;
  starts_at: string | null;
  ends_at: string | null;
  location: string | null;
  capacity: number;
  fee_bdt: number | null;
  installments: number;
  enrollment_closes_at: string | null;
  notes: string | null;
  created_at: string;
};

export type EnrollmentRow = {
  id: string;
  applicant_email: string;
  applicant_name: string;
  age: number | null;
  profession: string | null;
  city: string | null;
  phone: string | null;
  motivation: string | null;
  referral_source: string | null;
  target_batch_id: string | null;
  status: EnrollmentStatus;
  match_score: number | null;
  payment_received: boolean;
  docs_complete: boolean;
  reviewed_by: string | null;
  reviewed_at: string | null;
  notes: string | null;
  created_at: string;
};

export type PaymentRow = {
  id: string;
  txn_code: string;
  student_id: string | null;
  enrollment_id: string | null;
  amount_bdt: number;
  method: string | null;
  kind: string | null;
  status: PaymentStatus;
  due_date: string | null;
  paid_at: string | null;
  reference: string | null;
  created_at: string;
};

export type AssignmentRow = {
  id: string;
  course_id: string | null;
  batch_id: string | null;
  title: string;
  description: string | null;
  kind: string | null;
  due_at: string | null;
  total_points: number;
  is_published: boolean;
  created_at: string;
};

export type SubmissionRow = {
  id: string;
  assignment_id: string;
  student_id: string;
  submitted_at: string | null;
  body: string | null;
  attachment_url: string | null;
  score: number | null;
  graded_at: string | null;
  graded_by: string | null;
  feedback: string | null;
};

export type GradeRow = {
  id: string;
  student_id: string;
  course_id: string;
  batch_id: string;
  quiz_scores: number[];
  midterm: number | null;
  final: number | null;
  composite: number | null;
  letter: string | null;
  updated_at: string;
};

export type AttendanceRow = {
  id: string;
  student_id: string;
  batch_id: string;
  course_id: string | null;
  class_label: string | null;
  date: string;
  state: AttendanceState;
  notes: string | null;
  recorded_by: string | null;
  created_at: string;
};

export type ScheduleEventRow = {
  id: string;
  batch_id: string | null;
  course_id: string | null;
  instructor_id: string | null;
  title: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  color: string;
  notes: string | null;
  created_at: string;
};

export type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  audience: string;
  channels: string[];
  scheduled_for: string | null;
  published_at: string | null;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
};

export type MessageRow = {
  id: string;
  thread_id: string;
  from_user_id: string | null;
  from_email: string | null;
  to_user_id: string | null;
  subject: string | null;
  body: string;
  is_read: boolean;
  is_urgent: boolean;
  parent_id: string | null;
  created_at: string;
};

export type ResourceRow = {
  id: string;
  title: string;
  course_id: string | null;
  kind: string;
  storage_path: string | null;
  size_bytes: number | null;
  uploaded_by: string | null;
  download_count: number;
  is_public: boolean;
  created_at: string;
};

export type CertificateRow = {
  id: string;
  cert_no: string;
  student_id: string;
  phase: CoursePhase;
  grade: string | null;
  composite_score: number | null;
  issued_at: string | null;
  verification_hash: string | null;
  pdf_url: string | null;
  created_at: string;
};

export type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  category: string | null;
  author: string | null;
  reading_minutes: number | null;
  published_at: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteSettingRow = {
  key: string;
  value: Json;
  updated_by: string | null;
  updated_at: string;
};

export type AuditLogRow = {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  diff: Json | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

export type StudentDirectoryRow = {
  id: string;
  email: string;
  full_name: string | null;
  full_name_bn: string | null;
  phone: string | null;
  student_id: string | null;
  status: StudentStatus;
  joined_at: string;
  batch_code: string | null;
  batch_name: string | null;
};

// ============================================================
// Database — what supabase-js consumes
// ============================================================
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string; email: string };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      instructors: {
        Row: InstructorRow;
        Insert: Partial<InstructorRow> & { name: string };
        Update: Partial<InstructorRow>;
        Relationships: [];
      };
      courses: {
        Row: CourseRow;
        Insert: Partial<CourseRow> & { slug: string; title: string; phase: CoursePhase };
        Update: Partial<CourseRow>;
        Relationships: [];
      };
      batches: {
        Row: BatchRow;
        Insert: Partial<BatchRow> & { code: string; name: string };
        Update: Partial<BatchRow>;
        Relationships: [];
      };
      enrollments: {
        Row: EnrollmentRow;
        Insert: Partial<EnrollmentRow> & { applicant_email: string; applicant_name: string };
        Update: Partial<EnrollmentRow>;
        Relationships: [];
      };
      payments: {
        Row: PaymentRow;
        Insert: Partial<PaymentRow> & { amount_bdt: number };
        Update: Partial<PaymentRow>;
        Relationships: [];
      };
      assignments: {
        Row: AssignmentRow;
        Insert: Partial<AssignmentRow> & { title: string };
        Update: Partial<AssignmentRow>;
        Relationships: [];
      };
      submissions: {
        Row: SubmissionRow;
        Insert: Partial<SubmissionRow> & { assignment_id: string; student_id: string };
        Update: Partial<SubmissionRow>;
        Relationships: [];
      };
      grades: {
        Row: GradeRow;
        Insert: Partial<GradeRow> & { student_id: string; course_id: string; batch_id: string };
        Update: Partial<GradeRow>;
        Relationships: [];
      };
      attendance: {
        Row: AttendanceRow;
        Insert: Partial<AttendanceRow> & { student_id: string; batch_id: string; date: string };
        Update: Partial<AttendanceRow>;
        Relationships: [];
      };
      schedule_events: {
        Row: ScheduleEventRow;
        Insert: Partial<ScheduleEventRow> & { title: string; starts_at: string };
        Update: Partial<ScheduleEventRow>;
        Relationships: [];
      };
      announcements: {
        Row: AnnouncementRow;
        Insert: Partial<AnnouncementRow> & { title: string; body: string };
        Update: Partial<AnnouncementRow>;
        Relationships: [];
      };
      messages: {
        Row: MessageRow;
        Insert: Partial<MessageRow> & { body: string };
        Update: Partial<MessageRow>;
        Relationships: [];
      };
      resources: {
        Row: ResourceRow;
        Insert: Partial<ResourceRow> & { title: string; kind: string };
        Update: Partial<ResourceRow>;
        Relationships: [];
      };
      certificates: {
        Row: CertificateRow;
        Insert: Partial<CertificateRow> & { cert_no: string; student_id: string; phase: CoursePhase };
        Update: Partial<CertificateRow>;
        Relationships: [];
      };
      posts: {
        Row: PostRow;
        Insert: Partial<PostRow> & { slug: string; title: string; body: string };
        Update: Partial<PostRow>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingRow;
        Insert: Partial<SiteSettingRow> & { key: string; value: Json };
        Update: Partial<SiteSettingRow>;
        Relationships: [];
      };
      audit_log: {
        Row: AuditLogRow;
        Insert: Partial<AuditLogRow> & { action: string };
        Update: Partial<AuditLogRow>;
        Relationships: [];
      };
    };
    Views: {
      student_directory: { Row: StudentDirectoryRow };
    };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_super_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      student_status: StudentStatus;
      batch_status: BatchStatus;
      course_phase: CoursePhase;
      enrollment_status: EnrollmentStatus;
      payment_status: PaymentStatus;
      attendance_state: AttendanceState;
    };
  };
};

/* Convenience aliases */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
