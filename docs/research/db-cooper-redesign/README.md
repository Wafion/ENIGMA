# DB Cooper redesign — research board

**Captured:** 7 November 2026  
**Method:** live sites loaded in headless Chromium at 1440×900 and 390×844; screenshots stored beside this document. Homepages *and* article pages were inspected. Where a site blocked automated capture, that is stated and a published screenshot is used instead.

> Screenshots are research evidence only. No reference image is used as a site asset.

---

## Reference matrix

### 1. 032c

**Screenshot:** `screens/032c/home--0.png`, `home--0-22.png`, `home--0-55.png`, `article--0.png`, `article--0-28.png`, `mobile--0.png`  
**URL:** https://032c.com/ · https://magazine.032c.com/

**What works**
- A page can change temperature in one scroll: black sale strip, white editorial field, full-bleed photography, then type alone on black.
- Pictures are cropped hard and allowed to run past the grid. Type is either very large or very small; there is almost no middle.
- On the article page the headline is a small, calm object at the top; the photographs carry the scale. The interface is nearly absent.
- Red is used as a flat system colour (the sale strip), not a glow or gradient.
- Mobile does not shrink the desktop grid; it keeps the abrupt scale jumps and full-bleed crops.

**Why**
Editorial confidence comes from contrast and commitment, not from decoration. The grid is strict enough to make one deliberate break feel loud.

**Borrow**
- One flat signal colour used as a structural band.
- Extreme scale contrast: a 120px headline next to 10px metadata.
- Full-bleed crops that ignore the reading column.
- A calm article header so the photographs can be loud.

**Avoid**
- The commerce machinery (sale marquees, product rails).
- Headline-over-image collisions that obscure faces or evidence.
- Using a reference's exact red/black identity.

**Application**
The cover and chapter dividers can behave like 032c: a flat colour field, one enormous word, one tiny archival caption. The evidence itself (money, sketches, ticket) becomes the photography. Never put a headline over an evidentiary face.

---

### 2. nss magazine

**Screenshot:** `screens/nss/home--0.png`, `home--0-25.png`, `article--0.png`, `article--0-3.png`  
**URL:** https://www.nssmag.com/en

**What works**
- The homepage is a controlled collage: black ground, white editorial panels, images of different ratios, one enormous serif headline cutting into a photograph.
- Density is high but reading order is clear: one lead story, then a masonry of secondary stories, then numbered pagination.
- Article pages are the opposite of the homepage: a black masthead, one full-bleed portrait with a restrained italic overlay, then a narrow white reading column. The collage stops when reading begins.
- Black and white are used as *space*, not as a "dark mode".

**Why**
Collage is a hierarchy device. The lead is big, the rest are small, and the page changes mode when the reader starts reading.

**Borrow**
- A lead object per chapter, with secondary material in a tighter grid.
- Switching from collage to a calm reading column at the exact moment prose begins.
- Black-and-white photography treated as material, not as a filter.

**Avoid**
- The "overlap everything" reading of collage.
- Busy masonry for evidence that needs comparison.
- Infinite feed behaviour.

**Application**
The suspects and evidence chapters can use a strict comparison grid; the opening of each chapter can use one oversized object. Do not collage the documents — line them up so they can be read.

---

### 3. Dazed

**Screenshot:** `screens/dazed/home--0.png`, `home--0-25.png`, `article--0.png`, `article--0-3.png`, `article--0-65.png`  
**URL:** https://www.dazeddigital.com/

**What works**
- Photography-first: a 50/50 split hero with the image on one side and a black type field on the other.
- The article page is a narrow centred column, one image, generous white space, tiny credits, and a single accent (the green Dazed Club strip at the end).
- Section headings are small; the images are large. UI is restrained to a wordmark, search, and menu.
- The page breathes. White space is used as pacing, not as emptiness to fill.

**Why**
Image dominance works best when the interface and the type get out of the way. Restraint is what makes the photography feel expensive.

**Borrow**
- A split cover: photograph beside a solid type field.
- Narrow reading measure (60–68ch) after a loud chapter opening.
- Tiny credits and metadata, not badges on every image.
- One accent strip at a chapter close, not throughout.

**Avoid**
- Cookie/consent overlays as a design pattern.
- Centring every article; DB Cooper needs asymmetry and evidence comparison.
- Advertising rails.

**Application**
Quiet chapters (The Man, What Remains) use Dazed-like reading discipline. Loud chapters use the split field. The reader always knows when the page has stopped shouting.

---

### 4. POP UP SOCIETY

**Screenshot:** `screens/popup/popup-society-gwd.jpg` (published capture; the live site returned a Cloudflare gate in this environment)  
**URL:** https://www.popupsociety.com/

**What works**
- A genuine graphic language: halftone CMYK field, black Japanese display type running vertically, isometric wireframe boxes, graph-paper ground, tiny annotation labels.
- Every element is a diagram of the magazine's subject (temporary architecture). The graphics are not decoration; they explain "POP UP".
- Type is allowed to be vertical, cropped, and enormous, but the reading text remains small and precise.
- Registration/dot texture is used as a *printing* reference, not as random grain.

