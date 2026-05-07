"use server";

/* Public contact-form submission. Mirrors the security guardrails on
   submitEnrollment: honeypot, IP-keyed rate limit, server-side regex
   validation, generic error messages so DB internals don't leak.

   Lands the message in the messages table with from_user_id NULL only
   if the policy allows — but migration 0004 closed that loophole, so
   we route public contact through audit_log + a notes-style row in
   site_settings? No — simplest: write to a dedicated `contact_messages`
   row inside an audit log entry so admins can review them in /dashboard
   without coupling to the messages table. */

import { headers } from "next/headers";
import { createClient } from "../../../lib/supabase/server";
import { audit } from "../../../lib/audit";

export type ContactResult = { ok: true } | { error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PER_IP_PER_HOUR = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export async function submitContactMessage(formData: FormData): Promise<ContactResult> {
  /* Honeypot — silent reject. */
  if (String(formData.get("website") ?? "").trim().length > 0) {
    return { error: "বার্তা পাঠাতে সমস্যা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।" };
  }

  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 100);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 30);
  const subject = String(formData.get("subject") ?? "").trim().slice(0, 100);
  const message = String(formData.get("message") ?? "").trim().slice(0, 2000);

  if (!name) return { error: "নাম আবশ্যক।" };
  if (!email) return { error: "ইমেইল আবশ্যক।" };
  if (!message) return { error: "বার্তা আবশ্যক।" };
  if (!EMAIL_RE.test(email)) return { error: "সঠিক ইমেইল দিন।" };
  if (message.length < 5) return { error: "বার্তা খুব ছোট।" };

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("cf-connecting-ip") ??
    h.get("x-real-ip") ??
    null;

  /* IP-keyed rate limit via audit_log — no extra table needed; we
     already write a row per submission so the count is reliable. */
  if (ip) {
    const supabase = await createClient();
    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
    const { count } = await supabase
      .from("audit_log")
      .select("id", { count: "exact", head: true })
      .eq("action", "contact.submit")
      .eq("ip_address", ip)
      .gte("created_at", since);
    if ((count ?? 0) >= MAX_PER_IP_PER_HOUR) {
      return {
        error: "একই নেটওয়ার্ক থেকে অনেক বার্তা এসেছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।",
      };
    }
  }

  /* Persist via audit() (service-role client, RLS-safe). */
  await audit({
    action: "contact.submit",
    entityType: "contact_message",
    diff: { name, email, phone, subject, message },
  });

  return { ok: true };
}
