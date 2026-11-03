'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Lock, MessageCircle, ShieldCheck } from 'lucide-react';
import { SectionHead } from '@/components/landing/section-head';
import { CountUp, prefersReducedMotion } from '@/components/motion/count-up';
import { cn } from '@/lib/utils';

function Tile({ className, dark, children }: { className?: string; dark?: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  function move(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
    el.style.setProperty('--ry', `${(x - 0.5) * 6}deg`);
    el.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
  }
  function leave() {
    ref.current?.style.setProperty('--rx', '0deg');
    ref.current?.style.setProperty('--ry', '0deg');
  }

  return (
    <article
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={cn(
        'rk-tile rk-reveal relative flex flex-col gap-3.5 overflow-hidden rounded-[26px] border p-6',
        dark ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-[#c5d3ca]',
        className
      )}
    >
      {children}
    </article>
  );
}

function Num({ children, dark }: { children: string; dark?: boolean }) {
  return <span className={cn('text-xs font-bold tracking-[0.14em]', dark ? 'text-gold' : 'text-[#8a6418]')}>{children}</span>;
}

function TileLink({ href, children, dark }: { href: string; children: string; dark?: boolean }) {
  return (
    <Link href={href} className={cn('group mt-auto inline-flex items-center gap-1.5 text-sm font-bold', dark ? 'text-gold' : 'text-primary')}>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

const MAP_PINS: [number, number][] = [[140, 92], [470, 76], [420, 248], [190, 262], [560, 200]];

function MapTile() {
  return (
    <Tile className="md:col-span-2 lg:col-span-4 lg:row-span-2">
      <Num>01 · PETA</Num>
      <h3 className="text-[21px] font-extrabold leading-tight tracking-tight">Ustadz terdekat, langsung terlihat</h3>
      <p className="text-[15px] text-muted-foreground">
        Lokasi ustadz ditampilkan sebagai area perkiraan, bukan alamat — cukup untuk membuat Anda tenang.
      </p>
      <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-[20px] bg-[#e6f0ea]">
        <svg viewBox="0 0 640 340" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <g fill="#f3f8f4">
            <rect x="20" y="20" width="180" height="110" rx="12" /><rect x="226" y="20" width="160" height="80" rx="12" /><rect x="412" y="20" width="208" height="130" rx="12" />
            <rect x="20" y="156" width="130" height="164" rx="12" /><rect x="176" y="206" width="190" height="114" rx="12" /><rect x="392" y="176" width="228" height="144" rx="12" />
            <rect x="226" y="122" width="140" height="62" rx="12" />
          </g>
          <path d="M-10 290 C 110 240, 200 320, 320 270 S 520 190, 660 236" fill="none" stroke="#cfe2e8" strokeWidth="18" strokeLinecap="round" />
          <g stroke="#fff" strokeWidth="7" fill="none"><path d="M0 142h640M212 0v340M380 0v340M0 196h160" /></g>
          <circle cx="320" cy="170" r="92" fill="#063c2c" fillOpacity=".05" stroke="#063c2c" strokeOpacity=".22" strokeDasharray="5 7" />
          <path className="rk-route" d="M320 170 C 280 140, 230 120, 190 106 S 150 96, 140 92" fill="none" stroke="#d6a039" strokeWidth="4" strokeLinecap="round" />
          {MAP_PINS.map(([cx, cy], i) => (
            <g key={i} className="rk-pop" style={{ ['--i' as string]: i }}>
              <circle cx={cx} cy={cy} r="34" fill="#063c2c" fillOpacity=".08" />
              <circle cx={cx} cy={cy} r="16" fill="#063c2c" stroke="#fff" strokeWidth="3.5" />
            </g>
          ))}
          <circle className="rk-ring" cx="320" cy="170" r="10" fill="none" stroke="#d6a039" strokeWidth="3" />
          <circle cx="320" cy="170" r="11" fill="#d6a039" stroke="#fff" strokeWidth="4" />
        </svg>
        <div className="absolute inset-x-3.5 bottom-3.5 flex items-center gap-2.5 rounded-[14px] bg-background/90 px-3.5 py-3 text-[15px] font-bold backdrop-blur">
          <ShieldCheck className="h-5 w-5 shrink-0 text-[#8a6418]" />
          <span>Contoh: Alhamdulillah, <CountUp to={5} /> ustadz dalam ±6 km</span>
        </div>
      </div>
      <TileLink href="/#ajukan">Coba cari ustadz</TileLink>
    </Tile>
  );
}

function AmbilTile() {
  const [state, setState] = useState<'idle' | 'taking' | 'taken'>('idle');

  function ambil() {
    setState('taking');
    setTimeout(() => setState('taken'), prefersReducedMotion() ? 0 : 800);
  }

  return (
    <Tile className="lg:col-span-2">
      <Num>02 · SATU USTADZ</Num>
      <h3 className="text-[21px] font-extrabold leading-tight tracking-tight">Diambil satu ustadz saja</h3>
      <div className="flex flex-1 flex-col justify-center">
        {state === 'taken' ? (
          <div className="rk-open rounded-[18px] border-2 border-primary bg-background p-3.5" role="status">
            <p className="text-[15px] font-extrabold">Rina (contoh)</p>
            <p className="text-[12.5px] text-muted-foreground">0812-0000-0902 · Tebet</p>
            <p className="mt-2 text-[13px]">“Sering mimpi buruk dan gelisah setiap malam.”</p>
            <button
              type="button"
              onClick={() => setState('idle')}
              className="mt-2.5 flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-gold text-sm font-bold text-gold-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp · ulangi demo
            </button>
          </div>
        ) : (
          <div className="rounded-[18px] border border-border bg-background p-3.5">
            <p className="text-sm font-extrabold">RQ-C3D4</p>
            <p className="text-[12.5px] text-muted-foreground">Tebet · ±1 km · 12 menit lalu</p>
            <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              Data terbuka setelah diambil
            </p>
            <button
              type="button"
              onClick={ambil}
              disabled={state === 'taking'}
              className="mt-2.5 flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground disabled:bg-[#0f5a43]"
            >
              {state === 'taking' && <Loader2 className="h-4 w-4 animate-spin" />}
              {state === 'taking' ? 'Mengambil…' : 'Ambil permintaan'}
            </button>
          </div>
        )}
      </div>
      <p className="text-[15px] text-muted-foreground">Coba tekan “Ambil”.</p>
    </Tile>
  );
}

function MandiriTile() {
  return (
    <Tile dark className="lg:col-span-2">
      <Num dark>03 · RUQYAH MANDIRI</Num>
      <h3 className="text-[21px] font-extrabold leading-tight tracking-tight">Panduan sambil menunggu</h3>
      <p dir="rtl" lang="ar" className="font-arabic text-[34px] leading-[1.7] text-gold">قُلۡ أَعُوذُ بِرَبِّ ٱلۡفَلَقِ</p>
      <p className="text-[15px] text-[#c9dcd2]">
        “Katakanlah, ‘Aku berlindung kepada Tuhan yang menguasai subuh (fajar)’” — QS. Al-Falaq: 1
      </p>
      <TileLink href="/ruqyah-mandiri" dark>Buka panduan</TileLink>
    </Tile>
  );
}

const SYARI = ['Ayat Al-Qur’an dan doa dari sunnah, dibaca jelas', 'Tanpa jimat, rajah, atau benda untuk disimpan', 'Mendorong tetap berobat ke tenaga medis'];
const MENYIMPANG = ['Mantra berbisik atau bacaan yang tidak dipahami', 'Memberi atau menjual jimat dan “air khusus”', 'Melarang ke dokter atau berhenti minum obat'];

function EdukasiTile() {
  const [bad, setBad] = useState(false);
  const items = bad ? MENYIMPANG : SYARI;
  return (
    <Tile className="lg:col-span-3">
      <Num>04 · EDUKASI</Num>
      <h3 className="text-[21px] font-extrabold leading-tight tracking-tight">Kenali ruqyah syar&apos;i</h3>
      <div className="relative inline-grid grid-cols-2 self-start rounded-full bg-secondary p-1">
        <span
          aria-hidden="true"
          className={cn(
            'absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-full bg-primary transition-transform duration-300 [transition-timing-function:var(--ease-spring)]',
            bad && 'translate-x-full'
          )}
        />
        {(['Syar’i', 'Menyimpang'] as const).map((label, i) => (
          <button
            key={label}
            type="button"
            aria-pressed={bad === (i === 1)}
            onClick={() => setBad(i === 1)}
            className={cn('relative z-[1] rounded-full px-4 py-2 text-[13px] font-bold transition-colors', bad === (i === 1) ? 'text-primary-foreground' : 'text-muted-foreground')}
          >
            {label}
          </button>
        ))}
      </div>
      <ul key={String(bad)} className="grid gap-2">
        {items.map((t, i) => (
          <li
            key={t}
            className={cn('rk-enter rounded-xl px-3 py-2.5 text-[14.5px]', bad ? 'bg-[#fdf3f0]' : 'bg-background')}
            style={{ ['--i' as string]: i * 0.6 - 0.8 }}
          >
            {t}
          </li>
        ))}
      </ul>
      <TileLink href="/edukasi">Baca panduan lengkap</TileLink>
    </Tile>
  );
}

function LembagaTile() {
  return (
    <Tile dark className="lg:col-span-3">
      <Num dark>05 · UNTUK LEMBAGA</Num>
      <h3 className="text-[21px] font-extrabold leading-tight tracking-tight">Lihat wilayah yang belum terjangkau</h3>
      <div className="relative h-[170px] overflow-hidden rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5" aria-hidden="true">
        {[
          { l: '22%', t: '40%', s: 64, ok: true, d: 0 },
          { l: '40%', t: '62%', s: 44, ok: true, d: 0.6 },
          { l: '66%', t: '34%', s: 52, ok: false, d: 0 },
          { l: '82%', t: '66%', s: 36, ok: true, d: 1.1 },
          { l: '54%', t: '80%', s: 30, ok: false, d: 0.4 },
        ].map((c, i) => (
          <span
            key={i}
            className={cn(
              'absolute -translate-x-1/2 -translate-y-1/2 rounded-full',
              c.ok ? 'rk-cov-ok border-2 border-gold bg-gold/25' : 'rk-cov-gap border-2 border-dashed border-[#f2a08f] bg-[#e5715a]/35'
            )}
            style={{ left: c.l, top: c.t, width: c.s, height: c.s, animationDelay: `${c.d}s` }}
          />
        ))}
        {[['24%', '44%'], ['38%', '58%'], ['84%', '63%']].map(([l, t]) => (
          <span key={l} className="absolute h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" style={{ left: l, top: t }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-3.5 text-[12.5px] text-[#c9dcd2]">
        <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-gold align-[-1px]" />Terlayani</span>
        <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#f2a08f] align-[-1px]" />Belum ada ustadz</span>
        <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-primary-foreground align-[-1px]" />Ustadz lembaga</span>
      </div>
      <TileLink href="/admin/" dark>Lihat dashboard admin</TileLink>
    </Tile>
  );
}

export function Features() {
  return (
    <section id="fitur" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead
          eyebrow="Fitur"
          title="Tenang dari langkah pertama."
          lead="Setiap layar punya satu tugas: membawa Anda ke ustadz yang tepat, tanpa kebingungan."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <MapTile />
          <AmbilTile />
          <MandiriTile />
          <EdukasiTile />
          <LembagaTile />
        </div>
      </div>
    </section>
  );
}
