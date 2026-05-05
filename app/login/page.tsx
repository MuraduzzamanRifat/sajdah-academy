import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { safeNext } from "../../lib/safe-redirect";
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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect(safeNext(sp.next));
  }

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
