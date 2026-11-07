# ENIGMA — design system (tokens and rules)

This is the implementation contract for the art direction. Tailwind v4 theme tokens should map to these names. Prefer tokens over one-off hex.

---

## Type scale

| Role | Size | Line-height | Weight | Face |
|---|---|---|---|---|
| `display-xl` | clamp(3.5rem, 8vw, 8rem) | 0.95 | 400 | Instrument Serif |
| `display-lg` | clamp(2.5rem, 5vw, 4.5rem) | 1.05 | 400 | Instrument Serif |
| `title` | clamp(1.75rem, 3vw, 2.5rem) | 1.2 | 400 | Instrument Serif |
| `lede` | clamp(1.25rem, 2vw, 1.5rem) | 1.4 | 400 italic | Instrument Serif or Newsreader italic |
| `body` | 1.125rem (mobile 1rem) | 1.6 | 400 | Newsreader |
| `caption` | 0.875rem | 1.45 | 400 | Instrument Sans |
| `ui` | 0.875rem | 1.3 | 500 | Instrument Sans |
| `meta` | 0.75rem | 1.4 | 400 | Geist Mono |

Body measure: `max-width: 68ch`.  
Display tracking: `-0.02em`.  
UI labels: sentence case. Uppercase only for ENIGMA wordmark if needed, tracking `0.04em` max.

Load only the cuts used. Keep Fontsource local imports. `font-synthesis` off for italic on Instrument Serif after verifying the italic file is loaded (it is).

---

## Colour tokens

```css
--night-field: #12110f;
--canopy: #1a1f18;
--slate: #2a2926;
--paper: #e7dfd0;
--paper-deep: #d8d0c0;
--ink: #1c1915;
--bone: #efe8dc;
--mist: #8a8478;
--moss: #3f5344;
--ember: #8c4a32;
--brass: #a89068;
--day-sky: #c5c1b6;
--focus: #c4b08a;
--border-quiet: color-mix(in oklab, var(--bone) 12%, transparent);
```

Text on `night-field` / `canopy`: `bone` (check ≥4.5:1).  
Text on `paper`: `ink`.  
Do not set body text in `mist` on dark — captions only, and verify contrast.

Focus ring: `2px solid var(--focus)`, offset `3px`. Do not remove.

---

## Spacing

Spacious density (ui-ux-pro-max density 3):

- Inner group: 8 / 12 / 16  
- Between groups: 32 / 48 / 64 / 96  
- Section padding block: `min(12vh, 8rem)` cinematic; `5rem` editorial  
- Viewport margins: 20px mobile, 40–64px desktop  
- Never `100vw`; use `100%` / `100dvh`

---

## Radius, line, shadow

- Default radius: `0` for photographs and type; `2px` for small controls if needed.
- No drop shadows on content cards.
- Images: 1px inset outline `oklch(1 0 0 / 0.1)` on dark, `oklch(0 0 0 / 0.1)` on paper (`better-ui`).
- Separators: space first; hairline last.

---

## Controls

- Hit area ≥ 44×44px.
- Primary action: light `paper` fill, `ink` text, sentence case (“Begin the legend”).
- Secondary: ghost, Instrument Sans.
- Press scale `0.96` / 150ms / ease-out; none under reduced motion.
- Sound control always visible and labelled (not icon-only).

---

## Media

- Prefer existing JPEGs with `srcset` and lazy load below the prologue.
- Alt text from `EnigmaAsset.description`.
- Captions include classification in prose, not a coloured chip.
- Reconstructions: first line of caption starts with “Reconstruction.”

---

## Content types → presentation

| Element type | Component behaviour |
|---|---|
| `text` | Narrow column, no card |
| `quote` | Display size, no “deposition” label |
| `image` | Bleed or editorial; inspect opens provenance |
| `document` | Vitrine object + transcript disclosure |
| `map` | Full visual + optional markers |
| `timeline` | Two rows or two columns, labelled Fiction / Record |
| `ascii-visual` | Only where chapter design calls it |
| `audio-cue` | Text description always; play is optional |
| `recording-deck` | Split viewer, labelled procedural |
| `fact-fiction-matrix` | Typographic table |

---

## Accessibility

- Semantic landmarks: `header`, `main`, `nav`, chapters as `section` with headings.
- Skip link.
- `prefers-reduced-motion`: static crops, no pin, no scrub; content in DOM order.
- Do not rely on hover for chapter names on mobile.
- Sources drawer: focus trap, Escape, return focus.
