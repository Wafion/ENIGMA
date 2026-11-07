# Asset inventory — Case 001

**Audited:** 4 November 2026  
**Canonical data:** `src/data/blairWitchAssets.ts`  
**Files on disk:** `public/assets/blair-witch/`

This is the file-level audit. The editorial register (licences, attribution, placement rationale) is `docs/assets/asset-register.md`.

---

## 1. Summary

| Kind | Registered in data | Files on disk | Placed in the essay | Registered but unplaced | On disk but unregistered |
|---|---:|---:|---:|---:|---:|
| Photographs | 17 | 18 | 17 | 1 (`img-david-arnold-house`) | 1 (`burkittsville-street.jpg`) |
| Reconstructed documents (SVG) | 5 | 5 | 5 | 0 | 0 |
| Audio beds (WAV) | 8 | 8 | 8 | 1 audible cue not used (`aud-cabin-creak`) | 0 |
| Textures / ASCII data | 0 | 2 | 0 | — | 2 (`film-grain.svg`, `twana-sigil.json`) |
| **Total** | **30** | **33** | **30 placements** | **2** | **3** |

“Placed” means the asset appears in a rendered chapter, figure, map, register or ambience. Two assets are registered and inspectable but not placed as visible evidence: the David Arnold House photograph and the cabin-creak audio cue. Both can stay in the register, but the inventory should not imply they carry an argument.

**No copyrighted film stills, frames, posters, or website screenshots are in the tree.** Reconstructions are project originals. The eight WAV files are locally synthesised.

---

## 2. Photographs

All photographs are local JPEG/PNG files. Dimensions are the stored files, not the originals.

| ID | File | Dimensions | Size | Status | Placement |
|---|---|---:|---:|---|---|
| `img-loc-frederick-1858` | `frederick-map-1858.jpg` | 1280×1644 | 1,023 KB | Genuine historical material | Chapter 02 map plate (primary) |
| `img-loc-frederick-1861` | `frederick-map-1861.jpg` | 1280×1629 | 500 KB | Genuine historical material | Chapter 02 map plate (secondary) |
| `img-burkittsville-cemetery` | `burkittsville-cemetery.jpg` | 1280×853 | 463 KB | Modern contextual photography | Chapter 02 pair |
| `img-burkittsville-main` | `burkittsville-main-street.jpg` | 1280×1921 | 1,104 KB | Modern contextual photography | Chapter 02 full-bleed hero |
| `img-burkittsville-center` | `burkittsville-center.jpg` | 1280×793 | 330 KB | Modern contextual photography | Chapter 02 pair |
| `img-david-arnold-house` | `david-arnold-house.jpg` | 1280×853 | 457 KB | Modern contextual photography | **Registered, unplaced** |
| `img-black-rock-mill` | `black-rock-mill.jpg` | 1280×1923 | 717 KB | Modern contextual photography | Chapter 04 mill feature |
| `img-seneca-creek-woods` | `seneca-creek-woods.jpg` | 1280×720 | 539 KB | Modern contextual photography | Prologue hero; Chapter 04 ASCII comparison |
| `img-seneca-creek-canopy` | `seneca-creek-canopy.jpg` | 1280×2276 | 1,373 KB | Modern contextual photography | Chapter 04 pinned camera |
| `img-seneca-creek-lake` | `seneca-creek-lake.jpg` | 1280×960 | 492 KB | Modern contextual photography | Chapter 07 closing frame |
| `img-patapsco-tunnel` | `patapsco-grist-mill-tunnel.jpg` | 1280×1707 | 692 KB | Modern contextual photography | Chapter 07 bleed |
| `img-patapsco-rock-trail` | `patapsco-rock-trail.jpg` | 1280×1707 | 1,164 KB | Modern contextual photography | Chapter 04 forest footer |
| `img-hi8-camcorder` | `sony-hi8-camcorder.jpg` | 1280×853 | 160 KB | Modern contextual photography | Chapter 05 camera object |
| `img-daniel-myrick` | `daniel-myrick.jpg` | 1280×1563 | 391 KB | Modern contextual photography | Chapter 06 portrait |
| `img-heather-donahue` | `heather-donahue.png` | 325×433 | 169 KB | Modern contextual photography | Chapter 03 cast |
| `img-joshua-leonard` | `joshua-leonard.jpg` | 1280×1819 | 534 KB | Modern contextual photography | Chapter 03 cast |
| `img-michael-williams` | `michael-williams.jpg` | 339×452 | 44 KB | Modern contextual photography | Chapter 03 cast |
| — | `burkittsville-street.jpg` | 1280×795 | 346 KB | **Unregistered, unused** | None |

