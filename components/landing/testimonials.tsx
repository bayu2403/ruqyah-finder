import { Star, Users, ShieldCheck, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  { icon: Users, label: 'Pengguna', value: '10K+' },
  { icon: ShieldCheck, label: 'Ustadz Terverifikasi', value: '500+' },
  { icon: Sparkles, label: 'Sesi Selesai', value: '25K+' },
  { icon: Star, label: 'Rating Rata-rata', value: '4.9' },
];

const testimonials = [
  {
    name: 'A.',
    text: 'Prosesnya mudah, ustadz yang dihubungkan juga ramah dan menjelaskan dengan sabar.',
  },
  {
    name: 'R.',
    text: 'Suka karena bisa langsung lihat ustadz terdekat dan hubungi sendiri lewat WhatsApp.',
  },
  {
    name: 'S.',
    text: 'Merasa lebih tenang karena tahu ustadznya sudah diverifikasi platform.',
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid gap-6 rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <stat.icon className="mb-2 h-6 w-6 text-gold" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-primary-foreground/80">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Apa Kata Mereka</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Contoh testimoni ilustratif — akan diperbarui dengan ulasan pengguna asli setelah peluncuran.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name}>
              <CardContent className="p-6">
                <div className="mb-3 flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold" />
                  ))}
                </div>
                <p className="mb-4 text-sm text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
