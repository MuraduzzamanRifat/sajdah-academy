import type { Metadata } from "next";
import { Upload, CheckCircle2, Clock, FileText } from "lucide-react";
import ComingSoon from "../../admin/_components/ComingSoon";

export const metadata: Metadata = {
  title: "Assignments — অ্যাসাইনমেন্ট",
  alternates: { canonical: "/student-dashboard/assignments/" },
  robots: { index: false, follow: false },
};

const assignments = [
  {
    title: "২০ হাদীস মুখস্থ — পরীক্ষা",
    course: "Hadith e Mubarakah",
    due: "৭ মে ২০২৬, ৬:০০ PM",
    status: "pending",
    description: "নির্ধারিত ২০টি হাদীস মুখস্থ করে অডিও রেকর্ডিং জমা দিন।",
    type: "Audio submission",
  },
  {
    title: "সিরাহ — মাক্কী জীবন রিফ্লেকশন",
    course: "Usuwatun Hasanah",
    due: "৮ মে ২০২৬, ১১:৫৯ PM",
    status: "draft",
    description: "৮০০-১০০০ শব্দের রিফ্লেকশন এসে — ব্যক্তিগত জীবনে সিরাতের প্রয়োগ।",
    type: "Essay · 800-1000 words",
  },
  {
    title: "ফিকহ-২ — ইবাদাত মূল্যায়ন কুইজ",
    course: "Fiqh-2 (Ibadat)",
    due: "১০ মে ২০২৬, ৮:০০ PM",
    status: "pending",
    description: "৩০ MCQ + ১০ সংক্ষিপ্ত উত্তর। সময়: ৬০ মিনিট।",
    type: "Online quiz",
  },
  {
    title: "Aqeedah — Mid-evaluation",
    course: "Iman & Aqidah",
    due: "১৫ এপ্রিল ২০২৬",
    status: "submitted",
    submitted: "১৪ এপ্রিল ২০২৬",
    grade: "A · ৯৪%",
    description: "মূল্যায়ন পরীক্ষা সম্পন্ন।",
    type: "Online exam",
  },
  {
    title: "Quranul Kareem — Tilawah Audio",
    course: "Quranul Kareem",
    due: "২০ মার্চ ২০২৬",
    status: "submitted",
    submitted: "১৯ মার্চ ২০২৬",
    grade: "A- · ৮৯%",
    description: "সূরা ইয়াসিন তিলাওয়াত — মেন্টরের ফিডব্যাক প্রাপ্ত।",
    type: "Audio submission",
  },
];

const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  pending: { color: "bg-amber-100 text-amber-700", label: "জমা দিতে হবে", icon: <Clock className="w-4 h-4" /> },
  draft: { color: "bg-blue-100 text-blue-700", label: "খসড়া সংরক্ষিত", icon: <FileText className="w-4 h-4" /> },
  submitted: { color: "bg-emerald-100 text-emerald-700", label: "জমা দেওয়া হয়েছে", icon: <CheckCircle2 className="w-4 h-4" /> },
};

export default function AssignmentsPage() {
  return (
    <div className="space-y-3">
        <ComingSoon body="অ্যাসাইনমেন্ট submit/grade এখনো আসেনি।" />
        {assignments.map((a, i) => {
          const cfg = statusConfig[a.status];
          return (
    <article key={i} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">{a.course}</p>
                      <h4 className="font-bold text-emerald-950 leading-snug mt-0.5">{a.title}</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">{a.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>{a.type}</span>
                    <span>·</span>
                    <span>Due: {a.due}</span>
                    {a.submitted && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-700">Submitted: {a.submitted}</span>
                      </>
                    )}
                    {a.grade && (
                      <>
                        <span>·</span>
                        <span className="font-bold text-emerald-700">{a.grade}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2">
                    {a.status === "submitted" ? (
                      <button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-900">
                        View submission →
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg"
                      >
                        <Upload className="w-3 h-3" /> {a.status === "draft" ? "Continue draft" : "Submit"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
    </div>
  );
}
