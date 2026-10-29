import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#17130f",
          padding: 64,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#e2371f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" width="36" height="36" fill="#fff">
              <path d="M4 21V10.6L12 4l8 6.6V21h-5.6v-5.4a2.4 2.4 0 0 0-4.8 0V21H4Z" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#fff", fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em" }}>
              REAL MÓVEIS ELETRO
            </span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, fontWeight: 600, letterSpacing: "0.24em" }}>
              DESDE 1978
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              color: "#fff",
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          >
            Sua casa nova
            <br />
            começa na <span style={{ color: "#e2371f" }}>Real</span>.
          </span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 28, fontWeight: 600 }}>
            Móveis, eletro e colchões · entrega e montagem grátis · 6 unidades
          </span>
        </div>
      </div>
    ),
    size,
  );
}
