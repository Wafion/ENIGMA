# ENIGMA — Phase 0 audit

**Date:** 4 November 2026  
**Scope:** Repository inspection only. No application code was modified.

---

## 1. Current architecture

ENIGMA is a Vite + React 19 SPA. There is no router. `App.tsx` wraps the experience in `EnigmaProvider` and switches between two mutually exclusive modes:

| Mode | Default | Behaviour |
|---|---|---|
| `cinema` | Yes | Full-viewport, act-by-act exhibition in `CinematicExhibitionView` |
| `broadside` | No | Long-scroll documentary: `PrologueHero` + seven `ChapterView` instances |

State lives in `src/context/EnigmaContext.tsx`: view mode, act index, audio, reading progress, reduced-motion, ASCII inspector, source register, asset inspector.

Narrative content is data-driven:

- `src/data/blairWitchCase.ts` — chapters, scenes, compositions, elements
- `src/data/blairWitchAssets.ts` — asset provenance
- `src/types/enigma.ts` — typed element union (`text`, `quote`, `image`, `ascii-visual`, `document`, `timeline`, `map`, `audio-cue`, `recording-deck`, `fact-fiction-matrix`)

Presentation is a single pipeline: `ChapterView` → `SceneRenderer` → typed widgets. Layout variants exist in the type system (`single-editorial`, `split-investigative`, `full-bleed-cinema`, `dossier-grid`) but `SceneRenderer` still renders most elements as a stacked editorial column.

Verified package versions (`package.json`):

- React `19.3.1`, Vite `8.3.5`, Tailwind `4.3.4`, GSAP `3.15.0`, `@gsap/react` `2.1.2`, Lucide React `1.67.0`, wavesurfer.js `8.0.5`
- Local fonts via Fontsource: Instrument Serif, Newsreader Variable, Instrument Sans Variable, Geist Mono Variable

---

## 2. Existing functionality (preserve)

These systems work and should be refactored, not discarded:

1. **Chapter and act navigation** — jump-to-id, sticky header, desktop rail, cinema prev/next.
2. **Sources register** — `SourceRegisterModal`, `SourceAnnotation` for `[SRC-XX]` tokens.
3. **Provenance model** — `EnigmaAsset` + classification + truth layer.
4. **Audio** — Web Audio `AudioManager` with scene enter/leave, mute, volume, visibility suspend. Consent is required. WAV beds exist under `public/assets/blair-witch/audio/`.
5. **Case content** — seven named chapters plus prologue copy, citations, reconstructed documents, dual-track timeline, fact/fiction ledger.
6. **Optical/ASCII comparison** — `ASCIIImage`, Canvas 2D engine in `asciiRenderer.ts`.
7. **Map overlay** — `InteractiveMap` on 1858/1861 LOC maps.
8. **Recording deck** — procedural ASCII reconstruction of sequences (not film stills).
9. **Reduced-motion flag** — context + CSS `prefers-reduced-motion` override.
10. **Keyboard** — Escape closes drawers; focus-visible outline exists.
11. **Licensed photography** — Wikimedia / LOC maps and location photos are present locally.

---

## 3. Design weaknesses

The current visual language is an **archival dossier applied to every surface**. Stage 2 documentation already named this as “institutional investigative digital archive.” That direction now conflicts with the redesign brief.

Observed problems:

1. **Dossier chrome everywhere.** Scene codes (`SCN 01.A`), catalog numbers, classification badges, hairline borders, and mono labels appear in the prologue, chapter mastheads, quotes, and cards.
2. **ASCII as wallpaper.** `PrologueHero` and cinema Act 0 render a 1280×720 glyph canopy at ~35% opacity for the entire opening. The photograph is optional overlay, not the primary image.
3. **Repeated layout.** Heading → paragraph → quote → exhibit card → provenance is the default rhythm. Layout enums are underused.
4. **Weak hierarchy.** Folklore reconstructions, verified maps, and landscape photos share similar card treatment.
5. **Photography is secondary.** Real Seneca Creek, Burkittsville, mill ruins and maps exist, but they sit inside frames instead of occupying the frame.
6. **Mobile is compressed desktop.** Sticky 56px header + chapter rail + dense mono metadata + dual cinema/broadside toggle.
7. **Cinema vs broadside split.** Two parallel UIs for the same story. Cinema is a slideshow of acts; broadside is the actual documentary. The toggle itself is product chrome.
8. **Colour as classification.** Red = lore, green = fact, amber = metadata. The brief forbids this as a substitute for hierarchy.
9. **Typography used as labels, not composition.** Instrument Serif appears as a huge stacked title; almost everything else is tracked-out Geist Mono.
10. **Factual slip in UI copy.** Prologue labels the Seneca Creek photograph as a “1997 plate.” The registered asset is a 2022 Wikimedia photograph (`img-seneca-creek-woods`). Do not imply it is production stills.

