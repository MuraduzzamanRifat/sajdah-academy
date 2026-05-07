import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getPageDef, allKeysFor } from "../schema";
import { createClient } from "../../../../lib/supabase/server";
import PageSettingsForm from "../_components/PageSettingsForm";

export const metadata: Metadata = {
  title: "Admin · Edit Page",
  alternates: { canonical: "/admin/pages/" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export default async function EditPagePage({ params }: Params) {
  const { slug } = await params;
  const def = getPageDef(slug);
  if (!def) notFound();

  const keys = allKeysFor(def);
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", keys);

  const values: Record<string, unknown> = {};
  (data ?? []).forEach((row) => {
    values[row.key as string] = row.value;
  });

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link
          href="/dashboard/pages/"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700"
        >
          <ArrowLeft className="w-3 h-3" /> সব পেজ
        </Link>
        <Link
          href={def.publicPath}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900"
        >
          লাইভ পেজ দেখুন <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h1 className="text-lg font-bold text-emerald-950">{def.label} · {def.labelEn}</h1>
        <p className="text-xs text-slate-500 mt-1 mb-5">{def.description}</p>
        <PageSettingsForm groups={def.groups} initial={values} />
      </div>
    </div>
  );
}
