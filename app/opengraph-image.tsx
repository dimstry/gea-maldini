import { ImageResponse } from "next/og";
import { fonts, megaBg, Monogram } from "./_brand";

export const alt = "The Wedding of Gea & Maldini — Sabtu, 24 Oktober 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          background: "#1F3A30",
          backgroundImage: megaBg,
          backgroundSize: "120px 70px",
          backgroundRepeat: "repeat",
          color: "#F4EEE3",
        }}
      >
        {/* bingkai halaman dobel */}
        <div style={{ position: "absolute", left: 24, top: 24, right: 24, bottom: 24, border: "1.5px solid rgba(200,162,78,0.6)", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 34, top: 34, right: 34, bottom: 34, border: "1px solid rgba(200,162,78,0.25)", borderRadius: 4 }} />

        <Monogram w={290} h={380} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "Jost", fontSize: 22, letterSpacing: 7, color: "#E6CB86" }}>THE WEDDING OF</div>
          <div style={{ display: "flex", alignItems: "baseline", fontFamily: "Parisienne", fontSize: 112, lineHeight: 1.25, marginTop: 6 }}>
            Gea<span style={{ fontSize: 76, color: "#E6CB86", margin: "0 22px" }}>&amp;</span>Maldini
          </div>
          <svg width="240" height="20" viewBox="0 0 160 14" fill="none" stroke="#C8A24E" strokeWidth="1.4" style={{ marginTop: 8 }}>
            <path d="M0 7 H62 M98 7 H160" />
            <path d="M80 1 L86 7 L80 13 L74 7 Z" />
            <circle cx="68" cy="7" r="1.6" />
            <circle cx="92" cy="7" r="1.6" />
          </svg>
          <div style={{ fontFamily: "Cormorant", fontSize: 42, color: "#E9DFC9", marginTop: 22 }}>Sabtu, 24 Oktober 2026</div>
          <div style={{ fontFamily: "Cormorant", fontStyle: "italic", fontSize: 28, color: "#D8CDB3", marginTop: 8 }}>Sagalaherang · Subang</div>
        </div>
      </div>
    ),
    { ...size, fonts: await fonts() },
  );
}
