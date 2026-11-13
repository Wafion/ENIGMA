# ENIGMA Asset Externalization Plan

**Status:** Proposed  
**Date:** 2026-11-12  
**Goal:** Remove exhibition binaries from Git while keeping development, previews, production, and the research pipeline working exactly as they do now.

---

## 1. Executive summary

The repository currently tracks **101 media files totaling 183.4 MB** in `public/assets`. Every clone, CI run, and Vercel deployment moves that payload, and **45.9 MB of it is exact duplicate data**. At the same time, source code contains **159 hardcoded `/assets/...` references across 25 files**, which makes the assets look like part of the application origin.

The target system:

- Canonical binaries live in **Cloudflare R2** behind a CDN custom domain such as `assets.enigma.example`.
- Git keeps only code, provenance metadata, and a small committed **`assets.lock.json`** manifest.
- A single resolver, `assetUrl()`, turns a logical path plus a content hash into a CDN URL.
- A small CLI handles `assets:push`, `assets:pull`, `assets:verify`, and `assets:manifest`.
- A fresh clone needs no media download. `npm run dev` reads assets from the CDN. Offline work is opt-in via `assets:pull`.
- Local cache lives in `.enigma-assets/`, which is gitignored and never bundled by Vite.

Expected results:

| Metric | Today | After |
| :--- | ---: | ---: |
| Tracked media in Git | 101 files / 183.4 MB | 0 files |
| Repo media payload | 183.4 MB | Manifest only (~50 KB) |
| Media delivery | Vercel static origin | CDN, immutable cache |
| Media egress cost | Vercel bandwidth/quota | $0 on R2 |
| New case asset commit | Binary files | Code + manifest entry |
| Fresh clone | Downloads 183.4 MB | Downloads code only |

---

## 2. Current state audit

### 2.1 Inventory

| Type | Files | Size |
| :--- | ---: | ---: |
| MP3 | 27 | 112.9 MB |
| WAV | 17 | 49.4 MB |
| JPG | 46 | 20.9 MB |
| SVG | 9 | < 0.1 MB |
| PNG | 1 | 0.2 MB |
| JSON | 1 | < 0.1 MB |
| **Total** | **101** | **183.4 MB** |

By case:

| Directory | Files | Size |
| :--- | ---: | ---: |
| `public/assets/blair-witch/` | 53 | 117.7 MB |
| `public/assets/db-cooper/` | 45 | 65.7 MB |
| `public/assets/dyatlov-pass/` | 3 | < 1 KB (placeholders) |
| `public/assets/dossiers/`, `home/`, `voynich-manuscript/` | 0 | 0 |

### 2.2 Findings that affect the migration

1. **Duplicate data.** There are 11 media duplicate groups, wasting **45.9 MB**:
   - 9 `.wav` files are actually MP3 data and are byte-identical to an `.mp3` sibling.
   - `branch-snap-woods.wav` duplicates `sfx-branch-snap.wav`.
   - `footsteps-dry-leaves.wav` duplicates `sfx-footsteps.wav`.
   - Separately, the three Dyatlov files are identical 149-byte placeholders.
2. **Mislabeled audio.** Of the 17 `.wav` files, 9 are MP3 streams (6 with ID3 headers, 3 with MPEG frame sync); only 8 are real RIFF/WAV. Serving these with `Content-Type: audio/wav` is wrong; a manifest that detects MIME from file magic fixes it.
3. **Placeholders.** The three `dyatlov-pass` images are 149-byte placeholder files, not real images.
4. **Hardcoded paths.** 159 `/assets/...` literals across 25 `.ts`/`.tsx` files. Patterns include:
   - `EnigmaAsset.localPath`
   - `DbcAsset.path`
   - direct JSX `src="/assets/..."`
   - template strings such as `/assets/blair-witch/audio/${assetId}.mp3`
   - `optDir` in `src/cases/case-002-db-cooper/edition/ui.tsx`
   - fallback arrays in both audio managers
   - runtime paths generated in `src/server/...`
5. **Server-side references.** The autonomous research code also emits `/assets/...` paths:
   - `src/server/composition/DocumentaryCompositionEngine.ts`
   - `src/server/audio/AudioSoundscapeEngine.ts`
   - `src/server/media/DocumentaryMediaEngine.ts`
   - `src/server/ingestion/DocumentIngestionService.ts` writes newly ingested dossiers to `public/assets/dossiers/...`
