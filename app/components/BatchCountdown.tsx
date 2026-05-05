"use client";

import { useEffect, useState } from "react";

/* Live countdown — updates every second client-side. Server emits the
   target ISO date; client computes diff. Returns null on initial render
   to avoid hydration mismatch (different result server vs client). */
export default function BatchCountdown({ targetIso }: { targetIso: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) {
    return <div className="h-24" aria-hidden />;
  }

  const target = new Date(targetIso).getTime();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  if (diff === 0) {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold text-amber-400">ব্যাচ শুরু হয়েছে</p>
      </div>
    );
  }

  const cells: [number, string][] = [
    [days, "দিন"],
    [hours, "ঘণ্টা"],
    [minutes, "মিনিট"],
    [seconds, "সেকেন্ড"],
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {cells.map(([val, label]) => (
        <div
          key={label}
          className="bg-emerald-950/40 backdrop-blur border border-amber-500/30 rounded-xl px-3 py-4 text-center"
        >
          <div className="text-3xl sm:text-5xl font-extrabold text-amber-400 tabular-nums">
            {String(val).padStart(2, "0")}
          </div>
          <div className="text-[10px] sm:text-xs text-emerald-200 uppercase tracking-wider mt-1">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
