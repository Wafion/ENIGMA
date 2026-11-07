# Current site audit — post-implementation

**Date:** 4 November 2026  
**Audited build:** production preview, `http://localhost:4173/`  
**Build output:** `dist/assets/index-D1vcVqNn.js` (534.55 kB, 173.44 kB gzip), `dist/assets/index-Z3AZGFti.css` (180.49 kB, 33.11 kB gzip)  
**Evidence:** `docs/audit/screenshots/home-*.png`, `docs/audit/screenshots/production-*.png`, `enigma-home-qa.json` and `enigma-production-qa.json` (CDP runs at 1440×900, 1280×800, 390×844, 320×720, plus reduced motion)

This document audits the **rebuilt experience**. The pre-rebuild audit remains in `docs/audit/current-state.md`; the structural read of the repository is in `docs/audit/repository-audit.md`.

---

## 1. Verdict

The site now reads as one authored documentary rather than an archive dashboard or a cinema/broadside product. The home page is a poster for that documentary: an oversized `ENIGMA` wordmark over a live ASCII landscape, with a single published case and an honest research slot. All eight movements are present in document order, the visual language changes by chapter, and the provenance apparatus is available without becoming the page's ornament. The largest remaining risks are delivery and maintenance, not direction.

| Question | Finding |
|---|---|
| Is it one experience? | Yes. A home poster routes into one scroll document with one masthead, one chapter rail, seven chapters plus prologue. No mode switch. |
| Is the photography the primary image? | Yes in the prologue and Chapters 02 and 04. The home page uses typography and a drawn ASCII landscape instead of stock imagery. |
| Is the fiction separated from the record? | Yes at chapter level, in captions, in the ledger and in the register. The weakest points are the deliberately repeated film-title quotation and the reconstructed transcript; both carry explicit labels. |
| Does motion support reading? | Yes. Three desktop pins, none on mobile, no scroll hijacking, and a complete static state under reduced motion. The home hero's ASCII drift and ticker stop under reduced motion. |
| Is the site operable? | Yes at the tested widths and with keyboard/dialog flows. Lighthouse scores the home page 100/100/100; the case still needs a separate axe pass. |

---

## 2. Narrative and provenance

Eight movements are rendered in this order:

1. Prologue — the forest and the 1999 film's title card.
2. The Legend of the Black Hills — in-universe mythology, 1785–1941.
3. The Town Below South Mountain — verified Burkittsville history and the 1858/1861 maps.
4. October 1994: The Student Expedition — the fictional disappearance and the real cast.
5. The Woods: An Unstable Geometry — the production landscape, Black Rock Mill and one ASCII comparison.
6. The Recordings: 16mm & Hi8 — procedural sequence study and reconstructed transcript.
7. The Real Story — method filmmaking, the 1999 marketing campaign and the dual timeline.
8. What Remains — six claim/record rows, sources, reading settings and the closing lake photograph.

Provenance is carried by plain-language labels rather than colour chips:

- Chapter kickers name the layer: “In-universe mythology · constructed 1998–1999”, “Verified history · Frederick County, Maryland”, “Production record · October 1997”, “Epilogue · critical synthesis”.
- Every reconstruction is captioned as a reconstruction in its first line. The recording frames repeat “PROCEDURAL RECONSTRUCTION — NOT A FILM FRAME” inside the image.
- The prologue quotation is attributed to the 1999 film's opening title card and marked “Film text, not a historical record.”
- The cast triptych says the actors are alive and the portraits are contemporary, not film stills.
- The 2022 Maryland photographs are captioned as contemporary location photographs, not production evidence.
- The sound menu and audio objects now say **“Sound design”**, not “field recordings”. The WAV beds are synthesised project originals; no third-party recording is stored.
- The closing epigraph is labelled as ENIGMA's editorial synthesis, not a quotation from a person.

No invented source, date or quotation was added during implementation. The known citation limitation remains: SRC-03 and SRC-06 resolve to Wikipedia section anchors rather than archived primary documents. This is recorded in `docs/audit/content-inventory.md` and should be corrected before commercial publication.

---

## 3. Visual assessment

### Home page

The home page is a centred poster rather than a dashboard header. A split masthead sits above a hairline rule; the bracketed tagline, the `ENIGMA` wordmark, the Case 001 status and the taxonomy share one vertical axis, with corner brackets and a plus mark holding the frame. The lower third is a deterministic ASCII landscape — two ridges of characters, a dotted moon and stars — that drifts slowly and brightens on hover. A rotating badge is the only large circular element and is the primary way into the case. The “Latest” ticker at the foot carries Case 001 metadata only.

The composition holds at 1440, 1280, 390 and 320. On small screens the taxonomy becomes a centred wrapped list, the plus and one ticker label drop away, and the wordmark stays within the 20 px page margin. The research slot remains visibly quieter than the published case, so the catalogue does not overstate what exists.

**Working:**

