# Skill audit — what was used, adapted, and refused

**Scope:** the skills present in `.agents/skills/` at the time of the rebuild.  
**Purpose:** record which guidance shaped the implementation, where it can be seen in code, and where the build falls short. A skill was not “applied” just because it was read.

The brief also names skills outside this repository (`openode`, `browser`, `find-skills`, `report`). Those are host capabilities, not design guidance, and are not treated as evidence of interface quality.

---

## 1. Design and content skills

### `frontend-design`

**Used for:** the Threshold direction, the refusal of a house “engine look”, the chapter-climate system, and the decision to treat photographs as the environment.

**Where visible**

- `docs/design/art-direction.md` records the rejected defaults and the chosen identity.
- `src/index.css` uses chapter-specific climates (`.chapter--town`, `.chapter--woods`, `.chapter--tape`, `.chapter--production`, `.chapter--remains`) rather than one dark template.
- The prologue is a photograph with a title in it, not a dashboard.

**Residual gap:** some chapter openings still share a structural rhythm (kicker, huge title, dek, aside). The climates differ, but the opening skeleton repeats more than the art direction intended. Chapter 05 and 06 break it; 01–04 do not fully.

### `ui-ux-pro-max`

**Used for:** spacious density, the GSAP pin budget, reduced-motion rules, and the rule that one or two pinned scenes per chapter are enough.

**Refused:** its `--design-system` output (Swiss / Playfair / Inter / light gallery). It was a generic editorial kit with no relationship to Maryland timber, Library of Congress maps, or the 1999 web. The output is recorded as rejected in `docs/audit/current-state.md`.

**Where visible**

- Prologue pin: `+=175%`; Chapter 04 pin: `+=125%`; Chapter 01 horizontal chronology pin: one scene. No other pins.
- `src/experience/motion.ts` branches on `prefers-reduced-motion` and on `(min-width: 900px)`.

**Residual gap:** the Chapter 01 horizontal chronology is a second pinned scene in the same reading sequence as the prologue. They are in different chapters, but a reader who scrolls quickly meets two pins within the first third of the essay.

### `better-layout`

**Used for:** grouping with space instead of lines, asymmetry, content bleeding to the edge, and the rule that controls float while the essay stays in margins.

**Where visible**

- `.reading-layout`, `.reading-layout--wide`, `.reading-layout--narrow` in `src/index.css`.
- Chapter 02's full-bleed Main Street figure, Chapter 04's mill feature, Chapter 07's Patapsco bleed.
- Mobile collapses split layouts to a single column at `max-width: 899px`; the chronology becomes a stacked list, not a squeezed horizontal track.

**Residual gap:** the fact ledger and dual timeline still depend on multi-column tables at desktop widths. They stack correctly, but the stacked version is long. A future pass could turn each row into a disclosure on small screens.

### `better-typography`

**Used for:** the type scale, the 68ch measure, `text-wrap: balance` on display type, `pretty` on paragraphs, and a refusal of all-caps mono as the house voice.

**Where visible**

- `docs/design/design-system.md` defines the roles; `src/index.css` implements them with local Fontsource faces.
- Display: Instrument Serif. Body: Newsreader. UI: Instrument Sans. Meta: Geist Mono, only for coordinates, timecodes, licences.
- `.kicker` is sentence case, 0.75rem, medium, not tracked-out uppercase.

**Residual gap:** the cast and production captions use small sans text over photographs; contrast depends on the scrim. The dark scrims are strong enough on the tested frames, but a bright future photograph would need a measured scrim, not a fixed one.

### `better-ui`

**Used for:** zero-radius media, 1px inset outlines instead of card shadows, 44px hit areas, press scale `0.96`, and the rule that a polish finding never outranks a broken interaction.

**Where visible**

- `.figure__media`, `.document-object__plate`, `.masthead__button`, `.sound-menu__close` (44px), `.button`.
- Dialog panels use a quiet border and no drop shadow.
- The inspect affordance appears on hover/focus on desktop and is always visible on touch (`max-width: 899px`).

**Residual gap:** the map zoom controls are small icon buttons. Their visual size is below 44px even though their padding brings the hit area close. Check them with a coarse pointer before launch.

### `web-design-guidelines`

**Used for:** semantic landmarks, a skip link, labelled controls, visible focus, real buttons for interactive figures, and a native audio element rather than a custom player.

