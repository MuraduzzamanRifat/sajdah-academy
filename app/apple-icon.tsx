import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#022c22",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
        }}
      >
        <svg width="140" height="140" viewBox="-100 -100 200 200">
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
    ),
    { ...size }
  );
}
