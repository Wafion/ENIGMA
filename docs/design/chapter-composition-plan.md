# Chapter composition plan — as built

**Status:** implemented. This document describes the compositions that shipped, not an earlier proposal. Where the implementation omits a data element, that is recorded.

**Governing rule:** each chapter must do a different job, and its form must follow that job. The essay has seven chapters; it does not have seven versions of one layout.

---

## 1. Rhythm of the whole

| Movement | Reader's mode | Dominant surface | Pace |
|---|---|---|---|
| Prologue | Arrival | Photograph + film quotation | Slow, pinned |
| 01 The Legend | Reading a constructed history | Warm charcoal, paper objects | Horizontal, then still |
| 02 The Town | Looking at real ground | Daylight photography, map | Wide, geographic |
| 03 The Expedition | Following a day log | Portraits, list, bulletin | Serial, accumulating |
| 04 The Woods | Standing in the set | Canopy, mill, character field | Pinned, then quiet |
| 05 The Recordings | Examining two formats | Near-black study, SVG frames | Analytical, interface-like |
| 06 The Real Story | Reading production history | Clean charcoal, diagram, timeline | Journalistic |
| 07 What Remains | Closing the case | Museum grey, ledger, lake | Still |

The transitions are **climate changes**, not wipes. The ground shifts; the reader keeps scrolling.

---

## 2. Chapter 01 — The Legend of the Black Hills

**Truth layer:** in-universe mythology, constructed 1998–1999.  
**Job:** show that the legend is a designed chronology, not a regional memory.

### Composition

1. **Split opening.** Huge `01` watermark, title left, introduction and fictional-chapbook epigraph right. Kicker: “In-universe mythology · constructed 1998–1999”.
2. **Reading layout with margin note.** The first text block sits in the main column; the margin says every event on the page belongs to the story world and that none of it happened in Burkittsville.
3. **Horizontal chronology.** Four panels (1785, 1825, 1886, 1941) plus an end panel (“≈ 55 years between each return”). Desktop: pinned horizontal track. Mobile: stacked list. Each panel is labelled “In-universe chronology”.
4. **Document object i — the 1809 chapbook.** Vitrine plate on the left, copy and transcript on the right. Caption: “Reconstruction. A physical prop made for a 1999 television broadcast, not a historical document.”
5. **Standalone quote.** Rustin Parr's “I'm finally finished.” Large serif, attribution names him as a fictional hermit, footer says “in-universe mythology”.
6. **Second reading + record note.** The margin note states that no colonial township called Blair appears in Maryland records and that Burkittsville was laid out in 1824.
7. **Document objects ii and iii.** Coffin Rock (reversed) and the Parr cellar plan. Both reconstructed, both captioned.

### Why this shape

The chronology is the chapter's argument: the fiction works by interval. Four cards would have flattened it into a list; a horizontal sequence makes the recurrence spatial. The three document objects are not a gallery — they are the three props that give the fiction its false bibliography, geography and architecture.

### Mobile

- Opening stacks; the `01` watermark stays behind the title.
- Chronology becomes a vertical list with hairline separators. No horizontal scroll, no pin.
- Document objects stack plate → copy. The reversed object resets to plate first.
- Quote remains large but drops to a readable measure.

### Reduced motion

No chronology pin, no horizontal transform. The track is a stacked/visible sequence. Document objects are static.

### Data used

`el-01-text-1`, `el-01-text-2`, `el-01-text-3`, `el-01-quote-parr`, `el-01-doc-1809`, `el-01-doc-coffin`, `el-01-doc-parr`.  
The four-date panels are authored in `ChapterOne.tsx`, condensed from the chapter text.

---

## 3. Chapter 02 — The Town Below South Mountain

**Truth layer:** verified historical fact.  
**Job:** replace the fictional “Blair” with the real Burkittsville and the real production triangle.

### Composition

