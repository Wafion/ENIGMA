# Reference → implementation matrix

**Question this answers:** for each technique studied, where is it in the built experience, and what exactly was *not* copied?

The evidence column names a file and a selector or hook so a reviewer can check the claim. “Implemented” means the technique is present and exercised; “partial” means the composition exists but a described behaviour does not; “refused” means it was deliberately left out.

---

## 1. Composition and camera

| Reference | Technique studied | ENIGMA implementation | Evidence | Status | Not copied |
|---|---|---|---|---|---|
| **Persepolis Reimagined** | Landscape first; title second; one ritual action; small identity mark | Prologue opens on a forest photograph, pushes in, then reveals the title and a single “Enter the case” control | `Prologue.tsx`; `usePrologueMotion` in `motion.ts`; `.prologue__stage` | Implemented | WebGL city, mandatory ENTER gate, look-around camera, kaleidoscopic transitions |
| **Snow Fall** | Title placed in the weather, not on a dashboard; reading column alternates with wide interludes | Title sits in the lower-left of the photograph; chapters alternate full-bleed figures with a 68ch reading column | `.prologue__title`; `.prose`; `.reading-layout` | Implemented | NYT identity, flyover mountain, avalanche simulation, scroll-locked lines |
| **Firestorm** | Photograph as climate; small type over a dominant field; slim chapter rail | Chapter climates change ground and type colour; the masthead is a thin bar; the rail is numbers plus an active rule | `.chapter--town`, `.chapter--woods`, `.chapter--tape`; `.masthead`; `.chapter-rail` | Implemented | Guardian masthead, background video loop, permanent “scroll to continue” |
| **The Boat** | Almost no interface; environment is the interface; three quiet controls | Masthead holds wordmark, sound, index, sources. The prologue has one action. No toolbar over the image | `Chrome.tsx`; `Prologue.tsx` | Implemented | Sumi-e illustration, auto-scroll default, branching paths, wave-swayed body text |
| **Highrise** | Historical images animated by crop and scale; archive as material | LOC maps are the map plate; Burkittsville photographs are cropped and scaled; no cards around them | `MapPlate.tsx`; `.figure--bleed`, `.figure--town-hero` | Partial | Storybook narration, microgames. The maps are interactive but not animated as a continuous camera |
| **Chicago 00** | Pair historical maps with contemporary photographs of the same ground | The 1858/1861 maps sit beside modern Burkittsville and Seneca Creek photographs | `MapPlate.tsx`; `ChapterTwo.tsx`; `ChapterFour.tsx` | Implemented | VR/AR, geolocation, viewpoint matching |
| **Into the Amazon** | Linear spine with one map pocket | Chapter 02 contains the only map; the rest is a linear essay | `ChapterTwo.tsx` → `MapPlate` | Implemented | Endless-loop Easter egg, climate dashboard |

---

## 2. Information design and epistemology

| Reference | Technique studied | ENIGMA implementation | Evidence | Status | Not copied |
|---|---|---|---|---|---|
| **Un(re)solved** | Sensitive material treated quietly; documents as objects; names with dignity | The lore is warm charcoal and paper, not horror red. Reconstructions are vitrine objects with plain captions. The cast is named as living actors | `ChapterOne.tsx`; `DocumentObject`; `ChapterThree.tsx` | Implemented | Quilted 3D forest, leaf memorial, voice-lock gate |
| **Missing** | Two visual treatments for two perspectives | Layer A (invented lore) is warm charcoal/paper; Layer B (verified place/production) is cooler daylight/moss | `.chapter--lore`, `.chapter--town`, `.chapter--production`, `.chapter--woods` | Implemented | Anamorphic alignment as navigation |
| **DARK Official Guide** | Dual chronology; context-sensitive chapter state | Chapter 06 has a filterable dual timeline; the masthead names the current movement | `Timeline.tsx`; `.masthead__case` | Implemented | Family trees, spoiler gates, fictional-world wiki, WebGL “dark matter” |
| **Bear 71** | A spatial metaphor that is the subject; one spatial exhibit | One map plate for the Maryland production triangle; no HUD, no grid overlay | `MapPlate.tsx` | Partial | Surveillance grid, webcam participation, choose-your-own investigation |
| **Quipu Project** | Testimony and source material first; interface recedes | Audio is optional and consent-gated; the source register is a first-class drawer | `Chrome.tsx` `SoundMenu`; `SourceDrawer` | Implemented | Desktop-only lock, testimony player |
| **Do Not Track** | Interaction demonstrates the subject | The only “reveal” interaction is the ASCII comparison, which shows how an image becomes a character field | `AsciiCompare.tsx` | Partial | Personalisation, social login, tracking, user-as-character |
| **Invisible World** | Experimental navigation and revealed information | Not used. The site was 404 and was not visually inspected | — | Refused | Any claim to have copied it |
| **Out My Window** | Distinct photographic rooms for distinct places | Burkittsville (daylight street/cemetery), Seneca Creek (canopy/mill), Patapsco (stone/tunnel) are separate visual rooms | `ChapterTwo.tsx`; `ChapterFour.tsx`; `ChapterSeven.tsx` | Implemented | 360° apartment navigator as the primary IA |

---

## 3. Typography and surfaces

