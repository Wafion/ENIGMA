# DB Cooper — art direction

**Working title:** *The Cooper File*  
**Format:** an interactive investigative documentary, art-directed as a 1970s field dossier re-set for the screen.  
**One-line thesis:** the case is not a mystery to be decorated; it is a file to be read, tested, and left open.

---

## 1. The problem with the previous edition

The old page was a dark dossier template: charcoal ground, amber hairlines, Instrument Serif, the same full-width map repeated, 49,800 pixels of downward scrolling, and a small set of real images padded with reconstructions. It read as one long article with cinematic veneers. It did not read as an investigation.

The redesign starts from a different premise: **the evidence is the visual design.** Real photographs, the ticket, the money scan, the sketches, the map, the aircraft diagram, and the record itself carry the page. Generated imagery is removed from the narrative. The only project-made visuals are diagrams, labelled as diagrams.

---

## 2. The concept — *a printed file under working light*

The page behaves like a case file that has been taken apart on a large table:

- **Newsprint** is the default ground. It is the colour of the newspaper that named him, the photocopy, the reading room.
- **Manila** is the folder. Evidence chapters sit on it.
- **Aviation blue** is the flight: timetables, route plates, altitude.
- **Night green-black** is the jump: cold, empty, not purple.
- **Evergreen** is the ground search: the Lewis River country.
- **Stamp red** is the hijacking and the unresolved. Used flat, like ink, never as a glow.
- **Runway amber** is money and measurement.

The frame of the page is continuous — a thin printed border with registration ticks — but the ground changes at every movement. That is the *New Industrials* lesson: one environment, changing climate. It is not a stack of templates.

No gradients. No glass. No 3D. No particles. No fake grain. No sci-fi HUD. No decorative reconstruction.

---

## 3. Visual identity

**Wordmark:** `ENIGMA` in Instrument Serif, small, roman, always in the top-left of the frame. No outline, no glow.

**Case mark:** `CASE 002 / NORJAK` in IBM Plex Mono, 10px, letterspaced 0.08em.

**Cover title:** `D.B. COOPER` in Anton, uppercase, cropped by the right edge, with `THE CASE THAT STAYED OPEN` beneath in Instrument Serif italic. The title is a printed cover, not a UI heading.

**Chapter numbering:** large Anton numerals set in the margin, not inside a badge. One numeral can be 180px; the title next to it can be 40px.

**Rules:** 1px hairlines in `--rule` on paper, `rgba(237,230,214,.22)` on dark. No shadows except a single soft shadow under the evidence drawer.

**Stamps:** status stamps are rectangular, 1px, rotated 0°, with a word (`CONFIRMED`, `REPORTED`, `DISPUTED`, `UNKNOWN`). No red/green badge rainbow. The word is the signal; colour is secondary.

---

## 4. Typography

| Role | Face | Size | Use |
|---|---|---|---|
| Poster | Anton | clamp(3.4rem, 9vw, 9.5rem) | Cover, chapter numerals, one verdict line |
| Display | Instrument Serif | clamp(2.2rem, 4.6vw, 4.8rem) | Chapter lede, quotes, pull lines |
| Reading | Newsreader Variable | 19–21px / 1.62 | Body, 60–68ch |
| Interface | Instrument Sans Variable | 11–15px | Nav, labels, table headers, buttons |
| Record | IBM Plex Mono | 9–12px | Timecodes, coordinates, status, provenance, captions |

**Hierarchy rules**
- One poster line per chapter, maximum.
- A chapter kicker appears once, 11px mono, with a rule; it is not repeated above every subsection.
- Times and figures use `font-variant-numeric: tabular-nums`.
- No type over a face or a document. If an image needs a title, the title sits beside it in its own field.
- Vertical type is used exactly once: the date `24 NOV 1971` on the cover, reading bottom-to-top along the left frame.
- No more than two families in one view. Mono is metadata, never body copy.

---

## 5. Colour system

```css
--paper:#f1ebdd; --paper-hi:#faf7ef; --manila:#e5d6b8;
--ink:#141311; --ink-soft:#4b463c; --rule:#c9bfa9;
--red:#d63118; --red-deep:#9e2010;
--red-text:#b02a12; --amber-text:#7a5200;
--blue:#1b3e8f; --blue-deep:#122a63;
--green:#244c3a; --green-deep:#173428;
--amber:#e0a32e;
--night:#101c1d; --night-hi:#1a2b2c;
--paper-on-dark:#ede6d6; --muted-on-dark:#a8b5ad;
```

