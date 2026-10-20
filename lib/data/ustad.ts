// HARDCODED SAMPLE — fictional ustadz with placeholder numbers (0812-0000-xxxx).
// TODO(BE): this list must live in the database only. In production the
// browser must never receive it: the public page gets `UstadPublik` rows from
// a server function, and phone numbers/addresses are only visible to admins.

import type { Ustad } from '@/lib/types';

type Seed = Omit<Ustad, 'terverifikasi' | 'aktif' | 'menerima_kasus_baru'> &
  Partial<Pick<Ustad, 'terverifikasi' | 'aktif' | 'menerima_kasus_baru'>>;

const SEED: Seed[] = [
  { id: 'u01', nama: 'Ustadz Ahmad Fauzi, Lc.', no_wa: '081200000101', alamat: 'Jl. Contoh No. 1', kecamatan: 'Kebayoran Baru', kabupaten: 'Jakarta Selatan', provinsi: 'DKI Jakarta', lat: -6.2398, lng: 106.7952, jenis_kelamin: 'L', layanan: ['datang', 'kunjungan'], pengalaman_tahun: 12 },
  { id: 'u02', nama: 'Ustadzah Siti Maryam', no_wa: '081200000102', alamat: 'Jl. Contoh No. 2', kecamatan: 'Tebet', kabupaten: 'Jakarta Selatan', provinsi: 'DKI Jakarta', lat: -6.2291, lng: 106.8566, jenis_kelamin: 'P', layanan: ['datang', 'online'], pengalaman_tahun: 7 },
  { id: 'u03', nama: 'Ustadz Muhammad Ridwan', no_wa: '081200000103', alamat: 'Jl. Contoh No. 3', kecamatan: 'Pasar Minggu', kabupaten: 'Jakarta Selatan', provinsi: 'DKI Jakarta', lat: -6.2812, lng: 106.8401, jenis_kelamin: 'L', layanan: ['kunjungan'], pengalaman_tahun: 9 },
  { id: 'u04', nama: 'Ustadz Hasan Basri', no_wa: '081200000104', alamat: 'Jl. Contoh No. 4', kecamatan: 'Cilandak', kabupaten: 'Jakarta Selatan', provinsi: 'DKI Jakarta', lat: -6.2915, lng: 106.8023, jenis_kelamin: 'L', layanan: ['datang', 'kunjungan', 'online'], pengalaman_tahun: 15 },
  { id: 'u05', nama: 'Ustadz Abdullah Syafi\'i', no_wa: '081200000105', alamat: 'Jl. Contoh No. 5', kecamatan: 'Jatinegara', kabupaten: 'Jakarta Timur', provinsi: 'DKI Jakarta', lat: -6.2228, lng: 106.8712, jenis_kelamin: 'L', layanan: ['datang'], pengalaman_tahun: 6 },
  { id: 'u06', nama: 'Ustadzah Aisyah Rahmawati', no_wa: '081200000106', alamat: 'Jl. Contoh No. 6', kecamatan: 'Duren Sawit', kabupaten: 'Jakarta Timur', provinsi: 'DKI Jakarta', lat: -6.2367, lng: 106.9151, jenis_kelamin: 'P', layanan: ['datang', 'kunjungan'], pengalaman_tahun: 5 },
  { id: 'u07', nama: 'Ustadz Yusuf Hidayat', no_wa: '081200000107', alamat: 'Jl. Contoh No. 7', kecamatan: 'Kebon Jeruk', kabupaten: 'Jakarta Barat', provinsi: 'DKI Jakarta', lat: -6.1952, lng: 106.7734, jenis_kelamin: 'L', layanan: ['datang', 'online'], pengalaman_tahun: 10 },
  { id: 'u08', nama: 'Ustadz Rahmat Hidayatullah', no_wa: '081200000108', alamat: 'Jl. Contoh No. 8', kecamatan: 'Menteng', kabupaten: 'Jakarta Pusat', provinsi: 'DKI Jakarta', lat: -6.1987, lng: 106.8305, jenis_kelamin: 'L', layanan: ['kunjungan', 'online'], pengalaman_tahun: 8, menerima_kasus_baru: false },
  { id: 'u09', nama: 'Ustadz Fadhil Akbar', no_wa: '081200000109', alamat: 'Jl. Contoh No. 9', kecamatan: 'Beji', kabupaten: 'Kota Depok', provinsi: 'Jawa Barat', lat: -6.3698, lng: 106.8215, jenis_kelamin: 'L', layanan: ['datang', 'kunjungan'], pengalaman_tahun: 4 },
  { id: 'u10', nama: 'Ustadzah Khadijah Nur', no_wa: '081200000110', alamat: 'Jl. Contoh No. 10', kecamatan: 'Pamulang', kabupaten: 'Kota Tangerang Selatan', provinsi: 'Banten', lat: -6.3446, lng: 106.7352, jenis_kelamin: 'P', layanan: ['datang', 'online'], pengalaman_tahun: 6 },
  { id: 'u11', nama: 'Ustadz Imam Mahmudi', no_wa: '081200000111', alamat: 'Jl. Contoh No. 11', kecamatan: 'Bekasi Barat', kabupaten: 'Kota Bekasi', provinsi: 'Jawa Barat', lat: -6.2423, lng: 106.9912, jenis_kelamin: 'L', layanan: ['datang', 'kunjungan'], pengalaman_tahun: 11 },
  { id: 'u12', nama: 'Ustadz Baru Mendaftar (belum diverifikasi)', no_wa: '081200000112', alamat: 'Jl. Contoh No. 12', kecamatan: 'Serpong', kabupaten: 'Kota Tangerang Selatan', provinsi: 'Banten', lat: -6.3192, lng: 106.6681, jenis_kelamin: 'L', layanan: ['datang'], pengalaman_tahun: 2, terverifikasi: false },
  { id: 'u13', nama: 'Ustadz Zainal Abidin', no_wa: '081200000113', alamat: 'Jl. Contoh No. 13', kecamatan: 'Coblong', kabupaten: 'Kota Bandung', provinsi: 'Jawa Barat', lat: -6.8851, lng: 107.6124, jenis_kelamin: 'L', layanan: ['datang', 'kunjungan', 'online'], pengalaman_tahun: 14 },
  { id: 'u14', nama: 'Ustadzah Fatimah Az-Zahra', no_wa: '081200000114', alamat: 'Jl. Contoh No. 14', kecamatan: 'Antapani', kabupaten: 'Kota Bandung', provinsi: 'Jawa Barat', lat: -6.9163, lng: 107.6578, jenis_kelamin: 'P', layanan: ['datang', 'kunjungan'], pengalaman_tahun: 8 },
  { id: 'u15', nama: 'Ustadz Umar Faruq', no_wa: '081200000115', alamat: 'Jl. Contoh No. 15', kecamatan: 'Buahbatu', kabupaten: 'Kota Bandung', provinsi: 'Jawa Barat', lat: -6.9527, lng: 107.6531, jenis_kelamin: 'L', layanan: ['kunjungan'], pengalaman_tahun: 5 },
  { id: 'u16', nama: 'Ustadz Lukman Hakim', no_wa: '081200000116', alamat: 'Jl. Contoh No. 16', kecamatan: 'Banyumanik', kabupaten: 'Kota Semarang', provinsi: 'Jawa Tengah', lat: -7.0621, lng: 110.4177, jenis_kelamin: 'L', layanan: ['datang', 'kunjungan'], pengalaman_tahun: 9 },
  { id: 'u17', nama: 'Ustadz Harun Ar-Rasyid', no_wa: '081200000117', alamat: 'Jl. Contoh No. 17', kecamatan: 'Gondokusuman', kabupaten: 'Kota Yogyakarta', provinsi: 'DI Yogyakarta', lat: -7.7816, lng: 110.3829, jenis_kelamin: 'L', layanan: ['datang', 'online'], pengalaman_tahun: 13 },
  { id: 'u18', nama: 'Ustadzah Hafshah Lestari', no_wa: '081200000118', alamat: 'Jl. Contoh No. 18', kecamatan: 'Depok', kabupaten: 'Kabupaten Sleman', provinsi: 'DI Yogyakarta', lat: -7.7632, lng: 110.3921, jenis_kelamin: 'P', layanan: ['datang'], pengalaman_tahun: 4 },
  { id: 'u19', nama: 'Ustadz Ismail Marzuki', no_wa: '081200000119', alamat: 'Jl. Contoh No. 19', kecamatan: 'Gubeng', kabupaten: 'Kota Surabaya', provinsi: 'Jawa Timur', lat: -7.2731, lng: 112.7524, jenis_kelamin: 'L', layanan: ['datang', 'kunjungan'], pengalaman_tahun: 10 },
  { id: 'u20', nama: 'Ustadz Salman Alfarisi', no_wa: '081200000120', alamat: 'Jl. Contoh No. 20', kecamatan: 'Wonokromo', kabupaten: 'Kota Surabaya', provinsi: 'Jawa Timur', lat: -7.2978, lng: 112.7356, jenis_kelamin: 'L', layanan: ['kunjungan', 'online'], pengalaman_tahun: 7 },
  { id: 'u21', nama: 'Ustadz Hamzah Nasution', no_wa: '081200000121', alamat: 'Jl. Contoh No. 21', kecamatan: 'Medan Baru', kabupaten: 'Kota Medan', provinsi: 'Sumatera Utara', lat: 3.5773, lng: 98.6584, jenis_kelamin: 'L', layanan: ['datang', 'kunjungan'], pengalaman_tahun: 12 },
  { id: 'u22', nama: 'Ustadz Arief Daeng', no_wa: '081200000122', alamat: 'Jl. Contoh No. 22', kecamatan: 'Panakkukang', kabupaten: 'Kota Makassar', provinsi: 'Sulawesi Selatan', lat: -5.1472, lng: 119.4423, jenis_kelamin: 'L', layanan: ['datang', 'online'], pengalaman_tahun: 6, aktif: false },
];

export const USTAD_SEED: Ustad[] = SEED.map((u) => ({
  terverifikasi: true,
  aktif: true,
  menerima_kasus_baru: true,
  ...u,
}));
