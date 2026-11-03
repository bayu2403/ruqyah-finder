import { Quote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Illustrative only — replace with real, consented user feedback after the pilot.
const testimonials = [
  {
    name: 'A., Jakarta Selatan',
    text: 'Saya cukup isi nama dan nomor, tidak lama ustadz menghubungi lewat WhatsApp. Beliau sabar menjelaskan.',
  },
  {
    name: 'R., Bandung',
    text: 'Melihat ada beberapa ustadz di sekitar rumah membuat saya lebih tenang sebelum mengirim permintaan.',
  },
  {
    name: 'S., Surabaya',
    text: 'Ibu saya ditangani ustadzah, jadi kami merasa nyaman. Tidak ada jimat atau syarat aneh.',
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Apa Kata Mereka</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Contoh ilustratif — akan diganti dengan ulasan pengguna asli setelah uji coba.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name}>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <Quote className="h-5 w-5 text-gold" />
                  <Badge variant="outline">Ilustrasi</Badge>
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
