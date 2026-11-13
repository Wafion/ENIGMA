import type { DbcAudioScene } from './content';

export interface DbcMusicTrack {
  id: string;
  title: string;
  artist: string;
  composer: string;
  source: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  attributionRequired: boolean;
  attributionText: string;
  date: string;
  dateAccessed: string;
  usage: string;
  file: string;
  processing: string;
}

/**
 * The score has four recurring identities, not one song per chapter.
 * A cue may carry a theme, refuse it (silence), or hand it to a variation.
 */
export type DbcScoreTheme = 'case' | 'man' | 'jump' | 'aftermath' | 'unknown' | 'silence';

export interface DbcScoreThemeDefinition {
  label: string;
  note: string;
}

export const SCORE_THEMES: Record<DbcScoreTheme, DbcScoreThemeDefinition> = {
  case: {
    label: 'THE CASE',
    note: 'The restrained investigative spine. It opens the file, becomes a system in the archive, and returns at the close.',
  },
  man: {
    label: 'THE MAN',
    note: 'Human, ambiguous, never fully resolved. It fractures into a suspicion variation when names are attached.',
  },
  jump: {
    label: 'THE JUMP',
    note: 'Aircraft, altitude, the note, the aft stairs. One continuous hijacking texture rather than four separate cues.',
  },
  aftermath: {
    label: 'THE AFTERMATH',
    note: 'The first human breath after the search: discovery, nine years late, held without triumph.',
  },
  unknown: {
    label: 'THE UNKNOWN',
    note: 'Cold, wide, unresolved. The search, the landscape, and the questions that remain.',
  },
  silence: {
    label: 'SILENCE',
    note: 'The score steps out. Wind, room tone, and the record carry the moment.',
  },
};

export interface DbcMusicCue {
  track: string | null;
  theme: DbcScoreTheme;
  /** Directorial note: why this cue exists, and what it must not do. */
  intent: string;
  /** Deck gain before the user's Music fader and master fader. */
  gain: number;
  fadeIn: number;
  fadeOut: number;
  loop: boolean;
  startAt?: number;
}

export interface DbcScoreArc {
  id: string;
  theme: DbcScoreTheme;
  track: string | null;
  scenes: DbcAudioScene[];
  intent: string;
}

const CC_BY = 'https://creativecommons.org/licenses/by/4.0/';
const CC_BY_SA = 'https://creativecommons.org/licenses/by-sa/4.0/';
const LIBRARY = 'https://www.scottbuckley.com.au/library/';
const LEMMINO_MUSIC = 'https://www.lemmi.no/music';

/**
 * Documentary Score Register:
 * LEMMiNO investigative cues (CC BY-SA 4.0, including 'Aloft', composed for his
 * D.B. Cooper documentary) and Scott Buckley atmospheric cues (CC BY 4.0).
 * Only the tracks named in DBC_SCORE_ARCS are cued in the current cut; the rest
 * remain in the register as licensed reserve material.
 */
