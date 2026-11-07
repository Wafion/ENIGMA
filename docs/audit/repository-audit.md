# Repository audit — ENIGMA

**Date:** 4 November 2026  
**Scope:** The repository as it stands after the cinematic rebuild.  
**Previous snapshot:** `docs/audit/current-state.md` records the Phase 0 state, before the new experience was implemented.

No Git repository is present in the workspace, so this audit describes the working tree rather than a branch or pull request.

---

## 1. Stack and scripts

| Item | Value |
|---|---|
| Application | Vite 8.3.5 + React 19.3.1 + TypeScript 7.0.2 |
| Styling | Tailwind 4.3.4 installed; the experience itself is authored in `src/index.css` with CSS custom properties |
| Motion | GSAP 3.15.0, `@gsap/react` 2.1.2, ScrollTrigger |
| Icons | `lucide-react` 1.67.0 |
| Audio | Web Audio through `src/utils/AudioManager.ts`; `wavesurfer.js` remains installed for a legacy component only |
| Typography | Local Fontsource packages: Instrument Serif, Newsreader Variable, Instrument Sans Variable, Geist Mono Variable |
| Commands | `npm run dev`, `npm run build`, `npm run lint` (`oxlint`), `npm run preview` |

The build is `tsc -b && vite build`. It currently succeeds with one Vite chunk-size warning.

---

## 2. Directory map

```text
src/
  App.tsx                  Provider + Experience shell
  index.css                Threshold design system and all responsive rules
  data/
    blairWitchCase.ts      Chapters, scenes, compositions, typed elements, sources
    blairWitchAssets.ts    Assets, attribution, licences, source register
  types/enigma.ts          Typed content and asset unions
  experience/
    Experience.tsx         Page shell, chapter observer, reveals
    ExperienceContext.tsx  Audio, motion, dialogs, active chapter
    content.ts             Chapter metadata and derived editorial content
    motion.ts              GSAP scenes, matchMedia, reveals
    components/            Prologue, chapters 01–07, chrome, primitives
  utils/
    AudioManager.ts        Web Audio consent, mixing, scene ownership
    asciiRenderer.ts       Canvas 2D luminance-to-glyph renderer
  components/enigma/       Legacy dossier/cinema components, now unused
public/assets/blair-witch/
  images/                  Licensed photographs and maps
  documents/               Five ENIGMA reconstruction SVGs
  audio/                   Eight project-original WAV beds
  ascii/, textures/        Unused procedural material
```

`src/components/enigma/` and `src/context/EnigmaContext.tsx` remain in the tree but are not imported by the current entry point. They are retained as a recoverable archive of the previous dossier build, not as live UI. This should be resolved before a public release: either delete the legacy tree or document it as a reference-only folder.

---

## 3. Runtime path

```text
main.tsx
  → App.tsx
    → ExperienceProvider
      → Experience
        → Masthead, ChapterRail
        → Prologue
        → ChapterOne … ChapterSeven
        → Footer
        → ChapterIndex, SourceDrawer, AssetDialog
```

There is still no router. The page is a single document with `id` anchors and a scroll-position observer. That is appropriate for one authored essay; it avoids route-level state duplication and keeps deep links working through fragment identifiers.

The active chapter is derived from the section crossing 38% of the viewport. A `requestAnimationFrame` guard prevents scroll handlers from firing React updates on every pixel.

---

## 4. Data layer

`src/types/enigma.ts` defines:

- `EnigmaAsset` with `historicalStatus`, `truthLayer`, `license`, `creator`, `date`, `sourceUrl`, and usage context.
- `EnigmaChapter` with chapter number, title, subtitle, truth layer, introduction, epigraph, theme, scenes, and compositions.
- A typed element union: `text`, `quote`, `image`, `ascii-visual`, `document`, `timeline`, `map`, `audio-cue`, `recording-deck`, `fact-fiction-matrix`.
- Source citations and map, timeline, recording, and matrix item types.

The experience reads this content rather than duplicating copy. `src/experience/content.ts` adds chapter metadata (short titles, ambience mapping, truth-layer labels) and derived editorial structures (the fictional expedition log, production figures, recording labels).

### Current content totals

