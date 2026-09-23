# Taut Ruqyah — Dokumentasi Desain

Web yang menghubungkan orang yang membutuhkan ruqyah syari dengan ustad ruqyah
syari terverifikasi terdekat, lewat WhatsApp. Target wilayah: Indonesia.

## Daftar isi
1. [Gambaran umum](#gambaran-umum)
2. [Skema database](#skema-database)
3. [Alur pengguna (target akhir)](#alur-pengguna-target-akhir)
4. [Draf pertanyaan screening](#draf-pertanyaan-screening)
5. [Cakupan MVP](#cakupan-mvp)
6. [Catatan keamanan & etika](#catatan-keamanan--etika)
7. [Roadmap setelah MVP](#roadmap-setelah-mvp)

---

## Gambaran umum

Masalah yang diselesaikan: banyak orang yang merasa mengalami gangguan
sihir/jin tidak tahu harus menghubungi siapa untuk ruqyah syari yang benar.
Taut Ruqyah menjadi penghubung — bukan otoritas medis maupun syar'i.

Stack: Next.js (frontend + logic) + Supabase/Postgres (database).

---

## Skema database

### `pengguna`
Orang yang mengajukan permintaan ruqyah. Dipisah dari `kasus` supaya satu
orang bisa punya riwayat beberapa kasus tanpa data diri diketik ulang.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | |
| `nama` | text | |
| `no_wa` | text | **unique** — kunci pengenal orang yang sama tanpa sistem login. Bukan verifikasi identitas asli, sekadar dedup. |
| `alamat` | text | alamat lengkap (jalan, no. rumah, dst) |
| `kecamatan` | text | |
| `kabupaten` | text | kabupaten/kota |
| `provinsi` | text | |
| `lat`, `lng` | double | koordinat untuk hitung jarak |

### `ustad`
Data ustad ruqyah syari yang bisa dihubungi.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | |
| `nama` | text | |
| `no_wa` | text | format bebas (08xx/628xx), dinormalisasi di frontend |
| `instagram` | text | opsional, untuk verifikasi kredibilitas |
| `facebook` | text | opsional |
| `alamat` | text | alamat lengkap |
| `kecamatan` | text | |
| `kabupaten` | text | kabupaten/kota |
| `provinsi` | text | |
| `lat`, `lng` | double | wajib diisi agar matching jarak akurat |
| `terverifikasi` | boolean | **gerbang kualitas utama** — hanya tampil ke publik jika `true` |
| `aktif` | boolean | ustad bisa nonaktifkan sementara |
| `menerima_kasus_baru` | boolean | toggle kapasitas — mencegah ustad yang sama terus-menerus di-flood |

### `kasus`
Satu pengajuan/proses dari seorang pengguna.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | |
| `pengguna_id` | uuid FK → `pengguna.id` | |
| `keluhan` | text | keluhan bebas dari pengguna |
| `status` | text | mis. `baru`, `screening`, `menunggu_review`, `matched`, `selesai` |
| `kategori_hasil` | text | hasil screening: `non_medis` / `medis` / `campur` (nullable — belum dipakai di MVP) |
| `red_flag_terpicu` | boolean | true kalau ada jawaban screening yang memicu red flag medis |
| `matched_ustad_id` | uuid FK → `ustad.id` | |

### `pertanyaan_screening`
Master pertanyaan multiple choice untuk screening awal.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | |
| `teks_pertanyaan` | text | |
| `urutan` | int | |
| `versi` | int | agar kasus lama tetap bisa diaudit sesuai versi pertanyaan saat itu |
| `aktif` | boolean | |

### `opsi_screening`
Pilihan jawaban per pertanyaan, dengan kategori dan bobot untuk skoring.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | |
| `pertanyaan_id` | uuid FK → `pertanyaan_screening.id` | |
| `teks_opsi` | text | |
| `kategori` | text | `sihir_jin` / `medis` / `psikologis` / `tidak_jelas` |
| `bobot` | int | untuk skoring kategori dominan |
| `is_red_flag` | boolean | true kalau opsi ini harus memicu override langsung ke arahan RS |

### `jawaban_screening`
Jawaban aktual pengguna per kasus.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | |
| `kasus_id` | uuid FK → `kasus.id` | |
| `pertanyaan_id` | uuid FK → `pertanyaan_screening.id` | |
| `opsi_id` | uuid FK → `opsi_screening.id` | |

### `laporan`
Mekanisme lapor/flag ustad — bukan hanya verifikasi sekali di awal.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | |
| `kasus_id` | uuid FK → `kasus.id` | |
| `ustad_id` | uuid FK → `ustad.id` | |
| `isi_laporan` | text | |
| `status` | text | mis. `baru`, `ditinjau`, `selesai` |
| `created_at` | timestamp | |

### `tindak_lanjut`
Follow-up ke pengguna setelah kasus selesai, untuk evaluasi kualitas ustad
dari waktu ke waktu (bukan cuma verifikasi one-time).

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid PK | |
| `kasus_id` | uuid FK → `kasus.id`, unique (relasi 1:1) | |
| `dikirim_pada` | timestamp | |
| `respon` | text | |
| `status` | text | mis. `menunggu`, `terkirim`, `dibalas` |

### Relasi
```
pengguna (1) ──< kasus (banyak)              mengajukan
ustad (1) ──< kasus (banyak)                 dicocokkan ke
kasus (1) ──< jawaban_screening (banyak)     punya
pertanyaan_screening (1) ──< opsi_screening (banyak)      punya
pertanyaan_screening (1) ──< jawaban_screening (banyak)   dijawab lewat
opsi_screening (1) ──< jawaban_screening (banyak)         dipilih sebagai
kasus (1) ──< laporan (banyak)               bisa dilaporkan
ustad (1) ──< laporan (banyak)               dilaporkan atas
kasus (1) ── tindak_lanjut (1)               difollow-up
```

---

## Alur pengguna (target akhir)

1. Pengguna isi **keluhan** dulu (bukan data diri) — supaya orang yang cemas
   lebih nyaman cerita dulu sebelum kasih data pribadi, dan menaikkan
   completion rate.
2. Screening MCQ berdasarkan `pertanyaan_screening` + `opsi_screening`.
3. Kalau ada jawaban dengan `is_red_flag = true` → **langsung** tampilkan
   arahan ke IGD/RS/bantuan profesional, apa pun skor totalnya. Ini
   mengalahkan semua logika lain.
4. Kalau tidak ada red flag, skor kategori dari `bobot` menentukan
   `kategori_hasil`:
   - **Non-medis** → lanjut ke input data diri + alamat (dibuat/dicocokkan
     jadi baris `pengguna`) → matching ustad
   - **Medis** → tampilkan rekomendasi cek RS dulu (disclaimer, tidak
     total-block)
   - **Campur/tidak jelas** → tampilkan dua opsi, biarkan pengguna pilih;
     kasus ini yang baru dikasih status `menunggu_review` agar ustad bisa
     lihat ringkasan sebelum menerima
5. Data diri + alamat lengkap (provinsi/kabupaten/kecamatan/alamat) diminta
   di step terakhir sebelum matching. Kalau `no_wa` sudah pernah dipakai
   sebelumnya, kasus baru ini nempel ke baris `pengguna` yang sama.
6. Setelah dicocokkan, pengguna hubungi ustad via WA.
7. Beberapa hari kemudian, `tindak_lanjut` mengirim follow-up otomatis untuk
   evaluasi kualitas.

---

## Draf pertanyaan screening

**Ini draf kasar sebagai starting point, bukan konten siap produksi.**
Kategori dan bobot di bawah adalah pola umum dari literatur ruqyah awam —
**wajib direview dan divalidasi oleh ustad yang kompeten dan tenaga
medis/psikolog** sebelum dipakai sungguhan. Salah kategorisasi bisa
berakibat fatal, misalnya gejala medis serius yang tertunda penanganannya
karena dikira gangguan ghaib.

| # | Pertanyaan | Opsi jawaban | Kategori | Red flag? |
|---|---|---|---|---|
| 1 | Keluhan mulai muncul sejak kapan? | Mendadak tanpa sebab jelas | sihir_jin | |
| | | Bertahap/berkembang | medis | |
| | | Setelah kejadian traumatis | psikologis | |
| 2 | Apakah pernah mimpi buruk berulang dengan pola serupa? | Sering, pola sama | sihir_jin | |
| | | Kadang, tidak beraturan | tidak_jelas | |
| | | Jarang/tidak pernah | medis | |
| 3 | Apakah muncul rasa takut berlebihan saat mendengar/membaca ayat Al-Qur'an? | Ya, kuat | sihir_jin | |
| | | Sedikit tidak nyaman | tidak_jelas | |
| | | Tidak ada reaksi khusus | medis | |
| 4 | Apakah pernah kejang, kehilangan kesadaran, atau gerakan tubuh di luar kendali? | Ya | medis | **ya** |
| | | Tidak | tidak_jelas | |
| 5 | Apakah ada riwayat diagnosis medis/psikiatri sebelumnya untuk keluhan ini? | Ya, sudah didiagnosis | medis | |
| | | Sudah cek tapi tidak ditemukan apa-apa | tidak_jelas | |
| | | Belum pernah cek | tidak_jelas | |
| 6 | Apakah muncul nyeri dada hebat, sesak napas berat, atau demam tinggi terus-menerus? | Ya | medis | **ya** |
| | | Tidak | tidak_jelas | |
| 7 | Apakah pernah ada pikiran untuk menyakiti diri sendiri? | Ya | medis | **ya** — arahkan ke bantuan profesional segera |
| | | Tidak | tidak_jelas | |
| 8 | Apakah keluhan berhubungan dengan kejadian tertentu (habis dari suatu tempat, konflik dengan seseorang, dll)? | Ya, jelas terkait | sihir_jin | |
| | | Tidak ada kaitan jelas | tidak_jelas | |

---

## Cakupan MVP

**Aktif di MVP:**
- Form keluhan → data diri + alamat lengkap (provinsi/kabupaten/kecamatan)
  → matching ustad terdekat → link WA
- Tabel `pengguna`, `kasus`, dan `ustad` terpakai penuh
- Dedup pengguna berdasarkan `no_wa` unique

**Skema sudah siap, logika/UI belum digarap:**
- `pertanyaan_screening`, `opsi_screening`, `jawaban_screening` — tabel ada,
  belum dipakai untuk gating keputusan
- `laporan` — tabel ada, belum ada UI lapor
- `tindak_lanjut` — tabel ada, belum ada mekanisme follow-up otomatis
- Kolom `kategori_hasil` dan `red_flag_terpicu` di `kasus` boleh `null` dulu
- Panel admin kelola ustad — pakai Supabase Table Editor dulu, bukan UI
  custom (lihat catatan di bawah)

**Kenapa dipisah begini**: menunda logika screening sampai konten
pertanyaan+bobotnya benar-benar direview pihak kompeten, sambil skema
sudah siap dipakai begitu konten itu selesai — tidak perlu migrasi besar
nanti.

**Soal panel admin**: Supabase Table Editor sudah cukup jadi admin panel di
MVP selama yang kelola data ustad cuma developer sendiri (verifikasi tetap
manual, cuma alatnya beda). Kalau ke depannya ada orang non-teknis yang ikut
kelola data ustad, ini perlu naik jadi UI custom — evaluasi ulang begitu ada
kebutuhan itu.

---

## Catatan keamanan & etika

- **Red flag selalu menang.** Tidak ada skenario di mana skor screening
  mengalahkan jawaban red flag — itu harus selalu langsung mengarah ke
  rekomendasi RS/bantuan profesional.
- **Bahasa hasil harus "indikasi awal", bukan "diagnosis".** Platform ini
  bukan otoritas medis maupun syar'i.
- **Verifikasi ustad bukan one-time.** Tabel `laporan` dan `tindak_lanjut`
  ada supaya kualitas bisa dipantau berkelanjutan, bukan cuma disetujui
  sekali di pendaftaran.
- **Data pengguna sensitif** — keluhan dan alamat harus dijaga privasinya,
  tidak dipublikasikan, disimpan seminimal mungkin, dan tidak bisa dibaca
  lewat anon key (lihat kebijakan RLS di `schema.sql`).
- `no_wa` di `pengguna` sebagai kunci dedup **bukan** verifikasi identitas
  asli — nomor bisa salah ketik atau bukan milik sendiri. Cukup untuk MVP,
  bukan pengaman identitas yang kuat.
- Kapasitas ustad (`menerima_kasus_baru`) mencegah ustad yang sama
  kebanjiran kasus terus-menerus selagi jumlah ustad terverifikasi masih
  sedikit.

---

## Roadmap setelah MVP

1. Bangun UI screening MCQ + logika skoring (setelah konten direview)
2. UI laporan/flag ustad
3. Follow-up otomatis via WA (`tindak_lanjut`)
4. Panel admin custom untuk kelola ustad (kalau ada admin non-teknis)
5. Rate limiting / anti-spam pada form
6. Validasi wilayah (provinsi/kabupaten/kecamatan) terhadap daftar resmi
   Kemendagri, bukan teks bebas — untuk menghindari data ganda akibat typo
   (mis. "Jakarta Selatan" vs "Jaksel")
