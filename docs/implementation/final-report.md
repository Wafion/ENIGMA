# Final report — ENIGMA, Case 001

**Project:** ENIGMA — *The Blair Witch Incident*  
**Build:** Vite 8.3.5 / React 19.3.1 / TypeScript 7.0.2 / GSAP 3.15.0  
**Date:** 4 November 2026  
**Status:** implementation complete; editorial review and delivery cleanup remain

---

## 1. Summary

ENIGMA has been rebuilt as a single cinematic documentary in eight movements. It is no longer an archive dashboard, a dossier system or a cinema/broadside product. The reader scrolls one document: a photographic prologue, seven chapters with distinct climates, a source and asset register, and a closing editorial ledger.

The rebuild keeps the case content and the working audio/ASCII utilities. It replaces the presentation layer with `src/experience/`, a new Threshold design system in `src/index.css`, and three desktop-only pinned scenes. Real Maryland photography, Library of Congress maps and labelled reconstructions carry the visual argument. Fiction, verified history, production record and editorial synthesis are separated in plain language, not by colour chips.

The entry point is now a separate poster-like home page: a split masthead, a bracketed tagline, an oversized Instrument Serif `ENIGMA` wordmark, a live ASCII landscape with a dotted moon, a rotating Case 001 badge and a truthful “Latest” ticker. It routes to the published case at `/case/001`, keeps an honest “in research” slot for the next subject, and adds an accessible search overlay. Only Case 001 is published.

The production build succeeds, the production preview passes the QA script at four widths and under reduced motion, and the focus/escape paths in the dialogs are verified. The main outstanding work is delivery: automated tests, citation depth, responsive image variants and removal of the legacy tree.

---

## 2. What shipped

### Home page

- A poster composition that follows the latest reference: split masthead with a hairline rule, centred bracketed tagline, an enormous centred `ENIGMA` wordmark in Instrument Serif, four corner brackets, a left plus mark, a right-hand taxonomy of real scope categories (Folklore, Media History, Place & Memory, The Unexplained, And More…), a centred rotating Case 001 badge, and an ASCII landscape with a dotted moon.
- Navigation: `Discover` → `#catalogue`, `Archive` → `/case/001`, `Method` → `#method`, `About` → `#about`, plus a search button. In-page anchors and route links share the existing SPA handler.
- ASCII motion: the landscape is drawn as a deterministic character grid (two ridges, dotted moon, stars, horizon) into an offscreen canvas; the visible canvas animates a slow drift of glyphs and a twinkle. Hovering the hero lifts the terrain brightness and intensifies the animation.
- ASCII hover: the `ENIGMA` wordmark resolves out of a mono scramble on mount and on hero hover/focus; masthead links open ASCII brackets; taxonomy items reveal a `+` suffix.
- The “Latest” ticker lists only truthful Case 001 metadata (title, structure, place, year, next-subject status). It pauses on hover and becomes a static wrapped list under reduced motion.
- A compact search overlay indexes the twelve published destinations — the case, its prologue, all seven chapters, Catalogue, Method and About. It focuses the input on open, closes on Escape or backdrop click, returns focus to the trigger, and announces the result count.
- Below the hero, the catalogue keeps Case 001 live and a second, clearly labelled research slot; Method and a new About section preserve the original copy and typography.
- Only Case 001 is published. No case title, source, quote, date or evidence status was invented for the hero, ticker, taxonomy or search.

### Prologue

- Full-bleed contemporary photograph of Seneca Creek State Park, with a slow desktop push-in.
- Title lower-left, film quotation in the centre beat, end state and “Enter the case” control at the bottom.
- The 1999 opening title card is attributed to Haxan Films and labelled “Film text, not a historical record.”
- No autoplay; sound is offered but not started.

### Chapter 01 — The Legend of the Black Hills

- Dark typographic lore climate.
- Four-date horizontal chronology (1785, 1825, 1886, 1941) on a pinned desktop track; static stack on mobile.
- Three reconstruction objects: the 1809 chapbook, the Coffin Rock plate and the Parr cellar plan.
- Margin notes state what is invented and what the Maryland record shows.

### Chapter 02 — The Town Below South Mountain

- Paper-toned verified-history climate.
- Main Street, Union Cemetery and town-centre contextual photographs.
- Interactive map plate with 1858 and 1861 Library of Congress editions, four markers, zoom, and “In the story” / “On the ground” fields.
- A 1975 National Register epigraph and the September 1862 Crampton's Gap correction.

