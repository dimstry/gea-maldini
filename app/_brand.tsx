import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Dipakai bersama oleh icon, apple-icon, dan opengraph-image (digambar saat build).

const font = (f: string) => readFile(join(process.cwd(), "app/_fonts", f));

export async function fonts() {
  const [script, serif, serifItalic, sans] = await Promise.all([
    font("parisienne-latin-400-normal.woff"),
    font("cormorant-garamond-latin-500-normal.woff"),
    font("cormorant-garamond-latin-500-italic.woff"),
    font("jost-latin-400-normal.woff"),
  ]);
  return [
    { name: "Parisienne", data: script, weight: 400 as const, style: "normal" as const },
    { name: "Cormorant", data: serif, weight: 500 as const, style: "normal" as const },
    { name: "Cormorant", data: serifItalic, weight: 500 as const, style: "italic" as const },
    { name: "Jost", data: sans, weight: 400 as const, style: "normal" as const },
  ];
}

const CLOUD =
  "M8 52 C6 38 22 30 34 36 C38 22 58 18 68 30 C78 20 98 24 100 40 C112 40 118 50 112 58 Z M18 50 C17 41 27 36 35 41 C39 31 54 29 62 38 C70 31 85 34 87 45 C95 45 99 50 96 54 Z M30 49 C30 44 36 42 40 45 C44 39 52 38 57 44 C62 40 72 42 73 48 Z";

export const megaBg = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="70"><path d="${CLOUD}" fill="none" stroke="#C8A24E" stroke-width="1.1" opacity="0.16"/></svg>`,
)}")`;

const diamond = (x: number, y: number, s: number) => `M${x} ${y - s}l${s} ${s}-${s} ${s}-${s}-${s}z`;

/** Bingkai lengkung + monogram G & M, sama seperti di sampul. */
export function Monogram({ w, h }: { w: number; h: number }) {
  const r = w / 2;
  const k = w / 230; // skala relatif ke ukuran sampul
  return (
    <div style={{ position: "relative", width: w, height: h, display: "flex" }}>
      <svg width={w} height={h} viewBox={`-8 -8 ${w + 16} ${h + 16}`} style={{ position: "absolute", left: -8, top: -8, width: w + 16, height: h + 16 }} fill="none" stroke="#C8A24E">
        <path d={`M1 ${h - 1}V${r}a${r - 1} ${r - 1} 0 0 1 ${w - 2} 0v${h - 1 - r}z`} strokeWidth={1.5 * k} />
        <path d={`M${7 * k} ${h - 7 * k}V${r}a${r - 7 * k} ${r - 7 * k} 0 0 1 ${w - 14 * k} 0v${h - 7 * k - r}z`} strokeWidth={0.8 * k} opacity="0.55" />
        <path d={diamond(r, 1, 7 * k)} fill="#1B3358" strokeWidth={1.2 * k} />
        <path d={diamond(r, h - 1, 6 * k)} fill="#1B3358" strokeWidth={1.2 * k} />
        <path d={diamond(1, r, 4 * k)} fill="#C8A24E" stroke="none" />
        <path d={diamond(w - 1, r, 4 * k)} fill="#C8A24E" stroke="none" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 13 * k,
          top: 13 * k,
          width: w - 26 * k,
          height: h - 26 * k,
          borderRadius: `${r - 13 * k}px ${r - 13 * k}px ${2 * k}px ${2 * k}px`,
          background: "rgba(10,22,44,0.45)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Parisienne",
          color: "#F4EEE3",
        }}
      >
        <div style={{ fontSize: 96 * k, lineHeight: 1 }}>G</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 * k, fontSize: 34 * k, color: "#E6CB86", margin: `${2 * k}px 0` }}>
          <div style={{ width: 40 * k, height: Math.max(1, k), background: "rgba(200,162,78,0.7)" }} />&amp;
          <div style={{ width: 40 * k, height: Math.max(1, k), background: "rgba(200,162,78,0.7)" }} />
        </div>
        <div style={{ fontSize: 96 * k, lineHeight: 1 }}>M</div>
      </div>
    </div>
  );
}

/** Ikon persegi: monogram GM di atas biru tua dengan lengkung emas. */
export async function iconResponse(px: number, rounded: boolean) {
  const s = px / 100;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1B3358", borderRadius: rounded ? 22 * s : 0 }}>
        <svg width={px} height={px} viewBox="0 0 100 100" style={{ position: "absolute", left: 0, top: 0 }} fill="none" stroke="#C8A24E">
          <path d="M18 90V44a32 32 0 0 1 64 0v46z" strokeWidth="3" />
          <path d={diamond(50, 12, 5)} fill="#1B3358" strokeWidth="2.5" />
        </svg>
        <div style={{ display: "flex", alignItems: "baseline", marginTop: 20 * s, fontFamily: "Parisienne", color: "#F4EEE3", fontSize: 30 * s, lineHeight: 1 }}>
          G<span style={{ fontSize: 16 * s, color: "#E6CB86", margin: `0 ${1.5 * s}px` }}>&amp;</span>M
        </div>
      </div>
    ),
    { width: px, height: px, fonts: await fonts() },
  );
}