1. **Right-aligned opening.** `02` watermark; kicker “Verified history · Frederick County, Maryland”; the 1975 National Register epigraph in the aside.
2. **Full-bleed Main Street.** The 1829 church and the street occupy the frame. Caption notes the 1862 field hospital and that the town has no colonial witch-trial history.
3. **Wide reading layout.** Main text plus a margin note: “Burkittsville is roughly 150 people, a church spire, brick houses, a cemetery and a mountain. The film needed the name; it did not need the place.”
4. **Map plate.** 1858 survey / 1861 relief switch. Four markers: Burkittsville, the cemetery, Seneca Creek/Black Rock Mill, Patapsco/Griggs House. Each marker shows “In the story” and “On the ground”, coordinates, and a linked asset. The map can zoom; the list is the accessible version.
5. **Town pair.** Cemetery and town-centre photographs, offset, with captions about the 1999 grave damage and the National Register listing.
6. **Town statement.** A single large line: the village's defining violence was the September 1862 battle, not a witch.

### Why this shape

This is the essay's daylight chapter. It must feel like a place, not a dossier. The map is the only “interactive exhibit” and it is framed as ground, not a GIS app.

### Mobile

- Opening stacks.
- Main Street figure keeps a tall crop; the caption sits below, not over the image.
- Map plate: the stage remains usable, the marker list becomes the primary selector, zoom controls stay reachable. Markers are tap targets, not hover cards.
- Town pair stacks; the offset is removed.

### Reduced motion

No map animation exists to disable. The plate is static until the reader chooses a marker or a map edition.

### Data used

`el-02-text-1`, `el-02-map-1`, and the two image elements. The chapter also places `img-burkittsville-cemetery`, `img-burkittsville-center`, `img-burkittsville-main`, `img-loc-frederick-1858`, `img-loc-frederick-1861`.  
**Omitted:** `el-02-ascii-cemetery`. ASCII is not used in the town chapter. The cemetery is shown as a photograph.

---

## 4. Chapter 03 — October 1994: The Student Expedition

**Truth layer:** in-universe chronology.  
**Job:** make the fictional disappearance concrete, then show the living actors beside it.

### Composition

1. **Quote opening.** `03` watermark, title, then the 1999 title card as a large opening quotation with its film attribution.
2. **Narrow reading.** One text block, no margin note, so the fictional chronology has room.
3. **Cast triptych.** Three contemporary portraits — Heather Donahue, Joshua Leonard, Michael C. Williams — with a header that says these are actors, alive, using their real names. Captions separate the actor from the fictional role.
4. **Seven-day expedition log.** Numbered 01–07, each with date, title and body. Header: “The dates below belong to the story world. The real shoot happened three years later, over eight days in October 1997.”
5. **Document object iv — the MISSING bulletin.** Reversed vitrine plate. Caption names it as a typographic reconstruction of a 1999 promotional flyer, not a police document.
6. **Audio cue.** Footsteps on dry leaves, labelled “Sound design · project original”. Play is optional.

### Why this shape

The chapter has to hold two things at once: the fictional day log and the real actors. The cast triptych is the hinge. The log is serial because the fiction is serial; the portraits are a triptych because the casting decision is the argument.

### Mobile

- Cast triptych becomes a single column; the third portrait no longer sits in a second column.
- Expedition log keeps its numbers but tightens the date column.
- Document object stacks; the plate stays first.
- Audio cue stacks its button below the copy.

### Reduced motion

No pinned scene. The only motion is the standard reveal, removed under reduced motion.

### Data used

`el-03-text-1`, `el-03-doc-missing`, `el-03-img-heather`, `el-03-img-josh`, `el-03-img-mike`, `el-03-cue-footsteps`.  
The seven-day log is authored in `content.ts` (`EXPEDITION_DAYS`).

---

## 5. Chapter 04 — The Woods: An Unstable Geometry

**Truth layer:** production and marketing record.  
**Job:** put the reader in the actual production forest and show that the labyrinth was administered.

### Composition

1. **Pinned woods camera.** Full-viewport canopy photograph, scale 1.12 → 1.01 over `+=125%`, title fades at 55%. Caption: “Contemporary photograph, 2022. Not a production still. The film's forest was staged in this park, not in the fictional Black Hills.”
2. **Wide reading.** Main text plus a margin note on the 6,300-acre park, the GPS receiver, the milk crate and the camera.
3. **ASCII comparison.** One user-controlled split between the Seneca Creek photograph and a character field. Copy: “A single comparison, not a filter for the whole film. The character field translates luminance; it does not recover detail the photograph does not contain.”
4. **Black Rock Mill feature.** Tall mill photograph beside copy about the 1815 structure and its role as a crossing/marker. Photo credit in the copy.
5. **Night field.** A dark section on the directors' method — snapping deadwood, shaking the tent, concealed speakers — with the branch-snap audio cue labelled as project-original sound design.
6. **Forest footer.** Full-bleed Patapsco rock trail, captioned as terrain characteristic of the cairn motif, not the film's forest.