export const DBC_MUSIC: DbcMusicTrack[] = [
  {
    id: 'lemmino-aloft',
    title: 'Aloft',
    artist: 'LEMMiNO',
    composer: 'David Wångstedt (LEMMiNO)',
    source: 'LEMMiNO Official Music Library',
    sourceUrl: LEMMINO_MUSIC,
    license: 'CC BY-SA 4.0',
    licenseUrl: CC_BY_SA,
    attributionRequired: true,
    attributionText: 'Music: “Aloft” by LEMMiNO — https://www.lemmi.no/music — licensed under CC BY-SA 4.0.',
    date: '2019',
    dateAccessed: '7 November 2026',
    usage: 'THE CASE: prologue and epilogue. The score opens and closes on the same theme.',
    file: '/assets/db-cooper/music/lemmino-aloft.mp3',
    processing: 'Looped and crossfaded under procedural aircraft & Pacific Northwest ambience.',
  },
  {
    id: 'lemmino-cipher',
    title: 'Cipher',
    artist: 'LEMMiNO',
    composer: 'David Wångstedt (LEMMiNO)',
    source: 'LEMMiNO Official Music Library',
    sourceUrl: LEMMINO_MUSIC,
    license: 'CC BY-SA 4.0',
    licenseUrl: CC_BY_SA,
    attributionRequired: true,
    attributionText: 'Music: “Cipher” by LEMMiNO — https://www.lemmi.no/music — licensed under CC BY-SA 4.0.',
    date: '2018',
    dateAccessed: '7 November 2026',
    usage: 'THE CASE, investigative variation: the NORJAK archive.',
    file: '/assets/db-cooper/music/lemmino-cipher.mp3',
    processing: 'Looped and mixed under archival room tone and paper handling.',
  },
  {
    id: 'lemmino-nocturnal',
    title: 'Nocturnal',
    artist: 'LEMMiNO',
    composer: 'David Wångstedt (LEMMiNO)',
    source: 'LEMMiNO Official Music Library',
    sourceUrl: LEMMINO_MUSIC,
    license: 'CC BY-SA 4.0',
    licenseUrl: CC_BY_SA,
    attributionRequired: true,
    attributionText: 'Music: “Nocturnal” by LEMMiNO — https://www.lemmi.no/music — licensed under CC BY-SA 4.0.',
    date: '2020',
    dateAccessed: '7 November 2026',
    usage:
      'THE MAN: the Seat 18C portrait and the note, then the trace evidence and the named suspects that came back.',
    file: '/assets/db-cooper/music/lemmino-nocturnal.mp3',
    processing: 'Looped and mixed under subtle witness-room and laboratory tone.',
  },
  {
    id: 'lemmino-blackout',
    title: 'Blackout',
    artist: 'LEMMiNO',
    composer: 'David Wångstedt (LEMMiNO)',
    source: 'LEMMiNO Official Music Library',
    sourceUrl: LEMMINO_MUSIC,
    license: 'CC BY-SA 4.0',
    licenseUrl: CC_BY_SA,
    attributionRequired: true,
    attributionText: 'Music: “Blackout” by LEMMiNO — https://www.lemmi.no/music — licensed under CC BY-SA 4.0.',
    date: '2018',
    dateAccessed: '7 November 2026',
    usage: 'Reserve. Held as a darker variation; not cued in the current cut.',
    file: '/assets/db-cooper/music/lemmino-blackout.mp3',
    processing: 'Licensed reserve material; not used in the current mix.',
  },
  {
    id: 'lemmino-encounters',
    title: 'Encounters',
    artist: 'LEMMiNO',
    composer: 'David Wångstedt (LEMMiNO)',
    source: 'LEMMiNO Official Music Library',
    sourceUrl: LEMMINO_MUSIC,
    license: 'CC BY-SA 4.0',
    licenseUrl: CC_BY_SA,
    attributionRequired: true,
    attributionText: 'Music: “Encounters” by LEMMiNO — https://www.lemmi.no/music — licensed under CC BY-SA 4.0.',
    date: '2018',
    dateAccessed: '7 November 2026',
    usage:
      'THE JUMP, escalation: the second takeoff, the aft stairs, and the search that follows. A darker variation after the long first-phase hijack cue.',
    file: '/assets/db-cooper/music/lemmino-encounters.mp3',
    processing: 'Looped across the second flight, the jump, and the search; the score drops with the wind at the aft stairs and returns over the ground search.',
  },
  {
    id: 'lemmino-siberian',
    title: 'Siberian',
    artist: 'LEMMiNO',
    composer: 'David Wångstedt (LEMMiNO)',
    source: 'LEMMiNO Official Music Library',
    sourceUrl: LEMMINO_MUSIC,
    license: 'CC BY-SA 4.0',
    licenseUrl: CC_BY_SA,
    attributionRequired: true,
    attributionText: 'Music: “Siberian” by LEMMiNO — https://www.lemmi.no/music — licensed under CC BY-SA 4.0.',
    date: '2019',
    dateAccessed: '7 November 2026',
    usage: 'THE UNKNOWN: the landscape below the drop zone.',
    file: '/assets/db-cooper/music/lemmino-siberian.mp3',
    processing: 'Looped and mixed under timberland wind; the geographic variation of the unknown.',
  },
  {
    id: 'undertow',
    title: 'Undertow',
    artist: 'Scott Buckley',
    composer: 'Scott Buckley',
    source: 'Scott Buckley Creative Commons Music Library',
    sourceUrl: `${LIBRARY}undertow/`,
    license: 'CC BY 4.0',
    licenseUrl: CC_BY,
    attributionRequired: true,
    attributionText: '‘Undertow’ by Scott Buckley – released under CC-BY 4.0. www.scottbuckley.com.au',
    date: '13 December 2019',
    dateAccessed: '5 November 2026',
    usage: 'Reserve. Licensed material held outside the current score.',
    file: '/assets/db-cooper/music/sb-undertow.mp3',
    processing: 'Licensed reserve material; not used in the current mix.',
  },
  {
    id: 'signal-to-noise',
    title: 'Signal to Noise',
    artist: 'Scott Buckley',
    composer: 'Scott Buckley',
    source: 'Scott Buckley Creative Commons Music Library',
    sourceUrl: `${LIBRARY}signal-to-noise/`,
    license: 'CC BY 4.0',
    licenseUrl: CC_BY,
    attributionRequired: true,
    attributionText:
      '‘Signal to Noise’ by Scott Buckley – released under CC-BY 4.0. www.scottbuckley.com.au',
    date: '24 April 2020',
    dateAccessed: '5 November 2026',
    usage: 'Reserve. Licensed material held outside the current score.',
    file: '/assets/db-cooper/music/sb-signal-to-noise.mp3',
    processing: 'Licensed reserve material; not used in the current mix.',
  },
  {
    id: 'reverie',
    title: 'Reverie',
    artist: 'Scott Buckley',
    composer: 'Scott Buckley',
    source: 'Scott Buckley Creative Commons Music Library',
    sourceUrl: `${LIBRARY}reverie/`,
    license: 'CC BY 4.0',
    licenseUrl: CC_BY,
    attributionRequired: true,
    attributionText: '‘Reverie’ by Scott Buckley – released under CC-BY 4.0. www.scottbuckley.com.au',
    date: '28 March 2020',
    dateAccessed: '5 November 2026',
    usage: 'Reserve. Licensed material held outside the current score.',
    file: '/assets/db-cooper/music/sb-reverie.mp3',
    processing: 'Licensed reserve material; not used in the current mix.',
  },
  {
    id: 'passage-of-time',
    title: 'Passage of Time',
    artist: 'Scott Buckley',
    composer: 'Scott Buckley',
    source: 'Scott Buckley Creative Commons Music Library',
    sourceUrl: `${LIBRARY}passage-of-time/`,
    license: 'CC BY 4.0',
    licenseUrl: CC_BY,
    attributionRequired: true,
    attributionText:
      '‘Passage of Time’ by Scott Buckley – released under CC-BY 4.0. www.scottbuckley.com.au',
    date: '29 January 2022',
    dateAccessed: '5 November 2026',
    usage: 'Reserve. Licensed material held outside the current score.',
    file: '/assets/db-cooper/music/sb-passage-of-time.mp3',
    processing: 'Licensed reserve material; not used in the current mix.',
  },
  {
    id: 'borealis',
    title: 'Borealis',
    artist: 'Scott Buckley',
    composer: 'Scott Buckley',
    source: 'Scott Buckley Creative Commons Music Library',
    sourceUrl: `${LIBRARY}borealis/`,
    license: 'CC BY 4.0',
    licenseUrl: CC_BY,
    attributionRequired: true,
    attributionText: '‘Borealis’ by Scott Buckley – released under CC-BY 4.0. www.scottbuckley.com.au',
    date: '28 September 2019',
    dateAccessed: '5 November 2026',
    usage: 'Reserve. Licensed material held outside the current score.',
    file: '/assets/db-cooper/music/sb-borealis.mp3',
    processing: 'Licensed reserve material; not used in the current mix.',
  },
  {
    id: 'beyond-these-walls',
    title: 'Beyond These Walls',
    artist: 'Scott Buckley',
    composer: 'Scott Buckley',
    source: 'Scott Buckley Creative Commons Music Library',
    sourceUrl: `${LIBRARY}beyond-these-walls/`,
    license: 'CC BY 4.0',
    licenseUrl: CC_BY,
    attributionRequired: true,
    attributionText:
      '‘Beyond These Walls’ by Scott Buckley – released under CC-BY 4.0. www.scottbuckley.com.au',
    date: '1 May 2021',
    dateAccessed: '5 November 2026',
    usage: 'THE MAN, suspicion variation: the four theories that follow the named suspects.',
    file: '/assets/db-cooper/music/sb-beyond-these-walls.mp3',
    processing: 'Looped across the suspects and theories; the same bed tightens rather than restarts.',
  },
  {
    id: 'unraveling',
    title: 'Unraveling',
    artist: 'Scott Buckley',
    composer: 'Scott Buckley',
    source: 'Scott Buckley Creative Commons Music Library',
    sourceUrl: `${LIBRARY}unraveling/`,
    license: 'CC BY 4.0',
    licenseUrl: CC_BY,
    attributionRequired: true,
    attributionText:
      '‘Unraveling’ by Scott Buckley – released under CC-BY 4.0. www.scottbuckley.com.au',
    date: '26 May 2026',
    dateAccessed: '5 November 2026',
    usage: 'THE UNKNOWN: the closing questions; sparse and unresolved.',
    file: '/assets/db-cooper/music/sb-unraveling.mp3',
    processing: 'Looped at low level; the score steps back and leaves the questions open.',
  },
  {
    id: 'the-long-way-home',
    title: 'The Long Way Home',
    artist: 'Scott Buckley',
    composer: 'Scott Buckley',
    source: 'Scott Buckley Creative Commons Music Library',
    sourceUrl: `${LIBRARY}the-long-way-home/`,
    license: 'CC BY 4.0',
    licenseUrl: CC_BY,
    attributionRequired: true,
    attributionText:
      '‘The Long Way Home’ by Scott Buckley – released under CC-BY 4.0. www.scottbuckley.com.au',
    date: '29 May 2021',
    dateAccessed: '5 November 2026',
    usage: 'Reserve. Licensed material held outside the current score.',
    file: '/assets/db-cooper/music/sb-the-long-way-home.mp3',
    processing: 'Licensed reserve material; not used in the current mix.',
  },
  {
    id: 'solace',
    title: 'Solace',
    artist: 'Scott Buckley',
    composer: 'Scott Buckley',
    source: 'Scott Buckley Creative Commons Music Library',
    sourceUrl: `${LIBRARY}solace/`,
    license: 'CC BY 4.0',
    licenseUrl: CC_BY,
    attributionRequired: true,
    attributionText: '‘Solace’ by Scott Buckley – released under CC-BY 4.0. www.scottbuckley.com.au',
    date: '22 May 2020',
    dateAccessed: '5 November 2026',
    usage: 'THE AFTERMATH: the Tina Bar money find, nine years after the jump.',
    file: '/assets/db-cooper/music/sb-solace.mp3',
    processing: 'Looped and mixed under river ambience; the first warm cue after the search.',
  },
  {
    id: 'the-encounter',
    title: 'The Encounter (Monomyth)',
    artist: 'Scott Buckley',
    composer: 'Scott Buckley',
    source: 'Scott Buckley Creative Commons Music Library',
    sourceUrl: `${LIBRARY}the-encounter/`,
    license: 'CC BY 4.0',
    licenseUrl: CC_BY,
    attributionRequired: true,
    attributionText:
      '‘The Encounter’ by Scott Buckley – released under CC-BY 4.0. www.scottbuckley.com.au',
    date: '3 July 2019',
    dateAccessed: '5 November 2026',
    usage: 'THE JUMP, first phase: Flight 305 and the ground hold.',
    file: '/assets/db-cooper/music/sb-the-encounter.mp3',
    processing: 'Carried across the first hijack movements; long-form so the sequence does not loop back on itself.',
  },
];

