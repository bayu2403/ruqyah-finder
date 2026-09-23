// Dummy in-memory Supabase stand-in for local dev without a real project.
// Mirrors the subset of the supabase-js query builder that app/page.js uses:
// .from(table).select().eq().eq() and .from(table).insert(). Data shape
// matches legacy/prototype-html/schema.sql (`ustad` table).

const MOCK_USTAD = [
  {
    id: 'mock-1',
    nama: 'Ustad Contoh Satu',
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
    nama: 'Ustad Contoh Dua',
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
    nama: 'Ustad Contoh Tiga (belum terverifikasi)',
    no_wa: '628111222333',
    area: 'Surabaya',
    alamat: 'Jalan Contoh No. 3, Surabaya',
    lat: -7.2575,
    lng: 112.7521,
    terverifikasi: false,
    aktif: true,
  },
];

const TABLES = {
  ustad: MOCK_USTAD,
  permintaan: [],
};

class MockQuery {
  constructor(table) {
    this.table = table;
    this.rows = TABLES[table] ?? [];
    this.filters = [];
  }

  select() {
    return this;
  }

  eq(column, value) {
    this.filters.push((row) => row[column] === value);
    return this;
  }

  insert(row) {
    const inserted = { id: `mock-${Date.now()}`, created_at: new Date().toISOString(), ...row };
    if (TABLES[this.table]) TABLES[this.table].push(inserted);
    console.log('[mockSupabase] insert (in-memory only, not persisted):', inserted);
    return Promise.resolve({ data: [inserted], error: null });
  }

  then(resolve, reject) {
    const data = this.rows.filter((row) => this.filters.every((f) => f(row)));
    return Promise.resolve({ data, error: null }).then(resolve, reject);
  }
}

export function createMockClient() {
  return {
    from(table) {
      return new MockQuery(table);
    },
  };
}