| Item | Count |
|---|---|
| Chapters | 7 |
| Prologue sections | 1 |
| Scenes | 8 |
| Compositions | 17 |
| Typed elements | 33 |
| Sources | 8 |
| Registered assets | 30 (17 images, 5 documents, 8 audio) |

`docs/audit/content-inventory.md` lists the chapter-level structure and the claims that need care.

---

## 5. Experience architecture

### Shell

`Experience.tsx` owns:

- The skip link and `main` landmark.
- The chapter observer.
- The reveal pass for `[data-reveal]` elements.
- A single `refreshMotion()` call after fonts and load.
- The global reduced-motion class.

### Context

`ExperienceContext.tsx` owns:

- Audio snapshot and controls (`enable`, `disable`, mute, volume, cue playback).
- System and in-app reduced motion.
- Active chapter.
- Inspected asset dialog.
- Sources drawer and highlighted source.
- Contents drawer.

Audio is opt-in. Enabling sound calls `AudioManager.enableAudio()`; ambience changes only after consent. Hidden tabs pause audio through the existing manager.

### Chrome

`Chrome.tsx` contains:

- Quiet masthead with wordmark, current chapter, Sound, Index, Sources.
- Sound menu with explicit “Turn sound on”, mute, volume, and “Turn off”.
- Contents drawer with all eight movements and a reduced-motion switch.
- Register drawer with Sources and Assets tabs, search, highlighted-source scrolling, and asset thumbnails.
- Desktop chapter rail: numbers, active rule, labels only on hover/focus.

The contents and register use the shared `Dialog` primitive, which traps focus, closes on Escape, restores focus, and locks body scroll.

---

## 6. Motion architecture

`src/experience/motion.ts` contains four hooks:

| Hook | Behaviour | Scope |
|---|---|---|
| `usePrologueMotion` | Pinned push-in, location fade, quote and end-state crossfade | Desktop ≥900px only |
| `useHorizontalChronology` | Pinned horizontal date track | Desktop ≥900px only |
| `useWoodsCamera` | Pinned forest push-in | Desktop ≥900px only |
| `useReveals` | One-time opacity/translate reveal for `[data-reveal]` | All breakpoints; disabled under reduced motion |

All hooks use `useGSAP` with an explicit scope and `revertOnUpdate: true`. Each animated scene uses `gsap.matchMedia()` and returns `mm.revert()`. Pins are limited to the prologue, chapter 01 chronology, and chapter 04 woods camera. Under reduced motion the hooks return before creating pins or tweens, so the final layout is static.

The reveal tween animates only `autoAlpha` and `y`, and clears the transform/opacity props after completion. Body copy is never scrubbed.

### Current pin budget

- Prologue: one pinned stage, `+=175%`.
- Chapter 01: one pinned chronology viewport, distance-derived.
- Chapter 04: one pinned woods stage, `+=125%`.
- Chapter 02, 03, 05, 06, 07: no pins.

This is within the one-or-two-pins-per-chapter-view budget set in the motion direction.

---

## 7. CSS architecture

`src/index.css` is a single authored stylesheet, roughly 4,500 lines. It contains:

- Font-face imports and design tokens.
- Chapter climates (`lore`, `town`, `dusk`, `woods`, `tape`, `production`, `remains`).
- Masthead, rail, prologue, chapter openings, reading layouts, figures, document objects, map, recording study, timeline, ledger, footer, dialogs, asset records.
- Responsive branches at 1100, 900, 720, 640, 480, 390, 360, and 320 pixels where the composition needs them.
- A small number of layout-safe animations: reveals, drawer entry, figure hover, switch.

No global `* { animation-duration: 0.01ms }` override remains. Reduced motion is handled by the motion hooks and by explicit CSS where a transition is decorative.

### Layout-shift correction made during final QA

The reconstruction SVGs and the closing Seneca Creek photograph were lazy-loaded without reserved box dimensions. Scrolling through the document once could grow earlier chapters by 96–458px, moving ScrollTrigger anchors and anchor-link targets. The fix:

- `DocumentObject` images now declare `width="800" height="1040"`.
- `.document-object__plate img` reserves the same ratio with `aspect-ratio` and a `max-height`-aware width.
- The closing lake photograph declares `width="1280" height="960"`.

