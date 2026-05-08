import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Mail, BookOpen } from "lucide-react";
import { createClient } from "../../../lib/supabase/server";
import { initials } from "../../../lib/initials";
import { getSettingsByPrefix, pick } from "../../../lib/settings";

const title = "Faculty — শিক্ষকমণ্ডলী";
const description =
  "Sajdah Academy-এর মেন্টর ও শিক্ষকদের সাথে পরিচিত হোন। দেশের সম্মানিত আলেম, পেশাদার ও মেন্টরগণ।";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/faculty/" },
};

export const revalidate = 300;

type InstructorRow = {
  id: string;
  name: string;
  name_bn: string | null;
  role_label: string | null;
  bio: string | null;
  is_guest: boolean;
};

export default async function FacultyPage() {
  const supabase = await createClient();
  const [{ data }, settings] = await Promise.all([
    supabase
      .from("instructors")
      .select("id, name, name_bn, role_label, bio, is_guest")
      .order("is_guest", { ascending: true })
      .order("name", { ascending: true }),
    getSettingsByPrefix("faculty."),
  ]);

  const mentors = (data ?? []) as InstructorRow[];
  const eyebrow = pick(settings, "faculty.eyebrow", "Faculty · শিক্ষকমণ্ডলী");
  const titleBn = pick(settings, "faculty.title_bn", "যাদের কাছে শিখবেন");
  const subtitleBn = pick(
    settings,
    "faculty.subtitle_bn",
    "শাস্ত্রীয় গভীরতা, পেশাদার অভিজ্ঞতা, ও আধুনিক বাস্তবতার সমন্বয় — দেশের সম্মানিত আলেম, মুফতি, একাডেমিক ও মেন্টরদের একটি দল।"
  );
  const ctaTitle = pick(settings, "faculty.cta_title_bn", "একজন মেন্টরের সাথে কথা বলতে চান?");
  const ctaBody = pick(
    settings,
    "faculty.cta_body_bn",
    "ভর্তির আগে প্রশ্ন আছে? আমরা ১৫ মিনিটের একটি কাউন্সেলিং কল-এর ব্যবস্থা করতে পারি।"
  );
  const ctaButton = pick(settings, "faculty.cta_button_bn", "Contact Us");

  return (
    <main className="pt-24 pb-24">
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-dark" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block text-amber-400 font-bold tracking-widest uppercase text-sm mb-4">
            {eyebrow}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{titleBn}</h1>
          <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto">{subtitleBn}</p>
        </div>
      </section>

      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div aria-hidden className="ambient-orbs orbs-light" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {mentors.length === 0 ? (
            <p className="text-center text-slate-500 py-16">শিক্ষকদের বিস্তারিত শীঘ্রই আসছে।</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((m) => {
                const display = m.name_bn || m.name;
                return (
                  <article key={m.id} className="glass-light glass-light-hover rounded-3xl p-7">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white flex items-center justify-center font-bold text-xl shrink-0">
                        {initials(display)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-emerald-950 leading-tight">{display}</h3>
                        {m.role_label && <p className="text-sm text-amber-600 font-medium mt-0.5">{m.role_label}</p>}
                        {m.is_guest && (
                          <span className="inline-block mt-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                            অতিথি শিক্ষক
                          </span>
                        )}
                      </div>
                    </div>
                    {m.bio && (
                      <div className="flex items-start gap-2 pt-4 border-t border-slate-200/60">
                        <GraduationCap className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <p className="text-sm text-slate-700 leading-relaxed">{m.bio}</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-emerald-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <BookOpen className="w-14 h-14 text-emerald-600 mx-auto mb-5" />
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-4">{ctaTitle}</h2>
          <p className="text-slate-600 mb-7 text-lg">{ctaBody}</p>
          <Link
            href="/contact/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-all duration-200 active:scale-[0.98]"
          >
            <Mail className="w-5 h-5" />
            {ctaButton}
          </Link>
        </div>
      </section>
    </main>
  );
}
