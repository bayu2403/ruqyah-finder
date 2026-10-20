import type { Kasus, Ustad, UstadPublik } from '@/lib/types';

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function normalizeWa(input: string) {
  let digits = input.replace(/[^0-9]/g, '');
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  return digits;
}

export function isValidWa(input: string) {
  const digits = normalizeWa(input);
  return /^628\d{7,11}$/.test(digits);
}

export const PUBLIC_RADIUS_M = 1000;

// Shifts a point by a stable 0.6–1.2 km in a direction derived from the id,
// so the public map never reveals where an ustadz actually lives.
// TODO(BE): compute this server-side; the exact lat/lng must never be sent.
function approxLocation(id: string, lat: number, lng: number) {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const angle = ((h % 360) * Math.PI) / 180;
  const km = 0.6 + ((h >> 9) % 60) / 100;
  return {
    lat: lat + (km / 111) * Math.cos(angle),
    lng: lng + (km / (111 * Math.cos((lat * Math.PI) / 180))) * Math.sin(angle),
  };
}

export function isAvailable(u: Ustad) {
  return u.terverifikasi && u.aktif && u.menerima_kasus_baru;
}

export const NEARBY_MAX_KM = 50;

// TODO(BE): becomes a server function, e.g. Supabase RPC
// `ustad_terdekat(lat, lng, limit)` returning only UstadPublik fields.
export function nearbyPublic(list: Ustad[], lat: number, lng: number, limit = 5): UstadPublik[] {
  return list
    .filter(isAvailable)
    .map((u) => ({ u, d: haversineKm(lat, lng, u.lat, u.lng) }))
    .filter(({ d }) => d <= NEARBY_MAX_KM)
    .sort((a, b) => a.d - b.d)
    .slice(0, limit)
    .map(({ u, d }) => {
      const approx = approxLocation(u.id, u.lat, u.lng);
      return {
        id: u.id,
        jenis_kelamin: u.jenis_kelamin,
        kecamatan: u.kecamatan,
        kabupaten: u.kabupaten,
        layanan: u.layanan,
        jarak_km: Math.max(1, Math.round(d)),
        approx_lat: approx.lat,
        approx_lng: approx.lng,
      };
    });
}

// Pool visibility: a new request is shown to ustadz within 15 km. If nobody
// takes it within 2 hours, the radius widens to 50 km. After 6 hours the
// admin dashboard flags it for manual assignment. Online consultations
// ignore distance.
export const POOL_RADIUS_KM = 15;
export const POOL_WIDE_RADIUS_KM = 50;
export const WIDEN_AFTER_H = 2;
export const ESCALATE_AFTER_H = 6;

export function ageHours(kasus: Kasus, now: number) {
  return (now - new Date(kasus.created_at).getTime()) / 3_600_000;
}

export function needsAdmin(kasus: Kasus, now: number) {
  return kasus.status === 'menunggu' && ageHours(kasus, now) >= ESCALATE_AFTER_H;
}

export type PoolItem = { kasus: Kasus; jarak_km: number };

// TODO(BE): enforce the same rules in a database view/RLS policy so an
// ustadz can only ever read requests they are eligible for.
export function poolFor(ustad: Ustad, kasusList: Kasus[], now: number): PoolItem[] {
  if (!isAvailable(ustad)) return [];
  return kasusList
    .filter((k) => k.status === 'menunggu')
    .filter((k) => k.preferensi === 'bebas' || k.preferensi === ustad.jenis_kelamin)
    .filter((k) => ustad.layanan.includes(k.layanan))
    .map((k) => ({ kasus: k, jarak_km: haversineKm(ustad.lat, ustad.lng, k.lat, k.lng) }))
    .filter(({ kasus, jarak_km }) => {
      if (kasus.layanan === 'online') return true;
      const radius = ageHours(kasus, now) >= WIDEN_AFTER_H ? POOL_WIDE_RADIUS_KM : POOL_RADIUS_KM;
      return jarak_km <= radius;
    })
    .sort((a, b) => a.jarak_km - b.jarak_km);
}

export function waLinkToPengguna(kasus: Kasus, ustad: Ustad) {
  const text =
    `Assalamu'alaikum ${kasus.nama}, saya ${ustad.nama} dari RuqyahKu. ` +
    `Saya menerima permintaan ruqyah Anda (kode ${kasus.kode}). ` +
    `Boleh kita bicarakan waktu yang sesuai?`;
  return `https://wa.me/${normalizeWa(kasus.no_wa)}?text=${encodeURIComponent(text)}`;
}
