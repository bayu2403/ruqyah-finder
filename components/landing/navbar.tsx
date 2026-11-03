'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetClose, SheetTitle } from '@/components/ui/sheet';

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Cari Ustadz', href: '/#ajukan' },
  { label: 'Ruqyah Mandiri', href: '/ruqyah-mandiri' },
  { label: 'Edukasi', href: '/edukasi' },
];

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
          <path d="M12 2L4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-5z" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-lg font-extrabold tracking-tight text-foreground">
        Ruqyah<span className="text-primary">Ku</span>
      </span>
    </Link>
  );
}

// A floating glass pill, the same on every page. `solid` is kept for callers
// from before the redesign and no longer changes the look.
export function Navbar(_props: { solid?: boolean } = {}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-3 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-[62px] items-center gap-4 rounded-full border border-border/90 bg-background/80 pl-4 pr-2 shadow-[0_18px_40px_-22px_rgba(6,60,44,0.45)] backdrop-blur-xl backdrop-saturate-150">
          <Logo />

          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-2 lg:ml-2 lg:flex">
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/ustadz">Untuk Ustadz</Link>
            </Button>
            <Button asChild variant="gold" className="rounded-full px-6">
              <Link href="/#ajukan">Ajukan Ruqyah</Link>
            </Button>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button aria-label="Buka menu" className="ml-auto rounded-full p-3 text-foreground hover:bg-secondary lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" aria-describedby={undefined}>
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="mb-8 flex items-center justify-between">
                <Logo />
                <SheetClose asChild>
                  <button aria-label="Tutup menu" className="rounded-lg p-2 hover:bg-secondary">
                    <X className="h-5 w-5" />
                  </button>
                </SheetClose>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary"
                  >
                    <MapPin className="h-4 w-4 text-primary/50" />
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/ustadz" onClick={() => setOpen(false)}>Untuk Ustadz</Link>
                </Button>
                <Button asChild variant="gold" className="w-full">
                  <Link href="/#ajukan" onClick={() => setOpen(false)}>Ajukan Ruqyah</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
