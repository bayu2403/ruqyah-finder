'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Circle, Compass, Info, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { demoProgress, resetDemo, useDb, type DemoProgress } from '@/lib/store';

type Step = { text: string; link?: { href: string; label: string }; done?: keyof DemoProgress };
type Scenario = { title: string; who: string; steps: Step[] };

const SCENARIOS: Scenario[] = [
  {
    title: 'Sebagai pemohon',
    who: 'Orang yang membutuhkan ruqyah',
    steps: [
      { text: 'Buka bagian pengajuan di Beranda.', link: { href: '/#ajukan', label: 'Buka pengajuan' } },
      {
        text: 'Tekan "Gunakan lokasi saya" dan izinkan akses lokasi. Jika ditolak, atau Anda di luar area contoh, pilih tab "Pilih wilayah": DKI Jakarta → Jakarta Selatan → Kebayoran Baru.',
      },
      { text: 'Perhatikan peta: ustadz terverifikasi terdekat ditampilkan sebagai area perkiraan, tanpa nama dan alamat.' },
      {
        text: 'Isi nama dan nomor WhatsApp (boleh contoh: 081234567890), centang persetujuan, lalu tekan "Kirim Permintaan".',
        done: 'kirim',
      },
    ],
  },
  {
    title: 'Sebagai ustadz',
    who: 'Ustadz terverifikasi yang menerima permintaan',
    steps: [
      {
        text: 'Buka halaman Ustadz dan pilih "Ustadz Ahmad Fauzi — Kebayoran Baru" di kolom "Masuk sebagai". Jika Anda memakai GPS di kota lain, pilih ustadz dari kota tersebut.',
        link: { href: '/ustadz/', label: 'Buka halaman Ustadz' },
      },
      { text: 'Permintaan Anda muncul di "Permintaan di sekitar". Nama dan nomor pemohon masih disembunyikan.' },
      {
        text: 'Tekan "Ambil permintaan". Nama, nomor, dan keluhan kini terlihat, dengan tombol "Hubungi via WhatsApp" berisi salam otomatis.',
        done: 'ambil',
      },
      { text: 'Ganti ke ustadz lain di "Masuk sebagai": permintaan tadi sudah hilang dari pool mereka.' },
    ],
  },
  {
    title: 'Sebagai admin lembaga',
    who: 'Pengelola data ustadz',
    steps: [
      {
        text: 'Buka halaman Admin. Di "Peta cakupan", lingkaran merah bergaris putus menandai wilayah yang punya permintaan tetapi belum ada ustadz.',
        link: { href: '/admin/', label: 'Buka halaman Admin' },
      },
      { text: 'Klik "Bogor Tengah" di daftar "Prioritas rekrutmen ustadz" untuk memperbesar peta ke wilayah itu.' },
      {
        text: 'Di bagian "Permintaan" → "Perlu ditugaskan", pilih ustadz untuk salah satu permintaan lalu tekan "Tugaskan".',
        done: 'tugaskan',
      },
      {
        text: 'Tekan "Tambah ustadz" di bawah tabel ustadz. Pilih Jawa Barat → Kota Bogor → Bogor Tengah, centang layanan, lalu "Simpan".',
        done: 'tambah',
      },
      {
        text: 'Centang "Terverifikasi" pada ustadz baru. Bogor Tengah hilang dari daftar prioritas, dan ustadz baru muncul di peta Beranda saat Anda memilih wilayah Bogor.',
        done: 'verifikasi',
      },
    ],
  },
];

const TRACKED = SCENARIOS.flatMap((s) => s.steps).filter((s) => s.done).length;
const SEEN_KEY = 'ruqyahku:demo-guide-seen';

