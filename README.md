# ENIGMA

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CLASSIFICATION : DECLASSIFIED ARCHIVAL SYSTEM                              │
│  PLATFORM       : ENIGMA DIGITAL DOCUMENTARY PRODUCTION ENGINE              │
│  EXHIBITIONS    : CASE 001 (BLAIR WITCH) · CASE 002 (D.B. COOPER)           │
│  PROVENANCE     : PRIMARY SOURCES · VERIFIED EVIDENCE · TELEMETRY           │
└─────────────────────────────────────────────────────────────────────────────┘
```

> *"An investigation is not merely a record of what happened; it is an examination of the medium through which we believe it."*

**ENIGMA** is an experimental digital documentary platform engineered to transform real-world mysteries, historical anomalies, unsolved disappearances, and cultural phenomena into cinematic, spatial, and tactile investigative experiences.

Rather than reducing historical events to static encyclopedia articles or linear video streams, ENIGMA treats digital space as a documentary canvas: a place where primary source records, spatial maps, synchronized soundscapes, dynamic typography, and interactive evidence vitrines converge to let researchers explore the anatomy of an investigation.

---

## The Idea

The modern web is inundated with information, yet increasingly starved of investigative atmosphere and editorial gravity. Most online discussions of mysteries collapse into two extremes: sensationalist entertainment or dry, disconnected text entries.

ENIGMA was conceived to bridge three distinct disciplines:
1. **Documentary Filmmaking**: Cinematic rhythm, audio pacing, visual contrast, negative space, and evocative mise-en-scène.
2. **Archival Investigative Journalism**: Provenance tracking, primary document cross-examination, contradiction analysis, and strict adherence to historical records.
3. **High-Performance Digital Interaction**: Fluid scroll-driven choreography, real-time Web Audio DSP synthesis, custom ASCII image shaders, and responsive typographic hierarchy.

Reading about an investigation communicates facts. Exploring an investigation reveals connections. **Experiencing** an investigation through ENIGMA conveys the physical and historical reality of the record: the grain of 16mm film stock, the cold radar vectors of a hijacked Boeing 727 over southwest Washington, and the epistemological boundary between verifiable truth and cultural folklore.

---

## What ENIGMA Is

ENIGMA is an independent documentary exhibition and autonomous production system built around a modular architecture:

- **An Exhibition Gallery**: A curated series of independently art-directed cases. Each case is treated as an autonomous monograph with its own distinct visual climate, typographic identity, color spectrum, sound design, and narrative movements.
- **An Investigative Engine**: A structured foundation (`@enigma/core` and `@enigma/exhibits`) that standardizes timeline chronologies, source registries, declassified document loupes, waveform audio decks, and comparative split-screen analysis.
- **An Autonomous Research Pipeline**: A server-side cognitive pipeline powered by Gemini models (`gemini-3.8-flash`), capable of ingesting public archives (Library of Congress, FBI Vault, Internet Archive, Wikimedia Commons), extracting testable claims, identifying internal contradictions, and structuring multi-movement documentary dossiers.

---

## The ENIGMA Experience

ENIGMA ships with complete, high-fidelity productions currently active in the platform:

```
                  ┌───────────────────────────────┐
                  │      ENIGMA MAIN ARCHIVE      │
                  │   (Terminal, Search, Audio)   │
                  └──────────────┬────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       ┌───────────────────┐           ┌───────────────────┐
       │     CASE 001      │           │     CASE 002      │
       │ The Blair Witch   │           │    D.B. Cooper    │
       │     Incident      │           │  (Flight 305/NORJAK)│
       └───────────────────┘           └───────────────────┘
