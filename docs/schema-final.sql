-- Taut Ruqyah — schema Supabase (Postgres)
-- Jalankan di Supabase: Project > SQL Editor > New query > paste > Run
--
-- Catatan skema:
-- - pengguna dan kasus dipisah: 1 pengguna bisa punya banyak kasus.
--   no_wa di pengguna UNIQUE, dipakai sebagai kunci pengenal orang yang sama
--   (bukan verifikasi identitas asli, sekadar dedup tanpa sistem login).
-- - Lokasi (ustad & pengguna) pakai provinsi/kabupaten/kecamatan/alamat +
--   lat/lng. Struktur ini khusus Indonesia.
-- - Tabel screening (pertanyaan_screening, opsi_screening, jawaban_screening)
--   dan laporan/tindak_lanjut sudah dibuat, TAPI belum dipakai logikanya di
--   MVP — MVP cuma jalan sampai pencocokan ustad. Lihat DESIGN.md.

create extension if not exists "pgcrypto";

-- ============================================================
-- PENGGUNA — orang yang mengajukan permintaan ruqyah
-- ============================================================
create table if not exists pengguna (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  no_wa text not null unique,
  alamat text,
  kecamatan text,
  kabupaten text,
  provinsi text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

-- ============================================================
-- USTAD — data ustad ruqyah syari
-- ============================================================
create table if not exists ustad (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  no_wa text not null,
  instagram text,
  facebook text,
  alamat text,
  kecamatan text,
  kabupaten text,
  provinsi text,
  lat double precision,          -- wajib diisi agar matching jarak (haversine) aktif
  lng double precision,
  terverifikasi boolean not null default false,   -- gerbang kualitas utama
  aktif boolean not null default true,
  menerima_kasus_baru boolean not null default true, -- toggle kapasitas
  created_at timestamptz not null default now()
);

-- ============================================================
-- KASUS — satu pengajuan/proses dari seorang pengguna
-- ============================================================
create table if not exists kasus (
  id uuid primary key default gen_random_uuid(),
  pengguna_id uuid not null references pengguna(id) on delete cascade,
  keluhan text,
  status text not null default 'baru',       -- baru | screening | menunggu_review | matched | selesai
  kategori_hasil text,                        -- non_medis | medis | campur (null di MVP)
  red_flag_terpicu boolean not null default false,
  matched_ustad_id uuid references ustad(id),
  created_at timestamptz not null default now()
);

-- ============================================================
-- SCREENING — belum dipakai logikanya di MVP, skema disiapkan dulu
-- ============================================================
create table if not exists pertanyaan_screening (
  id uuid primary key default gen_random_uuid(),
  teks_pertanyaan text not null,
  urutan int not null default 0,
  versi int not null default 1,   -- kasus lama tetap teraudit sesuai versi saat itu
  aktif boolean not null default true
);

create table if not exists opsi_screening (
  id uuid primary key default gen_random_uuid(),
  pertanyaan_id uuid not null references pertanyaan_screening(id) on delete cascade,
  teks_opsi text not null,
  kategori text not null,          -- sihir_jin | medis | psikologis | tidak_jelas
  bobot int not null default 0,
  is_red_flag boolean not null default false  -- true = override langsung ke arahan RS
);

create table if not exists jawaban_screening (
  id uuid primary key default gen_random_uuid(),
  kasus_id uuid not null references kasus(id) on delete cascade,
  pertanyaan_id uuid not null references pertanyaan_screening(id),
  opsi_id uuid not null references opsi_screening(id),
  created_at timestamptz not null default now()
);

-- ============================================================
-- LAPORAN — mekanisme lapor/flag ustad (tabel siap, belum ada UI di MVP)
-- ============================================================
create table if not exists laporan (
  id uuid primary key default gen_random_uuid(),
  kasus_id uuid not null references kasus(id),
  ustad_id uuid not null references ustad(id),
  isi_laporan text not null,
  status text not null default 'baru',   -- baru | ditinjau | selesai
  created_at timestamptz not null default now()
);

-- ============================================================
-- TINDAK_LANJUT — follow-up pasca kasus (tabel siap, belum ada mekanisme di MVP)
-- ============================================================
create table if not exists tindak_lanjut (
  id uuid primary key default gen_random_uuid(),
  kasus_id uuid not null unique references kasus(id),
  dikirim_pada timestamptz,
  respon text,
  status text not null default 'menunggu',  -- menunggu | terkirim | dibalas
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Prinsip: anon (frontend publik) cuma boleh INSERT data miliknya sendiri
-- dan SELECT data yang memang untuk ditampilkan ke publik (ustad terverifikasi,
-- pertanyaan screening aktif). Semua data sensitif (kasus, laporan,
-- tindak_lanjut, data pengguna) TIDAK bisa dibaca lewat anon key — baca oleh
-- admin dilakukan lewat service role key di server, bukan dari browser.
-- ============================================================

alter table pengguna enable row level security;
alter table ustad enable row level security;
alter table kasus enable row level security;
alter table pertanyaan_screening enable row level security;
alter table opsi_screening enable row level security;
alter table jawaban_screening enable row level security;
alter table laporan enable row level security;
alter table tindak_lanjut enable row level security;

-- pengguna: publik cuma bisa insert (daftar), tidak bisa baca data pengguna lain
create policy "publik insert pengguna"
  on pengguna for insert
  with check (true);

-- ustad: publik hanya baca yang aktif & terverifikasi
create policy "publik baca ustad terverifikasi"
  on ustad for select
  using (aktif = true and terverifikasi = true);

-- kasus: publik cuma bisa insert (submit kasus baru), tidak bisa baca
create policy "publik insert kasus"
  on kasus for insert
  with check (true);

-- pertanyaan_screening & opsi_screening: publik boleh baca yang aktif
-- (dipakai app buat render form screening — meski logikanya belum aktif di MVP)
create policy "publik baca pertanyaan aktif"
  on pertanyaan_screening for select
  using (aktif = true);

create policy "publik baca opsi screening"
  on opsi_screening for select
  using (true);

-- jawaban_screening: publik cuma bisa insert
create policy "publik insert jawaban screening"
  on jawaban_screening for insert
  with check (true);

-- laporan: publik cuma bisa insert (lapor kasus/ustad), tidak bisa baca laporan orang lain
create policy "publik insert laporan"
  on laporan for insert
  with check (true);

-- tindak_lanjut: tidak ada akses publik sama sekali (insert/select/update
-- semua lewat service role key di server)

-- ============================================================
-- CONTOH DATA (hapus/ganti dengan data asli setelah verifikasi manual)
-- ============================================================
insert into ustad (nama, no_wa, kecamatan, kabupaten, provinsi, alamat, lat, lng, terverifikasi, aktif) values
  ('Ustad Contoh Satu', '6281234567890', 'Kebayoran Baru', 'Jakarta Selatan', 'DKI Jakarta', 'Jalan Contoh No. 1, Kebayoran Baru', -6.2440, 106.7990, true, true),
  ('Ustad Contoh Dua', '6289876543210', 'Coblong', 'Bandung', 'Jawa Barat', 'Jalan Contoh No. 2, Coblong', -6.8915, 107.6107, true, true);
