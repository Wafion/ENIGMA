import type { SceneCompositionSpec } from '../../core/types/caseSchema';
import type { EvidenceStatus } from './content';

export interface DbcEvidenceHotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  witness: string;
  quote: string;
  source: string;
  status: EvidenceStatus;
}

export interface DbcEvidenceObjectSpec {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  assetId: string;
  status: EvidenceStatus;
  recoveredDate: string;
  recoveredLocation: string;
  custodyChain: string;
  physicalDimensions: string;
  rotationDeg: number;
  source: string;
}

export interface DbcTheoryConstraint {
  id: string;
  label: string;
  fact: string;
  source: string;
  survives: string[];    // theory IDs that accommodate this fact cleanly
  strained: string[];    // theory IDs that require additional assumptions
  fractured: string[];   // theory IDs directly contradicted by this fact
}

/**
 * Declarative Visual Grammars & Scene Compositions for all 17 movements of Case 002.
 * Each chapter declares its own spatial archetype, camera axis, palette surface,
 * typographic voice, media placements, and narrative transition out.
 */
export const DBC_SCENE_COMPOSITIONS: Record<string, SceneCompositionSpec> = {
  'dbc-prologue': {
    movementId: 'dbc-prologue',
    grammar: 'cinematic-collision',
    cameraAxis: 'pinned-vertical',
    surface: 'night',
    typography: {
      primaryVoice: 'poster',
      secondaryVoice: 'serif',
      heroMonumentText: '305',
      edgeBleedText: 'THE MAN WHO...',
      verticalTelemetryText: 'NOVEMBER 24 · 1971 · PDX–SEA',
      kineticMode: 'clip-reveal',
    },
    mediaPlacements: [
      {
        assetId: 'dbc-boeing-727-n467us',
        role: 'hero-bleed',
        bleed: 'viewport',
        parallaxSpeed: 0.14,
        textureTreatment: 'raw',
      },
      {
        assetId: 'dbc-plane-ticket-1971',
        role: 'foreground-artifact',
        bleed: 'right',
        rotationDeg: -3.2,
        zIndex: 4,
        parallaxSpeed: -0.22,
        textureTreatment: 'fbi-scan',
      },
    ],
    transitionOut: {
      type: 'photo-to-document',
      bridgeLabel: 'COOPER, DAN · ONE WAY · $20.00 CASH →',
      targetSurface: 'paper',
    },
  },
  'dbc-the-man': {
    movementId: 'dbc-the-man',
    grammar: 'editorial-spread',
    cameraAxis: 'vertical-flow',
    surface: 'paper',
    typography: {
      primaryVoice: 'serif',
      secondaryVoice: 'mono',
      heroMonumentText: '18C',
      edgeBleedText: 'DAN COOPER',
      verticalTelemetryText: 'FD-302 · WITNESS COMPOSITE RECORD',
      kineticMode: 'vertical-parallax',
    },
    mediaPlacements: [
      {
        assetId: 'dbc-composite-a',
        role: 'portrait-compare',
        rotationDeg: -1.4,
        textureTreatment: 'halftone',
      },
      {
        assetId: 'dbc-composite-b-sheet',
        role: 'foreground-artifact',
        rotationDeg: 1.8,
        textureTreatment: 'fbi-scan',
      },
      {
        assetId: 'dbc-composite-age',
        role: 'collage-fragment',
        rotationDeg: -0.8,
        textureTreatment: 'fbi-scan',
      },
      {
        assetId: 'dbc-plane-ticket-1971',
        role: 'collage-fragment',
        rotationDeg: 2.4,
        textureTreatment: 'fbi-scan',
      },
    ],
    transitionOut: {
      type: 'map-to-aircraft',
      bridgeLabel: 'PORTLAND GATE · 14:50 PST · N467US →',
      targetSurface: 'steel',
    },
  },
  'dbc-flight-305': {
    movementId: 'dbc-flight-305',
    grammar: 'horizontal-trajectory',
    cameraAxis: 'horizontal-track',
    surface: 'steel',
    typography: {
      primaryVoice: 'condensed',
      secondaryVoice: 'mono',
      heroMonumentText: 'N467US',
      edgeBleedText: 'NORTHWEST ORIENT 305',
      verticalTelemetryText: 'ALT 10,000 FT · AIRWAY V-23 · 30 MIN BLOCK',
      kineticMode: 'horizontal-track',
    },
    mediaPlacements: [
      {
        assetId: 'dbc-crew-cabin',
        role: 'foreground-artifact',
        rotationDeg: -1.1,
        parallaxSpeed: 0.25,
        textureTreatment: 'halftone',
      },
      {
        assetId: 'dbc-airstair-1975',
        role: 'foreground-artifact',
        rotationDeg: 1.3,
        parallaxSpeed: 0.35,
        textureTreatment: 'raw',
      },
    ],
    transitionOut: {
      type: 'document-to-text',
      bridgeLabel: 'AFT JUMP SEAT · A FOLDED PIECE OF PAPER →',
      targetSurface: 'night',
    },
  },
  'dbc-the-note': {
    movementId: 'dbc-the-note',
    grammar: 'claustrophobic-compression',
    cameraAxis: 'pinned-vertical',
    surface: 'night',
    typography: {
      primaryVoice: 'condensed',
      secondaryVoice: 'poster',
      heroMonumentText: 'BOMB',
      edgeBleedText: 'MISS — I HAVE A BOMB',
      verticalTelemetryText: '8 RED CYLINDERS · FELT-TIP CAPITALS · RETRIEVED BY HIJACKER',
      kineticMode: 'clip-reveal',
    },
    mediaPlacements: [],
    transitionOut: {
      type: 'palette-shift',
      bridgeLabel: 'HOLDING OVER PUGET SOUND · 15:00–17:39 PST →',
      targetSurface: 'archive',
    },
  },
  'dbc-the-ground': {
    movementId: 'dbc-the-ground',
    grammar: 'archival-collage',
    cameraAxis: 'pinned-vertical',
    surface: 'archive',
    typography: {
      primaryVoice: 'mono',
      secondaryVoice: 'poster',
      heroMonumentText: 'SEA',
      edgeBleedText: '10,000 TWENTY-DOLLAR BILLS',
      verticalTelemetryText: 'SEATTLE FIRST NATIONAL BANK · ISSAQUAH SKYPORT',
      kineticMode: 'vertical-parallax',
    },
    mediaPlacements: [
      {
        assetId: 'dbc-crew-reno',
        role: 'collage-fragment',
        rotationDeg: -1.6,
        textureTreatment: 'halftone',
      },
      {
        assetId: 'dbc-plane-ticket-1971',
        role: 'collage-fragment',
        rotationDeg: 2.1,
        textureTreatment: 'fbi-scan',
      },
    ],
    transitionOut: {
      type: 'map-to-aircraft',
      bridgeLabel: 'RUNWAY RELEASED · 5 ABOARD · 19:40 TAKEOFF →',
      targetSurface: 'night',
    },
  },
  'dbc-second-flight': {
    movementId: 'dbc-second-flight',
    grammar: 'horizontal-trajectory',
    cameraAxis: 'diagonal-drift',
    surface: 'night',
    typography: {
      primaryVoice: 'condensed',
      secondaryVoice: 'mono',
      heroMonumentText: '10,000',
      edgeBleedText: 'UNPRESSURISED · FLAPS 15° · GEAR DOWN',
      verticalTelemetryText: '19:40 PST · V-23 SOUTHBOUND · 200 KNOTS IAS',
      kineticMode: 'horizontal-track',
    },
    mediaPlacements: [
      {
        assetId: 'dbc-airstair-1975',
        role: 'foreground-artifact',
        rotationDeg: 0,
        textureTreatment: 'raw',
      },
    ],
    transitionOut: {
      type: 'aircraft-to-void',
      bridgeLabel: '20:00 AFT STAIR WARNING LIGHT →',
      targetSurface: 'void',
    },
  },
  'dbc-the-jump': {
    movementId: 'dbc-the-jump',
    grammar: 'void-blackout',
    cameraAxis: 'pinned-vertical',
    surface: 'void',
    typography: {
      primaryVoice: 'poster',
      secondaryVoice: 'serif',
      heroMonumentText: '20:13',
      edgeBleedText: 'NO HUMAN BEING WATCHED HIM JUMP',
      verticalTelemetryText: 'RAIN · ZERO CEILING · PRESSURE BUMP',
      kineticMode: 'clip-reveal',
    },
    mediaPlacements: [
      {
        assetId: 'dbc-airstair-1975',
        role: 'foreground-artifact',
        textureTreatment: 'raw',
      },
    ],
    transitionOut: {
      type: 'palette-shift',
      bridgeLabel: 'DAWN OVER CLARK & COWLITZ COUNTIES →',
      targetSurface: 'steel',
    },
  },
  'dbc-the-search': {
    movementId: 'dbc-the-search',
    grammar: 'cartographic-recon',
    cameraAxis: 'vertical-flow',
    surface: 'steel',
    typography: {
      primaryVoice: 'mono',
      secondaryVoice: 'condensed',
      heroMonumentText: '45.95°N',
      edgeBleedText: 'LEWIS RIVER DRAINAGE',
      verticalTelemetryText: 'FORT LEWIS · 200 SOLDIERS · 36 DAYS · ZERO TRACE',
      kineticMode: 'vertical-parallax',
    },
    mediaPlacements: [
      {
        assetId: 'dbc-lake-merwin-aerial',
        role: 'underlay-map',
        bleed: 'full',
        textureTreatment: 'raw',
      },
    ],
    transitionOut: {
      type: 'money-to-number',
      bridgeLabel: 'NINE YEARS LATER · 10 FEBRUARY 1980 · TINA BAR →',
      targetSurface: 'sand',
    },
  },
  'dbc-the-money': {
    movementId: 'dbc-the-money',
    grammar: 'numerical-scale',
    cameraAxis: 'vertical-flow',
    surface: 'sand',
    typography: {
      primaryVoice: 'poster',
      secondaryVoice: 'mono',
      heroMonumentText: '$200,000',
      edgeBleedText: '$5,800 RECOVERED · 2.9%',
      verticalTelemetryText: 'SERIES 1963A / 1969 · FEDERAL RESERVE SAN FRANCISCO',
      kineticMode: 'vertical-parallax',
    },
    mediaPlacements: [
      {
        assetId: 'dbc-tina-bar-money-1980',
        role: 'foreground-artifact',
        bleed: 'left',
        rotationDeg: -1.8,
        textureTreatment: 'fbi-scan',
      },
    ],
    transitionOut: {
      type: 'palette-shift',
      bridgeLabel: 'FBI LABORATORY · PHYSICAL EVIDENCE CUSTODY →',
      targetSurface: 'night',
    },
  },
  'dbc-the-evidence': {
    movementId: 'dbc-the-evidence',
    grammar: 'forensic-table',
    cameraAxis: 'vertical-flow',
    surface: 'night',
    typography: {
      primaryVoice: 'mono',
      secondaryVoice: 'condensed',
      heroMonumentText: 'E-01',
      edgeBleedText: 'PHYSICAL CUSTODY LEDGER',
      verticalTelemetryText: 'J.C. PENNEY CLIP-ON TIE · 66 LATENT PRINTS · 290 BILLS',
      kineticMode: 'static',
    },
    mediaPlacements: [
      {
        assetId: 'dbc-tina-bar-money-1980',
        role: 'foreground-artifact',
        rotationDeg: 1.5,
        textureTreatment: 'fbi-scan',
      },
      {
        assetId: 'dbc-plane-ticket-1971',
        role: 'foreground-artifact',
        rotationDeg: -2.0,
        textureTreatment: 'fbi-scan',
      },
    ],
    transitionOut: {
      type: 'palette-shift',
      bridgeLabel: 'SEATTLE FIELD OFFICE · FILE 164-239 →',
      targetSurface: 'archive',
    },
  },
  'dbc-the-archive': {
    movementId: 'dbc-the-archive',
    grammar: 'evidence-wall',
    cameraAxis: 'wall-pan',
    surface: 'archive',
    typography: {
      primaryVoice: 'poster',
      secondaryVoice: 'mono',
      heroMonumentText: 'NORJAK',
      edgeBleedText: '60 VOLUMES · 800+ SUSPECTS · 45 YEARS',
      verticalTelemetryText: 'NORTHWEST HIJACKING · SUSPENDED 8 JULY 2016',
      kineticMode: 'vertical-parallax',
    },
    mediaPlacements: [
      {
        assetId: 'dbc-wanted-poster',
        role: 'wall-specimen',
        rotationDeg: -1.5,
        textureTreatment: 'fbi-scan',
      },
      {
        assetId: 'dbc-composite-b-sheet',
        role: 'wall-specimen',
        rotationDeg: 1.4,
        textureTreatment: 'fbi-scan',
      },
      {
        assetId: 'dbc-plane-ticket-1971',
        role: 'wall-specimen',
        rotationDeg: -2.1,
        textureTreatment: 'fbi-scan',
      },
      {
        assetId: 'dbc-tina-bar-money-1980',
        role: 'wall-specimen',
        rotationDeg: 1.9,
        textureTreatment: 'fbi-scan',
      },
      {
        assetId: 'dbc-crew-cabin',
        role: 'wall-specimen',
        rotationDeg: -0.9,
        textureTreatment: 'halftone',
      },
      {
        assetId: 'dbc-crew-reno',
        role: 'wall-specimen',
        rotationDeg: 1.2,
        textureTreatment: 'halftone',
      },
    ],
    transitionOut: {
      type: 'palette-shift',
      bridgeLabel: 'SIX MEN NAMED IN PUBLIC REPORTING →',
      targetSurface: 'paper',
    },
  },
  'dbc-the-suspects': {
    movementId: 'dbc-the-suspects',
    grammar: 'editorial-spread',
    cameraAxis: 'vertical-flow',
    surface: 'paper',
    typography: {
      primaryVoice: 'serif',
      secondaryVoice: 'condensed',
      heroMonumentText: 'NAMED',
      edgeBleedText: 'RESEMBLANCE IS NOT A CASE',
      verticalTelemetryText: '01–06 · COMPARATIVE DOSSIER MATRIX',
      kineticMode: 'vertical-parallax',
    },
    mediaPlacements: [
      {
        assetId: 'dbc-suspect-mccoy',
        role: 'portrait-compare',
        rotationDeg: -1.0,
        textureTreatment: 'fbi-scan',
      },
      {
        assetId: 'dbc-suspect-rackstraw',
        role: 'portrait-compare',
        rotationDeg: 1.2,
        textureTreatment: 'fbi-scan',
      },
      {
        assetId: 'dbc-composite-a',
        role: 'portrait-compare',
        rotationDeg: 0,
        textureTreatment: 'halftone',
      },
    ],
    transitionOut: {
      type: 'palette-shift',
      bridgeLabel: 'FOUR WAYS TO ORGANISE THE GAPS →',
      targetSurface: 'night',
    },
  },
  'dbc-the-theories': {
    movementId: 'dbc-the-theories',
    grammar: 'fractured-faults',
    cameraAxis: 'vertical-flow',
    surface: 'night',
    typography: {
      primaryVoice: 'condensed',
      secondaryVoice: 'serif',
      heroMonumentText: '4 WAYS',
      edgeBleedText: 'SURVIVED · PERISHED · ASSISTED · UNNAMED',
      verticalTelemetryText: 'EVIDENTIARY STRESS TEST · NO ENDORSED FINDING',
      kineticMode: 'vertical-parallax',
    },
    mediaPlacements: [],
    transitionOut: {
      type: 'palette-shift',
      bridgeLabel: '45.95° N, 122.57° W · THE TERRAIN BELOW →',
      targetSurface: 'steel',
    },
  },
  'dbc-the-landscape': {
    movementId: 'dbc-the-landscape',
    grammar: 'cartographic-recon',
    cameraAxis: 'vertical-flow',
    surface: 'steel',
    typography: {
      primaryVoice: 'serif',
      secondaryVoice: 'mono',
      heroMonumentText: 'MERWIN',
      edgeBleedText: 'COLUMBIA · LEWIS · WASHOUGAL',
      verticalTelemetryText: 'PACIFIC COAST RANGE TO CASCADE FOOTHILLS',
      kineticMode: 'vertical-parallax',
    },
    mediaPlacements: [
      {
        assetId: 'dbc-lake-merwin-aerial',
        role: 'hero-bleed',
        bleed: 'viewport',
        textureTreatment: 'raw',
      },
    ],
    transitionOut: {
      type: 'aircraft-to-void',
      bridgeLabel: 'WHERE THE RECORD STOPS →',
      targetSurface: 'void',
    },
  },
  'dbc-the-unknowns': {
    movementId: 'dbc-the-unknowns',
    grammar: 'void-blackout',
    cameraAxis: 'pinned-vertical',
    surface: 'void',
    typography: {
      primaryVoice: 'poster',
      secondaryVoice: 'serif',
      heroMonumentText: '?',
      edgeBleedText: 'SIX QUESTIONS WITHOUT AN ANSWER',
      verticalTelemetryText: 'UNRESOLVED · OPEN FILE',
      kineticMode: 'clip-reveal',
    },
    mediaPlacements: [],
    transitionOut: {
      type: 'palette-shift',
      bridgeLabel: 'THE MECHANICAL TRACE LEFT BEHIND →',
      targetSurface: 'night',
    },
  },
  'dbc-epilogue': {
    movementId: 'dbc-epilogue',
    grammar: 'quiet-epilogue',
    cameraAxis: 'vertical-flow',
    surface: 'night',
    typography: {
      primaryVoice: 'serif',
      secondaryVoice: 'mono',
      heroMonumentText: '1971',
      edgeBleedText: 'THE COOPER VANE',
      verticalTelemetryText: 'SUSPENDED 2016 · ARIEL, WASHINGTON',
      kineticMode: 'vertical-parallax',
    },
    mediaPlacements: [
      {
        assetId: 'dbc-cooper-vane',
        role: 'foreground-artifact',
        rotationDeg: -0.8,
        textureTreatment: 'raw',
      },
      {
        assetId: 'dbc-boeing-727-n467us',
        role: 'foreground-artifact',
        rotationDeg: 0.9,
        textureTreatment: 'raw',
      },
    ],
    transitionOut: {
      type: 'palette-shift',
      bridgeLabel: 'PRIMARY SOURCES · ARCHIVAL ASSETS · LICENSED SCORE →',
      targetSurface: 'paper',
    },
  },
  'dbc-sources': {
    movementId: 'dbc-sources',
    grammar: 'archival-register',
    cameraAxis: 'vertical-flow',
    surface: 'paper',
    typography: {
      primaryVoice: 'mono',
      secondaryVoice: 'serif',
      heroMonumentText: 'INDEX',
      edgeBleedText: 'PROVENANCE & LICENCE REGISTER',
      verticalTelemetryText: '15 SOURCES · 19 ASSETS · CC-BY / CC-BY-SA SCORE',
      kineticMode: 'static',
    },
    mediaPlacements: [],
  },
};

