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
          <svg className="rk-rail pointer-events-none absolute left-[8%] top-[22px] hidden h-4 w-[84%] sm:block" viewBox="0 0 1000 16" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 8 H1000" pathLength={1} fill="none" stroke="#d6a039" strokeWidth={2.5} strokeDasharray={1} />
          </svg>
          {steps.map((step, i) => (
            <li key={step.title} className="rk-reveal group relative flex flex-col gap-3 px-2">
              <span className="relative grid h-[60px] w-[60px] place-items-center rounded-full bg-primary text-base font-extrabold text-gold shadow-[0_0_0_6px_hsl(var(--background)),0_14px_30px_-10px_rgba(6,60,44,0.55)] transition-transform duration-300 [transition-timing-function:var(--ease-spring)] group-hover:-rotate-6 group-hover:scale-110">
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