export function DemoGuide() {
  const { db, ready } = useDb();
  const [open, setOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const progress = demoProgress(db);
  const doneCount = Object.values(progress).filter(Boolean).length;

  useEffect(() => {
    try {
      setShowIntro(!localStorage.getItem(SEEN_KEY));
    } catch {
      setShowIntro(true);
    }
  }, []);

  function markSeen() {
    setShowIntro(false);
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      // ignore
    }
  }

  function openGuide() {
    markSeen();
    setOpen(true);
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        {showIntro && (
          <div className="w-72 rounded-xl border border-border bg-card p-4 shadow-xl" role="status">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">Ini adalah versi demo</p>
              <button onClick={markSeen} aria-label="Tutup" className="-mr-1 -mt-1 rounded-md p-1 text-muted-foreground hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Ikuti panduan singkat untuk mencoba alur pemohon, ustadz, dan admin lembaga.
            </p>
            <Button size="sm" variant="gold" className="mt-3 w-full" onClick={openGuide}>
              Mulai panduan
            </Button>
          </div>
        )}
        <button
          onClick={openGuide}
          className="flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-gold-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Compass className="h-4 w-4" />
          Panduan Demo
          {ready && (
            <span className="rounded-full bg-gold-foreground/10 px-2 py-0.5 text-xs">
              {doneCount}/{TRACKED}
            </span>
          )}
        </button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full max-w-md flex-col overflow-y-auto p-0 sm:w-[440px]">
          <div className="sticky top-0 z-10 border-b border-border bg-background px-6 py-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <SheetTitle className="text-lg font-bold text-foreground">Panduan Demo</SheetTitle>
                <SheetDescription className="mt-1 text-sm text-muted-foreground">
                  Coba tiga peran secara berurutan. Langkah bertanda lingkaran tercentang otomatis saat selesai.
                </SheetDescription>
              </div>
              <SheetClose asChild>
                <button aria-label="Tutup panduan" className="rounded-lg p-2 hover:bg-secondary">
                  <X className="h-5 w-5" />
                </button>
              </SheetClose>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={TRACKED} aria-valuenow={doneCount} aria-label="Kemajuan demo">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(doneCount / TRACKED) * 100}%` }} />
              </div>
              <span className="text-xs font-medium text-foreground">{doneCount}/{TRACKED} langkah</span>
            </div>
          </div>

          <div className="flex flex-col gap-6 px-6 py-6">
            {SCENARIOS.map((sc, i) => (
              <section key={sc.title}>
                <h3 className="flex items-center gap-3 font-semibold text-foreground">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  {sc.title}
                </h3>
                <p className="ml-10 text-xs text-muted-foreground">{sc.who}</p>
                <ol className="ml-10 mt-3 flex flex-col gap-3">
                  {sc.steps.map((st) => {
                    const done = st.done ? progress[st.done] : false;
                    return (
                      <li key={st.text} className="flex gap-2.5 text-sm">
                        {st.done ? (
                          done ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-label="Selesai" />
                          ) : (
                            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-label="Belum" />
                          )
                        ) : (
                          <span aria-hidden className="mt-[7px] flex w-4 shrink-0 justify-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                          </span>
                        )}
                        <div className={cn('min-w-0', done ? 'text-muted-foreground' : 'text-foreground')}>
                          <p>{st.text}</p>
                          {st.link && (
                            <Link
                              href={st.link.href}
                              onClick={() => setOpen(false)}
                              className="mt-1 inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
                            >
                              {st.link.label}
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}

            <section className="rounded-xl bg-secondary/60 p-4 text-sm text-secondary-foreground">
              <p className="flex items-center gap-2 font-semibold">
                <Info className="h-4 w-4" />
                Catatan demo
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Semua ustadz dan permintaan awal adalah data contoh.</li>
                <li>Data yang Anda tambahkan hanya tersimpan di browser ini, tidak terkirim ke ustadz sungguhan.</li>
                <li>Tombol &quot;Hubungi via WhatsApp&quot; membuka chat sungguhan ke nomor yang diisi pemohon.</li>
                <li>
                  Lihat juga{' '}
                  <Link href="/edukasi/" onClick={() => setOpen(false)} className="font-medium underline underline-offset-4">
                    Edukasi
                  </Link>{' '}
                  dan{' '}
                  <Link href="/ruqyah-mandiri/" onClick={() => setOpen(false)} className="font-medium underline underline-offset-4">
                    Ruqyah Mandiri
                  </Link>
                  .
                </li>
              </ul>
            </section>

            <Button
              variant="outline"
              onClick={() => confirm('Hapus semua perubahan dan mulai demo dari awal?') && resetDemo()}
            >
              <RotateCcw className="h-4 w-4" />
              Ulangi demo dari awal
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
