# Prologue composition — *The Forest*

This is the first scene to implement after approval. It must establish ENIGMA without dossier chrome and without ASCII wallpaper.

Reference DNA: Persepolis (landscape then title then enter), Snow Fall (title in the weather), Firestorm (photograph as climate), The Boat (almost no UI).

---

## Narrative job

Put the viewer in Maryland timber. Tell them this is a documentary about a famous opening lie. Invite them to continue into the constructed legend, with the legend already marked as constructed.

---

## Opening quotation (verified use)

The 1999 feature’s opening title card, widely published in contemporary coverage, reads:

> In October of 1994, three student filmmakers disappeared in the woods near Burkittsville, Maryland while shooting a documentary. A year later their footage was found.

**Attribution:** Opening title card, *The Blair Witch Project* (Haxan Films, 1999).  
**Status:** Marketing/film text, not a historical record. Do not present as a found police statement.

Do not paraphrase and still attribute it to the film.

---

## Image

Primary: `img-seneca-creek-woods`  
`/assets/blair-witch/images/seneca-creek-woods.jpg`  
Photograph by randomduck, 25 Oct 2022, CC BY-SA 2.0, Seneca Creek State Park.  
**Not** a 1997 production still. Caption must say contemporary location photography of woods used in the film’s geography — Seneca Creek, not the fictional Black Hills.

---

## Desktop sequence (scroll camera)

One pinned viewport, ~180vh of scroll, then release.

```
┌─────────────────────────────────────────────────────────────┐
│ ENIGMA                                              Sound · │
│                                                             │
│           [forest photograph, slow push-in]                 │
│                                                             │
│                    Seneca Creek State Park                  │
│                    Montgomery County, Maryland              │
│                    Contemporary location photograph         │
└─────────────────────────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────────────────────┐
│  quotation in Instrument Serif italic, lower-left third     │
│  photograph still moving, slightly darker vignette          │
└─────────────────────────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────────────────────┐
│  The Blair Witch                                            │
│  Incident                                                   │
│  Case 001                                                   │
└─────────────────────────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────────────────────┐
│  A documentary about how a folklore was built,              │
│  sold as a record, and filmed in real woods.                │
│                                                             │
│  [ Begin ]     Sound is off unless chosen                   │
└─────────────────────────────────────────────────────────────┘
```

Title placement: **lower-left or right third**, not a centered poster stack with a control vitrine. Snow Fall’s empty field is the model.

Optional optical moment: between caption and quotation, a 10–15% mix of ASCII then back to photograph — once. Default path is photograph only.

---

## Mobile sequence

No pin.

1. Full-bleed crop (taller), static or 3% scale.
2. Title over the lower third with a dark gradient scrim (scrim must keep caption contrast).
3. Quotation below the frame in the reading column, not on the image if it collides.
4. Begin control full width in margins.
5. Masthead: ENIGMA, sound, menu.

---

## What is removed from the current prologue

- Special Collections folio header and LOC catalog number
- “Pure ASCII Canvas / Overlay Optical Negative” as a primary control
- Experience Architecture vitrine
- “55Hz DRONE”, “ONLINE”, green/red status
- Bottom chapter strip of Myth/Fact badges
- Duplicate ENIGMA header inside the hero (masthead is enough)
- Parallax on the headline only, with no photographic camera

---

## Audio

Forest wind bed (`aud-forest-wind` / `forest-wind-canopy.wav`) **after** explicit Sound on. Default off. If the browser blocks, stay silent and keep the toggle honest.

---

## Transition into Chapter 01

As the pin ends, the photograph recedes (scale down or letterbox) and the ground shifts toward warm paper. Chapter 01 opens with the constructed chronology, not another full-screen black title.

---

## Success criteria for Phase 3

- First frame is a photograph, not glyphs.
- Title is a typographic event in the landscape.
- Quotation is attributed as film text.
- Navigation is quiet.
- Desktop camera scrubs; mobile does not trap scroll.
- Reduced motion shows the complete title frame immediately.
- Captured at 1440 and 390 widths before Chapter 01 proceeds.
