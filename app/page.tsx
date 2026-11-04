import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { Ticker } from '@/components/landing/ticker';
import { HowItWorks } from '@/components/landing/how-it-works';
import { RequestSection } from '@/components/request/request-section';
import { Features } from '@/components/landing/features';
import { Privacy } from '@/components/landing/privacy';
import { Faq } from '@/components/landing/faq';
import { CTA } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <Hero />
      <Ticker />
      <HowItWorks />
      <RequestSection />
      <Features />
      <Privacy />
      <Faq />
      <CTA />
      <Footer />
    </main>
  );
}
