"use server";

/* Public enrollment submission. Anyone can call (RLS policy
   enrollments_public_insert allows insert with check (true)).
   Capacity + window enforcement is handled by the public.enroll_applicant
   Postgres function (migration 0004) which row-locks the batch and
   re-counts seats inside a transaction — fixes the TOCTOU race. */

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "../../../lib/supabase/server";
import { Actions } from "../../../lib/audit";

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
  /* Honeypot — visually hidden in the form, real users leave it blank. */
  website?: string;
};

const MAX_PER_EMAIL_PER_HOUR = 3;
const MAX_PER_PHONE_PER_HOUR = 5;
const MAX_PER_IP_PER_HOUR = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function isRateLimited(
  supabase: Awaited<ReturnType<typeof createClient>>,
  email: string,
  phone: string,
  ip: string | null
): Promise<{ limited: false } | { limited: true; reason: string }> {
  const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();

  /* IP-keyed counter via notes ILIKE — blunt but works without a new
     table; rotates emails/phones can't bypass any longer. */
  const ipQuery = ip
    ? supabase
        .from("enrollments")
        .select("id", { count: "exact", head: true })
        .ilike("notes", `%Source IP: ${ip}%`)
        .gte("created_at", since)
    : Promise.resolve({ count: 0 } as { count: number });

  const [emailRes, phoneRes, ipRes] = await Promise.all([
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
    ipQuery,
  ]);

  if ((emailRes.count ?? 0) >= MAX_PER_EMAIL_PER_HOUR) {
    return { limited: true, reason: "এই ইমেইল থেকে সাম্প্রতিক একাধিক আবেদন এসেছে। ১ ঘণ্টা পরে আবার চেষ্টা করুন।" };
  }
  if ((phoneRes.count ?? 0) >= MAX_PER_PHONE_PER_HOUR) {
    return { limited: true, reason: "এই ফোন নম্বর থেকে অনেকগুলি আবেদন এসেছে। ১ ঘণ্টা পরে আবার চেষ্টা করুন।" };
  }
  const ipCount = "count" in ipRes ? (ipRes.count ?? 0) : 0;
  if (ipCount >= MAX_PER_IP_PER_HOUR) {
    return { limited: true, reason: "একই নেটওয়ার্ক থেকে অনেক আবেদন এসেছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।" };
  }
  return { limited: false };
}

export async function submitEnrollment(payload: EnrollPayload): Promise<EnrollResult> {
  /* Honeypot — silent reject so bots can't tune. */
  if (payload.website && payload.website.trim().length > 0) {
    return { error: "আবেদন পাঠাতে সমস্যা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।" };
  }

  if (!payload.fullName?.trim()) return { error: "নাম আবশ্যক।" };
  if (!payload.email?.trim()) return { error: "ইমেইল আবশ্যক।" };
  if (!payload.phone?.trim()) return { error: "ফোন আবশ্যক।" };

  const email = payload.email.trim().toLowerCase();
  const phone = payload.phone.trim();

  if (!EMAIL_RE.test(email)) return { error: "সঠিক ইমেইল দিন।" };

  const supabase = await createClient();

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("cf-connecting-ip") ??
    h.get("x-real-ip") ??
    null;

  const rl = await isRateLimited(supabase, email, phone, ip);
  if (rl.limited) return { error: rl.reason };

  const reference = `SA-${Date.now().toString(36).toUpperCase()}`;
  const ageNum = payload.age ? parseInt(String(payload.age), 10) : null;
  const profession = [payload.occupation, payload.educationLevel].filter(Boolean).join(" · ") || null;

  /* Resolve the batch preference text (e.g. "ব্যাচ-৫") to an actual
     batches.id so the capacity-check function can lock it. If the
     preference is missing or doesn't match a batch, we accept the
     application without a seat reservation; admins can assign later. */
  let targetBatchId: string | null = null;
  if (payload.batch?.trim()) {
    const { data: batch } = await supabase
      .from("batches")
      .select("id")
      .or(`code.ilike.%${payload.batch.trim()}%,name.ilike.%${payload.batch.trim()}%`)
      .in("status", ["open", "running"])
      .limit(1)
      .maybeSingle();
    targetBatchId = batch?.id ?? null;
  }

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

  /* Call the capacity-aware RPC instead of a bare INSERT. The function
     takes a row lock on the batch, re-counts active seats, and rejects
     atomically if full or if the enrollment window closed. */
  const { data: rpcResult, error: rpcError } = await supabase.rpc("enroll_applicant", {
    p_batch_id: targetBatchId,
    p_applicant_name: payload.fullName.trim(),
    p_applicant_email: email,
    p_phone: phone,
    p_age: ageNum && ageNum > 0 && ageNum < 120 ? ageNum : null,
    p_city: payload.city ?? null,
    p_profession: profession,
    p_motivation: payload.motivation ?? null,
    p_referral: payload.hearAbout ?? null,
    p_notes: noteLines,
  });

  if (rpcError) {
    /* Translate the function's raise messages to user-friendly Bengali.
       Never leak raw Postgres errors to the public form. */
    const msg = rpcError.message.toLowerCase();
    let userMsg = "আবেদন পাঠাতে সমস্যা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।";
    if (msg.includes("batch full")) {
      userMsg = "এই ব্যাচ এখন পূর্ণ। অন্য ব্যাচ বেছে নিন বা পরবর্তী ব্যাচের জন্য অপেক্ষা করুন।";
    } else if (msg.includes("window closed")) {
      userMsg = "এই ব্যাচের ভর্তির সময়সীমা শেষ। পরবর্তী ব্যাচের জন্য আমাদের সাথে যোগাযোগ করুন।";
    } else if (msg.includes("batch not found")) {
      userMsg = "নির্বাচিত ব্যাচ পাওয়া যায়নি। অন্য ব্যাচ বেছে নিন।";
    }
    console.error("[enroll] rpcError", rpcError);
    return { error: userMsg };
  }

  const newId = (rpcResult as Array<{ id: string }>)?.[0]?.id;
  if (newId) {
    /* Best-effort audit — failure won't block the success path. */
    await Actions.enrollmentSubmit(newId);
  }

  revalidatePath("/dashboard/enrollments");
  revalidatePath("/admin/enrollments");
  revalidatePath("/admin");
  revalidatePath("/batches");
  return { ok: true, reference };
}
