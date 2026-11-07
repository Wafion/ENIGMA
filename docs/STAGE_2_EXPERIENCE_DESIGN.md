# ENIGMA — CASE 001: THE BLAIR WITCH INCIDENT
## STAGE 2: EXPERIENCE DESIGN & VISUAL SYSTEM DIRECTION

---

## 1. OVERALL ATMOSPHERE & EDITORIAL RHYTHM

The visual language of **ENIGMA // CASE 001** rejects generic horror tropes (no blood drips, no neon matrix green, no cheap jumpscares, no unreadable glitch spam). Instead, it is art-directed as an **institutional investigative digital archive and computational documentary installation**—combining the austerity of a library special-collections dossier with the tactile grain of 1990s analog magnetic/celluloid media.

### Visual Evolution Across the 8 Narrative Movements

| Movement | Background Surface | Primary Accent | Editorial Feel |
|---|---|---|---|
| **Prologue: The Forest** | Obsidian Void (`#070807`) | Phosphor Bone (`#d8d2c5`) | Minimal, restrained, emergent ASCII canopy |
| **Ch 01: The Legend** | Charcoal Slate (`#0c0b0a`) + Vellum Dossier Cards (`#171512`) | Oxide Warning Red (`#b83a2e`) & Aged Ochre (`#c49a5c`) | 18th/19th-century archival plates, woodcut reconstructions, explicit `[IN-UNIVERSE MYTHOLOGY]` stamps |
| **Ch 02: The Town** | Cartographic Slate (`#0b0d0c`) | Survey Brass (`#a38f68`) & Pine (`#4a6b53`) | 1858 Library of Congress maps, South Mountain elevation profiles, real Burkittsville historic architecture |
| **Ch 03: The Disappearance** | Evidence Locker Dark (`#0d0e10`) | Amber Evidence Tag (`#d4883a`) | Oct 1994 contact sheets, reconstructed missing flyers, chronological field timeline |
| **Ch 04: The Woods** | Deep Canopy Black-Green (`#060a07`) | Lichen Moss (`#688f71`) & Bone (`#dcd7cb`) | Spatial full-bleed forest compositions, Black Rock Mill ruins, unstable ASCII wind distortion |
| **Ch 05: The Recordings** | Magnetic Tape Black (`#08080a`) | Timecode Amber (`#e09f3e`) & REC Crimson (`#d63629`) | Dual-gauge 16mm CP-16 / Hi8 CCD-VX1E interface, SMPTE timecodes, synchronized transcripts |
| **Ch 06: The Real Story** | Investigative Studio (`#0e1012`) | Archival Cyan/Slate (`#7097a8`) | Production logs, Oct 1997 GPS drop-box coordinates, 1998 *BlairWitch.com* web anatomy |
| **Ch 07: What Remains** | Quiet Museum Charcoal (`#111210`) | Warm Parchment (`#e6dfd3`) | Reflective epilogue, side-by-side Fact vs. Fiction ledger, complete interactive Provenance Register |

---

## 2. TYPOGRAPHY SYSTEM

We pair three distinct, high-contrast typographic voices loaded via Google Fonts with clean system fallbacks:
1. **Editorial Display (`Cormorant Garamond` / `Playfair Display`, serif)**: High-contrast, sharp-serifed editorial headlines that evoke literary documentaries, 19th-century monographs, and A24-grade title cards.
2. **Investigative Body (`Newsreader` / `Inter`, readable serif & sans)**: Generous line-height (`1.75`), comfortable measure (`62ch–68ch`), warm bone-white (`#dcd6c8`) on deep charcoal (`#0a0b0a`) for effortless long-form reading.
3. **Technical & ASCII Monospace (`JetBrains Mono` / `IBM Plex Mono`, monospace)**: Used for case identifiers, GPS coordinates, SMPTE timecodes, provenance classifications, and the Canvas 2D ASCII rendering engine.

---

## 3. NAVIGATION & INTERACTION ARCHITECTURE

### Persistent Top Archival Bar (`ChapterNavigation` + `ReadingProgress` + `AudioController`)
- **Left**: `ENIGMA // ARCHIVE` brand mark + Case Selector / Case Overview Drawer trigger + `CASE 001: THE BLAIR WITCH INCIDENT`.
- **Center**: Active Chapter indicator (`CH.04 // THE WOODS`) + clickable Chapter Index Rail dropdown/drawer + continuous horizontal reading progress bar (`0%–100%`).
- **Right**:
  - **Audio Consent & Mixer Control**: Clear `[AUDIO: OFF / ON]` pill with volume slider, mute toggle, active acoustic layer indicator, and manual cue audition buttons.
  - **ASCII Studio Mode Toggle**: Allows the reader to toggle global ASCII inspection or Reduced Motion mode at any time.
  - **Sources & Provenance Drawer Trigger**: One-click access to the verified Source Register (`18 Assets`) from anywhere in the experience.

### Left/Right Desktop Chapter Rail & Mobile Bottom Drawer
- **Desktop (`>= 1024px`)**: A subtle, unobtrusive vertical index rail along the left margin showing `PROLOGUE` through `CH 07` with progress ticks and truth-layer indicators (`LORE` vs. `FACT`).
- **Mobile (`< 1024px`)**: A dedicated bottom archival bar with quick chapter jump sheet, audio toggle, and touch-friendly document/image modals.

### Core Reusable ENIGMA Components (`src/components/enigma/`)
1. `ASCIIImage.tsx` — Canvas 2D image-to-ASCII renderer with optical/ASCII split slider, live parameter controls (palette, density, contrast, brightness, invert, color mode), `IntersectionObserver` auto-pause, and full provenance modal.
2. `ASCIITransition.tsx` — Scroll-responsive chapter divider that morphs character fields and reveals chapter numbers, coordinates, and epistemic classifications.
3. `ArchivalImage.tsx` — Multi-treatment documentary photo component (`editorial-large`, `contact-sheet`, `film-strip`, `polaroid-dossier`, `split-comparison`) with mandatory Classification Badge (`Genuine Historical`, `Genuine Production`, `Modern Contextual`, `Reconstructed Fictional`) and Source Provenance Drawer.
4. `DocumentViewer.tsx` — Interactive viewer for archival and reconstructed documents (1809 *Blair Witch Cult* woodcut plate, 1886 Coffin Rock dispatch reconstruction, 1941 Rustin Parr ledger reconstruction, Oct 1994 Missing Flyer reconstruction, and Oct 1995 UMD Anthropology excavation log) with expandable readable transcript and fact-check notes.
5. `AudioController.tsx` & `AmbientAudio.ts` — Web Audio API + HTML5 Audio engine supporting scene-driven ambient crossfades, isolated acoustic cues, master volume, mute, and visual waveform telemetry.
6. `Timeline.tsx` — Dual-track interactive timeline that visibly separates the **Fictional Mythology Track (1785–1995)** from the **Real-World Production & Cultural Track (1824–1999)**.
7. `SourceAnnotation.tsx` — Inline clickable citation markers `[SRC-04]` that reveal primary source details, license, creator, and fact/fiction verification without leaving the paragraph.
8. `ASCIIRecordingDeck.tsx` — Interactive Chapter 05 found-footage analyzer comparing Joshua Leonard's 16mm CP-16 black-and-white celluloid against Heather Donahue's Hi8 NTSC video tape, rendered live through the ASCII engine with synchronized transcripts.
