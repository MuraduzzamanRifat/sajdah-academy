"use client";

import { useState, useTransition } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { deleteInstructor } from "../actions";

export default function InstructorRowActions({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  function handleDelete() {
    if (!confirm(`${name} — সত্যিই মুছে ফেলতে চান?`)) return;
    setBusy(true);
    startTransition(async () => {
      await deleteInstructor(id);
      setBusy(false);
    });
  }

  return (
    <div className="flex gap-1">
      <a
        href={`/dashboard/instructors/${id}/edit/`}
        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded"
        aria-label={`Edit ${name}`}
        title="Edit"
      >
        <Edit3 className="w-3.5 h-3.5" />
      </a>
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded disabled:opacity-50"
        aria-label={`Delete ${name}`}
        title="Delete"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
