# ENIGMA — reference analysis

**Phase 1.** No application code was changed.

This document records what was actually inspected, what works, what ENIGMA should adapt, and what must not be copied. Where a live site could not be loaded, that is stated. User-supplied screenshots of four live experiences were filed in `docs/design/reference-board/`.

---

## A. Interactive documentaries

### 1. The Boat

**Inspected**

- Live capture of the opening frame (storm, boat, brush title, Sound / Auto Scroll / Full Screen).
- https://www.matthuynh.com/stories/theboat-9rw43 (project page)
- https://www.commarts.com/project/23899/the-boat
- Distil case notes for The Boat

**What makes it effective**

The interface is almost absent. Illustration *is* the environment. Type sits inside weather. Sound, auto-scroll and fullscreen are three quiet dots. Motion is the boat and the storm, not UI chrome. Scroll changes composition continuously.

**Adapt**

- Environment-led opening: a real forest photograph as the world, not a card.
- Minimal persistent controls (sound, sources, chapters).
- Motion tied to narrative weather, not generic parallax.
- Continuity: the same visual space can carry several beats of text.

**Do not copy**

- Sumi-e illustration language.
- Auto-scroll as a default.
- Wave-sway that makes body copy hard to read (jurors noted angled text; ENIGMA body text stays still).
- Branching side paths. ENIGMA is authored, linear documentary.

**Where in ENIGMA**

Prologue environment. Chapter 04 forest camera. Audio consent as a small control, not a vitrine.

---

### 2. Firestorm (The Guardian)

**Inspected**

- Live capture of the opening: full-bleed orange photographic field, title left, six-chapter rail right, muted type.
- Live URL HTML.
- Guardian engineering post “10 things we learned”; Poynter; MIT Docubase.

**What makes it effective**

Photography occupies the entire frame. Writing is small and left. Chapter progress is a slim rail of titles, not badges. Six chapters, ~25 scenes, one advance mechanic (native scroll). Sound is treated as design. They dropped features that did not serve the story.

**Adapt**

- Image as atmosphere; type as a small, high-contrast overlay.
- Right or edge chapter index that names movements without dossier codes.
- Native scroll as the foundation.
- Willingness to cut interactive exhibits.
- Chapter-specific colour climates (here: fire orange) without turning the whole site into one palette.

**Do not copy**

- Background looping video as a default (bandwidth; Firestorm itself called video hard).
- Guardian masthead language.
- “Scroll to continue” as a permanent prompt.

**Where in ENIGMA**

Prologue and Chapter 04 full-bleed. Chapter 02 can shift to cooler daylight photography. Navigation rail.

---

### 3. Snow Fall (The New York Times)

**Inspected**

- Live capture of the Tunnel Creek opening: pale snowfield, serif title right, thin chapter bar, almost no chrome.
- Live URL timed out in this environment.
- https://source.opennews.org/articles/how-we-made-snow-fall/ (team Q&A)

**What makes it effective**

It is a *reading* experience with cinematic pauses. Media interrupts only when words cannot carry the idea. Title sits in empty snow. Chapter names are literary, not technical. The Times team edited flashy transitions out to avoid fatigue. Mobile was a separate composition.

**Adapt**

- Alternate full-bleed interludes with a narrow reading column (~65ch).
- Put the case title into the photograph, not onto a dashboard.
- Use scroll-linked camera only where it explains space (forest geometry, map triangle).
- Design mobile as its own edit.

**Do not copy**

- NYT identity, flyover WebGL mountain, or avalanche simulation as a gimmick.
- Hanging every exhibit off the text.

**Where in ENIGMA**

Prologue title placement. Chapter 02 map as a visual aid for geography that prose cannot show. Chapter 07 quiet reading.

---

### 4. A Short History of the Highrise

**Inspected**

- NFB film page and MIT Docubase. The 2013 NYT interactive was not loaded as a running app.

**What makes it effective**

Historical photographs are the material, animated as a storybook. Optional depth: watch, or swipe for archives. Time is a visual progression, not a metadata stamp.

**Adapt**

- Treat 1858/1861 maps and Burkittsville photographs as primary evidence, animated by crop and scale.
- Optional “look closer” for provenance, not mandatory badges on every image.

**Do not copy**

- Rhyming children’s-book narration.
- Microgames.

**Where in ENIGMA**

Chapter 02 cartography. Chapter 06 marketing-era web as a reconstructed object, not a playable OS.

---

### 5. Bear 71

**Inspected**

- https://bear71.nfb.ca/ timed out.
- Storybench, designer notes, academic write-ups of The Grid.

