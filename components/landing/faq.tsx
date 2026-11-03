import { SectionHead } from '@/components/landing/section-head';
import { MITRA_LABEL } from '@/lib/config';

const QA = [
  {
    q: 'Apakah ada biaya?',
    a: 'RuqyahKu tidak memungut biaya. Bila ada infaq atau biaya layanan ustadz, itu disepakati langsung antara Anda dan ustadz.',
  },
  {
    q: 'Siapa yang memverifikasi ustadz?',
    a: `Seluruh ustadz diverifikasi oleh ${MITRA_LABEL} sebelum dapat menerima permintaan, dan dapat dinonaktifkan bila ada laporan.`,
  },
  {
    q: 'Bagaimana data saya digunakan?',
    a: 'Nama, nomor, dan keluhan Anda hanya terlihat oleh satu ustadz yang mengambil permintaan Anda, dengan persetujuan Anda.',
  },
  {
    q: 'Bagaimana jika tidak ada ustadz di dekat saya?',
    a: 'Permintaan tetap diterima dan dibantu langsung oleh admin lembaga. Sambil menunggu, Anda bisa mengikuti panduan ruqyah mandiri.',
  },
  {
    q: 'Apakah ruqyah menggantikan dokter?',
    a: 'Tidak. Untuk kejang, pingsan, sesak napas berat, atau pikiran menyakiti diri, segera ke IGD atau hubungi 119.',
  },
];

export function Faq() {
  return (
    <section id="tanya" className="pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow="Tanya jawab" title="Yang sering ditanyakan." />
        <div className="rk-faq grid max-w-[840px] gap-2.5">
          {QA.map((item, i) => (
            <details
              key={item.q}
              open={i === 0}
              className="rk-reveal overflow-hidden rounded-[18px] border border-border bg-card transition-shadow open:border-[#c5d3ca] open:shadow-[0_20px_40px_-30px_rgba(6,60,44,0.5)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-base font-bold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-gold">
                {item.q}
              </summary>
              <p className="max-w-[64ch] px-5 pb-5 text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
