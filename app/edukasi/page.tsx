import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Stethoscope, X } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: "Kenali Ruqyah Syar'i — RuqyahKu",
  description: "Cara membedakan ruqyah syar'i dari praktik perdukunan yang mengatasnamakan ruqyah.",
};

const SYARAT = [
  'Dengan kalamullah (ayat Al-Qur\'an), atau nama dan sifat-sifat Allah.',
  'Dengan bahasa Arab atau bahasa yang dipahami maknanya — tidak ada mantra atau bacaan yang tidak jelas.',
  'Diyakini bahwa ruqyah tidak berpengaruh dengan sendirinya; kesembuhan hanya dengan izin Allah.',
];

const PERBANDINGAN: { syari: string; menyimpang: string }[] = [
  {
    syari: 'Membaca ayat Al-Qur\'an dan doa dari sunnah dengan suara jelas yang bisa Anda dengar.',
    menyimpang: 'Membaca mantra berbisik, bahasa yang tidak dipahami, atau mencampur bacaan dengan nama selain Allah.',
  },
  {
    syari: 'Tidak menanyakan nama ibu, weton, atau tanggal lahir untuk "menerawang".',
    menyimpang: 'Meminta nama ibu, weton, atau foto untuk mengetahui "siapa pengirimnya".',
  },
  {
    syari: 'Tidak mengaku mengetahui hal ghaib atau menuduh orang tertentu sebagai pengirim sihir.',
    menyimpang: 'Mengaku tahu siapa pelaku, sehingga memicu permusuhan dalam keluarga atau tetangga.',
  },
  {
    syari: 'Tidak memberi jimat, rajah, wafaq, atau benda untuk dipakai, digantung, atau dikubur.',
    menyimpang: 'Memberi atau menjual jimat, rajah, keris, batu, atau "air khusus" sebagai pelindung.',
  },
  {
    syari: 'Tidak meminta syarat ritual: sesajen, ayam warna tertentu, kembang, atau menyembelih untuk selain Allah.',
    menyimpang: 'Mensyaratkan sesajen, puasa mutih, mandi kembang tengah malam, atau ritual di tempat keramat.',
  },
  {
    syari: 'Tidak mematok tarif mahal atau menjadikan bayaran syarat kesembuhan.',
    menyimpang: 'Meminta biaya besar di muka, atau mengancam penyakit kambuh jika tidak membayar.',
  },
  {
    syari: 'Menjaga adab: pasien perempuan didampingi mahram, tidak berduaan, tidak menyentuh aurat.',
    menyimpang: 'Meminta pasien datang sendirian, membuka aurat, atau mengadakan "ritual" di kamar tertutup.',
  },
  {
    syari: 'Mendorong pasien menjaga shalat, dzikir, dan tetap berobat ke tenaga medis bila perlu.',
    menyimpang: 'Melarang ke dokter atau menyuruh berhenti minum obat.',
  },
];

export default function EdukasiPage() {
  return (
    <PageShell
      eyebrow="Edukasi"
      title="Kenali Ruqyah Syar'i"
      intro="Banyak praktik perdukunan yang memakai nama ruqyah. Panduan singkat ini membantu Anda mengenali ruqyah yang sesuai tuntunan, agar Anda dan keluarga terlindungi."
    >
      <ReviewNote />

      <section className="mt-8 rounded-2xl bg-primary px-6 py-8 text-center text-primary-foreground sm:px-10">
        <p dir="rtl" lang="ar" className="font-arabic text-2xl text-gold sm:text-3xl">
          لَا بَأْسَ بِالرُّقَى مَا لَمْ يَكُنْ فِيهِ شِرْكٌ
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/80">
          &ldquo;Tidak mengapa ruqyah selama tidak mengandung kesyirikan.&rdquo; (HR. Muslim)
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-foreground">Apa itu ruqyah syar&apos;i?</h2>
        <p className="mt-3 text-muted-foreground">
          Ruqyah syar&apos;i adalah membacakan ayat-ayat Al-Qur&apos;an dan doa-doa yang diajarkan Rasulullah ﷺ
          untuk memohon perlindungan dan kesembuhan kepada Allah. Para ulama menyebutkan tiga syarat ruqyah yang
          dibolehkan:
        </p>
        <ol className="mt-5 grid gap-3">
          {SYARAT.map((s, i) => (
            <li key={s} className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold font-bold text-gold-foreground">
                {i + 1}
              </span>
              <p className="text-foreground">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-foreground">Syar&apos;i atau menyimpang?</h2>
        <p className="mt-3 text-muted-foreground">
          Jika menemui salah satu tanda di kolom kanan, berhati-hatilah — kemungkinan itu bukan ruqyah syar&apos;i.
        </p>
        <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="hidden grid-cols-2 border-b border-border bg-muted/60 text-sm font-semibold sm:grid">
            <p className="px-5 py-3 text-primary">Ruqyah syar&apos;i</p>
            <p className="px-5 py-3 text-foreground">Tanda praktik menyimpang</p>
          </div>
          {PERBANDINGAN.map((row) => (
            <div key={row.syari} className="grid border-b border-border last:border-0 sm:grid-cols-2">
              <p className="flex gap-3 px-5 py-4 text-sm text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-label="Syar'i" />
                {row.syari}
              </p>
              <p className="flex gap-3 border-t border-dashed border-border bg-destructive/5 px-5 py-4 text-sm text-foreground sm:border-l sm:border-t-0 sm:border-solid">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-label="Menyimpang" />
                {row.menyimpang}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Catatan: menerima hadiah atau upah atas ruqyah dibolehkan berdasarkan hadits Abu Sa&apos;id al-Khudri
          (HR. Bukhari dan Muslim). Yang perlu diwaspadai adalah biaya yang memberatkan atau dijadikan syarat
          kesembuhan.
        </p>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground">Mengapa harus waspada?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Rasulullah ﷺ memperingatkan bahwa siapa yang mendatangi dukun lalu membenarkan ucapannya, maka ia telah
            kufur terhadap apa yang diturunkan kepada Muhammad (HR. Abu Dawud). Beliau juga bersabda bahwa siapa
            yang menggantungkan jimat, ia telah berbuat syirik (HR. Ahmad).
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Stethoscope className="h-5 w-5 text-primary" />
            Ruqyah dan medis berjalan bersama
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Berobat ke dokter adalah bagian dari ikhtiar. Kejang, pingsan, sesak napas berat, demam tinggi, atau
            pikiran menyakiti diri adalah kondisi darurat — segera ke IGD atau hubungi <strong>119</strong>.
          </p>
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-border bg-secondary/50 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-foreground">Menemui praktik menyimpang?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Seluruh ustadz di RuqyahKu diverifikasi oleh lembaga. Jika ustadz yang menghubungi Anda melakukan salah
          satu tanda di atas, laporkan kepada kami agar dapat ditindaklanjuti.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          {/* TODO(BE): replace mailto with the `laporan` form (docs/schema-final.sql) linked to the kasus kode. */}
          <Button asChild>
            <a href="mailto:halo@ruqyahku.id?subject=Laporan%20praktik%20ruqyah">Laporkan</a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/#ajukan">Cari ustadz terverifikasi</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}

function ReviewNote() {
  return (
    <p className="rounded-lg border border-dashed border-border px-4 py-3 text-xs text-muted-foreground">
      Draf konten — perlu ditinjau dan disahkan oleh dewan syariah lembaga mitra sebelum dipublikasikan.
    </p>
  );
}
