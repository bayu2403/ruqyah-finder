import { BookOpen, Users, HeartPulse, ShieldCheck, Group, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const services = [
  {
    icon: BookOpen,
    title: 'Ruqyah Syariah',
    description: 'Sesi ruqyah sesuai tuntunan Al-Qur\'an dan Sunnah, dipandu ustadz bersertifikat.',
  },
  {
    icon: Users,
    title: 'Konsultasi Keluarga',
    description: 'Konsultasi bagi keluarga yang mendampingi anggota keluarga dalam proses ruqyah.',
  },
  {
    icon: HeartPulse,
    title: 'Penyembuhan Fisik',
    description: 'Pendampingan ruqyah untuk keluhan fisik yang diduga terkait gangguan non-medis.',
  },
  {
    icon: ShieldCheck,
    title: 'Perlindungan Diri',
    description: 'Bimbingan dzikir dan amalan harian untuk perlindungan diri dan keluarga.',
  },
  {
    icon: Group,
    title: 'Ruqyah Massal',
    description: 'Sesi ruqyah bersama dalam kelompok, cocok untuk komunitas atau masjid.',
  },
  {
    icon: Video,
    title: 'Konsultasi Online',
    description: 'Konsultasi awal jarak jauh sebelum menentukan jadwal sesi tatap muka.',
  },
];

export function Services() {
  return (
    <section id="services" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Layanan Kami</h2>
          <p className="mt-2 text-muted-foreground">Beragam layanan ruqyah syari untuk kebutuhan Anda.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="animate-fade-up">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1.5 font-semibold text-foreground">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