- The prologue is a photographic environment with the title lower-left, not a card over a dashboard. The desktop title alignment was corrected in this audit (see §6).
- Chapter 01 is a dark, typographic lore climate; Chapter 02 turns to paper and cartography; Chapter 04 is full-bleed timber; Chapter 05 is a tape-black viewing room; Chapter 07 returns to daylight.
- Typography carries hierarchy: Instrument Serif for display, Newsreader for reading, Instrument Sans for interface, Geist Mono for evidence labels. Mono is no longer the default voice of the page.
- Photographs are mostly unframed or editorially cropped. Borders are reserved for objects under examination: documents, the map, the recording frame.
- The ASCII treatment appears once, as a user-controlled optical comparison in Chapter 04. It is not a wallpaper or a loading effect.
- The map plate shows two Library of Congress editions, four markers, zoom controls and “In the story” / “On the ground” fields.
- The fact ledger reads as a comparative table, not a stack of identical cards.

**Watch items:**

- The desktop chapter opening still leaves a generous band of empty field above the title. It reads as cinematic breathing room at 1440; at 390 it is close to indulgent but still coherent.
- The recording study's large dark field is intentional, but it is the least information-dense screen in the essay. It depends on the adjacent transcript and production notes to do its critical work.
- The mobile map is legible but dense. Marker labels are abbreviated and the detail panel moves below the map; the interaction remains usable.

---

## 4. Motion and interaction

**Verified:**

- Desktop pins: 3 (prologue, Chapter 01 chronology, Chapter 04 woods). Mobile pins: 0.
- The prologue camera pushes in, fades location metadata, then crossfades to the film quotation and the end state.
- The Chapter 01 chronology moves horizontally only while its viewport is pinned. The Chapter 04 camera pushes into the canopy.
- Reveals are one-time opacity/translate transitions on `[data-reveal]`; body copy is never scrubbed.
- The page scrolls natively. No wheel interception, no custom scrollbar, no scroll-jacked sections.
- Reduced motion (both the in-app switch and `prefers-reduced-motion`) removes pins, shows the prologue quotation and end state immediately, and leaves the chronology track untransformed.
- The chapter rail uses numbers plus an active rule; labels appear on hover/focus.
- The home masthead uses ASCII brackets on hover; the `ENIGMA` wordmark scrambles out of ASCII on mount and on hero hover, while its accessible name stays `ENIGMA`.
- The home “Latest” ticker pauses on hover and becomes a static wrapped list under reduced motion; the ASCII terrain paints one still frame and stops its loop.
- The home search overlay opens with focus in the input, traps Tab, closes on Escape or backdrop, restores focus to the trigger and announces the result count.
- Dialogs trap focus, close on Escape, lock body scroll and restore focus to the trigger. Automated QA now confirms focus returns to the `SRC-04` button after closing the source drawer.
- The sound menu opens with focus inside it, closes on Escape and returns focus to the masthead trigger.
- Recording selection has five items; the second selection updates the viewer label and transcript. The map has four markers and switches to the 1861 edition. The audio asset opens a native player and displays “Project-original sound design”.

**Watch items:**

- The in-app reduced-motion state adds a taller static prologue (title, quotation, end block) that extends below the first viewport. This is correct for content access but means the reduced-motion opening is a scroll, not a single frame.
- No automated motion regression suite exists. Pin counts were verified by script, not by visual diffing across browsers.

---

## 5. Accessibility, responsiveness and integrity

### Accessibility

| Check | Result |
|---|---|
| Skip link and `main` landmark | Present |
| Section labelling | Each chapter has `aria-labelledby` pointing at its `h2` |
| Dialog semantics | `role="dialog"`, `aria-modal`, labelled title, focus trap, Escape, focus restore |
| Images | All 21 rendered images have `alt` attributes; the one decorative closing image uses `alt=""` inside `aria-hidden`; 0 broken |
| Audio | Consent-gated; no autoplay; native player in the asset dialog; tab-hidden pause through `AudioManager` |
| Reduced motion | In-app toggle and media query; pins removed; home ticker, badge and status stop |
| Keyboard | Chapter rail, home masthead, search dialog and badge operable; focus-visible styling present |
| Automated Lighthouse pass | Home page: **100 Accessibility, 100 Best Practices, 100 SEO**; the case document still needs a separate axe pass |

### Responsive

| Viewport | Document scroll width | Pins | Broken images | Height growth after full scroll |
|---|---:|---:|---:|---:|
| 1440×900 | 1432 / 1440 | 3 | 0 | 0 px |
| 1280×800 | 1272 / 1280 | 3 | 0 | 0 px |
| 390×844 | 390 / 390 | 0 | 0 | 0 px |
| 320×720 | 320 / 320 | 0 | 0 | 0 px |

The `scrollWidth` values below the viewport width are the scrollbar gutter, not clipped content. The audit's element-level “outside viewport” list contains only intentional cases: the prologue media's `inset: -2%` crop, the pinned chronology panels that wait off-screen inside their track, the mobile recording strip's horizontally scrollable cards, and the home ticker track inside its clipped viewport. No document-level horizontal scrollbar was observed.

Home page:

