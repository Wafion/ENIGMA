# ENIGMA — motion direction (scroll camera)

Primary system: **GSAP 3.15 + ScrollTrigger + `@gsap/react` `useGSAP`**.  
Register plugins once. Scope every timeline. Revert on unmount.

This is not smooth-scroll hijacking and not ScrollSmoother (not required). Native document scrolling is the foundation.

---

## Camera language

Think in **shots**, not effects. One shot at a time.

| Shot | GSAP | Use |
|---|---|---|
| Push-in | `scale` 1 → 1.12 on image layer, `scrub: 0.6` | Prologue forest, Chapter 04 mill |
| Pull-back | reverse scale + reveal more crop | End of prologue into Chapter 01 |
| Track | `xPercent` on a wide photograph or chronology row | Chapter 01 dates; Chapter 02 map |
| Hold / pin | `pin: true`, `end: "+=120%"` max | Prologue title; one woods scene |
| Focus | opacity + slight scale on a foreground tree or caption | Sparse |
| Dissolve | crossfade two images, 20–40% of a pin | Chapter transitions, rare |
| Crop | animate `object-position` via custom property or clip-path | Cemetery → town |
| Type enter | opacity + `y: 16` once, or scrubbed opacity on titles | Titles only, never body paragraphs |

Animate **transform and opacity only** (`gsap-performance`). No `top`/`height` animation. `will-change: transform` only on the active camera layer.

---

## Architecture (to implement in Phase 3+)

Reusable hooks, each wrapping `useGSAP`:

- `useScrollCamera` — scale/position of a media layer bound to a trigger
- `usePinnedScene` — pin + timeline; disabled below `md` or when reduced motion
- `useImageReveal` — clip-path or opacity reveal
- `useParallaxLayers` — max 3 layers, `yPercent` 5–12
- `useChapterTransition` — optional dissolve; most chapters use a hard editorial cut with a colour climate change

Do not put ScrollTrigger on child tweens of a timeline. One ScrollTrigger on the timeline.

Create triggers top-to-bottom. `ScrollTrigger.refresh()` after hero image `onload` and after fonts (`document.fonts.ready`).

`gsap.matchMedia()` for desktop vs mobile vs reduced motion.

---

## Pinning budget

From ui-ux-pro-max GSAP guidance: **do not pin more than one or two scenes per page view of a chapter.**

Case 001 budget:

| Location | Pin? | Desktop | Mobile |
|---|---|---|---|
| Prologue camera | Yes, one sequence | ~150–200vh extra | No pin; short scale or none |
| Ch 01 chronology | Optional horizontal fake-scroll | One | Stacked, no pin |
| Ch 02 map | Optional | One short | Static map |
| Ch 04 woods | One image push | Yes | Static full-bleed |
| Other chapters | No | — | — |

---

## Prologue timeline (target)

Pinned scene, scrub 0.8, ease none on the camera:

1. **0–0.2** Dark field. Photograph opacity 0 → 0.85. Scale 1.08.
2. **0.2–0.4** Slow push to 1.0 (or 1.0 → 1.1 depending on crop). Location caption fades in (sans, bottom).
3. **0.4–0.6** Opening title-card quotation fades in, then eases down in weight as the photograph remains.
4. **0.6–0.8** Display title `The Blair Witch` / `Incident` enters.
5. **0.8–1.0** Caption + continue control. Slight pull-back. Pin releases into Chapter 01 paper climate.

Reduced motion: show the final frame (photograph + title + continue). No pin.

---

## Chapter transitions

Default: **climate change** (background token + type colour) over 1–2 scroll ticks, not a show.

Special (use at most three in the whole case):

- Prologue photograph bleed into Chapter 01 paper (the image shrinks to a still in the first essay).
- Chapter 02 map expanding into Chapter 04 forest (later phase).
- Chapter 07 still water, hold.

No ASCII wipes.

---

## Micro-interactions (`better-ui` / `micro-interactions`)

- Controls: 150–250ms colour/opacity.
- Drawers: 200ms opacity + 12px translate; exit faster (150ms).
- Do not stagger every heading on scroll. Stagger is for the prologue title stack only (100ms, max 3 items).

---

## Performance

- Pause off-screen canvases (`IntersectionObserver`) — already a pattern in ASCII.
- Do not store pointer position in React state every mousemove; use `gsap.quickTo` or canvas-local variables if a flashlight remains.
- Kill ScrollTriggers on unmount via `useGSAP`.
- Images: decode async; do not start every chapter image at once.

---

## Reduced motion (`motion-accessibility`)

`matchMedia('(prefers-reduced-motion: reduce)')` **and** the in-app toggle.

When reduced:

- Skip pin, scrub, parallax, ken burns.
- Render the end state of each scene.
- Keep fade of drawers (opacity only).
- Keep audio optional and independent.

Do not use a global `* { animation-duration: 0.01ms }` hammer that fights GSAP. Replace the current CSS override with explicit branches.