6. **CORS is already assumed.** `src/components/enigma/ASCIIImage.tsx`, `CinematicExhibitionView.tsx`, `PrologueHero.tsx`, and `CaseAsciiOpener.tsx` set `crossOrigin = 'anonymous'`; `AudioManager` uses `fetch()` plus `decodeAudioData()`. The CDN must return CORS headers for images and audio.
7. **Git history retains the payload.** Deleting files from `HEAD` does not shrink a clone because the blobs remain reachable in history. The repo only becomes lightweight after a coordinated history rewrite.
8. **Licensing is compatible with public hosting.** The reviewed assets are public domain, CC BY / CC BY-SA, GFDL, or project-original. Attribution and provenance must stay in the repository and remain visible in the UI.

---

## 3. Goals, non-goals, assumptions

### Goals

- No exhibition binaries in Git.
- Identical behavior in development, Vercel preview, and production.
- Offline development possible with one command.
- Deterministic, verifiable mapping from logical asset path to remote object.
- CDN caching, byte-range audio, CORS, and correct MIME types.
- Cheap at current traffic and at 100x current traffic.
- Preserve provenance and licensing metadata.

### Non-goals

- Building a full CMS or admin upload UI in the first pass.
- Re-encoding every archival original.
- Making all assets private or DRM-protected.
- Changing any narrative or visual behavior.

### Assumptions

- The exhibition remains a static Vite/React SPA on Vercel.
- Assets are public-read (no per-user access).
- The team can create a Cloudflare account and either use an existing domain or accept a temporary provider hostname.
- A coordinated force-push is acceptable when it is time to shrink history.

---

## 4. Target architecture

```text
┌──────────────────────┐        assets:push         ┌───────────────────────────┐
│  Local asset staging │ ─────────────────────────► │  Cloudflare R2 bucket     │
│  .enigma-assets/     │   S3 API, write token      │  enigma-assets            │
└──────────────────────┘                            │  public read via CDN      │
          ▲                                         └─────────────┬─────────────┘
          │ assets:pull                                           │
          │                                                       ▼
┌──────────────────────┐                            ┌───────────────────────────┐
│  Developer machine   │                            │  assets.enigma.example    │
│  npm run dev         │ ◄── direct GET / Range ─── │  Cloudflare cache + CORS  │
└──────────────────────┘                            └─────────────┬─────────────┘
          ▲                                                       │
          │                                                       │
┌──────────────────────┐        assetUrl(path)                   │
│  React app on Vercel │ ────────────────────────────────────────┘
│  assets.lock.json    │
└──────────────────────┘
```

### 4.1 Bucket layout

Mirror the existing `/assets` tree exactly. Human-readable keys make debugging and migration simple:

```text
enigma-assets/
├── blair-witch/
│   ├── audio/
│   ├── documents/
│   ├── images/
│   └── textures/
├── db-cooper/
│   ├── fbi/
│   ├── images/
│   ├── music/
│   ├── opt/
│   └── reconstructions/
└── dyatlov-pass/
```

- One bucket for curated exhibition media.
- `public/` keeps only application-shell files such as `favicon.svg` and `robots.txt`. Everything under `public/assets/` moves out.
- A separate bucket or reserved prefix for runtime-ingested dossiers (`dossiers/`) so `assets:prune` can never delete research output by accident.
- The same pattern can cover future binaries (video, PDFs, datasets). The local research SQLite database stays gitignored and local unless it is deliberately published to a private bucket.
- No `v1/` prefix is required. The manifest schema version plus content hashes provide versioning. If a breaking layout change is ever needed, use a new bucket or prefix and update the base URL.

### 4.2 URL scheme

```text
https://assets.enigma.example/blair-witch/images/seneca-creek-woods.jpg?v=3f2a91c4d1
```

- `v` is the first 10 characters of the file's SHA-256.
- The query changes only when the bytes change, so the object can be cached forever.
- The CDN must include query strings in its cache key. Do not enable a cache rule that strips query strings.
- If a CDN ever refuses query-based busting, switch to hash-suffixed object names (`...-3f2a91c4.jpg`) and keep the same manifest contract.

### 4.3 Manifest: `assets.lock.json`

Committed, deterministic, sorted by key. It is the source of truth for what must exist remotely.

```json
{
  "schemaVersion": 1,
  "assets": {
    "blair-witch/images/seneca-creek-woods.jpg": {
      "sha256": "3f2a91c4d1e6...",
      "md5": "9b1c...",
      "bytes": 503876,
      "mime": "image/jpeg",
      "width": 1600,
      "height": 1067,
      "variants": {
        "900": {
          "path": "blair-witch/images/seneca-creek-woods-900.jpg",
          "sha256": "a81f...",
          "bytes": 182340,
          "width": 900,
          "height": 600
        }
      }
    },
    "db-cooper/music/lemmino-aloft.mp3": {
      "sha256": "77c0...",
      "md5": "10ab...",
      "bytes": 2616641,
      "mime": "audio/mpeg",
      "durationSec": 218.4
    }
  }
}
```

