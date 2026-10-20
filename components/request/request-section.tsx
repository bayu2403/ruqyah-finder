'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Home,
  Loader2,
  LocateFixed,
  MapPin,
  MonitorSmartphone,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldError } from '@/components/ui/field-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { haversineKm, isValidWa, nearbyPublic, NEARBY_MAX_KM } from '@/lib/matching';
import { submitKasus, useDb } from '@/lib/store';
import { findKecamatan, nearestKecamatan, WILAYAH } from '@/lib/data/wilayah';
import { LAYANAN_LABEL, PREFERENSI_LABEL, type Kasus, type Layanan, type PreferensiUstad, type SumberLokasi } from '@/lib/types';

const NearbyMap = dynamic(() => import('@/components/map/nearby-map').then((m) => m.NearbyMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
});

type Lokasi = {
  lat: number;
  lng: number;
  sumber: SumberLokasi;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
};

const LAYANAN_ICON: Record<Layanan, typeof Home> = {
  datang: MapPin,
  kunjungan: Home,
  online: MonitorSmartphone,
};

// GPS points further than this from every sample kecamatan aren't labelled.
const KECAMATAN_MATCH_KM = 25;

export function RequestSection() {
  const { db } = useDb();
  const [mode, setMode] = useState<SumberLokasi>('gps');
  const [lokasi, setLokasi] = useState<Lokasi | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'denied' | 'unsupported'>('idle');
  const [prov, setProv] = useState('');
  const [kab, setKab] = useState('');
  const [kec, setKec] = useState('');
  const [submitted, setSubmitted] = useState<Kasus | null>(null);

  const nearby = useMemo(
    () => (lokasi ? nearbyPublic(db.ustad, lokasi.lat, lokasi.lng, 5) : []),
    [db.ustad, lokasi]
  );
  const userPoint = useMemo(() => (lokasi ? { lat: lokasi.lat, lng: lokasi.lng } : null), [lokasi]);

  function locate() {
    setMode('gps');
    if (!navigator.geolocation) {
      setGpsStatus('unsupported');
      return;
    }
    setGpsStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const near = nearestKecamatan(lat, lng);
        const centroid = near ? findKecamatan(near.provinsi, near.kabupaten, near.kecamatan) : undefined;
        const labelled = centroid && haversineKm(lat, lng, centroid.lat, centroid.lng) <= KECAMATAN_MATCH_KM;
        setLokasi({
          lat,
          lng,
          sumber: 'gps',
          provinsi: labelled ? near!.provinsi : '',
          kabupaten: labelled ? near!.kabupaten : '',
          kecamatan: labelled ? near!.kecamatan : '',
        });
        setGpsStatus('idle');
      },
      () => {
        setGpsStatus('denied');
        setMode('wilayah');
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  function pickKecamatan(value: string) {
    setKec(value);
    const c = findKecamatan(prov, kab, value);
    setLokasi(c ? { lat: c.lat, lng: c.lng, sumber: 'wilayah', provinsi: prov, kabupaten: kab, kecamatan: value } : null);
  }

  const kabOptions = WILAYAH.find((p) => p.nama === prov)?.kabupaten ?? [];
  const kecOptions = kabOptions.find((k) => k.nama === kab)?.kecamatan ?? [];
  const radius = nearby.length ? Math.max(...nearby.map((n) => n.jarak_km)) : 0;

  return (
    <section id="ajukan" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Ajukan Permintaan Ruqyah</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Tentukan lokasi Anda, isi data singkat, lalu ustadz terverifikasi terdekat yang tersedia akan
            menghubungi Anda lewat WhatsApp.
          </p>
        </div>

        {/* Mobile order: location → map → form. Desktop: map on the right spanning both cards. */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:grid-rows-[auto_1fr]">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-start-1 lg:row-start-1">
              <StepTitle n={1} title="Lokasi Anda" />
              <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1" role="tablist">
                {(['gps', 'wilayah'] as const).map((m) => (
                  <button
                    key={m}
                    role="tab"
                    aria-selected={mode === m}
                    onClick={() => setMode(m)}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      mode === m ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {m === 'gps' ? 'Lokasi otomatis (GPS)' : 'Pilih wilayah'}
                  </button>
                ))}
              </div>

              {mode === 'gps' ? (
                <div>
                  <Button onClick={locate} disabled={gpsStatus === 'loading'} className="w-full" size="lg">
                    {gpsStatus === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
                    {gpsStatus === 'loading' ? 'Mendeteksi lokasi…' : 'Gunakan lokasi saya'}
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Lokasi hanya dipakai untuk mencari ustadz terdekat dan tidak ditampilkan ke publik.
                  </p>
                  {gpsStatus === 'unsupported' && (
                    <FieldError className="mt-2">Perangkat tidak mendukung GPS. Silakan pilih wilayah.</FieldError>
                  )}
                </div>
              ) : (
                <div className="grid gap-3">
                  {gpsStatus === 'denied' && (
                    <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                      Izin lokasi ditolak. Silakan pilih wilayah Anda di bawah.
                    </p>
                  )}
                  <div>
                    <Label htmlFor="prov">Provinsi</Label>
                    <Select id="prov" value={prov} onChange={(e) => { setProv(e.target.value); setKab(''); setKec(''); setLokasi(null); }}>
                      <option value="">Pilih provinsi</option>
                      {WILAYAH.map((p) => <option key={p.nama}>{p.nama}</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="kab">Kabupaten/Kota</Label>
                    <Select id="kab" value={kab} disabled={!prov} onChange={(e) => { setKab(e.target.value); setKec(''); setLokasi(null); }}>
                      <option value="">Pilih kabupaten/kota</option>
                      {kabOptions.map((k) => <option key={k.nama}>{k.nama}</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="kec">Kecamatan</Label>
                    <Select id="kec" value={kec} disabled={!kab} onChange={(e) => pickKecamatan(e.target.value)}>
                      <option value="">Pilih kecamatan</option>
                      {kecOptions.map((c) => <option key={c.nama}>{c.nama}</option>)}
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Data wilayah contoh — versi final memakai daftar resmi Kemendagri.
                  </p>
                </div>
              )}

              {lokasi && (
                <p className="mt-4 flex items-start gap-2 rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {lokasi.kecamatan
                    ? `${lokasi.kecamatan}, ${lokasi.kabupaten}, ${lokasi.provinsi}`
                    : 'Lokasi terdeteksi (di luar wilayah contoh)'}
                </p>
              )}
            </div>

          <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
            <div className="relative h-[340px] overflow-hidden rounded-2xl border border-border bg-muted shadow-sm sm:h-[420px]">
              <NearbyMap user={userPoint} ustadz={nearby} className="h-full w-full" />
              {!lokasi && (
                <div className="pointer-events-none absolute inset-0 z-[400] flex items-center justify-center bg-background/60 p-6 text-center">
                  <p className="max-w-xs text-sm font-medium text-foreground">
                    Tentukan lokasi Anda untuk melihat ustadz terverifikasi di sekitar Anda.
                  </p>
                </div>
              )}
            </div>

            {lokasi && <NearbySummary nearby={nearby} radius={radius} />}
          </div>

            <div className={cn('rounded-xl border border-border bg-card p-6 shadow-sm lg:col-start-1 lg:row-start-2 lg:self-start', !lokasi && !submitted && 'opacity-60')}>
              {submitted ? (
                <Confirmation kasus={submitted} onReset={() => setSubmitted(null)} />
              ) : (
                <RequestForm lokasi={lokasi} onSubmitted={setSubmitted} />
              )}
            </div>
        </div>
      </div>
    </section>
  );
}

function StepTitle({ n, title }: { n: number; title: string }) {
  return (
    <h3 className="mb-4 flex items-center gap-3 text-lg font-semibold text-foreground">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {n}
      </span>
      {title}
    </h3>
  );
}

function NearbySummary({ nearby, radius }: { nearby: ReturnType<typeof nearbyPublic>; radius: number }) {
  if (nearby.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <p className="font-semibold text-foreground">Belum ada ustadz terverifikasi dalam {NEARBY_MAX_KM} km.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Permintaan Anda tetap kami terima dan akan dibantu langsung oleh admin. Sambil menunggu, Anda bisa
          mengikuti panduan ruqyah mandiri.
        </p>
        <Button asChild variant="outline" className="mt-3">
          <Link href="/ruqyah-mandiri"><BookOpen className="h-4 w-4" />Panduan Ruqyah Mandiri</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="flex items-center gap-2 font-semibold text-foreground">
        <ShieldCheck className="h-5 w-5 text-gold" />
        Alhamdulillah, ada {nearby.length} ustadz terverifikasi dalam ±{radius} km dari Anda.
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {nearby.map((u) => (
          <li key={u.id} className="flex items-center justify-between gap-2 rounded-lg bg-secondary/60 px-3 py-2 text-sm">
            <span className="min-w-0 truncate text-secondary-foreground">
              {u.jenis_kelamin === 'P' ? 'Ustadzah' : 'Ustadz'} · {u.kecamatan}
            </span>
            <span className="shrink-0 font-medium text-primary">±{u.jarak_km} km</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Lokasi di peta adalah perkiraan area, bukan alamat ustadz. Ustadz terdekat yang tersedia akan mengambil
        permintaan Anda.
      </p>
    </div>
  );
}

function RequestForm({ lokasi, onSubmitted }: { lokasi: Lokasi | null; onSubmitted: (k: Kasus) => void }) {
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [layanan, setLayanan] = useState<Layanan>('datang');
  const [preferensi, setPreferensi] = useState<PreferensiUstad>('bebas');
  const [keluhan, setKeluhan] = useState('');
  const [setuju, setSetuju] = useState(false);
  const [touched, setTouched] = useState(false);

  const waValid = isValidWa(wa);
  const canSubmit = Boolean(lokasi) && nama.trim().length >= 2 && waValid && setuju;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit || !lokasi) return;
    const kasus = submitKasus({
      nama: nama.trim(),
      no_wa: wa,
      provinsi: lokasi.provinsi,
      kabupaten: lokasi.kabupaten,
      kecamatan: lokasi.kecamatan,
      lat: lokasi.lat,
      lng: lokasi.lng,
      sumber_lokasi: lokasi.sumber,
      layanan,
      preferensi,
      keluhan: keluhan.trim(),
    });
    onSubmitted(kasus);
  }

  return (
    <form onSubmit={submit} noValidate>
      <StepTitle n={2} title="Data untuk dihubungi" />
      <fieldset disabled={!lokasi} className="grid gap-4">
        <div>
          <Label htmlFor="nama">Nama</Label>
          <Input id="nama" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama panggilan" autoComplete="given-name" />
        </div>
        <div>
          <Label htmlFor="wa">Nomor WhatsApp</Label>
          <Input id="wa" value={wa} onChange={(e) => setWa(e.target.value)} placeholder="08xxxxxxxxxx" inputMode="tel" autoComplete="tel" />
          {touched && !waValid && <FieldError>Masukkan nomor WhatsApp yang valid, contoh 081234567890.</FieldError>}
        </div>

        <ChoiceGroup<Layanan>
          label="Jenis layanan"
          value={layanan}
          onChange={setLayanan}
          options={(Object.keys(LAYANAN_LABEL) as Layanan[]).map((v) => ({ value: v, label: LAYANAN_LABEL[v], icon: LAYANAN_ICON[v] }))}
        />
        <ChoiceGroup<PreferensiUstad>
          label="Preferensi"
          value={preferensi}
          onChange={setPreferensi}
          options={(Object.keys(PREFERENSI_LABEL) as PreferensiUstad[]).map((v) => ({ value: v, label: PREFERENSI_LABEL[v], icon: UserRound }))}
        />

        <div>
          <Label htmlFor="keluhan">
            Keluhan singkat <span className="font-normal text-muted-foreground">(opsional)</span>
          </Label>
          <Textarea
            id="keluhan"
            value={keluhan}
            maxLength={300}
            onChange={(e) => setKeluhan(e.target.value)}
            placeholder="Ceritakan singkat jika berkenan. Hanya ustadz yang mengambil permintaan Anda yang dapat membacanya."
          />
        </div>

        <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p>
            Jika ada kejang, pingsan, sesak napas berat, nyeri dada hebat, atau pikiran untuk menyakiti diri, segera
            ke IGD terdekat atau hubungi <strong>119</strong>. Ruqyah tidak menggantikan pertolongan medis darurat.
          </p>
        </div>

        <label className="flex items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            checked={setuju}
            onChange={(e) => setSetuju(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[hsl(var(--primary))]"
          />
          <span>
            Saya setuju nama, nomor WhatsApp, dan wilayah saya dibagikan kepada satu ustadz terverifikasi yang
            mengambil permintaan ini, untuk menghubungi saya.
          </span>
        </label>
        {touched && !setuju && <FieldError className="-mt-2">Persetujuan diperlukan untuk melanjutkan.</FieldError>}

        <Button type="submit" variant="gold" size="lg" className="w-full">
          Kirim Permintaan
        </Button>
      </fieldset>
    </form>
  );
}

function ChoiceGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; icon: typeof Home }[];
}) {
  return (
    <div role="radiogroup" aria-label={label}>
      <p className="mb-1.5 text-sm font-medium text-foreground">{label}</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
              value === o.value
                ? 'border-primary bg-secondary font-medium text-secondary-foreground'
                : 'border-border bg-background text-foreground hover:bg-accent'
            )}
          >
            <o.icon className="h-4 w-4 shrink-0 text-primary" />
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Confirmation({ kasus, onReset }: { kasus: Kasus; onReset: () => void }) {
  return (
    <div className="text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
      <h3 className="mt-3 text-lg font-semibold text-foreground">Permintaan Anda sudah diterima</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Kode permintaan: <span className="font-semibold text-foreground">{kasus.kode}</span>
      </p>
      <p className="mx-auto mt-4 max-w-sm text-sm text-foreground">
        Insya Allah, ustadz terverifikasi terdekat yang tersedia akan menghubungi Anda lewat WhatsApp di nomor{' '}
        <strong>{kasus.no_wa}</strong>. Mohon pastikan nomor tersebut aktif.
      </p>
      <p dir="rtl" lang="ar" className="mt-5 font-arabic text-2xl text-gold">حَسۡبُنَا ٱللَّهُ وَنِعۡمَ ٱلۡوَكِيلُ</p>
      <p className="mt-1 text-xs text-muted-foreground">&ldquo;Cukuplah Allah (menjadi penolong) bagi kami dan Dia sebaik-baik pelindung.&rdquo; (QS. Ali &apos;Imran: 173)</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button asChild>
          <Link href="/ruqyah-mandiri"><BookOpen className="h-4 w-4" />Ruqyah mandiri sambil menunggu</Link>
        </Button>
        <Button variant="outline" onClick={onReset}>Ajukan permintaan lain</Button>
      </div>
      <p className="mt-6 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
        Mode demo: buka halaman <Link href="/ustadz" className="font-medium text-primary underline">Ustadz</Link> atau{' '}
        <Link href="/admin" className="font-medium text-primary underline">Admin</Link> untuk melihat permintaan ini di pool.
      </p>
    </div>
  );
}
