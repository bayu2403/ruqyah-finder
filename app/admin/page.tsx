import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { MITRA } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Admin Lembaga — RuqyahKu',
  robots: { index: false },
};

export default function AdminPage() {
  return (
    <PageShell
      eyebrow="Admin Lembaga"
      title={MITRA.nama ? `Dashboard Admin — ${MITRA.nama}` : 'Dashboard Admin'}
      intro={
        <>
          Kelola ustadz dan pantau permintaan. Permintaan yang belum diambil lebih dari beberapa jam perlu
          ditugaskan manual.{' '}
          <span className="font-medium text-foreground">Mode demo: halaman ini belum memakai login.</span>
        </>
      }
      width="max-w-6xl"
    >
      <AdminDashboard />
    </PageShell>
  );
}