Rules:

- Keys are logical paths relative to the asset root, with no leading `/assets/`.
- `mime` is detected from file magic, not just the extension. This catches the mislabeled WAV files.
- `sha256` is required. `md5` is optional but lets CI compare against R2's single-part ETag.
- `width`, `height`, and `durationSec` are optional but useful for layout stability and preload decisions.
- Variants are nested under the original asset so callers do not need to know the `opt/` naming convention.
- No timestamps in the manifest. Regenerating it should produce no diff when nothing changed.

### 4.4 Resolver

Client-side resolver (`src/core/assets/assetUrl.ts`):

```ts
import rawManifest from '../../../assets.lock.json';

interface AssetVariant {
  path: string;
  sha256: string;
  bytes: number;
  width?: number;
  height?: number;
}

interface AssetEntry {
  sha256: string;
  bytes: number;
  mime: string;
  path?: string;
  variants?: Record<string, AssetVariant>;
}

const manifest = rawManifest as {
  schemaVersion: number;
  assets: Record<string, AssetEntry>;
};

const CDN_BASE = (import.meta.env.VITE_ASSET_BASE_URL ?? '').replace(/\/$/, '');

export type AssetKey = keyof typeof manifest.assets;

export function assetUrl(path: AssetKey | string, variant?: string | number): string {
  const entry = manifest.assets[path];
  const target =
    variant && entry?.variants?.[String(variant)]
      ? entry.variants[String(variant)]
      : entry;

  const resolvedPath = target?.path ?? path;
  const hash = target?.sha256?.slice(0, 10);
  const base = CDN_BASE || '/assets';

  if (!entry && import.meta.env.DEV) {
    console.warn(`[assets] Unknown asset key: ${path}`);
  }

  return `${base}/${resolvedPath}${hash ? `?v=${hash}` : ''}`;
}

export function assetSrcSet(path: AssetKey | string): string | undefined {
  const entry = manifest.assets[path];
  if (!entry?.variants) return undefined;
  return Object.entries(entry.variants)
    .map(([width, variant]) => `${assetUrl(path, width)} ${width}w`)
    .join(', ');
}
```

Server-side resolver (`src/server/media/assetUrl.ts`):

```ts
const CDN_BASE = (process.env.ASSET_BASE_URL ?? '/assets').replace(/\/$/, '');

export function serverAssetUrl(path: string): string {
  return `${CDN_BASE}/${path.replace(/^\/+/, '')}`;
}
```

Notes:

- The client resolver bundles the manifest (~50 KB). Acceptable for now. If the manifest grows past a few hundred KB, split it per case and lazy-load.
- `assetUrl` should not throw in production. Missing keys are a CI failure, not a runtime crash.
- For runtime-ingested dossier assets that are not in the manifest, use `serverAssetUrl()` or a non-strict `cdnUrl()` helper. They are addressed by `dossiers/...` and get unique filenames at upload time.

### 4.5 Environment variables

Add to `.env.example`:

```bash
# Public base URL for exhibition media. Must be absolute in production.
VITE_ASSET_BASE_URL=https://assets.enigma.example

# Server-side base URL for the autonomous pipeline.
ASSET_BASE_URL=https://assets.enigma.example

# R2 upload credentials. CLI / server only. Never prefix these with VITE_.
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=enigma-assets
R2_PUBLIC_BASE_URL=https://assets.enigma.example
```

Vercel environment variables:

| Variable | Production | Preview | Development |
| :--- | :--- | :--- | :--- |
| `VITE_ASSET_BASE_URL` | `https://assets...` | `https://assets...` | `https://assets...` |
| `ASSET_BASE_URL` | optional | optional | optional |
| `R2_*` | only if deployed server uploads | only if deployed server uploads | local only |

Only the public base URL belongs in the client bundle. R2 credentials stay in local `.env.local`, CI secrets, or server-only Vercel variables. They are only needed in Vercel if a deployed server function performs ingestion uploads.

---

## 5. Storage and CDN setup

### 5.1 Cloudflare R2

1. Create a Standard bucket named `enigma-assets`. R2 asks for a payment method on file even when usage stays inside the free tier.
2. Create an R2 API token scoped to that bucket with Object Read & Write.
3. Connect a custom domain, e.g. `assets.enigma.example`, through Cloudflare DNS.
   - Custom domains get Cloudflare caching automatically.
   - `r2.dev` URLs are development-only and rate-limited; do not use them in production.