### Chapter 03 — October 1994: The Student Expedition

- The fictional disappearance framed as in-universe chronology.
- Cast triptych with contemporary portraits and a plain statement that the actors are alive.
- Seven-day expedition log derived from the invented chronology.
- Reconstructed 1994 “MISSING” bulletin, captioned as a promotional artifact, not a police document.

### Chapter 04 — The Woods: An Unstable Geometry

- Pinned full-bleed canopy camera on desktop.
- One user-controlled optical/ASCII comparison; the copy says it translates luminance and does not recover detail.
- Black Rock Mill feature with the real 1815 structure and 2006 photographer credit.
- Night-perimeter method section and a project-original sound cue.

### Chapter 05 — The Recordings: 16mm & Hi8

- Tape-black viewing-room climate.
- Five-sequence procedural study built from geometry, labelled “PROCEDURAL RECONSTRUCTION — NOT A FILM FRAME”.
- Reconstructed transcript with an explicit disclaimer: not verbatim subtitles or recovered audio.
- Representative Hi8 camera object and the in-universe 1995 excavation framing.

### Chapter 06 — The Real Story

- Production and media history: eight-day shoot, two formats, GPS/milk-crate method.
- Reported production figures with qualifiers.
- Reconstructed BlairWitch.com artifact, labelled as editorial reconstruction rather than a screenshot.
- Dual-track timeline with invented and documented chronology filters.

### Chapter 07 — What Remains

- Six-row fact ledger: claim, documented record, source code.
- Source register access, reading settings and reduced-motion control.
- Closing Seneca Creek lake photograph (NOAA / Eileen McVey, 2002) and editorial epilogue.
- Footer credits, licences and the project-original audio statement.

### Chrome and registers

- Quiet masthead: wordmark, current chapter, Sound, Index, Sources.
- Desktop chapter rail: numbers and an active rule; labels on hover/focus.
- Contents drawer with all eight movements and a reduced-motion switch.
- Source drawer with eight sources, search and highlighted citations.
- Asset drawer with image, document and audio records, thumbnails and native audio playback.
- Shared dialog primitive: focus trap, Escape close, scroll lock, focus restoration.

---

## 3. Deliverables

| Area | Document |
|---|---|
| Repository audit | `docs/audit/repository-audit.md` |
| Current site audit | `docs/audit/current-site-audit.md` |
| Pre-rebuild audit | `docs/audit/current-state.md` |
| Content inventory | `docs/audit/content-inventory.md` |
| Asset inventory | `docs/audit/asset-inventory.md` |
| Asset register | `docs/assets/asset-register.md` |
| Skill audit | `docs/implementation/skill-audit.md` |
| Reference analysis | `docs/design/reference-analysis.md` |
| Reference implementation matrix | `docs/design/reference-implementation-matrix.md` |
| Reference access report | `docs/design/reference-access-report.md` |
| Reference board | `docs/design/reference-board/` |
| Art direction | `docs/design/art-direction.md` |
| Design system | `docs/design/design-system.md` |
| Motion direction | `docs/design/motion-direction.md` |
| Responsive strategy | `docs/design/responsive-strategy.md` |
| Prologue storyboard | `docs/design/prologue-storyboard.md` |
| Chapter composition plan | `docs/design/chapter-composition-plan.md` |
| This report | `docs/implementation/final-report.md` |
| Production evidence | `docs/audit/screenshots/production-*.png` |

---

## 4. Architecture

```text
src/
  App.tsx                    Path router, titles, meta, scroll handling
  index.css                  Threshold design system
  data/
    blairWitchCase.ts        Chapters, scenes, compositions, sources
    blairWitchAssets.ts      Assets, attribution, licences
  types/enigma.ts            Typed content and asset unions
  home/
    Home.tsx                 Home page, hero, catalogue, method, about
    home.css                 Home page styles and responsive branches
    AsciiTerrain.tsx         Deterministic ASCII landscape canvas
    ScrambleText.tsx         ASCII hover/reveal scramble for ENIGMA
    SearchOverlay.tsx        Accessible archive search dialog
  experience/
    Experience.tsx           Shell, chapter observer, reveals
    ExperienceContext.tsx    Audio, motion, dialogs, active chapter
    content.ts               Derived metadata and editorial structures
    motion.ts                Three scroll scenes + reveals
    components/              Prologue, Chapters 01–07, Chrome, primitives
  utils/
    AudioManager.ts          Consent-gated Web Audio
    asciiRenderer.ts         Canvas luminance-to-glyph renderer
```

