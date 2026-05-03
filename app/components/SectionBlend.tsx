/* Soft 64px gradient transition between sections.
   `from` is the section above, `to` is the section below.
   Use it as `<SectionBlend from="emerald-950" to="slate-50" />`. */

const colorMap: Record<string, string> = {
  "slate-50": "#f8fafc",
  "emerald-50": "#ecfdf5",
  "emerald-900": "#064e3b",
  "emerald-950": "#022c22",
};

export default function SectionBlend({
  from,
  to,
  height = 64,
}: {
  from: keyof typeof colorMap | string;
  to: keyof typeof colorMap | string;
  height?: number;
}) {
  const fromColor = colorMap[from] ?? from;
  const toColor = colorMap[to] ?? to;
  return (
    <div
      aria-hidden
      style={{
        height,
        background: `linear-gradient(to bottom, ${fromColor} 0%, ${toColor} 100%)`,
        marginTop: -1,
        marginBottom: -1,
        position: "relative",
        zIndex: 1,
      }}
    />
  );
}
