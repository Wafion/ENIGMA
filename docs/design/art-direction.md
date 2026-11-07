# ENIGMA — art direction

**Working title of the identity:** *Threshold*  
**Case 001 climate:** Maryland timber, paper, and daylight — not a classified vault.

This direction is a break from the current dossier system. It is designed to be approved before prologue implementation.

---

## 1. Creative thesis

ENIGMA is a **digital exhibition of a documentary about a hoax that felt like history**.

The viewer does not investigate an interface. They are led through rooms. Some rooms are landscape. Some are reading rooms. Some hold a single reconstructed object. The rooms change because the *subject* changes: invented folklore, a real village, a real forest used as a set, two cameras, a website, a cultural aftershock.

The core visual idea is the **threshold**:

- A photograph that seems to be a place, then reveals itself as a production location.
- A document that seems old, then is captioned as a 1999 prop reconstruction.
- A legend that seems regional, then is dated to a marketing campaign.

The interface should know when to disappear. The image should occupy the frame. Type should enter like a caption in a film, then settle into journalism.

---

## 2. What this is not

Not PAGE.OS. Not a terminal. Not a horror game. Not a detective sim. Not a reusable dark SaaS. Not Firestorm, Snow Fall, or Persepolis cloned.

Those references taught *composition and pacing*. ENIGMA’s materials are Maryland photographs, Library of Congress maps, reconstructed folklore artifacts, and verified production history.

---

## 3. Visual identity

**Name in the world:** ENIGMA as a small, roman, serif mark. Never outlined. Never neon.  
**Case in the world:** *The Blair Witch Incident* as an editorial title, sentence case on “Incident,” not a stamp.

**Surfaces shift by chapter** (see colour). The site is one publication with several papers, not one `#050605` template.

**Image treatment**

- Grade photographs toward dusk olive and cool shadow. Do not apply VHS, glitch, or persistent grain overlays that hide the picture.
- Full-bleed for environments (woods, cemetery slope, mill ruin).
- Object lighting for reconstructions (chapbook plate, missing bulletin): sit them on a quiet field of aged paper or dark cloth, like a vitrine, *without* catalog chrome.
- Maps as landscapes: crop, pan, and scale the 1858 survey until it feels like ground, then pull back to the sheet.

**ASCII**

A single technique, not a brand wallpaper. Allowed:

1. Prologue: a short optical-to-glyph breath as the camera pushes into the trees, then the photograph wins.
2. Optional Chapter 04 comparison: one split of Seneca Creek photograph vs glyph abstraction, user-controlled.
3. Chapter 05 recording deck may keep procedural ASCII *as a substitute for copyrighted frames*, clearly labelled.

Forbidden: full-page living canopy behind every chapter.

**Atmosphere**

Quiet, damp, late October. Soft vignette only on cinematic stills. Film grain at ≤4% opacity, paused off-screen, off under reduced motion. No red flashes, no static, no flicker.

---

## 4. Colour system

Colour describes *climate*, not security clearance.

| Token | Hex | Role |
|---|---|---|
| `night-field` | `#12110f` | Default cinematic ground (warm near-black, not pure black) |
| `canopy` | `#1a1f18` | Forest chapters |
| `paper` | `#e7dfd0` | Folklore reading rooms and reconstructions |
| `ink` | `#1c1915` | Text on paper |
| `bone` | `#efe8dc` | Text on dark |
| `mist` | `#8a8478` | Secondary text |
| `moss` | `#3f5344` | Verified geography, used sparingly |
| `ember` | `#8c4a32` | Emphasis, never outlines |
| `brass` | `#a89068` | Maps, production dates |
| `day-sky` | `#c5c1b6` | Chapter 02 cooler daylight field |

Chapter climates:

| Movement | Ground | Type | Accent |
|---|---|---|---|
| Prologue | `night-field` + photograph | `bone` | none at first |
| Ch 01 Legend | warm charcoal → `paper` inserts | mixed | `ember` only on reconstructions’ captions |
| Ch 02 Town | cooler grey-green, more light | dark on pale photography captions | `moss` |
| Ch 03 Expedition | dusk, contact-sheet pacing | `bone` | `brass` |
| Ch 04 Woods | `canopy`, image-led | overlay captions | none |
| Ch 05 Recordings | near-black tape | `bone` | split B/W vs muted colour |
| Ch 06 Real story | editorial charcoal, cleaner | Newsreader | `brass` |
| Ch 07 Remains | museum grey, more paper | dark/light mix | none |

Do not use red/green badges as lore/fact. Use **plain language captions**: “In-universe mythology (constructed 1998–1999)” vs “Verified historical record.”

---

## 5. Typography

