"use client";

import { useState, useTransition } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { deleteBatch } from "../actions";

export default function BatchRowActions({ id, name }: { id: string; name: string }) {
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  function handleDelete() {
    if (!confirm(`${name} — সত্যিই মুছে ফেলতে চান? ছাত্রদের batch_id null হবে।`)) return;
    setBusy(true);
    startTransition(async () => {
      await deleteBatch(id);
      setBusy(false);
    });
  }

  return (
    <div className="flex gap-2">
      <a
        href={`/dashboard/batches/${id}/edit/`}
        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
      >
        <Edit3 className="w-3 h-3" /> এডিট
      </a>
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 disabled:opacity-50"
      >
        <Trash2 className="w-3 h-3" /> মুছুন
      </button>
    </div>
  );
}
