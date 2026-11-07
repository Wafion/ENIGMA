# DB Cooper — visual moodboard

A working board of *principles and material*, grouped by design axis. Every entry names a source and how it changes the DB Cooper page. No reference is copied.

---

## Typography

| Source | Observation | Translation |
|---|---|---|
| 032c | 120px headline against 10px credit; almost no middle sizes | Anton display at 9–15vw; IBM Plex Mono metadata at 10–11px; Newsreader body at 19–21px |
| New Industrials | Huge high-contrast serif; narrow centred reading column | Use Instrument Serif for quiet quotes and chapter ledes, not for every heading |
| Bromio | 1970s grotesque/displays, cropped by the page edge | Anton wordmark cropped at the viewport edge on the cover; one vertical date |
| NSS | One enormous serif line cutting into an image | A single line of Instrument Serif italic can cross a photograph, never a face |
| POP UP SOCIETY | Tiny annotation labels around a large diagram | IBM Plex Mono callouts at 9–10px with leader lines, always paired with a readable label |
| Dazed | Small section headings; photography does the shouting | Chapter kickers stay 11–12px; the artifact is the loud element |

**Type roles**

- **Poster:** Anton — cover, chapter numerals, one-sentence verdicts. Uppercase, tracking −0.02em, line-height 0.86–0.94.
- **Display/quote:** Instrument Serif — chapter ledes, quotes, the epilogue. Regular and italic. Line-height 1.02–1.15.
- **Reading:** Newsreader Variable — body, 19–21px, line-height 1.62, measure 60–68ch.
- **Interface:** Instrument Sans Variable — nav, labels, table headers, buttons.
- **Record:** IBM Plex Mono — times, codes, statuses, provenance, figure captions. Never used for long body copy.

**Rules**
- Maximum two type families visible in one composition.
- No all-caps mono eyebrows above every section. A chapter kicker appears once.
- Numbers are content: set times, altitudes, and serial numbers in mono with tabular figures.
- No text over a face, a document, or a money scan.
- On mobile, display drops to 12–14vw, never below 34px for a chapter title, never above 64px.

---

## Colour

| Source | Observation | Translation |
|---|---|---|
| Bromio | Burnt orange + black + newsprint, flat | Stamp red `#D63118`, ink `#141311`, newsprint `#F1EBDD` |
| 032c | Flat red as a structural band, not a glow | Red used for the cover band, the jump chapter, and evidence stamps |
| New Industrials | Colour field changes are the chapter structure | Six climates, each a full-bleed ground |
| NSS | Black/white as space, not "dark mode" | Night is a cold green-black `#101C1D`, used only for flight/jump |
| Dazed | One accent at the end of a long white page | Amber used for the money chapter and the closing status |
| POP UP SOCIETY | CMYK reference | Registration marks and cyan/magenta/yellow hairlines only on the map plate, never as a filter |
| Case material | Northwest Orient livery, FBI manila, newsprint, evergreen, river | Aviation blue, manila, evergreen, Columbia green, runway amber |

**Palette**

```css
--paper:       #f1ebdd; /* newsprint ground */
--paper-hi:    #faf7ef; /* clean reading page */
--manila:      #e5d6b8; /* case-file folder */
--ink:         #141311; /* warm black */
--ink-soft:    #4b463c;
--rule:        #c9bfa9;
--red:         #d63118; /* stamp / Northwest stripe */
--red-deep:    #9e2010;
--blue:        #1b3e8f; /* Northwest livery / flight */
--blue-deep:   #122a63;
--green:       #244c3a; /* evergreen / ground search */
--green-deep:  #173428;
--amber:       #e0a32e; /* runway light / money */
--night:       #101c1d; /* cold night, green-black */
--night-hi:    #1a2b2c;
--paper-on-dark: #ede6d6;
--muted-on-dark: #a8b5ad;
```

**Semantics**
- Red = the hijacking, the demand, the unresolved danger, a stamp. Never used for "wrong".
- Blue = flight, route, time, procedure.
- Green = ground, search, landscape, recovered money.
- Amber = money, measured quantity, "attention here".
- Grey = unknown, absent, unrecovered.
- Status is always a word plus a shape/pattern, never colour alone.

**Climates**

