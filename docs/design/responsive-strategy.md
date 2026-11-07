# ENIGMA — responsive strategy

Desktop and mobile are two compositions of one documentary. Breakpoints follow content, not device names.

| Token | Width | Intent |
|---|---|---|
| `sm` | 480 | Comfortable type, single column |
| `md` | 768 | Captions beside short images possible |
| `lg` | 1024 | Split essay / image; chapter ticks |
| `xl` | 1280 | Full camera, optional horizontal chronology |

Use `100dvh` for cinematic frames. Account for `env(safe-area-inset-*)`. `scroll-padding-block-start` equals masthead height.

---

## Desktop (`lg+`)

- Wide photographic frames, 16:9 or full viewport.
- Asymmetric title blocks (right third or lower third).
- Optional one pinned camera per prologue / woods.
- Chapter ticks on the right or top, Firestorm-thin.
- Reading column 60–70ch, offset from center when an image occupies the other half.
- Hover may *enrich* (caption emphasis); it must not be the only way to get a chapter name.

---

## Tablet (`md`–`lg`)

- Drop horizontal fake-scroll; stack chronology.
- Keep large images; reduce pin distance.
- Masthead: wordmark + sound + menu.

---

## Mobile (`< md`)

Independent art direction:

- Vertical crops of the same photographs (`object-position` per asset). Seneca Creek: keep canopy; cemetery: keep slope, not empty sky.
- Type: display titles wrap with `balance`; no 8rem words overflowing.
- No left rail, no dual view toggle, no ASCII studio drawer.
- Audio and sources in the menu sheet as well as compact icons (labelled).
- Pinned scenes off. A short opacity fade is enough.
- Prologue: still photograph, title, quotation, continue. Camera optional as a tiny scale if it stays at 60fps.
- Touch targets 44px; controls not hidden under sticky bars.
- No horizontal overflow. Test 320, 375, 390, 430 widths.

---

## Shared rules

- Images `max-width: 100%`.
- Tables (fact/fiction) become stacked definition pairs on small screens.
- Map markers: tap sheets, not hover cards.
- Reduced motion identical in meaning on all breakpoints: readable final layouts.

---

## QA viewports (Phase 3+)

375×812, 390×844, 768×1024, 1280×800, 1440×900, 1920×1080.  
Keyboard: tab through masthead, continue, sources.  
`prefers-reduced-motion: reduce`.
