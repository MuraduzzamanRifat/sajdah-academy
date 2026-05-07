import { headers } from "next/headers";
import {
  USER_ID_HEADER,
  USER_EMAIL_HEADER,
  USER_NAME_HEADER,
  USER_ROLE_HEADER,
} from "../supabase/middleware";
import { isAdminRole, type Role } from "../roles";

/* Reads the identity that middleware already verified. NO Supabase
   round-trip — middleware does the auth.getUser() + profiles.select()
   once per request and writes the result onto request headers via
   NextResponse.next({ request: { headers } }). Server Components
   downstream (admin layout, server actions, etc.) call this helper
   instead of re-doing the same work.

   The headers are sanitised by middleware on every request — clients
   cannot impersonate by setting them in the browser. */

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const h = await headers();
  const id = h.get(USER_ID_HEADER);
  if (!id) return null;
  return {
    id,
    email: h.get(USER_EMAIL_HEADER) ?? "",
    name: h.get(USER_NAME_HEADER) ?? "User",
    role: (h.get(USER_ROLE_HEADER) as Role) ?? "student",
  };
}

export async function requireAdmin(): Promise<CurrentUser | null> {
  const me = await getCurrentUser();
  if (!me || !isAdminRole(me.role)) return null;
  return me;
}
