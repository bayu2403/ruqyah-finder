'use client';

import { BadgeCheck, MapPin, MessageCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { normalizeWa, type MatchResult } from '@/lib/matching';

export function UstadzResults({
  results,
  searched,
  loading,
  error,
}: {
  results: MatchResult[];
  searched: boolean;
  loading: boolean;
  error: string | null;
}) {
  return (
    <section id="ustadz-results" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Ustadz yang Bisa Dihubungi</h2>
          <p className="mt-2 text-muted-foreground">
            {searched
              ? 'Dicocokkan berdasarkan lokasi Anda. Hanya ustadz terverifikasi yang ditampilkan.'
              : 'Cari alamat Anda di atas untuk melihat ustadz ruqyah syari terdekat.'}
          </p>
        </div>

        {error && (
          <div className="mx-auto mb-6 max-w-lg rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {!searched && !loading && (
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
            <Search className="h-8 w-8" />
            <p>Belum ada pencarian. Gunakan kotak pencarian pada bagian atas halaman.</p>
          </div>
        )}

        {searched && !loading && results.length === 0 && !error && (
          <div className="mx-auto max-w-md rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
            Belum ada ustadz terverifikasi di area ini. Coba aktifkan lokasi, atau perluas kata kunci
            alamat Anda.
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(({ ustad, dist }) => {
            const distText =
              dist !== null ? `${dist < 1 ? '<1' : dist.toFixed(1)} km dari lokasi Anda` : ustad.area || 'Area layanan tidak tercatat';
            const pesan = encodeURIComponent(
              `Assalamu'alaikum Ustadz, saya mendapat kontak Ustadz dari RuqyahKu dan ingin bertanya soal ruqyah syari.`
            );

            return (
              <Card key={ustad.id} className="animate-fade-up">
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="text-lg font-semibold">{ustad.nama.charAt(0)}</span>
                    </div>
                    {ustad.terverifikasi && (
                      <Badge className="gap-1">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Terverifikasi
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{ustad.nama}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {distText}
                    </p>
                  </div>
                  <Button asChild className="mt-2 gap-2">
                    <a
                      href={`https://wa.me/${normalizeWa(ustad.no_wa)}?text=${pesan}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Hubungi via WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