| Viewport | Scroll width | Wordmark | Badge | Outside viewport (non-ticker) | Broken images |
|---|---:|---:|---:|---:|---:|
| 1440×900 | 1432 / 1440 | 1043 px | 124 px | 0 | 0 |
| 1280×800 | 1272 / 1280 | 927 px | 110 px | 0 | 0 |
| 390×844 | 390 / 390 | 278 px | 93 px | 0 | 0 |
| 320×720 | 320 / 320 | 241 px | 83 px | 0 | 0 |

### Asset and runtime integrity

- 21 images rendered, 0 broken; 20 lazy-loaded, 1 eager prologue image.
- No audio or video elements are mounted until a player is opened.
- Zero uncaught exceptions and zero console errors in the production pass.
- One cancelled request (`net::ERR_ABORTED`) during navigation; not a failing asset.
- No document-height growth after scrolling to the end and back (0 px at every viewport), so lazy loading no longer moves anchors or ScrollTrigger starts.
- Production build passes TypeScript; lint reports warnings only (listed in `docs/implementation/final-report.md`).

---

## 6. Defects found and corrected in this audit

| Defect | Cause | Correction |
|---|---|---|
| Desktop prologue title sat right-of-centre instead of lower-left | `.prologue__content` kept `justify-content: flex-end` from its mobile flex layout when it became a grid at ≥900 px; the single grid column was pushed to the right | Added `grid-template-columns: minmax(0, 1fr)` and `justify-content: stretch` to the desktop grid |
| Reduced-motion prologue was right/centre aligned | The flex fallback inherited `align-items: end` from the desktop grid and `align-self: center/end` on the quote and end block | Set `align-items: stretch` on the reduced-motion flex container and `align-self: stretch` on the quote and end block, for both the in-app class and `prefers-reduced-motion` |
| Source-drawer focus restoration was unproven by the automated pass | The script clicked a `[data-reveal]` source button while it was still `visibility: hidden`, so focus could not land on it | Harness now scrolls the citation into view, waits for the reveal, focuses the button, then clicks. Result: active element returns to `SRC-04` after Escape |
| Audio copy implied field recording | Legacy wording survived in the sound menu and audio object | Changed to “Sound design” and “Sound design · project original” |
| Stale build hashes in the repository audit | Earlier build | Updated to the final production output |
| Home hero no longer matched the supplied poster | The previous `TRACE / THE / MYTH / BACK` hero and signal dial had been built to an earlier brief | Rebuilt the hero as the centred `ENIGMA` poster with the ASCII landscape, taxonomy and ticker |
| Search button had no destination | The reference shows a magnifier; linking it nowhere would be a dead control | Added an accessible overlay over the twelve published destinations |
| Ticker could have implied unpublished work | Reference-style tickers invite invented headlines | Limited to Case 001 metadata and an explicit “next subject in research” line |

The earlier lazy-load reflow defect (reconstruction SVGs and the closing photograph without reserved dimensions) was fixed before this audit; the zero height-delta result above is the regression check.

---

## 7. Remaining findings

### High

1. **No automated test suite.** A Playwright smoke test should cover load, eight sections, dialog open/close/focus, reduced motion, mobile overflow and the recording/map interactions.
2. **Citation depth.** SRC-03 and SRC-06 are pointers to encyclopaedic sections, not archived primary documents. Resolve before publication.

### Medium

3. **Image delivery.** Photographs are single-size 1280 px JPEG/PNG files. Add `srcset`, AVIF/WebP and explicit dimensions per breakpoint. Intrinsic dimensions are already present on the elements that caused reflow.
4. **Legacy tree.** `src/components/enigma/` and `src/context/EnigmaContext.tsx` are unused. They should be deleted or moved to a documented archive folder.
5. **Unused assets.** `burkittsville-street.jpg`, `film-grain.svg` and `twana-sigil.json` are unreferenced; `david-arnold-house.jpg` and `aud-cabin-creak` are registered but unplaced. Either place or remove them.
6. **Bundle warning.** The single JS chunk exceeds Vite's 500 kB advisory. The recording study and register are the obvious split points if performance data justifies it.
7. **Metadata.** There is no canonical URL, Open Graph card, per-chapter metadata or designed favicon.

### Low

8. **Mono label size.** The smallest evidence labels sit around 0.64–0.7 rem. They pass visually but should be checked in a contrast/zoom audit.
9. **WAV weight.** The eight audio beds total roughly 7.4 MB. Compressed delivery would be better for public hosting.
10. **Dev-only HMR artefact.** One hot update briefly threw “useExperience must be used inside ExperienceProvider”. A clean production navigation does not reproduce it; watch module order when editing the provider.

---

## 8. Release recommendation

The direction is resolved and the implementation is coherent. Ship after a delivery pass:

1. Add the Playwright smoke suite and run an axe pass on the case document (the home page already scores 100/100/100 in Lighthouse).
2. Replace the two weak citation links with archived documents.
3. Add responsive image variants and metadata.
4. Remove or archive the legacy component tree and resolve the five unplaced assets.
5. Re-run this audit's production script against the final build.

**Verdict:** ready for editorial review and a controlled preview. Not yet ready for an unattended public launch without the accessibility and citation work above.

