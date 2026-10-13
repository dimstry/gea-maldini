"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { kirimUcapan } from "./actions";
import { HADIR, MAX_NAMA, MAX_UCAPAN, type Kehadiran, type Wish } from "./wishes";
import couple1 from "../public/images/couple1.jpeg";
import couple2 from "../public/images/couple2.jpeg";

const CLOUD = [
  "M8 52 C6 38 22 30 34 36 C38 22 58 18 68 30 C78 20 98 24 100 40 C112 40 118 50 112 58 Z",
  "M18 50 C17 41 27 36 35 41 C39 31 54 29 62 38 C70 31 85 34 87 45 C95 45 99 50 96 54 Z",
  "M30 49 C30 44 36 42 40 45 C44 39 52 38 57 44 C62 40 72 42 73 48 Z",
];

/** Definisi pola mega mendung; dirender sekali, dipakai lewat url(#mega). */
export function MegaDefs() {
  return (
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-[0.13]">
      <defs>
        <pattern id="mega" width="120" height="70" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#C8A24E" strokeWidth="1.1">
            {CLOUD.map((d) => <path key={d} d={d} />)}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mega)" />
    </svg>
  );
}

export function MegaFill({ opacity }: { opacity: number }) {
  return (
    <svg aria-hidden="true" className="animate-pan absolute inset-y-0 -left-[120px] h-full w-[calc(100%+120px)]" style={{ opacity }}>
      <rect width="100%" height="100%" fill="url(#mega)" />
    </svg>
  );
}