A before/after scroll probe now reports zero section-height change and stable anchor positions on desktop and mobile.

---

## 8. Audio

`src/utils/AudioManager.ts` is the live audio layer. It uses the Web Audio API, not `<audio>` autoplay:

- No sound on load.
- Explicit consent.
- Master volume and mute.
- Chapter ambience map in `src/experience/content.ts`.
- Cue playback from chapter 03 and 04.
- Pause when the tab is hidden.

All eight WAV beds are project originals synthesised by `scripts/build-audio.mjs` from filtered noise, sine tones, and shaped transients. They are 44.1kHz, 16-bit mono, 5–14 seconds, and looped. No third-party recording file is stored or sampled.

`wavesurfer.js` is still a dependency but is used only by the unused `src/components/enigma/WaveformPlayer.tsx`. It does not appear in the production entry path. Removing the legacy component and the dependency is a cleanup item, not a functional blocker.

---

## 9. Build and verification

Latest production build:

```text
dist/index.html                     0.77 kB
dist/assets/index-CKg4xyj0.js     510.42 kB │ gzip: 166.70 kB
dist/assets/index-Cp2E-ynT.css    158.31 kB │ gzip:  28.98 kB
```

The only build warning is Vite’s 500kB chunk advisory. TypeScript passes.

Verified in this phase:

- Production build succeeds.
- No console errors on a fresh production page load.
- Desktop 1440 and 1280 compositions.
- Mobile 390 and 320 widths; no document horizontal overflow.
- Prologue first frame is a photograph, not glyphs.
- All eight sections exist in DOM order.
- Source drawer opens, highlights a cited source, traps focus, closes on Escape, restores focus.
- Contents drawer links to all eight movements.
- Asset dialog renders images, documents, and a native audio player for audio assets.
- Reduced motion disables pins and shows the complete static state.
- Lazy-load reflow fix verified by scroll probe.

Screenshots are in `docs/audit/screenshots/`.

---

## 10. Findings and risks

### High

1. **No automated tests.** There is no unit, integration, or visual regression suite. The current QA is manual and screenshot-based. Before a public release, add at least a Playwright smoke test for load, section count, dialogs, reduced motion, and mobile overflow.

### Medium

2. **Bundle size.** The main JS chunk is 510.43 kB (166.70 kB gzip). The warning is not a functional failure, but code-splitting the legacy modules, the register, or the recording study would reduce initial parse cost.
3. **Image delivery.** All photographs are 1280px wide JPEG/PNG. There is no `srcset`, AVIF, or WebP. Mobile downloads desktop-sized files. Add responsive variants and explicit dimensions before launch.
4. **Legacy tree.** `src/components/enigma/` and `src/context/EnigmaContext.tsx` are dead code. They inflate the repository and can mislead future contributors.
5. **Unused registered assets.** `img-david-arnold-house` is registered but not placed. `burkittsville-street.jpg` is present but unregistered and unused. `film-grain.svg` and `twana-sigil.json` are unused.
6. **No route/OG metadata.** The document title is set, but there is no per-chapter metadata, canonical URL, Open Graph card, or favicon designed for the case.

### Low

7. **Dev HMR artefact.** During one hot update, React briefly threw “useExperience must be used inside ExperienceProvider”. A clean production navigation does not reproduce it. It is a development-time module-order artefact, not a shipped error, but it should be watched when editing the provider.
8. **WAV weight.** The eight audio beds total about 7.4 MB. They are lazy enough in practice, but a compressed delivery format would be better for public hosting.
9. **Typographic extremes.** Instrument Serif at display sizes is intentionally large. At 320px the prologue is dense but readable; future copy changes should be re-tested at that width.

---

## 11. Recommendation

The new experience is structurally sound: one shell, one content source, three pinned scenes, explicit provenance, and no dossier chrome. The next engineering pass should be a cleanup and delivery pass, not another redesign:

1. Add responsive image variants and dimensions.
2. Remove or archive the legacy component tree.
3. Add a Playwright smoke suite.
4. Split the register/recording study from the initial bundle if performance data justifies it.
5. Re-check every source and licence before public distribution.
