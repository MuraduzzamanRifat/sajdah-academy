"use server";

/* Enrollment review actions. Accept = mark accepted (and optionally
   create a profile invite — TODO; for now just status change).
   Reject = mark rejected. Waitlist = mark waitlisted. */

import { revalidatePath } from "next/cache";
import { createClient } from "../../../lib/supabase/server";
import { getCurrentUser } from "../../../lib/auth/current-user";
import { audit } from "../../../lib/audit";

export type ActionResult = { ok: true } | { error: string };

async function setStatus(id: string, status: "accepted" | "rejected" | "waitlisted" | "reviewing"): Promise<ActionResult> {
  const supabase = await createClient();
  const me = await getCurrentUser();  // header-based; no Supabase round-trip
  const { error } = await supabase
    .from("enrollments")
    .update({
      status,
      reviewed_by: me?.id ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { error: error.message };
  await audit({ action: `enrollment.${status}`, entityType: "enrollment", entityId: id });
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