**Meaning, not decoration**
- Red: the note, the threat, a stamp, the jump.
- Blue: flight, time, procedure, route.
- Green: ground, search, the river, the recovered money.
- Amber: quantity, money, a measured exception.
- Grey: absent, unrecovered, unknown.

**Text-only accents**
The stamp red (`#d63118`) and runway amber (`#e0a32e`) are for borders, fills and marks. When either colour carries words it switches to a darker text value, because the raw stamp red only reaches 4.1:1 on newsprint and 3.4:1 on manila. `--red-text` is `#b02a12` on paper (5.5:1) and `#ff8a70` inside blue/night/green climates (5.9:1 or better). `--amber-text` is `#7a5200` on paper (5.8:1) and the full `--amber` on dark. Paper inserts inside dark chapters reset both variables.

**Accessibility**
- Every status is a word + a border style; colour is redundant.
- Body text never sits on a photographic mid-tone. Scrims are solid colour fields, not gradients.
- Contrast targets: ink/paper ≥ 12:1; paper-on-dark/night ≥ 11:1; muted-on-dark/night ≥ 5:1.
- Automated audit: zero text below 4.5:1 at 1440 and 390, including the index, register, sound panel, asset viewer and every theory tab.

---

## 6. Composition engine

The page is not a section-builder that repeats one template. It is a set of **chapter grammars**, chosen by what the chapter has to explain.

| Grammar | Used for | Structure |
|---|---|---|
| **Cover field** | Prologue | Full-bleed photograph + paper label panel + one title + one line |
| **Sticky plate** | The Man | Sticky artifact column + scrolling fact ledger |
| **Annotated sheet** | The Hijack | A large note sheet, margin annotations, demand list |
| **Technical plate** | Flight 305 | Aircraft elevation on blue, callouts, fact table |
| **Ledger** | The Ground | Dense newspaper columns, four large stats, one full-bleed crew photo |
| **Vertical instrument** | The Jump | Pinned altitude scale, three time marks, one sentence of consequence |
| **Survey map** | The Search | Sticky SVG map + step narrative; markers and places are interactive |
| **Full-bleed evidence + proportion** | The Money | Money scan at full width, 100×100 bill field, horizontal evidence strip |
| **Index + drawer** | Evidence | Table of six artifacts; focus-trapped drawer for inspection |
| **Comparison table** | The Named | Sortable rows, expandable support/contradiction columns |
| **Tablist + matrix** | Theories | One theory at a time; full comparison matrix below |
| **Ledger → void** | What Remains | Known/unknown ledger, six questions, night close |

**Selection rules**
- If the content is a sequence, use a timeline or a sticky stage.
- If the content is a comparison, use a table or matrix.
- If the content is a place, use a map.
- If the content is a single object, use a full-bleed plate.
- If the content is a sentence, use type and silence.
- Never use a card grid for any of these.

**Rhythm**
LOUD (cover, hijack, money) → QUIET (the man, what remains) → DENSE (ground, evidence, suspects, theories) → ATMOSPHERIC (jump, search) → QUIET (close).

No two adjacent chapters share a ground or a grammar.

---

## 7. Chapter plan

### 00 — Cover / *The Man Who Was Not There*
Full-viewport 727 photograph, newsprint panel on the left with case marks and the title. A vertical date in the frame. One sentence: “A case file with one page missing.” Scroll cue is a thin rule, not a button. The paper panel rises over the image at the end of the first viewport to introduce the premise.

### 01 — The Man in Seat 18C
Newsprint. A sticky plate with both composite sketches (real FBI material) and the age progression, labelled as memory drawings, not portraits. Beside it, an eight-row descriptor ledger with statuses. The typographic event: **“THERE IS NO PHOTOGRAPH.”** in Anton, followed by the story of the name — Dan Cooper, D.B. Cooper, D. A. Cooper — set as a correction with a red rule. Quiet, wide margins, no decoration.

