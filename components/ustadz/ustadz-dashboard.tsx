'use client';

import { useEffect, useMemo, useState } from 'react';
import { Clock, Hand, Inbox, MapPin, MessageCircle, ShieldAlert, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { isAvailable, poolFor, waLinkToPengguna } from '@/lib/matching';
import { ambilKasus, updateUstad, useDb } from '@/lib/store';
import { timeAgo, useNow, wilayahLabel } from '@/lib/format';
import { LAYANAN_LABEL, PREFERENSI_LABEL, type Kasus, type Ustad } from '@/lib/types';

// TODO(BE): replace with Supabase Auth (e.g. WhatsApp/SMS OTP) — the logged-in
// user is linked to exactly one `ustad` row; no picking who you are.
const LOGIN_KEY = 'ruqyahku:demo-ustadz-id';

export function UstadzDashboard() {
  const { db, ready } = useDb();
  const now = useNow();
  const [ustadId, setUstadId] = useState('');
  const [tab, setTab] = useState<'pool' | 'mine'>('pool');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      setUstadId(localStorage.getItem(LOGIN_KEY) ?? 'u01');
    } catch {
      setUstadId('u01');
    }
  }, []);

  function login(id: string) {
    setUstadId(id);
    setNotice(null);
    try {
      localStorage.setItem(LOGIN_KEY, id);
    } catch {
      // ignore
    }
  }

  const ustad = db.ustad.find((u) => u.id === ustadId);
  const pool = useMemo(() => (ustad ? poolFor(ustad, db.kasus, now) : []), [ustad, db.kasus, now]);
  const mine = useMemo(
    () =>
      db.kasus
        .filter((k) => k.matched_ustad_id === ustadId)
        .sort((a, b) => (b.diambil_pada ?? '').localeCompare(a.diambil_pada ?? '')),
    [db.kasus, ustadId]
  );

  function ambil(k: Kasus) {
    if (!ustad) return;
    if (ambilKasus(k.id, ustad.id)) {
      setNotice(`Permintaan ${k.kode} berhasil diambil. Silakan hubungi ${k.nama} lewat WhatsApp.`);
      setTab('mine');
    } else {
      setNotice(`Maaf, permintaan ${k.kode} sudah diambil ustadz lain.`);
    }
  }

  if (!ready) return <div className="h-64 animate-pulse rounded-xl bg-muted" />;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-dashed border-border bg-card p-4">
        <Label htmlFor="login">Masuk sebagai (mode demo)</Label>
        <Select id="login" value={ustadId} onChange={(e) => login(e.target.value)}>
          {db.ustad.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nama} — {u.kecamatan}
            </option>
          ))}
        </Select>
        <p className="mt-2 text-xs text-muted-foreground">
          Versi final: ustadz masuk dengan nomor WhatsApp terdaftar (OTP), tanpa memilih akun.
        </p>
      </div>

      {ustad && <Profile ustad={ustad} />}

      {ustad && !ustad.terverifikasi && (
        <Alert icon={ShieldAlert}>
          Akun Anda sedang menunggu verifikasi lembaga. Permintaan akan muncul setelah akun diverifikasi.
        </Alert>
      )}
      {ustad && ustad.terverifikasi && !ustad.aktif && (
        <Alert icon={ShieldAlert}>Akun Anda sedang dinonaktifkan oleh admin lembaga.</Alert>
      )}

      {notice && (
        <p className="rounded-lg bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground" role="status">
          {notice}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1" role="tablist">
        <TabButton active={tab === 'pool'} onClick={() => setTab('pool')} label={`Permintaan di sekitar (${pool.length})`} />
        <TabButton active={tab === 'mine'} onClick={() => setTab('mine')} label={`Sudah saya ambil (${mine.length})`} />
      </div>

      {tab === 'pool' ? (
        <div className="grid gap-3">
          {ustad && isAvailable(ustad) && pool.length === 0 && (
            <Empty text="Belum ada permintaan baru di sekitar Anda. Halaman ini diperbarui otomatis." />
          )}
          {ustad && !isAvailable(ustad) && ustad.terverifikasi && ustad.aktif && (
            <Empty text="Anda sedang tidak menerima permintaan baru. Aktifkan di atas untuk melihat pool." />
          )}
          {pool.map(({ kasus, jarak_km }) => (
            <div key={kasus.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{kasus.kode}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {wilayahLabel(kasus)} · ±{Math.max(1, Math.round(jarak_km))} km
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {timeAgo(kasus.created_at, now)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary">{LAYANAN_LABEL[kasus.layanan]}</Badge>
                <Badge variant="outline">{PREFERENSI_LABEL[kasus.preferensi]}</Badge>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Nama, nomor WhatsApp, dan keluhan terlihat setelah Anda mengambil permintaan ini.
              </p>
              <Button className="mt-4 w-full sm:w-auto" onClick={() => ambil(kasus)}>
                <Hand className="h-4 w-4" />
                Ambil permintaan
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {mine.length === 0 && <Empty text="Anda belum mengambil permintaan." />}
          {ustad &&
            mine.map((k) => (
              <div key={k.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {k.nama} <span className="font-normal text-muted-foreground">· {k.kode}</span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{k.no_wa} · {wilayahLabel(k)}</p>
                  </div>
                  {k.diambil_pada && (
                    <span className="text-xs text-muted-foreground">
                      {k.ditugaskan_admin ? 'Ditugaskan admin' : 'Diambil'} {timeAgo(k.diambil_pada, now)}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">{LAYANAN_LABEL[k.layanan]}</Badge>
                  <Badge variant="outline">{PREFERENSI_LABEL[k.preferensi]}</Badge>
                </div>
                {k.keluhan && <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm text-foreground">&ldquo;{k.keluhan}&rdquo;</p>}
                <Button asChild variant="gold" className="mt-4 w-full sm:w-auto">
                  <a href={waLinkToPengguna(k, ustad)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    Hubungi via WhatsApp
                  </a>
                </Button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

function Profile({ ustad }: { ustad: Ustad }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <UserRound className="h-6 w-6" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{ustad.nama}</p>
          <p className="text-sm text-muted-foreground">
            {ustad.kecamatan}, {ustad.kabupaten} · {ustad.layanan.map((l) => LAYANAN_LABEL[l]).join(', ')}
          </p>
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-foreground">
        <span>Menerima permintaan baru</span>
        <input
          type="checkbox"
          role="switch"
          checked={ustad.menerima_kasus_baru}
          disabled={!ustad.terverifikasi || !ustad.aktif}
          onChange={(e) => updateUstad(ustad.id, { menerima_kasus_baru: e.target.checked })}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="relative h-6 w-11 rounded-full bg-border transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-background after:shadow after:transition-transform peer-checked:bg-primary peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-disabled:opacity-50"
        />
      </label>
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'rounded-md px-3 py-2 text-sm font-medium transition-colors',
        active ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {label}
    </button>
  );
}

function Alert({ icon: Icon, children }: { icon: typeof Inbox; children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-foreground">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-foreground" />
      {children}
    </p>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
      <Inbox className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
