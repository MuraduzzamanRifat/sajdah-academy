/* Role enum mirroring the Postgres `user_role` type defined in
   supabase/migrations/0001_initial_schema.sql. Keep these in sync —
   adding a role here without updating the SQL enum (or vice-versa)
   silently breaks /admin access checks. */

export const ROLES = [
  "super_admin",
  "academic_admin",
  "finance",
  "instructor",
  "student",
] as const;

export type Role = (typeof ROLES)[number];

export const ADMIN_ROLES: ReadonlySet<Role> = new Set([
  "super_admin",
  "academic_admin",
  "finance",
]);

export function isAdminRole(role: string | null | undefined): role is Role {
  return !!role && ADMIN_ROLES.has(role as Role);
}