### 02 — The Note
Manila. The demand note is reconstructed typographically as a ruled sheet (wording quoted; the paper/handwriting explicitly labelled reconstruction). Red annotation circles only on the words *bomb* and *sit by me*. A briefcase diagram with eight red cylinders. The ticket scan as a real object at the left. Eight demands in a numbered column. Sticky note sheet on desktop, stacked on mobile.

### 03 — Flight 305 / Two Hours Over Puget Sound
Aviation blue field. A large 727 side elevation (existing project diagram) in white hairlines with callouts: aft airstair, seat 18C, T-tail. Aircraft facts in the margin. Then newsprint: the ransom ledger (10,000 × $20, 19 lb, 4 parachutes, 36 passengers), the crew photograph full-bleed B&W with a quote from Mucklow, and a 17:39–19:40 exchange timeline.

### 04 — The Jump
Night field. A pinned altitude instrument: 10,000 ft at the top, ground at the bottom, three marks (20:00 warning light, 20:11 oscillation, 20:13 trim change). The sentence **“No human being watched Cooper jump.”** in Instrument Serif. The real 1975 airstair photograph at the right, small, with a technical caption. The flight profile (time / altitude / speed) as a thin line plot. Almost no other content. This is the page's silence.

### 05 — The Search
Newsprint with an evergreen survey plate. A sticky SVG map of the Lewis River country: route V-23, calculated drop zone ellipse, Lake Merwin, Ariel, Heisson, Tina Bar. Three narrative steps change the highlighted marker and the note. Markers are keyboard buttons. Beneath: the Lake Merwin aerial photograph full-bleed, then a search ledger (200 soldiers, 36 days, 2 counties, 0 confirmed traces). A 2019 Heisson lead is labelled as a lead, not a solution.

### 06 — The Money at Tina Bar
Paper-white. The real 1980 money scan at full bleed. A 100×100 bill field with 2.9% marked; the label says 290 of 10,000 bills. A horizontal evidence strip (scroll-snap, with buttons): 1971 ransom → 1974 dredging → 1980 find → 2020 diatom study. Three interpretations are shown as a comparison, not a carousel. The visual event is the green of the decomposed bills against the paper.

### 07 — What Came Back / Evidence
Manila. The evidence index: six artifacts, each with code, title, status, one-line, and a drawer. Real assets only: ticket, money, airstair, composites, tie diagram, absence. The drawer shows the image, facts, limits, provenance, and “what it cannot prove.” A connection line at the bottom: evidence → inference → theory, with the same status language as the theories chapter. Absence is given a blank stamped plate: **NOT RECOVERED**.

### 08 — The Named
Newsprint. A comparison table of six suspects. Columns: name / age in 1971 / status / why named / outcome. Expandable rows show support and contradiction as two columns, with real portraits only where they exist (McCoy, Rackstraw). A filter: `All · Age match · Physical evidence · Official`. A caution line above the table: a suspect is not a solution.

### 09 — Four Ways to Disappear
Blue-deep. A tablist of four theories. The selected theory fills a spread: claim, why it exists, support, contradiction, unknowns, verdict, related evidence. Below, the matrix: four theories × six tests (age, parachute, money, body, sighting, ground support), cells marked supports/conflicts/unknown with text. No invented confidence percentages. The reader can compare all four at once; on mobile the matrix becomes four stacked comparisons.

### 10 — What Remains
Paper, then night. A ledger of what is known, reported, inferred, speculative, disputed, unknown — with definitions and counts. Six open questions set as a numbered list in large type. The epilogue: “The case did not end. It stopped being worked.” A full-bleed final image (Lake Merwin or the 727) and a stamp: **CASE SUSPENDED — NOT CLOSED**. Sources and asset register close the document.

---

## 8. Navigation and utilities

**Masthead (48px, paper strip, always visible):**
`ENIGMA` / `CASE 002 · NORJAK` / current chapter (fades on scroll) / `Index` / `Sources` / `Sound off` / progress rule.

The strip is deliberately printed, not translucent. It gives the eye a constant edge while the climate changes beneath it.

**Index:** a full-screen contents page on paper, 11 numbered chapters in a 2-column list, with climate swatches and status words. Not a drawer of pills.

**Sources:** a full-screen register on paper: sources by category, then the asset register with provenance. A search field and highlight-on-open. This is where the documentary's evidence claims are auditable.