### Why this shape

This is the chapter where the photograph should be the set. The pin is the only sustained camera in the body of the essay. The ASCII comparison is deliberately singular: one technique, one place, user-controlled.

### Mobile

- No pin. The canopy is a static full-bleed frame.
- ASCII comparison stacks the stage above the range control; the labels “Optical” and “Symbolic” remain.
- Mill feature stacks image above copy.
- Night field keeps its dark ground but drops the overlay atmosphere.

### Reduced motion

No woods pin. The canopy is the final crop. ASCII still renders on load, but there is no scrub; the reader can move the range.

### Data used

`el-04-text-1`, `el-04-ascii-forest` (replaced by the `img-seneca-creek-woods` comparison), `el-04-img-mill`, `el-04-img-rock-trail`, `el-04-cue-branch`.  
**Omitted:** the data's `ascii-visual` asset is the canopy; the rendered comparison uses the woods photograph so the reader sees the same image they saw in the prologue.

---

## 6. Chapter 05 — The Recordings: 16mm Celluloid & Hi8 Tape

**Truth layer:** production and marketing record.  
**Job:** explain the dual-format grammar without showing a single copyrighted frame.

### Composition

1. **Tape opening.** Title left, introduction, two large gauge labels (“16mm”, “Hi8”) as a quiet graphic, and an editorial epigraph about the tent confession.
2. **Recording study.** A procedural SVG viewer with five sequences. Each sequence has a reel code, timecodes, fictional date, real shoot date, real location, production note and reconstructed transcript. The frame prints “PROCEDURAL RECONSTRUCTION — NOT A FILM FRAME”. The transcript carries an explicit disclaimer.
3. **Camera object.** A representative Hi8 camcorder photograph beside copy about the $400 Circuit City purchase and refund. Caption says it is not the exact unit.
4. **Document object v — the excavation log.** Reversed vitrine plate; the in-universe 1995 framing device.
5. **Tape close.** “A dropped camera cannot establish what it did not see.”

### Why this shape

The chapter is the essay's most interface-like moment, and that is appropriate: it is about two recording formats. But the interface is a study, not a player. The reader selects a sequence; the frame is a diagram; the transcript is labelled as a reconstruction.

### Mobile

- The five-sequence list becomes a horizontal snap strip above the viewer, so the reader does not scroll past a tall vertical list to reach the frame.
- The viewer keeps its 16:9 frame; timecodes remain legible.
- Metadata stacks under the frame.
- Transcript lines keep the timecode column but wrap the speaker/line block.

### Reduced motion

No motion in the study. The selection is a state change, not an animation. The scan line overlay is static (and decorative).

### Data used

`el-05-recording-deck`, `el-05-doc-excavation`, `el-05-img-camcorder`.  
The deck's five segments come from the data. The SVG geometry is authored in `RecordingStudy.tsx`.

---

## 7. Chapter 06 — The Real Story: Method Filmmaking & the 1999 Internet Mirage

**Truth layer:** production and marketing record.  
**Job:** explain the method and the historical window, without turning the case into a wiki.

### Composition

1. **Production opening.** `06` watermark, kicker “Production and media history”, title and introduction, plus the editorial-synthesis epigraph explicitly marked “not a direct quotation”.
2. **Production figures.** Four large numbers: 8 days, ≈20 hours, $35–60k, $248.6m. Each with a label and a qualifying note.
3. **Production story.** Main text beside Daniel Myrick's portrait. The portrait is a contemporary photograph; the caption credits it.
4. **Method diagram.** An SVG route with six waypoints, a milk crate, a bicycle flag and a sealed canister. Three steps: waypoint, note, crew watches. It is a diagram, not a map of real coordinates.
5. **Website artifact.** A reconstructed 1998 BlairWitch.com page: browser bar, headline, “recovered” inventory, stamp. Copy says it is a reconstruction of editorial framing, not a screenshot; the Internet Archive holds the original.
6. **Dual timeline.** Ten items, filterable by “Both / Invented / Documented”. Each item has a date, title, summary, verification note and source.
7. **Production close.** The unrepeatable 1999 window: a web with library authority and no mass fact-checking.

