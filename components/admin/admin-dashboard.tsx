'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, ClipboardList, RotateCcw, UserPlus, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FieldError } from '@/components/ui/field-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ESCALATE_AFTER_H, haversineKm, isAvailable, isValidWa, needsAdmin } from '@/lib/matching';
import { addUstad, resetDemo, tugaskanKasus, updateUstad, useDb } from '@/lib/store';
import { timeAgo, useNow, wilayahLabel } from '@/lib/format';
import { findKecamatan, WILAYAH } from '@/lib/data/wilayah';
import { LAYANAN_LABEL, PREFERENSI_LABEL, type JenisKelamin, type Kasus, type Layanan, type Ustad } from '@/lib/types';

// TODO(BE): gate this page behind Supabase Auth with an `admin` role checked in RLS.
type Filter = 'semua' | 'menunggu' | 'perlu' | 'diambil';

export function AdminDashboard() {
  const { db, ready } = useDb();
  const now = useNow();
  const [filter, setFilter] = useState<Filter>('perlu');

  const counts = useMemo(
    () => ({
      semua: db.kasus.length,
      menunggu: db.kasus.filter((k) => k.status === 'menunggu').length,
      perlu: db.kasus.filter((k) => needsAdmin(k, now)).length,
      diambil: db.kasus.filter((k) => k.status === 'diambil').length,
      ustadSiap: db.ustad.filter(isAvailable).length,
    }),
    [db, now]
  );

  const rows = db.kasus
    .filter((k) =>
      filter === 'semua' ? true : filter === 'perlu' ? needsAdmin(k, now) : k.status === filter
    )
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  if (!ready) return <div className="h-64 animate-pulse rounded-xl bg-muted" />;

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total permintaan" value={counts.semua} icon={ClipboardList} />
        <Stat label="Menunggu diambil" value={counts.menunggu} icon={ClipboardList} />
        <Stat label={`Perlu ditugaskan (>${ESCALATE_AFTER_H} jam)`} value={counts.perlu} icon={AlertTriangle} warn={counts.perlu > 0} />
        <Stat label="Ustadz siap menerima" value={counts.ustadSiap} icon={Users} />
      </div>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-foreground">Permintaan</h2>
          <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
            {([
              ['perlu', 'Perlu ditugaskan'],
              ['menunggu', 'Menunggu'],
              ['diambil', 'Diambil'],
              ['semua', 'Semua'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                aria-pressed={filter === key}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  filter === key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {label} ({counts[key]})
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {rows.length === 0 && (
            <p className="rounded-xl border border-dashed border-border bg-card px-6 py-8 text-center text-sm text-muted-foreground">
              Tidak ada permintaan pada filter ini.
            </p>
          )}
          {rows.map((k) => (
            <KasusRow key={k.id} kasus={k} ustadList={db.ustad} now={now} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-foreground">Ustadz ({db.ustad.length})</h2>
        <UstadTable list={db.ustad} />
        <AddUstadForm />
      </section>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={() => confirm('Kembalikan semua data demo ke kondisi awal?') && resetDemo()}>
          <RotateCcw className="h-4 w-4" />
          Reset data demo
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, warn }: { label: string; value: number; icon: typeof Users; warn?: boolean }) {
  return (
    <div className={cn('rounded-xl border bg-card p-4 shadow-sm', warn ? 'border-gold' : 'border-border')}>
      <Icon className={cn('h-5 w-5', warn ? 'text-gold' : 'text-primary')} />
      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function KasusRow({ kasus, ustadList, now }: { kasus: Kasus; ustadList: Ustad[]; now: number }) {
  const [pick, setPick] = useState('');
  const urgent = needsAdmin(kasus, now);
  const assigned = ustadList.find((u) => u.id === kasus.matched_ustad_id);

  const candidates = useMemo(
    () =>
      ustadList
        .filter(isAvailable)
        .filter((u) => kasus.preferensi === 'bebas' || kasus.preferensi === u.jenis_kelamin)
        .filter((u) => u.layanan.includes(kasus.layanan))
        .map((u) => ({ u, d: haversineKm(u.lat, u.lng, kasus.lat, kasus.lng) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 8),
    [ustadList, kasus]
  );

  return (
    <div className={cn('rounded-xl border bg-card p-5 shadow-sm', urgent ? 'border-gold' : 'border-border')}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">
            {kasus.nama} <span className="font-normal text-muted-foreground">· {kasus.kode} · {kasus.no_wa}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {wilayahLabel(kasus)} · masuk {timeAgo(kasus.created_at, now)}
          </p>
        </div>
        {kasus.status === 'diambil' ? (
          <Badge>Diambil</Badge>
        ) : urgent ? (
          <Badge variant="gold">Perlu ditugaskan</Badge>
        ) : (
          <Badge variant="outline">Menunggu</Badge>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="secondary">{LAYANAN_LABEL[kasus.layanan]}</Badge>
        <Badge variant="outline">{PREFERENSI_LABEL[kasus.preferensi]}</Badge>
      </div>

      {kasus.status === 'diambil' ? (
        <p className="mt-3 text-sm text-foreground">
          {kasus.ditugaskan_admin ? 'Ditugaskan ke' : 'Diambil oleh'} <strong>{assigned?.nama ?? 'ustadz tidak dikenal'}</strong>
          {kasus.diambil_pada && <span className="text-muted-foreground"> · {timeAgo(kasus.diambil_pada, now)}</span>}
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <div className="flex-1">
            <Select aria-label={`Tugaskan ${kasus.kode} ke ustadz`} value={pick} onChange={(e) => setPick(e.target.value)}>
              <option value="">Tugaskan ke ustadz…</option>
              {candidates.map(({ u, d }) => (
                <option key={u.id} value={u.id}>
                  {u.nama} — {u.kecamatan} (±{Math.max(1, Math.round(d))} km)
                </option>
              ))}
            </Select>
            {candidates.length === 0 && (
              <p className="mt-1 text-xs text-muted-foreground">Tidak ada ustadz yang cocok dengan preferensi dan layanan ini.</p>
            )}
          </div>
          <Button disabled={!pick} onClick={() => tugaskanKasus(kasus.id, pick)}>
            Tugaskan
          </Button>
        </div>
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 accent-[hsl(var(--primary))]"
    />
  );
}

function UstadTable({ list }: { list: Ustad[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-border bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Nama</th>
            <th className="px-4 py-3 font-medium">Wilayah</th>
            <th className="px-4 py-3 font-medium">WhatsApp</th>
            <th className="px-4 py-3 font-medium">Layanan</th>
            <th className="px-4 py-3 text-center font-medium">Terverifikasi</th>
            <th className="px-4 py-3 text-center font-medium">Aktif</th>
            <th className="px-4 py-3 text-center font-medium">Terima baru</th>
          </tr>
        </thead>
        <tbody>
          {list.map((u) => (
            <tr key={u.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{u.nama}</p>
                <p className="text-xs text-muted-foreground">
                  {u.jenis_kelamin === 'P' ? 'Ustadzah' : 'Ustadz'} · {u.pengalaman_tahun} th pengalaman
                </p>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{u.kecamatan}, {u.kabupaten}</td>
              <td className="px-4 py-3 text-muted-foreground">{u.no_wa}</td>
              <td className="px-4 py-3 text-muted-foreground">{u.layanan.map((l) => LAYANAN_LABEL[l]).join(', ')}</td>
              <td className="px-4 py-3 text-center">
                <Toggle label={`Verifikasi ${u.nama}`} checked={u.terverifikasi} onChange={(v) => updateUstad(u.id, { terverifikasi: v })} />
              </td>
              <td className="px-4 py-3 text-center">
                <Toggle label={`Aktifkan ${u.nama}`} checked={u.aktif} onChange={(v) => updateUstad(u.id, { aktif: v })} />
              </td>
              <td className="px-4 py-3 text-center">
                <Toggle label={`${u.nama} menerima permintaan baru`} checked={u.menerima_kasus_baru} onChange={(v) => updateUstad(u.id, { menerima_kasus_baru: v })} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AddUstadForm() {
  const [open, setOpen] = useState(false);
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [jk, setJk] = useState<JenisKelamin>('L');
  const [prov, setProv] = useState('');
  const [kab, setKab] = useState('');
  const [kec, setKec] = useState('');
  const [layanan, setLayanan] = useState<Layanan[]>(['datang']);
  const [pengalaman, setPengalaman] = useState('1');
  const [error, setError] = useState<string | null>(null);

  const kabOptions = WILAYAH.find((p) => p.nama === prov)?.kabupaten ?? [];
  const kecOptions = kabOptions.find((k) => k.nama === kab)?.kecamatan ?? [];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const c = findKecamatan(prov, kab, kec);
    if (nama.trim().length < 3 || !isValidWa(wa) || !c || layanan.length === 0) {
      setError('Lengkapi nama, nomor WhatsApp yang valid, wilayah, dan minimal satu layanan.');
      return;
    }
    // TODO(BE): the admin should place the exact pin; the mockup uses the kecamatan centroid.
    addUstad({
      nama: nama.trim(),
      no_wa: wa,
      alamat: '',
      provinsi: prov,
      kabupaten: kab,
      kecamatan: kec,
      lat: c.lat,
      lng: c.lng,
      jenis_kelamin: jk,
      layanan,
      pengalaman_tahun: Number(pengalaman) || 0,
      terverifikasi: false,
      aktif: true,
      menerima_kasus_baru: true,
    });
    setNama('');
    setWa('');
    setError(null);
    setOpen(false);
  }

  if (!open) {
    return (
      <Button variant="outline" className="mt-4" onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4" />
        Tambah ustadz
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 grid gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:grid-cols-2">
      <p className="text-sm text-muted-foreground sm:col-span-2">
        Ustadz baru tersimpan sebagai <strong>belum terverifikasi</strong> dan tidak muncul ke publik sampai diverifikasi.
      </p>
      <div>
        <Label htmlFor="add-nama">Nama lengkap</Label>
        <Input id="add-nama" value={nama} onChange={(e) => setNama(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="add-wa">Nomor WhatsApp</Label>
        <Input id="add-wa" value={wa} onChange={(e) => setWa(e.target.value)} inputMode="tel" placeholder="08xxxxxxxxxx" />
      </div>
      <div>
        <Label htmlFor="add-jk">Jenis kelamin</Label>
        <Select id="add-jk" value={jk} onChange={(e) => setJk(e.target.value as JenisKelamin)}>
          <option value="L">Laki-laki (Ustadz)</option>
          <option value="P">Perempuan (Ustadzah)</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="add-exp">Pengalaman (tahun)</Label>
        <Input id="add-exp" type="number" min={0} value={pengalaman} onChange={(e) => setPengalaman(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="add-prov">Provinsi</Label>
        <Select id="add-prov" value={prov} onChange={(e) => { setProv(e.target.value); setKab(''); setKec(''); }}>
          <option value="">Pilih provinsi</option>
          {WILAYAH.map((p) => <option key={p.nama}>{p.nama}</option>)}
        </Select>
      </div>
      <div>
        <Label htmlFor="add-kab">Kabupaten/Kota</Label>
        <Select id="add-kab" value={kab} disabled={!prov} onChange={(e) => { setKab(e.target.value); setKec(''); }}>
          <option value="">Pilih kabupaten/kota</option>
          {kabOptions.map((k) => <option key={k.nama}>{k.nama}</option>)}
        </Select>
      </div>
      <div>
        <Label htmlFor="add-kec">Kecamatan</Label>
        <Select id="add-kec" value={kec} disabled={!kab} onChange={(e) => setKec(e.target.value)}>
          <option value="">Pilih kecamatan</option>
          {kecOptions.map((c) => <option key={c.nama}>{c.nama}</option>)}
        </Select>
      </div>
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-foreground">Layanan</legend>
        <div className="flex flex-col gap-1.5">
          {(Object.keys(LAYANAN_LABEL) as Layanan[]).map((l) => (
            <label key={l} className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={layanan.includes(l)}
                onChange={(e) => setLayanan((cur) => (e.target.checked ? [...cur, l] : cur.filter((x) => x !== l)))}
                className="h-4 w-4 accent-[hsl(var(--primary))]"
              />
              {LAYANAN_LABEL[l]}
            </label>
          ))}
        </div>
      </fieldset>
      {error && <FieldError className="sm:col-span-2">{error}</FieldError>}
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit">Simpan</Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
      </div>
    </form>
  );
}
