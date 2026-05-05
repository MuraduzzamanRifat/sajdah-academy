/* Guard against open-redirect attacks. A bare `startsWith("/")` check
   accepts protocol-relative URLs like "//evil.com/path" which the
   browser resolves to "https://evil.com/path" — reject those. */
export function safeNext(next: string | undefined | null, fallback = "/student-dashboard"): string {
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback;
  if (next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
