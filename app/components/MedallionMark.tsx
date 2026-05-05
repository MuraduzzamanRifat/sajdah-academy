/* The brand mark — same medallion image used as favicon, OG, and inline UI.
   Single source so size/path/alt stay consistent. */
import { asset } from "../lib/asset";

export default function MedallionMark({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset("/medallion-128.webp")}
      alt=""
      width={size}
      height={size}
      className={`object-contain shrink-0 ${className}`}
    />
  );
}
