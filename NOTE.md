# Taut Ruqyah — Semua File

## Struktur folder

- **01-prototype-html/** — versi awal, satu file HTML tanpa build step
  (index.html + schema.sql + README versi lama).
- **02-nextjs-app/** — versi Next.js yang sudah di-build & terverifikasi
  jalan (`npm run build` sukses).
- **03-dokumentasi/** — `DESIGN.md` (dokumentasi desain lengkap & final) dan
  `schema-final.sql` (skema database final: `pengguna`+`kasus` terpisah,
  provinsi/kabupaten/kecamatan, laporan, tindak_lanjut, dll).

## ⚠️ Penting: skema belum sinkron

`schema.sql` di `01-prototype-html/` dan `02-nextjs-app/` masih versi
**lama** (skema awal: `ustad` + `permintaan`, kolom `area` bebas teks).

Skema yang benar dan final ada di **`03-dokumentasi/schema-final.sql`** —
itu yang harus dipakai kalau mau jalankan database-nya. Kode di
`02-nextjs-app/` (`app/page.js`, `lib/matching.js`) juga masih menyesuaikan
skema lama, belum diupdate untuk struktur `pengguna`/`kasus` yang baru.

Kalau siap, kode Next.js-nya perlu diupdate supaya sesuai `schema-final.sql`
sebelum dipakai jalan beneran.
