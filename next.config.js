/** @type {import('next').NextConfig} */

// GitHub Pages serves the site from a subpath: https://<user>.github.io/<repo>/
// Set NEXT_PUBLIC_BASE_PATH (passed by the deploy workflow) so Next.js emits
// links/assets under that subpath. Leave it unset for local dev or a custom
// domain deploy (served from "/").
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  basePath,
  images: {
    unoptimized: true, // next/image optimization needs a server; static export has none
  },
};

module.exports = nextConfig;