### Why this shape

The chapter has the most explanatory load. It uses a magazine “figures” band, a portrait, a diagram, a reconstructed artifact and a timeline — five different forms, each doing a different job. The timeline is the only place where the two layers are directly comparable.

### Mobile

- Figures become a two-column grid at 600px and a single column below.
- Portrait stacks below the text.
- Diagram stays horizontal but scales; labels remain readable.
- Website artifact becomes a single column inside the browser frame.
- Timeline stacks the two tracks; the filter remains above them.
- Fact-ledger rows (Chapter 07) use the same stacking logic.

### Reduced motion

No pinned scene. The timeline filter is a state change.

### Data used

`el-06-text-1`, `el-06-img-myrick`, `el-06-timeline-dual` (10 items).  
Production figures are authored in `content.ts`.

---

## 8. Chapter 07 — What Remains: Aftermath in the Quiet Archive

**Truth layer:** critical synthesis.  
**Job:** close the argument, state the record, and leave the reader in the quiet place.

### Composition

1. **Remains opening.** Kicker “Epilogue · critical synthesis”; title; dek; the curatorial epigraph attributed to “Curatorial conclusion · ENIGMA”.
2. **Wide reading.** Main text plus a margin note: the Griggs House is gone; the town remains; the film remains; the myth belongs to the people who retell it.
3. **Patapsco bleed.** Stonework in Patapsco Valley State Park, captioned as the park that held the Griggs House until its December 1999 demolition.
4. **Fact ledger.** Six rows: topic, in-universe claim, documented record, source. A typographic table, not a card grid.
5. **Remains close.** A tall lake photograph beside the closing copy — “The woods are still there. They do not know the names.” — and a button to the source/asset register.
6. **Reading settings.** A reduced-motion switch at the end, with a sentence explaining the system preference.

### Why this shape

The essay ends in a museum room, not a dashboard. The ledger is the argument's spine; the lake is the release. The final control is a reading setting, not a call to action.

### Mobile

- Opening stacks.
- Patapsco bleed keeps a tall crop.
- Fact ledger rows become stacked definition pairs: claim, label, record, label, source.
- Remains close stacks image above copy.
- Reading settings stack the label and switch.

### Reduced motion

The closing image is static in every mode. The switch reflects the current state and removes pins when toggled.

### Data used

`el-07-text-1`, `el-07-img-patapsco`, `el-07-matrix` (6 rows).  
**Omitted:** `el-07-ascii-epilogue`. The lake is a photograph, not a glyph dissolve. The essay ends on water and timber, not on characters.

---

## 9. What is shared across chapters

- **Masthead:** wordmark, current movement, Sound, Index, Sources. No classification badges.
- **Chapter rail:** numbers plus an active rule. Labels appear on hover/focus on desktop only. Mobile uses the Index sheet.
- **Source references:** inline `[SRC-XX]` buttons open the register at the cited source. Focus is restored when the drawer closes.
- **Provenance:** every figure opens an asset dialog with creator, date, licence, use and the original record link.
- **Reconstructions:** first caption line starts with “Reconstruction.” The asset dialog says the same.
- **Reduced motion:** every chapter has a static, readable end state.
- **No horizontal overflow:** tested at 320, 375, 390, 430, 1280 and 1440.

---

## 10. Integration rules for future edits

1. **Do not add a second ASCII section.** The technique is a single comparison in Chapter 04 and a procedural substitute in Chapter 05. It is not a skin.
2. **Do not turn the fact ledger into cards.** It is a table; on mobile it becomes definition pairs, not seven bordered tiles.
3. **Do not add a fourth pin.** Three pins is already the ceiling for one essay.
4. **Do not put a quotation in quotation marks without a real source.** Editorial synthesis is attributed as “Curatorial conclusion · ENIGMA” or “Editorial synthesis · ENIGMA”.
5. **Do not present a reconstruction as a document.** The caption rule is invariant.
6. **Do not let the chapter openings become identical.** If a new chapter is added, give it its own opening skeleton and its own job.
7. **Keep the mobile edit separate.** Do not “fix” mobile by shrinking the desktop composition.
8. **Re-run the QA in `docs/implementation/final-report.md` after any layout change.** The screenshots are evidence, not decoration.
