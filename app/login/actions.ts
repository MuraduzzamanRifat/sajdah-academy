"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "../../lib/supabase/server";
import { safeNext } from "../../lib/safe-redirect";
import { isAdminRole } from "../../lib/roles";
import { isAdminHost } from "../../lib/site-url";

/* Server actions return AuthState only on FAILURE — success paths
   throw NEXT_REDIRECT via redirect(). useActionState handles the
   throw transparently; just be aware the type is "happy-path lies". */
export type AuthState = { error?: string; ok?: boolean } | null;

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!email || !password) return { error: "ইমেইল ও পাসওয়ার্ড দুটোই দিন।" };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  // Role-aware host gate: the api subdomain is admin-only. If a student
  // submits the admin login form there, sign them out immediately and
  // show a clear error — never leave a non-admin session on the api host
  // (would cause a cross-host redirect loop via /student-dashboard).
  const h = await headers();
  const onAdminHost = isAdminHost(h.get("host"));

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (onAdminHost && !isAdminRole(profile?.role)) {
    await supabase.auth.signOut();
    return {
      error: "এই অ্যাকাউন্টের অ্যাডমিন অ্যাক্সেস নেই। ছাত্র লগইন → sijdahacademy.com/login",
    };
  }

  revalidatePath("/", "layout");

  // Honor explicit ?next= if provided (e.g. middleware redirected here);
  // otherwise route by role. Admins on the api host stay on /dashboard;
  // students on the main host go to /student-dashboard.
  if (next) {
    redirect(safeNext(next));
  }
  redirect(isAdminRole(profile?.role) ? "/dashboard/" : "/student-dashboard/");
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();

  if (!email || !password) return { error: "ইমেইল ও পাসওয়ার্ড দিন।" };
  if (password.length < 8) return { error: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে।" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) return { error: error.message };

  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