| Movement | Ground | Ink | Accent |
|---|---|---|---|
| Cover | photograph + newsprint panel | ink on paper | red |
| The Man | newsprint | ink | blue |
| The Hijack | manila | ink | red |
| Flight 305 / Ground | aviation blue | paper-on-dark | white rule, amber |
| The Jump | night | paper-on-dark | red |
| The Search | paper + evergreen map | ink | green |
| The Money | paper-hi + money scan | ink | amber/green |
| The Evidence | manila | ink | red stamp |
| The Named | paper | ink | blue |
| The Theories | blue-deep | paper-on-dark | red/amber |
| What Remains | paper → night close | ink → paper-on-dark | amber |

No gradients. No glass. No glow. No dark-purple.

---

## Image composition

| Source | Observation | Translation |
|---|---|---|
| 032c | Hard crops, edge-to-edge, image can be the whole page | 727 hero full-bleed; money scan full-bleed; crew photo full-bleed B&W |
| Dazed | One photograph, huge margins; nothing else competes | The Man chapter gives the composites room and no decorative frame |
| NSS | One lead portrait, then a strict grid | Cover artifact, then a comparison table — not a masonry of everything |
| New Industrials | Black-and-white image bands interrupt colour fields | Crew photo and airstair photo as monochrome bands between blue/night fields |
| POP UP SOCIETY | Diagrams are the image | 727 elevation and drop-zone map are first-class visuals, not illustrations |
| Bromio | Images bleed off the edge; captions are tiny | Evidence scans can crop at the frame; captions sit in the margin |

**Rules**
- Every image is either **evidence** (has provenance + status) or **environment** (has a caption and a place). No decorative image.
- No image inside a card. Frames are hairlines or full-bleed edges only.
- Faces are never used as a background for text.
- Documents are shown flat and readable; rotation ≤ 2° and only for physical objects, never for screenshots of text.
- AI reconstruction count: **0 new images**. Existing project diagrams (tie, airstair, money bundles) are labelled `PROJECT DIAGRAM` and used as diagrams, not photographs.
- Real archive inventory: 16 assets. Use all that earn their place; do not invent missing ones.

---

## Layout

| Source | Observation | Translation |
|---|---|---|
| New Industrials | Persistent hairline frame + registration ticks | 1px frame at 22px inset on desktop; 12px on mobile; ticks at corners |
| 032c | Strict grid, one violent break | 12-col grid; one element per chapter ignores it deliberately |
| Dazed | Narrow reading column, generous air | 62ch max; 96–160px vertical gaps |
| NSS | Lead + secondary grid | Each chapter has one lead, then a table/list |
| Bromio | Layout shifts with content | Chapters use different internal structures: split, ledger, map, table, matrix, stack |
| POP UP SOCIETY | Annotation around a diagram | Map and aircraft plates get margin notes and leader lines |

**Rules**
- Outer frame is continuous; chapter colour changes inside it.
- No two adjacent chapters share the same composition.
- Mobile is a separate edit: not a stack of desktop leftovers.
- No section is a card grid. Tables, ledgers, plates, maps, and full-bleed images replace cards.
- Whitespace is a beat: after every loud spread, one quiet column.

---

## Scroll

| Source | Observation | Translation |
|---|---|---|
| New Industrials | One continuous page; colour fields carry progression | Native scroll; chapter climates change at boundaries |
| Dazed | Reading scroll, no effects | Quiet chapters use normal document flow |
| 032c | Abrupt jumps between modes | Hard cuts between colour fields; no soft fade on every boundary |
| The Boat / Firestorm (prior research) | Environment-led opening | Cover is a full-viewport photographic field, title late |
| NSS | Collage → reading mode switch | The moment prose starts, the layout calms |

**Interaction model per chapter**
1. Cover — sticky photographic field; paper panel rises.
2. The Man — sticky composite plate; facts scroll past.
3. The Hijack — sticky note sheet; demands scroll.
4. Flight/Ground — static technical plate; dense ledger; full-bleed crew photo.
5. The Jump — pinned vertical altitude scale with three time marks; mostly empty.
6. The Search — sticky map on desktop; step list drives marker highlight; clickable places.
7. The Money — static full-bleed scan; proportional grid; horizontal evidence strip (scroll-snap).
8. Evidence — index table + focus-trapped drawer.
9. The Named — sortable/filterable table with expandable rows.
10. Theories — tablist + comparison matrix.
11. What Remains — static ledger → night close.

**Refusals:** scroll-jacking, smooth-scroll libraries, auto-advance, scroll-locked text, parallax on body copy, more than three pinned scenes.

---

## Interaction

