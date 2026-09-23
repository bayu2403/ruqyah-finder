# Taut Ruqyah (ruqyah-finder)

Web app connecting people who believe they need ruqyah syari with nearby
**verified** ruqyah practitioners (ustad), via WhatsApp. Target region:
Indonesia. Not a medical or religious authority — just a matchmaker, with
verification as the main quality gate.

## Status

Practice/prototype repo, not production-ready.

⚠️ **Schema is currently out of sync.** The working app (root `app/`, `lib/`)
still uses the old schema (`ustad` + `permintaan`, free-text `area`) from
`legacy/prototype-html/schema.sql`. The final intended schema
(`pengguna` + `kasus` split, structured provinsi/kabupaten/kecamatan,
`laporan`, `tindak_lanjut`, screening tables) lives in
`docs/schema-final.sql` and has **not** been wired into the app code yet.

## Structure

- **root (`app/`, `lib/`, `package.json`, ...)** — the active Next.js 14 app.
  Same old schema as above.
- **`legacy/prototype-html/`** — original build-free prototype: a single
  `index.html` (vanilla JS + Supabase JS client loaded via CDN) plus
  `schema.sql`. Deployable as a static file, no Node.js needed. Superseded by
  the root app but kept for reference.
- **`docs/`** — final design docs: `DESIGN.md` (full product/DB design, user
  flow, screening question draft, MVP scope, safety notes, roadmap) and
  `schema-final.sql` (the target database schema).

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

## Quick start

```bash
npm install
npm run dev
```

No Supabase project needed to try it locally: if `.env.local` isn't set up
(or still has the placeholder values), `lib/supabaseClient.js` automatically
falls back to `lib/mockSupabase.js` — an in-memory dummy client seeded with a
few hardcoded `ustad` rows matching the schema, printing a console warning
so it's obvious mock data is in use. Inserts (`permintaan`) are logged and
kept in memory only, not persisted.

To use a real backend instead:

```bash
cp .env.local.example .env.local   # fill in Supabase project URL + anon key
```

Requires a Supabase project with `schema.sql` (from `legacy/prototype-html/`)
applied via the SQL editor, plus at least one verified `ustad` row with
`lat`/`lng` set.

## Where the product thinking lives

`docs/DESIGN.md` is the real source of truth for where this is headed: a
pre-screening questionnaire (to route medical red flags to professional
help *before* anything ruqyah-related), a `laporan` (report/flag) mechanism
for ongoing ustad quality control, and post-case follow-up — none of which
is implemented in the current app code yet.
