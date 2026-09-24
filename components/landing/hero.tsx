'use client';

import { useState } from 'react';
import { Search, Navigation, MapPinned, Star, Users, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const heroImage =
  'https://images.pexels.com/photos/13693561/pexels-photo-13693561.jpeg?auto=compress&cs=tinysrgb&w=1920';

export type SearchParams = { alamat: string; lat: number | null; lng: number | null };

export function Hero({
  onSearch,
  loading,
}: {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
}) {
  const [address, setAddress] = useState('');
  const [locStatus, setLocStatus] = useState<string | null>(null);
  const [mapNote, setMapNote] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;
    onSearch({ alamat: address, lat: null, lng: null });
  }

  function handleLocate() {
    if (!navigator.geolocation) {
      setLocStatus('Perangkat tidak mendukung deteksi lokasi.');
      return;
    }
    setLocStatus('Mendeteksi lokasi...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocStatus('Lokasi terdeteksi.');
        onSearch({ alamat: address, lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setLocStatus('Lokasi ditolak — silakan ketik alamat secara manual.')
    );
  }

  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-0px)] items-center overflow-hidden pt-28 pb-20 lg:pt-32"
    >
      <div className="absolute inset-0 -z-20">
        <img src={heroImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/90" />
        <div className="absolute inset-0 bg-hero-pattern opacity-40" />
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/90">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Terpercaya sejak 2024 · Bersertifikat Syariah
        </div>

        <p dir="rtl" className="mb-4 font-arabic text-3xl text-gold sm:text-4xl">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        <h1 className="mb-5 text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
          Temukan Ustadz Ruqyah <span className="text-gold">Syariah Terdekat</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-base text-primary-foreground/80 sm:text-lg">
          Platform ruqyah syariah terpercaya di Indonesia. Masukkan alamat Anda atau gunakan lokasi
          otomatis untuk menemukan ustadz berpengalaman dan terverifikasi di sekitar Anda.
        </p>

        <form
          id="search"
          onSubmit={handleSearch}
          className="mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl bg-background p-3 shadow-2xl sm:flex-row"
        >
          <div className="flex flex-1 items-center gap-2 px-2">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Masukkan alamat atau kota Anda..."
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Button type="submit" size="lg" disabled={loading} className="shrink-0">
            {loading ? 'Mencari...' : 'Cari Ustadz'}
          </Button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
          <button
            type="button"
            onClick={handleLocate}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 px-4 py-1.5 text-primary-foreground/90 transition-colors hover:bg-primary-foreground/10"
          >
            <Navigation className="h-3.5 w-3.5" />
            Gunakan Lokasi Saya
          </button>
          <button
            type="button"
            onClick={() => setMapNote(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 px-4 py-1.5 text-primary-foreground/90 transition-colors hover:bg-primary-foreground/10"
          >
            <MapPinned className="h-3.5 w-3.5" />
            Pilih dari Peta
          </button>
        </div>

        {(locStatus || mapNote) && (
          <p className="mt-3 text-sm text-primary-foreground/70">
            {mapNote ? 'Pilih dari peta akan segera tersedia — untuk sekarang gunakan lokasi otomatis atau ketik alamat.' : locStatus}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-primary-foreground/80">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-gold" />
            10.000+ Pengguna
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 text-gold" />
            4.9 Rating
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="h-4 w-4 text-gold" />
            Bersertifikat MUI
          </div>
        </div>
      </div>
    </section>
  );
}
