# Prologue storyboard — *The Forest*

**Status:** implemented, not a proposal.  
**Files:** `src/experience/components/Prologue.tsx`, `src/experience/motion.ts` (`usePrologueMotion`), `src/index.css` (`.prologue*`).  
**Reference DNA:** Persepolis (landscape → title → one action), Snow Fall (title in the weather), Firestorm (photograph as climate), The Boat (almost no UI).

---

## 1. Narrative job

Put the reader in Maryland timber. Establish that this is a documentary about a famous opening lie. Mark the 1999 title card as film text before the reader has a chance to mistake it for a record. Offer one way in.

The prologue does not explain the case. It sets the weather.

---

## 2. The frame

| Layer | Content | Treatment |
|---|---|---|
| Media | `seneca-creek-woods.jpg` | Full-bleed, `object-position: center 44%`, desaturated to 0.74, contrast 1.04, brightness 0.82 |
| Veil | Two gradients | Top/bottom vignette and a left-side falloff for type contrast |
| Grain | Inline SVG noise | 3.5% opacity, static, not animated |
| Location | “Seneca Creek State Park / Montgomery County, Maryland / Contemporary location photograph, 2022” | Mono, 0.64rem, upper left |
| Title | “The Blair Witch” / *Incident* | Instrument Serif, `clamp(3.9rem, 12.5vw, 10.5rem)`, line-height 0.84, lower left |
| Kicker | “Case 001 · A documentary in eight movements” | Instrument Sans, 0.75rem, above the title |
| Dek | “How a folklore was built, sold as a record, and filmed in real Maryland woods.” | 36ch, low contrast |
| Quotation | The 1999 opening title card | Instrument Serif, 1.65–3.1rem, max 46rem |
| Attribution | “Opening title card, *The Blair Witch Project* (Haxan Films, 1999). Film text, not a historical record.” | Instrument Sans, 0.78rem, mist |
| End | One sentence + “Enter the case” + “18 min · sound optional · no autoplay” | Paper button, left aligned |
| Cue | “Scroll into the case” | Small, bottom right, hidden on mobile |

The image is the environment. The title is an event inside it. There is no card, no panel, no metadata rail.

---

## 3. Desktop sequence — pinned camera

**Trigger:** `#prologue`, `start: 'top top'`, `end: '+=175%'`, `pin: .prologue__stage`, `scrub: 0.7`, `anticipatePin: 1`.

The pin lasts about 1.75 viewport heights. Scroll is native; the camera is scrubbed.

| Scroll position | Beat | What the reader sees |
|---:|---|---|
| **0%** | The place | Photograph at scale 1.13, pushed slightly up. Location block visible. Title and dek visible. Quote and end hidden. Scroll cue fades. |
| **2–12%** | Cue leaves | “Scroll into the case” fades out. |
| **10–24%** | Location leaves | The location block fades. The photograph keeps pushing in. |
| **26–50%** | Title leaves | The title lifts 7% and fades. The image is now the dominant surface. |
| **34–59%** | Quotation enters | The 1999 title card fades up from `y: 24` and settles. The photograph is still moving. |
| **64–82%** | Quotation leaves | The quotation lifts 18px and fades. |
| **69–91%** | The way in | The end block fades up: “Begin with the legend…”, the paper button, and the sound/reading note. |
| **100%** | Release | The pin releases into Chapter 01's warm charcoal/paper climate. |

The image scale moves from 1.13 to 1.015 and `yPercent` from −1.2 to 1.2 across the whole pin. It never stops, but it never races.

**Why the quotation is second, not first:** the reader sees the place before the film's claim. The quotation is an event inside the forest, not a title card on a black screen.

---

## 4. Frame sketches

