# Reference access report

**Date of inspection:** 3–4 November 2026  
**Purpose:** state exactly which reference experiences were seen, how they were seen, and which claims in the design documents are therefore safe to make.

This report exists because “reference research” is easy to inflate. A case-study article is not a live site. A single opening frame is not an interaction model. A timeout is not a design judgement.

---

## 1. Evidence standards

| Level | Meaning | What it supports |
|---|---|---|
| **A — Direct visual capture** | A frame from the running experience was captured in this environment and filed in `docs/design/reference-board/`. | Composition, type placement, colour, first-screen pacing |
| **B — Live page fetch** | The live URL returned readable HTML/text, but the experience was not visually captured or fully operated. | Existence, copy, structure, control labels |
| **C — Secondary documentation** | A publisher case study, engineering post, festival page, or academic write-up was read. | Intent, production method, known constraints |
| **D — Not accessible** | The live URL timed out, returned 403/404, returned an empty document, or required a gate. | Nothing about the visual design. Recorded as a gap. |

No level C source is used to claim what a site looks like. No level D source is used to claim a technique was “seen”.

---

## 2. Access ledger

### Interactive documentaries

| Reference | Visual capture | Live fetch | Secondary sources | Effective level | Notes |
|---|---|---|---|---|---|
| **The Boat** (SBS / Distil) | Yes — opening frame in storm, brush title, Sound / Auto Scroll / Full Screen | Yes — project page and CommArts page | CommArts, Distil case notes | **A** | Only the opening and a project description were seen. No branching or later chapters. |
| **Firestorm** (The Guardian) | Yes — full-bleed orange photographic field, title left, six-chapter rail | Yes | Guardian engineering post, Poynter, MIT Docubase | **A** | Opening frame only. No scroll-through, no mobile capture. |
| **Snow Fall** (NYT) | Yes — Tunnel Creek opening, serif title in snow, thin chapter bar | Live article timed out | OpenNews team Q&A | **A** (opening) / **C** | The screenshot supports the opening composition, not the full scroll or the avalanche sequence. |
| **A Short History of the Highrise** (NFB/NYT) | No running app | NFB film page and MIT Docubase | NFB, Docubase | **C** | The 2013 interactive was not operated. No claim about its motion or interaction. |
| **Bear 71** (NFB) | No | `https://bear71.nfb.ca/` timed out / returned **403 Forbidden** | Storybench, designer notes, academic write-ups | **D** / **C** | The 403/timeout is the honest finding. The spatial-grid description comes from documentation, not from the site. |
| **Invisible World** (NFB) | No | `https://collection.nfb.ca/interactive/invisible_world` returned **404** | None | **D** | Not claimed as visually inspected. |
| **Out My Window** (NFB) | Case still only | Helios case page | Helios | **C** | The 360° apartment player was not run. |
| **Quipu Project** | Desktop/browser gate only | Live URL returned a gate | Published descriptions | **B** / **C** | The testimony player was not entered. The desktop-only gate is a real observation; the interior is not. |
| **Do Not Track** | No | `https://donottrack-doc.com/` returned an empty document | MIT OpenDocLab, Upian, CMF | **C** | No visual claim. The personalisation mechanic is documented, not seen. |
| **Into the Amazon** (Gladeye / NatGeo) | No | CommArts Webpick | CommArts | **C** | The NatGeo URL was not loaded as a running site. |
| **Chicago 00** | Project index only | `https://www.chicago00.org/` | — | **B** | Individual WebXR episodes were not entered. |
| **Missing** (Jono Yuen / SBS) | No player | Case page | Jono Yuen case write-up | **C** | The project player was not run. |
| **Un(re)solved** (FRONTLINE) | No player | Case page | Dann Oland design case | **C** | The interactive itself was not operated. |
| **Netflix DARK Official Guide** | No | `https://dark.netflix.io/` returned empty | CommArts, Webby, Eurobest | **C** | The IA description is from write-ups, not from a live session. |

### Experimental, studio and gallery references

| Reference | Visual capture | Live fetch | Secondary sources | Effective level | Notes |
|---|---|---|---|---|---|
| **Persepolis Reimagined** (Getty) | Yes — dusk landscape, serif title, circular ENTER, small Getty mark, settings/audio dots | Yes | Awwwards / Media.Monks case studies | **A** | Opening frame only. The authored camera path after ENTER was not walked. |
| **Distil Immersive** | Project index | Yes | — | **B** | Patterns read from the index, not from each project. |
| **Zendetta** (Psychoactive) | Case page | Yes | — | **B** / **C** | The illustrated memory scenes were seen as stills, not operated. |
| **Rocani / outreach.space** | No | `https://outreach.space/` blocked by the environment; `https://rocani.studio/work/outreach` not loaded | — | **D** | No visual claims. |
| **Dribbble** | No live shots | Feed/paywall | — | **D** | Directional mood only. Not implemented. |
| **Awwwards** | No live shots | Gallery/paywall | — | **D** | Directional mood only. Not implemented. |

---

## 3. What the reference board contains

`docs/design/reference-board/` holds eight captured frames:

