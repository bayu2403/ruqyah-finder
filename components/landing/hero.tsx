import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroPhone } from '@/components/landing/hero-phone';
import { MITRA, MITRA_LABEL } from '@/lib/config';
import { POOL_RADIUS_KM } from '@/lib/matching';

export function Hero() {
  return (
    <section id="home" className="bg-hero-pattern relative isolate overflow-hidden rounded-b-[40px] bg-primary text-primary-foreground">
      <div className="relative z-[1] mx-auto grid max-w-6xl items-center gap-12 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-36">
        <div>
          <span className="rk-enter inline-flex items-center gap-2.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 py-1.5 pl-3 pr-4 text-sm text-[#e3eee8]">
            <i className="h-2 w-2 rounded-full bg-gold" />
            {MITRA.nama ? `Bekerja sama dengan ${MITRA.nama}` : `Ustadz diverifikasi ${MITRA_LABEL}`}
          </span>
          <p dir="rtl" lang="ar" className="rk-enter mb-1.5 mt-6 w-fit font-arabic text-3xl text-gold">
            بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
          </p>
          <h1 className="rk-enter mb-5 text-[clamp(38px,5vw,64px)] font-extrabold leading-[1.04] tracking-[-0.03em]" style={{ ['--i' as string]: 1 }}>
            Ustadz ruqyah syar&apos;i terverifikasi, <span className="text-gold">dekat dengan Anda.</span>
          </h1>
          <p className="rk-enter mb-8 max-w-[32em] text-lg leading-relaxed text-[#c9dcd2]" style={{ ['--i' as string]: 1 }}>
            Tentukan lokasi, kirim permintaan singkat, dan ustadz terdekat yang tersedia akan menghubungi Anda lewat
            WhatsApp.
          </p>
          <div className="rk-enter flex flex-wrap gap-3" style={{ ['--i' as string]: 2 }}>
            <Button asChild size="lg" variant="gold" className="group h-[52px] rounded-full px-6">
              <Link href="/#ajukan">
                Cari Ustadz Terdekat
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-[52px] rounded-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/ruqyah-mandiri">Panduan Ruqyah Mandiri</Link>
            </Button>
          </div>
          <dl className="rk-enter mt-10 flex flex-wrap gap-2.5" style={{ ['--i' as string]: 2 }}>
            <Cell k="Radius awal" v={`${POOL_RADIUS_KM} km`} />
            <Cell k="Biaya platform" v="Rp0" />
            <Cell k="Data dibagikan ke" v="1 ustadz" />
          </dl>
        </div>

        <div className="relative grid place-items-center py-6" aria-label="Contoh alur di ponsel">
          <div aria-hidden="true" className="absolute h-[440px] w-[440px] max-w-full rounded-full bg-primary-foreground/[0.04] ring-1 ring-primary-foreground/10" />
          <div className="rk-enter relative" style={{ ['--i' as string]: 2 }}>
            <HeroPhone />
          </div>
        </div>
      </div>
    </section>
  );
}

function Cell({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-3">
      <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#c9dcd2]">{k}</dt>
      <dd className="text-xl font-extrabold">{v}</dd>
    </div>
  );
}
