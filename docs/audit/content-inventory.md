# Content inventory — Case 001

**Audited:** 4 November 2026  
**Source of truth:** `src/data/blairWitchCase.ts`, `src/data/blairWitchAssets.ts`, `src/types/enigma.ts`, and the rendered chapter components in `src/experience/components/`.

This inventory separates what the case **owns as data** from what the essay **renders around it**. The new experience does not display the data model as a dashboard; several data elements are deliberately replaced by authored compositions (chronology, day log, map, ledger, timeline, recording study).

---

## 1. Editorial layers

Every content block belongs to one of four layers. The layer must be legible from plain-language copy, not from a colour chip.

| Layer | Meaning in this essay | Where it appears |
|---|---|---|
| **In-universe mythology** | Invented by Haxan Films / the 1998–1999 website and mockumentary. Never presented as Maryland history. | Chapter 01, the 1994 expedition, the recording transcript, the reconstructed props |
| **Verified historical fact** | Maryland geography, the 1824 town, the 1858/1861 surveys, the Civil War, the National Register record | Chapter 02, the map plate, the fact ledger |
| **Production and marketing record** | The 1997 shoot, the two camera formats, the GPS method, BlairWitch.com, Sundance, the box office | Chapters 04–07, the dual timeline |
| **Critical synthesis** | ENIGMA's own editorial judgement, including the closing argument and the epilogue epigraph | Chapter 07, selected epigraphs, captions |

Chapter-level `truthLayer` in the data:

| Chapter | Data truth layer | Reader-facing line |
|---|---|---|
| 01 The Legend of the Black Hills | `IN-UNIVERSE MYTHOLOGY` | “In-universe mythology · constructed 1998–1999” |
| 02 The Town Below South Mountain | `VERIFIED HISTORICAL FACT` | “Verified history · Frederick County, Maryland” |
| 03 October 1994: The Student Expedition | `IN-UNIVERSE MYTHOLOGY` | “In-universe chronology · October 1994” |
| 04 The Woods: An Unstable Geometry | `PRODUCTION & MARKETING RECORD` | “Production landscape · Seneca Creek State Park” |
| 05 The Recordings: 16mm & Hi8 | `PRODUCTION & MARKETING RECORD` | “Production record · October 1997” |
| 06 The Real Story | `PRODUCTION & MARKETING RECORD` | “Production and media history” |
| 07 What Remains | `CRITICAL SYNTHESIS` | “Epilogue · critical synthesis” |

The prologue is not a data chapter. It combines a contemporary photograph with the 1999 film's opening title card, explicitly labelled as film text.

---

## 2. Chapter inventory

Counts are for the typed case data. “Rendered additions” are authored in `src/experience` and are not part of the data model.

| # | Chapter | Scenes | Compositions | Elements | Rendered additions | Primary sources |
|---|---|---:|---:|---:|---|---|
| 00 | Prologue — The Forest | — | — | — | Photographic camera, film quotation, title, sound note | Film title card; `img-seneca-creek-woods` |
| 01 | The Legend of the Black Hills | 2 | 3 | 7 (3 text, 1 quote, 3 document) | Four-date horizontal chronology, margin labels, three vitrine objects | SRC-03, SRC-04, SRC-05 |
| 02 | The Town Below South Mountain | 1 | 3 | 5 (1 text, 2 image, 1 map, 1 ASCII) | Full-bleed Main Street, map plate, cemetery/town pair, 1862 statement | SRC-01, SRC-02, SRC-07 |
| 03 | October 1994: The Student Expedition | 1 | 2 | 6 (1 text, 3 image, 1 document, 1 audio cue) | Cast triptych, seven-day expedition log, reconstructed MISSING bulletin | SRC-03, SRC-04, SRC-06 |
| 04 | The Woods: An Unstable Geometry | 1 | 3 | 5 (1 text, 2 image, 1 ASCII, 1 audio cue) | Pinned woods camera, single ASCII comparison, Black Rock Mill feature, night perimeter | SRC-03, SRC-07 |
| 05 | The Recordings: 16mm & Hi8 | 1 | 2 | 3 (1 recording deck, 1 document, 1 image) | Five-sequence procedural recording study, reconstructed-transcript disclaimer, Hi8 object | SRC-03, SRC-05 |
| 06 | The Real Story | 1 | 2 | 3 (1 text, 1 image, 1 timeline) | Production figures, GPS method diagram, reconstructed website artifact, dual timeline | SRC-03, SRC-04, SRC-06 |
| 07 | What Remains | 1 | 2 | 4 (1 text, 1 image, 1 matrix, 1 ASCII) | Six-row fact ledger, closing lake photograph, reading-settings control | SRC-01, SRC-03, SRC-04, SRC-06, SRC-07 |

**Totals:** 7 chapters, 8 scenes, 17 compositions, 33 typed elements.

### Element totals

