'use client';

// MOCK DATABASE — everything is stored in this browser's localStorage so the
// static mockup can demo the full flow (submit → pool → ambil → admin) across
// tabs. TODO(BE): every exported function here maps to a Supabase call; see
// docs/BACKEND-TODO.md for the table, policy and RPC each one needs.

import { useSyncExternalStore } from 'react';
import { USTAD_SEED } from '@/lib/data/ustad';
import { findKecamatan } from '@/lib/data/wilayah';
import type { Kasus, Layanan, PreferensiUstad, SumberLokasi, Ustad } from '@/lib/types';

const KEY = 'ruqyahku:mock-db:v2';
const EVENT = 'ruqyahku:mock-db-change';

export type DB = { ustad: Ustad[]; kasus: Kasus[] };

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3_600_000).toISOString();
}

function seedKasus(): Kasus[] {
  const base = {
    sumber_lokasi: 'wilayah' as const,
    keluhan: '',
    matched_ustad_id: null,
    diambil_pada: null,
    ditugaskan_admin: false,
  };
  return [
    { ...base, id: 'k-seed-1', kode: 'RQ-A1B2', created_at: hoursAgo(0.2), nama: 'Budi (contoh)', no_wa: '081200000901', provinsi: 'DKI Jakarta', kabupaten: 'Jakarta Selatan', kecamatan: 'Kebayoran Baru', lat: -6.2441, lng: 106.8012, layanan: 'kunjungan', preferensi: 'bebas', status: 'menunggu' },
    { ...base, id: 'k-seed-2', kode: 'RQ-C3D4', created_at: hoursAgo(0.7), nama: 'Rina (contoh)', no_wa: '081200000902', provinsi: 'DKI Jakarta', kabupaten: 'Jakarta Selatan', kecamatan: 'Tebet', lat: -6.2275, lng: 106.8498, layanan: 'datang', preferensi: 'P', status: 'menunggu', keluhan: 'Sering mimpi buruk dan gelisah setiap malam.' },
    { ...base, id: 'k-seed-3', kode: 'RQ-E5F6', created_at: hoursAgo(3), nama: 'Dewi (contoh)', no_wa: '081200000903', provinsi: 'Jawa Barat', kabupaten: 'Kota Bandung', kecamatan: 'Sukajadi', lat: -6.8902, lng: 107.5941, layanan: 'datang', preferensi: 'bebas', status: 'menunggu' },
    { ...base, id: 'k-seed-4', kode: 'RQ-G7H8', created_at: hoursAgo(7.5), nama: 'Agus (contoh)', no_wa: '081200000904', provinsi: 'Jawa Tengah', kabupaten: 'Kota Semarang', kecamatan: 'Semarang Tengah', lat: -6.9811, lng: 110.4153, layanan: 'kunjungan', preferensi: 'L', status: 'menunggu' },
    { ...base, id: 'k-seed-5', kode: 'RQ-J9K0', created_at: hoursAgo(26), nama: 'Fajar (contoh)', no_wa: '081200000905', provinsi: 'DKI Jakarta', kabupaten: 'Jakarta Selatan', kecamatan: 'Cilandak', lat: -6.2876, lng: 106.7969, layanan: 'datang', preferensi: 'bebas', status: 'diambil', matched_ustad_id: 'u04', diambil_pada: hoursAgo(25) },
    ...HISTORY.map(([n, h, provinsi, kabupaten, kecamatan, layanan, preferensi, ustadId, admin], i): Kasus => {
      const c = findKecamatan(provinsi, kabupaten, kecamatan)!;
      const id = String(n).padStart(2, '0');
      return {
        ...base,
        id: `k-seed-${n}`,
        kode: `RQ-H${id}X`,
        created_at: hoursAgo(h),
        nama: `Pemohon ${id} (contoh)`,
        no_wa: `0812000009${id}`,
        provinsi,
        kabupaten,
        kecamatan,
        lat: c.lat + ((i % 3) - 1) * 0.004,
        lng: c.lng + ((i % 2) - 0.5) * 0.006,
        layanan,
        preferensi,
        status: ustadId ? 'diambil' : 'menunggu',
        matched_ustad_id: ustadId,
        diambil_pada: ustadId ? hoursAgo(h - 1) : null,
        ditugaskan_admin: admin,
      };
    }),
  ];
}

