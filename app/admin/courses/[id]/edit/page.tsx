import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { createClient } from "../../../../../lib/supabase/server";
import CourseForm from "../../_components/CourseForm";

export const metadata: Metadata = {
  title: "Admin · Edit Course",
  alternates: { canonical: "/admin/courses/" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function EditCoursePage({ params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("id, slug, title, title_bn, phase, duration, summary, learning_outcomes, topics, module_number, display_order, is_published")
    .eq("id", id)
    .single();

  if (!course) notFound();

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link
          href="/dashboard/courses/"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700"
        >
          <ArrowLeft className="w-3 h-3" /> সব কোর্স
        </Link>
        <Link
          href={`/courses/${course.slug}/`}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900"
        >
          লাইভ পেজ দেখুন <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h1 className="text-lg font-bold text-emerald-950">
          সম্পাদনা: <span className="text-emerald-700">{course.title}</span>
        </h1>
        <p className="text-xs text-slate-500 mb-5">
          slug: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{course.slug}</code> · slug পরিবর্তন করা যাবে না (পরিবর্তনের প্রয়োজন হলে duplicate + delete করুন)
        </p>
        <CourseForm initial={course} mode="edit" />
      </div>
    </div>
  );
}
