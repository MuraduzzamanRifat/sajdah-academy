"use server";

/* Public enrollment submission. Anyone can call (RLS policy
   enrollments_public_insert allows insert with check (true)).
   Inserts a row into enrollments → admin sees it under
   /admin/enrollments. */

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "../../../lib/supabase/server";

export type EnrollResult = { ok: true; reference: string } | { error: string };

export type EnrollPayload = {
  fullName: string;
  fatherName?: string;
  age?: string | number;
  phone: string;
  whatsapp?: string;
  email: string;
  city?: string;
  occupation?: string;
  educationLevel?: string;
  islamicBackground?: string;
  motivation?: string;
  program?: string;
  batch?: string;
  paymentPlan?: string;
  hearAbout?: string;
  /* Honeypot — visually hidden in the form, real users leave it blank.
     Bots that auto-fill every field will fill it. */
  website?: string;
};

/* Public form rate limits. The submitEnrollment action is unauthenticated
   (RLS allows insert with check(true)) so without these guards anyone can
   flood the enrollments table.  We use the existing data — no Redis dep,
   no extra service. */
const MAX_PER_EMAIL_PER_HOUR = 3;
const MAX_PER_PHONE_PER_HOUR = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

async function isRateLimited(
  supabase: Awaited<ReturnType<typeof createClient>>,
  email: string,
  phone: string
): Promise<{ limited: false } | { limited: true; reason: string }> {
  const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();

  // Run the two count queries in parallel — Supabase honours head-only
  // count requests fast.
  const [emailRes, phoneRes] = await Promise.all([
    supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("applicant_email", email)
      .gte("created_at", since),
    supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("phone", phone)
      .gte("created_at", since),
  ]);

  if ((emailRes.count ?? 0) >= MAX_PER_EMAIL_PER_HOUR) {
    return { limited: true, reason: "এই ইমেইল থেকে সাম্প্রতিক একাধিক আবেদন এসেছে। ১ ঘণ্টা পরে আবার চেষ্টা করুন।" };
  }
  if ((phoneRes.count ?? 0) >= MAX_PER_PHONE_PER_HOUR) {
    return { limited: true, reason: "এই ফোন নম্বর থেকে অনেকগুলি আবেদন এসেছে। ১ ঘণ্টা পরে আবার চেষ্টা করুন।" };
  }
  return { limited: false };
}

export async function submitEnrollment(payload: EnrollPayload): Promise<EnrollResult> {
  // Honeypot check — silently reject without telling the bot why.
  if (payload.website && payload.website.trim().length > 0) {
    return { error: "আবেদন পাঠাতে সমস্যা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।" };
  }

  if (!payload.fullName?.trim()) return { error: "নাম আবশ্যক।" };
  if (!payload.email?.trim()) return { error: "ইমেইল আবশ্যক।" };
  if (!payload.phone?.trim()) return { error: "ফোন আবশ্যক।" };

  const email = payload.email.trim().toLowerCase();
  const phone = payload.phone.trim();
  const supabase = await createClient();

  // Per-identity rate limit — checked before insert to keep the
  // enrollments table clean.
  const rl = await isRateLimited(supabase, email, phone);
  if (rl.limited) return { error: rl.reason };

  const reference = `SA-${Date.now().toString(36).toUpperCase()}`;
  const ageNum = payload.age ? parseInt(String(payload.age), 10) : null;
  const profession = [payload.occupation, payload.educationLevel].filter(Boolean).join(" · ") || null;

  /* Capture the source IP into notes so admins can see clusters of
     submissions from the same network. We don't add a dedicated column
     yet — minimal schema churn. */
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("cf-connecting-ip") ??
    h.get("x-real-ip") ??
    null;

  const noteLines = [
    payload.fatherName ? `Father: ${payload.fatherName}` : null,
    payload.whatsapp && payload.whatsapp !== phone ? `WhatsApp: ${payload.whatsapp}` : null,
    payload.islamicBackground ? `Islamic background: ${payload.islamicBackground}` : null,
    payload.program ? `Program: ${payload.program}` : null,
    payload.batch ? `Batch preference: ${payload.batch}` : null,
    payload.paymentPlan ? `Payment plan: ${payload.paymentPlan}` : null,
    `Reference: ${reference}`,
    ip ? `Source IP: ${ip}` : null,
  ].filter(Boolean).join("\n");

  const { error } = await supabase.from("enrollments").insert({
    applicant_email: email,
    applicant_name: payload.fullName.trim(),
    age: ageNum && ageNum > 0 && ageNum < 120 ? ageNum : null,
    profession,
    city: payload.city ?? null,
    phone,
    motivation: payload.motivation ?? null,
    referral_source: payload.hearAbout ?? null,
    status: "submitted",
    notes: noteLines,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/enrollments");
  revalidatePath("/admin");
  return { ok: true, reference };
}
