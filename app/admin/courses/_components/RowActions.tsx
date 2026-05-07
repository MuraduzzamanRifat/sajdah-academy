"use client";

import { useState, useTransition } from "react";
import { Eye, Edit3, Copy, Trash2, EyeOff } from "lucide-react";
import { togglePublish, deleteCourse, duplicateCourse } from "../actions";

export default function RowActions({
  id,
  slug,
  title,
  isPublished,
}: {
  id: string;
  slug: string;
  title: string;
  isPublished: boolean;
}) {
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  function handleToggle() {
    setBusy(true);
    startTransition(async () => {
      await togglePublish(id, isPublished);
      setBusy(false);
    });
  }

  function handleDuplicate() {
    setBusy(true);
    startTransition(async () => {
      await duplicateCourse(id);
      setBusy(false);
    });
  }

  function handleDelete() {
    if (!confirm(`"${title}" — সত্যিই মুছে ফেলতে চান? এটি পূর্বাবস্থায় ফেরানো যাবে না।`)) return;
    setBusy(true);
    startTransition(async () => {
      await deleteCourse(id);
      setBusy(false);
    });
  }

  return (
    <div className="flex gap-1">
      <a
        href={`/courses/${slug}/`}
        target="_blank"
        rel="noopener"
        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded"
        aria-label={`Live দেখুন: ${title}`}
        title="লাইভ পেজ দেখুন"
      >
        <Eye className="w-3.5 h-3.5" />
      </a>
      <a
        href={`/admin/courses/${id}/edit/`}
        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded"
        aria-label={`সম্পাদনা: ${title}`}
        title="সম্পাদনা"
      >
        <Edit3 className="w-3.5 h-3.5" />
      </a>
      <button
        type="button"
        onClick={handleToggle}
        disabled={busy}
        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded disabled:opacity-50"
        aria-label={isPublished ? "আনপাবলিশ করুন" : "পাবলিশ করুন"}
        title={isPublished ? "আনপাবলিশ" : "পাবলিশ"}
      >
        {isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
      <button
        type="button"
        onClick={handleDuplicate}
        disabled={busy}
        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded disabled:opacity-50"
        aria-label={`Duplicate: ${title}`}
        title="ডুপ্লিকেট"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded disabled:opacity-50"
        aria-label={`Delete: ${title}`}
        title="মুছে ফেলুন"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
