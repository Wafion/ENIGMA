import {
  BLAIR_WITCH_ASSETS,
  BLAIR_WITCH_SOURCES,
} from '../data/blairWitchAssets';
import { BLAIR_WITCH_CASE } from '../data/blairWitchCase';
import { EXPEDITION_DAYS, PRODUCTION_FIGURES } from '../experience/content';
import {
  AIRCRAFT_FACTS,
  CLOTHING,
  CREW,
  DEMANDS,
  EPILOGUE_PROSE,
  EVIDENCE as DBC_EVIDENCE,
  MAN_FACTS,
  MAN_PROSE,
  MONEY_PROSE,
  NOTE_TEXT,
  SEARCH_PROSE,
  SUSPECTS,
  SUSPECT_NOTE,
  THEORIES,
  TIMELINE as DBC_TIMELINE,
  UNKNOWNS,
} from '../cases/case-002-db-cooper/content';
import { DBC_SOURCES } from '../cases/case-002-db-cooper/sources';
import type { TimelineEventItem } from '../types/enigma';

export interface DossierTimelineEntry {
  id: string;
  dateOrTime: string;
  title: string;
  trackLabel: string;
  location: string;
  summary: string;
  verificationNote: string;
  sourceCode?: string;
}

export interface DossierEvidenceEntry {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  status: string;
  summary: string;
  facts: string[];
  limits: string[];
  source: string;
  imagePath?: string;
}

export interface DossierTranscriptEntry {
  id: string;
  code: string;
  title: string;
  dateLabel: string;
  provenance: string;
  excerpts: string[];
  verdict: string;
}

export interface DossierTheoryOrSuspect {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  summary: string;
  support: string[];
  contradict: string[];
  verdict: string;
  source?: string;
}

export interface DossierSourceEntry {
  code: string;
  title: string;
  publisher: string;
  date: string;
  category: string;
  url: string;
  note: string;
}

export interface FurtherReadingEntry {
  title: string;
  authorOrOrigin: string;
  note: string;
}

export interface CaseDossierData {
  slug: 'blair-witch' | 'db-cooper';
  caseNumber: string;
  title: string;
  subtitle: string;
  location: string;
  timeframe: string;
  classification: string;
  heroImage: string;
  heroAlt: string;
  overviewParagraphs: string[];
  keyFigures: { value: string; label: string; note: string }[];
  timelineIntro: string;
  timeline: DossierTimelineEntry[];
  evidenceIntro: string;
  evidence: DossierEvidenceEntry[];
  transcriptIntro: string;
  transcripts: DossierTranscriptEntry[];
  theoriesIntro: string;
  theories: DossierTheoryOrSuspect[];
  sourcesIntro: string;
  sources: DossierSourceEntry[];
  furtherReading: FurtherReadingEntry[];
  credits: string[];
  relatedCaseSlug: 'blair-witch' | 'db-cooper';
  relatedCaseLabel: string;
  relatedCaseReason: string;
}

function extractBlairWitchTimeline(): DossierTimelineEntry[] {
  const ch6 = BLAIR_WITCH_CASE.chapters.find((c) => c.id === 'chapter-06-media-virus');
  const rawItems: TimelineEventItem[] = [];
  if (ch6) {
    for (const scene of ch6.scenes) {
      for (const comp of scene.compositions) {
        for (const el of comp.elements) {
          if (el.type === 'timeline') {
            rawItems.push(...el.items);
          }
        }
      }
    }
  }

  const dualTrack: DossierTimelineEntry[] = rawItems.map((item) => ({
    id: item.id,
    dateOrTime: item.date,
    title: item.title,
    trackLabel: item.layer === 'fictional-lore' ? 'In-Universe Mythology' : 'Verified Historical Record',
    location: item.location,
    summary: item.summary,
    verificationNote: item.verificationNote,
    sourceCode: item.sourceCode,
  }));

  const expeditionEntries: DossierTimelineEntry[] = EXPEDITION_DAYS.map((d) => ({
    id: `exp-day-${d.day}`,
    dateOrTime: `Day ${d.day} · ${d.date}`,
    title: d.title,
    trackLabel: 'Fictional Expedition Log (In-Universe 1994)',
    location: 'Black Hills Forest (Filmed in Seneca Creek & Patapsco Valley, MD)',
    summary: d.body,
    verificationNote: 'Simulated 1994 expedition arc improvised in October 1997 from GPS waypoints.',
    sourceCode: 'SRC-03',
  }));

  return [...dualTrack, ...expeditionEntries];
}