The data layer was retained. The old `src/components/enigma/` tree and `src/context/EnigmaContext.tsx` remain in the repository but are not imported by the entry point. They are recoverable reference code and a cleanup item, not live UI.

### Motion

| Scene | Trigger | Desktop | Mobile / reduced motion |
|---|---|---|---|
| Prologue | `usePrologueMotion` | Pinned stage, `+=175%`, push-in, quote/end crossfade | Static stack; quotation and end state visible |
| Chapter 01 | `useHorizontalChronology` | Pinned viewport, distance-derived horizontal track | Static vertical stack |
| Chapter 04 | `useWoodsCamera` | Pinned stage, `+=125%`, canopy push-in | Static image and copy |
| All chapters | `useReveals` | One-time opacity/translate reveal | Disabled; content visible |

All hooks use `useGSAP` with a scope, `gsap.matchMedia()` and `revertOnUpdate: true`. No scene hijacks wheel or touch input.

### CSS

`src/index.css` is a single authored stylesheet. It defines the type system, colour climates, layout primitives, chapter-specific compositions, responsive branches and reduced-motion states. Tailwind is installed but the experience is authored in CSS custom properties rather than utility soup.

---

## 5. Provenance decisions

The essay's integrity depends on these distinctions, all visible to the reader:

1. **The film is not the record.** The 1999 opening title card is quoted exactly and labelled as film text.
2. **The “Black Hills” are fictional.** The real forest is Seneca Creek State Park; the real town is Burkittsville. Captions do not present the film's geography as a real place name.
3. **Modern photographs are not 1997 evidence.** The 2022 location photographs are captioned as contemporary; the cast portraits are contemporary and the actors are named as living.
4. **Reconstructions are objects, not evidence.** The chapbook, Coffin Rock plate, Parr cellar plan, MISSING bulletin, website artifact and recording frames are project originals. Each is captioned in plain language.
5. **The transcript is a reconstruction.** It is written from published scene descriptions and the film's known beats, not verbatim dialogue or recovered audio.
6. **The sound is project-original.** Eight WAV beds were synthesised by `scripts/build-audio.mjs`; no Pixabay or third-party recording is stored. The menu says “Sound design”, not “field recordings”.
7. **Editorial synthesis is named.** The closing epigraph and selected captions are ENIGMA's judgement, attributed as such.
8. **No fabricated source.** Eight sources are registered. SRC-03 and SRC-06 remain weak links (encyclopaedic anchors rather than archived primary documents) and are flagged for replacement.
9. **No AI image is presented as evidence.** Reconstructions are vector diagrams and typographic objects; photography is licensed location work.

Asset totals: 30 registered assets — 17 images, 5 documents, 8 audio beds. Eight sources are registered and cited inline through `[SRC-XX]` buttons.

---

## 6. Verification

### Build

```text
dist/index.html                     0.78 kB │ gzip:   0.47 kB
dist/assets/index-D1vcVqNn.js     534.55 kB │ gzip: 173.44 kB
dist/assets/index-Z3AZGFti.css    180.49 kB │ gzip:  33.11 kB
```

`npm run build` passes TypeScript and Vite. The only build warning is Vite's 500 kB chunk advisory.

Lighthouse on the production home page (`http://localhost:4173/`): **100 Accessibility, 100 Best Practices, 100 SEO**. The only non-perfect line item is the informational “Missing source maps for large first-party JavaScript” check, which does not affect the category score.

`npm run lint` reports **6 warnings, 0 errors**:

- `AsciiCompare.tsx:55` — reassignment after render (`cancelled`).
- `ExperienceContext.tsx:143` — fast-refresh export warning.
- `src/context/EnigmaContext.tsx:18,385` — legacy fast-refresh warnings.
- `Chrome.tsx:257,263` — synchronous set-state in effects.

None blocks the build. The `AsciiCompare` warning is the easiest cleanup.

### Production QA

Run against `http://localhost:4173/` in Chromium with CDP, using the final build.

| Viewport | Scroll width | Pins | Images | Broken | Height change after full scroll |
|---|---:|---:|---:|---:|---:|
| 1440×900 | 1432 / 1440 | 3 | 21 | 0 | 0 px |
| 1280×800 | 1272 / 1280 | 3 | 21 | 0 | 0 px |
| 390×844 | 390 / 390 | 0 | 21 | 0 | 0 px |
| 320×720 | 320 / 320 | 0 | 21 | 0 | 0 px |