### Provenance notes

- Every image in the data is classified as either `Genuine historical material` (the two Library of Congress maps) or `Modern contextual photography` (everything else). No photograph is labelled as a production still or a film frame.
- The four filmmaker/cast portraits were changed from “Genuine production or promotional material” to `Modern contextual photography`. They are contemporary portraits, not 1997 publicity materials.
- `seneca-creek-woods.jpg` is a 2022 photograph by randomduck. It must not be captioned as a 1997 plate. The prologue says “Contemporary location photograph, 2022”.
- `seneca-creek-lake.jpg` is a 2002 NOAA photograph by Eileen McVey, public domain. It is not the film's creek.
- `sony-hi8-camcorder.jpg` is a representative 1990s Hi8 camcorder, not the exact unit purchased for the shoot. The Chapter 05 copy says so.
- `patapsco-grist-mill-tunnel.jpg` shows park stonework, not the demolished Griggs House. The Chapter 07 caption names the park, not the house.

### Licence groups

| Licence | Assets |
|---|---|
| Public domain (LOC / US government / author release) | 1858 map, 1861 map, Seneca Creek lake (NOAA), Patapsco tunnel |
| CC BY-SA 4.0 | Burkittsville cemetery, Main Street, town centre, David Arnold House, Hi8 camcorder, Daniel Myrick, Patapsco rock trail |
| CC BY-SA 2.5 | Black Rock Mill |
| CC BY-SA 2.0 | Seneca Creek woods, Seneca Creek canopy, Joshua Leonard |
| CC BY 3.0 | Heather Donahue |
| CC BY 2.0 | Michael C. Williams |

ShareAlike images require attribution and share-alike on redistribution. The source register carries creator, date and licence; `docs/assets/asset-register.md` is the editorial checklist. Re-check every Wikimedia file page before commercial distribution.

### Responsive limitation

All images are single-source. The longest edge is 1280 px. There is no `srcset`, `sizes`, AVIF or WebP. The largest files (canopy 1.37 MB, rock trail 1.16 MB, Main Street 1.10 MB, 1858 map 1.02 MB) are lazy-loaded, but a future performance pass should generate 640/960/1280 widths and modern formats. The 325×433 and 339×452 portraits will soften on high-density screens; that is visible in the cast triptych.

---

## 3. Reconstructed documents

All five are ENIGMA project originals, licensed CC0 1.0. They are **not** scans, tracings or reproductions of real documents. Each is labelled as a reconstruction in the object caption and again in the asset dialog.

| ID | File | Size | In-universe claim | Real status | Placement |
|---|---|---:|---|---|---|
| `doc-1809-woodcut` | `blair-witch-cult-1809-reconstruction.svg` | 4.9 KB | 1809 chapbook, *The Blair Witch Cult* | Fictional prop made for the 1999 mockumentary | Chapter 01, object i |
| `doc-coffin-rock-1886` | `coffin-rock-1886-dispatch.svg` | 4.2 KB | 1886 Coffin Rock search party | Fictional lore mapped onto a real Seneca Creek outcrop | Chapter 01, object ii |
| `doc-rustin-parr-1941` | `rustin-parr-1941-chronology.svg` | 4.0 KB | 1941 Rustin Parr cellar | Fictional cellar mapped onto the 1850 Griggs House | Chapter 01, object iii |
| `doc-missing-poster` | `missing-students-1994-reconstruction.svg` | 5.0 KB | October 1994 missing bulletin | Typographic reconstruction of a 1999 promotional flyer | Chapter 03, object iv |
| `doc-excavation-log` | `umd-anthropology-excavation-log.svg` | 3.3 KB | October 1995 UMD excavation | Fictional framing device for the found footage | Chapter 05, object v |

