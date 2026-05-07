import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ShieldCheck, Lock } from "lucide-react";
import { createClient } from "../../lib/supabase/server";
import { safeNext } from "../../lib/safe-redirect";
import { isAdminRole } from "../../lib/roles";
import LoginForm from "./LoginForm";
import MedallionMark from "../components/MedallionMark";

export const metadata: Metadata = {
  title: "Login — লগইন",
  alternates: { canonical: "/login/" },
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; mode?: string }>;
}) {
  const sp = await searchParams;
  const h = await headers();
  const host = h.get("host") ?? "";
  const isAdminHost = /^api\./i.test(host);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    if (sp.next) {
      redirect(safeNext(sp.next));
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    redirect(isAdminRole(profile?.role) ? "/admin/" : "/student-dashboard/");
  }

  // Distinct dark theme + restricted-access copy on the admin host
  if (isAdminHost) {
    return (
      <main className="min-h-screen bg-emerald-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(245,158,11,0.12),_transparent_55%)]"
        />
        {/* Grid pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="w-full max-w-md relative z-10">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center overflow-hidden ring-4 ring-amber-500/20">
                <MedallionMark size={48} className="w-12 h-12" />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-950 ring-2 ring-amber-500 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mt-4 tracking-tight">Sajdah Admin</h1>
            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-300 tracking-widest uppercase">
                Restricted Access
              </span>
            </div>
          </div>

          <div className="bg-emerald-900/60 backdrop-blur-sm border border-emerald-800 rounded-2xl shadow-2xl shadow-black/30 p-6">
            <LoginForm
              initialMode="signin"
              next={sp.next}
              theme="dark"
              hideSignup
            />
          </div>

          <div className="mt-6 space-y-2 text-center">
            <p className="text-[11px] text-emerald-400/70 leading-relaxed max-w-sm mx-auto">
              এই প্যানেল কেবল অনুমোদিত কর্মীদের জন্য। অননুমোদিত প্রবেশের চেষ্টা লগ করা হয়।
            </p>
            <p className="text-[11px] text-emerald-500">
              ছাত্র লগইন →{" "}
              <a
                href="https://sijdahacademy.com/login/"
                className="text-amber-400 hover:text-amber-300 font-bold underline"
              >
                sijdahacademy.com/login
              </a>
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Public/student login — original light theme with signup tab
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center overflow-hidden">
              <MedallionMark size={36} className="w-9 h-9" />
            </div>
            <span className="text-xl font-bold text-emerald-950">Sajdah Academy</span>
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-emerald-950/5 p-6">
          <LoginForm initialMode={sp.mode === "signup" ? "signup" : "signin"} next={sp.next} />
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          সমস্যা হচ্ছে?{" "}
          <Link href="/contact/" className="text-emerald-700 font-bold hover:text-emerald-900">
            সাপোর্ট
          </Link>
        </p>
      </div>
    </main>
  );
}
