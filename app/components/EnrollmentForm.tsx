"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowLeft, ArrowRight, User, GraduationCap, Calendar, FileCheck } from "lucide-react";

/* Multi-step enrollment.
   Step 1: Personal info
   Step 2: Background
   Step 3: Batch / Program selection
   Step 4: Review & submit
   On submit: POST to NEXT_PUBLIC_ENROLL_ENDPOINT (Formspree-compatible).
   If endpoint is empty (first deploy), fall back to mailto: with the
   payload as the body — never blocks the user, never shows "submission failed". */

const ENDPOINT = process.env.NEXT_PUBLIC_ENROLL_ENDPOINT || "";
const FALLBACK_EMAIL = "sijdah.academybd@gmail.com";

type FormState = {
  fullName: string;
  fatherName: string;
  age: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  occupation: string;
  educationLevel: string;
  islamicBackground: string;
  motivation: string;
  program: string;
  batch: string;
  paymentPlan: string;
  hearAbout: string;
  agree: boolean;
};

const empty: FormState = {
  fullName: "",
  fatherName: "",
  age: "",
  phone: "",
  whatsapp: "",
  email: "",
  city: "",
  occupation: "",
  educationLevel: "",
  islamicBackground: "",
  motivation: "",
  program: "Full 6-Month Program",
  batch: "গাজীপুর রিসোর্ট ব্যাচ — মে ২০২৬",
  paymentPlan: "Full payment",
  hearAbout: "",
  agree: false,
};

const steps = [
  { id: 1, label: "Personal", labelBn: "ব্যক্তিগত", icon: User },
  { id: 2, label: "Background", labelBn: "পটভূমি", icon: GraduationCap },
  { id: 3, label: "Program", labelBn: "প্রোগ্রাম", icon: Calendar },
  { id: 4, label: "Review", labelBn: "যাচাই", icon: FileCheck },
];

const programs = ["Basic Course-1", "Foundation Program", "Full 6-Month Program"];
const batches = [
  "গাজীপুর রিসোর্ট ব্যাচ — মে ২০২৬",
  "সিলেট ইকো-রিসোর্ট ব্যাচ — জুন ২০২৬",
  "কক্সবাজার সি-ভিউ ব্যাচ — জুলাই ২০২৬",
  "Waitlist — পরবর্তী ব্যাচের জন্য",
];

const inputBase =
  "w-full px-4 py-3 rounded-lg border border-slate-200 bg-white/80 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all";

