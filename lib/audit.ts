import { headers } from "next/headers";
import { createServiceClient } from "./supabase/service";
import { createClient as createUserClient } from "./supabase/server";
import { getCurrentUser } from "./auth/current-user";

/* Append-only audit log writer.

   Every admin server action that MUTATES (create/update/delete/publish/
   accept/reject) calls audit() right after a successful mutation.
   The admin shell banner reads "All actions are audit-logged" — that
   line is now true.

   Format: action = "<entity>.<verb>" (e.g. "course.update", "post.delete",
   "enrollment.accept"). entity_id is the row id. diff carries the
   minimal change set or full new state — caller decides.

   This wraps a service-style call deliberately: failures are logged
   but never thrown. We don't want a transient audit-log outage to
   break a legitimate admin save. */

export type AuditEntry = {
  action: string;
  entityType?: string;
  entityId?: string;
  diff?: Record<string, unknown>;
};

export async function audit(entry: AuditEntry): Promise<void> {
  try {
    /* Trust path: read actor identity from the user-scoped client
       (auth.uid()), NOT from the request header. A header can be
       spoofed if middleware ever skips a route; auth.uid() is bound
       to the verified Supabase JWT cookie. */
    const userClient = await createUserClient();
    const { data: authData } = await userClient.auth.getUser();
    const verifiedActorId = authData.user?.id ?? null;

    /* Fall back to header-derived id only when the user isn't signed
       in (system actions). Header is sanitised by middleware. */
    const me = verifiedActorId ? null : await getCurrentUser();
    const actorId = verifiedActorId ?? me?.id ?? null;

    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("cf-connecting-ip") ??
      h.get("x-real-ip") ??
      null;
    const ua = h.get("user-agent");

    /* Use the service-role client so writes succeed regardless of
       RLS policies on audit_log. The table has SELECT-only admin
       policy in migration 0001 — without service role, every audit
       insert silently fails (security gap closed in 0004). */
    const svc = createServiceClient();
    await svc.from("audit_log").insert({
      actor_id: actorId,
      action: entry.action,
      entity_type: entry.entityType ?? null,
      entity_id: entry.entityId ?? null,
      diff: (entry.diff ?? null) as object | null,
      ip_address: ip,
      user_agent: ua,
    });
  } catch (err) {
    // Audit must never break the action. Surface to server logs only.
    console.error("[audit] failed to log entry", { entry, error: err });
  }
}

/* Common entity-action shorthand so call sites stay terse. */
export const Actions = {
  // Courses
  courseCreate: (id: string, diff?: Record<string, unknown>) =>
    audit({ action: "course.create", entityType: "course", entityId: id, diff }),
  courseUpdate: (id: string, diff?: Record<string, unknown>) =>
    audit({ action: "course.update", entityType: "course", entityId: id, diff }),
  courseDelete: (id: string) =>
    audit({ action: "course.delete", entityType: "course", entityId: id }),
  coursePublish: (id: string, isPublished: boolean) =>
    audit({
      action: isPublished ? "course.publish" : "course.unpublish",
      entityType: "course",
      entityId: id,
    }),
  courseDuplicate: (srcId: string, newId: string) =>
    audit({ action: "course.duplicate", entityType: "course", entityId: newId, diff: { from: srcId } }),

  // Posts
  postCreate: (id: string, diff?: Record<string, unknown>) =>
    audit({ action: "post.create", entityType: "post", entityId: id, diff }),
  postUpdate: (id: string, diff?: Record<string, unknown>) =>
    audit({ action: "post.update", entityType: "post", entityId: id, diff }),
  postDelete: (id: string) =>
    audit({ action: "post.delete", entityType: "post", entityId: id }),
  postPublish: (id: string, isPublished: boolean) =>
    audit({
      action: isPublished ? "post.publish" : "post.unpublish",
      entityType: "post",
      entityId: id,
    }),

  // Instructors
  instructorCreate: (id: string, diff?: Record<string, unknown>) =>
    audit({ action: "instructor.create", entityType: "instructor", entityId: id, diff }),
  instructorUpdate: (id: string, diff?: Record<string, unknown>) =>
    audit({ action: "instructor.update", entityType: "instructor", entityId: id, diff }),
  instructorDelete: (id: string) =>
    audit({ action: "instructor.delete", entityType: "instructor", entityId: id }),

  // Batches
  batchCreate: (id: string, diff?: Record<string, unknown>) =>
    audit({ action: "batch.create", entityType: "batch", entityId: id, diff }),
  batchUpdate: (id: string, diff?: Record<string, unknown>) =>
    audit({ action: "batch.update", entityType: "batch", entityId: id, diff }),
  batchDelete: (id: string) =>
    audit({ action: "batch.delete", entityType: "batch", entityId: id }),

  // Enrollments
  enrollmentAccept: (id: string) =>
    audit({ action: "enrollment.accept", entityType: "enrollment", entityId: id }),
  enrollmentReject: (id: string) =>
    audit({ action: "enrollment.reject", entityType: "enrollment", entityId: id }),
  enrollmentWaitlist: (id: string) =>
    audit({ action: "enrollment.waitlist", entityType: "enrollment", entityId: id }),
  enrollmentReview: (id: string) =>
    audit({ action: "enrollment.review", entityType: "enrollment", entityId: id }),
  enrollmentSubmit: (id: string) =>
    audit({ action: "enrollment.submit", entityType: "enrollment", entityId: id }),

  // Settings (CMS edits)
  settingsUpdate: (changedKeys: string[]) =>
    audit({
      action: "settings.update",
      entityType: "site_settings",
      diff: { keys: changedKeys },
    }),
};