/**
 * Interactive Witness Hotspots pinned onto the FBI Composite Sketch in Movement 01 (The Man).
 */
export const DBC_WITNESS_HOTSPOTS: DbcEvidenceHotspot[] = [
  {
    id: 'hs-hair',
    x: 49,
    y: 19,
    label: 'Hairline & Parting',
    witness: 'Tina Mucklow & Florence Schaffner (FD-302)',
    quote: 'Dark hair, cut short and combed back; receding slightly at the temples. Normal sideburns.',
    source: 'SRC-01, SRC-15',
    status: 'REPORTED',
  },
  {
    id: 'hs-eyes',
    x: 48,
    y: 38,
    label: 'Eyes & Wraparound Sunglasses',
    witness: 'Tina Mucklow (FD-302)',
    quote: 'Brown eyes, close-set. Put on dark wraparound sunglasses with black frames after passing the note.',
    source: 'SRC-15',
    status: 'REPORTED',
  },
  {
    id: 'hs-complexion',
    x: 61,
    y: 52,
    label: 'Complexion & Age (Mid-40s)',
    witness: 'Both Flight Attendants (Separate Interviews)',
    quote: 'Olive or swarthy complexion, smooth skin without notable scars, mid-forties, 170–180 lb.',
    source: 'SRC-01, SRC-15',
    status: 'REPORTED',
  },
  {
    id: 'hs-voice',
    x: 49,
    y: 63,
    label: 'Voice, Bourbon & Raleigh Filter Kings',
    witness: 'Tina Mucklow (5 hours adjacent in aft cabin)',
    quote: 'Low, calm voice with no discernible regional accent. Ordered bourbon and 7-Up; chain-smoked Raleigh filter-tipped cigarettes.',
    source: 'SRC-15',
    status: 'DOCUMENTED',
  },
  {
    id: 'hs-tie',
    x: 50,
    y: 84,
    label: 'Black J.C. Penney Clip-On Tie',
    witness: 'Removed before jumping from Seat 18C',
    quote: 'Narrow black clip-on tie with a mother-of-pearl tie tack—left behind on Seat 18C and later yielded a partial DNA profile and titanium particles.',
    source: 'SRC-01, SRC-14',
    status: 'CONFIRMED',
  },
];