function Cloud({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" width="230" height="110" viewBox="0 0 120 70" fill="none" stroke="#C8A24E" strokeWidth="1.3" className={`absolute opacity-55 ${className}`}>
      {CLOUD.map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

export function Siger({ className, width, height, arc = true }: { className?: string; width: number; height: number; arc?: boolean }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 200 110" aria-hidden="true" fill="none" stroke="#C8A24E" strokeWidth="3">
      <path d="M14 100 Q100 80 186 100 L176 76 Q164 52 142 46 Q132 16 100 6 Q68 16 58 46 Q36 52 24 76 Z" />
      {arc && <path d="M40 84 Q100 70 160 84" opacity="0.7" />}
      <circle cx="100" cy="34" r="7" />
      <circle cx="72" cy="60" r="5" />
      <circle cx="128" cy="60" r="5" />
    </svg>
  );
}

/** Bingkai lengkung emas bergaris dobel dengan ornamen; `bg` = warna latar section (untuk "memotong" garis di ornamen). */
export function Frame({ w, h, bg, children }: { w: number; h: number; bg: string; children: React.ReactNode }) {
  const r = w / 2;
  const diamond = (x: number, y: number, s: number) => `M${x} ${y - s}l${s} ${s}-${s} ${s}-${s}-${s}z`;
  return (
    <div className="relative shrink-0" style={{ width: w, height: h }}>
      <svg aria-hidden="true" className="absolute inset-0 overflow-visible" width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" stroke="#C8A24E">
        <path d={`M1 ${h - 1}V${r}a${r - 1} ${r - 1} 0 0 1 ${w - 2} 0v${h - 1 - r}z`} strokeWidth="1.5" />
        <path d={`M7 ${h - 7}V${r}a${r - 7} ${r - 7} 0 0 1 ${w - 14} 0v${h - 7 - r}z`} strokeWidth="0.8" opacity="0.55" />
        <path d={diamond(r, 1, 7)} fill={bg} strokeWidth="1.2" />
        <circle cx={r} cy="1" r="1.6" fill="#C8A24E" stroke="none" />
        <path d={diamond(r, h - 1, 6)} fill={bg} strokeWidth="1.2" />
        <path d={diamond(1, r, 4)} fill="#C8A24E" stroke="none" />
        <path d={diamond(w - 1, r, 4)} fill="#C8A24E" stroke="none" />
      </svg>
      <div className="absolute inset-[13px] overflow-hidden" style={{ borderRadius: `${r - 13}px ${r - 13}px 2px 2px` }}>
        {children}
      </div>
    </div>
  );
}

/** Foto dalam bingkai lengkung emas. */
export function Arch({ src, alt, w, h, pos }: { src: string | StaticImageData; alt: string; w: number; h: number; pos: string }) {
  return (
    <Frame w={w} h={h} bg="#F4EEE3">
      <Image src={src} alt={alt} fill sizes={`${w}px`} className="object-cover" style={{ objectPosition: pos }} />
    </Frame>
  );
}

// Posisi/durasi tetap (bukan Math.random) supaya HTML server & browser sama.
const PETALS = [
  [6, 15, 0, 12], [20, 18, -9, 10], [35, 16, -4, 13], [50, 19, -13, 11],
  [64, 17, -7, 12], [79, 18, -2, 10], [93, 16, -11, 11],
];

/** Kelopak melati berjatuhan pelan. */
function Petals() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[45] mx-auto max-w-[480px] overflow-hidden">
      {PETALS.map(([left, dur, delay, size], i) => (
        <span key={i} className="animate-fall absolute -top-8 block" style={{ left: `${left}%`, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}>
          <svg className="animate-sway block" style={{ animationDuration: `${3 + (i % 3)}s` }} width={size} height={size * 1.4} viewBox="0 0 10 14">
            <path d="M5 0C8.5 3 9.5 8 5 14C0.5 8 1.5 3 5 0Z" fill="#FFFDF4" stroke="#D4B76E" strokeWidth="0.6" opacity="0.9" />
            <path d="M5 2V12" stroke="#E6CB86" strokeWidth="0.5" opacity="0.6" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/** Sampul layar penuh; setelah "Buka Undangan" sampul memudar dan isi undangan tampil. */
export function Gate({ tamu, children }: { tamu: string; children: React.ReactNode }) {
  const [stage, setStage] = useState<"cover" | "closing" | "open">("cover");
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  // Bagian undangan muncul bergantian saat masuk layar. Kelas `rv` dipasang lewat JS,
  // jadi tanpa JS (atau sebelum dibuka) semua konten tetap terlihat.
  const opened = stage !== "cover";
  useEffect(() => {
    if (!opened) return;
    const els = new Set<HTMLElement>(document.querySelectorAll('.isi section > :not(svg, [role="dialog"]), .isi [data-stagger] > *, .isi [data-rv]'));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => {
      if (el.parentElement?.hasAttribute("data-stagger")) el.style.transitionDelay = `${Math.min([...el.parentElement.children].indexOf(el), 6) * 110}ms`;
      el.classList.add("rv");
      io.observe(el);
    });
    return () => io.disconnect();
  }, [opened]);

  function buka() {
    // play() langsung di handler klik supaya tidak diblokir autoplay browser
    audio.current?.play().catch(() => {});
    window.scrollTo(0, 0);
    setStage("closing");
    // timer, bukan onAnimationEnd: tetap jalan walau animasi dimatikan (reduced motion)
    setTimeout(() => setStage("open"), 800);
  }

  return (
    <>
      {stage !== "open" && (
        <section
          className={`fixed inset-0 z-40 mx-auto box-border flex max-w-[480px] flex-col items-center overflow-y-auto overflow-x-hidden bg-hijau-tua px-7 py-[60px] text-center text-krem ${stage === "closing" ? "animate-cover-out pointer-events-none" : ""}`}
        >
          <MegaFill opacity={0.16} />
          <Cloud className="animate-drift left-[-60px] top-[30px]" />
          <Cloud className="animate-drift2 bottom-[40px] right-[-60px]" />
          <div className="pointer-events-none absolute inset-4 rounded border border-emas/45" />
          <div className="pointer-events-none absolute inset-[22px] rounded-sm border border-emas/20" />

          <div className="cover-isi animate-rise relative my-auto flex flex-col items-center gap-4">
            <Siger className="animate-glow" width={104} height={58} />
            <p className="m-0 text-xs uppercase tracking-[0.32em] text-emas-muda">Undangan Pernikahan</p>
            <Frame w={230} h={290} bg="#1F3A30">
              <div role="img" aria-label="Inisial G dan M" className="relative flex h-full w-full flex-col items-center justify-center bg-[rgba(15,30,24,0.45)]">
                <MegaFill opacity={0.22} />
                <span className="relative font-script text-[96px] leading-[0.95] text-krem">G</span>
                <span className="relative my-1 flex items-center gap-3 font-script text-[34px] leading-none text-emas-muda">
                  <span className="h-px w-10 bg-emas/70" />&amp;<span className="h-px w-10 bg-emas/70" />
                </span>
                <span className="relative font-script text-[96px] leading-[0.95] text-krem">M</span>
              </div>
            </Frame>
            <h1 className="shimmer mt-2 px-4 py-1 font-script text-[58px] font-normal leading-none">
              Gea <span className="text-[40px] text-emas-muda">&amp;</span> Maldini
            </h1>
            <p className="m-0 font-serif text-[19px] tracking-[0.14em] text-[#E9DFC9]">Sabtu · 24 · 10 · 2026</p>
            <div className="mt-3.5 flex flex-col items-center gap-2">
              <p className="m-0 text-[13px] text-[#D8CDB3]">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="m-0 min-w-[240px] border border-emas-muda/55 bg-krem/6 px-5 py-3 font-serif text-[22px] font-semibold text-krem">{tamu}</p>
            </div>
            <button
              type="button"
              onClick={buka}
              className="mt-3.5 inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full border-0 bg-emas px-7 font-sans text-sm font-medium tracking-[0.08em] text-hijau-tua transition-transform active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
              Buka Undangan
            </button>
          </div>
        </section>
      )}
      <div hidden={stage === "cover"} className={`isi ${stage === "cover" ? "" : "animate-rise"}`}>{children}</div>
      <Petals />

      {/* lagu latar: ganti file public/audio/lagu.mp3 untuk mengganti lagu */}
      <audio ref={audio} src="/audio/lagu.mp3" loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      {stage !== "cover" && (
        <button
          type="button"
          onClick={() => (audio.current?.paused ? audio.current.play().catch(() => {}) : audio.current?.pause())}
          aria-label={playing ? "Jeda musik" : "Putar musik"}
          className="fixed bottom-5 right-[max(20px,calc(50%-220px))] z-30 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-emas-muda/60 bg-hijau-tua text-emas-muda shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
        >
          {playing && <span aria-hidden="true" className="absolute inset-0 animate-[ping_2.4s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border border-emas-muda/70" />}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={playing ? "animate-[spin_6s_linear_infinite]" : "opacity-60"}>
            <path d="M9 18V5l11-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="17" cy="16" r="3" />
          </svg>
        </button>
      )}
    </>
  );
}

const TARGET = Date.parse("2026-10-24T09:00:00+07:00");
const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = now === null ? 0 : Math.max(0, TARGET - now);
  const items = [
    [String(Math.floor(diff / 86400000)), "HARI"],
    [pad(Math.floor((diff % 86400000) / 3600000)), "JAM"],
    [pad(Math.floor((diff % 3600000) / 60000)), "MENIT"],
    [pad(Math.floor((diff % 60000) / 1000)), "DETIK"],
  ];
  return (
    <div data-stagger className="grid w-full max-w-[360px] grid-cols-4 gap-2.5">
      {items.map(([v, label]) => (
        <div key={label} data-rv="zoom" className="overflow-hidden rounded-[10px] border border-emas-muda/50 bg-[rgba(15,30,24,0.4)] px-1 py-3.5">
          <div key={v} className="animate-tick font-serif text-4xl font-semibold leading-none">{v}</div>
          <div className="mt-1.5 text-[11px] tracking-[0.1em] text-emas-muda">{label}</div>
        </div>
      ))}
    </div>
  );
}

export function SalinAlamat() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText("Kediaman Mempelai Wanita, Kec. Sagalaherang, Kab. Subang, Jawa Barat").catch(() => {});
        setCopied(true);
      }}
      className="inline-flex min-h-[46px] cursor-pointer items-center gap-2 rounded-full border border-hijau-tua bg-transparent px-5 font-sans text-[13px] text-hijau-tua"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
      <span aria-live="polite">{copied ? "Tersalin" : "Salin Alamat"}</span>
    </button>
  );
}

