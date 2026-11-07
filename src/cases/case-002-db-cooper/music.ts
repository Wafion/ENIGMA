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

export interface DbcMusicCue {
  track: string | null;
  /** Deck gain before the user's Music fader and master fader. */
  gain: number;
  fadeIn: number;
  fadeOut: number;
  loop: boolean;
  startAt?: number;
}

const CC_BY = 'https://creativecommons.org/licenses/by/4.0/';
const CC_BY_SA = 'https://creativecommons.org/licenses/by-sa/4.0/';
const LIBRARY = 'https://www.scottbuckley.com.au/library/';
const LEMMINO_MUSIC = 'https://www.lemmi.no/music';

/**
 * Documentary Score Register:
 * Combines LEMMiNO investigative documentary cues (licensed CC BY-SA 4.0, including
 * 'Aloft', composed specifically for his D.B. Cooper documentary) and Scott Buckley
 * atmospheric library cues (licensed CC BY 4.0). All tracks carry full composer credits.
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
    usage: 'Prologue & Epilogue; originally composed for the D.B. Cooper investigation.',
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
    usage: 'Flight 305 horizontal trajectory & the NORJAK 60-volume archive.',
    file: '/assets/db-cooper/music/lemmino-cipher.mp3',
    processing: 'Looped and mixed under telemetry and archival room tone.',
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
    usage: 'The Man in Seat 18C & the physical evidence table.',
    file: '/assets/db-cooper/music/lemmino-nocturnal.mp3',
    processing: 'Looped and mixed under subtle witness-room tone.',
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
    usage: 'Two Hours Over Puget Sound (The Ground) & Four Ways to Disappear (The Theories).',
    file: '/assets/db-cooper/music/lemmino-blackout.mp3',
    processing: 'Looped and mixed under rain and radio static.',
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
    usage: 'The Second Takeoff (10,000 feet southbound on airway V-23).',
    file: '/assets/db-cooper/music/lemmino-encounters.mp3',
    processing: 'Looped and mixed under cabin depressurisation drone.',
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
    usage: 'The Search of Clark & Cowlitz Counties and the Lewis River drainage.',
    file: '/assets/db-cooper/music/lemmino-siberian.mp3',
    processing: 'Looped and mixed under timberland wind.',
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
    usage: 'Archival reserve score.',
    file: '/assets/db-cooper/music/sb-undertow.mp3',
    processing: 'Looped and mixed under ambience; encoded at 96 kbps for web delivery.',
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
    usage: 'Archival reserve score.',
    file: '/assets/db-cooper/music/sb-signal-to-noise.mp3',
    processing: 'Looped and mixed under ambience; encoded at 96 kbps for web delivery.',
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
    usage: 'Archival reserve score.',
    file: '/assets/db-cooper/music/sb-reverie.mp3',
    processing: 'Looped and mixed under ambience; encoded at 96 kbps for web delivery.',
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
    usage: 'Archival reserve score.',
    file: '/assets/db-cooper/music/sb-passage-of-time.mp3',
    processing: 'Looped and mixed under ambience; encoded at 96 kbps for web delivery.',
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
    usage: 'The Ground Below (Movement 13 landscape).',
    file: '/assets/db-cooper/music/sb-borealis.mp3',
    processing: 'Looped and mixed under ambience; encoded at 96 kbps for web delivery.',
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
    usage: 'The Named (Movement 11 suspects).',
    file: '/assets/db-cooper/music/sb-beyond-these-walls.mp3',
    processing: 'Looped and mixed under ambience; encoded at 96 kbps for web delivery.',
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
    usage: 'The Shape of the Unknown (Movement 14).',
    file: '/assets/db-cooper/music/sb-unraveling.mp3',
    processing: 'Looped and mixed under ambience; encoded at 96 kbps for web delivery.',
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
    usage: 'Archival reserve score.',
    file: '/assets/db-cooper/music/sb-the-long-way-home.mp3',
    processing: 'Looped and mixed under ambience; encoded at 96 kbps for web delivery.',
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
    usage: 'The Money at Tina Bar (Movement 08).',
    file: '/assets/db-cooper/music/sb-solace.mp3',
    processing: 'Looped and mixed under ambience; encoded at 96 kbps for web delivery.',
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
    usage: 'The Note and the hijacking (Movement 03).',
    file: '/assets/db-cooper/music/sb-the-encounter.mp3',
    processing: 'Looped and mixed under ambience; encoded at 96 kbps for web delivery.',
  },
];

export const DBC_MUSIC_MAP: Record<string, DbcMusicTrack> = Object.fromEntries(
  DBC_MUSIC.map((track) => [track.id, track]),
);

const silence = (fadeOut = 6): DbcMusicCue => ({
  track: null,
  gain: 0,
  fadeIn: 0,
  fadeOut,
  loop: false,
});

/**
 * The score is cued by movement, not by page. Durations vary so the ear hears
 * a directed transition rather than the same fade on every cut.
 */
export const MUSIC_CUES: Record<DbcAudioScene, DbcMusicCue> = {
  prologue: { track: 'lemmino-aloft', gain: 0.46, fadeIn: 6, fadeOut: 6, loop: true },
  man: { track: 'lemmino-nocturnal', gain: 0.36, fadeIn: 5, fadeOut: 5, loop: true },
  flight: { track: 'lemmino-cipher', gain: 0.42, fadeIn: 5, fadeOut: 5, loop: true },
  note: { track: 'the-encounter', gain: 0.38, fadeIn: 4, fadeOut: 4, loop: true },
  ground: { track: 'lemmino-blackout', gain: 0.38, fadeIn: 5, fadeOut: 5, loop: true },
  'second-flight': { track: 'lemmino-encounters', gain: 0.42, fadeIn: 4, fadeOut: 3, loop: true },
  jump: silence(8),
  silence: silence(4),
  search: { track: 'lemmino-siberian', gain: 0.38, fadeIn: 7, fadeOut: 6, loop: true },
  money: { track: 'solace', gain: 0.34, fadeIn: 6, fadeOut: 5, loop: true },
  evidence: { track: 'lemmino-nocturnal', gain: 0.32, fadeIn: 5, fadeOut: 5, loop: true },
  archive: { track: 'lemmino-cipher', gain: 0.34, fadeIn: 6, fadeOut: 6, loop: true },
  suspects: { track: 'beyond-these-walls', gain: 0.36, fadeIn: 6, fadeOut: 5, loop: true },
  theories: { track: 'lemmino-blackout', gain: 0.36, fadeIn: 7, fadeOut: 7, loop: true },
  landscape: { track: 'borealis', gain: 0.30, fadeIn: 8, fadeOut: 6, loop: true },
  unknowns: { track: 'unraveling', gain: 0.16, fadeIn: 9, fadeOut: 8, loop: true },
  epilogue: { track: 'lemmino-aloft', gain: 0.44, fadeIn: 8, fadeOut: 10, loop: true },
  sources: silence(7),
};

export const MUSIC_CUE_LIST = Object.entries(MUSIC_CUES) as [
  DbcAudioScene,
  DbcMusicCue,
][];
