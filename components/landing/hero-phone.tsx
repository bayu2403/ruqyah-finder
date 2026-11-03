'use client';

import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

const LABELS = ['Langkah 1/3', 'Langkah 1/3', 'Langkah 2/3', 'Langkah 3/3'];
const PINS: [number, number][] = [[58, 48], [240, 46], [222, 152], [96, 160], [270, 108]];

// Plays the request flow on a loop: searching → found → sent → taken.
export function HeroPhone() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setStep(3);
      return;
    }
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 3800);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="rk-phone relative flex w-[318px] max-w-full flex-col gap-3 rounded-[44px] border border-border bg-background px-3.5 pb-4 pt-5 text-foreground shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)]"
      data-step={step}
      role="img"
      aria-label="Contoh alur di ponsel: mencari ustadz, 5 ustadz ditemukan, permintaan terkirim, lalu diambil ustadzah terdekat"
    >
      <div className="flex items-center justify-between px-1.5 text-[13px] font-bold">
        <span>Ruqyah<span className="text-primary">Ku</span></span>
        <span className="text-muted-foreground">{LABELS[step]}</span>
      </div>
      <div className="flex gap-1.5 px-1.5">
        {[0, 1, 2].map((i) => (
          <b key={i} className="rk-step-bar relative h-[5px] flex-1 overflow-hidden rounded-full bg-[#e3ebe6]" />
        ))}
      </div>
      <div className="relative h-[200px] overflow-hidden rounded-[22px] bg-[#e6f0ea]">
        <svg viewBox="0 0 300 210" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <g fill="#f3f8f4">
            <rect x="10" y="10" width="86" height="70" rx="8" /><rect x="110" y="10" width="80" height="48" rx="8" /><rect x="204" y="10" width="86" height="82" rx="8" />
            <rect x="10" y="100" width="66" height="100" rx="8" /><rect x="92" y="130" width="96" height="70" rx="8" /><rect x="204" y="110" width="86" height="90" rx="8" />
          </g>
          <path d="M-10 180 C 60 150, 110 210, 170 170 S 250 130, 320 155" fill="none" stroke="#cfe2e8" strokeWidth="11" strokeLinecap="round" />
          <g stroke="#fff" strokeWidth="5" fill="none"><path d="M0 92h300M102 0v210M196 0v210" /></g>
          {PINS.map(([cx, cy], i) => (
            <circle key={i} className="rk-mpin" style={{ ['--i' as string]: i }} cx={cx} cy={cy} r="10" fill="#063c2c" stroke="#fff" strokeWidth="3" />
          ))}
          <circle className="rk-ring" cx="150" cy="105" r="8" fill="none" stroke="#d6a039" strokeWidth="3" />
          <circle cx="150" cy="105" r="9" fill="#d6a039" stroke="#fff" strokeWidth="4" />
        </svg>
      </div>
      <div className="relative min-h-[128px]">
        <Panel s={0} title="Mencari ustadz terdekat…">
          Lokasi hanya dipakai untuk pencarian, tidak ditampilkan ke publik.
        </Panel>
        <Panel s={1} title="Alhamdulillah, 5 ustadz terdekat" chips={['Ustadz · ±1 km', 'Ustadzah · ±6 km']}>
          Kebayoran Baru · dalam ±6 km
        </Panel>
        <Panel s={2} title="Permintaan terkirim" chips={['Datang ke tempat', 'Ustadzah']}>
          Kode RQ-7K2M · masuk ke pool ustadz terdekat
        </Panel>
        <Panel s={3} title="Diambil ustadzah terdekat" wa>
          Insya Allah segera menghubungi Anda.
        </Panel>
      </div>
    </div>
  );
}

function Panel({ s, title, chips, wa, children }: { s: number; title: React.ReactNode; chips?: string[]; wa?: boolean; children: React.ReactNode }) {
  return (
    <div data-s={s} className="rk-panel absolute inset-0 flex flex-col gap-2 rounded-[20px] bg-secondary px-4 py-3.5">
      <p className="text-base font-extrabold">{title}</p>
      <p className="text-[13px] text-[#3d4a45]">{children}</p>
      {chips && (
        <div className="flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <span key={c} className="rounded-full border border-border bg-white px-2.5 py-1 text-[11.5px] font-bold">{c}</span>
          ))}
        </div>
      )}
      {wa && (
        <span className="mt-auto flex h-10 items-center justify-center gap-2 rounded-xl bg-gold text-[13px] font-extrabold text-gold-foreground">
          Pesan masuk di WhatsApp
        </span>
      )}
    </div>
  );
}