**Asset drawer:** right-side, 560px, paper, focus-trapped. Image on top, metadata, description, usage, licence. Close on Escape, return focus.

**Sound:** opt-in only. A small popover with master/score/ambience volume and the current cue. No autoplay. Reduced motion does not mute automatically; it only removes motion.

---

## 9. Responsive strategy

Desktop is the primary immersive edit. Mobile is a separate composition, not a stack.

- **Cover:** image remains full-bleed; the paper panel becomes the bottom 55% of the screen; title 15vw; the date moves to a horizontal rule above the title.
- **The Man:** sticky plate becomes a horizontal, swipeable artifact strip above the descriptor list. Facts remain a list.
- **The Note:** note sheet full-width with a 12px margin; demands below; the briefcase diagram scales down and keeps its labels at 9px.
- **Flight/Ground:** 727 diagram rotates? No. It becomes a full-width elevation above the facts, with callouts repositioned. Crew photo full-bleed 4:5.
- **The Jump:** pinned instrument becomes a normal vertical scale; no pin. Time marks stack.
- **The Search:** map first, then steps; markers are large touch targets (44px); the detail panel sits below the map, not over it.
- **The Money:** money scan full-bleed; 100×100 field becomes 50×50 (same proportion, legible); evidence strip is a native horizontal scroll with snap.
- **Evidence:** table becomes a list of rows; the drawer becomes a full-screen sheet.
- **The Named:** table becomes stacked records with a sticky name and a disclosure.
- **Theories:** tabs become a select/segmented control; the matrix becomes four stacked cards with the same text labels.
- **What Remains:** ledger stacks; the close remains a full-screen night field.

Touch targets ≥ 44px. No hover-only information. No horizontal page scroll.

---

## 10. Motion

- Native scroll. No smooth-scroll library, no scroll-jacking.
- Three pinned scenes maximum: the cover push-in, the jump instrument, the search map. Everything else is normal flow.
- Reveals: opacity + 16px, 280–380ms, `cubic-bezier(.22,1,.36,1)`. One reveal per composition, not per paragraph.
- The cover image scales 1.05 → 1.0 over the first viewport, then stops.
- The jump map/instrument updates from scroll progress via a single rAF listener, no React re-render.
- Reduced motion: all pins unpin, transforms off, opacity instant, no autoplaying motion.

---

## 11. Performance and accessibility

- Hero images `fetchpriority=high`, everything else `loading=lazy`, `decoding=async`.
- Responsive derivatives for the four largest images (1600w and 900w JPEG q82) to replace 1.4–5.4MB originals.
- Explicit `width`/`height` on every image to prevent layout shift.
- Fonts self-hosted via `@fontsource`; only the weights used are imported.
- No canvas, no WebGL, no large JS animation loop. One scroll listener for progress and one IntersectionObserver for chapter state.
- Semantic landmarks, one `h1`, ordered headings, skip link, visible focus, `aria-expanded` on disclosures, `role=tablist` for theories, `aria-live` for the selected theory.
- Drawers: focus trap, Escape, restore focus, body scroll lock.
- Colour never carries meaning alone. All statuses have words. Map markers have text labels.
- `prefers-reduced-motion` respected.
- Alt text: descriptions for evidence; captions for environment. Decorative marks are `aria-hidden`.

---

## 12. Quality gate

Before shipping, answer:

- Does this look AI-generated? **No** — flat print palette, real artifacts, no gradients/glass/glow/3D.
- Is there an unnecessary reconstruction? **No** — zero new generated images; three existing diagrams clearly labelled.
- Is the same layout repeated? **No** — 11 distinct grammars, checked chapter by chapter.
- Is text overlapping without purpose? **No** — annotations sit in margins; no type over faces or documents.
- Is the page just scrolling downward? **No** — sticky plate, pinned jump instrument, sticky map, horizontal evidence strip, drawers, tabs, matrix.
- Is everything dark? **No** — newsprint is the default; night is used twice.
- Is every image a card? **No** — full-bleed, edge-aligned, sticky plates, open documents, no card grid.
- Does every animation have a purpose? **Yes** — explain space, time, or a state change; otherwise removed.
- Could a real artifact replace generated imagery? **Yes** — and it does.
- Does the design feel like an investigation? **Yes** — status language, evidence drawers, theory matrix, sources register.