**What makes it effective**

A spatial metaphor (surveillance grid) that *is* the subject. Interaction is exploration of an environment, with a linear voice underneath.

**Adapt**

- Atmosphere through space, not HUD.
- One spatial exhibit where it serves the subject: the Maryland production triangle.

**Do not copy**

- Voxel/grid surveillance UI (that would recreate the dossier/terminal problem).
- Webcam participation.
- Choose-your-own investigation.

**Where in ENIGMA**

Chapter 02 map as a quiet spatial overlay, not a game world.

---

### 6. Invisible World

**Inspected**

- https://collection.nfb.ca/interactive/invisible_world returned **404**.
- Not claimed as visually inspected.

**Relevance (from brief only, unverified live)**

Experimental navigation and revealed information. ENIGMA will not invent this site’s look.

---

### 7. Out My Window

**Inspected**

- Helios case page (text + still). The original `interactive.nfb.ca/#/outmywindow` player was not run.

**What makes it effective**

Immersive photographic rooms. The viewer inhabits an environment assembled from real apartments.

**Adapt**

- Photographic rooms for Seneca Creek vs Burkittsville vs Griggs/Patapsco — distinct places, not one forest texture.

**Do not copy**

- 360° game-like apartment navigator as the primary IA.

---

### 8. Quipu Project

**Inspected**

- Live URL returned a desktop-only / modern-browser gate. The testimony player itself was not entered.

**What makes it effective (from the gate and published descriptions)**

Source material and audio testimony first. Interface recedes. Context is around the voices, not on top of them.

**Adapt**

- Audio as optional atmosphere, never autoplay.
- Sources register as a serious instrument.

**Do not copy**

- A desktop-only lock. ENIGMA must work on phones.

---

### 9. Do Not Track

**Inspected**

- https://donottrack-doc.com/ returned empty in fetch.
- MIT OpenDocLab, Upian, CMF articles.

**What makes it effective**

Interaction *demonstrates* the subject (tracking). Personalisation is the argument.

**Adapt**

- Interaction only when it explains the Blair Witch mechanism (e.g. how a website presented fiction as a case file).

**Do not copy**

- Personalised tracking, social login, GIF web-native comedy, user-as-character.

---

## B. Experimental and immersive

### 10. Persepolis Reimagined (Getty)

**Inspected**

- Live capture: dusk landscape, serif title, circular ENTER, tiny Getty mark, settings/audio dots.
- https://persepolis.getty.edu/ (opening copy)
- Awwwards / Media.Monks case studies of the camera path

**What makes it effective**

The first minutes are almost only landscape and type. ENTER is a ritual, not a CTA bar. Camera is authored: fog lifts, city appears, then a directed path. Look-around is allowed, then the camera returns to the route. Information is contextual, not a dashboard.

**Adapt**

- Prologue as establishing environment → title → enter.
- Scroll-scrubbed camera on photographs (scale, crop, fog/vignette), not a WebGL city.
- Small identity mark; large title; one primary action.
- Fog/dissolve between chapters, used rarely.

**Do not copy**

- 3D reconstruction of Persepolis, scroll-lock between lines, or mandatory ENTER before any content. ENIGMA should remain readable without a gate.
- Kaleidoscopic transitions.

**Where in ENIGMA**

Entire prologue camera. Selective chapter transitions (photograph expands; map becomes environment).

---

### 11. Netflix DARK Official Guide

**Inspected**

- https://dark.netflix.io/ returned empty.
- CommArts Webpick, Webby Crafted with Code, Eurobest.

**What makes it effective**

Complex narrative IA: timelines, family tree, spoiler-aware layers. Mood matches the subject.

**Adapt**

- Dual chronology (lore vs production) as a *readable* timeline in Chapter 06, not a lore wiki.
- Context-sensitive chapter state in the masthead (where you are).

**Do not copy**

- Fictional-world mechanics, family trees, spoiler gates, kaleidoscopes, Easter eggs, “dark matter” WebGL.

---

### 12. Missing (Jono Yuen / SBS)

**Inspected**

- https://www.jonoyuen.com/work/missing (case write-up; project player not run)

**What makes it effective**

Two visual treatments for two perspectives. Interaction (aligning a fractured landscape) is a metaphor for tracking, not a puzzle for its own sake.

**Adapt**

- Distinct visual climates for Layer A (constructed folklore) and Layer B (verified place/production).
- One metaphoric interaction if it earns its keep (optical/ASCII as “how an image becomes a story,” used once or twice).

**Do not copy**

