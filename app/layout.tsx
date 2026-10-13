import type { Metadata } from "next";
import { Cormorant_Garamond, Parisienne, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});
const parisienne = Parisienne({ subsets: ["latin"], weight: "400", variable: "--font-parisienne" });
const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-jost" });

const description = "Sabtu, 24 Oktober 2026 · Sagalaherang, Subang. Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu.";

export const metadata: Metadata = {
  title: "The Wedding of Gea & Maldini",
  description,
  // gambar OG & ikon digambar dari app/opengraph-image.tsx, app/icon.tsx, app/apple-icon.tsx
  openGraph: { title: "The Wedding of Gea & Maldini", description, type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${cormorant.variable} ${parisienne.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