export const DBC_MUSIC_MAP: Record<string, DbcMusicTrack> = Object.fromEntries(
  DBC_MUSIC.map((track) => [track.id, track]),
);

/**
 * The musical arc, written as carries rather than chapter assignments.
 * Read this before changing a cue: a scene boundary is not a musical reason.
 */
export const DBC_SCORE_ARCS: DbcScoreArc[] = [
  {
    id: 'arc-case',
    theme: 'case',
    track: 'lemmino-aloft',
    scenes: ['prologue', 'epilogue'],
    intent: 'THE CASE bookends the documentary. The same theme returns changed by the investigation, not repeated as a reset.',
  },
  {
    id: 'arc-man',
    theme: 'man',
    track: 'lemmino-nocturnal',
    scenes: ['man', 'note', 'evidence', 'suspects'],
    intent: 'THE MAN is first a portrait, then a note, then a trace, then a name: the tie, the prints, the partial profile, the suspects. One identity at different distances.',
  },
  {
    id: 'arc-hijack',
    theme: 'jump',
    track: 'the-encounter',
    scenes: ['flight', 'ground'],
    intent: 'THE JUMP begins as a long-form hijack texture with the aircraft. The ground hold develops inside the same track rather than restarting at the section break.',
  },
  {
    id: 'arc-jump-escalation',
    theme: 'jump',
    track: 'lemmino-encounters',
    scenes: ['second-flight', 'jump', 'search'],
    intent: 'The second takeoff is the musical turn: a darker, tenser variation of the same hijack. It carries through the aft stairs and the search, then yields only when the money surfaces.',
  },
  {
    id: 'arc-aftermath',
    theme: 'aftermath',
    track: 'solace',
    scenes: ['money'],
    intent: 'THE AFTERMATH is the first human breath after the search. It arrives only when the money surfaces.',
  },
  {
    id: 'arc-archive',
    theme: 'case',
    track: 'lemmino-cipher',
    scenes: ['archive'],
    intent: 'THE CASE becomes a system: sixty volumes, a filing method, an investigation that outlives its subject.',
  },
  {
    id: 'arc-suspicion',
    theme: 'man',
    track: 'beyond-these-walls',
    scenes: ['theories'],
    intent: 'After the named suspects, THE MAN fractures into theories. They are variations on the same unresolved man, not four new songs.',
  },
  {
    id: 'arc-unknown',
    theme: 'unknown',
    track: 'lemmino-siberian',
    scenes: ['landscape'],
    intent: 'THE UNKNOWN opens geographically over the ground below: one cold, wide theme.',
  },
  {
    id: 'arc-unresolved',
    theme: 'unknown',
    track: 'unraveling',
    scenes: ['unknowns'],
    intent: 'THE UNKNOWN turns inward at the close: sparse, unresolved, almost atmospheric.',
  },
  {
    id: 'arc-silence',
    theme: 'silence',
    track: null,
    scenes: ['silence', 'sources'],
    intent: 'The score steps out after the jump and over the register. Wind, room tone, and the record carry the moment.',
  },
];

