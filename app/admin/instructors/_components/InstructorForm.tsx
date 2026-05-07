"use client";

import { useState } from "react";
import { AlertCircle, Save } from "lucide-react";
import { createInstructor, updateInstructor, type ActionResult } from "../actions";

export type InstructorInitial = {
  id?: string;
  name?: string;
  name_bn?: string | null;
  role_label?: string | null;
  bio?: string | null;
  rating?: number | null;
  is_guest?: boolean;
};

const inputBase =
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm";

export default function InstructorForm({
  initial,
  mode,
}: {
  initial: InstructorInitial;
  mode: "create" | "edit";
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result: ActionResult =
      mode === "create"
        ? await createInstructor(formData)
        : await updateInstructor(initial.id!, formData);
    setPending(false);
    if ("error" in result) setError(result.error);
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="নাম (English)" name="name" defaultValue={initial.name ?? ""} required />
        <Field label="নাম (Bangla)" name="name_bn" defaultValue={initial.name_bn ?? ""} />
      </div>
      <Field
        label="পদবি / বিভাগ"
        name="role_label"
        defaultValue={initial.role_label ?? ""}
        placeholder="যেমন: ফিকহ ও আক্বীদা প্রধান"
      />
      <div>
        <Label>সংক্ষিপ্ত পরিচয়</Label>
        <textarea
          name="bio"
          defaultValue={initial.bio ?? ""}
          rows={4}
          placeholder="শিক্ষাগত যোগ্যতা · অভিজ্ঞতা · বিশেষজ্ঞতা"
          className={`${inputBase} resize-y`}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Rating (0–5)"
          name="rating"
          type="number"
          defaultValue={initial.rating?.toString() ?? ""}
          placeholder="4.8"
        />
        <label className="flex items-end gap-2 text-sm pb-2">
          <input
            type="checkbox"
            name="is_guest"
            defaultChecked={initial.is_guest ?? false}
            className="rounded border-slate-300"
          />
          <span className="text-slate-700">অতিথি শিক্ষক হিসেবে চিহ্নিত করুন</span>
        </label>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <a
          href="/dashboard/instructors/"
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
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}{required && <span className="text-rose-500">*</span>}</Label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        step={type === "number" ? "0.1" : undefined}
        min={type === "number" ? "0" : undefined}
        max={type === "number" ? "5" : undefined}
        className={inputBase}
      />
    </div>
  );
}
