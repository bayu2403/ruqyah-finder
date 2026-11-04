'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { COVERAGE_LABEL, type CoverageRow, type CoverageStatus } from '@/lib/coverage';
import { POOL_RADIUS_KM } from '@/lib/matching';

// Hex mirrors of the design tokens; Leaflet paths can't read CSS variables.
export const COVERAGE_STYLE: Record<CoverageStatus, { fill: string; stroke: string; dash?: string }> = {
  kosong: { fill: '#e5715a', stroke: '#8a2b1a', dash: '4 3' },
  padat: { fill: '#d6a039', stroke: '#6b4a10' },
  cukup: { fill: '#063c2c', stroke: '#063c2c' },
  siap: { fill: '#ffffff', stroke: '#063c2c' },
};

const DRAW_ORDER: CoverageStatus[] = ['siap', 'cukup', 'padat', 'kosong'];

export function CoverageMap({
  rows,
  ustadPoints,
  focus,
  className,
}: {
  rows: CoverageRow[];
  ustadPoints: { lat: number; lng: number; nama: string }[];
  focus: { lat: number; lng: number } | null;
  className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const leaflet = useRef<typeof import('leaflet') | null>(null);
  const fitted = useRef(false);

  useEffect(() => {
    let cancelled = false;
    import('leaflet').then((L) => {
      if (cancelled || !el.current || map.current) return;
      leaflet.current = L;
      map.current = L.map(el.current, { scrollWheelZoom: false }).setView([-2.5, 112], 5);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map.current);
      layer.current = L.layerGroup().addTo(map.current);
      draw();
    });
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(draw, [rows, ustadPoints]);

  useEffect(() => {
    if (focus && map.current) map.current.flyTo([focus.lat, focus.lng], 10, { duration: 0.8 });
  }, [focus]);

  function draw() {
    const L = leaflet.current;
    if (!L || !map.current || !layer.current) return;
    layer.current.clearLayers();

    for (const u of ustadPoints) {
      L.circleMarker([u.lat, u.lng], { radius: 3, color: '#063c2c', weight: 1, fillColor: '#063c2c', fillOpacity: 0.9 })
        .bindTooltip(u.nama, { direction: 'top' })
        .addTo(layer.current);
    }

    // gaps drawn last so they stay visible where circles overlap
    const ordered = [...rows].sort((a, b) => DRAW_ORDER.indexOf(a.status) - DRAW_ORDER.indexOf(b.status));
    for (const r of ordered) {
      const s = COVERAGE_STYLE[r.status];
      L.circleMarker([r.lat, r.lng], {
        radius: r.permintaan ? 7 + 4 * Math.sqrt(r.permintaan) : 6,
        color: s.stroke,
        weight: 2,
        dashArray: s.dash,
        fillColor: s.fill,
        fillOpacity: r.status === 'siap' ? 0.9 : 0.55,
      })
        .bindTooltip(
          `<strong>${r.kecamatan}, ${r.kabupaten}</strong><br>${COVERAGE_LABEL[r.status]}<br>` +
            `${r.permintaan} permintaan (${r.menunggu} menunggu) · ${r.ustadTersedia} ustadz ≤${POOL_RADIUS_KM} km`,
          { direction: 'top' }
        )
        .addTo(layer.current);
    }

    if (!fitted.current && rows.length > 1) {
      map.current.fitBounds(L.latLngBounds(rows.map((r) => [r.lat, r.lng] as [number, number])), { padding: [24, 24] });
      fitted.current = true;
    }
  }

  // isolate keeps Leaflet's z-index 400–1000 layers from rising above the navbar and dialogs
  return <div ref={el} className={`isolate ${className ?? ''}`} role="region" aria-label="Peta cakupan ustadz dan permintaan" />;
}
