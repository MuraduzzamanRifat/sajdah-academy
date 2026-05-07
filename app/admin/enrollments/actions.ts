"use server";

/* Enrollment review actions. Defense in depth: requireAdmin() at the
   action level, RLS at the DB level. Each status flip uses the typed
   Actions.* helper so the audit-log taxonomy stays consistent. */

import { revalidatePath } from "next/cache";
import { createClient } from "../../../lib/supabase/server";
import { requireAdmin } from "../../../lib/auth/current-user";
import { Actions } from "../../../lib/audit";

export type ActionResult = { ok: true } | { error: string };

type Status = "accepted" | "rejected" | "waitlisted" | "reviewing";

const AUDITORS: Record<Status, (id: string) => Promise<void>> = {
  accepted: Actions.enrollmentAccept,
  rejected: Actions.enrollmentReject,
  waitlisted: Actions.enrollmentWaitlist,
  reviewing: Actions.enrollmentReview,
};

async function setStatus(id: string, status: Status): Promise<ActionResult> {
  const me = await requireAdmin();
  if (!me) return { error: "Forbidden — admin access required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("enrollments")
    .update({
      status,
      reviewed_by: me.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { error: error.message };

  await AUDITORS[status](id);
  revalidatePath("/dashboard/enrollments");
  revalidatePath("/admin/enrollments");
  revalidatePath("/admin");
  return { ok: true };
}

export async function acceptEnrollment(id: string) {
  return setStatus(id, "accepted");
}
export async function rejectEnrollment(id: string) {
  return setStatus(id, "rejected");
}
export async function waitlistEnrollment(id: string) {
  return setStatus(id, "waitlisted");
}
export async function startReview(id: string) {
  return setStatus(id, "reviewing");
}