function extractBlairWitchTranscripts(): DossierTranscriptEntry[] {
  const entries: DossierTranscriptEntry[] = [];
  for (const chapter of BLAIR_WITCH_CASE.chapters) {
    for (const scene of chapter.scenes) {
      for (const comp of scene.compositions) {
        for (const el of comp.elements) {
          if (el.type === 'document') {
            entries.push({
              id: el.id,
              code: el.dossierCode,
              title: el.title,
              dateLabel: el.inUniverseDate,
              provenance: el.realCreationContext,
              excerpts: el.transcriptExcerpt,
              verdict: el.factCheckVerdict,
            });
          }
        }
      }
    }
  }
  return entries;
}

function buildBlairWitchDossier(): CaseDossierData {
  const timeline = extractBlairWitchTimeline();
  const transcripts = extractBlairWitchTranscripts();

  const evidence: DossierEvidenceEntry[] = [
    {
      id: 'bw-ev-01',
      code: 'E-01',
      title: 'Town of Blair (1785) vs. Burkittsville (1824)',
      subtitle: 'National Register & 1858 Isaac Bond survey record',
      status: 'FICTIONAL LORE CONTRASTED WITH RECORD',
      summary:
        'BlairWitch.com claimed Burkittsville was founded atop an abandoned settlement named Blair following the 1785 banishment of Elly Kedward. Primary land and survey archives show no colonial town named Blair.',
      facts: [
        'Burkittsville was platted in 1824 by Major Henry Burkitt and Joshua Harley along South Mountain (SRC-01).',
        'No witchcraft trials or banishments appear in Frederick County colonial records (SRC-01, SRC-02).',
      ],
      limits: [
        'The fictional timeline borrowed real mid-Atlantic vernal geography to appear historically continuous.',
      ],
      source: 'SRC-01, SRC-02, SRC-04',
      imagePath: '/assets/blair-witch/images/burkittsville-main-street.jpg',
    },
    {
      id: 'bw-ev-02',
      code: 'E-02',
      title: 'Seneca Creek & Coffin Rock Outcrop',
      subtitle: 'Montgomery County filming corridor mapped against fictional Black Hills',
      status: 'CONFIRMED LOCATION RECORD',
      summary:
        'While the cover narrative set the 1994 student disappearance north of Burkittsville, principal photography occurred ~25 miles southeast inside Seneca Creek State Park.',
      facts: [
        'Over eight days (23–31 October 1997), three actors carried a CP-16 16mm camera and Sony Hi8 camcorder between hidden GPS waypoints (SRC-03).',
        'About 20 hours of raw improvised footage were edited down to an 81-minute feature (SRC-03, SRC-07).',
      ],
      limits: [
        'No waterway named Tappy East Creek or documented 1886 murder site exists in Burkittsville.',
      ],
      source: 'SRC-03, SRC-07',
      imagePath: '/assets/blair-witch/images/seneca-creek-woods.jpg',
    },
    {
      id: 'bw-ev-03',
      code: 'E-03',
      title: 'The Historic Griggs House (c. 1850)',
      subtitle: 'Patapsco Valley State Park climax location',
      status: 'VERIFIED ARCHITECTURAL RECORD',
      summary:
        'The cellar where the final reel ends was filmed on 31 October 1997 inside the abandoned c. 1850 Griggs House in Granite, Maryland — demolished by the state in December 1999.',
      facts: [
        'In-universe lore held that Rustin Parr’s house had burned in 1941, making its appearance on Night 5 deliberately impossible (SRC-04, SRC-05).',
        'Maryland DNR demolished the deteriorating Griggs structure in December 1999 after post-release crowding (SRC-07).',
      ],
      limits: [
        'Only photographic documentation and archival survey notes remain on site today.',
      ],
      source: 'SRC-07',
      imagePath: '/assets/blair-witch/images/griggs-house-ruin.jpg',
    },
    {
      id: 'bw-ev-04',
      code: 'E-04',
      title: 'Missing Persons Flyers & IMDb Disappearance Credit',
      subtitle: 'Sundance 1999 viral frame',
      status: 'PRODUCTION MARKETING ARTIFACT',
      summary:
        'Prior to wide theatrical distribution, Haxan Films and Artisan distributed missing-student leaflets at Park City and listed Heather Donahue, Joshua Leonard, and Michael C. Williams as missing, presumed dead.',
      facts: [
        'Launched in June 1998, BlairWitch.com presented faux crime-scene reels and police chronology without naming a feature film (SRC-04).',
        'Curse of the Blair Witch aired on the Sci-Fi Channel in July 1999, adding staged academic commentary and prop documents (SRC-05).',
      ],
      limits: [
        'As publicity expanded in summer 1999, national press and actor interviews resolved the premise as fiction.',
      ],
      source: 'SRC-04, SRC-05, SRC-06',
    },
  ];

  const theories: DossierTheoryOrSuspect[] = [
    {
      id: 'bw-layer-lore',
      code: 'A-01',
      title: 'The Pre-Web Information Vacuum',
      subtitle: 'How dial-up web architecture sustained a realistic hoax',
      summary:
        'In early 1999, consumer search engines could not instantaneously surface social media profiles or behind-the-scenes clips from cast smartphones. BlairWitch.com filled the entire search result horizon for "Elly Kedward" and "Rustin Parr."',
      support: [
        'IMDb temporarily reflected the actors as missing, reinforcing initial viewer searches (SRC-06).',
        'Mockumentary television (Curse of the Blair Witch) corroborated website entries across a second medium (SRC-05).',
      ],
      contradict: [
        'Local Maryland historical societies and county property records immediately disproved the 1785 Blair settlement claim (SRC-01).',
      ],
      verdict: 'Effective because cross-verification still required physical archives rather than instant web lookup.',
      source: 'SRC-01, SRC-04, SRC-06',
    },
    {
      id: 'bw-layer-method',
      code: 'A-02',
      title: 'GPS Waypoint Method Directing',
      subtitle: 'Authentic disorientation inside scripted rails',
      summary:
        'Directors Daniel Myrick and Eduardo Sánchez reduced crew fatigue simulation by leaving sealed milk-crate directives and GPS coordinates in Seneca Creek State Park, ensuring unfeigned exhaustion on camera.',
      support: [
        'Actors operated the CP-16 16mm camera and Hi8 camcorder directly without boom operators on frame (SRC-03).',
        'Minimal script pages forced spontaneous dialogue across Day 01 to Day 07 (SRC-03).',
      ],
      contradict: [
        'Because safety teams tracked GPS locations and staged props like stick figures at night, the shoot remained tightly controlled filmmaking.',
      ],
      verdict: 'Real behavioral stress inside manufactured folklore created documentary texture.',
      source: 'SRC-03, SRC-07',
    },
  ];

  const sources: DossierSourceEntry[] = BLAIR_WITCH_SOURCES.map((s) => ({
    code: s.code,
    title: s.title,
    publisher: s.authorOrPublisher,
    date: s.publicationDate,
    category: s.category,
    url: s.url,
    note: s.verificationNote,
  }));

  return {
    slug: 'blair-witch',
    caseNumber: '001',
    title: 'The Blair Witch Incident',
    subtitle: 'Found footage, fabricated archive, real Maryland woods',
    location: 'Burkittsville & Seneca Creek, Maryland',
    timeframe: '1785 lore · 1997 shoot · 1999 release',
    classification: 'Cultural Hoax & Found-Footage Record',
    heroImage: '/assets/blair-witch/images/seneca-creek-woods.jpg',
    heroAlt: 'Hardwood forest in Seneca Creek State Park, Maryland, where principal photography took place in October 1997.',
    overviewParagraphs: [
      'ENIGMA Case 001 examines how Haxan Films and Artisan Entertainment constructed a two-century Maryland witchcraft mythology ahead of The Blair Witch Project’s 1999 theatrical release.',
      'Unlike an unsolved criminal disappearance, this dossier audits an intentional digital hoax: separating the invented 1785–1994 folklore published on BlairWitch.com from the actual eight-day October 1997 production in Seneca Creek State Park and Patapsco Valley State Park.',
    ],
    keyFigures: PRODUCTION_FIGURES,
    timelineIntro:
      'Dual-track chronology comparing the fictional 1785–1995 Blair Witch mythology against verified Maryland historical records and October 1997 production milestones.',
    timeline,
    evidenceIntro:
      'Physical locations, prop publications, and archival discrepancies verified against Maryland Historical Trust surveys and park records.',
    evidence,
    transcriptIntro:
      'Primary in-universe documents contrasted line by line with their real 1997–1999 production origin.',
    transcripts,
    theoriesIntro:
      'Media-forensic examination of why the 1999 campaign convinced early audiences and how its production method differed from traditional studio horror.',
    theories,
    sourcesIntro:
      'Every claim in Case 001 traces back to historical county surveys, National Register nominations, contemporaneous 1999 journalism, and production records.',
    sources,
    furtherReading: [
      {
        title: 'National Register Nomination: Burkittsville Historic District (F-2-41)',
        authorOrOrigin: 'Maryland Historical Trust (1975)',
        note: 'Foundational survey establishing Burkittsville’s 1824 platting and Civil War hospital history.',
      },
      {
        title: '1858 Map of Frederick County, Maryland',
        authorOrOrigin: 'Isaac Bond · Library of Congress',
        note: 'Confirms regional place names and the absence of any "Tappy East Creek" or "Blair."',
      },
      {
        title: 'Curse of the Blair Witch & BlairWitch.com Archival Snapshots',
        authorOrOrigin: 'Haxan Films / Internet Archive (1998–1999)',
        note: 'Essential primary artifacts showing how early hypertext documentation staged an unverified criminal record.',
      },
      {
        title: 'Seneca Creek & Patapsco Valley State Park Land Records',
        authorOrOrigin: 'Maryland Department of Natural Resources',
        note: 'Documents the real filming terrain and December 1999 demolition of the historic Griggs House.',
      },
    ],
    credits: [
      'Archival research & fact-fiction audit: ENIGMA Editorial Desk (2026)',
      'Photographic holdings audited across Library of Congress, Maryland DNR, and Wikimedia Commons records',
      `Documented case assets indexed: ${BLAIR_WITCH_ASSETS.length} records`,
      'Editorial policy: Clear separation between verified history, production record, and in-universe lore.',
    ],
    relatedCaseSlug: 'db-cooper',
    relatedCaseLabel: 'Case 002 — The Cooper File (NORJAK)',
    relatedCaseReason:
      'Compare a deliberate 1999 media hoax with an authentic unsolved 1971 federal investigation: the D.B. Cooper Northwest Orient Flight 305 hijacking.',
  };
}

