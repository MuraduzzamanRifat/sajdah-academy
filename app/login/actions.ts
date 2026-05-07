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

  const h = await headers();
  const onAdminHost = isAdminHost(h.get("host"));

  /* Profile must exist for the session to be valid. If the row is
     missing (trigger missed, manual deletion), sign out and surface
     a clear error rather than letting the user into a broken state. */
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    return {
      error:
        "অ্যাকাউন্টের প্রোফাইল রেকর্ড পাওয়া যায়নি। সাপোর্টে যোগাযোগ করুন।",
    };
  }

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
  const fullName = String(formData.get("full_name") ?? "").trim().slice(0, 100);

  if (!email || !password) return { error: "ইমেইল ও পাসওয়ার্ড দিন।" };
  if (password.length < 8) return { error: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে।" };
  if (fullName && fullName.length < 2) return { error: "নাম খুব ছোট।" };

  /* The admin host (api.sijdahacademy.com) is for admin sign-IN only.
     Self-registration on the api host is denied — admins are minted
     server-side, not via public signup. */
  const h = await headers();
  if (isAdminHost(h.get("host"))) {
    return {
      error: "এডমিন প্যানেলে নতুন অ্যাকাউন্ট তৈরি করা যাবে না। ছাত্র সাইনআপ → sijdahacademy.com",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) return { error: error.message };

  /* Supabase returns success with `data.user.identities = []` when the
     email is already registered — its email-enumeration protection.
     Translate that into an explicit "already registered" message so the
     user doesn't see a green success block and wonder why no email arrived. */
  if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
    return {
      error:
        "এই ইমেইল ইতিমধ্যে রেজিস্টার্ড। সাইন ইন করুন বা পাসওয়ার্ড রিসেট করুন।",
    };
  }

  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
