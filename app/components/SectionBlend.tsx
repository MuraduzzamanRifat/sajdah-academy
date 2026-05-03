/* Architectural section divider — thin amber line with the medallion
   centered. Replaces the previous 8-point star marker so the brand mark
   is consistent with the hero focal point.
   The divider sits on the section ABOVE it (the `from` color is its
   background) so it visually belongs to the previous section. */
import { asset } from "../lib/asset";

const colorMap: Record<string, string> = {
  "slate-50": "#f8fafc",
  "emerald-50": "#ecfdf5",
  "emerald-900": "#064e3b",
  "emerald-950": "#022c22",
};

export default function SectionBlend({
  from,
  to,
  lineColor,
  height = 80,
}: {
  from: keyof typeof colorMap | string;
  to?: keyof typeof colorMap | string;
  lineColor?: string;
  height?: number;
}) {
  const fromColor = colorMap[from] ?? from;
  const isDark =
    fromColor.toLowerCase().startsWith("#0") ||
    fromColor.toLowerCase().startsWith("#1") ||
    fromColor.toLowerCase().startsWith("#022");
  const stroke = lineColor ?? (isDark ? "rgba(245, 158, 11, 0.45)" : "rgba(2, 44, 34, 0.18)");
  const toColor = to ? colorMap[to] ?? to : null;

  return (
    <div
      aria-hidden
      style={{
        height,
        background: toColor
          ? `linear-gradient(to bottom, ${fromColor} 0%, ${fromColor} 70%, ${toColor} 100%)`
          : fromColor,
        marginTop: -1,
        marginBottom: -1,
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <div style={{ flex: 1, maxWidth: 280, height: 1, background: stroke }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/medallion-128.webp")}
        alt=""
        width={48}
        height={48}
        style={{ width: 48, height: 48, objectFit: "contain", flexShrink: 0 }}
      />
      <div style={{ flex: 1, maxWidth: 280, height: 1, background: stroke }} />
    </div>
  );
}
