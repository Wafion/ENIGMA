# Motion plan — CASE 002 / NORJAK

A scroll-directed documentary cut. The existing visual layer, palette, type and
compositions stay. Motion is added as a second directorial layer.

## Motion hierarchy

| Level | Use | Examples |
| --- | --- | --- |
| **L1 · Micro** | UI state, hover, focus, tab feedback | theory tabs, suspect chevron, strip controls, citations, status chips |
| **L2 · Content** | Evidence and type entering a readable composition | chapter heads, ledger rows, figures, margins, statistics, chain steps |
| **L3 · Scene** | A held composition whose state changes with scroll | note pull-back, jump descent, search map camera, money bill field, horizontal evidence strip |
| **L4 · Climax** | Reserved for the strongest narrative moments | cover title + photo, flight trajectory pin, search camera, Tina Bar money, the suspended stamp |

Nothing in the body prose moves. L4 is used four times.

## Reusable primitives

Implemented in `edition/motion.tsx` and composed per chapter:

- `ScrollScene` — a trigger + scrubbed timeline with an explicit start/end state.
- `PinnedScene` — desktop pin with cleanup and a mobile fallback.
- `HorizontalSequence` — vertical scroll drives lateral track translation.
- `CameraReveal` — scale/translate a plate so context enters the frame.
- `EvidenceReveal` — masked entry + annotation sequencing for a document or object.
- `ImageSequence` — staged image entries with different crop/scale behaviour.
- `DocumentFocus` — close crop → pull-back → annotations → release.
- `MapJourney` — animated viewBox with synchronised labels and overview focus.
- `TimelineScrub` — scroll progress mapped to a time scale or altitude marker.
- `KineticHeadline` — masked line reveal; only headings and statements.
- `ChapterTransition` — head rule, kicker, number and title choreography.
- `DepthLayer` — folio and plate parallax at a different rate from content.
- `PerspectiveShift` — 2.5D scale/rotation used sparingly (stamp, viewfinder).

## Chapter score

### 00 · Cover — *the file is placed on the desk*
- Load: metadata row drops in, title rises through a clip mask, subtitle and opening settle.
- Photo wipes up from the bottom edge, then the plate slowly pushes in on scroll.
- Foot ledger and "Read the file" enter last.
- Scroll: photo push + slight upward drift of the top block. No pin.

### 01 · The Man — *the viewfinder*
- The composite drawings are masked in from the plate edge.
- Desktop: a red viewfinder travels between Composite A → Composite B → the age projection
  as the chapter scrolls, with a changing label. It is an identification frame that never
  finds an identification.
- "There is no photograph." is wiped in from the left.
- Ledger rows, clothing list and quote annotate in sequence.

### 02 · The Note — *document focus*
- Sheet starts slightly enlarged and close; scroll pulls the camera back to the full sheet.
- The two reconstructed words underline in sequence.
- Stamp, annotations and ticket enter as the sheet releases.
- Demands step down the right column; briefcase diagram draws itself.

### 03 · Flight — *the long tracking move*
- Aircraft diagram draws in stroke order, callouts annotate.
- New diagrammatic trajectory scene: the route draws from PDX to SEA to the southbound leg.
  A plane marker follows the drawn path. The clock advances through 14:50 → 20:13 as scroll
  progresses. Events appear at their point on the route; the jump line drops in red.
- Desktop pins the trajectory for the length of the tracking move; mobile draws it on entry.
- Crew photograph pulls back from a crop into its full frame.

### 04 · The Jump — *the inferred descent*
- Existing sticky chapter becomes a scrubbed scene.
- Altitude marker travels the scale; 20:00, 20:11 and 20:13 marks activate in sequence.
- Profile diagram draws the aircraft line, then the uncertain drop line.
- Stairwell plate pushes in; "No human being watched Cooper jump" is wiped in at the end.
- Scroll reverses the inference.

### 05 · The Search — *expanding geography*
- Map camera starts wide, tightens onto the airway, pans to the Ariel field, then to Tina Bar.
- The overview inset's focus rectangle tracks the real camera.
- Detail panel follows the camera through route → field → river.
- Notes and statistics annotate beside the held map; aerial photograph pulls back at the end.
- Clicking a place still works; scroll resumes control after the interaction.

### 06 · The Money — *the return of 2.9%*
- Lab scan starts cropped and pulls back to the full evidence photograph.
- Bill field populates packet by packet with a centre-out stagger.
- Interpretations enter as three separate readings, not a carousel.
- Desktop: evidence strip becomes a pinned horizontal sequence driven by vertical scroll.
  Mobile: native horizontal scroll with snap.

### 07 · Evidence — *the file opens*
- Rows enter like filed cards from the margin, staggered but restrained.
- The evidence → inference → theory chain is scrubbed: each step activates and the arrows
  advance only as the reader reaches them.
- Closing note enters with a large but quiet line.

### 08 · The Named — *comparison*
- Rows enter once; filtering uses Flip so surviving rows physically re-layout instead of
  disappearing and reappearing.
- New rows enter, removed rows leave, the empty "no physical evidence" state arrives as the
  argument, not as an error.
- Expanding a file animates the detail block open.

### 09 · Theories — *four ways to disappear*
- Tab changes use a masked panel wipe, with the number, claim and three columns staging in.
- The selected theory's matrix row is highlighted, linking the reading to the comparison.
- Matrix rows annotate in on scroll; no cell-level animation.

### 10 · What Remains — *the open file*
- Status ledger counts up to the number of uses per label.
- Six questions enter slowly, one pair at a time, with negative space preserved.
- Epilogue title masks in; the "Case suspended — not closed" stamp drops and settles.
- The Cooper vane pulls back from a crop to the full plate.

### Register
- Sources and assets enter as low-amplitude filed rows. No scene motion.

## Transitions between chapters

- The chapter folio is a depth layer: it drifts at a slower rate than the content.
- Each chapter head is a cut with its own grammar (kicker → number → masked title → lede),
  not a global fade.
- Colour climate changes remain hard cuts. They are part of the dossier identity and are not
  softened with gradients or overlays.

## Performance and access

- Animate `transform`, `opacity`, `clip-path` and SVG stroke only. No width/height animation
  except the single absolute viewfinder and the pinned track measurement.
- All scenes built inside `gsap.matchMedia()` and `useGSAP()` so cleanup is automatic on
  unmount and on a reduced-motion change.
- Desktop pins: flight trajectory, money strip. The jump keeps its existing sticky pin.
  Everything else uses native sticky + scrub.
- Mobile: no pinning; camera moves collapse to static diagrams with staged reveals.
- `prefers-reduced-motion` and the in-page motion switch: no GSAP setup, no hidden content;
  all pinned CSS falls back to static flow.
- `ScrollTrigger.refresh()` after fonts, window load, late image loads and a short settle
  timer.
