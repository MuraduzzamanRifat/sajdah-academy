import { redirect } from "next/navigation";
import DashboardShell from "./_components/DashboardShell";
import { getCurrentUser } from "../../lib/auth/current-user";
import { createClient } from "../../lib/supabase/server";
import { initials } from "../../lib/initials";

/* Persistent dashboard layout — the sidebar + topbar render once and
   stay mounted across in-app navigation. Pulls the real user identity
   so the shell can stop pretending every visitor is "Muhammad Ibrahim".

   Auth gate: middleware already redirects unauth requests on
   /student-dashboard/* to /login, so reaching this layout means we
   have a session — but we double-check defensively. */

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const me = await getCurrentUser();
  if (!me) {
    /* Defense in depth — middleware should have already done this. */
    redirect("/login?next=/student-dashboard/");
  }

  /* Resolve the student's batch name (sidebar footer + topbar). One
     query, cached via React cache() if multiple consumers ask. */
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, status, student_id, batches:batch_id ( name, code )")
    .eq("id", me.id)
    .maybeSingle();

  type BatchSummary = { name: string | null; code: string | null } | null;
  const batch = (profile?.batches ?? null) as BatchSummary;

  return (
    <DashboardShell
      me={{
        name: profile?.full_name?.trim() || me.name,
        email: me.email,
        initials: initials(profile?.full_name?.trim() || me.name || me.email),
        batchName: batch?.name ?? null,
        studentId: profile?.student_id ?? null,
        status: (profile?.status as string | null) ?? null,
      }}
    >
      {children}
    </DashboardShell>
  );
}
