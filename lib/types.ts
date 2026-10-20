// Shapes follow docs/schema-final.sql. Fields marked NEW are not in that
// schema yet — see docs/BACKEND-TODO.md for the migration list.

export type JenisKelamin = 'L' | 'P';

export type Layanan = 'datang' | 'kunjungan' | 'online';

export type Ustad = {
  id: string;
  nama: string;
  no_wa: string;
  alamat: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  lat: number;
  lng: number;
  terverifikasi: boolean;
  aktif: boolean;
  menerima_kasus_baru: boolean;
  jenis_kelamin: JenisKelamin; // NEW
  layanan: Layanan[]; // NEW
  pengalaman_tahun: number; // NEW
};

export type PreferensiUstad = 'L' | 'P' | 'bebas';

export type StatusKasus = 'menunggu' | 'diambil';

export type SumberLokasi = 'gps' | 'wilayah';

// Combines `pengguna` (nama, no_wa, wilayah, lat/lng) and `kasus` from the
// final schema into one record for the mockup.
export type Kasus = {
  id: string;
  kode: string;
  created_at: string;
  nama: string;
  no_wa: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  lat: number;
  lng: number;
  sumber_lokasi: SumberLokasi; // NEW
  layanan: Layanan; // NEW
  preferensi: PreferensiUstad; // NEW
  keluhan: string;
  status: StatusKasus; // schema-final uses `baru`/`matched`; mockup simplifies
  matched_ustad_id: string | null;
  diambil_pada: string | null; // NEW
  ditugaskan_admin: boolean; // NEW
};

// What the public map is allowed to know about an ustadz. No name, phone
// number, address or exact coordinates.
export type UstadPublik = {
  id: string;
  jenis_kelamin: JenisKelamin;
  kecamatan: string;
  kabupaten: string;
  layanan: Layanan[];
  jarak_km: number;
  approx_lat: number;
  approx_lng: number;
};

export const LAYANAN_LABEL: Record<Layanan, string> = {
  datang: 'Datang ke tempat ustadz',
  kunjungan: 'Ustadz datang ke rumah',
  online: 'Konsultasi online',
};

export const PREFERENSI_LABEL: Record<PreferensiUstad, string> = {
  L: 'Ustadz (laki-laki)',
  P: 'Ustadzah (perempuan)',
  bebas: 'Tidak ada preferensi',
};
