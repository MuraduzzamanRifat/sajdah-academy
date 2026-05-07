import AdminShell from "./_components/AdminShell";
import AdminLoginPanel from "./_components/AdminLoginPanel";
import { createClient } from "../../lib/supabase/server";
import { isAdminRole } from "../../lib/roles";

/* Admin URL is now also the admin login URL. When there's no session,
   render the dark "Restricted Access" login panel inline; when signed
   in as an admin role, wrap children in the AdminShell. Non-admin users
   who somehow get here (RLS rejected) see the login again — the prior
   middleware redirect to /student-dashboard handles the typical case. */

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <AdminLoginPanel />;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .single();

  if (!isAdminRole(profile?.role)) {
    // Logged-in but not admin — show the login panel; they can sign out
    // and back in with admin creds, or click the "ছাত্র লগইন" link.
    return <AdminLoginPanel />;
  }

  return (
    <AdminShell
      me={{
        name: profile?.full_name ?? user.email ?? "Admin",
        email: profile?.email ?? user.email ?? "",
        role: profile?.role ?? "—",
      }}
    >
      {children}
    </AdminShell>
  );
}
