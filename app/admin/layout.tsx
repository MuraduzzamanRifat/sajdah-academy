import AdminShell from "./_components/AdminShell";
import AdminLoginPanel from "./_components/AdminLoginPanel";
import { getCurrentUser } from "../../lib/auth/current-user";
import { isAdminRole } from "../../lib/roles";

/* Admin layout reads identity from x-sajdah-* request headers populated
   by middleware. Zero Supabase round-trips here — middleware already
   did the getUser + profile fetch once per request. */

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await getCurrentUser();

  if (!me || !isAdminRole(me.role)) {
    // No session, or signed-in but non-admin role. Either way render
    // the inline restricted-access panel; AdminShell never appears
    // unless role is verified admin.
    return <AdminLoginPanel />;
  }

  return (
    <AdminShell me={{ name: me.name, email: me.email, role: me.role }}>
      {children}
    </AdminShell>
  );
}
