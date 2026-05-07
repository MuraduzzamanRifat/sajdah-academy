/* Inline "Preview / Coming soon" banner for admin pages whose UI is
   wired but whose backend / server actions aren't shipped yet.

   Why this exists: the audit flagged 11 sidebar items where every
   "Send / Save / Delete" button is a no-op. Rather than ripping out
   the UI, we leave it as a designer-style preview but make the
   incomplete state UNAMBIGUOUS — admins know clicks will not persist. */

import { Construction } from "lucide-react";

export default function ComingSoon({
  title,
  body,
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-300 rounded-xl mb-4">
      <div className="w-10 h-10 rounded-lg bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
        <Construction className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-amber-900 leading-tight">
          {title ?? "Preview only — backend নেই"}
        </p>
        <p className="text-xs text-amber-800 leading-relaxed mt-1">
          {body ??
            "এই সেকশনের UI প্রস্তুত, কিন্তু server-side কাজ এখনো শিপ হয়নি। নিচের যেকোনো বাটন/ফর্মে ক্লিক করলে ডেটা সংরক্ষণ হবে না — শুধু লেআউট দেখার জন্য রাখা হয়েছে।"}
        </p>
      </div>
    </div>
  );
}