const FOTO = [couple1, couple2];

export function Galeri() {
  const [lb, setLb] = useState(-1);
  return (
    <>
      <div data-stagger className="flex w-full flex-col gap-3">
        {FOTO.map((src, i) => (
          <button key={i} type="button" onClick={() => setLb(i)} aria-label={`Perbesar foto ${i + 1}`} data-rv="zoom" className="group relative block h-[220px] w-full cursor-zoom-in overflow-hidden rounded-[14px] border-0 bg-transparent p-0">
            <Image src={src} alt="" fill sizes="432px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </button>
        ))}
      </div>
      {lb >= 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto diperbesar"
          onKeyDown={(e) => e.key === "Escape" && setLb(-1)}
          className="fixed inset-0 z-50 box-border flex flex-col items-center justify-center gap-4 bg-[rgba(10,18,14,0.92)] p-6"
        >
          <Image src={FOTO[lb]} alt="Foto Gea dan Maldini" className="block h-auto max-h-[78vh] w-auto max-w-full rounded-xl" />
          <button type="button" autoFocus onClick={() => setLb(-1)} className="min-h-[46px] cursor-pointer rounded-full border border-emas-muda bg-transparent px-[26px] font-sans text-sm text-krem">
            Tutup
          </button>
        </div>
      )}
    </>
  );
}

const field = "rounded-[10px] border border-input bg-white font-sans text-[15px] text-teks";
const labelCls = "flex flex-col gap-1.5 text-[13px] text-teks-2";

