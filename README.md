# Taut Ruqyah (ruqyah-finder)

Web app connecting people who believe they need ruqyah syari with nearby
**verified** ruqyah practitioners (ustad), via WhatsApp. Target region:
Indonesia. Not a medical or religious authority — just a matchmaker, with
verification as the main quality gate.

## Status

Practice/prototype repo, not production-ready. Contains three stages of the
same idea, at different levels of completeness — see [NOTE.md](NOTE.md) for
the full breakdown.

⚠️ **Schema is currently out of sync.** The working code
(`01-prototype-html/`, `02-nextjs-app/`) still uses the old schema
(`ustad` + `permintaan`, free-text `area`). The final intended schema
(`pengguna` + `kasus` split, structured provinsi/kabupaten/kecamatan,
`laporan`, `tindak_lanjut`, screening tables) lives in
`03-dokumentasi/schema-final.sql` and has **not** been wired into the app
code yet.

## Structure

- **`01-prototype-html/`** — original build-free prototype: a single
  `index.html` (vanilla JS + Supabase JS client loaded via CDN) plus
  `schema.sql`. Deployable as a static file, no Node.js needed.
- **`02-nextjs-app/`** — Next.js 14 rewrite of the same prototype
  (`npm run build` verified working). Same old schema as above.
- **`03-dokumentasi/`** — final design docs: `DESIGN.md` (full product/DB
  design, user flow, screening question draft, MVP scope, safety notes,
  roadmap) and `schema-final.sql` (the target database schema).

## How matching works (current implementation)

1. User submits name, WhatsApp number, and address.
2. If the browser grants geolocation: distance to each active + verified
   ustad is computed via the haversine formula, sorted, top 3 returned.
3. If not: falls back to naive substring matching between the ustad's `area`
   text field and the user's typed address.
4. User gets a `wa.me` link pre-filled with an introduction message to
   contact the matched ustad directly.

Only ustad with `terverifikasi = true` (manually verified) and `aktif = true`
are ever shown.

## Next.js app — quick start

```bash
cd 02-nextjs-app
cp .env.local.example .env.local   # fill in Supabase project URL + anon key
npm install
npm run dev
```

Requires a Supabase project with `schema.sql` (from the same folder or
`01-prototype-html/`) applied via the SQL editor, plus at least one verified
`ustad` row with `lat`/`lng` set.

## Where the product thinking lives

`03-dokumentasi/DESIGN.md` is the real source of truth for where this is
headed: a pre-screening questionnaire (to route medical red flags to
professional help *before* anything ruqyah-related), a `laporan`
(report/flag) mechanism for ongoing ustad quality control, and post-case
follow-up — none of which is implemented in the current app code yet.
