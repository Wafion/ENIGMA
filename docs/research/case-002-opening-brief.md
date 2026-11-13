# Case 002 opening animation — context brief

Hand this to a design/implementation agent. It contains everything needed to ideate openings without reading the whole repository.

## What is being asked for

One original, abstract opening animation for **Case 002, D.B. Cooper**, shown once when the case is entered from the site. The agent should first deliver **6 distinct concepts** with choreography and method, get a selection, and only then implement.

## The product

ENIGMA is an independent documentary exhibition built with Vite, React 19 and TypeScript. It has two cases. Case 002's live experience is `src/cases/case-002-db-cooper/edition/Edition.tsx`: an eleven-movement scroll documentary (about 28 minutes) followed by a register.

Its visual language is a **printed case dossier**: flat paper palette, hairline rules, strong typography, no gradients, no glass, no glow, no 3D, no film grain. Motion is restrained and scroll-linked. This is an editorial artifact, not a web app with effects.

## Voice and tone of the case

- Cover title: "D.B. Cooper" / subtitle "The case that stayed open" / line "A case file with one page missing."
- Prologue copy: "On the afternoon before Thanksgiving, 1971, a man bought a one-way ticket to Seattle, carried a briefcase onto a Boeing 727, and asked a flight attendant to sit beside him." / "Five hours later, the aircraft landed in Reno with an empty cabin, two parachutes, and a ransom missing. The man had stepped out of the back of the plane somewhere over Washington. No one saw him go."
- Facts available as material: 24 November 1971 · Northwest Orient Flight 305, Portland to Seattle · alias "Dan Cooper" (the press added D.B.) · seat 18C · $200,000 in twenties · two parachutes · ventral aft airstair, a door in the floor · 20:13 PST over Washington at about 10,000 ft · empty cabin at Reno · NORJAK (NORthwest hijacking) · sixty volumes, 800-plus suspects · 1980 Tina Bar ransom bills · suspended, not solved, in 2016.
- Tone: restraint, absence, record-keeping. Never legend, never thriller, never "mystery solved".

## Technical envelope

- **Canvas 2D only.** No new dependencies. No DOM animation libraries beyond what exists (GSAP is present for chapter motion; the opener should not need it).
- **No audio in the opener.** The case's score is explicitly opt-in; an opening sound would break that promise.
- Duration **1.4–2.2 s**, one shot per entry.
- Full-screen overlay: `position: fixed; inset: 0; z-index: 9999; pointer-events: none; overflow: hidden`.
- Clean up `requestAnimationFrame` and timers; include a wall-clock dismissal fallback so a backgrounded tab can never leave the overlay covering the page.
- Skip entirely when `prefers-reduced-motion: reduce` matches.
- DPR capped at 2. Glyph grids around 8–12 px cells are the proven performance budget; avoid sampling large photographs at full resolution.
- The last frame must hand into the paper cover (`#f1ebdd`) with no visible seam.

## How it is wired (already done, do not change)

`src/App.tsx` sets `sessionStorage['enigma:case-ascii-open'] = 'true'` when the user moves from outside a case to `/case/...`. The opener component reads and removes that flag on mount, then plays once. The mount point is `<Case002Opener />` at the top of the Edition root. Case 001 uses the same flag for its own opener.

## What exists today (read these before ideating)

- `src/cases/case-002-db-cooper/edition/Case002Opener.tsx` — the current attempt, to be replaced: an altimeter tape, a dashed flight-level gate, a falling marker with a glyph trail, a pressure trace, four corner stamps, a hairline frame, 1.72 s. It is correctly wired and compiles; only the design is wrong.
- `src/experience/components/CaseAsciiOpener.tsx` — Case 001's precedent: 18–32 vertical layers of streaming glyphs sampled from the Seneca Creek woods photo, a decode scanline wiping characters back to image, a telemetry ribbon, 1.4 s, and a short Web Audio decode chord. Useful as an engineering reference. **Do not repeat its vertical-rain / decode-scanline idea.**
- `src/home/AsciiTerrain.tsx`, `src/home/HeroAsciiLiquidMelt.tsx` — the house's ASCII/ink techniques and glyph sets.
- `src/utils/asciiRenderer.ts` — an existing image-to-ASCII renderer with palettes, 4x4 Bayer dithering, scanlines and distortion.
- `src/cases/case-002-db-cooper/theme.ts` — case palette.
- `src/cases/case-002-db-cooper/edition/styles/base.css` — design tokens and fonts.
- `src/cases/case-002-db-cooper/edition/Cover.tsx` — what the opener must hand into.
- `src/cases/case-002-db-cooper/assets.ts` and `content.ts` — asset inventory and copy.

## Palette and typography

Paper `#f1ebdd`, paper-hi `#faf7ef`, manila `#e5d6b8`, ink `#141311`, ink-soft `#4b463c`, rule `#c9bfa9`, red `#d63118`, red-deep `#9e2010`, blue `#1b3e8f`, green `#244c3a`, amber `#e0a32e`, night `#101c1d`, paper-on-dark `#ede6d6`, muted-on-dark `#a8b5ad`. Case theme adds night field `#090c0f`, steel `#71878e`, ember `#a8482f`, ice `#cfd7d6`.

Fonts: **Instrument Serif** (display), **Newsreader** (body), **Instrument Sans** (UI), **IBM Plex Mono** (micro/telemetry). Mono is the case's instrument voice.

## Real material that could carry a single gesture (choose one, not all)

Seat 18C · the aft airstair as a door in the floor · the Portland–Seattle path, then south · 20:13 and 10,000 ft · the ransom serials and the Tina Bar bills · the two FBI composites that never resolve into one face · the ticket written to "Dan Cooper" · sixty volumes of NORJAK · the empty cabin at Reno.

## Why the current attempt fails

- No hierarchy: six or seven small decorative systems (tape, stamps, trace, frame) all at equal weight.
- No transformation: elements coexist, nothing becomes anything.
- A literal instrument at the centre instead of a metaphor.
- No resolution: it ends on itself, not on the cover, so it reads as a screensaver laid over the page.

## What good looks like

One idea, one movement, one resolution. Legible as a silhouette at a glance. Typographic or geometric rather than illustrative. Under two seconds, because it delays a long read. Distinct from Case 001's vertical glyph rain and from sci-fi HUD telemetry. Ideally the last frame *becomes* the paper of the cover.

## Deliverable format for each concept

Name · one-line premise · 3–4 beat choreography with millisecond timings · drawing method (SDF, particles, masking, line work, glyph grid) · which real material it uses · how it lands on the cover · how it differs from Case 001 · principal risk · rough effort. Then one recommendation, plus a description of the first frame, the middle frame and the last frame.

No implementation until a concept is selected.

## Guardrails

Do not modify other sections, audio behaviour or routing. Do not add dependencies. Do not use photographs unless their asset status allows it (assets are labelled Genuine historical material / Genuine photographic record / Representative photograph / Reconstruction). Keep the overlay non-interactive and out of the accessibility tree (`aria-hidden="true"`). No layout shift.