---

## 4. Technical weaknesses

1. **GSAP is underused.** ScrollTrigger currently owns scene audio and a single title parallax. There is no pinned camera, no scrubbed image scale, no chapter transition timelines.
2. **`CinematicExhibitionView.tsx` is a monolith** (~1,400+ lines) with per-act local state and duplicated ASCII hero logic.
3. **Pointer-driven ASCII redraw** writes React state on `mousemove` (`pointerNorm`), which can thrash the prologue canvas.
4. **wavesurfer.js is installed** for decorative/inspection waveforms; native Web Audio already plays ambience. Keep Wavesurfer only where a real waveform is required.
5. **Images are JPEG/PNG, not responsive.** No `srcset`, AVIF/WebP, or chapter-level lazy strategy at the app shell (cinema likely loads more than needed).
6. **Global reduced-motion CSS** sets `animation-duration: 0.01ms !important` on all elements, which can fight GSAP instead of substituting a designed static state.
7. **No route layer.** Fine for a single-case SPA, but cinema act index vs scroll position can desync.
8. **Audio assets** were generated to match Pixabay archetypes after Cloudflare blocked scraping. Licences for generated WAV files must stay documented as project originals, not Pixabay downloads.

---

## 5. Components to preserve

| Component | Why |
|---|---|
| `EnigmaContext` audio + source drawers | Real product behaviour |
| `AudioManager` / `AudioEngine` | Consent, mixing, scene ownership |
| `blairWitchCase.ts` / `blairWitchAssets.ts` | Editorial content |
| `SourceRegisterModal`, `SourceAnnotation` | Integrity |
| `FactFictionMatrix`, `TimelineView` | Epistemic tools |
| `InteractiveMap` | Geography without a mapping SDK |
| `DocumentViewer` | Reconstructions with transcripts |
| `ASCIIImage` + `asciiRenderer.ts` | Selective optical comparison |
| `ASCIIRecordingDeck` | Found-footage analysis without film stills |
| Local Fontsource files | Licence-safe typography |

---

## 6. Components to replace or substantially redesign

| Component | Direction |
|---|---|
| `PrologueHero` | Photographic scroll-camera opening; ASCII only as a brief optical event |
| `CinematicExhibitionView` | Fold cinematic scenes into the scroll documentary; drop the dual-mode product |
| `TopNavBar` | Quiet exhibition masthead; no classification rainbow |
| `ChapterView` mastheads | Chapter-specific compositions, not colour-coded dossier stamps |
| `SceneRenderer` | Layout actually follows `composition.layout`; image-led and split scenes |
| `ArchivalImage` | Full-bleed and editorial crops; cards only when an object is being examined |
| `ASCIITransition` | Occasional image/type transitions, not glyph chapter bumpers |
| `DesktopChapterRail` | Slim progress ticks, Firestorm/Snow Fall style |

---

## 7. Installed skills inspected

Present under `.agents/skills/` and read for this phase:

- `frontend-design`, `ui-ux-pro-max`, `better-ui`, `better-typography`, `better-layout`, `web-design-guidelines`, `micro-interactions`
- `react-composition-patterns`, `react-best-practices`
- `gsap-react`, `gsap-scrolltrigger`, `gsap-performance`, `motion-accessibility`
- `source-driven-development`, `code-review-and-quality`

`ui-ux-pro-max --design-system` returned a generic Swiss / Playfair / Inter / light-gallery kit. That output is **rejected** as a visual identity. Motion and accessibility rules from the same skill (scrub pinning, one or two pins, reduced-motion final state, no parallax on body copy) are retained.

---

## 8. Known risks

- Dual cinema/broadside will fight a single camera language if both stay.
- Persistent ASCII loops on mobile will cost more than they give.
- Pinned ScrollTrigger scenes on iOS if applied to every chapter.
- Reconstruction SVGs must remain labelled as reconstructions.
- Opening quotation is the film’s title card, not a historical record; keep attribution as Haxan Films / the 1999 feature.
- Do not download copyrighted film stills.
- Dribbble, Awwwards galleries, `outreach.space`, live Snow Fall, Bear 71, DARK, and Invisible World were not fully browser-captured in this environment (see reference analysis).

---

## 9. Recommendation for the next phases

Treat ENIGMA as **one authored documentary**, not an archive dashboard with a cinema skin.

Keep the data model. Change the camera, the surfaces, and the chapter compositions. Implement the prologue and Chapter 01 against the new art direction before touching Chapters 02–07.
