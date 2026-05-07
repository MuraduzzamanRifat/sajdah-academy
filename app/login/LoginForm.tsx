"use client";

import { useActionState, useState } from "react";
import { Mail, Lock, User as UserIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { signIn, signUp, type AuthState } from "./actions";

/* Theme classes hoisted out of the JSX so the markup reads top-to-
   bottom. Add a third theme by adding a third object — no nested
   ternaries to chase. */
const LIGHT = {
  input:
    "w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm",
  submit:
    "w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed",
  heading: "text-emerald-950",
  subtitle: "text-slate-500",
  divider: "border-slate-200",
  tabActive: "text-emerald-700 border-b-2 border-emerald-700",
  tabIdle: "text-slate-500 hover:text-slate-900",
  fieldIcon: "text-slate-400",
  errorBox: "bg-rose-50 border border-rose-200 text-rose-800",
  signinHeading: "স্বাগতম",
  signinSubtitle: "আপনার ছাত্র পোর্টালে প্রবেশ করুন।",
  submitLabel: "সাইন ইন",
} as const;

const DARK = {
  input:
    "w-full pl-9 pr-3 py-2.5 rounded-lg bg-emerald-950/60 border border-emerald-700 text-white placeholder:text-emerald-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm",
  submit:
    "w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed",
  heading: "text-white",
  subtitle: "text-emerald-300",
  divider: "border-emerald-800",
  tabActive: "text-amber-400 border-b-2 border-amber-400",
  tabIdle: "text-emerald-300 hover:text-white",
  fieldIcon: "text-amber-400/70",
  errorBox: "bg-rose-900/40 border border-rose-700 text-rose-200",
  signinHeading: "Authorized Sign-In",
  signinSubtitle: "আপনার অ্যাডমিন ক্রেডেনশিয়াল দিয়ে প্রবেশ করুন।",
  submitLabel: "Verify & Enter →",
} as const;

export default function LoginForm({
  initialMode,
  next,
  dark = false,
  hideSignup = false,
}: {
  initialMode: "signin" | "signup";
  next?: string;
  dark?: boolean;
  hideSignup?: boolean;
}) {
  const t = dark ? DARK : LIGHT;

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const action = mode === "signin" ? signIn : signUp;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, null);

  return (
    <>
      {!hideSignup && (
        <div className={`flex border-b -mx-6 -mt-6 mb-6 ${t.divider}`}>
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 px-4 py-3 text-sm font-bold transition-colors ${
              mode === "signin" ? t.tabActive : t.tabIdle
            }`}
          >
            সাইন ইন
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 px-4 py-3 text-sm font-bold transition-colors ${
              mode === "signup" ? t.tabActive : t.tabIdle
            }`}
          >
            নতুন অ্যাকাউন্ট
          </button>
        </div>
      )}

      <h1 className={`text-xl font-bold mb-1 ${t.heading}`}>
        {mode === "signin" ? t.signinHeading : "অ্যাকাউন্ট তৈরি করুন"}
      </h1>
      <p className={`text-xs mb-5 ${t.subtitle}`}>
        {mode === "signin" ? t.signinSubtitle : "ভর্তির পর এই অ্যাকাউন্ট দিয়ে পোর্টাল ব্যবহার করুন।"}
      </p>

      <form action={formAction} className="space-y-3">
        {next && <input type="hidden" name="next" value={next} />}

        {mode === "signup" && !hideSignup && (
          <FieldWithIcon icon={<UserIcon className="w-3.5 h-3.5" />} iconColor={t.fieldIcon}>
            <input type="text" name="full_name" placeholder="পূর্ণ নাম" required className={t.input} />
          </FieldWithIcon>
        )}

        <FieldWithIcon icon={<Mail className="w-3.5 h-3.5" />} iconColor={t.fieldIcon}>
          <input
            type="email"
            name="email"
            placeholder="ইমেইল ঠিকানা"
            required
            autoComplete="email"
            className={t.input}
          />
        </FieldWithIcon>

        <FieldWithIcon icon={<Lock className="w-3.5 h-3.5" />} iconColor={t.fieldIcon}>
          <input
            type="password"
            name="password"
            placeholder="পাসওয়ার্ড"
            required
            minLength={mode === "signup" ? 8 : undefined}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className={t.input}
          />
        </FieldWithIcon>

        {state?.error && (
          <div className={`flex items-start gap-2 p-3 rounded-lg text-xs ${t.errorBox}`}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        {state?.ok && mode === "signup" && (
          <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              অ্যাকাউন্ট তৈরি হয়েছে! আপনার ইমেইলে যাচাইকরণ লিংক পাঠানো হয়েছে।
              ভেরিফাই করার পর সাইন ইন করুন।
            </span>
          </div>
        )}

        <button type="submit" disabled={pending} className={t.submit}>
          {pending
            ? "যাচাই হচ্ছে..."
            : mode === "signin"
            ? t.submitLabel
            : "অ্যাকাউন্ট তৈরি করুন"}
        </button>
      </form>

      {mode === "signin" && !hideSignup && (
        <p className="text-xs text-slate-500 text-center mt-4">
          ভর্তি হননি এখনো?{" "}
          <a href="/enroll/" className="text-emerald-700 font-bold hover:text-emerald-900">
            ভর্তির আবেদন
          </a>
        </p>
      )}
    </>
  );
}

function FieldWithIcon({
  icon,
  iconColor,
  children,
}: {
  icon: React.ReactNode;
  iconColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor}`}>{icon}</span>
      {children}
    </div>
  );
}