**Why**
The strongest experimental pages have a diagrammatic logic. The weirdness is structural, not atmospheric.

**Borrow**
- Diagram language: wireframes, dimension lines, registration marks, annotation labels.
- One vertical typographic element per chapter at most.
- Halftone dot screens only on archival photographs where they reference newspaper printing.
- Grid-paper texture as a functional plotting surface for maps and evidence.

**Avoid**
- Four-colour halftone everywhere; it would destroy legibility and look like a filter.
- Random rotated labels.
- Treating the Japanese editorial conventions as a costume.

**Application**
The flight-path/map chapter and the 727 diagram use annotation lines, callouts, and graph paper. The vertical type can appear once — the date on the cover — and nowhere else.

---

### 5. The New Industrials

**Screenshot:** `screens/new-industrials/home--0.png`, `home--0-18.png`, `home--0-38.png`, `home--0-58.png`, `home--0-8.png`, `detail--0-06.png`, `detail--0-28.png`, `detail--0-5.png`, `detail--0-68.png`, `mobile--0.png`, `mobile--0-3.png`  
**URL:** https://thenewindustrials.com/

**What works**
- The page is a continuous environment, not a stack of sections. The ground changes colour as the argument moves: orange → lavender → blue → cyan → green.
- A thin frame with registration ticks persists. Content sits inside it like a printed sheet; the frame is the only chrome.
- Huge serif display, a narrow centred reading column, and full-bleed black-and-white image bands. No cards.
- Colour transitions are the chapter structure. The reader feels the move from one idea to the next before reading a heading.
- Mobile keeps the same frame and colour fields; it does not become a generic stacked blog.
- Small monospace labels at the edges carry provenance and navigation without competing.

**Why**
Scroll becomes progression when the *environment* changes, not when another section header appears. The frame and the colour field create continuity across very different compositions.

**Borrow**
- Chapter climates as full-bleed colour fields, changed at chapter boundaries.
- A persistent hairline frame with small technical labels.
- Narrow reading column inside wide colour fields.
- Full-bleed image bands between fields, not images inside cards.
- A page that feels like one continuous document, not 11 templates.

**Avoid**
- Reusing the exact orange/lavender/cyan gradient sequence.
- Tiny centred text for archival annotations that need to be read on mobile.
- Making every chapter a full-screen colour block; contrast needs quiet paper too.

**Application**
This is the spine of the DB Cooper redesign. Each movement gets a climate drawn from the case: newsprint, aviation blue, night, evergreen, manila, stamp red. The frame stays; the ground changes. The map and evidence chapters use the frame as a plotting surface.

---

### 6. Bromio

**Screenshot:** `screens/bromio/home--0.png`, `home--0-25.png`, `home--0-6.png`, `mobile--0.png`, `mobile--0-3.png`; plus the Studio Diffuso case study images (print spreads)  
**URL:** https://bromio.eu/ · https://studiodiffuso.com/en/work/bromio-wine-magazine-art-direction/

**What works**
- A disciplined 1970s palette: burnt orange, black, newsprint. Not "retro" wallpaper — a flat, confident colour block.
- The wordmark is set at a scale that is almost too large and cropped by the viewport; it behaves like a printed cover, not a logo.
- Images are free-floating, often full-bleed or edge-aligned, with tiny captions and hairlines.
- Layout changes with content: a shop list, a cover, a spread, a text page. The grid is a starting point, not a cage.
- The Studio Diffuso notes describe the principle exactly: "The layout is free and shifts with the content... For Bromio everything is allowed, except banality."

**Why**
A historical palette feels contemporary when it is used flat and systematically. Cropping and scale do the work; texture and fake ageing do not.

**Borrow**
- A 1970s print palette grounded in the case's actual world (Northwest Orient red/blue, newsprint, manila, evergreen).
- A cropped wordmark as a cover device.
- Different layout logic per content type (table, spread, list, plate).
- Hairline rules and small captions instead of shadows and cards.

**Avoid**
- Literal 1970s nostalgia (groovy type, brown everything, faux paper textures).
- Cropping that hides essential evidence.
- Decorative print misregistration on body text.

**Application**
The colour system and cover wordmark come from here. The archive/evidence chapters can look like printed case-file spreads. The 1970s is in the palette and typography, not in a costume.

---

### 7. A1 Gallery / Siiimple / Save Design

**Screenshots:** `screens/a1/home--*.png`, `screens/siiimple/home--*.png`, `screens/save-design/explore--*.png`

**What works**
- Useful as a *range finder*: they show how many contemporary editorial sites handle scale, cropping, and layout without a house style.
- A1's curated grid demonstrates that consistent margins and a strict card ratio can make very different sites legible; Siiimple shows how much white space a "minimal" page actually needs; Save Design shows the current default of giant type on flat colour.
- Their own UI is deliberately neutral so the work can be judged.

**Why**
Curation sites are good at showing the *envelope* of current practice, not at providing a design language. The lesson is to avoid the default envelope.

**Borrow**
- Range and confidence: full-bleed, edge-aligned, oversized, and tiny can coexist.
- The discipline of a consistent outer frame across varied content.

