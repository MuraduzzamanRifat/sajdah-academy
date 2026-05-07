/* Streaming skeleton for the marketing surface. Rendered automatically
   by Next.js while a marketing page's data fetch is pending. Matches
   the marketing chrome aesthetic — slate-100 background with emerald
   spinner and amber accent — so users see no white flash during
   server-side data fetching. Per-route loading.tsx files (e.g.
   routine/loading.tsx) override this when present. */
export default function MarketingLoading() {
  return (
    <main aria-busy="true" aria-label="Loading">
      <div className="relative min-h-[100svh] bg-slate-100 flex items-center justify-center overflow-hidden pt-24">
        <div
          aria-hidden
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(circle at 50% 35%, rgba(245,158,11,0.10) 0%, rgba(16,185,129,0.06) 35%, transparent 65%)",
          }}
        />
        <div className="relative flex flex-col items-center gap-6">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-200 border-t-amber-500 animate-spin" />
          <div className="space-y-3 text-center">
            <div className="h-9 w-64 mx-auto rounded-lg bg-emerald-900/5 animate-pulse" />
            <div className="h-4 w-48 mx-auto rounded bg-emerald-900/5 animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