```

### Case 001: The Blair Witch Incident
*A seven-movement forensic inquiry into the 1999 cultural phenomenon, constructed folklore, and the verified physical landscape of Burkittsville and Seneca Creek State Park, Maryland.*

- **Dual-Format Dialectic**: Investigates how the film juxtaposed Joshua Leonard's 16mm black-and-white CP-16 camera footage against Heather Donahue's consumer Hi8 video camcorder to manufacture instant documentary authenticity.
- **Dynamic ASCII Telemetry & Shaders**: Real-time canvas shaders featuring Bayer ordered dithering, directional edge detection, and audio-reactive scanline reconstruction that re-renders forest scenes into dynamic ASCII matrices.
- **Cartographic Map Plate**: High-resolution USGS and historic topographical maps tracing the crew’s route through Black Rock Road, Crampton's Gap cemetery, and the Seneca Creek coordinates.
- **Multi-Stem Ambient Forest Soundscape**: An audio engine blending multi-track wind canopy, distant crow calls, dry branch snaps, and sub-harmonic analog drones synthesized in real time via Web Audio API.
- **Fact vs. Fiction Ledger**: A cross-referenced evidence registry untangling 18th-century local Maryland municipal history from 1998 production mythology.

### Case 002: The Mystery of D.B. Cooper (Flight 305)
*A high-density editorial monograph documenting the only unsolved skyjacking in commercial aviation history.*

- **Aviation Chronology & Vector Flight**: Tracing Northwest Orient Flight 305 from Portland International Airport through Seattle-Tacoma to the drop zone over the Lewis River basin.
- **FBI NORJAK Vault Integration**: Declassified FBI dossier exhibits, flight manifest scans, passenger ticket reproductions, and handwritten tie-clip forensic analysis.
- **Tina Bar Evidence Vitrine**: Detailed examination of the 1980 recovery of \$5,800 in deteriorating \$20 bills along the Columbia River shoreline.
- **Interactive Suspect Matrix**: Comparative analysis of primary persons of interest (Richard McCoy, Sheridan Peterson, Robert Rackstraw, Duane Weber) scored against flight-crew descriptions and parachuting capability.
- **Bespoke 1970s Radar Climate**: Specialized cold-cockpit interface palette (slate, phosphor amber, radar cyan), Oswald and Newsreader typography, and low-frequency cabin pressurization soundscapes.

### Global Interaction & Telemetry Systems
- **ASCII Liquid Melt & Reconstruction**: Smooth canvas-driven transitions between case dossiers and the central archival catalog.
- **Global Source Register**: Clickable citations linked directly to public archival IDs (Library of Congress, Maryland Historical Trust, FBI Vault, contemporary news media).
- **Audio Control Center**: Master volume bus, ambient sound toggling, and sound effect mixing with immediate user controls.
- **Full Accessibility Accommodations**: First-class support for `prefers-reduced-motion`, high-contrast text ratios, skip links, semantic landmarks, and full keyboard navigation.

---

## Design Philosophy

The aesthetic of ENIGMA is rooted in **documentary restraint**. We reject generic templates, stock corporate illustrations, and superficial "spooky" tropes in favor of authentic archival gravity:

* **Typography as Voice**: Monospaced typefaces (`Geist Mono`, `IBM Plex Mono`) convey the precision of declassified teletypes; high-contrast editorial serifs (`Instrument Serif`, `Newsreader`) introduce literary depth; condensed grotesques (`Anton`, `Oswald`) evoke period newspaper headlines.
* **Negative Space & Focus**: Generous gutters, stark black/charcoal backgrounds (`#0a0d11`, `#0d1117`), and subdued amber accents (`#c89446`, `#d87a56`) draw the eye directly to evidentiary fragments.
* **Tactile Evidence**: Images are presented with archival proofing margins, contact-sheet grease-pencil crop indicators, document staples, and declassified stamp typography.
* **Sound as Geography**: Audio is never treated as background noise; it provides spatial orientation and psychological weight, calibrated to mirror the physical environment of each case.

---

## Architecture

ENIGMA is built on a modern, high-performance web and TypeScript stack:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER (Vercel)                        │
│   React 19 · Vite 8 · Tailwind CSS v4 · GSAP (ScrollTrigger) · Web Audio    │
├─────────────────────────────────────────────────────────────────────────────┤
│                          MODULAR ENGINE CORE                                │
│   Case Registry · Provenance Bus · Exhibit Primitives · ASCII Shader Deck   │
├─────────────────────────────────────────────────────────────────────────────┤
│                     AUTONOMOUS RESEARCH PIPELINE (Node 22)                  │
│   Node:SQLite (WAL) · Connector Hub (LOC, IA, FBI, Wiki) · Gemini 3.8 Flash │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Framework & Build** | React 19, TypeScript 5.8+, Vite 8, Tailwind CSS v4 | High-performance SPA with instant HMR and optimized production bundles. |
| **Animation & Motion**| GSAP 3.15, ScrollTrigger, `@gsap/react` | Precision scroll-linked timelines, parallax effects, and layout choreographies. |
| **Audio Processing**  | Web Audio API, `WaveSurfer.js` 8 | Multi-channel audio bus, procedural tone generators, and interactive waveform playback. |
| **Typography**        | `@fontsource` & `@fontsource-variable` | Self-hosted web fonts (`Instrument Sans/Serif`, `Geist Mono`, `Newsreader`, `Oswald`, `Anton`, `IBM Plex Mono`). |
| **Cognitive Engine**  | `@google/genai` (Gemini 3.8 Flash), Node 22+ | LLM-assisted claim extraction, contradiction detection, and research synthesis. |
| **Local Storage**     | `node:sqlite` (SQLite 3 via native Node 22 API) | Local research database with WAL mode for fast query execution and local indexing. |
| **Hosting & Edge**    | Vercel Production Network | Static asset delivery, edge rewrites, and serverless telemetry status handler. |

