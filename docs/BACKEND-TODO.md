# Backend TODO — from static mockup to real app

The current app is a **static mockup**: no database, no login. Everything that
should eventually live on a server is hardcoded or kept in the browser's
`localStorage`, and marked in code with `TODO(BE)`. This file lists what each
marker needs, in the order to build it.

Search the code with: `grep -rn "TODO(BE" app components lib`

## How the mockup fakes the backend

| Mockup piece | File | Real version |
|---|---|---|
| Ustadz list (22 fictional rows, placeholder numbers) | `lib/data/ustad.ts` | `ustad` table, never sent to the browser in full |
| Region list (34 sample kecamatan with approximate centroids) | `lib/data/wilayah.ts` | Official Kemendagri/BPS list (~7,200 kecamatan) in a table |
| Requests, claims, admin edits | `lib/store.ts` (`localStorage`, shared across tabs of one browser) | `pengguna` + `kasus` tables, changed only through RPCs |
| "Masuk sebagai" ustadz picker | `components/ustadz/ustadz-dashboard.tsx` | Supabase Auth, one login = one `ustad` row |
| Admin page without login | `components/admin/admin-dashboard.tsx` | Supabase Auth with an `admin` role |

Each function in `lib/store.ts` is the seam: replace its body with the
Supabase call and the pages keep working.

## 1. Schema changes to `docs/schema-final.sql`

New columns used by the mockup (marked `NEW` in `lib/types.ts`):

- `ustad.jenis_kelamin` — `'L' | 'P'`, required (matching on preference)
- `ustad.layanan` — `text[]` of `datang | kunjungan | online`
- `ustad.pengalaman_tahun` — int
- `ustad.auth_user_id` — uuid FK to `auth.users`, unique (login)
- `kasus.layanan` — `datang | kunjungan | online`
- `kasus.preferensi` — `L | P | bebas`
- `kasus.sumber_lokasi` — `gps | wilayah`
- `kasus.kode` — short public code (`RQ-XXXX`), unique
- `kasus.diambil_pada` — timestamptz
- `kasus.ditugaskan_admin` — boolean
- `kasus.status` — add `menunggu` (in pool) and `diambil` (claimed), or map
  them onto the existing `baru` / `matched`
- Region columns should reference a `wilayah` table instead of free text

## 2. Security — fix before loading any real data

- **Remove the policy `publik baca ustad terverifikasi`.** As written it lets
  anyone with the public anon key download every verified ustadz's phone
  number, address and exact coordinates.
- Replace it with an RPC `ustad_terdekat(lat, lng, limit)` (security definer)
  that returns only what `UstadPublik` in `lib/types.ts` contains: gender,
  kecamatan, kabupaten, services, rounded distance, and an **offset**
  location. The offset logic is in `lib/matching.ts` (`approxLocation`) and
  must move server-side.
- Replace `publik insert pengguna` / `publik insert kasus` (`with check (true)`)
  with one RPC `ajukan_kasus(...)` that upserts `pengguna` on `no_wa`, inserts
  `kasus`, rate-limits per number/device, and returns only `kode`.

## 3. Ustadz side

- Login: Supabase Auth with WhatsApp or SMS OTP to the registered number.
- `pool_saya()` RPC/view: returns waiting `kasus` this ustadz is eligible for,
  using the same rules as `poolFor` in `lib/matching.ts`: preference matches
  gender, service is offered, within 15 km (50 km after 2 h, any distance for
  online). Columns: no name, no phone, no complaint.
- `ambil_kasus(kasus_id)` RPC, **atomic**:
  `update kasus set status='diambil', matched_ustad_id=$me, diambil_pada=now()
  where id=$1 and status='menunggu' returning *`. Only on success return
  the user's name, number and complaint. This stops two ustadz claiming the
  same request.
- An ustadz may update only their own `menerima_kasus_baru`.
- **Notifications** (not in the mockup): ustadz need to know a request
  arrived. Start with web push (installable web app, free); later the
  WhatsApp Business API under the organisation's number.

## 4. Admin side

- `admin` role; admin pages read via RPCs checked against that role, never
  the anon key.
- `tugaskan_kasus(kasus_id, ustad_id)` RPC; log who assigned it.
- Requests still `menunggu` after 6 h appear under "Perlu ditugaskan"
  (`needsAdmin` in `lib/matching.ts`); consider also notifying admins.
- Adding an ustadz: admin places the exact map pin (mockup uses the
  kecamatan centroid). New ustadz start `terverifikasi = false`.

## 5. Other items

- Reverse geocoding GPS → kecamatan (`nearestKecamatan` in
  `lib/data/wilayah.ts` only knows the sample list).
- Map tiles: OpenStreetMap's public tile server is fine for a demo; for
  production traffic use a tile provider per OSM's usage policy
  (`components/map/nearby-map.tsx`).
- Report form: `/edukasi` uses a `mailto:`; wire it to the `laporan` table,
  linked to the request `kode`.
- Data retention: delete or anonymise `kasus` (name, number, complaint)
  after an agreed period, per UU PDP; record consent with a timestamp.

## Content review (not code)

`/edukasi` and `/ruqyah-mandiri` show a "Draf konten" note. Before
publishing, the partner organisation's sharia board should review all text,
especially the hadith citations and the two du'a on `/ruqyah-mandiri`, which
were written by hand. The Qur'an verses come from `lib/content/ayat-ruqyah.ts`,
generated from the `quran-json` package (QuranEnc Uthmani text, Kemenag
translation, CC BY-SA 4.0); regenerate it with `scripts/gen-ayat.py` rather than editing the Arabic by hand:

```bash
npm pack quran-json@3.1.2 && tar -xzf quran-json-3.1.2.tgz
python3 scripts/gen-ayat.py package/dist/quran_id.json lib/content/ayat-ruqyah.ts
```
