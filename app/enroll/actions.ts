"use server";

/* Public enrollment submission. Anyone can call (RLS policy
   enrollments_public_insert allows insert with check (true)).
   Inserts a row into enrollments → admin sees it under
   /admin/enrollments. We DON'T auto-create a Supabase auth user
   here; admin reviews + accepts, then the student gets an
   invitation flow (TODO). */

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

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
};

export async function submitEnrollment(payload: EnrollPayload): Promise<EnrollResult> {
  const supabase = await createClient();

  if (!payload.fullName?.trim()) return { error: "নাম আবশ্যক।" };
  if (!payload.email?.trim()) return { error: "ইমেইল আবশ্যক।" };
  if (!payload.phone?.trim()) return { error: "ফোন আবশ্যক।" };

  const reference = `SA-${Date.now().toString(36).toUpperCase()}`;

  const ageNum = payload.age ? parseInt(String(payload.age), 10) : null;
  const profession = [payload.occupation, payload.educationLevel].filter(Boolean).join(" · ") || null;

  /* Pack the rich application form's extra fields into `notes` so the
     admin can see everything without us adding a dozen new columns. */
  const noteLines = [
    payload.fatherName ? `Father: ${payload.fatherName}` : null,
    payload.whatsapp && payload.whatsapp !== payload.phone ? `WhatsApp: ${payload.whatsapp}` : null,
    payload.islamicBackground ? `Islamic background: ${payload.islamicBackground}` : null,
    payload.program ? `Program: ${payload.program}` : null,
    payload.batch ? `Batch preference: ${payload.batch}` : null,
    payload.paymentPlan ? `Payment plan: ${payload.paymentPlan}` : null,
    `Reference: ${reference}`,
  ].filter(Boolean).join("\n");

  const { error } = await supabase.from("enrollments").insert({
    applicant_email: payload.email.trim().toLowerCase(),
    applicant_name: payload.fullName.trim(),
    age: ageNum && ageNum > 0 && ageNum < 120 ? ageNum : null,
    profession,
    city: payload.city ?? null,
    phone: payload.phone.trim(),
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
