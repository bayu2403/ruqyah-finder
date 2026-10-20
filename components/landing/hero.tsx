import Link from 'next/link';
import { BookOpen, HandHeart, LocateFixed, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const heroImage =
  'https://images.pexels.com/photos/13693561/pexels-photo-13693561.jpeg?auto=compress&cs=tinysrgb&w=1920';

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[88vh] items-center overflow-hidden pt-28 pb-20 lg:pt-32"
    >
      <div className="absolute inset-0 -z-20">
        <img src={heroImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/90" />
        <div className="absolute inset-0 bg-hero-pattern opacity-40" />
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/90">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Penghubung ke ustadz ruqyah syar&apos;i terverifikasi
        </div>

        <p dir="rtl" lang="ar" className="mb-4 font-arabic text-3xl text-gold sm:text-4xl">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        <h1 className="mb-5 text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
          Temukan Ustadz Ruqyah <span className="text-gold">Syar&apos;i Terdekat</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-base text-primary-foreground/80 sm:text-lg">
          Tentukan lokasi Anda dan kirim permintaan singkat. Ustadz terverifikasi terdekat yang tersedia akan
          menghubungi Anda langsung lewat WhatsApp.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" variant="gold" className="w-full sm:w-auto">
            <Link href="/#ajukan">
              <LocateFixed className="h-4 w-4" />
              Cari Ustadz Terdekat
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
          >
            <Link href="/ruqyah-mandiri">
              <BookOpen className="h-4 w-4" />
              Panduan Ruqyah Mandiri
            </Link>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-primary-foreground/80">
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="h-4 w-4 text-gold" />
            Ustadz diverifikasi lembaga
          </div>
          <div className="flex items-center gap-2 text-sm">
            <HandHeart className="h-4 w-4 text-gold" />
            Gratis, tanpa biaya platform
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Lock className="h-4 w-4 text-gold" />
            Data hanya untuk ustadz yang menangani
          </div>
        </div>
      </div>
    </section>
  );
}
