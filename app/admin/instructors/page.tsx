import type { Metadata } from "next";
import { Plus, Mail, Phone, BookOpen, Star, MoreHorizontal } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · Instructors",
  alternates: { canonical: "/sajdah-academy/admin/instructors/" },
  robots: { index: false, follow: false },
};

const instructors = [
  {
    name: "মাওলানা আবদুল্লাহ মাহমুদ",
    nameEn: "Mawlana Abdullah Mahmud",
    role: "ফিকহ ও আক্বীদা প্রধান",
    bio: "আল-আজহার গ্র্যাজুয়েট · ১৫ বছর শিক্ষাদানের অভিজ্ঞতা · 'ফিকহুল ইবাদাত' গ্রন্থের লেখক",
    modules: ["Iman & Aqidah", "Fa-Firru Ilallah"],
    students: 38,
    rating: 4.9,
    classes: 24,
    phone: "+880 17 2200 1100",
    email: "abdullah@sajdah.org",
    status: "active",
  },
  {
    name: "মুফতি জাকারিয়া হোসাইন",
    nameEn: "Mufti Zakaria Hossain",
    role: "হাদীস ও তাফসীর বিভাগ",
    bio: "দারুল উলূম দেওবন্দ · ১২ বছর হাদীস শিক্ষাদান · ৬ ভাষায় সাবলীল",
    modules: ["Hadith e Mubarakah", "Fiqh-1", "Fiqh-2"],
    students: 38,
    rating: 4.8,
    classes: 36,
    phone: "+880 17 5544 3322",
    email: "zakaria@sajdah.org",
    status: "active",
  },
  {
    name: "ড. ইমরান হাসান",
    nameEn: "Dr. Imran Hasan",
    role: "তাযকিয়া ও আত্মশুদ্ধি",
    bio: "ইসলামী আধ্যাত্মিকতার উপর PhD · 'আত্মশুদ্ধির মনস্তত্ত্ব' গ্রন্থের লেখক · মেডিকেল কাউন্সেলর",
    modules: ["Tazkiya", "Tawba & Istegfar"],
    students: 38,
    rating: 5.0,
    classes: 12,
    phone: "+880 18 7766 5544",
    email: "imran@sajdah.org",
    status: "active",
  },
  {
    name: "ক্বারী হাফিজ ইউসুফ",
    nameEn: "Qari Hafiz Yusuf",
    role: "তিলাওয়াত ও তাজবীদ",
    bio: "মিশরীয় ক্বিরাত পদ্ধতির ৭ ক্বারীতে দক্ষ · বিশ্ব ক্বিরাত প্রতিযোগিতায় তৃতীয়",
    modules: ["Quranul Kareem"],
    students: 38,
    rating: 4.9,
    classes: 16,
    phone: "+880 19 8800 9911",
    email: "yusuf@sajdah.org",
    status: "active",
  },
  {
    name: "মাওলানা সাজিদ আনোয়ার",
    nameEn: "Mawlana Sajid Anwar",
    role: "সিরাহ ও ইতিহাস",
    bio: "মদীনা ইসলামিক ইউনিভার্সিটি · সিরাহ গবেষক · 'উসওয়াতুন হাসানাহ' কোর্স ডিজাইনার",
    modules: ["Serratul Anbiya", "Usuwatun Hasanah"],
    students: 38,
    rating: 4.7,
    classes: 18,
    phone: "+880 17 1199 8877",
    email: "sajid@sajdah.org",
    status: "guest",
  },
];

const statusBadge: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  guest: "bg-amber-100 text-amber-700",
};
const statusLabel: Record<string, string> = {
  active: "নিয়মিত",
  guest: "অতিথি",
};

export default function AdminInstructorsPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-emerald-950">৫ জন শিক্ষক</h2>
          <p className="text-xs text-slate-500 mt-0.5">৪ নিয়মিত · ১ অতিথি · গড় রেটিং ৪.৮৬/৫</p>
        </div>
        <button type="button" className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold">
          <Plus className="w-3.5 h-3.5" /> নতুন শিক্ষক
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {instructors.map((t) => (
          <article key={t.email} className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center font-bold shrink-0">
                {t.nameEn.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-emerald-950 leading-tight">{t.name}</h3>
                    <p className="text-[11px] text-slate-500">{t.nameEn}</p>
                    <p className="text-xs font-bold text-amber-600 mt-1">{t.role}</p>
                  </div>
                  <div className="flex items-start gap-1 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[t.status]}`}>
                      {statusLabel[t.status]}
                    </span>
                    <button type="button" className="p-1 text-slate-400 hover:text-slate-700">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mt-2">{t.bio}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <Mini icon={<BookOpen className="w-3 h-3" />} label="মডিউল" value={t.modules.length.toString()} />
              <Mini icon={<Star className="w-3 h-3" />} label="রেটিং" value={t.rating.toFixed(1)} />
              <Mini icon={<Plus className="w-3 h-3" />} label="ক্লাস" value={t.classes.toString()} />
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {t.modules.map((m) => (
                <span key={m} className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded">
                  {m}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3 h-3" /> {t.email}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Phone className="w-3 h-3" /> {t.phone}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Mini({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="border border-slate-200 rounded-lg px-2 py-1.5 text-center">
      <div className="text-emerald-700 inline-flex items-center justify-center">{icon}</div>
      <div className="text-sm font-bold text-emerald-950 mt-0.5">{value}</div>
      <div className="text-[9px] text-slate-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}