/**
 * Physical Evidence Constraints used to stress-test the 4 competing theories in Movement 12.
 */
export const DBC_THEORY_STRESS_MATRIX: DbcTheoryConstraint[] = [
  {
    id: 'con-bills',
    label: 'Zero Bills Ever Circulated ($194,200 Missing)',
    fact: 'Not one of the 9,710 unrecovered twenty-dollar bills was ever flagged by banks, casinos, or the Federal Reserve despite nationwide serial distribution.',
    source: 'SRC-01, SRC-09',
    survives: ['perished'],
    strained: ['survived', 'unnamed'],
    fractured: ['inside'],
  },
  {
    id: 'con-tina-bar',
    label: '290 Rotting Bills Found at Tina Bar (1980)',
    fact: 'Three packets ($5,800) were found buried in Columbia River sand 20 miles downstream of the drop zone, with spring-blooming diatoms on the paper.',
    source: 'SRC-09, SRC-10',
    survives: ['perished', 'unnamed'],
    strained: ['survived'],
    fractured: ['inside'],
  },
  {
    id: 'con-dummy',
    label: 'Took the Sewn-Shut Training Reserve Parachute',
    fact: 'Cooper selected the older military-style NB-6 main chute over the sport chute and clipped on a non-functional dummy reserve whose canopy was sewn shut.',
    source: 'SRC-08, SRC-15',
    survives: ['perished', 'unnamed'],
    strained: ['survived', 'inside'],
    fractured: [],
  },
  {
    id: 'con-forest',
    label: 'Zero Body or Parachute Found in 36-Day Sweep',
    fact: '200 Fort Lewis soldiers and FBI agents searched Clark and Cowlitz Counties on foot and by helicopter without finding a canopy, harness, or remains.',
    source: 'SRC-01, SRC-15',
    survives: ['survived', 'unnamed'],
    strained: ['perished', 'inside'],
    fractured: [],
  },
];
