import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { UstadzDashboard } from '@/components/ustadz/ustadz-dashboard';

export const metadata: Metadata = {
  title: 'Halaman Ustadz — RuqyahKu',
  robots: { index: false },
};

export default function UstadzPage() {
  return (
    <PageShell
      eyebrow="Untuk Ustadz"
      title="Permintaan Ruqyah"
      intro="Permintaan baru dari sekitar Anda muncul di sini. Ambil permintaan yang bisa Anda tangani, lalu hubungi pemohon lewat WhatsApp."
      width="max-w-3xl"
    >
      <UstadzDashboard />
    </PageShell>
  );
}