function buildDbCooperDossier(): CaseDossierData {
  const timeline: DossierTimelineEntry[] = [
    ...DBC_TIMELINE.map((t, index) => ({
      id: `dbc-tl-${index + 1}`,
      dateOrTime: `24 Nov 1971 · ${t.time} PST`,
      title: t.title,
      trackLabel: t.status,
      location: 'Portland → Seattle → Reno Air Corridor',
      summary: t.detail,
      verificationNote: `FBI NORJAK flight log and crew reconstruction [${t.source}].`,
      sourceCode: t.source,
    })),
    {
      id: 'dbc-tl-1972-search',
      dateOrTime: 'Mar–Apr 1972',
      title: 'Spring thaw ground search in Clark and Cowlitz Counties',
      trackLabel: 'CONFIRMED',
      location: 'Ariel, Lake Merwin & Lewis River drainage, Washington',
      summary:
        'Roughly 200 Fort Lewis soldiers, Air Force personnel, National Guardsmen, and volunteers search 36 days beneath the calculated drop zone without finding Cooper, a parachute, or ransom bills.',
      verificationNote: 'Documented in declassified FBI NORJAK operational summaries [SRC-15].',
      sourceCode: 'SRC-15',
    },
    {
      id: 'dbc-tl-1980-tinabar',
      dateOrTime: '10 Feb 1980',
      title: 'Tina Bar ransom recovery ($5,800)',
      trackLabel: 'CONFIRMED',
      location: 'Columbia River sandbar near Vancouver, Washington',
      summary:
        'Eight-year-old Brian Ingram uncovers three decomposing packets totaling 290 $20 bills whose serial numbers match the 1971 ransom microfilm — the only money ever recovered outside the aircraft.',
      verificationNote: 'Serial verification recorded by FBI Laboratory and Seattle Field Office [SRC-01, SRC-09].',
      sourceCode: 'SRC-09',
    },
    {
      id: 'dbc-tl-2016-suspend',
      dateOrTime: 'July 2016',
      title: 'FBI suspends active NORJAK investigation',
      trackLabel: 'CONFIRMED',
      location: 'FBI Seattle Field Office',
      summary:
        'After 45 years without establishing D.B. Cooper’s identity or resolving his disappearance, the FBI redirects active investigative resources away from NORJAK while retaining physical evidence for future testing.',
      verificationNote: 'Official FBI Seattle press announcement, July 2016 [SRC-01, SRC-02].',
      sourceCode: 'SRC-01, SRC-02',
    },
  ];

  const evidence: DossierEvidenceEntry[] = DBC_EVIDENCE.map((item) => ({
    id: item.id,
    code: item.number,
    title: item.title,
    subtitle: item.subtitle,
    status: item.status,
    summary: item.summary,
    facts: item.facts,
    limits: item.limits,
    source: item.source,
  }));

  const transcripts: DossierTranscriptEntry[] = [
    {
      id: 'dbc-tr-note',
      code: 'DOC-NORJAK-01',
      title: 'Reconstructed Demand Note to Flight Attendant Florence Schaffner',
      dateLabel: '24 November 1971 · ≈15:00 PST (In flight, Flight 305)',
      provenance:
        'Oral witness testimony recorded by FBI interviewers; Cooper retrieved the handwritten slip before the jump.',
      excerpts: [
        `RECONSTRUCTED TEXT: "${NOTE_TEXT}"`,
        `VERBAL DEMANDS RELAYED VIA COCKPIT: ${DEMANDS.map((d) => `${d.n}: ${d.text} (${d.note})`).join(' · ')}`,
      ],
      verdict: 'DOCUMENTED WITNESS RECORD — Physical demand paper never recovered.',
    },
    {
      id: 'dbc-tr-ticket',
      code: 'DOC-NORJAK-02',
      title: 'Northwest Orient Airlines Cash Ticket Coupon ("Dan Cooper")',
      dateLabel: '24 November 1971 · ≈14:35 PST (Portland International Airport)',
      provenance:
        'Original airline carbon ticket stub preserved in Western District of Washington case records (CR-0451 / FBI Vault).',
      excerpts: [
        'ISSUED PASSENGER NAME: Dan Cooper — One-way Flight 305, Portland (PDX) to Seattle-Tacoma (SEA), Seat 18C/18E, $20.00 cash.',
        `PASSENGER DESCRIPTION: ${MAN_PROSE.lede} Clothing recorded: ${CLOTHING.join('; ')}.`,
      ],
      verdict: 'PRIMARY PHYSICAL RECORD — Wire-service typo shortly produced the public name "D.B. Cooper."',
    },
    {
      id: 'dbc-tr-crew',
      code: 'DOC-NORJAK-03',
      title: 'Northwest Orient Flight 305 Crew & Second-Leg Cockpit Exchange',
      dateLabel: '24 November 1971 · 19:40–20:13 PST',
      provenance:
        'Crew statements and FAA/FBI air-to-ground logs reconstructed after the emergency landing in Reno, Nevada.',
      excerpts: [
        `FLIGHT CREW: ${CREW.map((c) => `${c.name} (${c.role})`).join(', ')}.`,
        'CABIN LOG (20:00 PST): Aft airstair warning light illuminates over southwest Washington; crew offers assistance over interphone and Cooper refuses.',
        '20:11–20:13 PST: Flight crew records cabin pressure bump and nose-down trim oscillation near the Lewis River corridor.',
      ],
      verdict: 'CONFIRMED FLIGHT LOG — Exit time inferred from tail pitch rather than direct visual sighting.',
    },
    {
      id: 'dbc-tr-tinabar',
      code: 'DOC-NORJAK-04',
      title: 'Tina Bar Serial Match & Unknown Record Ledger',
      dateLabel: '10 February 1980 & Subsequent Forensic Reviews',
      provenance:
        'FBI Laboratory ransom microfilm comparison (1980) and 2020 diatom analysis summary.',
      excerpts: [
        SEARCH_PROSE.lede,
        MONEY_PROSE.paragraphs[0],
        `REMAINING UNKNOWNS: ${UNKNOWNS.slice(0, 4).join(' ')}`,
      ],
      verdict: 'CONFIRMED SERIAL MATCH — Route between sky and sandbar remains unestablished.',
    },
  ];

  const theories: DossierTheoryOrSuspect[] = [
    ...THEORIES.map((t) => ({
      id: `theory-${t.id}`,
      code: t.number,
      title: t.title,
      subtitle: t.claim,
      summary: t.why,
      support: t.support,
      contradict: t.contradict,
      verdict: t.verdict,
    })),
    ...SUSPECTS.map((s, idx) => ({
      id: `suspect-${s.id}`,
      code: `S-0${idx + 1}`,
      title: s.name,
      subtitle: `${s.life} · ${s.role} (${s.ageIn1971})`,
      summary: `${s.why} ${s.outcome}`,
      support: s.support,
      contradict: s.contradict,
      verdict: `${s.status}: ${s.badge}`,
      source: s.source,
    })),
  ];

  const sources: DossierSourceEntry[] = DBC_SOURCES.map((s) => ({
    code: s.code,
    title: s.title,
    publisher: `${s.publisher}${s.author ? ` (${s.author})` : ''}`,
    date: s.date,
    category: s.category,
    url: s.url,
    note: s.caveat ? `${s.obtained} Caveat: ${s.caveat}` : s.obtained,
  }));

  return {
    slug: 'db-cooper',
    caseNumber: '002',
    title: 'The Cooper File',
    subtitle: 'Flight 305, the $200,000 ransom, and what remained',
    location: 'Portland → Seattle → Reno Corridor (NORJAK)',
    timeframe: '24 November 1971 · 1980 Tina Bar · 2016 suspended',
    classification: 'Unsolved Federal Case Record',
    heroImage: '/assets/db-cooper/images/northwest-727-n467us-1972.jpg',
    heroAlt: 'Boeing 727-100 aircraft of Northwest Orient Airlines, same model hijacked as Flight 305 in November 1971.',
    overviewParagraphs: [
      'On 24 November 1971, a man traveling under the name Dan Cooper — later known worldwide as D.B. Cooper — hijacked Northwest Orient Flight 305 between Portland and Seattle, collected a $200,000 ransom and four parachutes at Sea-Tac Airport, and parachuted from the Boeing 727 aft airstair into rain and darkness.',
      `The resulting FBI investigation (codenamed NORJAK) lasted nearly 45 years without establishing Cooper's true identity or resolving his disappearance. ${EPILOGUE_PROSE.paragraphs[0]}`,
    ],
    keyFigures: [
      ...MAN_FACTS.slice(0, 2).map((f) => ({
        value: f.value,
        label: f.label,
        note: `${f.status} · ${f.source}`,
      })),
      ...AIRCRAFT_FACTS.slice(0, 2).map((f) => ({
        value: f.value,
        label: f.label,
        note: 'Flight 305 specification',
      })),
    ],
    timelineIntro:
      'Minute-by-minute reconstruction of Northwest Orient Flight 305 on 24 November 1971 alongside major post-1971 FBI investigation milestones.',
    timeline,
    evidenceIntro:
      'Every physical item recovered after the 1971 hijacking — including the black clip-on tie, remaining parachutes, Tina Bar ransom bundles, latent prints, and key absences in the file.',
    evidence,
    transcriptIntro:
      'Reconstructed demand note text, Portland cash ticket record, cockpit oscillation logs, and the limits of what suspects and witnesses established.',
    transcripts,
    theoriesIntro:
      `${SUSPECT_NOTE} Below are the core survival/outcome hypotheses and the primary individuals investigated or publicly named over the last five decades.`,
    theories,
    sourcesIntro:
      'All dates, aircraft logs, ransom serial verifications, and suspect outcomes cite declassified FBI Vault releases, National Archives case files, and primary contemporary reporting.',
    sources,
    furtherReading: [
      {
        title: 'FBI Vault: D.B. Cooper NORJAK Case Files',
        authorOrOrigin: 'Federal Bureau of Investigation',
        note: 'Declassified multi-part investigative releases covering 1971 witness interviews, parachute inspections, and lab exclusions.',
      },
      {
        title: 'U.S. Attorney Case File, Western District of Washington (CR-0451)',
        authorOrOrigin: 'U.S. National Archives (NARA)',
        note: 'Primary federal prosecutorial record and grand jury exhibit index for Flight 305.',
      },
      {
        title: 'The Tina Bar Diatom Study (2020) & Cash Serial Ledger',
        authorOrOrigin: 'Forensic Hydrology & FBI Ransom Microfilm',
        note: 'Examines spring freshwater diatom evidence on the $5,800 recovered in February 1980 along the Columbia River.',
      },
      {
        title: 'Northwest Orient Airlines Flight 305 Crew Statements',
        authorOrOrigin: 'Florence Schaffner, Tina Mucklow & Flight Deck Crew',
        note: 'Firsthand cabin accounts of the hijack note, briefcase device, Seat 18C/18E demeanor, and Reno landing.',
      },
    ],
    credits: [
      'Investigative synthesis & evidentiary audit: ENIGMA Editorial Desk (2026)',
      'Primary records audited via FBI Vault, U.S. National Archives, Northwest Orient logs, and Seattle/Portland journalism archives',
      'Audio ambience synthesized procedurally from cabin and Pacific Northwest environmental references',
      'Editorial policy: Clear separation between confirmed physical records, documented FBI files, and unproven allegations.',
    ],
    relatedCaseSlug: 'blair-witch',
    relatedCaseLabel: 'Case 001 — The Blair Witch Incident',
    relatedCaseReason:
      'Compare the unsolved 1971 federal record of D.B. Cooper with an engineered 1999 viral folklore campaign examined frame by frame.',
  };
}

const DOSSIERS: Record<'blair-witch' | 'db-cooper', CaseDossierData> = {
  'blair-witch': buildBlairWitchDossier(),
  'db-cooper': buildDbCooperDossier(),
};

export function getCaseDossier(slug: string): CaseDossierData | null {
  if (slug === 'blair-witch' || slug === 'db-cooper') {
    return DOSSIERS[slug];
  }
  return null;
}

export function getAllCaseDossiers(): CaseDossierData[] {
  return [DOSSIERS['blair-witch'], DOSSIERS['db-cooper']];
}
