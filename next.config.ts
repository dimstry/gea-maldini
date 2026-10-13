import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // supaya bisa dites dari HP lewat IP jaringan lokal saat `npm run dev`
  allowedDevOrigins: ["10.*.*.*", "192.168.*.*", "172.*.*.*"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // ponytail: CSP dasar tanpa script-src; script-src ketat butuh nonce per request
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