// Demo history so the admin coverage map has something to show: claimed
// requests across served areas, plus waiting/admin-assigned ones in areas
// with no ustadz nearby (Bogor, Malang, Makassar).
// [n, hoursAgo, provinsi, kabupaten, kecamatan, layanan, preferensi, ustadId|null, assignedByAdmin]
const HISTORY: [number, number, string, string, string, Layanan, PreferensiUstad, string | null, boolean][] = [
  [6, 9, 'Jawa Barat', 'Kota Bogor', 'Bogor Tengah', 'kunjungan', 'bebas', null, false],
  [7, 50, 'Jawa Barat', 'Kota Bogor', 'Bogor Tengah', 'datang', 'bebas', 'u09', true],
  [8, 120, 'Jawa Barat', 'Kota Bogor', 'Bogor Tengah', 'kunjungan', 'L', 'u09', true],
  [9, 10, 'Jawa Timur', 'Kota Malang', 'Lowokwaru', 'datang', 'bebas', null, false],
  [10, 75, 'Jawa Timur', 'Kota Malang', 'Lowokwaru', 'online', 'bebas', 'u20', true],
  [11, 12, 'Sulawesi Selatan', 'Kota Makassar', 'Rappocini', 'datang', 'bebas', null, false],
  [12, 30, 'Sulawesi Selatan', 'Kota Makassar', 'Panakkukang', 'kunjungan', 'P', null, false],
  [13, 48, 'DKI Jakarta', 'Jakarta Selatan', 'Tebet', 'datang', 'P', 'u02', false],
  [14, 96, 'DKI Jakarta', 'Jakarta Selatan', 'Tebet', 'kunjungan', 'bebas', 'u01', false],
  [15, 140, 'DKI Jakarta', 'Jakarta Selatan', 'Kebayoran Baru', 'datang', 'bebas', 'u01', false],
  [16, 24, 'DKI Jakarta', 'Jakarta Timur', 'Jatinegara', 'datang', 'L', 'u05', false],
  [17, 72, 'DKI Jakarta', 'Jakarta Timur', 'Cakung', 'kunjungan', 'P', 'u06', false],
  [18, 150, 'DKI Jakarta', 'Jakarta Barat', 'Cengkareng', 'datang', 'bebas', 'u07', false],
  [19, 46, 'Jawa Barat', 'Kota Depok', 'Beji', 'kunjungan', 'bebas', 'u09', false],
  [20, 22, 'Banten', 'Kota Tangerang Selatan', 'Pamulang', 'online', 'P', 'u10', false],
  [21, 98, 'Jawa Barat', 'Kota Bekasi', 'Bekasi Timur', 'datang', 'bebas', 'u11', false],
  [22, 52, 'Jawa Barat', 'Kota Bandung', 'Coblong', 'kunjungan', 'bebas', 'u13', false],
  [23, 122, 'Jawa Barat', 'Kota Bandung', 'Coblong', 'online', 'bebas', 'u13', false],
  [24, 70, 'Jawa Barat', 'Kota Bandung', 'Buahbatu', 'kunjungan', 'L', 'u15', false],
  [25, 26, 'Jawa Timur', 'Kota Surabaya', 'Gubeng', 'datang', 'bebas', 'u19', false],
  [26, 54, 'DI Yogyakarta', 'Kota Yogyakarta', 'Gondokusuman', 'online', 'bebas', 'u17', false],
  [27, 74, 'Sumatera Utara', 'Kota Medan', 'Medan Johor', 'kunjungan', 'bebas', 'u21', false],
];

function freshDb(): DB {
  return { ustad: USTAD_SEED, kasus: seedKasus() };
}

let cacheRaw: string | null = null;
let cacheDb: DB | null = null;

function read(): DB {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // storage blocked (private mode etc.) — fall back to in-memory only
  }
  if (raw && raw === cacheRaw && cacheDb) return cacheDb;
  if (!raw) {
    if (!cacheDb) {
      cacheDb = freshDb();
      cacheRaw = JSON.stringify(cacheDb);
      try {
        // persisted without an event so other tabs share the same seed
        localStorage.setItem(KEY, cacheRaw);
      } catch {
        // ignore
      }
    }
    return cacheDb;
  }
  try {
    cacheDb = JSON.parse(raw) as DB;
    cacheRaw = raw;
  } catch {
    cacheDb = freshDb();
  }
  return cacheDb;
}

