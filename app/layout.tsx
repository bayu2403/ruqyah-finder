import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Amiri } from 'next/font/google';
import './globals.css';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const arabic = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RuqyahKu — Temukan Ustadz Ruqyah Syariah Terdekat',
  description:
    'Platform ruqyah syariah terpercaya di Indonesia. Masukkan alamat Anda untuk menemukan ustadz ruqyah syari terverifikasi terdekat dan hubungi langsung lewat WhatsApp.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sans.variable} ${arabic.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
