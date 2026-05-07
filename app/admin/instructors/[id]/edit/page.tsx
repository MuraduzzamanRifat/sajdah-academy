import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "../../../../../lib/supabase/server";
import InstructorForm from "../../_components/InstructorForm";

export const metadata: Metadata = {
  title: "Admin · Edit Instructor",
  alternates: { canonical: "/admin/instructors/" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function EditInstructorPage({ params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: instructor } = await supabase
    .from("instructors")
    .select("id, name, name_bn, role_label, bio, rating, is_guest")
    .eq("id", id)
    .single();

  if (!instructor) notFound();

  return (
    <div className="space-y-4 max-w-3xl">
      <Link
        href="/admin/instructors/"
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft className="w-3 h-3" /> সব শিক্ষক
      </Link>
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h1 className="text-lg font-bold text-emerald-950">সম্পাদনা: <span className="text-emerald-700">{instructor.name}</span></h1>
        <p className="text-xs text-slate-500 mb-5">পরিবর্তন সংরক্ষণের পর /faculty/ পেজে অবিলম্বে দেখাবে।</p>
        <InstructorForm initial={instructor} mode="edit" />
      </div>
    </div>
  );
}