export function Rsvp({ initial }: { initial: Wish[] }) {
  const [nama, setNama] = useState("");
  const [hadir, setHadir] = useState<Kehadiran>("Hadir");
  const [jumlah, setJumlah] = useState("1");
  const [ucapan, setUcapan] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [wishes, setWishes] = useState(initial);
  const [err, setErr] = useState("");
  const [terkirim, setTerkirim] = useState(false);
  const [pending, startTransition] = useTransition();
  const [semua, setSemua] = useState(false);

  function kirim(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim()) {
      setErr("Nama wajib diisi.");
      setTerkirim(false);
      return;
    }
    startTransition(async () => {
      const res = await kirimUcapan({ nama, kehadiran: hadir, jumlah, ucapan, website }).catch(() => ({ ok: false as const, error: "Koneksi bermasalah. Coba lagi." }));
      if (!res.ok) {
        setErr(res.error);
        setTerkirim(false);
        return;
      }
      setWishes((w) => [res.wish, ...w]);
      setNama("");
      setUcapan("");
      setErr("");
      setTerkirim(true);
    });
  }

  return (
    <>
      <form onSubmit={kirim} noValidate className="box-border flex w-full flex-col gap-4 rounded-2xl border border-garis bg-[#FBF8F1] p-6">
        <label className={labelCls}>
          Nama
          <input type="text" value={nama} onChange={(e) => { setNama(e.target.value); setErr(""); setTerkirim(false); }} placeholder="Tulis nama Anda" maxLength={MAX_NAMA} autoComplete="name" className={`${field} min-h-[46px] px-3.5`} />
        </label>
        {/* honeypot: disembunyikan dari manusia & pembaca layar, bot biasanya mengisinya */}
        <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
        <div className={labelCls}>
          Kehadiran
          <div role="radiogroup" aria-label="Kehadiran" className="grid grid-cols-3 gap-2">
            {HADIR.map((label) => {
              const on = label === hadir;
              return (
                <button
                  key={label}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setHadir(label)}
                  className={`min-h-11 cursor-pointer rounded-[10px] border px-1.5 font-sans text-[13px] ${on ? "border-hijau-tua bg-hijau-tua text-krem" : "border-input bg-white text-teks-2"}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <label className={labelCls}>
          Jumlah tamu
          <select value={jumlah} onChange={(e) => setJumlah(e.target.value)} className={`${field} min-h-[46px] px-3`}>
            {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} orang</option>)}
          </select>
        </label>
        <label className={labelCls}>
          Ucapan &amp; doa
          <textarea rows={4} value={ucapan} onChange={(e) => setUcapan(e.target.value)} placeholder="Tulis ucapan untuk kedua mempelai" maxLength={MAX_UCAPAN} className={`${field} resize-y px-3.5 py-3`} />
        </label>
        {err && <p role="alert" className="-mt-1 mb-0 text-xs text-[#9B2C1F]">{err}</p>}
        <button type="submit" disabled={pending} className="min-h-12 cursor-pointer rounded-full border-0 bg-hijau-tua font-sans text-sm tracking-[0.08em] text-krem disabled:cursor-wait disabled:opacity-70">
          {pending ? "Mengirim…" : "Kirim Ucapan"}
        </button>
        {terkirim && <p role="status" className="m-0 text-center text-[13px] text-[#2F6B3E]">Hatur nuhun, ucapan Anda sudah terkirim.</p>}
      </form>

      <div className="flex w-full flex-col gap-2.5">
        <p className="m-0 text-[13px] text-redup">{wishes.length} ucapan</p>
        {wishes.length === 0 && (
          <div className="rounded-xl border border-dashed border-input p-[22px] text-center text-[13px] text-redup">Belum ada ucapan. Jadilah yang pertama mengirim doa.</div>
        )}
        {(semua ? wishes : wishes.slice(0, 5)).map((w) => (
          <div key={w.id} className="flex flex-col gap-1.5 rounded-xl border border-[#DDD0AF] bg-[#FBF8F1] p-4">
            <div className="flex items-center justify-between gap-2">
              {/* semua isi ucapan dirender sebagai teks biasa (React meng-escape HTML) — jangan pakai dangerouslySetInnerHTML */}
              <strong className="min-w-0 break-words text-sm font-medium text-teks">{w.nama}</strong>
              <span className="shrink-0 rounded-full bg-krem-tua px-2.5 py-[3px] text-[11px] text-hijau-tua">
                {w.kehadiran}{w.kehadiran === "Hadir" ? ` · ${w.jumlah} orang` : ""}
              </span>
            </div>
            <p className="m-0 whitespace-pre-line break-words text-sm leading-[1.6] text-teks-2">{w.ucapan}</p>
          </div>
        ))}
        {wishes.length > 5 && (
          <button type="button" onClick={() => setSemua(!semua)} aria-expanded={semua} className="mx-auto mt-1 min-h-11 cursor-pointer rounded-full border border-hijau-tua bg-transparent px-6 font-sans text-[13px] tracking-[0.06em] text-hijau-tua">
            {semua ? "Tampilkan lebih sedikit" : `Lihat semua ucapan (${wishes.length})`}
          </button>
        )}
      </div>
    </>
  );
}