The SVGs are rendered at `width="800" height="1040"` in the document object so the page does not reflow when they load. They open in the asset dialog at full width.

---

## 4. Audio

All eight WAV files were synthesised locally by `scripts/build-audio.mjs`. They are **project originals**, CC0 as project originals, not Pixabay downloads. Public sound catalogues were used as listening references only. No third-party recording is stored or sampled.

| ID | File | Size | Role | Placement |
|---|---|---:|---|---|
| `aud-forest-wind` | `forest-wind-canopy.wav` | 1,206 KB | Canopy wind | Prologue ambience; Chapter 04 ambience |
| `aud-room-tone` | `historical-room-tone.wav` | 1,034 KB | Low room tone / drone | Chapters 01 and 06 ambience |
| `aud-creek-flow` | `stream-creek-flow.wav` | 1,206 KB | Creek flow | Chapter 02 ambience |
| `aud-nocturnal-insects` | `nocturnal-insects.wav` | 1,206 KB | Night insects | Chapter 03 ambience |
| `aud-tape-static` | `radio-tape-interference.wav` | 861 KB | Tape transport texture | Chapter 05 ambience |
| `aud-footsteps-leaves` | `footsteps-dry-leaves.wav` | 560 KB | Foley footsteps | Chapter 03 cue |
| `aud-branch-snap` | `branch-snap-woods.wav` | 431 KB | Nocturnal branch snap | Chapter 04 cue |
| `aud-cabin-creak` | `wooden-cabin-creak.wav` | 517 KB | Timber creak | **Registered, no audible placement** — Chapter 01's `audioCueId` is not rendered by the new component |

Chapter 07 has no ambience (`NONE`) so the essay can end in silence. Audio never autoplays; it starts only after “Turn sound on”. The sound menu and audio objects now say “Sound design”; the beds are synthesised project originals, not field recordings.

---

## 5. Unregistered and unused files

| File | Status | Recommendation |
|---|---|---|
| `images/burkittsville-street.jpg` | Not in `blairWitchAssets.ts`, not placed | Either register it with creator/licence and use it, or remove it. Do not leave an unexplained duplicate of Main Street. |
| `textures/film-grain.svg` | Not registered, not referenced | The prologue grain is an inline CSS data URI. Remove the file or document it as a retired texture. |
| `ascii/twana-sigil.json` | Not registered, not referenced | The recording study uses inline SVG geometry. Remove it or register it as an unused study. |
| `images/david-arnold-house.jpg` | Registered, unplaced | Keep as a registered contextual photograph or remove it from the register. It currently has no argument. |
| `audio/wooden-cabin-creak.wav` | Registered, no audible placement | Add a cue or mark it as an unused study. |

No file is presented as evidence without a data record except the three unregistered files above, which are not rendered. The asset register should list them under “unused”.

---

## 6. Media integrity checks

- **No film stills.** Every visual reconstruction is an original SVG or a user-controlled character field. The recording study prints “PROCEDURAL RECONSTRUCTION — NOT A FILM FRAME” on each frame.
- **No fake waveform.** The old wavesurfer component is unused in the new experience. Audio inspection uses the browser's native `<audio controls>` player, which shows a real transport, not a decorative waveform.
- **No AI-generated photography.** All photographs are credited Wikimedia/NOAA/LOC images. No generative forest imagery is used as evidence.
- **No third-party audio.** The WAVs are generated from filtered noise, sine tones and shaped transients. Their provenance fields say so.
- **Attribution is visible.** Figure captions print creator, date and licence. The asset dialog repeats them. The sources drawer lists every asset.

---

## 7. Outstanding asset work

1. Register, use or delete `burkittsville-street.jpg`.
2. Decide the fate of `film-grain.svg`, `twana-sigil.json`, `david-arnold-house.jpg`, and `aud-cabin-creak`.
3. Generate responsive image widths and AVIF/WebP.
4. Replace the two smallest portraits with higher-resolution files if the licences allow.
5. Re-check all Wikimedia licences and file pages before public launch.
6. Add a caption rule for the cast portraits that names them as contemporary photographs on every placement, not only in the chapter intro.
7. Keep “Sound design made for this essay” in the sound menu; do not relabel the beds as field recordings.
