/* Architectural section divider — thin amber line with the 8-point
   Islamic star centered. More premium than a gradient blend; matches
   the brand mark used in the favicon and OG image.
   The divider sits on the section ABOVE it (the `from` color is its
   background) so it visually belongs to the previous section. */

const colorMap: Record<string, string> = {
  "slate-50": "#f8fafc",
  "emerald-50": "#ecfdf5",
  "emerald-900": "#064e3b",
  "emerald-950": "#022c22",
};

/* Star points pre-computed (8-point, outer 14 / inner 6). */
const STAR_POINTS =
  "0,-14 2.8,-6.8 9.9,-9.9 6.8,-2.8 14,0 6.8,2.8 9.9,9.9 2.8,6.8 0,14 -2.8,6.8 -9.9,9.9 -6.8,-2.8 -14,0 -6.8,-2.8 -9.9,-9.9 -2.8,-6.8";

export default function SectionBlend({
  from,
  to,
  starColor = "#f59e0b", // amber-500
  lineColor,
  height = 80,
}: {
  from: keyof typeof colorMap | string;
  to?: keyof typeof colorMap | string;
  starColor?: string;
  lineColor?: string;
  height?: number;
}) {
  const fromColor = colorMap[from] ?? from;
  const isDark =
    fromColor.toLowerCase().startsWith("#0") ||
    fromColor.toLowerCase().startsWith("#1") ||
    fromColor.toLowerCase().startsWith("#022");
  const stroke = lineColor ?? (isDark ? "rgba(245, 158, 11, 0.45)" : "rgba(2, 44, 34, 0.18)");

  // Optional: blend bottom edge into the next section (subtle 1-line gradient)
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
      }}
    >
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 600 ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ maxWidth: 720, display: "block" }}
      >
        {/* Left line */}
        <line
          x1="40"
          y1={height / 2}
          x2="270"
          y2={height / 2}
          stroke={stroke}
          strokeWidth="1"
        />
        {/* Right line */}
        <line
          x1="330"
          y1={height / 2}
          x2="560"
          y2={height / 2}
          stroke={stroke}
          strokeWidth="1"
        />
        {/* Center 8-point star */}
        <g transform={`translate(300 ${height / 2})`}>
          <polygon points={STAR_POINTS} fill={starColor} />
        </g>
      </svg>
    </div>
  );
}