- Anamorphic alignment as the main navigation.

---

### 13. Un(re)solved

**Inspected**

- https://www.dannolandesign.com/projects/unresolved/ (full case)

**What makes it effective**

Sensitive material, strong editorial hierarchy, imagery with context. Horizontal story spaces. Light as reveal. Names and documents treated with dignity. Interaction (speak a name) is ceremonial, not gamified.

**Adapt**

- Quiet treatment of reconstructed violence in the lore (Coffin Rock, Parr) — no horror-game red.
- Horizontal beat in Chapter 01 chronology (1785 → 1825 → 1886 → 1941) if desktop width allows.
- Documents as objects in a field, not stamped files.

**Do not copy**

- Quilted 3D forest, leaf memorial, voice-lock to proceed (inaccessible).

---

### 14. Into the Amazon (Gladeye / National Geographic)

**Inspected**

- CommArts Webpick. The NatGeo URL was not loaded as a running site.

**What makes it effective**

Cinematic video into editorial sections; scroll as documentary; map as a nonlinear pocket inside a linear story.

**Adapt**

- Linear spine with one map pocket (Chapter 02).
- Performance discipline: photography first, video only if licensed and needed.

**Do not copy**

- Endless-loop Easter egg, climate dashboard widgets.

---

### 15. Chicago 00

**Inspected**

- https://www.chicago00.org/ (project index; individual WebXR episodes not entered)

**What makes it effective**

Archives activated in space. Historical photographs matched to viewpoints. Experiment without hiding the documents.

**Adapt**

- Pair historical maps with contemporary photographs of the same county.
- Let the archive be seen, not dressed as classified files.

**Do not copy**

- VR/AR as a requirement.

---

## C. Studios

### Distil Immersive

**Inspected:** https://www.distil.im/projects  

Pattern: illustration + WebGL + scored audio, but always in service of a specific story (The Boat, Cronulla Riots, etc.). ENIGMA should likewise refuse a house “engine look.”

### Zendetta (Psychoactive)

**Inspected:** https://www.psychoactive.co.nz/work/zendetta  

Hand-drawn memory scenes, sepia restraint, one simple advance mechanic, motion under the illustrations, supporting timeline/gallery *after* the story. Adapt: restraint, one mechanic, context after the chapter rather than beside every paragraph. Do not copy illustration style or click-to-advance film.

### Rocani / outreach.space

**Not inspected.** Fetch of `https://outreach.space/` was blocked by the environment. `https://rocani.studio/work/outreach` was not loaded. No visual claims.

---

## D. Dribbble and Awwwards

**Not visually inspected as live shots.** Paywalled or feed-based. They remain directional mood references only:

- Immersive editorial platforms, large type in photography, sparse dark pages, cinematic landscape landings.

**Do not implement Dribbble shots.** They are composition hints: oversized title in an image, almost no cards, generous crop.

---

## E. Techniques ENIGMA will take (and refuse)

| Take | Refuse |
|---|---|
| Photograph as environment | ASCII as wallpaper |
| Quiet three-control audio/nav | Classification rainbow |
| Authored scroll camera on images | Scroll hijack / line-by-line lock |
| Chapter climates | One black dashboard |
| Narrow reading + wide interludes | Card stack of exhibits |
| Provenance on demand | Metadata on every block |
| Dual timeline as journalism | Fictional-world wiki |
| Optional sound | Autoplay, waveform decoration |
| Mobile as a separate edit | Compressed desktop |

---

## F. Honest inspection ledger

| Reference | Visual capture | Live fetch | Secondary sources |
|---|---|---|---|
| The Boat | Yes | Yes | CommArts, Distil |
| Firestorm | Yes | Yes | Guardian eng, Poynter |
| Snow Fall | Yes (opening) | Timeout | OpenNews Q&A |
| Highrise | No running app | NFB + Docubase | — |
| Bear 71 | No | Timeout | Designer + academic |
| Invisible World | No | 404 | — |
| Out My Window | Case still | Helios page | — |
| Quipu | Gate only | Yes | — |
| Do Not Track | No | Empty | MIT, Upian |
| Persepolis | Yes | Yes | Case studies |
| DARK | No | Empty | CommArts, Webby |
| Missing | No player | Case page | — |
| Un(re)solved | No player | Case page | — |
| Into the Amazon | No | CommArts | — |
| Chicago 00 | Index | Yes | — |
| Distil / Zendetta | Index / case | Yes | — |
| outreach.space | No | Blocked | — |
| Dribbble / Awwwards | No | — | Listed as uninspected |
