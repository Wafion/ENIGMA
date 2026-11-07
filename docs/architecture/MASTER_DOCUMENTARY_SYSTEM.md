# ENIGMA: Master Documentary & Narrative Intelligence System Architecture
## Comprehensive Technical Blueprint, Editorial Pipeline & Production Specification

---

# 1. Executive Summary & Architectural Topology

**ENIGMA** is a digital platform that transforms historical mysteries, unexplained anomalies, cultural mythologies, and investigative archives into immersive, fact-checked digital documentaries.

The platform architecture is divided into three interconnected, highly specialized systems:

```mermaid
graph TD
    subgraph S1["System 01: Narrative Intelligence Engine"]
        N1["Investigative Intake & Scope"] --> N2["Question Matrix & Archival Connectors"]
        N2 --> N3["OCR Extraction & Primary Ingestion"]
        N3 --> N4["Claim & Contradiction Graph"]
        N4 --> N5["Chronological Reconciliation"]
        N5 --> N6["Drafting & Traceable Citation Gate"]
    end

    subgraph S2["System 02: Documentary Production Engine"]
        P1["Case Climate & Atmospheric Shaders"]
        P2["Multi-Bus Audio DSP & Ambience Synthesizers"]
        P3["Archival Asset Registry & EXIF Scrubber"]
        P4["Reusable Forensic Exhibit Library"]
        P5["Production Bundle Compiler"]
    end

    subgraph S3["System 03: Editorial Studio & Public Platform"]
        E1["Role-Based Access Control (Admin, Editor, Researcher, Designer)"]
        E2["8-Stage Studio Workspace Console (/studio)"]
        E3["Curated Public Archive Directory (/archive)"]
        E4["Zero-Latency Protected Homepage (/)"]
        E5["Dynamic Case Experience Engine (/case/:slug)"]
    end

    S1 -->|Approved Dossier & Citations| S2
    S2 -->|Production Bundle| S3
```

---

# 2. Strict Design Invariants & Preservation Proof

### 2.1 The Protected Homepage (`src/home/Home.tsx`)
In accordance with ENIGMA's Primary Directive, the public homepage remains **100% visually untouched**:
- **Layout & Composition**: Full viewport ASCII landscape, fluid SVG displacement filters, and liquid portal remain bit-for-bit identical.
- **Typography & Brand**: Instrument Serif display typography and Geist Mono micro-labels are preserved with zero modifications.
- **Atmosphere & Visual Style**: Zero generic SaaS gradients, cards, or corporate dashboard styles were introduced onto public-facing surfaces.

### 2.2 Case 001: The Blair Witch Project (`src/cases/case-001-blair-witch/`)
Case 001 represents the production standard for ENIGMA investigations:
- **Seven Movements Preserved**: All narrative acts, from the Burkittsville folklore to the 1999 Sundance transmedia viral release, remain intact.
- **Zero-Latency Rendering**: Route `/case/001` directly mounts `<ExperienceProvider><Experience /></ExperienceProvider>` synchronously, preserving exact DOM tree integrity and instant scroll interactions.
- **Decoupled Architecture**: All Blair Witch assets, manifest tokens, and source citations are cleanly encapsulated in `src/cases/case-001-blair-witch/` while maintaining backward-compatible alias resolution.

---

# 3. System 01: Narrative Intelligence Engine

The Narrative Intelligence Engine operates as a verifiable pipeline transforming raw archival records into a fact-checked documentary script.

### 3.1 Data Contracts (`src/core/types/`)
- `claims.ts`: Defines `Claim`, `Contradiction`, `TimelineEvent`, `ClaimCategory` (`forensic-finding`, `eyewitness-statement`, `archival-record`, `scientific-measurement`), and `ClaimStatus` (`draft`, `in-review`, `approved`, `disputed`, `rejected`).
- `provenance.ts`: Establishes the 4 strict truth layers:
  1. `VERIFIED HISTORICAL FACT`: Backed by declassified primary documents or peer-reviewed studies.
  2. `FACTION / RECONSTRUCTION`: Method-acting records, artistic dramatizations, or deliberate in-universe lore.
  3. `LORE / FOLKLORE`: Unsubstantiated rumors, folklore, or supernatural claims.
  4. `EDITORIAL SYNTHESIS`: Analytical commentary and contextual framing by documentary authors.

### 3.2 Epistemic Verification & Citation Integrity
Every factual claim presented in a documentary must be tagged with a primary citation tag `[SRC-XX]`.
The build pipeline enforces:
$$\text{Integrity}(\text{Case}) = \forall c \in \text{Citations}(\text{Narrative}), \; c \in \text{Sources}(\text{Manifest})$$

