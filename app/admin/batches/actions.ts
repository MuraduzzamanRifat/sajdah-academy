"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

export type ActionResult = { ok: true } | { error: string };

const STATUSES = ["open", "running", "completed", "cancelled"] as const;
type BatchStatus = (typeof STATUSES)[number];

function fld(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function revalidateAll() {
  revalidatePath("/batches");
  revalidatePath("/admin/batches");
  revalidatePath("/admin");
}

export async function createBatch(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const code = fld(formData, "code");
  const name = fld(formData, "name");
  const status = fld(formData, "status") as BatchStatus;

  if (!code) return { error: "Code দিন (যেমন B5-2026-AUG)।" };
  if (!name) return { error: "নাম দিন।" };
  if (!STATUSES.includes(status)) return { error: "Status invalid।" };

  const { error } = await supabase.from("batches").insert({
    code,
    name,
    status,
    starts_at: fld(formData, "starts_at") || null,
    ends_at: fld(formData, "ends_at") || null,
    location: fld(formData, "location") || null,
    capacity: parseInt(fld(formData, "capacity"), 10) || 40,
    fee_bdt: parseFloat(fld(formData, "fee_bdt")) || null,
    installments: parseInt(fld(formData, "installments"), 10) || 4,
    enrollment_closes_at: fld(formData, "enrollment_closes_at") || null,
    notes: fld(formData, "notes") || null,
  });

  if (error) return { error: error.message };
  revalidateAll();
  redirect("/admin/batches/");
}

export async function updateBatch(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const name = fld(formData, "name");
  const status = fld(formData, "status") as BatchStatus;

  if (!name) return { error: "নাম খালি রাখা যাবে না।" };
  if (!STATUSES.includes(status)) return { error: "Status invalid।" };

  const { error } = await supabase
    .from("batches")
    .update({
      name,
      status,
      starts_at: fld(formData, "starts_at") || null,
      ends_at: fld(formData, "ends_at") || null,
      location: fld(formData, "location") || null,
      capacity: parseInt(fld(formData, "capacity"), 10) || 40,
      fee_bdt: parseFloat(fld(formData, "fee_bdt")) || null,
      installments: parseInt(fld(formData, "installments"), 10) || 4,
      enrollment_closes_at: fld(formData, "enrollment_closes_at") || null,
      notes: fld(formData, "notes") || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidateAll();
  redirect("/admin/batches/");
}

export async function deleteBatch(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("batches").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { ok: true };
}
