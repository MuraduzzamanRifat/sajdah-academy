import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import path from "node:path";

export const dynamic = "force-static";
export const alt = "Sajdah Academy — দেশের সেরা প্রিমিয়াম রিসোর্টে ফিজিক্যাল ইসলামিক ট্রেনিং";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Read the medallion PNG once at build time and embed as data URL.
   ImageResponse cannot fetch external URLs during static export. */
function loadMedallionDataUrl(): string {
  const file = path.join(process.cwd(), "public", "medallion-512.png");
  const buf = readFileSync(file);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

export default function OG() {
  const medallionSrc = loadMedallionDataUrl();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 80px",
          background: "#022c22",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(245,158,11,0.35) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(16,185,129,0.25) 0%, transparent 40%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Calligraphy medallion in top-right (replaces the old gold star) */}
        <div
          style={{
            position: "absolute",
            top: 50,
            right: 50,
            display: "flex",
            width: 220,
            height: 220,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={medallionSrc}
            alt=""
            width={220}
            height={220}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#fbbf24",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          ◆ 100% PHYSICAL · PREMIUM RESORT
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: 24,
          }}
        >
          Sajdah Academy
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#a7f3d0",
            lineHeight: 1.4,
            maxWidth: 760,
          }}
        >
          ৬ মাসের ফিজিক্যাল ইসলামিক ট্রেনিং · গাজীপুর · মে ২০২৬
        </div>

        {/* Bottom amber CTA bar */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 80,
            display: "flex",
            background: "#f59e0b",
            color: "#022c22",
            padding: "16px 32px",
            borderRadius: 12,
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          রেজিস্ট্রেশন করুন →
        </div>
      </div>
    ),
    { ...size }
  );
}