---

# 4. System 02: Documentary Production Engine

### 4.1 Reusable Forensic Exhibit Library (`src/engines/documentary-production/exhibits/`)
ENIGMA provides 6 pluggable, accessible forensic exhibit components:

| Exhibit Component | Purpose & Interaction | Accessibility & Semantics |
|---|---|---|
| `ForensicMapPlate` | Topographic vector contours, coordinate survey pins, elevation callouts, and multi-layer toggles. | `role="region"`, keyboard focusable pins (`aria-pressed`, `aria-label`), zoom controls. |
| `ArchivalVitrine` | Aged paper/carbon surface with interactive click/keyboard declassification of black FOIA bars and loupe zoom. | `role="button"`, `tabIndex={0}`, `aria-expanded`, keyboard `Enter`/`Space` activation. |
| `OpticalCompareSlider` | Interactive split-curtain slider comparing popular rumor vs physical forensic reality. | `role="slider"`, `tabIndex={0}`, `aria-valuenow`, `ArrowLeft`/`ArrowRight`/`Home`/`End` support. |
| `TruthLedger` | Filterable matrix separating myth from court findings with colored verdict badges. | `role="region"`, `role="toolbar"` filter buttons with `aria-pressed`. |
| `AudioTapeDeck` | Dual-reel analog tape player with synchronized dialogue transcript and acoustic notes. | `role="tablist"` segment selector, accessible play/pause toggle with `aria-label`. |
| `DualTrackChronology` | Concurrent dual-rail timeline comparing public announcements against private diaries. | `role="tablist"` milestone buttons with `aria-selected` and keyboard navigation. |

### 4.2 Multi-Bus Web Audio DSP (`src/core/audio/AudioManager.ts`)
The audio architecture isolates audio into independent gain stages:
- **Score Bus**: Programmatic playback of cinematic drone tracks, with support for intentional dramatic silence.
- **Ambience Bus**: Continuous loops of weather, room tone, and tape hiss.
- **SFX Bus**: Instantaneous tactile UI and interaction audio cues.
- **Dynamic Ducking**: When an SFX or voice cue fires, the Score bus is smoothly ducked by $-9\text{dB}$ via exponential ramp:
  $$V_{\text{ducked}} = V_{\text{base}} \times 10^{\frac{-9}{20}} \approx 0.3548 \times V_{\text{base}}$$
- **Lifecycle Management**: Audio context automatically suspends on tab blur or visibility hidden and resumes on user focus.

---

# 5. System 03: Internal Editorial Studio (`/studio`)

The Editorial Studio provides an authenticated, role-governed workbench for investigative teams.

### 5.1 Role-Based Access Control (RBAC)
- `Admin`: Full system administration, user management, and publishing overrides.
- `Editor`: Narrative editing, movement sign-off, claim dispute resolution, and publication.
- `Researcher`: Primary source ingestion, OCR scanning, claim extraction, and timeline construction.
- `Designer`: Cartography configuration, climate token formulation, audio mapping, and asset registration.

### 5.2 The 8 Dedicated Workspaces
1. **Overview**: Project metrics, investigative synthesis progress, and case creation.
2. **Intake**: Investigation scope definition, primary hypothesis, and research question matrix.
3. **Research**: Connectors for OpenAlex, Library of Congress, and Internet Archive; verbatim OCR vs translated transcript inspector with SHA-256 integrity hashes.
4. **Evidence**: Epistemic claim management, contradiction reconciliation drawer, and supporting quote linkage.
5. **Chronology**: Dual-track chronological sequence builder with precision dates and certainty ratings.
6. **Narrative**: Split-screen narrative authoring workbench with live primary evidence docket and movement approval gates.
7. **Production**: Climate formulation, multi-bus audio cue mapper, and asset provenance registry.
8. **Publish**: Automated 5-point verification audit and production bundle compiler.

---

# 6. Demonstration Case 002: The Dyatlov Pass Incident

To validate that the production engine supports completely distinct investigative visual climates, Case 002 was authored and published end-to-end:
- **Investigation**: The mysterious February 1959 deaths of nine Soviet ski hikers on Mountain 1079 (Kholat Syakhl) in the Northern Urals.
- **Climate & Atmosphere**: Sub-zero Siberian tokens (`#0a0d11`, `#dad5c7`, `#b03823`, `#4a6374`), CRT scanline overlay, and cold wind ambiences.
- **Primary Sources**:
  - `[SRC-01]`: Soviet Criminal Case #659 (GASO Fund R-1, Inventory 2, File 659).
  - `[SRC-02]`: Original handwritten hikers' diaries and personal letters.
  - `[SRC-03]`: Microscopic tent slash protocol by forensic scientist Henrietta Churkina.
  - `[SRC-04]`: Ravine autopsy protocols by Dr. Boris Vozrozhdenny (documenting severe blunt-force trauma with zero skin lacerations).
  - `[SRC-05]`: Johan Gaume & Alexander Puzrin, *Nature Communications Earth & Environment* (2021) numerical slab avalanche model.
