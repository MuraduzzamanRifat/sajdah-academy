import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { getCurrentUser } from "../../../lib/auth/current-user";
import { createClient } from "../../../lib/supabase/server";
import { initials } from "../../../lib/initials";
import ProfileForm from "./_components/ProfileForm";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "My Profile — আমার প্রোফাইল",
  alternates: { canonical: "/student-dashboard/profile/" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type ProfileRow = {
  full_name: string | null;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  city: string | null;
  date_of_birth: string | null;
  status: string | null;
  student_id: string | null;
  metadata: Record<string, unknown> | null;
  batch: { name: string; phase: string | null } | null;
};

export default async function ProfilePage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login?next=/student-dashboard/profile/");

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(
      `full_name, email, phone, whatsapp, city, date_of_birth, status, student_id, metadata,
       batch:batch_id ( name, phase )`
    )
    .eq("id", me.id)
    .maybeSingle();

  const profile = (data ?? null) as ProfileRow | null;

  if (!profile) {
    /* Auth user exists but profiles row is missing — shouldn't happen
       with the handle_new_user trigger in place, but defensive UX. */
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-sm text-rose-800">
        আপনার প্রোফাইল রেকর্ড পাওয়া যায়নি। সাপোর্টে যোগাযোগ করুন।
      </div>
    );
  }

  const display = profile.full_name?.trim() || me.name || profile.email;
  const meta = (profile.metadata ?? {}) as Record<string, unknown>;

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold shrink-0">
            {initials(display)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-emerald-950">{display}</h2>
            {profile.student_id && (
              <p className="text-sm text-slate-500">Student ID: {profile.student_id}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.batch?.phase && (
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {profile.batch.phase} Phase
                </span>
              )}
              {profile.batch?.name && (
                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {profile.batch.name}
                </span>
              )}
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  profile.status === "active"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {profile.status ?? "pending"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ProfileForm
        initial={{
          full_name: profile.full_name ?? "",
          email: profile.email,
          phone: profile.phone ?? "",
          whatsapp: profile.whatsapp ?? "",
          city: profile.city ?? "",
          date_of_birth: profile.date_of_birth ?? "",
          father_name: (meta.father_name as string | null) ?? "",
          address: (meta.address as string | null) ?? "",
          emergency_name: (meta.emergency_contact_name as string | null) ?? "",
          emergency_phone: (meta.emergency_contact_phone as string | null) ?? "",
        }}
      />

      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="font-bold text-emerald-950 flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4" /> নিরাপত্তা · Security
        </h3>
        <p className="text-xs text-slate-500">
          পাসওয়ার্ড পরিবর্তন বা টু-ফ্যাক্টর সেটআপের জন্য সাপোর্টে যোগাযোগ করুন।
          (শীঘ্রই সরাসরি এই পেজ থেকে করা যাবে।)
        </p>
      </div>
    </div>
  );
}