function write(db: DB) {
  const raw = JSON.stringify(db);
  cacheDb = db;
  cacheRaw = raw;
  try {
    localStorage.setItem(KEY, raw);
  } catch {
    // ignore — demo still works for this tab
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

const EMPTY: DB = { ustad: [], kasus: [] };

export function useDb(): { db: DB; ready: boolean } {
  const db = useSyncExternalStore(subscribe, read, () => EMPTY);
  return { db, ready: db !== EMPTY };
}

function kode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `RQ-${s}`;
}

export type KasusInput = {
  nama: string;
  no_wa: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  lat: number;
  lng: number;
  sumber_lokasi: SumberLokasi;
  layanan: Layanan;
  preferensi: PreferensiUstad;
  keluhan: string;
};

// TODO(BE): insert into `pengguna` (upsert on no_wa) + `kasus` via an RPC that
// also rate-limits per device/number. The browser gets back only `kode`.
export function submitKasus(input: KasusInput): Kasus {
  const db = read();
  const kasus: Kasus = {
    ...input,
    id: `k-${Date.now()}`,
    kode: kode(),
    created_at: new Date().toISOString(),
    status: 'menunggu',
    matched_ustad_id: null,
    diambil_pada: null,
    ditugaskan_admin: false,
  };
  write({ ...db, kasus: [kasus, ...db.kasus] });
  return kasus;
}

// TODO(BE): must be atomic — `update kasus set status='diambil', matched_ustad_id=$1
// where id=$2 and status='menunggu' returning *` — so two ustadz tapping at
// the same moment can't both take it. Only then reveal no_wa to that ustadz.
export function ambilKasus(kasusId: string, ustadId: string): boolean {
  const db = read();
  const target = db.kasus.find((k) => k.id === kasusId);
  if (!target || target.status !== 'menunggu') return false;
  write({
    ...db,
    kasus: db.kasus.map((k) =>
      k.id === kasusId
        ? { ...k, status: 'diambil', matched_ustad_id: ustadId, diambil_pada: new Date().toISOString() }
        : k
    ),
  });
  return true;
}

// TODO(BE): admin-only RPC (checked by role in RLS), logs who assigned it.
export function tugaskanKasus(kasusId: string, ustadId: string) {
  const db = read();
  write({
    ...db,
    kasus: db.kasus.map((k) =>
      k.id === kasusId
        ? { ...k, status: 'diambil', matched_ustad_id: ustadId, diambil_pada: new Date().toISOString(), ditugaskan_admin: true }
        : k
    ),
  });
}

// TODO(BE): admin-only update on `ustad`; an ustadz may update only their own
// `menerima_kasus_baru`.
export function updateUstad(id: string, patch: Partial<Ustad>) {
  const db = read();
  write({ ...db, ustad: db.ustad.map((u) => (u.id === id ? { ...u, ...patch } : u)) });
}

// TODO(BE): admin-only insert on `ustad`; new rows start unverified.
export function addUstad(u: Omit<Ustad, 'id'>) {
  const db = read();
  write({ ...db, ustad: [...db.ustad, { ...u, id: `u-${Date.now()}` }] });
}

export function resetDemo() {
  write(freshDb());
}

// Seed requests that start out already assigned by an admin; excluded so the
// demo guide only ticks "Tugaskan" after the viewer assigns one themselves.
const SEED_ADMIN_ASSIGNED = new Set(HISTORY.filter((h) => h[8]).map((h) => `k-seed-${h[0]}`));

export type DemoProgress = {
  kirim: boolean;
  ambil: boolean;
  tugaskan: boolean;
  tambah: boolean;
  verifikasi: boolean;
};

export function demoProgress(db: DB): DemoProgress {
  const ownKasus = db.kasus.filter((k) => !k.id.startsWith('k-seed'));
  const added = db.ustad.filter((u) => u.id.startsWith('u-'));
  return {
    kirim: ownKasus.length > 0,
    ambil: ownKasus.some((k) => k.status === 'diambil' && !k.ditugaskan_admin),
    tugaskan: db.kasus.some((k) => k.ditugaskan_admin && !SEED_ADMIN_ASSIGNED.has(k.id)),
    tambah: added.length > 0,
    verifikasi: added.some((u) => u.terverifikasi),
  };
}