| Source | Observation | Translation |
|---|---|---|
| 21st.dev | Tabs, drawers, focus traps, disclosure | Theory tablist; evidence drawer; suspect rows as buttons with `aria-expanded` |
| POP UP SOCIETY | Diagram as interface | Map markers are buttons with visible labels; the route is a real SVG path |
| New Industrials | Persistent frame labels | Current chapter, reading progress, and coordinates in the frame |
| NSS | Article mode switch | "Read the record" links open the source drawer rather than navigating away |

**Rules**
- Every interactive element has a visible focus ring (`2px` offset 3px, ink or paper).
- Hover is enhancement only; all information is available by click/tap/focus.
- No custom cursors.
- Sound is opt-in; the button says "Sound off" until enabled.
- Drawers close on Escape and return focus to the trigger.

---

## Motion

| Source | Observation | Translation |
|---|---|---|
| New Industrials | Colour transitions as pacing | Chapter ground changes are hard cuts, not 1s fades |
| 032c | Abrupt editorial cuts | Fast reveals: 240–420ms, `cubic-bezier(.22,1,.36,1)`; no bounce |
| Dazed | Stillness | Body copy never moves; images do not parallax |
| The Boat (prior research) | Motion tied to weather | The cover image pushes in 1.04 → 1.0 over the first viewport; then stops |
| Prior ENIGMA docs | Reduced-motion requirement | All scroll-linked transforms become static under `prefers-reduced-motion` |

**Rules**
- Motion must explain: a sticky plate stays while facts scroll; a map marker changes because the step changed.
- No entrance animation on every paragraph. One reveal per composition.
- No looping background video.
- No fake film grain, flicker, or glitch.
- Reduced motion: pins unpin, transforms off, opacity instant.

---

## Archival design

| Source | Observation | Translation |
|---|---|---|
| FBI Vault | Typewriter, stamps, manila, hole punches, redactions | Metadata set in IBM Plex Mono; status stamps; no fake redaction |
| Newspaper printing | Halftone dot, registration marks, column rules | Halftone only on the crew photo and only at large size; registration marks on the map plate |
| 1970s airline | Northwest Orient red/blue, ticket coupons, timetables | Ticket scan as a real object; blue/red as structural colours |
| Bromio | Print confidence without faux ageing | Clean paper colour, sharp scans, hairline rules; no torn edges or tape |

**Rules**
- Never fabricate a document, newspaper, or FBI form.
- Existing diagrams are labelled `PROJECT DIAGRAM — NOT A PHOTOGRAPH`.
- Every artifact shows: title, creator, date, licence, source.
- The 1980 money scan is the only colour image that gets a full-bleed hero; it earns it.

---

## Data visualisation

| Source | Observation | Translation |
|---|---|---|
| New Industrials | Small mono labels around a big number | `$200,000` / `$5,800` set as a proportion, not a dashboard |
| POP UP SOCIETY | Diagram + annotation | Drop-zone probability field and search grid drawn as a survey plate |
| NSS | Numbered pagination | Chapter index uses large numerals, not pills |
| 21st.dev | Comparison states | Theory matrix with supporting / conflicting / unknown cells |

**Visualisations to build**
1. **Ransom proportion:** 100×100 field, 2.9% filled; label 290 of 10,000 bills.
2. **Flight profile:** time / altitude / speed plot for 19:40–22:15, with the 20:13 trim change marked.
3. **Drop zone:** map with route, probability ellipse, rivers, places; no fake precision.
4. **Evidence matrix:** evidence × theory, supports/conflicts/unknown.
5. **Search ledger:** 200 soldiers, 36 days, 2 counties, 0 confirmed traces — as a typographic ledger.

**Rules**
- No invented percentages or confidence scores. Counts and labels only.
- Every axis and unit is labelled.
- Colour is redundant with text/shape.
- Data is readable at 390px without horizontal scroll.

---

## Material inventory (what the page can actually use)

**Genuine archive:** 727 N467US (1972), Flight 305 ticket, composites A/B, composite sheet, age progression, wanted poster, crew in cabin, crew at Reno, Tina Bar money, McCoy, Rackstraw, Cooper vane, 727 airstair, Lake Merwin aerial, representative 727.

**Project diagrams:** tie, money bundles, 727 aft stairs.

**Not available / not used:** any photograph of Cooper, any bomb, any used parachute, any night jump image, any 1971 Seattle street scene, any fake newspaper.

**Therefore:** the visual drama must come from typography, real artifacts, maps, diagrams, and colour — not from invented imagery.