**Avoid**
- The gallery-website look: dark grid of identical screenshot cards, filter pills, "submit" buttons.
- Treating "editorial" as a synonym for giant serif + beige.
- Using Dribbble-style hero shots as a template.

**Application**
Use only as a check against genericness. The DB Cooper page must not look like a gallery of sections.

---

### 8. 21st.dev

**Screenshot:** `screens/21st/home--0.png`, `home--0-25.png`, `home--0-6.png`  
**URL:** https://21st.dev/

**What works**
- A clear demonstration of component states: tabs, drawers, comparison panels, code viewers, filter chips.
- Useful for interaction *mechanics* — focus handling, disclosure, and panel behaviour.

**Why**
Component libraries are good at states, not at art direction.

**Borrow**
- Accessible disclosure and drawer patterns for evidence and sources.
- Radio/tab semantics for theory selection.
- Keyboard focus treatment.

**Avoid**
- The dark-blue gradient SaaS aesthetic, glowing borders, glass panels, and generic "copy-paste" hero.
- Turning the documentary into a component demo.

**Application**
Only the mechanics: a proper tablist for theories, a focus-trapped evidence drawer, a disclosures table for suspects. Styling comes from the case, not the library.

---

### 9. Studio Diffuso / Bromio print case (supplementary)

**Source:** https://studiodiffuso.com/en/work/bromio-wine-magazine-art-direction/

**What works**
- Free layout, strong flat colour, retro type, symbolic/allegorical photography, fragments of text.
- The print spreads show how to combine a photograph, a caption, and a block of text without a card.

**Why**
Print editorial has already solved the problem of making dense information feel composed. The web version should inherit that confidence, not imitate paper texture.

**Borrow**
- Text fragments as compositional elements.
- Images that bleed off the page.
- A spread logic: left plate / right argument, then reversed.

**Avoid**
- Fake paper grain, torn edges, tape, and scanned textures as decoration.

---

## Cross-reference synthesis

| Principle | Evidence | DB Cooper application |
|---|---|---|
| **One continuous environment, changing climate** | New Industrials | Chapter colour fields: newsprint → manila → aviation blue → night → evergreen → stamp red → newsprint |
| **Strict frame, free composition inside** | New Industrials, 032c | Persistent hairline frame and technical labels; each chapter uses a different internal grid |
| **Extreme scale contrast** | 032c, NSS, Bromio | Anton display at 8–14vw; metadata at 10–11px; almost nothing in between |
| **Image as evidence, not decoration** | Dazed, 032c, NSS | Real FBI photographs, ticket, money scan; no generated historical scenes |
| **Collage for hierarchy, not for texture** | NSS | One lead artifact per chapter; secondary material in a strict comparison grid |
| **Quiet reading after loud opening** | Dazed | 60–68ch Newsreader column; generous space; no UI over the text |
| **Diagrammatic graphic language** | POP UP SOCIETY | 727 elevation, drop-zone map, evidence connections, registration marks, callouts |
| **Print palette, flat and systematic** | Bromio | Newsprint, ink, Northwest red, aviation blue, evergreen, manila; no gradients |
| **Scroll as progression** | New Industrials, Dazed | Sticky map/portrait stages, horizontal timelines, full-screen chapters; native scroll only |
| **Accessible interaction mechanics** | 21st.dev | Tablist, drawers, disclosures, focus states, reduced motion |

---

## What the references agree on

1. **Commit to a few loud moves.** Every strong reference repeats a small number of gestures (flat colour, huge type, full-bleed image) and spends its complexity on composition, not effects.
2. **Change the mode when the content changes.** Collage for hierarchy, a narrow column for reading, a table for comparison, a map for geography.
3. **Use real material.** The best pages are made of photographs, documents, and type — not decorative graphics.
4. **Keep the chrome thin.** A wordmark, a few labels, a progress rule. The story is the interface.
5. **Let the page breathe.** Whitespace and silence are compositional tools, not empty space to fill.

## What the references warn against

- **The gallery default:** identical cards in a dark grid, filter pills, and a "submit" button.
- **The AI default:** purple/blue gradients, glassmorphism, glow, 3D objects, particles, fake grain.
- **The collage trap:** overlapping text and images until neither can be read.
- **The retro trap:** brown paper textures and faux misregistration instead of a real colour system.
- **The template trap:** one layout repeated with different content.
- **The interaction trap:** scroll-jacking and pinned scenes that do not explain anything.

---

## Screenshot ledger

| Reference | Home | Article | Mobile | Live capture |
|---|---|---|---|---|
| 032c | Yes | Yes | Yes | Yes |
| nss magazine | Yes | Yes | No | Yes |
| Dazed | Yes | Yes | Yes | Yes |
| POP UP SOCIETY | Published capture | No | No | Blocked by Cloudflare |
| The New Industrials | Yes | n/a (one page) | Yes | Yes |
| Bromio | Yes | Print case study | Yes | Yes |
| A1 Gallery | Yes | n/a | No | Yes |
| Siiimple | Yes | n/a | No | Yes |
| Save Design | Yes | n/a | No | Yes |
| 21st.dev | Yes | n/a | No | Yes |
