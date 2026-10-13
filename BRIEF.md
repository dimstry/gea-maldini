# Brief: Undangan Digital Gea & Maldini (adat Sunda)

Bangun ulang desain di `design/Main.dc.html` menjadi website Next.js yang siap deploy ke Vercel.
File desain itu adalah HTML dengan format komponen khusus (`<x-dc>`, `<sc-for>`, `<sc-if>`, `{{hole}}`, dan class `Component extends DCLogic` di bawahnya).
Anggap itu **referensi visual dan perilaku**, bukan kode untuk dipakai langsung. Ikuti warna, font, spacing, urutan section, dan copy-nya sepersis mungkin.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Font via `next/font/google`: Cormorant Garamond (400/500/600 + italic), Parisienne, Jost (300/400/500)
- Foto pakai `next/image`, file ada di `public/images/`
- Deploy: Vercel

## Design tokens
| Token | Hex | Dipakai untuk |
|---|---|---|
| hijau-tua | #1F3A30 | sampul, hitung mundur, penutup, tombol utama |
| hijau-gelap | #16291F | latar di luar kolom undangan |
| emas | #C8A24E | ornamen, garis bingkai, tombol sampul |
| emas-muda | #E6CB86 | label kecil di atas latar hijau |
| krem | #F4EEE3 | latar konten utama |
| krem-tua | #EAE1CF | kartu acara, galeri, kutipan |
| teks | #24301F / #2E3A28 | teks badan |
| coklat-emas | #7A5A1E | label section di atas krem |
| rose | #8A4E5E | tanda "&" di antara mempelai |

Layout: satu kolom `max-width: 480px` di tengah, latar luar hijau gelap dengan pola mega mendung (SVG pattern, lihat `<pattern id="mega">` di file desain).

## Section (urut)
1. **Sampul**: siger (SVG), foto berdua dalam bingkai lengkung, "Gea & Maldini", "Sabtu · 24 · 10 · 2026", nama tamu, tombol "Buka Undangan".
2. **Pembuka**: "Wilujeng Sumping", salam, kutipan QS. Ar-Rum: 21.
3. **Mempelai**: Gea Rahmayani (putri dari Bapak Usep & Ibu Cucu) & Maldini Aditya (putra dari Bapak Dasim & Ibu Nining), foto dalam bingkai lengkung.
4. **Hitung mundur** ke `2026-10-24T09:00:00+07:00`, plus tombol "Simpan ke Kalender" (Google Calendar).
5. **Acara**: Akad Nikah 09.00 WIB – selesai, Resepsi 10.00 WIB – selesai, Sabtu 24 Oktober 2026.
6. **Lokasi**: Kediaman Mempelai Wanita, Kec. Sagalaherang, Kab. Subang. Tombol Google Maps dan "Salin Alamat".
7. **Galeri**: 2 foto berdua, ketuk untuk memperbesar (lightbox).
8. **RSVP & ucapan**: nama, kehadiran (Hadir / Tidak Hadir / Masih Ragu), jumlah tamu, ucapan, lalu daftar ucapan.
9. **Penutup**: "Hatur Nuhun", nama kedua keluarga besar.

## Fitur tambahan untuk versi web
- **Nama tamu dari URL**: `/?to=Nama+Tamu` muncul di sampul. Kalau kosong, tampilkan "Tamu Undangan".
- **Buka undangan**: sebelum tombol diklik, hanya sampul yang tampil (scroll terkunci). Setelah diklik, konten terbuka dan scroll ke "Pembuka".
- **RSVP tersimpan sungguhan**: pakai Supabase (tabel `wishes`: id, nama, kehadiran, jumlah, ucapan, created_at). Lewat Route Handler / Server Action, dengan validasi dan batas panjang teks.
- **Preview WhatsApp**: metadata Open Graph (judul "The Wedding of Gea & Maldini", deskripsi, gambar OG 1200×630) supaya link tampil bagus saat dibagikan.
- **Animasi halus**: elemen muncul saat di-scroll, mega mendung bergerak pelan. Hormati `prefers-reduced-motion`.
- **Musik latar (opsional, nanti)**: tombol play/pause mengambang, file di `public/audio/`.
- **Aksesibilitas**: tombol pakai `<button>`, input pakai `<label>`, gambar pakai `alt`.

## Data yang masih placeholder
- Alamat lengkap (kampung, RT/RW, desa) dan link share-loc Google Maps
- Foto resolusi asli (yang sekarang dipotong dari screenshot WA)
- Lagu latar
