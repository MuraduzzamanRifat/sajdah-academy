"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { safeNext } from "../../lib/safe-redirect";
import { isAdminRole } from "../../lib/roles";

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

  revalidatePath("/", "layout");

  // Honor explicit ?next= if provided (e.g. middleware redirected here);
  // otherwise route by role. Admins on the api host stay on /admin
  // (which is also the login URL); students go to /student-dashboard
  // on whichever host they're on.
  if (next) {
    redirect(safeNext(next));
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();
  redirect(isAdminRole(profile?.role) ? "/admin/" : "/student-dashboard/");
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
