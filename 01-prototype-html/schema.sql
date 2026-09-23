-- Taut Ruqyah — schema Supabase (Postgres)
-- Jalankan di Supabase: Project > SQL Editor > New query > paste > Run

create extension if not exists "pgcrypto";

-- Data ustad ruqyah syari
create table if not exists ustad (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  no_wa text not null,          -- format bebas, akan dinormalisasi di frontend (08xx atau 628xx)
  area text,                    -- kota/kecamatan, dipakai untuk fallback matching teks
  alamat text,
  lat double precision,         -- wajib diisi agar matching jarak (haversine) aktif
  lng double precision,
  terverifikasi boolean not null default false,  -- hanya tampil ke publik jika true
  aktif boolean not null default true,
  created_at timestamptz not null default now()
);

-- Log permintaan dari user (untuk pemantauan admin, opsional dipakai)
create table if not exists permintaan (
  id uuid primary key default gen_random_uuid(),
  nama text,
  no_wa text,
  alamat text,
  lat double precision,
  lng double precision,
  matched_ustad_id uuid references ustad(id),
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table ustad enable row level security;
alter table permintaan enable row level security;

-- Publik hanya boleh membaca ustad yang aktif & terverifikasi
create policy "publik baca ustad terverifikasi"
  on ustad for select
  using (aktif = true and terverifikasi = true);

-- Publik boleh mencatat permintaan (insert saja, tidak bisa baca data orang lain)
create policy "publik insert permintaan"
  on permintaan for insert
  with check (true);

-- Contoh data ustad (hapus/ganti dengan data asli setelah verifikasi manual)
insert into ustad (nama, no_wa, area, alamat, lat, lng, terverifikasi, aktif) values
  ('Ustad Contoh Satu', '628123456789', 'Petaling Jaya', 'Jalan Contoh No. 1, Petaling Jaya', 3.1073, 101.6067, true, true),
  ('Ustad Contoh Dua', '628987654321', 'Shah Alam', 'Jalan Contoh No. 2, Shah Alam', 3.0733, 101.5185, true, true);
