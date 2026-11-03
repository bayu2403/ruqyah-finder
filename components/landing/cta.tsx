import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section id="mulai" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="rk-dots rk-cta rk-reveal relative grid items-center gap-10 overflow-hidden rounded-[36px] bg-primary px-6 py-14 text-primary-foreground sm:px-14 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative z-[1]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Mulai hari ini</p>
          <h2 className="mt-4 text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.08] tracking-[-0.03em] [text-wrap:balance]">
            Satu permintaan, ustadz terdekat menghubungi Anda.
          </h2>
          <p className="mb-7 mt-4 text-[17px] text-[#c9dcd2]">Gratis, tanpa akun, dan data Anda hanya untuk ustadz yang menangani.</p>
          <Button asChild size="lg" variant="gold" className="rk-shine group h-[52px] rounded-full px-6">
            <Link href="/#ajukan">
              Cari ustadz terdekat
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="relative z-[1]">
          <p dir="rtl" lang="ar" className="rk-sheen font-arabic text-[clamp(30px,3.4vw,44px)] leading-[1.7]">
            وَنُنَزِّلُ مِنَ ٱلۡقُرۡءَانِ مَا هُوَ شِفَآءٞ وَرَحۡمَةٞ لِّلۡمُؤۡمِنِينَ
          </p>
          <p className="mt-2 text-right text-sm text-[#c9dcd2]">
            &ldquo;Dan Kami turunkan dari Al-Qur&apos;an (sesuatu) yang menjadi penawar dan rahmat bagi orang yang
            beriman.&rdquo; — QS. Al-Isra&apos;: 82
          </p>
        </div>
      </div>
    </section>
  );
}
