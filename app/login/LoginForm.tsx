"use client";

import { useActionState, useState } from "react";
import { Mail, Lock, User as UserIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { signIn, signUp, type AuthState } from "./actions";

type Theme = "light" | "dark";

export default function LoginForm({
  initialMode,
  next,
  theme = "light",
  hideSignup = false,
}: {
  initialMode: "signin" | "signup";
  next?: string;
  theme?: Theme;
  hideSignup?: boolean;
}) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const action = mode === "signin" ? signIn : signUp;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, null);
  const dark = theme === "dark";

  const inputCls = dark
    ? "w-full pl-9 pr-3 py-2.5 rounded-lg bg-emerald-950/60 border border-emerald-700 text-white placeholder:text-emerald-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm"
    : "w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm";

  const submitBtnCls = dark
    ? "w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
    : "w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <>
      {!hideSignup && (
        <div className={`flex border-b -mx-6 -mt-6 mb-6 ${dark ? "border-emerald-800" : "border-slate-200"}`}>
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 px-4 py-3 text-sm font-bold transition-colors ${
              mode === "signin"
                ? dark
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-emerald-700 border-b-2 border-emerald-700"
                : dark
                ? "text-emerald-300 hover:text-white"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            সাইন ইন
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 px-4 py-3 text-sm font-bold transition-colors ${
              mode === "signup"
                ? dark
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-emerald-700 border-b-2 border-emerald-700"
                : dark
                ? "text-emerald-300 hover:text-white"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            নতুন অ্যাকাউন্ট
          </button>
        </div>
      )}

      <h1 className={`text-xl font-bold mb-1 ${dark ? "text-white" : "text-emerald-950"}`}>
        {mode === "signin" ? (dark ? "Authorized Sign-In" : "স্বাগতম") : "অ্যাকাউন্ট তৈরি করুন"}
      </h1>
      <p className={`text-xs mb-5 ${dark ? "text-emerald-300" : "text-slate-500"}`}>
        {mode === "signin"
          ? dark
            ? "আপনার অ্যাডমিন ক্রেডেনশিয়াল দিয়ে প্রবেশ করুন।"
            : "আপনার ছাত্র পোর্টালে প্রবেশ করুন।"
          : "ভর্তির পর এই অ্যাকাউন্ট দিয়ে পোর্টাল ব্যবহার করুন।"}
      </p>

      <form action={formAction} className="space-y-3">
        {next && <input type="hidden" name="next" value={next} />}

        {mode === "signup" && !hideSignup && (
          <FieldWithIcon icon={<UserIcon className="w-3.5 h-3.5" />} dark={dark}>
            <input
              type="text"
              name="full_name"
              placeholder="পূর্ণ নাম"
              required
              className={inputCls}
            />
          </FieldWithIcon>
        )}

        <FieldWithIcon icon={<Mail className="w-3.5 h-3.5" />} dark={dark}>
          <input
            type="email"
            name="email"
            placeholder="ইমেইল ঠিকানা"
            required
            autoComplete="email"
            className={inputCls}
          />
        </FieldWithIcon>

        <FieldWithIcon icon={<Lock className="w-3.5 h-3.5" />} dark={dark}>
          <input
            type="password"
            name="password"
            placeholder="পাসওয়ার্ড"
            required
            minLength={mode === "signup" ? 8 : undefined}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className={inputCls}
          />
        </FieldWithIcon>

        {state?.error && (
          <div
            className={`flex items-start gap-2 p-3 rounded-lg text-xs ${
              dark
                ? "bg-rose-900/40 border border-rose-700 text-rose-200"
                : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
          >
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

        <button type="submit" disabled={pending} className={submitBtnCls}>
          {pending
            ? "যাচাই হচ্ছে..."
            : mode === "signin"
            ? dark
              ? "Verify & Enter →"
              : "সাইন ইন"
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
  children,
  dark,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="relative">
      <span
        className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? "text-amber-400/70" : "text-slate-400"}`}
      >
        {icon}
      </span>
      {children}
    </div>
  );
}
