-- Jalankan sekali di Supabase Dashboard → SQL Editor → New query → Run.
-- Sengaja tanpa "if not exists": kalau project ini sudah punya tabel `wishes`
-- (misalnya dari undangan lain), query akan gagal alih-alih diam-diam bentrok.

create table public.wishes (
  id uuid primary key default gen_random_uuid(),
  nama text not null check (char_length(nama) between 1 and 80),
  kehadiran text not null check (kehadiran in ('Hadir', 'Tidak Hadir', 'Masih Ragu')),
  jumlah smallint not null default 1 check (jumlah between 1 and 4),
  ucapan text not null check (char_length(ucapan) between 1 and 500),
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index wishes_created_at_idx on public.wishes (created_at desc);
create index wishes_ip_hash_created_at_idx on public.wishes (ip_hash, created_at desc);

-- RLS aktif tanpa policy: kunci publik (anon) tidak bisa baca/tulis sama sekali.
-- Semua akses lewat server Next.js dengan secret key.
alter table public.wishes enable row level security;

-- Rate limit di database: maks 3 ucapan per IP per 10 menit.
-- Berlaku di semua instance serverless karena dicek saat insert.
create function public.wishes_rate_limit() returns trigger
language plpgsql
set search_path = public
as $$
begin
  if (
    select count(*) from public.wishes
    where ip_hash = new.ip_hash and created_at > now() - interval '10 minutes'
  ) >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger wishes_rate_limit
  before insert on public.wishes
  for each row execute function public.wishes_rate_limit();
