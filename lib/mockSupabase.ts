// Dummy in-memory Supabase stand-in for local dev without a real project.
// Mirrors the subset of the supabase-js query builder that app/page.tsx uses:
// .from(table).select().eq().eq() and .from(table).insert(). Data shape
// matches legacy/prototype-html/schema.sql (`ustad` table).

import type { Ustad } from './matching';

const MOCK_USTAD: Ustad[] = [
  {
    id: 'mock-1',
    nama: 'Ustadz Ahmad Fauzi, Lc.',
    no_wa: '628123456789',
    area: 'Jakarta Selatan',
    alamat: 'Jalan Contoh No. 1, Jakarta Selatan',
    lat: -6.2615,
    lng: 106.781,
    terverifikasi: true,
    aktif: true,
  },
  {
    id: 'mock-2',
    nama: 'Ustadz Muhammad Ridwan',
    no_wa: '628987654321',
    area: 'Bandung',
    alamat: 'Jalan Contoh No. 2, Bandung',
    lat: -6.9175,
    lng: 107.6191,
    terverifikasi: true,
    aktif: true,
  },
  {
    id: 'mock-3',
    nama: 'Ustadz Contoh Tiga (belum terverifikasi)',
    no_wa: '628111222333',
    area: 'Surabaya',
    alamat: 'Jalan Contoh No. 3, Surabaya',
    lat: -7.2575,
    lng: 112.7521,
    terverifikasi: false,
    aktif: true,
  },
];

type Row = Record<string, unknown>;

const TABLES: Record<string, Row[]> = {
  ustad: MOCK_USTAD as unknown as Row[],
  permintaan: [],
};

class MockQuery {
  table: string;
  rows: Row[];
  filters: Array<(row: Row) => boolean>;

  constructor(table: string) {
    this.table = table;
    this.rows = TABLES[table] ?? [];
    this.filters = [];
  }

  select() {
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push((row) => row[column] === value);
    return this;
  }

  insert(row: Row) {
    const inserted = { id: `mock-${Date.now()}`, created_at: new Date().toISOString(), ...row };
    if (TABLES[this.table]) TABLES[this.table].push(inserted);
    console.log('[mockSupabase] insert (in-memory only, not persisted):', inserted);
    return Promise.resolve({ data: [inserted], error: null });
  }

  then(resolve: (value: { data: Row[]; error: null }) => void, reject?: (reason: unknown) => void) {
    const data = this.rows.filter((row) => this.filters.every((f) => f(row)));
    return Promise.resolve({ data, error: null }).then(resolve, reject);
  }
}

export function createMockClient() {
  return {
    from(table: string) {
      return new MockQuery(table);
    },
  };
}
