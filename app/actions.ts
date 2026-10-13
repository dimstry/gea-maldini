"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { HADIR, MAX_NAMA, MAX_UCAPAN, UCAPAN_DEFAULT, type Kehadiran, type Wish } from "./wishes";

const SB_URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SECRET_KEY; // server-only, tidak pernah dikirim ke browser
const COLS = "id,nama,kehadiran,jumlah,ucapan";

function sb(path: string, init?: RequestInit) {
  return fetch(`${SB_URL}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: KEY!,
      // kunci lama (JWT "eyJ...") juga butuh Authorization; kunci baru "sb_secret_..." cukup apikey
      ...(KEY!.startsWith("eyJ") ? { Authorization: `Bearer ${KEY}` } : {}),
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

export async function getWishes(): Promise<Wish[]> {
  if (!SB_URL || !KEY) return [];
  // ponytail: 200 ucapan terbaru; tambah paginasi kalau tamunya ribuan
  const res = await sb(`wishes?select=${COLS}&order=created_at.desc&limit=200`);
  if (!res.ok) {
    console.error("getWishes", res.status, await res.text());
    return [];
  }
  return res.json();
}

// Buang karakter kontrol & pembalik arah teks (bidi) yang bisa dipakai untuk mengacak tampilan.
const clean = (v: unknown, max: number) =>
  typeof v === "string"
    ? v.replace(/[\u0000-\u0009\u000B-\u001F\u007F‪-‮⁦-⁩]/g, "").replace(/\n{3,}/g, "\n\n").trim().slice(0, max)
    : "";

type Result = { ok: true; wish: Wish } | { ok: false; error: string };

export async function kirimUcapan(input: { nama: unknown; kehadiran: unknown; jumlah: unknown; ucapan: unknown; website: unknown }): Promise<Result> {
  // honeypot: field tersembunyi yang hanya diisi bot → pura-pura berhasil
  if (input.website) return { ok: true, wish: { id: "x", nama: clean(input.nama, MAX_NAMA), kehadiran: "Hadir", jumlah: 1, ucapan: "" } };

  const nama = clean(input.nama, MAX_NAMA);
  if (!nama) return { ok: false, error: "Nama wajib diisi." };
  if (!HADIR.includes(input.kehadiran as Kehadiran)) return { ok: false, error: "Pilihan kehadiran tidak valid." };
  const jumlah = Number(input.jumlah);
  if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 4) return { ok: false, error: "Jumlah tamu tidak valid." };
  const ucapan = clean(input.ucapan, MAX_UCAPAN) || UCAPAN_DEFAULT;

  if (!SB_URL || !KEY) return { ok: false, error: "RSVP belum terhubung ke database." };

  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  const ip_hash = createHmac("sha256", KEY).update(ip).digest("hex");

  const res = await sb(`wishes?select=${COLS}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ nama, kehadiran: input.kehadiran, jumlah, ucapan, ip_hash }),
  });
  if (!res.ok) {
    const body = await res.text();
    if (body.includes("rate_limited")) return { ok: false, error: "Terlalu banyak ucapan dari perangkat ini. Coba lagi beberapa menit lagi." };
    console.error("kirimUcapan", res.status, body);
    return { ok: false, error: "Ucapan gagal terkirim. Coba lagi." };
  }
  const [wish] = (await res.json()) as Wish[];
  return { ok: true, wish };
}
