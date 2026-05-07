"use client";

import { useState } from "react";
import { AlertCircle, Save } from "lucide-react";
import { createBatch, updateBatch, type ActionResult } from "../actions";

export type BatchInitial = {
  id?: string;
  code?: string;
  name?: string;
  status?: "open" | "running" | "completed" | "cancelled";
  starts_at?: string | null;
  ends_at?: string | null;
  location?: string | null;
  capacity?: number;
  fee_bdt?: number | null;
  installments?: number;
  enrollment_closes_at?: string | null;
  notes?: string | null;
};

const inputBase =
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm";

export default function BatchForm({
  initial,
  mode,
}: {
  initial: BatchInitial;
  mode: "create" | "edit";
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result: ActionResult =
      mode === "create" ? await createBatch(formData) : await updateBatch(initial.id!, formData);
    setPending(false);
    if ("error" in result) setError(result.error);
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Code (unique identifier)"
          name="code"
          defaultValue={initial.code ?? ""}
          required
          disabled={mode === "edit"}
          mono
          placeholder="B5-2026-AUG"
        />
        <Field label="ব্যাচের নাম" name="name" defaultValue={initial.name ?? ""} required placeholder="ব্যাচ-৫" />
      </div>

      <div>
        <Label>Status</Label>
        <select name="status" defaultValue={initial.status ?? "open"} required className={inputBase}>
          <option value="open">ভর্তি চলমান</option>
          <option value="running">চলমান</option>
          <option value="completed">সমাপ্ত</option>
          <option value="cancelled">বাতিল</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="শুরুর তারিখ" name="starts_at" type="date" defaultValue={initial.starts_at ?? ""} />
        <Field label="শেষের তারিখ" name="ends_at" type="date" defaultValue={initial.ends_at ?? ""} />
        <Field label="ভর্তি বন্ধ" name="enrollment_closes_at" type="date" defaultValue={initial.enrollment_closes_at ?? ""} />
      </div>

      <Field label="ভেন্যু" name="location" defaultValue={initial.location ?? ""} placeholder="অনলাইন + ৪ গাজীপুর রিট্রিট" />

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="ধারণক্ষমতা" name="capacity" type="number" defaultValue={initial.capacity?.toString() ?? "40"} />
        <Field label="ফি (৳)" name="fee_bdt" type="number" defaultValue={initial.fee_bdt?.toString() ?? "225000"} />
        <Field label="কিস্তির সংখ্যা" name="installments" type="number" defaultValue={initial.installments?.toString() ?? "4"} />
      </div>

      <div>
        <Label>নোট (অপশনাল)</Label>
        <textarea
          name="notes"
          defaultValue={initial.notes ?? ""}
          rows={3}
          placeholder="এই ব্যাচ সম্পর্কে অতিরিক্ত তথ্য — অভ্যন্তরীণ নোট বা পাবলিক আপডেট"
          className={`${inputBase} resize-y`}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <a
          href="/admin/batches/"
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-bold"
        >
          বাতিল
        </a>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-bold disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {pending ? "সংরক্ষণ..." : mode === "create" ? "তৈরি করুন" : "আপডেট করুন"}
        </button>
      </div>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-slate-700 mb-1.5">{children}</label>;
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  disabled,
  placeholder,
  mono,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <Label>{label}{required && <span className="text-rose-500">*</span>}</Label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className={`${inputBase} ${mono ? "font-mono text-xs" : ""} ${disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}