| Reference | Technique studied | ENIGMA implementation | Evidence | Status | Not copied |
|---|---|---|---|---|---|
| **Snow Fall / Firestorm** | Large serif title, small sans caption, thin rules | Instrument Serif display; Instrument Sans captions; hairlines only where a table needs them | `src/index.css` type roles; `.figure__caption`; `.fact-ledger` | Implemented | Broadsheet hairline on every block; all-caps metadata eyebrows |
| **Persepolis** | One identity mark, generous negative space | ENIGMA wordmark is small; the prologue has one large title and a lot of air | `.wordmark`; `.prologue__title` | Implemented | Getty branding, gold iconography |
| **The Boat** | Type inside the environment, not in a panel | Prologue title and quotation sit over the photograph with a scrim, not in a card | `.prologue__content`; `.prologue__veil` | Implemented | Illustrated weather, textured paper overlays |
| **Dribbble / Awwwards** | Oversized title in an image, almost no cards, generous crop | Used as a composition check only: the prologue and Chapter 02 hero are image-led, not card-led | `.prologue`, `.figure--bleed` | Directional | Any specific shot, layout or brand |

---

## 4. Motion

| Reference | Technique studied | ENIGMA implementation | Evidence | Status | Not copied |
|---|---|---|---|---|---|
| **Persepolis** | Authored camera push, not free look | Prologue image scales `1.13 → 1.015` over a 175% pin, with title/quote/end beats | `usePrologueMotion` | Implemented | 3D camera path, scroll-lock between lines |
| **Firestorm / Snow Fall** | Native scroll; one advance mechanic | No smooth-scroll hijack, no ScrollSmoother. Native document scroll throughout | `Experience.tsx`; `motion.ts` | Implemented | Custom scroll jacking, auto-advance |
| **Highrise** | Archive images move by crop/scale | Chapter 04 woods camera scales `1.12 → 1.01` over a 125% pin; reveals are opacity + 26px | `useWoodsCamera`; `useReveals` | Implemented | Continuous illustrated camera, page-turn metaphor |
| **Un(re)solved** | Horizontal story beat | Chapter 01 chronology scrolls horizontally on desktop, stacks on mobile | `useHorizontalChronology`; `.chronology` | Implemented | Horizontal scroll as the whole site |
| **The Boat** | Motion tied to narrative weather | Prologue push-in and title fade are tied to the forest; no generic parallax on body copy | `usePrologueMotion` | Implemented | Wave sway, ambient auto-scroll |

**Pin budget actually shipped:** three pinned sequences across the whole essay — prologue (175%), Chapter 01 chronology (distance-based), Chapter 04 woods (125%). Chapter 02's map is interactive but not pinned. On mobile and under reduced motion, none of the three pins run.

---

## 5. What was explicitly refused

| Refused technique | Why | Where the refusal is recorded |
|---|---|---|
| ASCII as a full-page wallpaper | It hides the photograph and turns the essay into a terminal | `docs/design/art-direction.md` §3; only one comparison is rendered |
| Cinema/broadside dual mode | Two UIs for one story; the toggle is product chrome | `docs/design/art-direction.md` §8; `App.tsx` now renders one experience |
| Classification rainbow (red/green/amber badges) | Colour as epistemic status is a dossier cliché and fails plain language | `docs/design/art-direction.md` §4 |
| Bordered cards around every photograph | It makes evidence look like a feed | `docs/design/art-direction.md` §6; only vitrine objects have a plate |
| Repeated section layout seven times | Each chapter has a different job | `docs/design/chapter-composition-plan.md` |
| Fake waveform displays | They imply analysis that is not happening | `wavesurfer.js` is unused; audio uses a native `<audio controls>` |
| Autoplay sound | Consent is required | `SoundMenu`; `AudioManager` |
| Scroll hijacking / line-by-line lock | The reader controls the scroll | `motion.ts`; native scroll only |
| Copying a reference's visual identity | Techniques, not skins | `docs/design/reference-analysis.md` |
| Presenting AI imagery as evidence | No generative imagery is used as evidence | `docs/audit/asset-inventory.md` |
| Presenting reconstructions as documents | Provenance is the argument | `DocumentObject`; asset register |

---

## 6. Coverage check

| Reference | Studied | Implemented | Honest status |
|---|---|---|---|
| The Boat | Yes (opening) | Environment-led prologue, quiet controls | Composition adapted |
| Firestorm | Yes (opening) | Chapter climates, slim rail, full-bleed | Composition adapted |
| Snow Fall | Yes (opening) | Title in the image, reading column | Composition adapted |
| Highrise | Documentation | Map + archive stills | Partial |
| Bear 71 | Documentation only | One map plate | Partial, not a visual copy |
| Persepolis | Yes (opening) | Prologue camera | Composition adapted |
| DARK | Documentation | Dual timeline | Partial |
| Missing | Documentation | Two climates | Composition adapted |
| Un(re)solved | Documentation | Quiet lore, vitrine documents | Partial |
| Into the Amazon | Documentation | One map pocket | Composition adapted |
| Chicago 00 | Index only | Map + contemporary photos | Partial |
| Quipu | Gate only | Optional audio, source register | Composition adapted |
| Do Not Track | Documentation | ASCII comparison only | Partial |
| Out My Window | Case page | Distinct place chapters | Composition adapted |
| Distil / Zendetta | Index/case | Restraint, one mechanic | Composition adapted |
| Invisible World | 404 | Nothing | Not used |
| outreach.space | Blocked | Nothing | Not used |
| Dribbble / Awwwards | Not inspected | Nothing specific | Not used |

---

## 7. What a reviewer should test

1. Prologue at 1440 and 390: does the image lead, and does the title arrive as an event rather than a card?
2. Chapter 01 at desktop: does the horizontal chronology feel authored, and does it stack cleanly at 390?
3. Chapter 02: does the map read as ground, and are the “In the story / On the ground” fields visible without hovering?
4. Chapter 04: is the ASCII comparison clearly one technique, not a skin?
5. Chapter 05: is the recording frame unmistakably a reconstruction?
6. Chapter 06: can a reader filter the timeline and still understand which layer is which?
7. Chapter 07: does the ledger close the argument without turning into a seventh card grid?
8. Reduced motion: are the photograph, title, quote and end control all present without a pin?