---

## Project Structure

```text
ENIGMA/
├── api/                             # Vercel serverless edge handlers
│   └── status.ts                    # Live API status and exhibition health endpoint
├── data/                            # Local research store (WAL mode, ignored in git)
│   └── .gitkeep                     # Directory anchor
├── docs/                            # Architectural design, audits, and research notes
│   ├── STAGE_1_RESEARCH_AND_PLAN.md # Initial project scoping and technical plan
│   └── STAGE_2_EXPERIENCE_DESIGN.md # Editorial experience design and wireframe notes
├── public/                          # Public static assets
│   ├── assets/
│   │   ├── blair-witch/             # Case 001 audio stems, maps, and textures
│   │   ├── db-cooper/               # Case 002 flight maps, FBI documents, and photography
│   │   └── home/                    # Central archive icons and media
│   ├── favicon.svg                  # Brand favicon
│   └── robots.txt                   # Search crawler directives
├── R&D/                             # Autonomous documentary production system specs
│   └── enigma_documentary_production_system.md
├── scripts/                         # Build tools, asset optimizers, and pipeline runners
│   ├── build-assets.mjs             # Procedural audio stem builder
│   ├── cleanup-database.mjs         # SQLite maintenance and pruning script
│   └── enigma-pipeline.mjs          # Autonomous research CLI orchestrator
├── src/
│   ├── cases/                       # Encapsulated case monographs
│   │   ├── case-001-blair-witch/    # Case 001 manifest, theme, and audio registers
│   │   └── case-002-db-cooper/      # Case 002 edition views, flight maps, and timeline
│   ├── core/                        # Shared platform foundation
│   │   └── registry/                # Dynamic case registration and routing resolution
│   ├── engines/                     # Reusable documentary exhibits
│   │   ├── documentary-production/  # ArchivalVitrine, AudioTapeDeck, ForensicMapPlate
│   │   └── runtime/                 # DynamicExhibitRenderer, ArchivalSourceDrawer
│   ├── experience/                  # Case 001 view components and chapter movements
│   ├── home/                        # Archive home screen, ASCII terrain, search drawer
│   ├── server/                      # Autonomous research orchestrator & connectors
│   │   ├── api/                     # Node HTTP request router
│   │   ├── cognitive/               # Chronology, claim, and contradiction engines
│   │   ├── connectors/              # Library of Congress, FBI Vault, Internet Archive
│   │   ├── db/                      # SQLite schema and auto-seeder
│   │   └── llm/                     # Gemini client implementation
│   ├── utils/                       # Web Audio manager, ASCII canvas renderer
│   ├── App.tsx                      # Root application router and route transitions
│   ├── index.css                    # Global design tokens and typography rules
│   └── main.tsx                     # React 19 entry point
├── .env.example                     # Environment template with safe placeholders
├── .gitignore                       # Protective ignore rules for secrets, DBs, and temp files
├── LICENSE                          # PolyForm Noncommercial License 1.0.0
├── package.json                     # Project manifest and npm dependencies
├── tsconfig.json                    # TypeScript compiler configuration
├── vercel.json                      # Vercel deployment rewrites and edge configuration
└── vite.config.ts                   # Vite configuration with Tailwind and dev server API
```

---

## Getting Started

### Prerequisites
* **Node.js**: `v22.0.0` or higher (required for native `node:sqlite` and modern JavaScript APIs).
* **npm**: `v10.0.0` or higher (or compatible package manager).
* **Google Gemini API Key** *(optional, only needed for running autonomous research pipelines)*: Obtain one at [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Wafion/ENIGMA.git
   cd ENIGMA
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional for viewing exhibitions):
   ```bash
   cp .env.example .env.local
   ```
   Add your `GEMINI_API_KEY` in `.env.local` if you plan to run autonomous research scripts.

### Running Locally

* **Start the Vite development server**:
  ```bash
  npm run dev
  ```
  Open `http://localhost:5173` in your browser.

* **Start the standalone autonomous documentary server**:
  ```bash
  npm run server
  ```
  Runs the Node.js documentary orchestration engine on `http://localhost:3001`.

* **Build for production**:
  ```bash
  npm run build
  ```
  Compiles TypeScript through `tsc -b` and produces optimized bundles in `dist/`.

* **Preview the production build**:
  ```bash
  npm run preview
  ```

---

## Environment Variables

ENIGMA uses environment variables exclusively for optional server-side cognitive services. The client-side exhibition runs entirely without credentials.

| Variable | Required | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | No | API key for Gemini 3.8 Flash used in autonomous pipeline investigations. |
| `GOOGLE_API_KEY` | No | Optional alias for `GEMINI_API_KEY`. |
| `PORT`           | No | Standalone server port (defaults to `3001`). |

