"use client";

import { useState } from "react";
import { AlertCircle, Save } from "lucide-react";
import { createCourse, updateCourse, type ActionResult } from "../actions";

export type CourseInitial = {
  id?: string;
  slug?: string;
  title?: string;
  title_bn?: string | null;
  phase?: string;
  duration?: string | null;
  summary?: string | null;
  learning_outcomes?: string[] | null;
  topics?: string[] | null;
  module_number?: number | null;
  display_order?: number;
  is_published?: boolean;
};

const inputBase =
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm";

export default function CourseForm({
  initial,
  mode,
}: {
  initial: CourseInitial;
  mode: "create" | "edit";
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    let result: ActionResult;
    if (mode === "create") {
      result = await createCourse(formData);
    } else {
      result = await updateCourse(initial.id!, formData);
    }
    setPending(false);
    if ("error" in result) setError(result.error);
    // success path redirects via the action; nothing else to do
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Slug (URL)" name="slug" defaultValue={initial.slug} disabled={mode === "edit"} required mono />
        <Field label="Phase" name="phase" defaultValue={initial.phase ?? "Foundation"} required>
          <select
            name="phase"
            defaultValue={initial.phase ?? "Foundation"}
            required
            className={inputBase}
          >
            <option>Foundation</option>
            <option>Understanding</option>
            <option>Transformation</option>
          </select>
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title (English)" name="title" defaultValue={initial.title} required />
        <Field label="Title (Bangla)" name="title_bn" defaultValue={initial.title_bn ?? ""} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Duration" name="duration" defaultValue={initial.duration ?? ""} placeholder="৪ ক্লাস · ৬ ঘণ্টা" />
        <Field label="Module #" name="module_number" type="number" defaultValue={initial.module_number?.toString() ?? ""} />
        <Field label="Display order" name="display_order" type="number" defaultValue={initial.display_order?.toString() ?? "0"} />
      </div>

      <div>
        <Label>Summary</Label>
        <textarea
          name="summary"
          defaultValue={initial.summary ?? ""}
          rows={3}
          className={`${inputBase} resize-none`}
          placeholder="মডিউলের ১-২ বাক্যের সারসংক্ষেপ..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Learning outcomes (one per line)</Label>
          <textarea
            name="learning_outcomes"
            defaultValue={(initial.learning_outcomes ?? []).join("\n")}
            rows={5}
            className={`${inputBase} resize-none font-mono text-xs`}
            placeholder={"শেষ যামানার ফিতনা চিনতে পারা\nদ্বীনের শাশ্বত আহবান উপলব্ধি"}
          />
        </div>
        <div>
          <Label>Topics (one per line)</Label>
          <textarea
            name="topics"
            defaultValue={(initial.topics ?? []).join("\n")}
            rows={5}
            className={`${inputBase} resize-none font-mono text-xs`}
            placeholder={"ফিতনার পরিচয়\nদ্বীনের আহবান"}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={initial.is_published ?? true}
          className="rounded border-slate-300"
        />
        <span className="text-slate-700">প্রকাশিত করুন (পাবলিক /courses/ পেজে দেখাবে)</span>
      </label>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <a
          href="/admin/courses/"
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-bold"
        >
          বাতিল
        </a>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-bold disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {pending ? "সংরক্ষণ হচ্ছে..." : mode === "create" ? "তৈরি করুন" : "আপডেট করুন"}
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
  children,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  mono?: boolean;
  children?: React.ReactNode;
}) {
  if (children) {
    return (
      <div>
        <Label>{label}</Label>
        {children}
      </div>
    );
  }
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