const silence = (
  fadeOut = 6,
  intent = 'The score steps out; ambience and the record carry the moment.',
): DbcMusicCue => ({
  track: null,
  theme: 'silence',
  intent,
  gain: 0,
  fadeIn: 0,
  fadeOut,
  loop: false,
});

/**
 * Cues are keyed by scene because the engine needs a lookup, but they are
 * written as a continuous score. Repeating a track across consecutive scenes
 * is intentional: the engine ramps gain without restarting the file.
 */
export const MUSIC_CUES: Record<DbcAudioScene, DbcMusicCue> = {
  prologue: {
    track: 'lemmino-aloft',
    theme: 'case',
    intent: 'Open on THE CASE, restrained: aviation and night air, no threat yet.',
    gain: 0.4,
    fadeIn: 7,
    fadeOut: 7,
    loop: true,
  },
  man: {
    track: 'lemmino-nocturnal',
    theme: 'man',
    intent: 'Move from the case to THE MAN: human, ambiguous, close enough to study and still out of reach.',
    gain: 0.34,
    fadeIn: 6,
    fadeOut: 6,
    loop: true,
  },
  flight: {
    track: 'the-encounter',
    theme: 'jump',
    intent: 'THE JUMP enters with the aircraft: procedure, altitude, and the first edge of danger. Long-form, not a loop of the later escalation.',
    gain: 0.34,
    fadeIn: 5,
    fadeOut: 5,
    loop: true,
  },
  note: {
    track: 'lemmino-nocturnal',
    theme: 'man',
    intent: 'No new song at the section break. THE MAN continues under the note; the hijack texture waits for the aircraft.',
    gain: 0.34,
    fadeIn: 6,
    fadeOut: 6,
    loop: true,
  },
  ground: {
    track: 'the-encounter',
    theme: 'jump',
    intent: 'Carry the hijack bed through the ground hold; radio, rain, and waiting do the local work.',
    gain: 0.36,
    fadeIn: 3,
    fadeOut: 5,
    loop: true,
  },
  'second-flight': {
    track: 'lemmino-encounters',
    theme: 'jump',
    intent: 'A genuine musical turn: the second takeoff is a darker, tenser variation, not another section restart.',
    gain: 0.42,
    fadeIn: 5,
    fadeOut: 6,
    loop: true,
  },
  jump: {
    track: 'lemmino-encounters',
    theme: 'jump',
    intent: 'Carry the escalation to the aft stairs and through the record that follows; the cue runs unbroken into the search and lets go only when the money surfaces.',
    gain: 0.3,
    fadeIn: 5,
    fadeOut: 4,
    loop: true,
  },
  silence: silence(4, 'Intentional quiet before the search finds its footing.'),
  search: {
    track: 'lemmino-encounters',
    theme: 'jump',
    intent: 'THE JUMP carries into the search: cold ground, no musical reset. The same escalation continues until the money surfaces.',
    gain: 0.3,
    fadeIn: 5,
    fadeOut: 6,
    loop: true,
  },
  money: {
    track: 'solace',
    theme: 'aftermath',
    intent: 'The first human breath after the search: discovery, nine years late, held without triumph.',
    gain: 0.3,
    fadeIn: 7,
    fadeOut: 6,
    loop: true,
  },
  evidence: {
    track: 'lemmino-nocturnal',
    theme: 'man',
    intent: 'THE MAN returns as trace evidence: the tie, the prints, the partial profile. Quiet and forensic.',
    gain: 0.28,
    fadeIn: 6,
    fadeOut: 5,
    loop: true,
  },
  archive: {
    track: 'lemmino-cipher',
    theme: 'case',
    intent: 'THE CASE as a system: sixty volumes, a filing method, an investigation that outlives its subject.',
    gain: 0.32,
    fadeIn: 6,
    fadeOut: 6,
    loop: true,
  },
  suspects: {
    track: 'lemmino-nocturnal',
    theme: 'man',
    intent: 'No new song. THE MAN moves from trace evidence to names; the same portrait holds under suspicion.',
    gain: 0.28,
    fadeIn: 6,
    fadeOut: 5,
    loop: true,
  },
  theories: {
    track: 'beyond-these-walls',
    theme: 'man',
    intent: 'Stay with the same suspicion texture. Four theories are variations on one unresolved man, not four songs.',
    gain: 0.38,
    fadeIn: 3,
    fadeOut: 6,
    loop: true,
  },
  landscape: {
    track: 'lemmino-siberian',
    theme: 'unknown',
    intent: 'THE UNKNOWN returns geographically. The same cold theme widens over the ground below.',
    gain: 0.26,
    fadeIn: 8,
    fadeOut: 6,
    loop: true,
  },
  unknowns: {
    track: 'unraveling',
    theme: 'unknown',
    intent: 'Sparse and unresolved. The score stops arguing and leaves the questions open.',
    gain: 0.18,
    fadeIn: 9,
    fadeOut: 8,
    loop: true,
  },
  epilogue: {
    track: 'lemmino-aloft',
    theme: 'case',
    intent: 'THE CASE returns, changed by everything in between. A bookend, not a repeat.',
    gain: 0.36,
    fadeIn: 9,
    fadeOut: 10,
    loop: true,
  },
  sources: silence(7, 'No score over the register. Room tone, paper, and provenance only.'),
};

export const MUSIC_CUE_LIST = Object.entries(MUSIC_CUES) as [
  DbcAudioScene,
  DbcMusicCue,
][];
