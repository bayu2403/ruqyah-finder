import { Facebook, Instagram, Youtube, Mail, Phone } from 'lucide-react';

const linkColumns = [
  {
    title: 'Perusahaan',
    links: [
      { label: 'Tentang', href: '#about' },
      { label: 'Layanan', href: '#services' },
      { label: 'Testimoni', href: '#testimonials' },
    ],
  },
  {
    title: 'Bantuan',
    links: [
      { label: 'Cara Kerja', href: '#home' },
      { label: 'Cari Ustadz', href: '#search' },
      { label: 'Kontak', href: 'mailto:halo@ruqyahku.id' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2L4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-5z" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-lg font-bold text-foreground">
                Ruqyah<span className="text-primary">Ku</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Menghubungkan Anda dengan ustadz ruqyah syari terverifikasi terdekat.
            </p>
            <div className="mt-4 flex gap-3 text-muted-foreground">
              <a href="#" aria-label="Facebook" className="hover:text-primary"><Facebook className="h-5 w-5" /></a>
              <a href="#" aria-label="Instagram" className="hover:text-primary"><Instagram className="h-5 w-5" /></a>
              <a href="#" aria-label="Youtube" className="hover:text-primary"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

          {linkColumns.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-sm font-semibold text-foreground">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">Kontak</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> halo@ruqyahku.id
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +62 812-0000-0000
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>
            RuqyahKu hanya menghubungkan Anda dengan ustadz ruqyah syari yang telah diverifikasi. Kami
            tidak menjamin hasil ruqyah dan tidak bertindak sebagai pihak medis atau syar&apos;i resmi —
            keputusan sepenuhnya ada pada Anda dan ustadz yang bersangkutan.
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} RuqyahKu.</p>
        </div>
      </div>
    </footer>
  );
}