export default function EnrollmentForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const next = () => setStep((s) => Math.min(4, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    setSubmitting(true);
    const ref = `SA-${Date.now().toString(36).toUpperCase()}`;
    setReference(ref);
    const payload = { ...form, reference: ref, submittedAt: new Date().toISOString() };

    if (ENDPOINT) {
      try {
        await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        /* still show success — they have ref number; we'll reconcile manually */
      }
    } else {
      // Fallback: open mail client with full application as body
      const body = Object.entries(payload)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(
        `Sajdah Academy enrollment — ${form.fullName} [${ref}]`
      )}&body=${encodeURIComponent(body)}`;
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  // ---------- Success screen ----------
  if (submitted) {
    return (
      <div className="glass-light rounded-3xl p-8 sm:p-10 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-emerald-950 mb-3">আবেদন গৃহীত হয়েছে</h2>
        <p className="text-slate-600 mb-2">
          জাযাকাল্লাহু খাইরান, <span className="font-bold text-emerald-700">{form.fullName}</span>
        </p>
        <p className="text-slate-600 mb-6">আমাদের টিম ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে।</p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8">
          <p className="text-xs text-emerald-700 uppercase font-bold tracking-wider mb-1">
            Reference Number
          </p>
          <p className="text-2xl font-bold text-emerald-950 font-mono">{reference}</p>
          <p className="text-sm text-slate-600 mt-2">
            যোগাযোগের সময় এই রেফারেন্স নাম্বারটি উল্লেখ করুন।
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://wa.me/880180556544"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg active:scale-[0.98]"
          >
            WhatsApp এ যোগাযোগ
          </a>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setForm(empty);
            }}
            className="px-6 py-3 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-lg font-medium"
          >
            নতুন আবেদন
          </button>
        </div>
      </div>
    );
  }

  // ---------- Stepper UI ----------
  return (
    <div className="glass-light rounded-3xl overflow-hidden">
      {/* Progress rail */}
      <div className="flex border-b border-slate-200/60">
        {steps.map((s, i) => {
          const reached = step >= s.id;
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className={`flex-1 py-4 px-2 sm:px-3 text-center border-b-2 transition-colors ${
                reached
                  ? "bg-emerald-50 text-emerald-700 border-emerald-500"
                  : "text-slate-400 border-transparent"
              }`}
            >
              <Icon className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs font-bold hidden sm:block">{s.label}</div>
              <div className="text-[10px] text-slate-500 hidden sm:block">{s.labelBn}</div>
              <div className="sm:hidden text-[10px] font-bold">
                {i + 1}/{steps.length}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key={1}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <h3 className="text-xl font-bold text-emerald-950 mb-1">ব্যক্তিগত তথ্য</h3>
              <p className="text-sm text-slate-500 mb-6">যোগাযোগ ও পরিচিতির জন্য</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field id="fullName" label="পূর্ণ নাম *" value={form.fullName} onChange={(v) => update("fullName", v)} required />
                <Field id="fatherName" label="পিতার নাম" value={form.fatherName} onChange={(v) => update("fatherName", v)} />
                <Field id="age" label="বয়স *" type="number" value={form.age} onChange={(v) => update("age", v)} required />
                <Field id="city" label="বর্তমান শহর *" value={form.city} onChange={(v) => update("city", v)} required />
                <Field id="phone" label="মোবাইল নম্বর *" type="tel" value={form.phone} onChange={(v) => update("phone", v)} required placeholder="01XXXXXXXXX" />
                <Field id="whatsapp" label="WhatsApp (ভিন্ন হলে)" type="tel" value={form.whatsapp} onChange={(v) => update("whatsapp", v)} />
                <div className="sm:col-span-2">
                  <Field id="email" label="ইমেইল *" type="email" value={form.email} onChange={(v) => update("email", v)} required placeholder="example@email.com" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key={2}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <h3 className="text-xl font-bold text-emerald-950 mb-1">পটভূমি</h3>
              <p className="text-sm text-slate-500 mb-6">আপনাকে বুঝতে সাহায্য করার জন্য</p>
              <Field id="occupation" label="পেশা *" value={form.occupation} onChange={(v) => update("occupation", v)} required placeholder="ছাত্র / চাকরি / ব্যবসা / অন্যান্য" />
              <SelectField
                id="educationLevel"
                label="শিক্ষাগত যোগ্যতা *"
                value={form.educationLevel}
                onChange={(v) => update("educationLevel", v)}
                required
                options={["", "এসএসসি", "এইচএসসি / আলিম", "অনার্স / ফাযিল", "মাস্টার্স / কামিল", "অন্যান্য"]}
              />
              <SelectField
                id="islamicBackground"
                label="ইসলামী পড়াশোনার পটভূমি *"
                value={form.islamicBackground}
                onChange={(v) => update("islamicBackground", v)}
                required
                options={[
                  "",
                  "প্রাথমিক — মৌলিক বিষয় জানি",
                  "মাঝামাঝি — কিছু কোর্স/বই পড়েছি",
                  "উন্নত — মাদরাসা/ইসলামিক ডিগ্রি",
                  "নবাগত — সবেমাত্র শুরু করেছি",
                ]}
              />
              <div>
                <label htmlFor="motivation" className="block text-sm font-medium text-slate-700 mb-2">
                  কেন এই কোর্সে ভর্তি হতে চান? *
                </label>
                <textarea
                  id="motivation"
                  required
                  rows={4}
                  value={form.motivation}
                  onChange={(e) => update("motivation", e.target.value)}
                  className={`${inputBase} resize-y`}
                  placeholder="আপনার অনুপ্রেরণা ও প্রত্যাশা..."
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key={3}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <h3 className="text-xl font-bold text-emerald-950 mb-1">প্রোগ্রাম নির্বাচন</h3>
              <p className="text-sm text-slate-500 mb-6">আপনার পছন্দের কোর্স ও ব্যাচ</p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">প্রোগ্রাম *</label>
                <div className="space-y-2">
                  {programs.map((p) => (
                    <label
                      key={p}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        form.program === p
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-slate-200 hover:border-emerald-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="program"
                        value={p}
                        checked={form.program === p}
                        onChange={() => update("program", p)}
                        className="w-4 h-4 accent-emerald-600"
                      />
                      <span className="font-medium text-emerald-950">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
              <SelectField
                id="batch"
                label="পছন্দের ব্যাচ *"
                value={form.batch}
                onChange={(v) => update("batch", v)}
                required
                options={batches}
              />
              <SelectField
                id="paymentPlan"
                label="পেমেন্ট প্ল্যান"
                value={form.paymentPlan}
                onChange={(v) => update("paymentPlan", v)}
                options={["Full payment", "৩ কিস্তিতে (৪০/৩০/৩০)", "অন্য ব্যবস্থা প্রয়োজন"]}
              />
              <SelectField
                id="hearAbout"
                label="আপনি আমাদের সম্পর্কে কোথা থেকে জানলেন?"
                value={form.hearAbout}
                onChange={(v) => update("hearAbout", v)}
                options={["", "Facebook", "YouTube", "বন্ধু / পরিবার", "Google", "Instagram", "অন্যান্য"]}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key={4}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <h3 className="text-xl font-bold text-emerald-950 mb-1">যাচাই করুন</h3>
              <p className="text-sm text-slate-500 mb-6">তথ্য সঠিক থাকলে জমা দিন</p>
              <dl className="bg-emerald-50 rounded-xl p-5 space-y-2.5 text-sm">
                <ReviewRow label="নাম" value={form.fullName} />
                <ReviewRow label="বয়স / শহর" value={`${form.age} · ${form.city}`} />
                <ReviewRow label="ফোন / ইমেইল" value={`${form.phone} · ${form.email}`} />
                <ReviewRow label="পেশা" value={form.occupation} />
                <ReviewRow label="শিক্ষা / পটভূমি" value={`${form.educationLevel} · ${form.islamicBackground}`} />
                <ReviewRow label="প্রোগ্রাম" value={form.program} />
                <ReviewRow label="ব্যাচ" value={form.batch} />
                <ReviewRow label="পেমেন্ট" value={form.paymentPlan} />
              </dl>
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => update("agree", e.target.checked)}
                  className="mt-1 w-4 h-4 accent-emerald-600"
                />
                <span className="text-sm text-slate-700 leading-relaxed">
                  আমি{" "}
                  <a href="/sajdah-academy/privacy/" className="text-emerald-700 underline hover:text-emerald-900">
                    গোপনীয়তা নীতি
                  </a>{" "}
                  ও কোর্সের শর্তাবলীর সাথে সম্মত। জমাকৃত তথ্যের সঠিকতা নিশ্চিত করছি।
                </span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 pt-8 border-t border-slate-200/60 mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={prev}
              className="px-5 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-lg flex items-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              পেছনে
            </button>
          )}
          {step < 4 && (
            <button
              type="button"
              onClick={next}
              className="ml-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              পরবর্তী
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {step === 4 && (
            <button
              type="button"
              onClick={submit}
              disabled={!form.agree || submitting}
              className="ml-auto px-8 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg flex items-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "জমা দেওয়া হচ্ছে..." : "আবেদন জমা দিন"}
              {!submitting && <CheckCircle className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- small helpers ---- */
function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputBase}
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  required,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  options: string[];
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <select
        id={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputBase}
      >
        {options.map((o, i) => (
          <option key={i} value={o}>
            {o || "নির্বাচন করুন"}
          </option>
        ))}
      </select>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <dt className="text-slate-500 shrink-0">{label}</dt>
      <dd className="font-medium text-emerald-950 text-right break-words">{value || "—"}</dd>
    </div>
  );
}