| Category | File | What it actually shows |
|---|---|---|
| Scrollytelling | `scrollytelling/the-boat-title-frame.png` | The Boat's title in the storm |
| Full-screen composition | `full-screen-compositions/the-boat-illustrated-environment.png` | The same frame, read as environment rather than UI |
| Photography | `photography/firestorm-opening-frame.png` | Firestorm's orange photographic field |
| Full-screen composition | `full-screen-compositions/firestorm-photographic-environment.png` | The same frame, read as climate |
| Editorial typography | `editorial-typography/snow-fall-opening.png` | Snow Fall's title in the snowfield |
| Navigation | `navigation/snow-fall-chapter-bar.png` | Snow Fall's thin top chapter bar |
| Spatial storytelling | `spatial-storytelling/persepolis-reimagined-title.png` | Getty's title and circular ENTER |
| Camera movement | `camera-movement/persepolis-establishing-landscape.png` | The same establishing landscape |

The board's README also records empty category folders for techniques studied only from documentation: `image-transitions`, `interactive-exhibits`, `mobile-layouts`. They are empty on purpose.

**No mobile capture of any reference exists.** Any statement about how a reference behaves on a phone is inference from documentation, not observation. The responsive strategy is therefore ENIGMA's own design, not a copy of a verified reference mobile edit.

**No full-scroll capture of any reference exists.** Statements about pacing are limited to the first frame and published descriptions. The “scroll camera” language in the design docs is an adaptation of a technique, not a frame-by-frame copy.

---

## 4. What each accessible reference actually supports

### The Boat

Supports: environment-as-interface, a title placed inside weather, three quiet controls, no visible dashboard.

Does **not** support: claims about its branching paths, later chapters, mobile layout, or audio mixing. The opening frame shows the controls; it does not show how they behave.

### Firestorm

Supports: full-bleed photography, a slim chapter rail, small type over a dominant field, a chapter-specific colour climate.

Does **not** support: claims about its video strategy, its 25 scenes, its mobile version, or its scroll physics. Those come from the Guardian engineering post.

### Snow Fall

Supports: a title in empty snow, a thin chapter bar, a reading-first composition with cinematic pauses.

Does **not** support: claims about the avalanche simulation, the flyover, or the full chapter sequence. The live article timed out; only the opening frame and the team Q&A are available.

### Persepolis Reimagined

Supports: a landscape-first opening, a large serif title, one ritual action (ENTER), small identity and settings marks, restraint.

Does **not** support: claims about the authored camera path after ENTER, the look-around mechanic, or the information panels. Those are described in case studies, not seen here.

### Bear 71

**Not seen.** The site returned 403/timeout. The “surveillance grid” description is from published documentation. ENIGMA did not copy the grid, the webcam participation, or the voxel aesthetic. The only adaptation is the decision to use a single spatial exhibit (the Maryland production map) rather than a HUD.

### Invisible World

**Not seen.** 404. No visual claims. The brief's mention of “experimental navigation and revealed information” is not used as a design source.

### Quipu, Do Not Track, DARK, Missing, Un(re)solved, Highrise, Out My Window, Into the Amazon, Chicago 00

Seen only through case pages or gates. They support statements about **intent and documented method**, not about execution. Where the design docs say “Un(re)solved treats documents with dignity” or “DARK uses a dual chronology”, those are readings of published descriptions, not of a live interface.

---

## 5. Honest limitations

1. **No reference was operated end to end.** The captures are opening frames. The essays describe techniques, not full experiences.
2. **No reference mobile capture.** The mobile composition is ENIGMA's own.
3. **No reference performance profile.** Bundle sizes, frame rates and network behaviour of the references were not measured. ENIGMA's performance claims are about its own build.
4. **No video capture.** Motion language is inferred from frames and documentation. The GSAP camera is an authored interpretation, not a reproduction.
5. **No copyrighted assets were downloaded.** The reference board contains only the eight frames needed for composition study. No film stills, no site assets, no fonts.
6. **Case-study claims are attributed.** Where a statement comes from a publisher's write-up, the reference analysis says so.
7. **The inaccessible list is not a judgement.** A 403 or a paywall says nothing about a site's quality. It only limits what this project can honestly claim.

---

## 6. Implications for ENIGMA

- The design can legitimately claim **composition and pacing** influences from The Boat, Firestorm, Snow Fall and Persepolis. It cannot claim to have replicated their interaction models.
- The map, the dual timeline, the recording study and the fact ledger are **ENIGMA originals**, informed by documentary conventions rather than copied from a specific site.
- The “quiet masthead” is a synthesis of Firestorm's rail, Snow Fall's chapter bar and The Boat's minimal controls. It is not any one of them.
- The mobile edit is **not** a translation of a verified reference mobile design. It is a separate composition built for 320–430 px and tested in this repository.
- Any future reference claim should be added to this ledger with its evidence level. If it cannot be captured, say so.

---

## 7. Re-test log (for a future pass)

| Target | What to try | Why |
|---|---|---|
| Bear 71 | Direct browser with a normal user agent, not a fetch | The 403 may be bot protection, not a dead site |
| Snow Fall | Archived capture via the Internet Archive | The live page timed out |
| Invisible World | Search the NFB collection for a moved URL | The old URL is 404 |
| DARK | Browser with JavaScript and cookies | The fetch returned an empty document |
| Do Not Track | Browser, not fetch | The fetch returned empty |
| outreach.space | Browser, not fetch | The environment blocked the fetch |
| Un(re)solved | The FRONTLINE player, not the case page | Only the case page was read |
| Highrise | The NYT interactive, not the NFB page | Only documentation was read |

Until those are done, the ledger above is the limit of what this project knows.
