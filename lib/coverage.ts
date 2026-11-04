import { WILAYAH } from '@/lib/data/wilayah';
import { haversineKm, isAvailable, POOL_RADIUS_KM } from '@/lib/matching';
import type { Kasus, Ustad } from '@/lib/types';

// kosong: requests but no available ustadz within the pool radius (recruit here)
// padat:  at least PADAT_RATIO still-waiting requests per available ustadz (add capacity)
// cukup:  requests and enough ustadz
// siap:   ustadz available, no requests yet
export type CoverageStatus = 'kosong' | 'padat' | 'cukup' | 'siap';

export const PADAT_RATIO = 2;

export type CoverageRow = {
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  lat: number;
  lng: number;
  permintaan: number;
  menunggu: number;
  ustadTersedia: number;
  status: CoverageStatus;
};

export const COVERAGE_LABEL: Record<CoverageStatus, string> = {
  kosong: 'Belum ada ustadz',
  padat: 'Perlu tambahan ustadz',
  cukup: 'Terlayani',
  siap: 'Ustadz siap, belum ada permintaan',
};

// TODO(BE): becomes an admin-only SQL view aggregated per kecamatan.
export function coverageByKecamatan(ustadList: Ustad[], kasusList: Kasus[]): CoverageRow[] {
  const available = ustadList.filter(isAvailable);
  const rows: CoverageRow[] = [];
  for (const p of WILAYAH) {
    for (const k of p.kabupaten) {
      for (const c of k.kecamatan) {
        const kasus = kasusList.filter((x) => x.kabupaten === k.nama && x.kecamatan === c.nama);
        const permintaan = kasus.length;
        const menunggu = kasus.filter((x) => x.status === 'menunggu').length;
        const ustadTersedia = available.filter((u) => haversineKm(c.lat, c.lng, u.lat, u.lng) <= POOL_RADIUS_KM).length;
        if (permintaan === 0 && ustadTersedia === 0) continue;
        const status: CoverageStatus =
          permintaan === 0 ? 'siap'
          : ustadTersedia === 0 ? 'kosong'
          : menunggu / ustadTersedia >= PADAT_RATIO ? 'padat'
          : 'cukup';
        rows.push({
          provinsi: p.nama,
          kabupaten: k.nama,
          kecamatan: c.nama,
          lat: c.lat,
          lng: c.lng,
          permintaan,
          menunggu,
          ustadTersedia,
          status,
        });
      }
    }
  }
  return rows;
}

export function recruitmentPriority(rows: CoverageRow[]) {
  return rows
    .filter((r) => r.status === 'kosong' || r.status === 'padat')
    .sort((a, b) => (a.status === b.status ? b.permintaan - a.permintaan : a.status === 'kosong' ? -1 : 1));
}
