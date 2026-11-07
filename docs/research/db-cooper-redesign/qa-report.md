# Case 002 — QA report

Final pass on the DB Cooper edition. This records what was tested, what failed, and what changed.

## Environment

- Dev server: `http://localhost:5183/case/db-cooper`
- Harnesses: `scripts/shoot.mjs`, `scripts/flow-shot.mjs`, `scripts/eval.mjs`,
  `scripts/overflow.mjs`, `scripts/qa-interactions.mjs`, `scripts/contrast-audit.mjs`
- Build: `npm run build`

## Layout and responsive

| Check | Result |
| --- | --- |
| Page-level horizontal overflow at 390 / 768 / 1024 / 1440 | **Pass** — `scrollWidth === clientWidth` at every width |
| Intentional crops (map plate, evidence strip, matrix on mobile) | Contained by their own scroll containers, no page overflow |
| Desktop page height | ≈ 28,400 px (down from ≈ 49,800 px in the old page) |
| Mobile page height | ≈ 39,400 px |
| Text clipping (`scrollWidth > clientWidth` on headings/copy) | **None** at 1440 and 390 |
| Lazy image blank frames in captures | Capture-timing only; deterministic scroll + 4 s settle renders every image |

### Fixes
- Mobile cover: the archive photograph keeps its wide aspect and the empty dark band under the caption is gone. The duplicate rotated date is hidden on mobile.
- Mobile map: the context inset moved to the empty lower-right corner so it no longer covers the “Ariel · drop zone” label.
- Map place labels clamped inside the plate crop (Woodland, Vancouver, Portland, Ariel, Tina Bar).
- Reduced motion reflows the search stage to one column instead of leaving a 600 px empty sidebar.

## Interaction QA (`qa-interactions.mjs`)

| Flow | Result |
| --- | --- |
| Index overlay opens, traps focus, Escape closes, focus returns to trigger | Pass |
| Reduced-motion toggle keeps focus on the checkbox after re-render | Pass (`afterToggle: INPUT`) |
| Register search filters to zero and shows the empty state | Pass |
| Theory tabs: roving tabindex, one tab stop, panel label, heading update | Pass (`tabIndex: [-1,-1,0,-1]`) |
| Suspect “Physical evidence” filter shows the zero-result state | Pass |
| Map place selection updates detail, pressed state and step | Pass |
| Asset drawer opens and closes with Escape | Pass |
| Sound panel closes with Escape | Pass |
| Page scroll locked while an overlay is open | Pass |

## Contrast (`contrast-audit.mjs`)

- **0** text nodes below 4.5:1 at 1440×900 and 390×844.
- Re-audited with the index overlay, register, sound panel, asset viewer and each theory tab open: **0** failures.
- The audit composites semi-transparent backgrounds against the real page ground rather than reading them as opaque.

### Colour change
The raw stamp red (`#d63118`) is 4.1:1 on newsprint and 3.4:1 on manila, so it is no longer used for text. Text now uses:

- `--red-text: #b02a12` on paper (5.5:1), `#ff8a70` on blue/night/green (5.9:1+)
- `--amber-text: #7a5200` on paper (5.8:1), full `--amber` on dark

Borders, fills, rules and chart marks keep the stamp values. Paper inserts inside dark chapters reset both variables.

Also fixed: the skip link was ink-on-ink because `.ed a { color: inherit }` outranked `.ed-skip`.

## Touch targets

- Masthead controls ≥ 40 px; brand 34 px; “Read the file” 44 px; sound enable 44 px; suspect filters 44 px; map steps 40 px.
- Inline citation buttons and “Original source” links are 24–31 px tall; these are inline targets inside sentences and fall under the WCAG 2.5.8 inline exception.

## Reduced motion

With `prefers-reduced-motion` or the in-page toggle:

- Cover push-in: `animation: none`, `transform: none`
- Search map and jump instrument: `position: static`
- Jump pin collapses; marker hidden
- All reveals visible (`opacity: 1`), no transforms, no transitions
- Search stage reflows to one column with the map capped at 720 px

## Build

`npm run build` passes. Only the existing warnings remain: >500 kB chunk and the static/dynamic import of `Case002Experience`. CSS ≈ 316.7 kB (55.4 kB gzip); JS ≈ 763.7 kB (240.3 kB gzip).

`npm run lint` reports no warnings or errors under `src/cases/case-002-db-cooper`. The remaining lint output is from `.freebuff/` and the local QA scripts.
