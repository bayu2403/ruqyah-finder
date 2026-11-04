import { SectionHead } from '@/components/landing/section-head';

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="11" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function Privacy() {
  return (
    <section id="privasi" className="pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow="Privasi" icon={<LockIcon />} title="Data dibuka seperlunya, hanya kepada yang menangani." />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rk-reveal rounded-3xl border border-border bg-card p-7 transition-transform duration-300 hover:-translate-y-1">
            <h3 className="text-lg font-extrabold">Yang tampil ke publik</h3>
            <ul className="mt-3.5 list-disc space-y-1.5 pl-5 text-muted-foreground">
              <li>Area perkiraan ustadz, bukan alamat</li>
              <li>Layanan dan jarak perkiraan</li>
              <li>Tanpa nomor telepon ustadz</li>
            </ul>
          </div>
          <div className="rk-reveal rounded-3xl border border-primary bg-primary p-7 text-primary-foreground transition-transform duration-300 hover:-translate-y-1">
            <h3 className="text-lg font-extrabold">Hanya untuk ustadz yang mengambil</h3>
            <ul className="mt-3.5 list-disc space-y-1.5 pl-5 text-[#c9dcd2]">
              <li>Nama dan nomor WhatsApp pemohon</li>
              <li>Keluhan yang ditulis pemohon</li>
              <li>Atas persetujuan pemohon</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