| Type | Count | Where |
|---|---:|---|
| `text` | 8 | Chapters 01–04, 06, 07 |
| `quote` | 1 | Chapter 01 (Rustin Parr) |
| `image` | 10 | Chapters 02–07 |
| `document` | 5 | Chapters 01, 03, 05 |
| `map` | 1 | Chapter 02 |
| `timeline` | 1 | Chapter 06 (10 items) |
| `audio-cue` | 2 | Chapters 03, 04 |
| `recording-deck` | 1 | Chapter 05 (5 segments) |
| `fact-fiction-matrix` | 1 | Chapter 07 (6 rows) |
| `ascii-visual` | 3 | Chapters 02, 04, 07 — only Chapter 04 is rendered |

Two `ascii-visual` elements (Chapter 02 cemetery; Chapter 07 lake) remain in the data but are not rendered. The ASCII technique is deliberately limited to one user-controlled comparison in Chapter 04. The lake is rendered as a photograph instead of a glyph dissolve.

---

## 3. Prologue copy

| Block | Copy | Provenance |
|---|---|---|
| Kicker | “Case 001 · A documentary in eight movements” | ENIGMA editorial framing. “Case 001” is a publication device, not an in-universe police file. |
| Title | **The Blair Witch** / *Incident* | ENIGMA editorial title. The film is always cited as *The Blair Witch Project* (1999) in body copy and captions. |
| Dek | “How a folklore was built, sold as a record, and filmed in real Maryland woods.” | Editorial synthesis. |
| Quotation | “In October of 1994, three student filmmakers disappeared in the woods near Burkittsville, Maryland while shooting a documentary. A year later their footage was found.” | Opening title card, *The Blair Witch Project* (Haxan Films, 1999). Caption: “Film text, not a historical record.” |
| Location | Seneca Creek State Park · Montgomery County, Maryland · Contemporary location photograph, 2022 | `img-seneca-creek-woods`, randomduck, CC BY-SA 2.0. Not a 1997 production still. |
| End note | “18 min · sound optional · no autoplay” | Reading-time field (`readingTimeMinutes: 18`); sound is consent-gated. |

The quotation is not paraphrased while attributed. It is the film's marketing text, and the caption says so.

---

## 4. Chapter copy and provenance decisions

### Chapter 01 — The Legend

- Three text blocks and one Parr quote carry the invented 1785–1941 chronology.
- The four-date chronology (1785, 1825, 1886, 1941) is authored in `ChapterOne.tsx` from the chapter text. Every panel is labelled “In-universe chronology”.
- The 1809 chapbook, Coffin Rock plate, and Parr cellar plan are **project-original reconstructions**, captioned “Reconstruction. A physical prop made for a 1999 television broadcast, not a historical document.”
- The chapter's epigraph is attributed to the fictional 1809 chapbook. It is inside quotation marks because it is in-universe text, and the attribution names it as fictional.
- Two margin notes tell the reader what the layer is before the chronology begins and what the Maryland record actually shows afterwards.

### Chapter 02 — The Town

- The epigraph is a real 1975 National Register quotation.
- Main Street, cemetery and town-centre photographs are modern contextual photography, credited in the caption.
- The map plate exposes two Library of Congress maps and four markers. Each marker has an “In the story” and “On the ground” field, so the production triangle is not mistaken for colonial geography.
- The town statement corrects the supernatural frame with the September 1862 battle at Crampton's Gap.

### Chapter 03 — The Expedition

- The epigraph is the film's opening title card again, now in the chapter about the fictional disappearance.
- The cast triptych explicitly says these are contemporary portraits, not film stills, and that the actors are alive.
- The seven-day log is derived from the in-universe chronology. Its header says the dates belong to the story world and that the real shoot happened three years later.
- The MISSING bulletin is a typographic reconstruction of a 1999 promotional flyer, not a police document. The object caption says so.

### Chapter 04 — The Woods

- The chapter is production record, not lore. The hero caption says the 2022 photograph is not a production still and that the forest was staged in Seneca Creek State Park.
- The ASCII comparison is one optical event, user-controlled. Its copy says it translates luminance and does not recover detail.
- The Black Rock Mill feature names the real 1815 structure and its 2006 photographer.
- The night-perimeter section describes the directors' method without presenting the audio cue as recovered sound.

### Chapter 05 — The Recordings

- The recording study is an original geometric diagram of five sequences. Every frame is labelled “PROCEDURAL RECONSTRUCTION — NOT A FILM FRAME”.
- The transcript is labelled “Reconstructed transcript”, with an explicit note: not verbatim subtitles, recovered audio, or a substitute for the film.
- The Hi8 camera is a representative 1990s model, not the exact unit. The caption says so.
- The excavation log is a reconstruction of the in-universe 1995 framing device.

### Chapter 06 — The Real Story

- The epigraph is an editorial synthesis of the marketing strategy and is attributed as “not a direct quotation”.
- Production figures: 8 days, ≈20 hours of raw footage, $35–60k initial budget, $248.6m worldwide gross. Each carries a short note.
- The GPS diagram is a diagram, not a map of real waypoints.
- The BlairWitch.com panel is explicitly a reconstruction of editorial framing, not a screenshot. The original is held by the Internet Archive.
- The dual timeline separates “Invented chronology” from “Documented chronology” and lets the reader filter either.

### Chapter 07 — What Remains

