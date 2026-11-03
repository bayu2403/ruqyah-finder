import { SectionHead } from '@/components/landing/section-head';

const steps = [
  {
    title: 'Tentukan Lokasi',
    description: 'Gunakan GPS atau pilih wilayah Anda, lalu lihat ustadz terverifikasi yang ada di sekitar Anda.',
  },
  {
    title: 'Kirim Permintaan',
    description: 'Isi nama, nomor WhatsApp, dan jenis layanan. Permintaan Anda masuk ke ustadz terdekat yang tersedia.',
  },
  {
    title: 'Ustadz Menghubungi Anda',
    description: 'Ustadz yang mengambil permintaan Anda akan mengirim pesan WhatsApp untuk mengatur waktu ruqyah.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow="Cara kerja" title="Tiga langkah, lalu lanjut di WhatsApp." />
        <ol className="relative grid gap-10 sm:grid-cols-3 sm:gap-5">
          <div aria-hidden="true" className="pointer-events-none absolute left-[8%] top-[29px] hidden h-px w-[84%] bg-border sm:block" />
          {steps.map((step, i) => (
            <li key={step.title} className="rk-reveal relative flex flex-col gap-3 px-2">
              <span className="relative grid h-[60px] w-[60px] place-items-center rounded-full bg-primary text-base font-extrabold text-gold shadow-[0_0_0_6px_hsl(var(--background))]">
                0{i + 1}
              </span>
              <h3 className="mt-1.5 text-xl font-extrabold tracking-tight text-foreground">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