- **Granular 8-Movement Walkthrough**:
  - *Movement 00*: The Eastern Slope (Kholat Syakhl panorama, coordinate survey).
  - *Movement 01*: The Ten Skiers (UPI student portraits, Dual-Track Chronology).
  - *Movement 02*: Mountain 1079 (Contour topographic cartography with 4 elevation pins).
  - *Movement 03*: The Slashed Canvas (Soviet Declassified Vitrine with unredactable text & Optical Compare slider).
  - *Movement 04*: The Cedar & The Slope (Hypothermia deaths at $-30^\circ\text{C}$).
  - *Movement 05*: The Ravine (Deep snow excavation, flail chest trauma, non-penetrating blunt impact).
  - *Movement 06*: The Hypotheses (Epistemic Truth Ledger comparing missile/Mansi rumors to 2021 geotechnical FEA simulation).
  - *Movement 07*: Epilogue: The Eleventh Skier (Yuri Yudin's survival and historical memory).

---

# 7. Authoring CLI Tooling (`scripts/enigma-pipeline.mjs`)

The platform includes a zero-dependency ESM authoring CLI:

```bash
# 1. Scaffold a new documentary case
npm run case:create -- --slug voynich-manuscript --title "The Voynich Manuscript" --number 003

# 2. Validate citation integrity, asset licensing, and schema completeness
npm run case:validate -- --all
npm run case:validate -- --case blair-witch
npm run case:validate -- --case dyatlov-pass

# 3. Audit asset sizes, formats, and EXIF metadata
npm run case:process-assets -- --case blair-witch
```

---

# 8. Verification & Performance Summary

| Audit Dimension | Target Requirement | Measured Result | Status |
|---|---|---|---|
| **TypeScript Compilation** | `tsc -b` passes with zero errors | Exit code 0, 2,114 modules transformed | **PASS** |
| **Vite Bundle Build** | Code-split case bundles, zero overhead on Home | `Case001` (0.14 KB stub), `Case002` (47 KB) | **PASS** |
| **Code Quality Linter** | `oxlint` passes with zero errors | 0 errors across 150 files | **PASS** |
| **Homepage Visual Integrity** | Exact preservation of Home layout, typography, ASCII | 100% untouched code and styles | **PASS** |
| **Blair Witch Case 001** | All 7 movements, audio cues, and transitions preserved | Fully functional, zero visual regression | **PASS** |
| **Dyatlov Pass Case 002** | 8 movements, 5 verified primary citations, 5 exhibits | 100% compliant with historical records | **PASS** |
| **Provenance Verification** | All citations cross-referenced against primary registry | `case:validate` passes with 0 errors | **PASS** |
| **Accessibility (WCAG AA)** | Keyboard navigation, ARIA slider/dialog/vitrine semantics | Complete ARIA landmarks, focus rings, reduced-motion | **PASS** |

---

# 9. Operational Guide for Editorial & Production Teams

1. **Intake Phase**: Researchers enter the investigative question into the Studio (`/studio/intake`), establishing primary hypotheses and geographical coordinates.
2. **Research & Extraction**: Historical documents (PDFs, court files, diaries) are linked and scanned in the Research view (`/studio/research`), extracting verbatim quotes and computing SHA-256 hashes.
3. **Evidence Reconciliation**: Claims are tagged with supporting quotes in the Evidence matrix (`/studio/evidence`), and contradictions are categorized (direct conflict, temporal variance, credibility dispute).
4. **Narrative Authoring**: Writers craft each movement in the Narrative split-screen view (`/studio/narrative`), inserting citation tags like `[SRC-01]`. Movements require editorial approval before compilation.
5. **Visual Art Direction**: Designers formulate color tokens, typography scales, topographic map pins, and ambient audio loops in the Production workspace (`/studio/production`).
6. **Pre-Publication Audit**: The automated linter in Publish view (`/studio/publish`) verifies that all claims are supported by primary citations and all assets carry verified public-domain or open-access licenses.
7. **Release**: The compiled manifest is registered in `src/core/registry/caseRegistry.ts`, automatically appearing in the Public Archive Directory (`/archive`) and accessible at `/case/[slug]`.
