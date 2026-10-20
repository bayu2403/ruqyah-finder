'use client';

// MOCK DATABASE — everything is stored in this browser's localStorage so the
// static mockup can demo the full flow (submit → pool → ambil → admin) across
// tabs. TODO(BE): every exported function here maps to a Supabase call; see
// docs/BACKEND-TODO.md for the table, policy and RPC each one needs.

import { useSyncExternalStore } from 'react';
import { USTAD_SEED } from '@/lib/data/ustad';
import type { Kasus, Layanan, PreferensiUstad, SumberLokasi, Ustad } from '@/lib/types';

const KEY = 'ruqyahku:mock-db:v1';
const EVENT = 'ruqyahku:mock-db-change';

type DB = { ustad: Ustad[]; kasus: Kasus[] };

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
  ];
}

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
