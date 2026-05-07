"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { submitContactMessage } from "../(marketing)/contact/actions";

/* Server-action driven contact form. Replaces the prior mailto-fallback
   approach which had no validation, no spam protection, and lied about
   success when the user's mail client failed to open. */

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setStatus("submitting");
    setError(null);
    const result = await submitContactMessage(formData);
    if ("error" in result) {
      setStatus("error");
      setError(result.error);
    } else {
      setStatus("success");
    }
  }

  if (status === "success") {
    return (
      <div className="glass-light rounded-2xl p-8 text-center">
        <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-emerald-950 mb-2">বার্তা পাঠানো হয়েছে!</h3>
        <p className="text-slate-600 mb-6">আমরা ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করব।</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setError(null);
          }}
          className="px-6 py-2 border border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50 font-medium cursor-pointer"
        >
          আরেকটি বার্তা
        </button>
      </div>
    );
  }

  const inputBase =
    "w-full px-4 py-3 rounded-lg border border-slate-200 bg-white/80 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all";

  return (
    <form action={onSubmit} className="glass-light rounded-2xl p-6 sm:p-8 space-y-5">
      {/* Honeypot — visually hidden, real users leave blank. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px]"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className="block text-sm font-medium text-slate-700 mb-2">
            আপনার নাম *
          </label>
          <input
            id="cf-name"
            name="name"
            required
            maxLength={100}
            className={inputBase}
            placeholder="আপনার পূর্ণ নাম"
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className="block text-sm font-medium text-slate-700 mb-2">
            ফোন
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            maxLength={30}
            className={inputBase}
            placeholder="01XXXXXXXXX"
          />
        </div>
      </div>
      <div>
        <label htmlFor="cf-email" className="block text-sm font-medium text-slate-700 mb-2">
          ইমেইল *
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          required
          maxLength={100}
          className={inputBase}
          placeholder="example@email.com"
        />
      </div>
      <div>
        <label htmlFor="cf-subject" className="block text-sm font-medium text-slate-700 mb-2">
          বিষয়
        </label>
        <select id="cf-subject" name="subject" className={inputBase} defaultValue="">
          <option value="">নির্বাচন করুন</option>
          <option>ভর্তি সংক্রান্ত প্রশ্ন</option>
          <option>কোর্স ফি ও পেমেন্ট</option>
          <option>রুটিন ও সময়সূচী</option>
          <option>মেন্টর কাউন্সেলিং</option>
          <option>সাধারণ অনুসন্ধান</option>
          <option>অন্যান্য</option>
        </select>
      </div>
      <div>
        <label htmlFor="cf-msg" className="block text-sm font-medium text-slate-700 mb-2">
          বার্তা *
        </label>
        <textarea
          id="cf-msg"
          name="message"
          required
          rows={5}
          maxLength={2000}
          className={`${inputBase} resize-y`}
          placeholder="আপনার বার্তা লিখুন..."
        />
      </div>

      {status === "error" && error && (
        <div role="alert" className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-lg transition-all duration-200 text-lg cursor-pointer active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/60 disabled:opacity-60 disabled:cursor-wait"
      >
        {status === "submitting" ? (
          "পাঠানো হচ্ছে..."
        ) : (
          <>
            <Send className="w-5 h-5" />
            বার্তা পাঠান
          </>
        )}
      </button>
    </form>
  );
}