4. Configure CORS on the bucket:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD", "OPTIONS"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["Accept-Ranges", "Content-Length", "Content-Range", "ETag"],
    "MaxAgeSeconds": 86400
  }
]
```

`AllowedOrigins: ["*"]` is acceptable because these are public read-only media and it keeps Vercel preview URLs working. If hotlink restriction is required later, replace `*` with the exact production and preview origins.

5. Add a cache rule for `assets.enigma.example/*`:
   - Cache eligibility: Eligible for cache.
   - Edge TTL: 1 year.
   - Browser TTL: respect origin (`Cache-Control`).
   - Ensure query strings are part of the cache key.
6. Upload each object with:
   - `Content-Type` from the manifest.
   - `Cache-Control: public, max-age=31536000, immutable`.
   - Custom metadata: `sha256`, `md5`, `source-path`.
7. Verify:
   - `200` and correct `Content-Type`.
   - `Access-Control-Allow-Origin` present when `Origin` is sent.
   - `Accept-Ranges: bytes`.
   - `Range: bytes=0-1023` returns `206` and `Content-Range`.
   - `Cache-Control` includes `immutable`.

### 5.2 Provider comparison

| Provider | Storage | Egress | Custom domain | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **Cloudflare R2** | $0.015/GB-month, 10 GB free | Free | Yes, via Cloudflare | **Recommended** |
| Vercel Blob | $0.023/GB-month, 1 GB free on Hobby | 10 GB free, then ~$0.05/GB | Vercel hostname | Easiest fallback if no domain |
| Bunny Storage + CDN | ~$0.01/GB-month | ~$0.01/GB | `*.b-cdn.net` included | Good no-domain option |
| S3 + CloudFront | $0.023/GB-month | ~$0.085/GB | Yes | Not cost-effective here |
| Git LFS | Metered storage/bandwidth | Metered | No | Rejected; still repo-centric |
| GitHub Releases | Free-ish | No real CDN | No | Rejected; wrong tool |

At 183 MB (137 MB after dedupe), R2's 10 GB free tier covers storage, and egress is free. The expected monthly bill is **$0** plus an optional domain registration. Even 10 million reads/month are free.

> Pricing checked November 2026. Confirm current rates before committing to a provider.

---

## 6. Tooling

Add a small CLI under `scripts/assets/`:

```text
scripts/assets/
├── cli.mjs              # command dispatch
├── lib/r2.mjs           # S3 client for R2
├── lib/manifest.mjs     # hash, MIME, dimensions, sorted JSON
├── lib/download.mjs     # pull + hash verification
└── verify-references.mjs # static scan for unknown asset keys
```

Package scripts:

```json
{
  "assets:manifest": "node scripts/assets/cli.mjs manifest",
  "assets:push": "node scripts/assets/cli.mjs push",
  "assets:pull": "node scripts/assets/cli.mjs pull",
  "assets:verify": "node scripts/assets/cli.mjs verify",
  "assets:verify:remote": "node scripts/assets/cli.mjs verify --remote",
  "assets:doctor": "node scripts/assets/cli.mjs doctor",
  "assets:prune": "node scripts/assets/cli.mjs prune",
  "assets:references": "node scripts/assets/verify-references.mjs"
}
```

### 6.1 Commands

| Command | What it does |
| :--- | :--- |
| `assets:manifest` | Scans `.enigma-assets/`, hashes files, detects MIME/dimensions, writes sorted `assets.lock.json`. |
| `assets:push` | Uploads new/changed objects, sets headers and metadata, updates the manifest. Idempotent: skips objects whose SHA-256 already matches. |
| `assets:pull` | Downloads missing/changed objects into `.enigma-assets/` and verifies hashes. Supports `--case` and `--kind` filters. |
| `assets:verify` | Local checks: manifest completeness, hash validity, MIME/magic match, duplicate hashes, missing references, size budgets. |
| `assets:verify:remote` | HEADs every manifest object, checks status, length, ETag, CORS, cache headers, and range support. No write credentials required. |
| `assets:doctor` | Human-readable report: counts by case/type, largest files, duplicates, mislabeled extensions, orphaned objects. |
| `assets:prune` | Lists remote objects not in the manifest. Does not delete without `--yes`; excludes `dossiers/` by default. |
| `assets:references` | Scans source literals for `assetUrl('...')`, `storagePath: '...'`, and legacy `localPath: '...'` keys and fails if any are absent from the manifest. Runs in `build`; no network needed. |

For the initial migration, `assets:manifest` and `assets:push` accept `--source public/assets` so the existing tree can be processed before it is moved to `.enigma-assets/`.

### 6.2 Implementation notes

- Use `@aws-sdk/client-s3` with endpoint `https://<account>.r2.cloudflarestorage.com`, region `auto`.
- Use single `PutObject` for files under 100 MB. Current largest file is ~12 MB. Multipart can be added later for video.
- Use `file-type` or magic-byte checks plus an extension map. Reject extension/MIME mismatches unless `--allow-mismatch` is passed.
- Use `image-size` for width/height (pure JS, no native build). Use `music-metadata` for duration if desired.
- Use `sharp` only when generating responsive variants; keep it optional so `npm install` stays fast.
- Deterministic output: sort asset keys, sort variant keys, omit timestamps.
- Never log secrets. Read credentials from `.env.local` or environment variables only.
- `.gitignore` additions:

```gitignore
# Externalized exhibition media
.enigma-assets/
public/assets/
assets-backup/
```

- `.vercelignore` additions:

```text
/.enigma-assets/
/public/assets/
```

> Keeping the local cache in `.enigma-assets/` rather than `public/assets/` is deliberate. It prevents Vite from accidentally copying 183 MB into `dist/` and makes "not in the repo" unambiguous.

---

## 7. Development, build, and deployment

### 7.1 Development behavior

- Default: `VITE_ASSET_BASE_URL` points at the CDN. `npm run dev` needs no asset download.
- Offline: `npm run assets:pull -- --case case-001-blair-witch`, then set `VITE_ASSET_BASE_URL=/assets` in `.env.local`.
- A Vite dev middleware serves `/assets/*` from `.enigma-assets/` when the file exists, and proxies to the CDN when it does not. This gives partial caches and legacy `/assets/...` paths a working fallback during migration.
- If neither local file nor CDN is available, the middleware returns a clear error: "Asset not found locally. Run `npm run assets:pull` or set `VITE_ASSET_BASE_URL`."

### 7.2 Build behavior

- Production build requires `VITE_ASSET_BASE_URL` unless `ALLOW_LOCAL_ASSETS=1` is set.
- `npm run build` runs `assets:references` before `tsc -b && vite build`. That check is offline and catches missing manifest keys.
- The build no longer copies media into `dist/`. Vercel uploads only HTML/CSS/JS and the manifest.
- If a developer has a local cache, it stays in `.enigma-assets/` and is ignored by Vite.

### 7.3 Vercel

- Set `VITE_ASSET_BASE_URL` in Project Settings for Production, Preview, and Development.
- No R2 credentials are needed in Vercel build settings.
- Previews can read the same public bucket. Because URLs carry content hashes, a preview branch can upload a new asset and use it immediately without colliding with production.
- Optional transition-only rewrite, placed before the SPA catch-all:

```json
{
  "source": "/assets/:path*",
  "destination": "https://assets.enigma.example/:path*"
}
```

This proxies legacy `/assets/...` paths through Vercel as a safety net. It is temporary: it consumes Vercel bandwidth and defeats some CDN benefits. Remove it after the code migration is verified.

### 7.4 CI

Add a job that runs:

```bash
npm ci
npm run assets:references
npm run assets:verify
npm run assets:verify:remote
npm run build
```

- `assets:verify:remote` needs no secrets: it only HEADs public URLs.
- Compare the remote `ETag` against the manifest `md5` where available; if the CDN strips `ETag`, fall back to `Content-Length` plus a sampled body hash.
- The job fails on a missing asset, wrong MIME, missing CORS, or missing range support.
- Add a PR checklist item: asset pushed, manifest updated, verify passed, license/provenance recorded.

---

## 8. Codebase migration map

### 8.1 Data and types

| File | Change |
| :--- | :--- |
| `src/core/types/provenance.ts` | Rename `localPath` to `storagePath` (logical key, no leading slash). |
| `src/types/enigma.ts` | Same rename, or consolidate with the core type. |
| `src/data/blairWitchAssets.ts` | `storagePath: 'blair-witch/images/...'`; resolve at consumption. |
| `src/cases/case-002-db-cooper/assets.ts` | Rename `path` to `storagePath`; resolve at consumption. |
| `src/cases/case-001-blair-witch/assets.ts` | Re-export unchanged. |

### 8.2 UI and audio consumers

| File | Change |
| :--- | :--- |
| `src/cases/case-002-db-cooper/edition/ui.tsx` | Replace `IMAGE_META` + `optDir` with `assetUrl()` / `assetSrcSet()`; keep width/height metadata. |
| `src/utils/AudioManager.ts` | Build candidate URLs with `assetUrl()`; remove `.wav` fallbacks for assets that are actually MP3; prefer one canonical format per asset. |
| `src/core/audio/AudioManager.ts` | Use the injected `assetResolver` or `assetUrl()`; remove hardcoded `/assets/blair-witch/audio/...` fallback. |
| `src/utils/AudioEngine.ts` | Replace `asset.localPath` with `assetUrl(asset.storagePath)`. |
| `src/experience/ExperienceContext.tsx` | Same. |
| `src/experience/content.ts` | Same for `ASSET_MAP` lookups. |
| `src/experience/components/Prologue.tsx`, `ChapterFour.tsx`, `ChapterSeven.tsx` | Wrap direct image paths with `assetUrl()`. |
| `src/home/Home.tsx` | Wrap direct image paths. |
| `src/components/enigma/AssetInspectorModal.tsx` | Display logical path and resolved URL separately. |
| `src/components/enigma/ASCIIImage.tsx`, `ASCIIRecordingDeck.tsx`, `AudioCueCard.tsx`, `CinematicExhibitionView.tsx`, `PrologueHero.tsx` | Use `assetUrl()`; keep `crossOrigin = 'anonymous'`. |
| `src/cases/case-002-db-cooper/DBMap.tsx`, `ScenesOpening.tsx`, `ScenesClosing.tsx`, `ScenesAfter.tsx` | Wrap direct paths. |

### 8.3 Server and pipeline

| File | Change |
| :--- | :--- |
| `src/server/composition/DocumentaryCompositionEngine.ts` | Use `serverAssetUrl()` for asset metadata. |
| `src/server/audio/AudioSoundscapeEngine.ts` | Use `serverAssetUrl()`; correct `.wav`/`.mp3` format references. |
| `src/server/media/DocumentaryMediaEngine.ts` | Use `serverAssetUrl()` for `localPath` and `downloadUrl`. |
| `src/server/ingestion/DocumentIngestionService.ts` | Write downloads to `.enigma-assets/dossiers/...` or upload directly to the dossier bucket; never write to `public/assets/` in production. |
| `scripts/build-assets.mjs` | Download/generate into `.enigma-assets/blair-witch/` instead of `public/assets/`. |
| `scripts/optimize-dbcooper-images.ps1` | Point at `.enigma-assets/db-cooper/`. |
| `scripts/cleanup-database.mjs` | Clean `.enigma-assets/dossiers/` or remote dossiers, not `public/assets/`. |
| `scripts/enigma-pipeline.mjs` | `case:create` scaffolds `.enigma-assets/<slug>/`; `case:process-assets` audits/uploads from there; `case:validate` checks the manifest instead of disk presence. |

### 8.4 Configuration and docs

| File | Change |
| :--- | :--- |
| `package.json` | Add asset scripts and dev dependencies. |
| `tsconfig.app.json` | Add `"resolveJsonModule": true` (and `"allowSyntheticDefaultImports": true` if the default JSON import is rejected). Alternatively, generate `src/core/assets/manifest.generated.ts` to avoid JSON import config entirely. |
| `src/vite-env.d.ts` | Add `VITE_ASSET_BASE_URL` to `ImportMetaEnv` (there is no such declaration file today). |
| `vite.config.ts` | Add dev asset middleware/proxy; validate `VITE_ASSET_BASE_URL` in production builds. |
| `vercel.json` | Optional transition rewrite for `/assets/*`. |
| `.gitignore`, `.vercelignore` | Ignore local caches and the old asset tree. |
| `.env.example` | Add public base URL and R2 placeholders. |
| `README.md` | Update project structure, setup, deployment, and asset workflow. |
| `docs/ASSET_PIPELINE.md` | New contributor guide for adding/updating/removing assets. |
| `docs/ASSET_LICENSES.md` | Optional consolidated license/attribution registry. |

### 8.5 Static checks

After migration, these should be true:

```bash
# No media files tracked
git ls-files public/assets             # empty

# No hardcoded asset URLs outside the resolver
grep -rn "/assets/" src                # only the resolver/local fallback and docs

# Every literal key exists
npm run assets:references

# Remote objects are healthy
npm run assets:verify:remote
```

---

## 9. New asset workflow (after migration)

1. Put source files in `.enigma-assets/<case>/<kind>/` (gitignored). For a new case, `npm run case:create` scaffolds this directory.
2. Optionally generate derivatives (responsive images, normalized audio) with `npm run case:process-assets -- --case <case>`.
3. Run `npm run assets:push -- --case <case>`. The command hashes, uploads new/changed files, and updates `assets.lock.json`.
4. Add or update the provenance entry in `src/cases/<case>/assets.ts` with a logical `storagePath`.
5. Use `assetUrl(storagePath)` in UI code.
6. Run `npm run assets:verify` and commit only the code + manifest.
7. CI verifies that every referenced key exists remotely.

Removing an asset:

1. Remove its references and provenance entry.
2. Run `npm run assets:manifest`.
3. Run `npm run assets:prune -- --case <case>` (dry run first).
4. Commit the manifest change. The object can be deleted after the CDN TTL or purged explicitly.

---

## 10. Phased rollout

### Phase 0 — Audit, backup, and R2 setup (0.5 day)

- Freeze asset changes and announce the migration.
- Generate the duplicate/mislabeled-file report.
- Create the R2 bucket, token, custom domain, CORS, and cache rule.
- Upload a full backup of `public/assets` to R2 and keep a local zip plus `git bundle`.
- Record checksums and the current commit/tag.

**Exit criteria:** every current asset exists in R2 and the backup; CORS and range checks pass on a sample image, audio file, and SVG.

### Phase 1 — Manifest, resolver, and CLI (1 day)

- Add `assets.lock.json`, types, `assetUrl()`, and the CLI.
- Add `resolveJsonModule` and the Vite dev middleware/proxy.
- Generate the manifest from the current `public/assets` tree.
- Keep all files in place. No behavior change.

**Exit criteria:** rename `public/assets` temporarily; `npm run dev` still loads every case from R2; `assets:verify` passes; `assets:references` passes.

### Phase 2 — Upload and CDN validation (0.5 day)

- Run the duplicate/mislabeled-file cleanup first (section 11), then `assets:push` all curated assets.
- Verify MIME, CORS, cache headers, range requests, and canvas/audio behavior.
- Deploy a preview with `VITE_ASSET_BASE_URL` set to the CDN.
- Test Case 001 and Case 002 end to end.

**Exit criteria:** zero console CORS errors; images render; ASCII canvas works; audio plays and seeks; waveform works; SVG documents load; asset inspector works.

### Phase 3 — Code migration and file removal (1–2 days)

- Rename `localPath`/`path` to `storagePath`.
- Replace all 159 hardcoded references with `assetUrl()`.
- Update `imageSources`, audio fallbacks, server engines, and ingestion paths.
- Move `public/assets` out of the working tree (to `.enigma-assets/` or the backup archive); delete the old directory so Vite cannot copy it; add it to `.gitignore` and `.vercelignore`.
- Update `case:create`, `case:process-assets`, and `case:validate`.
- Update README and add `docs/ASSET_PIPELINE.md`.

**Exit criteria:** `git ls-files public/assets` is empty; `npm run build` passes with no local assets; `npm run preview` loads every case; no hardcoded `/assets/` references remain outside the resolver.

### Phase 4 — CI guards and documentation (0.5 day)

- Add the asset verification job.
- Add the PR checklist.
- Add the license/attribution note to the docs.
- Run a dry-run "new asset" exercise with a scratch file.

**Exit criteria:** a PR that references an unuploaded asset fails fast; a contributor can add an asset in under 10 minutes following the docs.

### Phase 5 — Git history purge (0.5 day + coordination)

- Create a recovery bundle: `git bundle create ../enigma-pre-purge.bundle --all`.
- Rewrite history: `git filter-repo --path public/assets --invert-paths` (install it first; the command removes the `origin` remote, so re-add it before pushing).
- Force-push branches and tags; ask contributors to reclone.
- Run `git gc --prune=now --aggressive`.
- Verify a fresh clone is small.

**Exit criteria:** fresh clone is under ~10 MB; `git count-objects -vH` shows no 180 MB payload; CI and Vercel deploy pass.

**Alternative if history rewrite is not acceptable:** remove files from `HEAD` now and keep a large `.git` history. Everything still works, but clone size stays at 183 MB. History purge can be scheduled later.

### Phase 6 — Enhancements (optional, future)

- Generate AVIF/WebP derivatives and LQIP placeholders at publish time.
- Add `<picture>`/`srcset` beyond the current Case 002 `opt/` set.
- Add Opus/AAC renditions for long audio; keep MP3 fallback.
- Add a private dossier bucket with signed URLs for restricted material.
- Add an admin uploader or GitHub Action for non-developers.
- Add Cloudflare analytics/404 monitoring and per-case asset budgets.
- Add a service worker for optional offline exhibition caching.

---

## 11. Cleanup opportunities

These are not required for externalization but reduce cost and confusion:

1. **Delete the 9 mislabeled `.wav` duplicates and the 2 redundant real-WAV copies.** Together they account for the 45.9 MB of redundant audio. Keep one canonical format per asset.
2. **Remove the three 149-byte Dyatlov placeholders** or replace them with real images.
3. **Remove the unused template files** `src/assets/hero.png`, `src/assets/react.svg`, and `src/assets/vite.svg` (no imports found).
4. **Normalize audio metadata** so the manifest reports the true MIME type (`audio/mpeg` for MP3 data even when the extension was `.wav`).
5. **Consider Opus** for ambience/SFX and long music beds. It cuts bytes substantially; keep MP3 for compatibility.
6. **Compress large JPGs** and generate responsive variants for the biggest images. The current Case 002 `opt/` pattern is the model to generalize.

Do the duplicate cleanup **before** the first upload so the bucket does not inherit dead files. Keep the originals in the backup archive.

---

## 12. Risks and rollback

| Risk | Mitigation |
| :--- | :--- |
| CDN outage | Keep the transition rewrite available; local cache + `assets:pull`; status page. |
| CORS misconfiguration breaks canvas or audio | `assets:verify:remote` sends an `Origin` header and checks `Access-Control-Allow-Origin`; test Chrome, Safari, Firefox. |
| Broken references after migration | `assets:references` in `build`; `assets:verify` in CI; manual QA matrix. |
| Credentials leak | R2 token scoped to one bucket; `.env.local` ignored; never use `VITE_` for secrets; rotate on suspicion. |
| Vercel rewrite hides a missed reference | Treat the rewrite as temporary; remove it after Phase 3 and re-run the full QA matrix. |
| History rewrite disrupts contributors | Announce in advance; create a bundle and tag; force-push once; ask for reclone; update open PRs. |
| Large audio hurts first load | R2 egress is free, but bytes still cost time; immutable cache, preload only the active cue, add Opus derivations later. |
| License/attribution regression | Keep provenance in `assets.ts`; add `docs/ASSET_LICENSES.md`; link attribution in the UI. |
| Bucket object accidentally deleted | Keep a local zip and a second copy; enable versioning if available; `assets:pull` before prune. |
| Runtime dossier uploads collide with curated assets | Separate bucket/prefix; `assets:prune` excludes dossiers by default. |

**Rollback procedure**

1. Set `VITE_ASSET_BASE_URL=/assets`.
2. Restore the local cache from the backup or run `npm run assets:pull` (all assets by default), then point the dev middleware at it.
3. Redeploy the previous commit/tag.
4. If the CDN provider itself is the problem, point the transition rewrite at a backup origin.

Because the manifest and code are in Git, reverting the deployment restores the previous URL strategy. The binaries remain safe in R2 and in the offline backup.

---

## 13. Cost model

Assumptions: 137 MB after dedupe, 100,000 monthly visits, ~20 asset requests per visit.

| Item | Calculation | Monthly |
| :--- | :--- | ---: |
| R2 storage | 0.137 GB × $0.015, under 10 GB free | $0 |
| R2 egress | Free | $0 |
| R2 Class B reads | 2M reads, under 10M free | $0 |
| R2 Class A writes | A few hundred uploads | $0 |
| Domain | Optional, annual | ~$1/month equivalent |
| Vercel media bandwidth | Removed from Vercel | savings |

At 1M visits/month (~20M reads), R2 read overage is roughly **$3.60/month**; storage and egress remain effectively free. This is the main reason R2 is preferred over Vercel Blob for a media-heavy exhibition.

---

## 14. Decisions to confirm

1. **Provider:** Cloudflare R2 (recommended), Vercel Blob (no-domain fallback), or Bunny CDN (no-domain, cheap).
2. **Domain:** Is there a domain on Cloudflare DNS for `assets.<domain>`? If not, do we start with Vercel Blob/Bunny or use `r2.dev` for staging only?
3. **History rewrite:** Is a coordinated force-push acceptable now, or do we remove files from `HEAD` and purge later?
4. **Duplicate cleanup:** Delete the 9 mislabeled `.wav` duplicates and the redundant WAV pairs before upload? (Recommended.)
5. **Originals:** Keep high-resolution/archival originals in a private archive bucket, or only keep the web derivatives?
6. **Audio quality:** Keep current MP3s, or generate Opus/AAC derivatives for delivery while archiving the originals?
7. **Dossiers:** Separate bucket for runtime-ingested research assets, or a reserved `dossiers/` prefix in the same bucket? (Separate bucket recommended.)
8. **Local cache:** `.enigma-assets/` (recommended) vs `public/assets/` (simpler but risks accidental bundling).

---

## 15. Definition of done

- [ ] `git ls-files public/assets` returns nothing.
- [ ] `assets.lock.json` covers every curated asset and is deterministic.
- [ ] `npm run build` succeeds on a machine with no local media.
- [ ] `npm run preview` and a Vercel preview load both cases with zero 404s and zero CORS errors.
- [ ] Audio seeks correctly; ASCII canvas and waveform render; SVGs and `opt/` variants load.
- [ ] `npm run assets:verify` and `assets:verify:remote` pass in CI.
- [ ] A new asset can be added without committing a binary.
- [ ] The README and asset pipeline docs describe the new workflow.
- [ ] The R2 bucket has a verified backup and a documented rollback path.
- [ ] After the optional purge, a fresh clone is under ~10 MB.
