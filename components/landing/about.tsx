import { BadgeCheck, ShieldCheck, Send, Lock } from 'lucide-react';
import { MITRA_LABEL } from '@/lib/config';

const aboutImage =
  'https://images.pexels.com/photos/39583568/pexels-photo-39583568.jpeg?auto=compress&cs=tinysrgb&w=1200';

const features = [
  {
    icon: BadgeCheck,
    title: 'Ustadz Terverifikasi',
    description: `Setiap ustadz diverifikasi oleh ${MITRA_LABEL} sebelum dapat menerima permintaan, dan dapat dinonaktifkan bila ada laporan.`,
  },
  {
    icon: ShieldCheck,
    title: 'Ruqyah Sesuai Syariah',
    description: 'Hanya ruqyah dengan Al-Qur\'an dan doa dari sunnah — tanpa jimat, mantra, atau ritual yang tidak ada tuntunannya.',
  },
  {
    icon: Send,
    title: 'Cukup Satu Permintaan',
    description: 'Kirim permintaan sekali, ustadz terdekat yang tersedia akan menghubungi Anda lewat WhatsApp.',
  },
  {
    icon: Lock,
    title: 'Privasi Terjaga',
    description: 'Nomor dan keluhan Anda hanya terlihat oleh satu ustadz yang mengambil permintaan Anda.',
  },
];

export function About() {
  return (
    <section id="about" className="py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <img src={aboutImage} alt="Masjid" className="h-80 w-full object-cover lg:h-full" />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden items-center gap-3 rounded-xl bg-background p-4 shadow-xl sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold text-gold-foreground">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Ustadz terverifikasi</p>
              <p className="text-xs text-muted-foreground">oleh {MITRA_LABEL}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">Tentang RuqyahKu</h2>
          <p className="mb-8 text-muted-foreground">
            RuqyahKu menghubungkan Anda dengan ustadz ruqyah syari terverifikasi terdekat — bukan
            otoritas medis maupun syar&apos;i, melainkan penghubung yang menjaga kualitas lewat proses
            verifikasi berkelanjutan.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-foreground">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
