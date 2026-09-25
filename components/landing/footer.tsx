import { Mail, Phone } from 'lucide-react';

// lucide-react dropped brand/logo icons (trademark reasons), so social icons
// are small inline SVGs instead of lucide imports.
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
    </svg>
  );
}
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

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
              <a href="#" aria-label="Facebook" className="hover:text-primary"><FacebookIcon className="h-5 w-5" /></a>
              <a href="#" aria-label="Instagram" className="hover:text-primary"><InstagramIcon className="h-5 w-5" /></a>
              <a href="#" aria-label="Youtube" className="hover:text-primary"><YoutubeIcon className="h-5 w-5" /></a>
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
