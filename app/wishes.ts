// Dipakai bersama oleh server action (validasi) dan komponen RSVP (tampilan).

export const HADIR = ["Hadir", "Tidak Hadir", "Masih Ragu"] as const;
export type Kehadiran = (typeof HADIR)[number];

export type Wish = { id: string; nama: string; kehadiran: Kehadiran; jumlah: number; ucapan: string };

export const MAX_NAMA = 80;
export const MAX_UCAPAN = 500;
export const UCAPAN_DEFAULT = "Wilujeng nikah, mugia janten kulawarga anu sakinah, mawaddah, warahmah.";
