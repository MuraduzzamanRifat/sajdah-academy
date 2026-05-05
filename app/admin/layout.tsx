import { redirect } from "next/navigation";
import AdminShell from "./_components/AdminShell";
import { createClient } from "../../lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  /* Middleware already verified the user is an admin before allowing this
     route to render. Re-fetch the profile here so the shell renders with
     the correct name/role on first paint — no client useEffect, no race,
     no "··" placeholder flicker. */
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .single();

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
