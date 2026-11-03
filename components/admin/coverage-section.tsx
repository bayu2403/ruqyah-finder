'use client';

import { useMemo, useState } from 'react';
import { MapPinned } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { COVERAGE_STYLE, CoverageMap } from '@/components/map/coverage-map';
import { COVERAGE_LABEL, coverageByKecamatan, recruitmentPriority, type CoverageStatus } from '@/lib/coverage';
import { isAvailable, POOL_RADIUS_KM } from '@/lib/matching';
import type { Kasus, Ustad } from '@/lib/types';

const LEGEND: CoverageStatus[] = ['kosong', 'padat', 'cukup', 'siap'];

export function CoverageSection({ ustad, kasus }: { ustad: Ustad[]; kasus: Kasus[] }) {
  const rows = useMemo(() => coverageByKecamatan(ustad, kasus), [ustad, kasus]);
  const priority = useMemo(() => recruitmentPriority(rows), [rows]);
  const ustadPoints = useMemo(
    () => ustad.filter(isAvailable).map((u) => ({ lat: u.lat, lng: u.lng, nama: u.nama })),
    [ustad]
  );
  const kosong = rows.filter((r) => r.status === 'kosong').length;
  const [focus, setFocus] = useState<{ lat: number; lng: number } | null>(null);

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">Peta cakupan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Lingkaran = permintaan per kecamatan (makin besar makin banyak), titik kecil = ustadz yang siap menerima.
          Wilayah dianggap terlayani bila ada ustadz dalam {POOL_RADIUS_KM} km.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <CoverageMap rows={rows} ustadPoints={ustadPoints} focus={focus} className="h-[380px] w-full bg-muted sm:h-[440px]" />
          <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border px-4 py-3 text-xs text-foreground">
            {LEGEND.map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block h-3.5 w-3.5 rounded-full"
                  style={{
                    background: COVERAGE_STYLE[s].fill,
                    border: `2px ${COVERAGE_STYLE[s].dash ? 'dashed' : 'solid'} ${COVERAGE_STYLE[s].stroke}`,
                  }}
                />
                {COVERAGE_LABEL[s]}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <MapPinned className="h-5 w-5 text-gold" />
            Wilayah belum terjangkau
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {kosong > 0
              ? `${kosong} kecamatan punya permintaan tetapi belum ada ustadz dalam ${POOL_RADIUS_KM} km. Bahan perencanaan penugasan atau pembinaan ustadz lembaga.`
              : 'Semua kecamatan dengan permintaan sudah memiliki ustadz di sekitarnya.'}
          </p>
          {priority.length > 0 && (
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-2 font-medium">Wilayah</th>
                  <th className="pb-2 text-right font-medium">Permintaan</th>
                  <th className="pb-2 text-right font-medium">Ustadz</th>
                </tr>
              </thead>
              <tbody>
                {priority.map((r) => (
                  <tr key={`${r.kabupaten}-${r.kecamatan}`} className="border-t border-border">
                    <td className="py-2.5 pr-2">
                      <button
                        type="button"
                        onClick={() => setFocus({ lat: r.lat, lng: r.lng })}
                        className="text-left font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {r.kecamatan}
                      </button>
                      <p className="text-xs text-muted-foreground">{r.kabupaten}</p>
                      <Badge
                        variant={r.status === 'kosong' ? 'outline' : 'gold'}
                        className={r.status === 'kosong' ? 'mt-1 border-destructive' : 'mt-1'}
                      >
                        {COVERAGE_LABEL[r.status]}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right align-top text-foreground">
                      {r.permintaan}
                      {r.menunggu > 0 && <span className="block text-xs text-muted-foreground">{r.menunggu} menunggu</span>}
                    </td>
                    <td className="py-2.5 text-right align-top font-semibold text-foreground">{r.ustadTersedia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            Klik nama wilayah untuk memperbesar peta. Berdasarkan data demo; versi final dapat difilter per periode.
          </p>
        </div>
      </div>
    </section>
  );
}