Keep the **already licensed local fonts**. Do not add Playfair Display or Inter (generic editorial default). Do not restore all-caps mono as the house voice.

| Role | Face | Use |
|---|---|---|
| Display | Instrument Serif | Titles, quotes, one-line film card. Italic for secondary title lines. |
| Body | Newsreader Variable | Long-form, 18–20px, line-height 1.55–1.65, measure 60–70ch |
| UI | Instrument Sans Variable | Navigation, buttons, captions |
| Meta | Geist Mono | Only true technical strings: coordinates, licences, timecode |

Rules (from `better-typography`):

- Display line-height ~1.05–1.15; headings 1.2; body 1.55+.
- `text-wrap: balance` on titles only; `pretty` on paragraphs.
- No tracked-out uppercase eyebrows above every heading.
- Chapter numbers may exist in the rail; they are not a stamp on the essay.

---

## 6. Layout principles

1. **Group with space, not lines.** Most borders go away.
2. **Content bleeds, controls float.** Photographs to the viewport edge; type inside margins.
3. **One primary action per view.** Prologue: continue. Not audio + sources + ASCII + begin + 18 assets.
4. **Asymmetry.** Titles may sit in a lower third or a right column (Snow Fall), not always centred.
5. **Format follows story.** See chapter compositions below.
6. **Whitespace is a beat.** After a full-bleed, a quiet column.

Forbidden: identical card grid seven times; every image in a frame; every quote in a bordered deposition.

---

## 7. Component philosophy

| Thing | Treatment |
|---|---|
| Landscape photo | Full-bleed or editorial crop, caption under or floating |
| Map | Environment, then legend |
| Reconstruction | Object on paper, “Reconstruction” in the caption, inspect on click |
| Quote | Large serif, speaker in sans, truth in a sentence |
| Sources | Drawer, and quiet inline marks |
| Audio | Icon + label in the masthead |
| ASCII | Opt-in comparison, not a skin |

---

## 8. Navigation

Replace the sticky dossier bar with a **quiet exhibition masthead**:

- Left: ENIGMA  
- Centre (desktop): current movement title, fades until hover/focus  
- Right: Sound, Sources, Chapters  

Chapter progress: a slim vertical or top tick list (Firestorm / Snow Fall). Active state is typographic weight and a short rule, not a coloured badge.

On mobile: compact top bar; chapters in a sheet; no left rail.

Cinema/broadside toggle is **removed from the product**. One documentary. Cinematic scenes live inside the scroll.

---

## 9. Chapter visual compositions (intent)

### Prologue — *The Forest*

Photographic camera (see `prologue-composition.md`). Title late. Invitation to continue.

### Chapter 01 — *The Legend of the Black Hills*

A **constructed chronology** on warm ground. Four dates as large type, not four dossier cards. The 1809 chapbook as one examined object. Parr quote as a single large line, then the caption that names it as in-universe. Horizontal sequence on desktop (1785 / 1825 / 1886 / 1941), stacked on mobile.

### Chapter 02 — *The Town Below South Mountain*

Daylight. Real street and cemetery photographs large. 1858 map as a pinned or scrubbed landscape. Production triangle as a simple overlay, not a GIS app.

### Chapter 03 — *October 1994: The Student Expedition*

Contact-sheet rhythm: portraits of the three actors (licensed modern photographs, labelled as such — not film stills). Missing bulletin as a reconstruction object. A vertical day-by-day log with generous type, not an evidence locker.

### Chapter 04 — *The Woods*

Image-led. Seneca Creek and Black Rock Mill as camera scenes. Minimal text over pictures. ASCII only as an optional comparison.

### Chapter 05 — *The Recordings*

Split field: 16mm thought vs Hi8 thought, using procedural reconstruction. Transcript as editorial type. Camcorder photograph as a real object.

### Chapter 06 — *The Real Story*

Cleaner journalism. GPS method explained in prose and a modest diagram. BlairWitch.com treated as a reconstructed *marketing artifact* with an explicit caption. Dual timeline.

### Chapter 07 — *What Remains*

Museum quiet. Fact/fiction ledger as a typographic table. Closing photograph of water or timber dissolving to still, not to glyphs.

---

## 10. Uniqueness check (`frontend-design`)

Rejected defaults:

- Playfair + Inter + vermilion on cream  
- Acid-green terminal  
- Broadsheet hairlines on every block  
- SaaS cards  
- ALL CAPS eyebrows and `A · B · C` meta strings as decoration  

Chosen instead: chapter climates, photograph as camera, Instrument Serif as a rare large event, Newsreader as the reading voice, reconstructions as vitrine objects, ASCII as a footnote technique.
