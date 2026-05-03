/* Streaming skeleton shown while the home route fetches.
   Matches the dark hero canvas so users see no white flash. */
export default function HomeLoading() {
  return (
    <main aria-busy="true" aria-label="Loading">
      <div className="relative min-h-[100svh] bg-emerald-950 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at 50% 42%, rgba(245,158,11,0.18) 0%, rgba(16,185,129,0.06) 30%, transparent 60%)",
          }}
        />
        <div className="relative flex flex-col items-center gap-6">
          <div className="w-12 h-12 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
          <div className="space-y-3 text-center">
            <div className="h-12 w-72 mx-auto rounded-lg bg-white/5 animate-pulse" />
            <div className="h-4 w-56 mx-auto rounded bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
