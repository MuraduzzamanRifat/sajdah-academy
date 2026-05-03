import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Sajdah Academy — দেশের সেরা প্রিমিয়াম রিসোর্টে ফিজিক্যাল ইসলামিক ট্রেনিং";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
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
        {/* Star mark in top-right */}
        <div
          style={{
            position: "absolute",
            top: 80,
            right: 80,
            display: "flex",
          }}
        >
          <svg width="160" height="160" viewBox="-100 -100 200 200">
            <defs>
              <radialGradient id="g" cx="0" cy="0" r="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="60%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </radialGradient>
            </defs>
            <polygon
              points="0.0,-72.0 14.5,-35.1 50.9,-50.9 35.1,-14.5 72.0,0.0 35.1,14.5 50.9,50.9 14.5,35.1 0.0,72.0 -14.5,35.1 -50.9,50.9 -35.1,14.5 -72.0,0.0 -35.1,-14.5 -50.9,-50.9 -14.5,-35.1"
              fill="url(#g)"
            />
          </svg>
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
            maxWidth: 880,
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