**Where visible**

- `Experience.tsx` has `header`, `nav`, `main`, `section` with `aria-labelledby`, and a skip link.
- `Dialog` traps focus, closes on Escape, restores focus, and locks body scroll.
- `Figure` is a `<button>` with an accessible label; the image inside is not the only target.
- The source and asset register is a tabbed dialog with search and a labelled tab list.

**Residual gap:** the `Dialog` uses `role="presentation"` on the backdrop and `role="dialog"` on the panel, and handles Tab manually. It does not use the native `<dialog>` element or `inert` on the background. It is functional, but a stricter accessibility pass should move to native dialog semantics or add `inert`.

### `micro-interactions`

**Used for:** short colour/opacity hovers, a 200ms drawer entrance, a faster exit, and no stagger on every heading.

**Where visible**

- `.button`, `.masthead__button`, `.sound-menu`, `.dialog` transitions in `src/index.css`.
- `data-reveal` items use a single `y: 26` / opacity reveal, not a per-word stagger.

**Residual gap:** the reveal is applied broadly to headings, paragraphs and sections. It is one gesture, but it still fires often. Under reduced motion it is removed entirely.

### `motion-accessibility`

**Used for:** explicit reduced-motion branches, no autoplay, no scroll hijack, static final states, and focus behaviour independent of motion.

**Where visible**

- Every motion hook returns early when `reducedMotion` is true (`usePrologueMotion`, `useHorizontalChronology`, `useWoodsCamera`, `useReveals`).
- `revertOnUpdate: true` removes pinned spacers when the reader toggles reduced motion.
- `.is-reduced-motion` forces the prologue quote and end block visible, and removes the chronology transform.
- The sound menu says audio pauses when the tab is hidden and never plays automatically.

**Residual gap:** the CSS still contains a global `@media (prefers-reduced-motion: reduce)` rule that sets `animation-duration: 0.01ms` and `transition-duration: 0.01ms` on everything. It does not affect GSAP's JS tweens, because the hooks already branch, but it is the “global hammer” the motion direction said to replace. It should be narrowed to the specific CSS transitions that need it, or documented as a safety net.

---

## 2. React and GSAP skills

### `react-composition-patterns`

**Used for:** splitting the old monolith into one component per chapter, moving typed content lookup into `content.ts`, and keeping dialogs/primitives separate from chapter composition.

**Where visible**

- `src/experience/Experience.tsx` is a shell: provider, masthead, rail, chapters, footer, index, drawers.
- `src/experience/components/primitives.tsx` owns `Dialog`, `Figure`, `DocumentObject`, `AudioCue`, `AssetDialog`.
- `Chrome.tsx` owns masthead, sound menu, chapter index and source drawer.

**Residual gap:** `Chrome.tsx` is 430 lines and holds four related surfaces. It is cohesive, but a future split into `Masthead.tsx` and `Register.tsx` would make review easier.

### `react-best-practices`

**Used for:** memoising filtered registers, avoiding per-mousemove React state, batching scroll reads with `requestAnimationFrame`, and keeping static data outside the component tree.

**Where visible**

- `SourceDrawer` uses `useMemo` for the filtered source and asset lists.
- `Experience.tsx` and `Masthead.tsx` use one `requestAnimationFrame` per scroll burst.
- The ASCII comparison renders to a canvas once on image load; it does not redraw on pointer movement.
- `ASSET_MAP` is built once from the data module.

**Residual gap:** the `Figure` component looks up `ASSET_MAP` at render time on every figure. That is cheap, but it could be resolved once in the chapter component. The bigger performance issue is image weight, not React work.

### `gsap-react`

**Used for:** `useGSAP` with a scope, cleanup on unmount, and `revertOnUpdate` so a dependency change rebuilds the scene instead of layering a second one.

**Where visible**

- `src/experience/motion.ts`: every hook wraps `useGSAP(..., { scope, dependencies, revertOnUpdate: true })`.
- `gsap.matchMedia()` is reverted in the hook cleanup.

**Residual gap:** `usePrologueMotion` declares an unused `media` ref and returns it. It is harmless but should be deleted in a cleanup pass.

### `gsap-scrolltrigger`

**Used for:** one ScrollTrigger per timeline, pinning only the prologue, the chronology and the woods camera, `scrub` values between 0.55 and 0.7, `anticipatePin`, and `invalidateOnRefresh`.

