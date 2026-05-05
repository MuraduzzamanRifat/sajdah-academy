/* Pull two-letter initials from a name (or fall back to the local part
   of an email). Used in avatar bubbles across admin + dashboard. */
export function initials(input: string | null | undefined, fallback = "··"): string {
  const source = (input ?? "").trim();
  if (!source) return fallback;
  const tokens = source.split(/[\s@._-]+/).filter(Boolean);
  if (tokens.length === 0) return fallback;
  return tokens
    .map((t) => t[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
