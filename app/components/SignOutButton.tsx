"use client";

import { LogOut } from "lucide-react";
import { signOut } from "../login/actions";

export default function SignOutButton({
  variant = "icon",
  className,
}: {
  variant?: "icon" | "label";
  className?: string;
}) {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className={
          className ??
          (variant === "icon"
            ? "p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
            : "inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-800")
        }
        aria-label="Sign out"
        title="Sign out"
      >
        <LogOut className="w-4 h-4" />
        {variant === "label" && <span>সাইন আউট</span>}
      </button>
    </form>
  );
}