**Where visible**

- `motion.ts` timelines use `trigger`, `start: 'top top'`, explicit `end`, `pin`, `scrub`.
- `refreshMotion()` refreshes after fonts and window load.

**Residual gap:** the horizontal chronology's `end` is calculated from `track.scrollWidth - viewport.clientWidth` at refresh. Font loading changes that width; the refresh handles it, but a resize during the pinned section can still produce a small jump.

### `gsap-performance`

**Used for:** transform and opacity only; no animation of `top`, `height` or layout properties; `will-change` limited to the media layer.

**Where visible**

- Prologue image: `scale` and `yPercent`.
- Woods image: `scale` and `yPercent`.
- Reveals: `y` and `autoAlpha`.
- Chronology: `x` on the track.

**Residual gap:** the prologue grain layer is a CSS data-URI noise image at 3.5% opacity. It is static, not animated, so it is cheap; but it is still a full-viewport composite layer on low-end phones.

### `source-driven-development`

**Used for:** checking the GSAP/React patterns against official guidance rather than memory, and citing the reference research rather than inventing it.

**Where visible**

- `docs/design/reference-analysis.md` has an inspection ledger with what was actually loaded.
- `docs/STAGE_1_RESEARCH_AND_PLAN.md` holds the source register and research notes.
- The code uses documented `useGSAP` options (`scope`, `dependencies`, `revertOnUpdate`) and `gsap.matchMedia()`.

**Residual gap:** the implementation does not carry inline comments pointing to the specific official docs page for each pattern. The design docs cite sources; the code relies on conventional usage. For a handover, add a short “implementation references” section to `docs/implementation/final-report.md` (done there) rather than littering the code.

### `code-review-and-quality`

**Used for:** the build/typecheck gate, the lint pass, and the multi-viewport QA. The review standard was “does it improve the whole”, not “is it perfect”.

**Where visible**

- `npm run build` passes (`tsc -b && vite build`).
- `npm run lint` is the project's oxlint gate.
- QA evidence is in `docs/audit/current-site-audit.md` and `docs/implementation/final-report.md`.

**Residual gap:** there is no automated visual regression suite. The screenshots are manual evidence, not a test. A future change to `index.css` can silently break a chapter composition.

---

## 3. Skills read but not used as design authority

| Skill | Why it did not set the direction |
|---|---|
| `react-best-practices` (Vercel) | Useful performance rules, but it is written for Next.js/RSC. ENIGMA is a Vite SPA with no server components. |
| `ui-ux-pro-max` design-system generator | Produced a generic kit; rejected. Its motion and accessibility notes were retained. |
| `web-design-guidelines` | Used as a checklist, not a visual language. |
| `code-review-and-quality` | Used as a process gate, not a content source. |

---

## 4. What the skills did not solve

1. **Provenance is an editorial problem, not a UI problem.** No skill tells you that a 2022 photograph must not be called a 1997 plate. That came from the source audit.
2. **The “archive” aesthetic is seductive.** The skills can enforce spacing and focus, but they cannot stop a design from reproducing the authority it is supposed to critique. The chapter climates and plain-language captions are the guardrail.
3. **Pin budget is a judgement call.** The skills say one or two pins; they do not say which chapters earn one. The prologue, chronology and woods camera were chosen because each explains space or time. Chapter 02's map is interactive but not pinned.
4. **Mobile is not a compressed desktop.** The skills give breakpoints; the actual mobile edit (stacked chronology, horizontal recording strip, no pin, no rail) was authored.
5. **Audio consent is a product decision.** The skills cover focus and reduced motion, not the ethics of autoplay. The consent gate is a deliberate choice.

---

## 5. Skill-related follow-ups

- [ ] Narrow or remove the global reduced-motion CSS hammer.
- [ ] Add `inert` to the background while a dialog is open, or move to native `<dialog>`.
- [ ] Remove the unused `media` ref in `usePrologueMotion`.
- [ ] Split `Chrome.tsx` into `Masthead.tsx` and `Register.tsx`.
- [ ] Re-check map zoom hit areas with a coarse pointer.
- [ ] Add one or two inline comments in `motion.ts` linking the `useGSAP` options to the official docs.
- [ ] Consider a disclosure pattern for the fact ledger on small screens.
