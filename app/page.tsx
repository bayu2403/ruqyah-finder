import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { RequestSection } from '@/components/request/request-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Services } from '@/components/landing/services';
import { About } from '@/components/landing/about';
import { Testimonials } from '@/components/landing/testimonials';
import { CTA } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <HowItWorks />
      <RequestSection />
      <Services />
      <About />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