- **Console:** 0 exceptions, 0 console errors.
- **Network:** 1 cancelled request during navigation (`net::ERR_ABORTED`), not a missing asset.
- **Images:** 21 rendered, 0 broken; 20 lazy, 1 eager prologue image.
- **Audio:** no `<audio>` element mounted until the asset dialog opens; no autoplay.
- **Height stability:** 0 px change after scrolling the full document and returning, so lazy loading no longer moves ScrollTrigger starts or anchors.

The element-level overflow check reports only intentional cases: the prologue media's `inset: -2%` crop, the pinned chronology panels waiting off-screen inside their track, and the mobile recording strip's horizontally scrollable cards. No document-level horizontal scrollbar was observed.

### Home page QA

Run against the same production preview with the same CDP harness.

| Viewport | Scroll width | Wordmark | Badge | Overflow | Broken images |
|---|---:|---:|---:|---:|---:|
| 1440×900 | 1432 / 1440 | 1043 px at 360 px | 124 px | 0 | 0 |
| 1280×800 | 1272 / 1280 | 927 px at 320 px | 110 px | 0 | 0 |
| 390×844 | 390 / 390 | 278 px at 96 px | 93 px | 0 | 0 |
| 320×720 | 320 / 320 | 241 px at 83.2 px | 83 px | 0 | 0 |

- **Console:** 0 exceptions, 0 console errors, 0 failed requests.
- **Marquee:** the only off-viewport elements sit inside the ticker's `overflow: hidden` viewport; the document itself never scrolls horizontally.
- **Search:** opens with focus in the input, filters twelve destinations down to one for “recording”, closes on Escape and returns focus to the masthead trigger; scroll lock released.
- **Scramble:** the wordmark leaves `ENIGMA`, scrambles to ASCII during a hero hover and resolves back to `ENIGMA`.
- **Reduced motion:** badge ring, ticker, status dot and wordmark animations all report `animation-name: none`; the terrain still paints one static frame.
- **Routes:** badge → `/case/001`, case wordmark → `/`, browser back/forward → the correct page, masthead anchor → `#catalogue` at 72 px from the top.

### Interaction checks

| Check | Result |
|---|---|
| Source citation opens register | `SRC-04` opens the drawer, one highlighted row, body scroll locked |
| Source drawer closes on Escape | Closed; focus returned to the `SRC-04` button; scroll lock released |
| Sound menu | Opens with focus inside; Escape returns focus to the masthead trigger |
| Recording study | 5 sequences; selection updates viewer label, active index and transcript disclaimer |
| Map plate | 4 markers; selection updates place; 1861 edition switches and becomes active |
| Audio asset | Asset dialog opens a native player and shows “Project-original sound design” |
| Home → case | Badge opens `/case/001`; 3 desktop pins; scroll resets to 0 |
| Case → home | Masthead wordmark returns to `/`; scroll resets to 0 |
| History | Back and forward restore the case and home routes correctly |
| Home search | 12 results; “recording” filters to 1; Escape closes and restores trigger focus |
| ASCII scramble | Wordmark scrambles during hero hover and resolves to `ENIGMA` |
| Reduced motion | `experience is-reduced-motion`, 0 pins, prologue quote/end visible, chronology transform `none` |

### Screenshots

Authoritative production captures:

- `home-desktop-1440.png`
- `home-desktop-1280.png`
- `home-mobile-390.png`
- `home-mobile-320.png`
- `home-desktop-1440-full.png`
- `home-mobile-390-full.png`
- `home-1440-reduced-motion.png`
- `home-search-overlay.png`
- `home-route-case-001.png`
- `production-1440-prologue.png`
- `production-1440-prologue-reduced-motion.png`
- `production-1440-chapter-02-map.png`
- `production-1440-chapter-05-recordings.png`
- `production-1440-chapter-07-ledger.png`
- `production-390-prologue.png`
- `production-390-chapter-02-map.png`
- `production-390-chapter-05-recordings.png`
- `production-320-prologue.png`

The older `mobile-390-*` and `mobile-320-*` captures in the same folder are exploratory records from earlier iterations. Use the `production-*` set for release review.

---

## 7. Defects corrected during implementation and QA

