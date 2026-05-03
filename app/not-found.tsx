import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4 pt-32 pb-20">
      <div className="text-center max-w-md">
        <p className="text-amber-500 font-bold tracking-widest text-sm mb-4">404</p>
        <h1 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">
          পেইজ খুঁজে পাওয়া যায়নি
        </h1>
        <p className="text-slate-600 mb-8">
          আপনি যে পেইজটি খুঁজছেন তা আর নেই অথবা সরিয়ে নেওয়া হয়েছে।
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-lg transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60"
        >
          হোমে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