- The epigraph is a curatorial conclusion by ENIGMA, not a quotation from a person.
- The fact ledger has six rows, each with an in-universe claim, a documented record, and a source code.
- The closing lake photograph is modern NOAA photography (2002), not a film still.
- The reading-settings control repeats the reduced-motion switch so the reader can change it at the end of the essay.

---

## 5. Source register

Eight sources are registered. Codes are stable and used inline as `[SRC-XX]` buttons.

| Code | Source | Category | Role |
|---|---|---|---|
| SRC-01 | National Register nomination, Burkittsville Historic District (1975) | Primary historical archive | Town foundation, 1862 hospital, 1999 tourism damage |
| SRC-02 | Isaac Bond, *Map of Frederick County* (1858) | Primary historical archive | Cartographic baseline |
| SRC-03 | Haxan Films, Phase I treatment / method-directing record (1997) | Production documentation | Shoot dates, GPS method, cameras, 8-day schedule |
| SRC-04 | BlairWitch.com archived timeline (1998–1999) | In-universe lore source | The invented 1785–1995 chronology |
| SRC-05 | *Curse of the Blair Witch* (1999) | In-universe lore source | The 1809 chapbook prop, mockumentary framing |
| SRC-06 | Contemporary Variety / NYT reporting (1999) | Contemporary journalism | Sundance, acquisition, gross |
| SRC-07 | Maryland DNR / Baltimore Sun records | Primary historical archive | Seneca Creek, Patapsco, Griggs House demolition |
| SRC-08 | ENIGMA procedural audio note | Audio archive | States that the eight beds are locally synthesised |

**Known limitation:** SRC-03 and SRC-06 resolve to Wikipedia section anchors rather than to an archived treatment PDF or a specific newspaper article. SRC-08 links to a public sound catalogue as a listening reference only. These links are honest about where the claim can be checked, but they are not equivalent to a primary scan. Before commercial publication, replace SRC-03/SRC-06 with archived documents and a stable citation, and re-check each Wikimedia licence on its file page.

---

## 6. Rendered content not present in the data model

| Rendered block | File | Provenance note |
|---|---|---|
| Prologue camera and title | `Prologue.tsx` | ENIGMA composition; photograph and film quote as above |
| Four-date chronology | `ChapterOne.tsx` | Condensed from Chapter 01's in-universe text; labelled |
| Map plate | `MapPlate.tsx` | LOC maps + four data markers; each marker has real/fictional fields |
| Cast triptych | `ChapterThree.tsx` | Contemporary portraits; actors named as living |
| Seven-day expedition log | `content.ts` `EXPEDITION_DAYS` | In-universe chronology, stated as such |
| Recording study | `RecordingStudy.tsx` | Procedural SVG; no film frames |
| GPS method diagram | `ChapterSix.tsx` | Explanatory diagram, not a survey |
| Website artifact | `ChapterSix.tsx` | Reconstruction of editorial framing, not a screenshot |
| Dual timeline | `Timeline.tsx` | 10 data items, filterable |
| Fact ledger | `FactLedger.tsx` | 6 data rows |
| Production figures | `content.ts` `PRODUCTION_FIGURES` | Reported figures with qualifiers |
| Closing lake photograph | `ChapterSeven.tsx` | NOAA / Eileen McVey, 2002, public domain |

---

## 7. Editorial risks to keep visible

1. **The word “archive” is load-bearing.** The essay imitates an archive's authority in order to explain how that authority was used in 1999. Every reconstructed object must keep its plain-language caption; removing one turns the critique into the thing it critiques.
2. **Two opening quotations are film text.** The prologue and Chapter 03 both use the title card. Neither is a historical record. Chapter 03's context makes the repetition intentional, but a future edit should not present it as a second source.
3. **Transcript lines are reconstructions.** They are written from published scene descriptions and the film's known beats. They are not verbatim dialogue and must not be sold as subtitles.
4. **Production numbers carry qualifiers.** `$35–60k` is a reported initial budget, not an audited figure. `≈20 hours` is approximate. Keep the tilde and the range.
5. **The 2022 photographs are not 1997 evidence.** They show the same Maryland places, not the production. Captions say “contemporary”.
6. **The “Black Hills” are fictional.** The real forest is Seneca Creek State Park; the real town is Burkittsville. Do not let a caption imply that the film's geography is a real place name.
7. **The Griggs House is gone.** The Patapsco photograph shows park stonework, not the demolished house. The caption says so.
8. **The actors are alive.** The 1999 campaign declared them missing. The essay must never reproduce that claim without the correction beside it.

---

## 8. Maintenance checklist

When adding or editing content:

- [ ] Assign one truth layer and write the reader-facing label in plain language.
- [ ] Add a source code only if the source can be opened and checked.
- [ ] Do not put a quotation in quotation marks unless it is a real quotation from a named text.
- [ ] Do not attribute an editorial sentence to a person.
- [ ] Caption every reconstruction as a reconstruction in the first line.
- [ ] Caption every modern photograph with its date and photographer.
- [ ] Keep the film's title as *The Blair Witch Project*; keep ENIGMA's title as *The Blair Witch Incident*.
- [ ] Re-run the build and the provenance QA in `docs/implementation/final-report.md`.
