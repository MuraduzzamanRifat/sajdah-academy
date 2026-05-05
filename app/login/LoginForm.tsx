"use client";

import { useActionState, useState } from "react";
import { Mail, Lock, User as UserIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { signIn, signUp, type AuthState } from "./actions";

export default function LoginForm({
  initialMode,
  next,
}: {
  initialMode: "signin" | "signup";
  next?: string;
}) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const action = mode === "signin" ? signIn : signUp;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, null);

  return (
    <>
      <div className="flex border-b border-slate-200 -mx-6 -mt-6 mb-6">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`flex-1 px-4 py-3 text-sm font-bold transition-colors ${
            mode === "signin"
              ? "text-emerald-700 border-b-2 border-emerald-700"
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
              ? "text-emerald-700 border-b-2 border-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          নতুন অ্যাকাউন্ট
        </button>
      </div>

      <h1 className="text-xl font-bold text-emerald-950 mb-1">
        {mode === "signin" ? "স্বাগতম" : "অ্যাকাউন্ট তৈরি করুন"}
      </h1>
      <p className="text-xs text-slate-500 mb-5">
        {mode === "signin"
          ? "আপনার ছাত্র পোর্টালে প্রবেশ করুন।"
          : "ভর্তির পর এই অ্যাকাউন্ট দিয়ে পোর্টাল ব্যবহার করুন।"}
      </p>

      <form action={formAction} className="space-y-3">
        {next && <input type="hidden" name="next" value={next} />}

        {mode === "signup" && (
          <FieldWithIcon icon={<UserIcon className="w-3.5 h-3.5" />}>
            <input
              type="text"
              name="full_name"
              placeholder="পূর্ণ নাম"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
            />
          </FieldWithIcon>
        )}

        <FieldWithIcon icon={<Mail className="w-3.5 h-3.5" />}>
          <input
            type="email"
            name="email"
            placeholder="ইমেইল ঠিকানা"
            required
            autoComplete="email"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
          />
        </FieldWithIcon>

        <FieldWithIcon icon={<Lock className="w-3.5 h-3.5" />}>
          <input
            type="password"
            name="password"
            placeholder="পাসওয়ার্ড"
            required
            minLength={mode === "signup" ? 8 : undefined}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
          />
        </FieldWithIcon>

        {state?.error && (
          <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
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

        <button
          type="submit"
          disabled={pending}
          className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending
            ? "অপেক্ষা করুন..."
            : mode === "signin"
            ? "সাইন ইন"
            : "অ্যাকাউন্ট তৈরি করুন"}
        </button>
      </form>

      {mode === "signin" && (
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

function FieldWithIcon({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      {children}
    </div>
  );
}
