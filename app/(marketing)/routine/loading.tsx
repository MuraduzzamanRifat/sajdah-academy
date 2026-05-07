/* Skeleton matched to the Routine hero — emerald header + light body */
export default function RoutineLoading() {
  return (
    <main aria-busy="true" aria-label="Loading routine">
      <div className="bg-emerald-900 py-20 px-4 pt-32">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="h-7 w-32 mx-auto rounded-full bg-white/10 animate-pulse" />
          <div className="h-12 w-72 mx-auto rounded-lg bg-white/10 animate-pulse" />
          <div className="h-5 w-96 mx-auto rounded bg-white/10 animate-pulse" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <div className="h-28 rounded-2xl bg-white/80 animate-pulse" />
          <div className="h-28 rounded-2xl bg-white/80 animate-pulse" />
        </div>
        <div className="h-16 rounded-2xl bg-white/80 mb-8 animate-pulse" />
        <div className="h-[600px] rounded-3xl bg-white/80 animate-pulse" />
      </div>
    </main>
  );
}
