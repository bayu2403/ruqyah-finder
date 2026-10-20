import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { cn } from '@/lib/utils';

export function PageShell({
  eyebrow,
  title,
  intro,
  width = 'max-w-4xl',
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: React.ReactNode;
  width?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      <Navbar solid />
      <div className={cn('mx-auto px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-32', width)}>
        <header className="mb-8">
          {eyebrow && <p className="mb-2 text-sm font-semibold text-primary">{eyebrow}</p>}
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
          {intro && <div className="mt-3 max-w-2xl text-muted-foreground">{intro}</div>}
        </header>
        {children}
      </div>
      <Footer />
    </main>
  );
}
