/* Inline admin login. Rendered by app/admin/layout.tsx when there's no
   authenticated session. Same dark, restricted-access aesthetic as the
   /login page on the api host, but without changing the URL — so the
   user types https://api.sijdahacademy.com/admin and sees the login
   form right there, then after auth the same URL renders the dashboard. */
import { ShieldCheck, Lock } from "lucide-react";
import LoginForm from "../../login/LoginForm";
import MedallionMark from "../../components/MedallionMark";

export default function AdminLoginPanel({ next }: { next?: string }) {
  return (
    <main className="min-h-screen bg-emerald-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(245,158,11,0.12),_transparent_55%)]"
      />
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
          <LoginForm initialMode="signin" next={next} theme="dark" hideSignup />
        </div>

        <div className="mt-6 space-y-2 text-center">
          <p className="text-[11px] text-emerald-400/70 leading-relaxed max-w-sm mx-auto">
            এই প্যানেল কেবল অনুমোদিত কর্মীদের জন্য। অননুমোদিত প্রবেশের চেষ্টা লগ করা হয়।
          </p>
          <p className="text-[11px] text-emerald-500">
            ছাত্র লগইন →{" "}
            <a
              href="https://sijdahacademy.com/login/"
              className="text-amber-400 hover:text-amber-300 font-bold underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950 rounded"
            >
              sijdahacademy.com/login
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
