// HARDCODED SAMPLE — a handful of kecamatan for the mockup, with approximate
// centroid coordinates. TODO(BE): replace with the full official
// Kemendagri/BPS region list (provinsi → kabupaten/kota → kecamatan, ~7,200
// kecamatan) served from the database, so names can't be mistyped.

export type Kecamatan = { nama: string; lat: number; lng: number };
export type Kabupaten = { nama: string; kecamatan: Kecamatan[] };
export type Provinsi = { nama: string; kabupaten: Kabupaten[] };

export const WILAYAH: Provinsi[] = [
  {
    nama: 'DKI Jakarta',
    kabupaten: [
      {
        nama: 'Jakarta Selatan',
        kecamatan: [
          { nama: 'Kebayoran Baru', lat: -6.2425, lng: 106.799 },
          { nama: 'Tebet', lat: -6.226, lng: 106.853 },
          { nama: 'Pasar Minggu', lat: -6.284, lng: 106.844 },
          { nama: 'Cilandak', lat: -6.289, lng: 106.799 },
        ],
      },
      {
        nama: 'Jakarta Timur',
        kecamatan: [
          { nama: 'Duren Sawit', lat: -6.234, lng: 106.918 },
          { nama: 'Jatinegara', lat: -6.225, lng: 106.874 },
          { nama: 'Cakung', lat: -6.185, lng: 106.944 },
        ],
      },
      {
        nama: 'Jakarta Barat',
        kecamatan: [
          { nama: 'Kebon Jeruk', lat: -6.193, lng: 106.77 },
          { nama: 'Cengkareng', lat: -6.147, lng: 106.735 },
        ],
      },
      {
        nama: 'Jakarta Pusat',
        kecamatan: [{ nama: 'Menteng', lat: -6.196, lng: 106.833 }],
      },
    ],
  },
  {
    nama: 'Jawa Barat',
    kabupaten: [
      {
        nama: 'Kota Bandung',
        kecamatan: [
          { nama: 'Coblong', lat: -6.887, lng: 107.615 },
          { nama: 'Sukajadi', lat: -6.889, lng: 107.596 },
          { nama: 'Antapani', lat: -6.914, lng: 107.66 },
          { nama: 'Buahbatu', lat: -6.955, lng: 107.656 },
        ],
      },
      {
        nama: 'Kota Bekasi',
        kecamatan: [
          { nama: 'Bekasi Barat', lat: -6.24, lng: 106.988 },
          { nama: 'Bekasi Timur', lat: -6.247, lng: 107.02 },
        ],
      },
      {
        nama: 'Kota Depok',
        kecamatan: [
          { nama: 'Beji', lat: -6.372, lng: 106.819 },
          { nama: 'Sukmajaya', lat: -6.395, lng: 106.85 },
        ],
      },
      {
        nama: 'Kota Bogor',
        kecamatan: [{ nama: 'Bogor Tengah', lat: -6.595, lng: 106.797 }],
      },
    ],
  },
  {
    nama: 'Banten',
    kabupaten: [
      {
        nama: 'Kota Tangerang Selatan',
        kecamatan: [
          { nama: 'Pamulang', lat: -6.342, lng: 106.738 },
          { nama: 'Serpong', lat: -6.317, lng: 106.665 },
        ],
      },
      {
        nama: 'Kota Tangerang',
        kecamatan: [{ nama: 'Cipondoh', lat: -6.188, lng: 106.697 }],
      },
    ],
  },
  {
    nama: 'Jawa Tengah',
    kabupaten: [
      {
        nama: 'Kota Semarang',
        kecamatan: [
          { nama: 'Semarang Tengah', lat: -6.98, lng: 110.417 },
          { nama: 'Banyumanik', lat: -7.065, lng: 110.42 },
        ],
      },
    ],
  },
  {
    nama: 'DI Yogyakarta',
    kabupaten: [
      {
        nama: 'Kota Yogyakarta',
        kecamatan: [{ nama: 'Gondokusuman', lat: -7.784, lng: 110.38 }],
      },
      {
        nama: 'Kabupaten Sleman',
        kecamatan: [{ nama: 'Depok', lat: -7.76, lng: 110.395 }],
      },
    ],
  },
  {
    nama: 'Jawa Timur',
    kabupaten: [
      {
        nama: 'Kota Surabaya',
        kecamatan: [
          { nama: 'Wonokromo', lat: -7.3, lng: 112.738 },
          { nama: 'Gubeng', lat: -7.275, lng: 112.75 },
          { nama: 'Tambaksari', lat: -7.256, lng: 112.76 },
        ],
      },
      {
        nama: 'Kota Malang',
        kecamatan: [{ nama: 'Lowokwaru', lat: -7.937, lng: 112.62 }],
      },
    ],
  },
  {
    nama: 'Sumatera Utara',
    kabupaten: [
      {
        nama: 'Kota Medan',
        kecamatan: [
          { nama: 'Medan Baru', lat: 3.575, lng: 98.66 },
          { nama: 'Medan Johor', lat: 3.53, lng: 98.675 },
        ],
      },
    ],
  },
  {
    nama: 'Sulawesi Selatan',
    kabupaten: [
      {
        nama: 'Kota Makassar',
        kecamatan: [
          { nama: 'Panakkukang', lat: -5.145, lng: 119.44 },
          { nama: 'Rappocini', lat: -5.165, lng: 119.43 },
        ],
      },
    ],
  },
];

export function findKecamatan(provinsi: string, kabupaten: string, kecamatan: string) {
  return WILAYAH.find((p) => p.nama === provinsi)
    ?.kabupaten.find((k) => k.nama === kabupaten)
    ?.kecamatan.find((c) => c.nama === kecamatan);
}

// Reverse-geocodes GPS coordinates to the closest kecamatan in the sample.
// TODO(BE): use a real reverse-geocoding service or point-in-polygon lookup
// against official kecamatan boundaries.
export function nearestKecamatan(lat: number, lng: number) {
  let best: { provinsi: string; kabupaten: string; kecamatan: string; d: number } | null = null;
  for (const p of WILAYAH) {
    for (const k of p.kabupaten) {
      for (const c of k.kecamatan) {
        const d = (c.lat - lat) ** 2 + (c.lng - lng) ** 2;
        if (!best || d < best.d) best = { provinsi: p.nama, kabupaten: k.nama, kecamatan: c.nama, d };
      }
    }
  }
  return best;
}
