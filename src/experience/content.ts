import { BLAIR_WITCH_CASE } from '../data/blairWitchCase';
import { ASSET_MAP } from '../data/blairWitchAssets';
import type { EnigmaAsset, EnigmaChapter, EnigmaElement } from '../types/enigma';

export interface ChapterMeta {
  id: string;
  number: string;
  shortTitle: string;
  title: string;
  truth: string;
  ambience: string;
  href: string;
}

const chapterAmbience: Record<string, string> = {
  'chapter-01-the-legend': 'aud-room-tone',
  'chapter-02-the-town': 'aud-creek-flow',
  'chapter-03-the-disappearance': 'aud-nocturnal-insects',
  'chapter-04-the-woods': 'aud-forest-wind',
  'chapter-05-the-recordings': 'aud-tape-static',
  'chapter-06-the-real-story': 'aud-room-tone',
  'chapter-07-what-remains': 'NONE',
};

const shortTitles: Record<string, string> = {
  'chapter-01-the-legend': 'The legend',
  'chapter-02-the-town': 'The town',
  'chapter-03-the-disappearance': 'The expedition',
  'chapter-04-the-woods': 'The woods',
  'chapter-05-the-recordings': 'The recordings',
  'chapter-06-the-real-story': 'The real story',
  'chapter-07-what-remains': 'What remains',
};

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 'prologue',
    number: '00',
    shortTitle: 'Prologue',
    title: 'The forest',
    truth: 'A contemporary photograph and a film quotation',
    ambience: 'aud-forest-wind',
    href: '#prologue',
  },
  ...BLAIR_WITCH_CASE.chapters.map((chapter) => ({
    id: chapter.id,
    number: chapter.number,
    shortTitle: shortTitles[chapter.id] ?? chapter.title,
    title: chapter.title,
    truth:
      chapter.truthLayer === 'IN-UNIVERSE MYTHOLOGY'
        ? 'In-universe mythology, constructed 1998–1999'
        : chapter.truthLayer === 'CRITICAL SYNTHESIS'
          ? 'Editorial synthesis'
          : 'Verified history and production record',
    ambience: chapterAmbience[chapter.id] ?? 'aud-room-tone',
    href: `#${chapter.id}`,
  })),
];

export function getChapter(id: string): EnigmaChapter | undefined {
  return BLAIR_WITCH_CASE.chapters.find((chapter) => chapter.id === id);
}

export function getAsset(id: string): EnigmaAsset | undefined {
  return ASSET_MAP[id];
}

export function findElement<T extends EnigmaElement['type']>(
  chapter: EnigmaChapter,
  type: T,
  id?: string,
): Extract<EnigmaElement, { type: T }> | undefined {
  for (const scene of chapter.scenes) {
    for (const composition of scene.compositions) {
      const found = composition.elements.find(
        (element) => element.type === type && (!id || element.id === id),
      );
      if (found) return found as Extract<EnigmaElement, { type: T }>;
    }
  }
  return undefined;
}

export function getAmbience(id: string): string {
  return CHAPTERS.find((chapter) => chapter.id === id)?.ambience ?? 'NONE';
}

export interface ExpeditionDay {
  day: string;
  date: string;
  title: string;
  body: string;
}

/** A plain-language day log derived from the fictional chronology in the case file. */
export const EXPEDITION_DAYS: ExpeditionDay[] = [
  {
    day: '01',
    date: '20 Oct 1994',
    title: 'Arrival in Burkittsville',
    body: 'Heather Donahue, Joshua Leonard and Michael C. Williams conduct town interviews, asking residents about Rustin Parr and the old woman said to have been seen near Tappy East Creek in 1962.',
  },
  {
    day: '02',
    date: '21 Oct 1994',
    title: 'The cemetery and the trailhead',
    body: 'The crew films the Union Cemetery and leaves the car on Route 17. They hike into the Black Hills, following directions toward an overgrown burial ground.',
  },
  {
    day: '03',
    date: '22 Oct 1994',
    title: 'Seven cairns',
    body: 'The crew finds seven small stone piles near an old cemetery. After dark, they hear movement outside the tent. The story’s geometry begins to close around them.',
  },
  {
    day: '04',
    date: '23 Oct 1994',
    title: 'The map in the creek',
    body: 'Lost and exhausted, Michael admits he threw the paper map into a creek. The crew walks south all day using Joshua’s compass, then arrives back at the same log crossing.',
  },
  {
    day: '05',
    date: '24 Oct 1994',
    title: 'The stick figures',
    body: 'Hundreds of woven stick figures are found hanging from the trees. The crew abandons the route and walks through the night. “Twana,” the lore calls them.',
  },
  {
    day: '06',
    date: '25 Oct 1994',
    title: 'Noise in the dark',
    body: 'A child’s voice and a second set of footsteps circle the tent. Heather records an apology to the families. Michael’s behaviour becomes erratic.',
  },
  {
    day: '07',
    date: '26–28 Oct 1994',
    title: 'The house that should not exist',
    body: 'Joshua disappears. The remaining two find the ruins of a woodland house and descend into its cellar. The recovered footage ends with a camera on the floor, facing a corner.',
  },
];

export const RECORDING_SCENE_LABELS: Record<string, string> = {
  'cemetery-slate': 'Cemetery slate',
  'creek-crossing': 'Log crossing',
  'twana-grove': 'Twana grove',
  'tent-apology': 'Tent confession',
  'griggs-cellar': 'Griggs cellar',
};

export interface Statute {
  value: string;
  label: string;
  note: string;
}

export const PRODUCTION_FIGURES: Statute[] = [
  { value: '8', label: 'days of principal photography', note: '23–31 October 1997' },
  { value: '≈20', label: 'hours of raw footage', note: 'edited to 81 minutes' },
  { value: '$35–60k', label: 'reported initial budget', note: 'before acquisition' },
  { value: '$248.6m', label: 'worldwide gross', note: 'on a 1999 wide release' },
];
