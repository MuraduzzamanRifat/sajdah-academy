"use client";

import { useState, useTransition } from "react";
import { Eye, Edit3, Trash2, EyeOff } from "lucide-react";
import { togglePublish, deletePost } from "../actions";

export default function PostRowActions({
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

  function handleDelete() {
    if (!confirm(`"${title}" — সত্যিই মুছে ফেলতে চান?`)) return;
    setBusy(true);
    startTransition(async () => {
      await deletePost(id);
      setBusy(false);
    });
  }

  return (
    <div className="flex gap-1">
      <a
        href={`/blog/${slug}/`}
        target="_blank"
        rel="noopener"
        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded"
        aria-label={`Live দেখুন: ${title}`}
        title="Live"
      >
        <Eye className="w-3.5 h-3.5" />
      </a>
      <a
        href={`/dashboard/blog/${id}/edit/`}
        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded"
        aria-label={`সম্পাদনা: ${title}`}
        title="Edit"
      >
        <Edit3 className="w-3.5 h-3.5" />
      </a>
      <button
        type="button"
        onClick={handleToggle}
        disabled={busy}
        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded disabled:opacity-50"
        aria-label={isPublished ? "Unpublish" : "Publish"}
        title={isPublished ? "Unpublish" : "Publish"}
      >
        {isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded disabled:opacity-50"
        aria-label={`Delete: ${title}`}
        title="Delete"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
