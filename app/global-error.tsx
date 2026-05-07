"use client";

/* GLOBAL error boundary — catches crashes that happen in the ROOT
   app/layout.tsx itself (font loading throw, an import-time error,
   a third-party SDK init throw). Regular app/error.tsx renders
   INSIDE the root layout, so a layout-level crash bypasses it and
   Vercel falls back to its bare "This Serverless Function has
   crashed" page. global-error.tsx replaces the entire <html> shell
   in that case, so users always see branded fallback + Try-again.

   Required by Next.js spec: must declare its own <html> + <body>. */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="bn">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Hind Siliguri, sans-serif",
          background: "#022c22",
          color: "#ecfdf5",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            কিছু একটা সমস্যা হয়েছে
          </h1>
          <p style={{ color: "#a7f3d0", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            পেজটি লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন। সমস্যা চলতে
            থাকলে আমাদের জানান।
          </p>
          {error.digest && (
            <p style={{ fontSize: "0.75rem", color: "#6ee7b7", marginBottom: "1.5rem", fontFamily: "monospace" }}>
              ref: {error.digest}
            </p>
          )}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => reset()}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#f59e0b",
                color: "#022c22",
                fontWeight: 700,
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              আবার চেষ্টা করুন
            </button>
            <a
              href="/"
              style={{
                padding: "0.75rem 1.5rem",
                background: "transparent",
                color: "#fcd34d",
                fontWeight: 700,
                borderRadius: "0.5rem",
                border: "2px solid #fcd34d",
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              হোমে ফিরুন
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
