# Taut Ruqyah

Web sederhana: pengguna masukkan nama, nomor WA, dan alamat → dicocokkan dengan
ustad ruqyah syari terdekat yang sudah diverifikasi → langsung diarahkan ke WhatsApp.

Satu file HTML (`index.html`), tanpa proses build. Database pakai Supabase (Postgres gratis).

## 1. Bikin project Supabase
1. Daftar di https://supabase.com → New Project.
2. Buka **SQL Editor** → New query → paste isi `schema.sql` → Run.
   Ini akan membuat tabel `ustad` dan `permintaan`, plus 2 baris data contoh.
3. Buka **Project Settings > API** → salin:
   - `Project URL`
   - `anon public` key

## 2. Hubungkan kredensial ke web
Buka `index.html`, cari bagian ini di bawah, lalu isi dengan nilai dari langkah 1:

```js
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';
```

## 3. Isi data ustad
Di Supabase, buka **Table Editor > ustad**, tambah baris untuk tiap ustad:
- `nama`, `no_wa` (format 08xx atau 628xx, dua-duanya diterima)
- `lat` / `lng` — WAJIB diisi agar pencarian jarak akurat. Cara cepat dapat
  koordinat: buka Google Maps, klik-tahan lokasi, koordinat muncul di kotak pencarian.
- `area` — nama kota/kecamatan, dipakai sebagai cadangan kalau user tidak
  mengaktifkan lokasi.
- `terverifikasi` — set `true` HANYA setelah Anda memverifikasi manual bahwa
  ustad tersebut benar mengamalkan ruqyah syari (bukan ruqyah bercampur
  praktik yang menyimpang). Ini bagian terpenting dari menjaga kualitas layanan.
- `aktif` — set `false` sementara kalau ustad sedang tidak bisa menerima permintaan.

Baris dengan `terverifikasi = false` tidak akan pernah muncul ke publik.

## 4. Deploy
File `index.html` bisa langsung di-host di mana saja yang menyajikan static file:
- **Vercel** / **Netlify**: drag-and-drop folder ini, selesai.
- **GitHub Pages**: push ke repo, aktifkan Pages di folder ini.

Tidak perlu server, tidak perlu Node.js untuk menjalankan — murni HTML+JS
yang jalan di browser.

## Cara kerja pencocokan
- Kalau user mengizinkan lokasi (tombol "Gunakan lokasi saat ini"): jarak
  dihitung langsung (formula haversine) ke semua ustad yang punya `lat`/`lng`,
  diurutkan dari terdekat, tampil 3 teratas.
- Kalau user tidak mengizinkan lokasi: dicocokkan dengan mencari nama `area`
  ustad di dalam teks alamat yang diketik user. Kurang akurat, jadi tombol
  lokasi lebih disarankan.

## Yang belum ada di versi ini (perlu ditambah kalau mau scale)
- Panel admin untuk kelola ustad (sekarang manual lewat Supabase Table Editor —
  cukup untuk jumlah ustad kecil).
- Notifikasi otomatis ke ustad saat ada permintaan (sekarang user yang
  membuka WhatsApp secara manual).
- Rate limiting / anti-spam pada form.
- Geocoding otomatis dari teks alamat ke koordinat (sekarang mengandalkan
  tombol lokasi browser atau input `lat`/`lng` manual per ustad).
