import { MapPin, Send, MessageCircle } from 'lucide-react';

const steps = [
  {
    icon: MapPin,
    title: 'Tentukan Lokasi',
    description: 'Gunakan GPS atau pilih wilayah Anda, lalu lihat ustadz terverifikasi yang ada di sekitar Anda.',
  },
  {
    icon: Send,
    title: 'Kirim Permintaan',
    description: 'Isi nama, nomor WhatsApp, dan jenis layanan. Permintaan Anda masuk ke ustadz terdekat yang tersedia.',
  },
  {
    icon: MessageCircle,
    title: 'Ustadz Menghubungi Anda',
    description: 'Ustadz yang mengambil permintaan Anda akan mengirim pesan WhatsApp untuk mengatur waktu ruqyah.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Cara Kerja</h2>
          <p className="mt-2 text-muted-foreground">Tiga langkah mudah menuju ruqyah syari yang tepat.</p>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <step.icon className="h-7 w-7" />
              </div>
              <span className="mb-2 text-sm font-semibold text-gold">Langkah {i + 1}</span>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