```
0% ─────────────────────────────────────────────────────────────
┌─────────────────────────────────────────────────────────────┐
│ ENIGMA                                         Sound  Index │
│                                                             │
│ Seneca Creek State Park                                     │
│ Montgomery County, Maryland                                 │
│ Contemporary location photograph, 2022                      │
│                                                             │
│                                                             │
│  Case 001 · A documentary in eight movements                │
│  The Blair Witch                                            │
│  Incident                                                   │
│  How a folklore was built, sold as a record, and            │
│  filmed in real Maryland woods.                             │
│                                                             │
│                                          Scroll into the case ↓
└─────────────────────────────────────────────────────────────┘

35% ─────────────────────────────────────────────────────────────
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│      “In October of 1994, three student filmmakers          │
│       disappeared in the woods near Burkittsville,          │
│       Maryland while shooting a documentary. A year         │
│       later their footage was found.”                       │
│                                                             │
│      Opening title card, The Blair Witch Project            │
│      (Haxan Films, 1999). Film text, not a historical       │
│      record.                                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘

80% ─────────────────────────────────────────────────────────────
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Begin with the legend the filmmakers invented. Then        │
│  leave it behind for the town, the woods, and the people    │
│  who were really there.                                     │
│                                                             │
│  [ Enter the case ]                                         │
│  18 min · sound optional · no autoplay                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Mobile sequence

**No pin.** The camera is off below 900px. The photograph remains full-bleed behind a flowing column.

| Order | Content | Notes |
|---:|---|---|
| 1 | Photograph | Covers the stage; `object-position: center 44%` keeps the canopy |
| 2 | Location block | Upper left, mono; on very short screens the note moves below the title to avoid collision |
| 3 | Title | Wraps with `balance`; `clamp(3.9rem, 12.5vw, 10.5rem)` keeps 320px from overflowing |
| 4 | Dek | 36ch, sits under the title |
| 5 | Quotation | In flow below the title, not overlaid on a separate beat |
| 6 | End block | In flow; full-width button inside the margins |
| 7 | Scroll cue | Hidden |

Reduced motion on mobile is the same flow with no reveal animation.

---

## 6. Reduced motion

When `reducedMotion` is true:

- `usePrologueMotion` returns before creating a pin.
- The prologue stage becomes `height: auto; min-height: 100svh`.
- The content becomes a relative flex column.
- `.prologue__quote` and `.prologue__end` are forced `opacity: 1; visibility: visible; transform: none`.
- The reader sees the complete frame — photograph, title, quotation, end control — in document order.

The result is not a blank or a skipped scene. It is the final composition.

---

## 7. Provenance on the first screen

The prologue has three honesty constraints:

1. The photograph is dated **2022** and labelled “Contemporary location photograph”. It is not a 1997 production still.
2. The quotation is attributed to the **1999 film's opening title card**, and the caption says “Film text, not a historical record.”
3. The sound note says **“sound optional · no autoplay”**. Nothing plays until the reader opens Sound and chooses it.

The word “Incident” in the title is ENIGMA's editorial framing. The film is always *The Blair Witch Project* in the body and captions.

---

## 8. Success criteria — verified

| Criterion | Result |
|---|---|
| First frame is a photograph, not glyphs | Yes |
| Title is a typographic event in the landscape | Yes |
| Quotation is attributed as film text | Yes |
| Navigation is quiet | Masthead: wordmark + Sound + Index + Sources |
| Desktop camera scrubs | Yes, 175% pin, scrub 0.7 |
| Mobile does not trap scroll | No pin below 900px |
| Reduced motion shows the complete frame | Yes, tested with the in-app toggle |
| No horizontal overflow at 320/375/390/430 | Yes, verified in the QA harness |
| No autoplay | Yes, consent-gated |

**Known limitation:** the 2022 photograph is only 1280×720. On a 2560px display the prologue image is upscaled. A responsive 1920/2560 source would improve the first impression more than any motion change.

---

## 9. What was removed from the old prologue

- The Special Collections folio header and LOC catalog number.
- The “Pure ASCII Canvas / Overlay Optical Negative” control.
- The “Experience Architecture” vitrine.
- “55Hz DRONE”, “ONLINE”, and green/red status lights.
- The bottom strip of Myth/Fact badges.
- The duplicate ENIGMA header inside the hero.
- Headline-only parallax with no photographic camera.
- The cinema/broadside toggle.

The ASCII technique survives in one place only: the Chapter 04 comparison. It is not the opening.
