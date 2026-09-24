'use client';

import { useState } from 'react';
import { Navbar } from '@/components/landing/navbar';
import { Hero, type SearchParams } from '@/components/landing/hero';
import { UstadzResults } from '@/components/landing/ustadz-results';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Services } from '@/components/landing/services';
import { About } from '@/components/landing/about';
import { Testimonials } from '@/components/landing/testimonials';
import { CTA } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';
import { supabase } from '@/lib/supabaseClient';
import { matchUstad, type MatchResult, type Ustad } from '@/lib/matching';

export default function Home() {
  const [results, setResults] = useState<MatchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch({ alamat, lat, lng }: SearchParams) {
    setError(null);
    setLoading(true);
    try {
      const { data: ustadList, error: fetchError } = await supabase
        .from('ustad')
        .select('*')
        .eq('aktif', true)
        .eq('terverifikasi', true);

      if (fetchError) throw fetchError;

      const matched = matchUstad((ustadList ?? []) as Ustad[], { userLat: lat, userLng: lng, alamat });
      setResults(matched);
      setSearched(true);

      supabase
        .from('permintaan')
        .insert({
          alamat,
          lat,
          lng,
          matched_ustad_id: matched[0]?.ustad?.id ?? null,
        })
        .then(() => {});
    } catch (err) {
      setError(
        'Terjadi kendala saat mencari ustadz. Silakan coba lagi. (' +
          (err instanceof Error ? err.message : String(err)) +
          ')'
      );
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero onSearch={handleSearch} loading={loading} />
      <UstadzResults results={results} searched={searched} loading={loading} error={error} />
      <HowItWorks />
      <Services />
      <About />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
