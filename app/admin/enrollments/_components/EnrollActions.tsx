"use client";

import { useState, useTransition } from "react";
import { Check, X, Clock, MessageSquare } from "lucide-react";
import { acceptEnrollment, rejectEnrollment, waitlistEnrollment } from "../actions";

export default function EnrollActions({ id, name }: { id: string; name: string }) {
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  function run(fn: (id: string) => Promise<unknown>, confirmText?: string) {
    if (confirmText && !confirm(confirmText)) return;
    setBusy(true);
    startTransition(async () => {
      await fn(id);
      setBusy(false);
    });
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        type="button"
        disabled={busy}
        onClick={() => run(acceptEnrollment, `${name} — গ্রহণ করতে চান?`)}
        className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold disabled:opacity-50"
      >
        <Check className="w-3.5 h-3.5" /> গ্রহণ
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => run(waitlistEnrollment)}
        className="inline-flex items-center gap-1.5 px-3 py-2 border border-amber-200 hover:bg-amber-50 text-amber-700 rounded-lg text-xs font-bold disabled:opacity-50"
      >
        <Clock className="w-3.5 h-3.5" /> অপেক্ষা
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold"
      >
        <MessageSquare className="w-3.5 h-3.5" /> বার্তা
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => run(rejectEnrollment, `${name} — বাতিল করতে চান?`)}
        className="inline-flex items-center gap-1.5 px-3 py-2 border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-lg text-xs font-bold disabled:opacity-50"
      >
        <X className="w-3.5 h-3.5" /> বাতিল
      </button>
    </div>
  );
}
