"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import { saveProfile } from "../actions";

type Initial = {
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  date_of_birth: string;
  father_name: string;
  address: string;
  emergency_name: string;
  emergency_phone: string;
};

const inputBase =
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm";

export default function ProfileForm({ initial }: { initial: Initial }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setDone(false);
    const result = await saveProfile(formData);
    setPending(false);
    if ("error" in result) {
      setError(result.error);
    } else {
      setDone(true);
      setTimeout(() => setDone(false), 4000);
    }
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <FormSection title="ব্যক্তিগত তথ্য · Personal Info">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="পূর্ণ নাম" name="full_name" defaultValue={initial.full_name} required />
          <Field label="পিতার নাম" name="father_name" defaultValue={initial.father_name} />
          <Field label="জন্মতারিখ" name="date_of_birth" type="date" defaultValue={initial.date_of_birth} />
          <Field label="শহর" name="city" defaultValue={initial.city} />
        </div>
      </FormSection>

      <FormSection title="যোগাযোগ · Contact">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="ইমেইল (পরিবর্তনযোগ্য নয়)"
            name="email"
            type="email"
            defaultValue={initial.email}
            disabled
          />
          <Field label="মোবাইল" name="phone" type="tel" defaultValue={initial.phone} />
          <Field label="WhatsApp" name="whatsapp" type="tel" defaultValue={initial.whatsapp} />
        </div>
        <div className="mt-4">
          <label htmlFor="address" className="block text-xs font-medium text-slate-700 mb-1.5">
            পূর্ণ ঠিকানা
          </label>
          <textarea
            id="address"
            name="address"
            defaultValue={initial.address}
            rows={2}
            className={`${inputBase} resize-none`}
          />
        </div>
      </FormSection>

      <FormSection title="জরুরি যোগাযোগ · Emergency Contact">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="নাম" name="emergency_name" defaultValue={initial.emergency_name} />
          <Field
            label="ফোন"
            name="emergency_phone"
            type="tel"
            defaultValue={initial.emergency_phone}
          />
        </div>
      </FormSection>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {done && (
        <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>প্রোফাইল সংরক্ষণ হয়েছে।</span>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-bold disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          {pending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ"}
        </button>
      </div>
    </form>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <h3 className="font-bold text-emerald-950 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  disabled,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const id = `pf-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        className={`${inputBase} ${disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}