> [!CAUTION]
> **Never commit real credentials or `.env.local` files to source control.** All environment variables containing keys must remain strictly on your local machine or configured in your deployment platform's secret manager.

---

## Deployment

ENIGMA is configured for deployment to **Vercel**:

1. **Connect Repository**: Import the `ENIGMA` repository into Vercel.
2. **Framework Preset**: Select `Vite`.
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**: If utilizing the autonomous generation API, add `GEMINI_API_KEY` to the Vercel Project Settings under **Environment Variables** (restricted to Production/Preview).
6. **Routing**: `vercel.json` provides automatic SPA rewrites (`/(.*) -> /index.html`) so direct navigation to `/case/001` and `/case/002` works seamlessly.

---

## Research & Sources

ENIGMA is an interface for investigation, forensic comparison, and storytelling. It does not establish universal historical dogma, nor does it present conspiracy theories as verified truth.

Where historical claims are evaluated, the platform maintains transparent separation between:
- **Verified Primary Records**: Declassified government documents, flight telemetry, courtroom testimony, contemporary newspaper archives, and physical archaeological remains.
- **Folklore & Mythology**: Cultural rumors, urban legends, marketing campaigns, and narrative fictions that developed around real events.
- **Contradictions & Open Questions**: Discrepancies between witness testimonies, missing evidence, and anomalies that remain unresolved by official inquiries.

Researchers and readers are actively encouraged to inspect original call numbers and repository links via the in-app **Source Registers**.

---

## Contributing

Contributions that expand existing investigations, correct historical citations, improve accessibility, or enhance performance are welcome.

When contributing, please adhere to:
1. **Investigative Rigor**: Citations must trace to verified primary sources (archives, academic literature, declassified files). Unsubstantiated theories must be marked accordingly.
2. **Design Language**: Respect ENIGMA's typographic hierarchy, negative space, and restrained palette. Avoid flashy, generic web tropes.
3. **Performance Standards**: Keep canvas operations performant (60 FPS on standard displays), optimize all image assets, and ensure clean audio cleanup on component unmount.
4. **Accessibility (WCAG AA)**: Always respect `prefers-reduced-motion` and provide alternative text for visual evidence.

---

## License

ENIGMA is released under the **PolyForm Noncommercial License 1.0.0** (Source-Available).

### What You May Do
* Inspect, study, and learn from the source code.
* Use the project for academic research, education, and classroom instruction.
* Experiment privately and create non-commercial modifications or personal case studies.

### What You May NOT Do
* Sell ENIGMA as a standalone commercial product, service, or paid exhibition.
* Remake, rebrand, or modify ENIGMA and sell that derivative work for commercial gain or monetary compensation.
* Operate ENIGMA as a commercial software-as-a-service (SaaS) or behind a paid paywall.

For commercial licensing arrangements or enterprise exhibitions, please contact the copyright holder.

See the full text in [LICENSE](file:///d:/Development/ENIGMA/LICENSE).

---

## Credits & Attributions

ENIGMA stands on the shoulders of remarkable open-source projects, public archives, and creative works:

* **Typography**:
  * *Instrument Serif* & *Instrument Sans* by Instrument (SIL Open Font License 1.1)
  * *Geist Mono* by Vercel (SIL Open Font License 1.1)
  * *Newsreader* by Production Type (SIL Open Font License 1.1)
  * *Oswald* by Vernon Adams (SIL Open Font License 1.1)
  * *Anton* by Vernon Adams (SIL Open Font License 1.1)
  * *IBM Plex Mono* by IBM (SIL Open Font License 1.1)
* **Libraries**:
  * [React](https://react.dev) (Meta Platforms, Inc. · MIT License)
  * [Vite](https://vite.dev) (Yuxi (Evan) You & Vite Contributors · MIT License)
  * [GSAP](https://gsap.com) (GreenSock, Inc.)
  * [Tailwind CSS](https://tailwindcss.com) (Tailwind Labs, Inc. · MIT License)
  * [WaveSurfer.js](https://wavesurfer.js.org) (katspaugh & contributors · BSD-3-Clause)
  * [Lucide Icons](https://lucide.dev) (Lucide Contributors · ISC License)
* **Archival Resources**:
  * *Library of Congress* (Prints and Photographs Division, Geography & Map Division)
  * *U.S. Federal Bureau of Investigation* (The Vault / FBI Freedom of Information Act Records)
  * *Maryland Historical Trust* & *Maryland Department of Natural Resources*
  * *Internet Archive* & *Wikimedia Commons*

---

*ENIGMA — An independent digital documentary exhibition.*
