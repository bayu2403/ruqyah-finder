import type { Metadata } from 'next';
import Link from 'next/link';
import { Droplets, Hand, HeartHandshake, Sparkles } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { AYAT_RUQYAH } from '@/lib/content/ayat-ruqyah';

export const metadata: Metadata = {
  title: 'Panduan Ruqyah Mandiri — RuqyahKu',
  description: "Panduan ruqyah mandiri dengan ayat-ayat Al-Qur'an dan doa dari sunnah.",
};

const ADAB = [
  { icon: Droplets, title: 'Bersuci', text: 'Berwudhu dan pilih tempat yang bersih dan tenang.' },
  { icon: Sparkles, title: 'Niat dan yakin', text: 'Yakini bahwa kesembuhan hanya datang dari Allah, bukan dari bacaan atau pembacanya.' },
  { icon: Hand, title: 'Baca, tiup, usap', text: 'Bacakan ayat, tiupkan ke kedua telapak tangan, lalu usapkan ke bagian tubuh yang bisa dijangkau.' },
  { icon: HeartHandshake, title: 'Boleh dibantu keluarga', text: 'Anggota keluarga atau mahram boleh membacakan ruqyah untuk Anda.' },
];

const DOA = [
  {
    title: 'Doa saat merasakan sakit',
    arabic: 'أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ',
    latin: "A'udzu billahi wa qudratihi min syarri ma ajidu wa uhadzir",
    arti: 'Aku berlindung kepada Allah dan kekuasaan-Nya dari keburukan yang aku rasakan dan aku khawatirkan.',
    cara: 'Letakkan tangan di bagian yang sakit, ucapkan "Bismillah" 3 kali, lalu doa ini 7 kali.',
    sumber: "HR. Muslim, dari 'Utsman bin Abil 'Ash",
  },
  {
    title: 'Doa perlindungan',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    latin: "A'udzu bikalimatillahit tammati min syarri ma khalaq",
    arti: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari keburukan makhluk yang Dia ciptakan.',
    cara: 'Dibaca saat singgah di suatu tempat dan di sore hari.',
    sumber: 'HR. Muslim',
  },
];

function toArabicDigits(n: number) {
  return String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

export default function RuqyahMandiriPage() {
  return (
    <PageShell
      eyebrow="Ruqyah Mandiri"
      title="Panduan Ruqyah Mandiri"
      intro="Untuk Anda yang jauh dari ustadz, atau sambil menunggu dihubungi. Ruqyah bisa dilakukan sendiri dengan membaca ayat-ayat Al-Qur'an dan doa dari sunnah."
    >
      <p className="rounded-lg border border-dashed border-border px-4 py-3 text-xs text-muted-foreground">
        Draf konten — perlu ditinjau dan disahkan oleh dewan syariah lembaga mitra sebelum dipublikasikan.
      </p>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        {ADAB.map((a) => (
          <div key={a.title} className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <a.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{a.title}</p>
              <p className="text-sm text-muted-foreground">{a.text}</p>
            </div>
          </div>
        ))}
      </section>

      <nav aria-label="Daftar bacaan" className="mt-10 flex flex-wrap gap-2">
        {AYAT_RUQYAH.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground hover:bg-secondary">
            {s.title}
          </a>
        ))}
        <a href="#doa" className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground hover:bg-secondary">
          Doa dari sunnah
        </a>
      </nav>

      <div className="mt-8 grid gap-6">
        {AYAT_RUQYAH.map((s) => (
          <section key={s.id} id={s.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <header className="bg-primary px-6 py-4 text-primary-foreground">
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <p className="mt-1 text-sm text-primary-foreground/80">{s.note}</p>
            </header>
            <ol className="divide-y divide-border">
              {s.verses.map((v) => (
                <li key={v.number} className="px-6 py-5">
                  <p dir="rtl" lang="ar" className="font-arabic text-2xl leading-[2.4] text-foreground sm:text-3xl sm:leading-[2.4]">
                    {v.arabic}{' '}
                    <span className="whitespace-nowrap text-xl text-gold">﴿{toArabicDigits(v.number)}﴾</span>
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{v.number}.</span> {v.translation}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <section id="doa" className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <header className="bg-primary px-6 py-4 text-primary-foreground">
            <h2 className="text-lg font-semibold">Doa dari sunnah</h2>
          </header>
          <div className="divide-y divide-border">
            {DOA.map((d) => (
              <div key={d.title} className="px-6 py-5">
                <p className="font-semibold text-foreground">{d.title}</p>
                <p dir="rtl" lang="ar" className="mt-3 font-arabic text-2xl leading-[2.2] text-gold sm:text-3xl">
                  {d.arabic}
                </p>
                <p className="mt-2 text-sm italic text-foreground">{d.latin}</p>
                <p className="mt-1 text-sm text-muted-foreground">&ldquo;{d.arti}&rdquo; ({d.sumber})</p>
                <p className="mt-2 rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground">{d.cara}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-10 rounded-2xl bg-primary px-6 py-8 text-primary-foreground sm:px-10">
        <h2 className="text-xl font-bold">Setelah ruqyah mandiri</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-primary-foreground/85">
          <li>Jaga shalat lima waktu dan dzikir pagi-petang.</li>
          <li>Jika keluhan berlanjut, ajukan permintaan agar dibantu ustadz terverifikasi.</li>
          <li>Jika ada kondisi darurat (kejang, pingsan, sesak napas berat, pikiran menyakiti diri), segera ke IGD atau hubungi 119.</li>
        </ul>
        <Button asChild variant="gold" className="mt-5">
          <Link href="/#ajukan">Ajukan permintaan ke ustadz</Link>
        </Button>
      </section>

      <p className="mt-8 text-xs text-muted-foreground">
        Teks Al-Qur&apos;an: rasm Utsmani dari The Noble Qur&apos;an Encyclopedia (QuranEnc). Terjemahan: Kementerian
        Agama RI. Disajikan melalui paket quran-json, lisensi CC BY-SA 4.0.
      </p>
    </PageShell>
  );
}
