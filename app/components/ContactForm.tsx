"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

/* Contact form. Phase 1: submits via mailto: (no backend dependency).
   Phase 2 will add a Formspree endpoint via NEXT_PUBLIC_CONTACT_ENDPOINT
   for proper async submission + spam filtering. */
const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "";
const FALLBACK_EMAIL = "sijdah.academybd@gmail.com";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    if (FORMSPREE_ENDPOINT) {
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setStatus("success");
          setForm({ name: "", email: "", phone: "", subject: "", message: "" });
          return;
        }
      } catch {
        /* fall through to mailto fallback */
      }
      setStatus("error");
      return;
    }

    // Fallback: open user's mail client with a pre-filled message
    const body =
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`;
    window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(
      form.subject || "Sajdah Academy enquiry"
    )}&body=${encodeURIComponent(body)}`;
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="glass-light rounded-2xl p-8 text-center">
        <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-emerald-950 mb-2">বার্তা পাঠানো হয়েছে!</h3>
        <p className="text-slate-600 mb-6">
          {FORMSPREE_ENDPOINT
            ? "আমরা ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করব।"
            : "আপনার ইমেইল ক্লায়েন্ট খোলা হয়েছে। বার্তাটি পাঠিয়ে দিন।"}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="px-6 py-2 border border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50 font-medium"
        >
          আরেকটি বার্তা
        </button>
      </div>
    );
  }

  const inputBase =
    "w-full px-4 py-3 rounded-lg border border-slate-200 bg-white/80 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all";

  return (
    <form onSubmit={onSubmit} className="glass-light rounded-2xl p-6 sm:p-8 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className="block text-sm font-medium text-slate-700 mb-2">
            আপনার নাম *
          </label>
          <input
            id="cf-name"
            name="name"
            required
            value={form.name}
            onChange={onChange}
            className={inputBase}
            placeholder="আপনার পূর্ণ নাম"
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className="block text-sm font-medium text-slate-700 mb-2">
            ফোন *
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={onChange}
            className={inputBase}
            placeholder="01XXXXXXXXX"
          />
        </div>
      </div>
      <div>
        <label htmlFor="cf-email" className="block text-sm font-medium text-slate-700 mb-2">ইমেইল *</label>
        <input
          id="cf-email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={onChange}
          className={inputBase}
          placeholder="example@email.com"
        />
      </div>
      <div>
        <label htmlFor="cf-subject" className="block text-sm font-medium text-slate-700 mb-2">
          বিষয়
        </label>
        <select
          id="cf-subject"
          name="subject"
          value={form.subject}
          onChange={onChange}
          className={inputBase}
        >
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
          value={form.message}
          onChange={onChange}
          className={`${inputBase} resize-y`}
          placeholder="আপনার বার্তা লিখুন..."
        />
      </div>
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
      {status === "error" && (
        <p role="alert" className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">
          সমস্যা হয়েছে — অনুগ্রহ করে আবার চেষ্টা করুন বা সরাসরি ইমেইল করুন: {FALLBACK_EMAIL}
        </p>
      )}
    </form>
  );
}
