'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { matchUstad, normalizeWa } from '@/lib/matching';

export default function Home() {
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [alamat, setAlamat] = useState('');
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [locStatus, setLocStatus] = useState(
    'Belum diaktifkan — pencarian akan memakai alamat teks saja'
  );
  const [locOk, setLocOk] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null); // { matched: [], sub: string } | null

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setLocStatus('Perangkat tidak mendukung deteksi lokasi.');
      return;
    }
    setLocStatus('Mendeteksi lokasi...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setLocStatus('Lokasi terdeteksi — pencarian akan lebih akurat');
        setLocOk(true);
      },
      () => {
        setLocStatus('Lokasi ditolak — pencarian memakai alamat teks saja');
        setLocOk(false);
      }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResults(null);
    setLoading(true);

    try {
      const { data: ustadList, error: fetchError } = await supabase
        .from('ustad')
        .select('*')
        .eq('aktif', true)
        .eq('terverifikasi', true);

      if (fetchError) throw fetchError;

      if (!ustadList || ustadList.length === 0) {
        setResults({ matched: [], sub: '', empty: true });
        return;
      }

      const matched = matchUstad(ustadList, { userLat, userLng, alamat });
      const sub =
        userLat !== null
          ? 'Diurutkan berdasarkan jarak terdekat dari lokasi Anda.'
          : 'Dicocokkan berdasarkan alamat. Aktifkan lokasi untuk hasil lebih akurat.';

      setResults({ matched, sub, empty: matched.length === 0 });

      // Catat permintaan (best-effort, tidak menghambat hasil jika gagal)
      supabase
        .from('permintaan')
        .insert({
          nama,
          no_wa: wa,
          alamat,
          lat: userLat,
          lng: userLng,
          matched_ustad_id: matched[0]?.ustad?.id || null,
        })
        .then(() => {});
    } catch (err) {
      setError('Terjadi kendala saat mencari ustad. Silakan coba lagi. (' + err.message + ')');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="wrap">
      <header>
        <p className="mark">Taut Ruqyah</p>
        <h1>Cari ustad ruqyah syari di dekat Anda</h1>
        <p className="lede">
          Isi data di bawah, dan kami tunjukkan ustad ruqyah syari terdekat yang bisa
          langsung Anda hubungi lewat WhatsApp.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nama">Nama</label>
          <input
            id="nama"
            type="text"
            required
            autoComplete="name"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="wa">Nomor WhatsApp Anda</label>
          <input
            id="wa"
            type="tel"
            required
            placeholder="08xxxxxxxxxx"
            autoComplete="tel"
            value={wa}
            onChange={(e) => setWa(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="alamat">Alamat lengkap</label>
          <textarea
            id="alamat"
            required
            placeholder="Jalan, kelurahan/desa, kecamatan, kota"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
          />
        </div>

        <div>
          <label>Lokasi (untuk mencari ustad terdekat secara akurat)</label>
          <div className="loc-row">
            <button type="button" className="loc-btn" onClick={handleUseLocation}>
              Gunakan lokasi saat ini
            </button>
            <span className={`loc-status${locOk ? ' ok' : ''}`}>{locStatus}</span>
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Mencari...' : 'Cari ustad terdekat'}
        </button>
        <p className="note">
          Data Anda hanya dipakai untuk menghubungkan dengan ustad, dan tidak dipublikasikan.
        </p>
      </form>

      {results && (
        <div id="results">
          <hr className="divider" />
          <h2>
            {results.empty ? 'Belum ditemukan ustad di area ini' : 'Ustad yang bisa dihubungi'}
          </h2>
          {results.sub && <p className="sub">{results.sub}</p>}
          <div>
            {results.empty ? (
              <div className="empty-state">
                Belum ada ustad terverifikasi di area Anda. Coba aktifkan lokasi, atau hubungi
                kami langsung.
              </div>
            ) : (
              results.matched.map(({ ustad, dist }) => (
                <UstadCard key={ustad.id} ustad={ustad} dist={dist} nama={nama} alamat={alamat} />
              ))
            )}
          </div>
        </div>
      )}

      <footer>
        Taut Ruqyah hanya menghubungkan Anda dengan ustad ruqyah syari yang telah
        diverifikasi. Kami tidak menjamin hasil ruqyah dan tidak bertindak sebagai pihak
        medis atau syar&apos;i resmi — keputusan sepenuhnya ada pada Anda dan ustad yang
        bersangkutan.
      </footer>
    </div>
  );
}

function UstadCard({ ustad, dist, nama, alamat }) {
  const distText =
    dist !== null
      ? `${dist < 1 ? '<1' : dist.toFixed(1)} km dari lokasi Anda`
      : ustad.area || 'Area layanan tidak tercatat';

  const pesan = encodeURIComponent(
    `Assalamu'alaikum Ustad, saya ${nama}. Saya mendapat kontak Ustad dari Taut Ruqyah dan ingin bertanya soal ruqyah syari. Alamat saya: ${alamat}`
  );

  return (
    <div className="ustad-card">
      <p className="name">{ustad.nama}</p>
      <p className="dist">{distText}</p>
      {dist !== null && ustad.area && <p className="area">{ustad.area}</p>}
      <a
        className="wa-btn"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://wa.me/${normalizeWa(ustad.no_wa)}?text=${pesan}`}
      >
        Hubungi via WhatsApp
      </a>
    </div>
  );
}
