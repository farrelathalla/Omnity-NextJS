import { ImageResponse } from "next/og";

export const alt = "Omnity: solusi digital, produk, dan website untuk bisnis Anda";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fafaf7",
          padding: 72,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -160,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "radial-gradient(closest-side, rgba(232,80,30,0.28), rgba(232,80,30,0))",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="14" stroke="#F5A412" strokeWidth="8" strokeLinecap="round" strokeDasharray="41 46.96" transform="rotate(118 20 20)" />
            <circle cx="20" cy="20" r="14" stroke="#E0391F" strokeWidth="8" strokeLinecap="round" strokeDasharray="38 49.96" transform="rotate(-62 20 20)" />
          </svg>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 8, color: "#0e1220" }}>OMNITY</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, lineHeight: 1, color: "#0e1220", letterSpacing: -3, display: "flex" }}>
            Bangun&nbsp;<span style={{ fontStyle: "italic", color: "#4b5563" }}>apa pun.</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 34, color: "#6b7280", display: "flex" }}>
            Website, aplikasi, sampai sistem pembayaran.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
