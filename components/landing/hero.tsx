import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountUp } from '@/components/motion/count-up';
import { HeroPhone } from '@/components/landing/hero-phone';
import { MITRA, MITRA_LABEL } from '@/lib/config';
import { POOL_RADIUS_KM } from '@/lib/matching';

const ORBIT: { ring: 0 | 1; pos: string; i: number }[] = [
  { ring: 0, pos: '', i: 0 },
  { ring: 0, pos: 'top-auto bottom-[-13px]', i: 2 },
  { ring: 0, pos: 'top-[calc(50%-13px)] left-[-13px]', i: 4 },
  { ring: 1, pos: '', i: 1 },
  { ring: 1, pos: 'top-[calc(50%-13px)] left-auto right-[-13px]', i: 3 },
];

function OrbitPin({ pos, i }: { pos: string; i: number }) {
  return (
    <i className={`rk-orbit-pin ${pos}`} style={{ ['--i' as string]: i }}>
      <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3.5} />
    </i>
  );
}

export function Hero() {
  return (
    <section id="home" className="rk-dots rk-glow relative isolate overflow-hidden rounded-b-[40px] bg-primary text-primary-foreground">
      <div className="relative z-[1] mx-auto grid max-w-6xl items-center gap-10 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-36">
        <div>
          <span className="rk-enter inline-flex items-center gap-2.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 py-1.5 pl-2.5 pr-4 text-sm text-[#e3eee8]" style={{ ['--i' as string]: 0 }}>
            <i className="rk-breathe h-2.5 w-2.5 rounded-full bg-gold" />
            {MITRA.nama ? `Bekerja sama dengan ${MITRA.nama}` : `Ustadz diverifikasi ${MITRA_LABEL}`}
          </span>
          <p dir="rtl" lang="ar" className="rk-enter mb-1.5 mt-6 w-fit font-arabic text-3xl text-gold" style={{ ['--i' as string]: 1 }}>
            بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
          </p>
          <h1 className="rk-enter mb-5 text-[clamp(38px,5vw,64px)] font-extrabold leading-[1.02] tracking-[-0.035em]" style={{ ['--i' as string]: 2 }}>
            Ustadz ruqyah syar&apos;i terverifikasi, <span className="rk-sheen">dekat dengan Anda.</span>
          </h1>
          <p className="rk-enter mb-8 max-w-[32em] text-lg leading-relaxed text-[#c9dcd2]" style={{ ['--i' as string]: 3 }}>
            Tentukan lokasi, kirim permintaan singkat, dan ustadz terdekat yang tersedia akan menghubungi Anda lewat
            WhatsApp.
          </p>
          <div className="rk-enter flex flex-wrap gap-3" style={{ ['--i' as string]: 4 }}>
            <Button asChild size="lg" variant="gold" className="rk-shine group h-[52px] rounded-full px-6 shadow-[0_14px_30px_-12px_rgba(214,160,57,0.75)]">
              <Link href="/#ajukan">
                Cari Ustadz Terdekat
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-[52px] rounded-full border-primary-foreground/30 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/ruqyah-mandiri">Panduan Ruqyah Mandiri</Link>
            </Button>
          </div>
          <div className="rk-enter mt-10 flex flex-wrap gap-2.5" style={{ ['--i' as string]: 5 }}>
            <Cell k="Radius awal"><CountUp to={POOL_RADIUS_KM} /> km</Cell>
            <Cell k="Biaya platform">Rp<CountUp to={0} /></Cell>
            <Cell k="Data dibagikan ke"><CountUp to={1} /> ustadz</Cell>
          </div>
        </div>

        <div className="relative grid min-h-[480px] place-items-center sm:min-h-[600px]" aria-label="Contoh alur di ponsel">
          <div className="rk-sweep" aria-hidden="true" />
          <div className="rk-rings" aria-hidden="true">
            <span>{ORBIT.filter((o) => o.ring === 0).map((o) => <OrbitPin key={o.i} pos={o.pos} i={o.i} />)}</span>
            <span>{ORBIT.filter((o) => o.ring === 1).map((o) => <OrbitPin key={o.i} pos={o.pos} i={o.i} />)}</span>
            <span />
          </div>
          <div className="rk-enter" style={{ ['--i' as string]: 3 }}>
            <HeroPhone />
          </div>
        </div>
      </div>
    </section>
  );
}

function Cell({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-3 backdrop-blur-sm">
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#c9dcd2]">{k}</span>
      <span className="text-xl font-extrabold">{children}</span>
    </div>
  );
}
