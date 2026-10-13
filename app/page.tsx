import { Fragment } from "react";
import { getWishes } from "./actions";
import { Arch, Countdown, Galeri, Gate, MegaDefs, MegaFill, Rsvp, SalinAlamat, Siger } from "./ui";

const label = "m-0 text-xs uppercase tracking-[0.3em]";
const pill = "inline-flex min-h-[46px] items-center gap-2 rounded-full px-[22px] text-[13px] tracking-[0.06em] no-underline";

const MEMPELAI = [
  { nama: "Gea Rahmayani", src: "/images/gea.jpeg", ortu: "Putri dari", dari: "Bapak Usep & Ibu Cucu" },
  { nama: "Maldini Aditya", src: "/images/maldini.jpeg", ortu: "Putra dari", dari: "Bapak Dasim & Ibu Nining" },
];

const ACARA = [
  ["Akad Nikah", "09.00 WIB — selesai"],
  ["Resepsi", "10.00 WIB — selesai"],
];

export default async function Home({ searchParams }: { searchParams: Promise<{ to?: string | string[] }> }) {
  const { to } = await searchParams;
  const tamu = (Array.isArray(to) ? to[0] : to)?.trim().slice(0, 60) || "Tamu Undangan";

  return (
    <div className="relative min-h-screen overflow-hidden bg-hijau-gelap font-sans text-teks">
      <MegaDefs />
      <main className="relative mx-auto max-w-[480px] bg-krem shadow-[0_0_80px_rgba(0,0,0,0.5)]">
        <Gate tamu={tamu}>
          {/* PEMBUKA */}
          <section id="pembuka" className="flex flex-col items-center gap-5 px-8 pb-12 pt-20 text-center">
            <p className="m-0 font-script text-[40px] leading-none text-hijau-tua">Wilujeng Sumping</p>
            <svg width="160" height="14" viewBox="0 0 160 14" aria-hidden="true" fill="none" stroke="#C8A24E" strokeWidth="1.4">
              <path d="M0 7 H62 M98 7 H160" />
              <path d="M80 1 L86 7 L80 13 L74 7 Z" />
              <circle cx="68" cy="7" r="1.6" />
              <circle cx="92" cy="7" r="1.6" />
            </svg>
            <p className="m-0 font-serif text-xl italic text-teks">Assalamu’alaikum Warahmatullahi Wabarakatuh</p>
            <blockquote className="m-0 rounded-[14px] bg-krem-tua px-5 py-[22px] font-serif text-lg italic leading-[1.6] text-teks-2">
              “Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.”
              <br />
              <span className="text-sm not-italic tracking-[0.1em] text-coklat-emas">— QS. Ar-Rum: 21</span>
            </blockquote>
            <p className="mb-0 mt-2 text-[15px] leading-[1.8] text-teks-2">
              Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:
            </p>
          </section>

          {/* MEMPELAI */}
          <section className="flex flex-col items-center gap-[26px] px-8 pb-20 pt-2 text-center">
            {MEMPELAI.map((m, i) => (
              <Fragment key={m.nama}>
                {i === 1 && <p className="m-0 font-script text-[54px] leading-none text-rose">&amp;</p>}
                <div className="flex flex-col items-center gap-3.5">
                  <Arch src={m.src} alt={m.nama} w={200} h={260} pos="50% 30%" />
                  <h2 className="mb-0 mt-1.5 font-script text-[44px] font-normal leading-[1.05] text-hijau-tua">{m.nama}</h2>
                  <p className="m-0 text-sm leading-[1.7] text-teks-2">
                    {m.ortu}
                    <br />
                    <strong className="font-medium">{m.dari}</strong>
                  </p>
                </div>
              </Fragment>
            ))}
          </section>

          {/* HITUNG MUNDUR */}
          <section className="relative overflow-hidden bg-hijau-tua px-7 py-[72px] text-center text-krem">
            <MegaFill opacity={0.14} />
            <div className="relative flex flex-col items-center gap-[22px]">
              <p className={`${label} text-emas-muda`}>Menuju Hari Bahagia</p>
              <h2 className="m-0 font-serif text-[32px] font-medium">Sabtu, 24 Oktober 2026</h2>
              <Countdown />
              <a
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan%20Gea%20%26%20Maldini&dates=20261024T020000Z/20261024T060000Z&location=Sagalaherang%2C%20Subang"
                target="_blank"
                rel="noopener"
                className={`${pill} border border-emas-muda text-krem hover:text-krem`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
                Simpan ke Kalender
              </a>
            </div>
          </section>

          {/* ACARA */}
          <section className="flex flex-col items-center gap-[22px] px-6 pb-14 pt-20 text-center">
            <p className={`${label} text-coklat-emas`}>Waktu &amp; Tempat</p>
            <h2 className="m-0 font-serif text-[34px] font-medium text-hijau-tua">Rangkaian Acara</h2>
            <div className="flex w-full flex-col gap-3.5">
              {ACARA.map(([nama, jam]) => (
                <div key={nama} className="flex flex-col items-center gap-2.5 rounded-[18px] border border-garis bg-krem-tua px-[22px] py-7">
                  <p className="m-0 font-script text-[40px] leading-none text-hijau-tua">{nama}</p>
                  <p className="m-0 text-sm text-teks-2">Sabtu, 24 Oktober 2026</p>
                  <p className="m-0 font-serif text-2xl font-semibold text-coklat-emas">{jam}</p>
                </div>
              ))}
            </div>
          </section>

          {/* LOKASI */}
          <section className="flex flex-col items-center gap-4 px-6 pb-20 text-center">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#7A5A1E" strokeWidth="1.6" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
            <h2 className="m-0 font-serif text-[28px] font-medium text-hijau-tua">Kediaman Mempelai Wanita</h2>
            <p className="m-0 text-sm leading-[1.7] text-teks-2">
              Kec. Sagalaherang, Kab. Subang, Jawa Barat
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <a href="https://www.google.com/maps/search/?api=1&query=Sagalaherang%2C%20Subang" target="_blank" rel="noopener" className={`${pill} bg-hijau-tua text-krem hover:text-krem`}>
                Buka Google Maps
              </a>
              <SalinAlamat />
            </div>
          </section>

          {/* GALERI */}
          <section className="flex flex-col items-center gap-5 bg-krem-tua px-6 py-[72px] text-center">
            <p className={`${label} text-coklat-emas`}>Galeri</p>
            <h2 className="m-0 font-script text-[44px] font-normal leading-none text-hijau-tua">Momen Kami</h2>
            <Galeri />
            <p className="m-0 text-xs text-redup opacity-60">Ketuk foto untuk memperbesar</p>
          </section>

          {/* RSVP & UCAPAN */}
          <section className="flex flex-col items-center gap-[22px] px-6 py-20">
            <p className={`${label} text-coklat-emas`}>Konfirmasi Kehadiran</p>
            <h2 className="m-0 text-center font-serif text-[32px] font-medium text-hijau-tua">Doa &amp; Ucapan</h2>
            <Rsvp initial={await getWishes()} />
          </section>

          {/* PENUTUP */}
          <section className="relative overflow-hidden bg-hijau-tua px-8 pb-16 pt-[88px] text-center text-krem">
            <MegaFill opacity={0.16} />
            <div className="relative flex flex-col items-center gap-[18px]">
              <Siger width={96} height={54} arc={false} />
              <p className="m-0 font-script text-[46px] leading-none">Hatur Nuhun</p>
              <p className="m-0 text-sm leading-[1.8] text-[#E9DFC9]">
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
              </p>
              <p className="m-0 font-serif text-lg italic text-[#E9DFC9]">Wassalamu’alaikum Warahmatullahi Wabarakatuh</p>
              <p className="mb-0 mt-2.5 text-[13px] text-[#D8CDB3]">Kami yang berbahagia,</p>
              <p className="m-0 font-script text-[52px] leading-none text-krem">Gea &amp; Maldini</p>
              <p className="m-0 text-[13px] leading-[1.8] text-[#D8CDB3]">
                Keluarga Besar Bapak Usep &amp; Ibu Cucu
                <br />
                Keluarga Besar Bapak Dasim &amp; Ibu Nining
              </p>
            </div>
          </section>
        </Gate>
      </main>
    </div>
  );
}
