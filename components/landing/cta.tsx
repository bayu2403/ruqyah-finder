import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-14">
          <p dir="rtl" className="mb-4 font-arabic text-2xl text-gold sm:text-3xl">
            وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ
          </p>
          <p className="mx-auto mb-8 max-w-2xl text-sm text-primary-foreground/80 sm:text-base">
            &ldquo;Dan Kami turunkan dari Al-Qur&apos;an sesuatu yang menjadi penawar dan rahmat bagi
            orang-orang yang beriman.&rdquo; — QS. Al-Isra&apos; (17): 82
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="gold">
              <a href="#search">Cari Ustadz Sekarang</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a href="#about">Pelajari Lebih Lanjut</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