| Defect | Correction |
|---|---|
| Prologue desktop title right-of-centre | Desktop grid now uses `grid-template-columns: minmax(0, 1fr)` and `justify-content: stretch`, restoring the lower-left title |
| Reduced-motion prologue right-aligned | Added `align-items: stretch` to the reduced-motion flex fallback and `align-self: stretch` to the quote and end block |
| Lazy-loaded documents/photograph moved ScrollTrigger anchors | Added intrinsic dimensions and reserved aspect ratios; zero height change now verified |
| Audio copy implied field recordings | Changed to “Sound design”; synthesised origin is stated in the register and footer |
| Old index metadata and colours | Removed the stale `dark scroll-smooth` body, old colours and outdated description; set the case title, description and theme colour |
| Source-drawer focus restoration untested | Harness now reveals and focuses the citation before clicking; Escape restores focus to the button |
| Stale build hashes in the repository audit | Updated to the final production hashes |
| Old home hero (`TRACE / THE / MYTH / BACK` plus signal dial) no longer matched the supplied poster | Replaced with the centred `ENIGMA` composition, ASCII terrain, taxonomy and ticker |
| Ticker copy could have implied unpublished cases | Restricted to Case 001 metadata and an explicit “next subject in research” line |
| Search icon would have been a dead control | Built an accessible overlay over the twelve published destinations |
| Scrambling could have changed the page's accessible name | The visual span is `aria-hidden`; the `h1` keeps `aria-label="ENIGMA"` |

---

## 8. Limitations and risks

### Before public release

1. **No automated test suite.** Add Playwright smoke coverage for load, eight sections, dialog open/close/focus, reduced motion, mobile overflow, map/recording interactions and a source deep-link.
2. **Citation depth.** Replace SRC-03 and SRC-06 with archived primary documents or stable, specific citations.
3. **Image delivery.** Add responsive variants (`srcset`, AVIF/WebP) and explicit dimensions per breakpoint. Current files are single-size 1280 px JPEG/PNG.
4. **Accessibility audit.** Lighthouse on the production home page scores 100 Accessibility, 100 Best Practices and 100 SEO. The case document has no separate axe pass in this round; run one before release.
5. **Legacy tree.** Delete or archive `src/components/enigma/` and `src/context/EnigmaContext.tsx`.
6. **Unplaced assets.** `burkittsville-street.jpg`, `film-grain.svg` and `twana-sigil.json` are unreferenced; `david-arnold-house.jpg` and `aud-cabin-creak` are registered but unplaced. Resolve before release.
7. **Metadata.** Canonical URL, Open Graph card and a designed favicon are still missing; per-route titles and descriptions are set in `App.tsx`.
8. **Bundle size.** The single JS chunk is 534 kB (173.44 kB gzip) and the CSS is 180 kB (33.11 kB gzip). Split the case experience or the register if real-user data justifies it.

### Known and accepted

- **Reference access.** Bear 71 remained inaccessible (`403`/timeout), and several reference sites could not be fully captured. `docs/design/reference-access-report.md` records what was inspected and what was not; no technique is claimed from an unvisited page.
- **No router.** A single document with fragment identifiers is appropriate for one essay and keeps deep links simple.
- **Reduced-motion prologue.** The static opening is taller than one viewport because it exposes the title, quotation and end state together. That is a deliberate access trade-off.
- **Audio weight.** The eight WAV beds total roughly 7.4 MB; compressed delivery is a hosting improvement, not a correctness issue.
- **HMR artefact.** One dev hot update briefly threw “useExperience must be used inside ExperienceProvider”. Production navigation does not reproduce it.

---

## 9. Verification commands

```powershell
npm run build
npm run lint
npm run preview   # http://localhost:4173/
```

Production QA was run with a CDP script against Chromium at `http://127.0.0.1:9223`, navigating to the preview server and emulating the four viewports. The script is an external QA harness, not part of the application bundle. Its JSON result and the final screenshots are the evidence for the tables above.

---

## 10. Recommendation

The experience is ready for editorial review and a controlled preview. The direction is resolved: photography leads, the chapters have distinct climates, the fiction is labelled, the reconstructions are framed as objects, and motion supports rather than replaces reading.

Before an unattended public launch, complete the delivery pass in §8: automated tests, citation depth, responsive images, accessibility audit, legacy-tree cleanup and metadata.

**Final assessment:** structurally sound, editorially honest, visually coherent, and honest about what it does not yet prove.

