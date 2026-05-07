"use client";

import Link from "next/link";

/* Marketing-scoped error boundary. Catches crashes inside any
   `(marketing)/...` page or the marketing layout itself. Without
   this, errors would bubble to app/error.tsx — which works, but
   loses Navbar/Footer chrome. Keeping the chrome means a partial
   crash doesn't make the whole site feel down. */

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4 pt-32 pb-20">
      <div className="text-center max-w-md">
        <p className="text-amber-500 font-bold tracking-widest text-sm mb-4">SOMETHING WENT WRONG</p>
        <h1 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">
          কিছু একটা সমস্যা হয়েছে
        </h1>
        <p className="text-slate-600 mb-6">
          এই পেজটি লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400 mb-6 font-mono">ref: {error.digest}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg transition-all duration-200 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
          >
            আবার চেষ্টা করুন
          </button>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-emerald-600 text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/60"
          >
            হোমে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
