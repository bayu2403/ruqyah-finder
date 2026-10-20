'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PUBLIC_RADIUS_M } from '@/lib/matching';
import type { UstadPublik } from '@/lib/types';

const SHIELD =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2L4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-5z" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const INDONESIA_CENTER: [number, number] = [-2.5, 118];

export function NearbyMap({
  user,
  ustadz,
  className,
}: {
  user: { lat: number; lng: number } | null;
  ustadz: UstadPublik[];
  className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const leaflet = useRef<typeof import('leaflet') | null>(null);

  useEffect(() => {
    let cancelled = false;
    import('leaflet').then((L) => {
      if (cancelled || !el.current || map.current) return;
      leaflet.current = L;
      map.current = L.map(el.current, { scrollWheelZoom: false }).setView(INDONESIA_CENTER, 4);
      // TODO(BE/ops): OSM's public tiles are fine for a demo; for production
      // traffic use a tile provider (e.g. MapTiler, Stadia) per OSM's usage policy.
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
  useEffect(draw, [user?.lat, user?.lng, ustadz]);

  function draw() {
    const L = leaflet.current;
    if (!L || !map.current || !layer.current) return;
    layer.current.clearLayers();

    const points: [number, number][] = [];
    if (user) {
      points.push([user.lat, user.lng]);
      L.marker([user.lat, user.lng], {
        icon: L.divIcon({ className: '', html: '<div class="rk-user-dot"></div>', iconSize: [22, 22], iconAnchor: [11, 11] }),
        zIndexOffset: 1000,
      })
        .bindTooltip('Lokasi Anda', { direction: 'top', offset: [0, -10] })
        .addTo(layer.current);
    }

    for (const u of ustadz) {
      points.push([u.approx_lat, u.approx_lng]);
      L.circle([u.approx_lat, u.approx_lng], {
        radius: PUBLIC_RADIUS_M,
        color: '#063c2c',
        weight: 1,
        opacity: 0.35,
        fillColor: '#063c2c',
        fillOpacity: 0.08,
      }).addTo(layer.current);
      const label = u.jenis_kelamin === 'P' ? 'Ustadzah' : 'Ustadz';
      L.marker([u.approx_lat, u.approx_lng], {
        icon: L.divIcon({ className: '', html: `<div class="rk-ustadz-pin">${SHIELD}</div>`, iconSize: [32, 32], iconAnchor: [16, 16] }),
      })
        .bindTooltip(`${label} terverifikasi · ${u.kecamatan} · ±${u.jarak_km} km`, { direction: 'top', offset: [0, -14] })
        .addTo(layer.current);
    }

    if (points.length === 1) map.current.setView(points[0], 13);
    else if (points.length > 1) map.current.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 14 });
  }

  return <div ref={el} className={className} role="region" aria-label="Peta ustadz terdekat" />;
}
