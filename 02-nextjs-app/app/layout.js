import './globals.css';

export const metadata = {
  title: 'Taut Ruqyah — Terhubung dengan ustad ruqyah syari terdekat',
  description:
    'Masukkan alamat Anda, dan Taut Ruqyah menghubungkan Anda dengan ustad ruqyah syari terverifikasi terdekat lewat WhatsApp.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
