"use client";

/* Manual cache flush. Calls revalidatePath("/", "layout") server-side
   which cascades to every public route inheriting the marketing layout.
   Useful when ISR + revalidatePath misses something (e.g. an external
   image URL changed but the consuming page wasn't in the auto-derived
   path set). */

import { useState, useTransition } from "react";
import { CheckCircle2, RefreshCw, AlertCircle } from "lucide-react";
import { refreshAllCaches } from "../actions";

export default function CacheRefreshButton() {
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function handleClick() {
    setBusy(true);
    setErr(null);
    setDone(false);
    startTransition(async () => {
      const result = await refreshAllCaches();
      setBusy(false);
      if ("error" in result) {
        setErr(result.error);
      } else {
        setDone(true);
        setTimeout(() => setDone(false), 4000);
      }
    });
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 rounded-lg text-xs font-bold disabled:opacity-50 cursor-pointer"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${busy ? "animate-spin" : ""}`} />
        {busy ? "ক্যাশ পরিষ্কার হচ্ছে..." : "সব ক্যাশ পরিষ্কার করুন"}
      </button>

      {done && (
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
          <CheckCircle2 className="w-4 h-4" />
          সব পেজের ক্যাশ পরিষ্কার করা হয়েছে।
        </span>
      )}
      {err && (
        <span className="inline-flex items-center gap-1.5 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4" />
          {err}
        </span>
      )}
    </div>
  );
}
