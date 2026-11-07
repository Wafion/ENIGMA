import type { EnigmaCase } from '../types/enigma';
import { BLAIR_WITCH_ASSETS, BLAIR_WITCH_SOURCES } from './blairWitchAssets';

export const BLAIR_WITCH_CASE: EnigmaCase = {
  id: 'case-001-blair-witch',
  code: 'ENIGMA // CASE 001',
  title: 'THE BLAIR WITCH INCIDENT',
  subtitle: 'A Case from the Black Hills: Anatomy of a Modern Digital Mythology',
  classification: 'DUAL-LAYER ARCHIVAL INVESTIGATION // FOLKLORE & MEDIA HISTORY',
  category: 'Cultural Mythology & Found-Footage Cinema',
  readingTimeMinutes: 18,
  publicationDate: 'November 2026',
  location: 'Burkittsville, Seneca Creek & Patapsco Valley, Maryland, USA',
  coordinates: '39°23′30″N 77°37′37″W',
  coverAssetId: 'img-seneca-creek-woods',
  summary:
    'In October 1994, according to one of the most influential narratives of the early internet era, three student filmmakers vanished in the Black Hills forest near Burkittsville, Maryland while investigating a two-century-old curse. In October 1997, in the real woods of Seneca Creek State Park, two independent directors with a 35-page outline, a Garmin GPS tracker, a 16mm CP-16 camera, and a $400 Hi8 camcorder manufactured that legend from scratch—forever altering how the modern world distinguishes document from fiction.',
  editorialDisclaimer:
    'EDITORIAL PROTOCOL: The Blair Witch is a fictional mythology created by Daniel Myrick, Eduardo Sánchez, and Haxan Films for the 1999 feature film "The Blair Witch Project" and its accompanying 1998–1999 online archive. Throughout this case file, ENIGMA strictly separates in-universe mythological reconstructions [IN-UNIVERSE MYTHOLOGY] from verified historical geography, primary 19th-century archives, and production documentation [VERIFIED HISTORICAL / PRODUCTION RECORD].',
  assets: BLAIR_WITCH_ASSETS,
  sources: BLAIR_WITCH_SOURCES,
  chapters: [
    // =========================================================================
    // CHAPTER 01: THE LEGEND (THE FICTIONAL MYTHOLOGY)
    // =========================================================================
    {
      id: 'chapter-01-the-legend',
      number: '01',
      code: 'CH.01 // THE LEGEND',
      title: 'The Legend of the Black Hills',
      subtitle: 'How a 200-year colonial chronology of banishment, ritual effigies, and vanished search parties was engineered to feel older than memory.',
      epigraph: {
        text: 'By the turning of the following winter, all of Elly Kedward’s accusers—and half the children of the township—had vanished into the timber without footprint or cry.',
        attribution: 'In-Universe Excerpt from "The Blair Witch Cult" (Fictional 1809 Chapbook created by Haxan Films, 1999)'
      },
      truthLayer: 'IN-UNIVERSE MYTHOLOGY',
      introduction:
        'Before a single frame of film was screened at Sundance in January 1999, the terror of The Blair Witch Project rested upon an intricate stratigraphic timeline spanning two centuries (1785–1941). Every date, trial, and disappearance in this chronology is fictional—yet its design mirrors genuine early-American colonial records and rural Maryland newspaper dispatches with unsettling precision.',
      theme: {
        bgHex: '#0b0a09',
        surfaceHex: '#151310',
        accentHex: '#b83a2e',
        borderHex: '#2e2720',
        moodLabel: 'ARCHIVAL FOLKLORE DOSSIER'
      },
      ambientAudioId: 'aud-room-tone',
      transitionAsciiWord: 'KEDWARD // 1785',
      transitionAsciiCoord: 'LAYER A: IN-UNIVERSE MYTHOLOGY [1785–1941]',
      scenes: [
        {
          id: 'scene-01-kedward',
          code: 'SCN 01.A',
          title: 'February 1785: The Banishment of Elly Kedward',
          subtitle: 'The foundational myth of colonial Blair and the winter abandonment of 1786',
          truthLayer: 'IN-UNIVERSE MYTHOLOGY',
          locationStamp: 'FICTIONAL TOWNSHIP OF BLAIR, MD',
          dateStamp: 'FEB 1785 – WINTER 1786 (IN-UNIVERSE)',
          audioCueId: 'aud-cabin-creak',
          compositions: [
            {
              id: 'comp-01-a1',
              layout: 'split-investigative',
              elements: [
                {
                  id: 'el-01-text-1',
                  type: 'text',
                  dropcap: true,
                  leadParagraph:
                    'Within the fictional lore constructed by filmmakers Daniel Myrick, Eduardo Sánchez, and production designer Ben Rock [SRC-04], the contagion of the Black Hills begins in February 1785 in the colonial settlement of Blair, Maryland.',
                  paragraphs: [
                    'According to the in-universe chronology, several children of the settlement accuse an Irish immigrant woman named Elly Kedward of luring them into her cottage to draw blood from their arms. Found guilty of witchcraft by a local magistrate, Kedward is bound to a wooden furniture cart, dragged deep into the sub-zero timberlands of the Black Hills during a brutal winter storm, and left tied in the woods to die of exposure.',
                    'The township assumes the matter is closed until December 1786. When the second winter descends, every child who had testified against Kedward—along with half of the town’s remaining children—vanishes into the forest. Terrified that the woods themselves have become sentient with Kedward’s malice, the surviving settlers abandon Blair entirely and swear a collective oath never to speak her name again [SRC-04].',
                    'To give this invented 18th-century narrative the weight of physical antiquity, the filmmakers fabricated an entire bibliographic artifact for their 1999 television mockumentary "Curse of the Blair Witch": a weathered, woodcut-illustrated monograph purportedly printed in 1809 under the title "The Blair Witch Cult" [SRC-05].'
                  ],
                  annotations: [
                    {
                      term: 'Elly Kedward',
                      sourceCode: 'SRC-04',
                      note: 'Fictional character invented by Myrick & Sánchez; her name is a phonetic play on "Edward" (Eduardo Sánchez) and seventeenth-century British witch-trial records.'
                    },
                    {
                      term: 'The Blair Witch Cult',
                      sourceCode: 'SRC-05',
                      note: 'Fictional 1809 book physically crafted as an aged prop by production designer Ben Rock in 1999.'
                    }
                  ]
                },
                {
                  id: 'el-01-doc-1809',
                  type: 'document',
                  assetId: 'doc-1809-woodcut',
                  dossierCode: 'DOC-LORE-1809',
                  title: 'The Blair Witch Cult (1809 In-Universe Chapbook Plate)',
                  inUniverseDate: '1809 (Attributed)',
                  realCreationContext: 'Crafted in 1999 by production designer Ben Rock for Haxan Films / Sci-Fi Channel broadcast "Curse of the Blair Witch".',
                  summary:
                    'Within the mythology, only a single surviving copy of this 1809 chapbook exists—held in a private collection before being exhibited at the Maryland Historical Society. In reality, no such book ever existed.',
                  transcriptExcerpt: [
                    'FOLIO IX: "In the Month of February, 1785, after diverse Children of the Settlement testified that the Woman Kedward had drawn forth Blood from their Arms within her Cottage near the Creek, the Magistrates ordered her bound upon a Sled and cast into the North Woods amidst a great Snow."',
                    'MARGINALIA NOTE: Introduces the visual motif of the woven stick effigy ("twana") suspended from oak boughs as a territorial ward.'
                  ],
                  factCheckVerdict: 'FICTIONAL ARTIFACT: Verified prop fabrication created for the 1999 transmedia campaign.'
                }
              ]
            }
          ]
        },
        {
          id: 'scene-01-coffin-rock',
          code: 'SCN 01.B',
          title: 'Tappy East Creek (1825), Coffin Rock (1886) & Rustin Parr (1941)',
          subtitle: 'The sixty-year recurrence cycle engineered into the mythology',
          truthLayer: 'IN-UNIVERSE MYTHOLOGY',
          locationStamp: 'TAPPY EAST CREEK & COFFIN ROCK (LORE)',
          dateStamp: '1825 / 1886 / 1941 (IN-UNIVERSE)',
          compositions: [
            {
              id: 'comp-01-b1',
              layout: 'single-editorial',
              elements: [
                {
                  id: 'el-01-text-2',
                  type: 'text',
                  paragraphs: [
                    'Notice the rhythmic cadence built into the mythology: roughly every fifty to sixty years—1785, 1825, 1886, 1941, and finally 1994—an outbreak of violence erupts along the watershed of the Black Hills [SRC-04]. This generational pacing mirrors Stephen King’s Derry cycle and classical American folkloristics, making the legend feel like an indigenous regional pathology rather than a movie plot.',
                    'In August 1825, one year after the fictional ruins of Blair are rediscovered and renamed Burkittsville, ten-year-old Eileen Treacle drowns in ankle-deep water at Tappy East Creek while eleven witnesses claim to see a pale, submerged hand pull her beneath the surface. For thirteen days afterward, the stream is choked with oily bundles of interwoven sticks.',
                    'In March 1886, eight-year-old Robin Weaver disappears into the woods. Although Weaver returns unharmed three days later describing an old woman "whose feet never touched the ground," a five-man search party led by Turlock vanishes. Weeks later, a second posse finds the five men bound hand-and-foot in a star pattern atop a flat granite outcrop called Coffin Rock—disemboweled and marked with runic incisions. When the posse returns hours later with the county sheriff, the five corpses have vanished from the rock without a trace [SRC-04].'
                  ]
                },
                {
                  id: 'el-01-quote-parr',
                  type: 'quote',
                  quote: 'I’m finally finished.',
                  speaker: 'Rustin Parr (Fictional Hermit of the Black Hills)',
                  roleOrContext: 'Attributed statement delivered to a Burkittsville market clerk on May 25, 1941 after the abduction of seven local children in the film’s mythology.',
                  date: 'May 25, 1941 (In-Universe Lore)',
                  truthLayer: 'IN-UNIVERSE MYTHOLOGY',
                  sourceCode: 'SRC-04'
                },
                {
                  id: 'el-01-text-3',
                  type: 'text',
                  paragraphs: [
                    'The darkest chapter of the fictional lore is set between November 1940 and May 1941. A reclusive woodsman named Rustin Parr—living in a three-story woodland house four hours on foot from town—abducts seven children from Burkittsville. On May 25, 1941, Parr walks into a local store and calmly announces, "I’m finally finished."',
                    'When police hike to Parr’s house, they uncover seven small graves in the dirt cellar. Under interrogation, Parr claims that the spectral voice of an old woman in a dark cloak had whispered to him in the timber for months, commanding him to bring the children into his cellar in pairs. Because he could not stand the way the second child watched him while he killed the first, Parr forced the waiting child to stand in the corner of the cellar facing the stone wall—establishing the terrifying visual image that would later conclude the 1999 film [SRC-03].'
                  ]
                }
              ]
            },
            {
              id: 'comp-01-b2',
              layout: 'dossier-grid',
              elements: [
                {
                  id: 'el-01-doc-coffin',
                  type: 'document',
                  assetId: 'doc-coffin-rock-1886',
                  dossierCode: 'DOC-LORE-1886',
                  title: 'Topological Dossier: 1886 Coffin Rock Search Party vs. Seneca Creek Outcrop',
                  inUniverseDate: 'March 1886 (In-Universe)',
                  realCreationContext: 'Filmed October 1997 at a natural gneiss outcrop along Seneca Creek in Montgomery County, MD.',
                  summary:
                    'Compares the fictional 1886 Coffin Rock account read aloud by Heather Donahue in the film with the real geological rock ledge in Seneca Creek State Park.',
                  transcriptExcerpt: [
                    'IN-UNIVERSE TEXT (HEATHER’S NARRATION): "While the party was searching for the little girl, they didn’t come back... They found them at Coffin Rock, tied together at the arms and legs, disemboweled."',
                    'GEOGRAPHIC VERIFICATION: No waterway named "Tappy East Creek" or outcrop named "Coffin Rock" exists in Burkittsville; the location was staged 25 miles southeast in Seneca Creek State Park.'
                  ],
                  factCheckVerdict: 'FICTIONAL MYTHOLOGY STAGED ON REAL MARYLAND PARKLAND.'
                },
                {
                  id: 'el-01-doc-parr',
                  type: 'document',
                  assetId: 'doc-rustin-parr-1941',
                  dossierCode: 'DOC-LORE-1941',
                  title: 'Architectural Plan: 1941 Rustin Parr Cellar vs. 1850 Griggs House',
                  inUniverseDate: 'May 1941 (In-Universe)',
                  realCreationContext: 'Filmed October 31, 1997 inside the abandoned c. 1850 Griggs House in Granite, Maryland (Patapsco Valley State Park).',
                  summary:
                    'Maps the spatial architecture of the Rustin Parr cellar legend onto the real 19th-century stone cellar of the Griggs House.',
                  transcriptExcerpt: [
                    'ARCHITECTURAL NOTE: In the lore, townspeople burned Rustin Parr’s house to the ground after his hanging in November 1941—making the physical reappearance of the standing house on Night 5 a spatial-temporal impossibility.',
                    'HISTORICAL REALITY: The house shown on screen was the historic Griggs House near Hernwood Road in Granite, MD, demolished by the State of Maryland in December 1999.'
                  ],
                  factCheckVerdict: 'FICTIONAL LORE MAPPED ONTO DEMOLISHED 1850 HISTORIC STRUCTURE.'
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // CHAPTER 02: THE TOWN (BURKITTSVILLE, MARYLAND)
    // =========================================================================
    {
      id: 'chapter-02-the-town',
      number: '02',
      code: 'CH.02 // THE TOWN',
      title: 'The Town Below South Mountain',
      subtitle: 'Separating the real 19th-century agricultural village of Burkittsville, Maryland from the shadow of colonial "Blair".',
      epigraph: {
        text: 'Burkittsville is a remarkably intact nineteenth-century rural crossroads village nestled against the eastern slope of South Mountain below Crampton’s Gap.',
        attribution: 'National Register of Historic Places Nomination Form (Maryland Historical Trust, November 1975)'
      },
      truthLayer: 'VERIFIED HISTORICAL FACT',
      introduction:
        'Unlike the fictional town of "Blair," Burkittsville, Maryland is a real, historically significant village in southwestern Frederick County. Founded in 1824 by Major Henry Burkitt and Joshua Harley, its quiet Federal-style brick homes, Lutheran and Reformed church spires, and hillside cemetery bore witness not to colonial witch trials, but to the brutal September 1862 Civil War Battle of Crampton’s Gap.',
      theme: {
        bgHex: '#090c0b',
        surfaceHex: '#111614',
        accentHex: '#a89060',
        borderHex: '#232e29',
        moodLabel: 'HISTORICAL CARTOGRAPHY & FIELD SURVEY'
      },
      ambientAudioId: 'aud-room-tone',
      transitionAsciiWord: '39.3918° N',
      transitionAsciiCoord: 'LAYER B: VERIFIED GEOGRAPHY // FREDERICK COUNTY, MD',
      scenes: [
        {
          id: 'scene-02-cartography',
          code: 'SCN 02.A',
          title: '1858 Instrumental Survey & The Real Geography of the Case',
          subtitle: 'Inspecting the Library of Congress cartographic record and the 35-mile production triangle',
          truthLayer: 'VERIFIED HISTORICAL FACT',
          locationStamp: 'BURKITTSVILLE, FREDERICK COUNTY, MD',
          dateStamp: '1824 – PRESENT (VERIFIED)',
          compositions: [
            {
              id: 'comp-02-a1',
              layout: 'single-editorial',
              elements: [
                {
                  id: 'el-02-text-1',
                  type: 'text',
                  dropcap: true,
                  leadParagraph:
                    'When Daniel Myrick and Eduardo Sánchez first developed their outline in 1993, they tentatively titled the project "The Black Hills Project." Searching a Maryland atlas for an authentic town name near the Catoctin and South Mountain ridges, they noticed the tiny municipality of Burkittsville in Frederick County [SRC-01].',
                  paragraphs: [
                    'Primary cartographic records held by the Library of Congress—specifically Isaac Bond’s 1858 "Map of Frederick County, Md., Accurately Drawn from Correct Instrumental Surveys" [SRC-02] and Edwin Hergesheimer’s 1861 U.S. Coast Survey military relief map—establish the town’s real history beyond dispute. Settled in the mid-1700s by German and Swiss-German farming families, the western crossroads was originally known as "Harley’s Post Office" after storekeeper Joshua Harley, while the eastern plat was laid out in 1824 by Major Henry Burkitt. By 1829, the unified village was christened Burkittsville [SRC-01].',
                    'Crucially, while the film’s narrative implies that a vast, trackless wilderness ("The Black Hills Forest") begins immediately behind Burkittsville’s cemetery, the actual geography of the film is a composite of three separate Maryland locations spread across 45 miles: the opening town and cemetery scenes were shot in Burkittsville (Frederick County); the five days of forest hiking were filmed 25 miles southeast in Seneca Creek State Park (Montgomery County); and the final house sequence was shot 40 miles east at the Griggs House in Patapsco Valley State Park (Baltimore County) [SRC-07].'
                  ]
                },
                {
                  id: 'el-02-map-1',
                  type: 'map',
                  title: '1858 Library of Congress Survey & The Maryland Production Triangle',
                  subtitle: 'Interactive cartographic overlay comparing fictional lore sites against verified 1858 survey records and October 1997 filming coordinates.',
                  baseMapAssetId: 'img-loc-frederick-1858',
                  secondaryMapAssetId: 'img-loc-frederick-1861',
                  markers: [
                    {
                      id: 'mkr-burkittsville',
                      code: 'LOC-01',
                      label: 'Burkittsville Historic District',
                      xPercent: 26,
                      yPercent: 58,
                      realLocationName: 'Burkittsville, Frederick County, MD (Founded 1824)',
                      fictionalLocationName: 'Former Site of Colonial "Blair" (1785 Lore)',
                      coordinates: '39.3918° N, 77.6269° W',
                      layer: 'both',
                      description: 'Real historic village (~150 residents) at the base of Crampton’s Gap. Only the opening town interviews and cemetery scenes were filmed here on October 23, 1997.',
                      linkedAssetId: 'img-burkittsville-main'
                    },
                    {
                      id: 'mkr-cemetery',
                      code: 'LOC-02',
                      label: 'Burkittsville Union Cemetery',
                      xPercent: 31,
                      yPercent: 52,
                      realLocationName: 'Burkittsville Union Cemetery (East Main St)',
                      fictionalLocationName: 'Burial Site of the 1941 Victims & Seven Small Cairns',
                      coordinates: '39.3905° N, 77.6242° W',
                      layer: 'both',
                      description: 'Authentic 19th-century cemetery containing veterans of the War of 1812 and Civil War casualties from Crampton’s Gap. Used in Scene 1 of the film.',
                      linkedAssetId: 'img-burkittsville-cemetery'
                    },
                    {
                      id: 'mkr-seneca',
                      code: 'LOC-03',
                      label: 'Seneca Creek State Park & Black Rock Mill',
                      xPercent: 58,
                      yPercent: 72,
                      realLocationName: 'Seneca Creek State Park, Montgomery County, MD',
                      fictionalLocationName: 'The Black Hills Forest, Tappy East Creek & Coffin Rock',
                      coordinates: '39.1242° N, 77.3197° W',
                      layer: 'real-production',
                      description: '6,300-acre state park where nearly all of the 8-day forest expedition (Oct 23–31, 1997), log crossings, GPS drop-boxes, and stick-figure groves were actually filmed.',
                      linkedAssetId: 'img-black-rock-mill'
                    },
                    {
                      id: 'mkr-patapsco',
                      code: 'LOC-04',
                      label: 'Patapsco Valley State Park (Griggs House)',
                      xPercent: 82,
                      yPercent: 48,
                      realLocationName: 'Griggs House (c. 1850–1999), Granite, Baltimore County, MD',
                      fictionalLocationName: 'Ruins of Rustin Parr’s Woodland House (Black Hills)',
                      coordinates: '39.3314° N, 76.8482° W',
                      layer: 'real-production',
                      description: 'Historic mid-19th-century abandoned house in Patapsco Valley State Park where the terrifying final basement sequence was filmed on Halloween night, 1997.',
                      linkedAssetId: 'img-patapsco-tunnel'
                    }
                  ]
                }
              ]
            },
            {
              id: 'comp-02-a2',
              layout: 'dossier-grid',
              elements: [
                {
                  id: 'el-02-img-main',
                  type: 'image',
                  assetId: 'img-burkittsville-main',
                  treatment: 'editorial-large',
                  caption: 'Main Street (MD Route 17) and the 1829 Resurrection Reformed Church in Burkittsville, Maryland.',
                  archivalNote: 'In September 1862, following the Battle of Crampton’s Gap on South Mountain, this church was requisitioned as a field hospital for wounded Union and Confederate soldiers [SRC-01].'
                },
                {
                  id: 'el-02-img-center',
                  type: 'image',
                  assetId: 'img-burkittsville-center',
                  treatment: 'scanned-dossier',
                  caption: 'Center of the Burkittsville Historic District showing 19th-century brick and timber architecture.',
                  archivalNote: 'Listed on the National Register of Historic Places in 1975. The town possesses no movie theater, hotel, or colonial witch-trial history.'
                }
              ]
            },
            {
              id: 'comp-02-a3',
              layout: 'single-editorial',
              elements: [
                {
                  id: 'el-02-ascii-cemetery',
                  type: 'ascii-visual',
                  assetId: 'img-burkittsville-cemetery',
                  title: 'Photographic Revelation: Burkittsville Union Cemetery',
                  subtitle: 'Scroll or drag the optical/ASCII divider to inspect how high-contrast character luminance transforms the real 19th-century headstones of Burkittsville.',
                  narrativeContext:
                    'In the opening frames of the 1994 student documentary, Heather Donahue stands among these weathered limestone markers pointing out dates from the 1840s. Transforming the photograph into a dense ASCII matrix strips away pastoral color, exposing the stark geometric grid of headstones against the South Mountain horizon.',
                  storytellingMode: 'scroll-revelation',
                  asciiConfig: {
                    palette: 'archive-dense',
                    cols: 115,
                    contrast: 1.35,
                    brightness: 0.05,
                    threshold: 0.08,
                    invert: false,
                    colorMode: 'phosphor-bone',
                    animateDistortion: false,
                    initialRevealMix: 0.35
                  }
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // CHAPTER 03: THE DISAPPEARANCE (OCTOBER 1994 EXPEDITION)
    // =========================================================================
    {
      id: 'chapter-03-the-disappearance',
      number: '03',
      code: 'CH.03 // THE DISAPPEARANCE',
      title: 'October 1994: The Student Expedition',
      subtitle: 'Three filmmakers, two cameras, and a five-day descent into navigational collapse.',
      epigraph: {
        text: 'In October of 1994, three student filmmakers disappeared in the woods near Burkittsville, Maryland while shooting a documentary. A year later their footage was found.',
        attribution: 'Opening Title Card of "The Blair Witch Project" (Haxan Films, 1999)'
      },
      truthLayer: 'IN-UNIVERSE MYTHOLOGY',
      introduction:
        'Thirty-nine words on a black screen established the foundational contract of modern found-footage cinema. Within the story world, Montgomery College film student Heather Donahue recruits cinematographer Joshua Leonard and sound recordist Michael C. Williams for a weekend shoot in the Black Hills. Below is the anatomy of their fictional disappearance—paired with the real actors who lent their legal names to the myth.',
      theme: {
        bgHex: '#0a0b0d',
        surfaceHex: '#131519',
        accentHex: '#d4883a',
        borderHex: '#262b33',
        moodLabel: 'EXPEDITION DOSSIER & CONTACT SHEETS'
      },
      ambientAudioId: 'aud-nocturnal-insects',
      transitionAsciiWord: 'OCT 1994',
      transitionAsciiCoord: 'EXPEDITION LOG // DAY 01 TO DAY 07',
      scenes: [
        {
          id: 'scene-03-expedition',
          code: 'SCN 03.A',
          title: 'The Crew & The Five-Day Circle',
          subtitle: 'How three living actors using their real legal names convinced 1999 audiences they were dead',
          truthLayer: 'IN-UNIVERSE MYTHOLOGY',
          locationStamp: 'BLACK HILLS / SENECA CREEK PERIMETER',
          dateStamp: 'OCTOBER 20–28, 1994 (IN-UNIVERSE)',
          audioCueId: 'aud-footsteps-leaves',
          compositions: [
            {
              id: 'comp-03-a1',
              layout: 'split-investigative',
              elements: [
                {
                  id: 'el-03-text-1',
                  type: 'text',
                  dropcap: true,
                  leadParagraph:
                    'A decisive reason the 1999 audience struggled to separate fiction from reality was the casting protocol devised by Daniel Myrick and Eduardo Sánchez: the three principal actors—Heather Donahue, Joshua Leonard, and Michael C. Williams—used their real birth names on screen, in the fictional police reports, and on the "MISSING" flyers distributed at film festivals [SRC-03, SRC-06].',
                  paragraphs: [
                    'Within the fictional chronology [SRC-04], Heather Donahue arrives in Burkittsville on Thursday, October 20, 1994 with Leonard and Williams. After interviewing local residents about Rustin Parr and Mary Brown (a fictional eccentric who claimed to have seen a furry, horse-hoofed figure near Tappy East Creek in 1962), the trio parks Leonard’s 1971 Plymouth Barracuda along MD Route 17 on Friday, October 21 and hikes into the Black Hills.',
                    'By Saturday afternoon (Day 2), after locating an overgrown cemetery containing seven small stone cairns, the crew loses their bearings. On Sunday (Day 3), after Michael admits he kicked their paper map into the creek out of frustration, they hike south all day utilizing Joshua’s compass—only to walk directly back to the exact same log crossing they had departed that morning.',
                    'On October 26, 1994 (in-universe), the Maryland State Police locate Leonard’s car and launch a ten-day search involving bloodhounds, helicopters, and 100 searchers, finding nothing. Nearly a year later, on October 16, 1995, University of Maryland anthropology students excavating the foundation of the burned 19th-century Westerfield Cabin uncover a canvas duffel bag sealed beneath the stone hearth—containing 11 cans of 16mm film, Hi8 video cassettes, DAT audio tapes, and Heather’s journal [SRC-04].'
                  ]
                },
                {
                  id: 'el-03-doc-missing',
                  type: 'document',
                  assetId: 'doc-missing-poster',
                  dossierCode: 'DOC-MKT-1999',
                  title: 'Typographic Reconstruction: The October 1994 "MISSING" Bulletin',
                  inUniverseDate: 'November 1994 (In-Universe Attribution)',
                  realCreationContext: 'Distributed at the Sundance Film Festival in January 1999 and published on BlairWitch.com.',
                  summary:
                    'Illustrates how Haxan Films and Artisan Entertainment formatted promotional flyers as missing-persons bulletins while listing the actors as "Missing, presumed dead" on IMDb.',
                  transcriptExcerpt: [
                    'HEADER: "MISSING — LAST SEEN OCTOBER 1994 IN THE BLACK HILLS FOREST NEAR BURKITTSVILLE, MARYLAND."',
                    'EPISTEMIC IMPACT: Because smartphone fact-checking and social media profiles did not yet exist in early 1999, thousands of viewers left early screenings believing they had watched genuine posthumous evidence.'
                  ],
                  factCheckVerdict: 'PROMOTIONAL VIRAL CAMPAIGN ARTIFACT (NON-POLICE DOCUMENT).'
                }
              ]
            },
            {
              id: 'comp-03-a2',
              layout: 'dossier-grid',
              elements: [
                {
                  id: 'el-03-img-heather',
                  type: 'image',
                  assetId: 'img-heather-donahue',
                  treatment: 'contact-sheet',
                  caption: 'Actress Heather Donahue — Portrayed the documentary’s director and operated the consumer Hi8 video camcorder.',
                  archivalNote: 'Selected from New York auditions for her fierce improvisational command; Donahue personally filmed the iconic tent confession.'
                },
                {
                  id: 'el-03-img-josh',
                  type: 'image',
                  assetId: 'img-joshua-leonard',
                  treatment: 'contact-sheet',
                  caption: 'Actor Joshua Leonard — Portrayed the 16mm cinematographer and operated the CP-16 film camera.',
                  archivalNote: 'Trained by director of photography Neal Fredericks to load and expose real 16mm black-and-white reversal film in the field.'
                },
                {
                  id: 'el-03-img-mike',
                  type: 'image',
                  assetId: 'img-michael-williams',
                  treatment: 'contact-sheet',
                  caption: 'Actor Michael C. Williams — Portrayed the DAT sound recordist.',
                  archivalNote: 'Recorded actual production sync sound on a portable DAT deck while improvising the crew’s escalating psychological fracture.'
                },
                {
                  id: 'el-03-cue-footsteps',
                  type: 'audio-cue',
                  assetId: 'aud-footsteps-leaves',
                  cueCode: 'CUE-FOLEY-01',
                  title: 'Isolated Field Cue: Six Footsteps on Dry October Oak Litter',
                  narrativePurpose: 'Evokes the relentless daytime march through dry Seneca Creek oak leaves and the nocturnal footsteps circling the tent perimeter.',
                  durationLabel: '00:06 PCM WAV',
                  transcriptOrDescription: '[FOLEY LOG]: Rhythmic compression of dry white-oak and beech leaves at 1.1-second intervals, followed by sudden stillness.'
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // CHAPTER 04: THE WOODS (SPATIAL ATMOSPHERE & SENECA CREEK)
    // =========================================================================
    {
      id: 'chapter-04-the-woods',
      number: '04',
      code: 'CH.04 // THE WOODS',
      title: 'The Woods: An Unstable Geometry',
      subtitle: 'Inside the leafless late-October canopy where sightlines fracture into vertical bars of timber and stone.',
      epigraph: {
        text: 'It’s impossible to get lost in America today... Wait—I have been at this log before. We have walked in a circle all day.',
        attribution: 'Heather Donahue & Joshua Leonard (Improvised Dialogue, Day 3)'
      },
      truthLayer: 'PRODUCTION & MARKETING RECORD',
      introduction:
        'Why do the Mid-Atlantic woods in late October feel uniquely klaustrophobic on camera? Without summer foliage to soften depth or winter snow to reflect ambient light, a deciduous forest in late autumn becomes an endless hall of vertical gray trunks. Here, the forest environment is rendered both in its physical reality—Seneca Creek State Park and Black Rock Mill—and as an unstable, living ASCII character matrix.',
      theme: {
        bgHex: '#060907',
        surfaceHex: '#0d1410',
        accentHex: '#689c78',
        borderHex: '#1e3024',
        moodLabel: 'SPATIAL CANOPY & ASCII INTERFERENCE'
      },
      ambientAudioId: 'aud-forest-wind',
      transitionAsciiWord: 'TWANA // WOODS',
      transitionAsciiCoord: 'SENECA CREEK STATE PARK // 39.1242° N, 77.3197° W',
      scenes: [
        {
          id: 'scene-04-spatial',
          code: 'SCN 04.A',
          title: 'The Vertical Labyrinth & The Stick Effigy Grove',
          subtitle: 'High-density ASCII transformation of the Seneca Creek timberlands and Black Rock Mill ruins',
          truthLayer: 'PRODUCTION & MARKETING RECORD',
          locationStamp: 'SENECA CREEK STATE PARK, MONTGOMERY COUNTY, MD',
          dateStamp: 'OCTOBER 25–29, 1997 (ACTUAL SHOOT)',
          audioCueId: 'aud-branch-snap',
          compositions: [
            {
              id: 'comp-04-a1',
              layout: 'full-bleed-cinema',
              elements: [
                {
                  id: 'el-04-ascii-forest',
                  type: 'ascii-visual',
                  assetId: 'img-seneca-creek-canopy',
                  title: 'Spatial Atmosphere: The Unstable Canopy Matrix',
                  subtitle: 'Live high-density character rendering with subtle wind-driven contrast undulation and custom "Runic / Twana" symbol palette support.',
                  narrativeContext:
                    'When viewed through the low-resolution lens of 1990s analog Hi8 video and grainy 16mm film, the leafless branches of Seneca Creek lose their botanical familiarity. Every vertical trunk and crossing bough begins to resemble the woven geometry of the humanoid stick effigies ("twana") suspended by production designer Ben Rock in the woods on Day 4.',
                  storytellingMode: 'unstable-forest',
                  asciiConfig: {
                    palette: 'runic-twana',
                    cols: 128,
                    contrast: 1.45,
                    brightness: 0.02,
                    threshold: 0.06,
                    invert: false,
                    colorMode: 'forest-amber',
                    animateDistortion: true,
                    initialRevealMix: 0.0
                  }
                }
              ]
            },
            {
              id: 'comp-04-a2',
              layout: 'split-investigative',
              elements: [
                {
                  id: 'el-04-text-1',
                  type: 'text',
                  dropcap: true,
                  leadParagraph:
                    'In traditional horror cinema, terror is anchored to a visible monster within the frame. In The Blair Witch Project, the monster is the topology of the forest itself—specifically the 6,300 acres of Seneca Creek State Park in Montgomery County, Maryland [SRC-07].',
                  paragraphs: [
                    'During the eight-day October 1997 shoot, directors Daniel Myrick and Eduardo Sánchez dressed in camouflage gear and tracked the three actors through the park using handheld Garmin GPS receivers. Each morning, the actors hiked to a programmed GPS waypoint where a milk crate marked with a bicycle safety flag contained sealed 35mm film canisters holding their individual character instructions—Along with progressively smaller rations of power bars and fruit [SRC-03].',
                    'By Day 4 and Day 5, sleep deprivation and caloric deficit had stripped away all theatrical artifice. When the actors stumbled into a grove where production designer Ben Rock had suspended dozens of bound wooden stick figures from the trees, their whispered dread was unscripted. At night, the directors crept within thirty yards of the tent, snapping deadwood branches against tree trunks and broadcasting distorted recordings of children’s voices through boomboxes concealed in the brush [SRC-03].'
                  ]
                },
                {
                  id: 'el-04-img-mill',
                  type: 'image',
                  assetId: 'img-black-rock-mill',
                  treatment: 'editorial-large',
                  caption: 'Stone ruins of the 1815 Black Rock Mill in Seneca Creek State Park, Maryland.',
                  archivalNote: 'Photographed by Aneta Kaluzna (CC BY-SA 2.5). The creek crossings and weathered stone ruins around Black Rock Mill served as key staging grounds for the October 1997 shoot [SRC-07].'
                }
              ]
            },
            {
              id: 'comp-04-a3',
              layout: 'dossier-grid',
              elements: [
                {
                  id: 'el-04-img-rock-trail',
                  type: 'image',
                  assetId: 'img-patapsco-rock-trail',
                  treatment: 'monochrome-plate',
                  caption: 'Fieldstone and root terrain in Patapsco Valley State Park.',
                  archivalNote: 'Weathered quartzite and fieldstone slabs identical to those stacked into the three cairns outside the actors’ tent.'
                },
                {
                  id: 'el-04-cue-branch',
                  type: 'audio-cue',
                  assetId: 'aud-branch-snap',
                  cueCode: 'CUE-FOLEY-02',
                  title: 'Nocturnal Perimeter Cue: Distant Deadwood Branch Snap',
                  narrativePurpose: 'Reconstructs the nocturnal acoustic ambushes staged by the crew outside the campsite at 3:00 AM.',
                  durationLabel: '00:04.5 PCM WAV',
                  transcriptOrDescription: '[ACOUSTIC TELEMETRY]: Sharp transient crack at 420Hz–610Hz followed by secondary wood-fiber tear and natural valley decay.'
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // CHAPTER 05: THE RECORDINGS (DUAL-GAUGE 16MM & HI8 INTERFACE)
    // =========================================================================
    {
      id: 'chapter-05-the-recordings',
      number: '05',
      code: 'CH.05 // THE RECORDINGS',
      title: 'The Recordings: 16mm Celluloid & Hi8 Magnetic Tape',
      subtitle: 'How the collision between black-and-white 16mm documentary film and consumer Hi8 video created a new grammar of cinematic realism.',
      epigraph: {
        text: 'The film’s most intimate footage is a confession recorded alone in a tent, with the camera turned on the person holding it.',
        attribution: 'Editorial synthesis · ENIGMA'
      },
      truthLayer: 'PRODUCTION & MARKETING RECORD',
      introduction:
        'A critical yet frequently overlooked secret of The Blair Witch Project is that it is a dual-format film. Within the narrative, Joshua Leonard shoots the "official" documentary on a Cinema Products CP-16 16mm black-and-white film camera (which requires Michael Williams’ separate DAT recorder for synchronized sound), while Heather Donahue documents their behind-the-scenes unravelling on a consumer RCA Hi8 color video camcorder with a built-in microphone.',
      theme: {
        bgHex: '#08080b',
        surfaceHex: '#121217',
        accentHex: '#e09f3e',
        borderHex: '#292936',
        moodLabel: 'MAGNETIC TAPE & CELLULOID ANALYSIS DECK'
      },
      ambientAudioId: 'aud-tape-static',
      transitionAsciiWord: 'SMPTE // HI8',
      transitionAsciiCoord: 'RECOVERED REELS // CP-16 16MM & NTSC HI8',
      scenes: [
        {
          id: 'scene-05-deck',
          code: 'SCN 05.A',
          title: 'Interactive ASCII Recording Deck & Transcript Analyzer',
          subtitle: 'Inspect the 5 iconic sequence architectures reconstructed through live procedural Canvas 2D ASCII synthesis',
          truthLayer: 'PRODUCTION & MARKETING RECORD',
          locationStamp: 'LAB TRANSFER BAY // REELS 01–11',
          dateStamp: 'OCT 1994 (LORE) // OCT 1997 (SHOOT)',
          audioCueId: 'aud-tape-static',
          compositions: [
            {
              id: 'comp-05-a1',
              layout: 'full-bleed-cinema',
              elements: [
                {
                  id: 'el-05-recording-deck',
                  type: 'recording-deck',
                  title: 'Dual-Gauge Found-Footage Synthesizer & Transcript Log',
                  subtitle: 'NOTE: All visual frames below are real-time procedural Canvas 2D ASCII reconstructions (not copyrighted film stills), paired with verified production data and transcript excerpts.',
                  cameraAssetId: 'img-hi8-camcorder',
                  segments: [
                    {
                      id: 'seg-01-cemetery',
                      reelCode: 'REEL 01 // CP-16 16MM B&W',
                      timecodeStart: '00:04:12:08',
                      timecodeEnd: '00:06:45:19',
                      gauge: '16mm-cp16-bw',
                      fictionalDate: 'Oct 20, 1994 — 14:15 EST',
                      realShootDate: 'Oct 23, 1997 (Day 1)',
                      realLocation: 'Burkittsville Union Cemetery, Frederick County, MD',
                      title: 'Sequence 01: The Cemetery Slate & Treacle Headstone',
                      proceduralScene: 'cemetery-slate',
                      transcript: [
                        {
                          timecode: '00:04:18:02',
                          speaker: 'HEATHER DONAHUE',
                          line: 'This is the Burkittsville Cemetery. Look at the cluster of small markers along the eastern plot—dates from the 1820s through the 1880s.',
                          acousticNote: 'Sync sound via Michael Williams’ DAT boom mic; light valley wind.'
                        },
                        {
                          timecode: '00:05:02:14',
                          speaker: 'JOSHUA LEONARD',
                          line: 'Hold the slate steady for two seconds—my light meter is dropping under the tree line.',
                          acousticNote: 'Mechanical hum of the Cinema Products CP-16 16mm transport.'
                        }
                      ],
                      productionNote: 'Shot on Kodak Tri-X 16mm reversal stock. DP Neal Fredericks taught Joshua Leonard how to read a light meter and load the CP-16 magazine in a motel room the night before Day 1 [SRC-03].'
                    },
                    {
                      id: 'seg-02-creek',
                      reelCode: 'TAPE A // HI8 NTSC COLOR',
                      timecodeStart: '01:18:44:00',
                      timecodeEnd: '01:22:10:12',
                      gauge: 'hi8-ntsc-color',
                      fictionalDate: 'Oct 23, 1994 — 16:40 EST',
                      realShootDate: 'Oct 26, 1997 (Day 4)',
                      realLocation: 'Seneca Creek Log Crossing, Montgomery County, MD',
                      title: 'Sequence 02: The Map Conflict & Circular Creek Crossing',
                      proceduralScene: 'creek-crossing',
                      transcript: [
                        {
                          timecode: '01:19:05:11',
                          speaker: 'HEATHER DONAHUE',
                          line: 'Where is the map, Mike? Give me the map right now.',
                          acousticNote: 'Built-in Hi8 condenser mic clipping on vocal transients.'
                        },
                        {
                          timecode: '01:19:22:28',
                          speaker: 'MICHAEL C. WILLIAMS',
                          line: 'I kicked it into the creek yesterday. It was useless! We walked south all day and we’re standing at the exact same log!',
                          acousticNote: 'Rush of Seneca Creek over gneiss boulders in background.'
                        }
                      ],
                      productionNote: 'The directors secretly instructed Michael Williams via his private 35mm canister note to dispose of the map and confess only when the other two actors reached maximum exhaustion [SRC-03].'
                    },
                    {
                      id: 'seg-03-twana',
                      reelCode: 'REEL 07 // CP-16 16MM B&W',
                      timecodeStart: '00:49:02:15',
                      timecodeEnd: '00:53:18:04',
                      gauge: '16mm-cp16-bw',
                      fictionalDate: 'Oct 24, 1994 — 11:20 EST',
                      realShootDate: 'Oct 27, 1997 (Day 5)',
                      realLocation: 'Oak Grove near Black Rock Mill, Seneca Creek State Park',
                      title: 'Sequence 03: The Stick Effigy (Twana) Canopy',
                      proceduralScene: 'twana-grove',
                      transcript: [
                        {
                          timecode: '00:49:33:09',
                          speaker: 'JOSHUA LEONARD',
                          line: 'Look up in the branches. They’re everywhere. Dozens of them suspended all around the clearing.',
                          acousticNote: 'Dry wooden sticks clattering softly in the autumn breeze.'
                        },
                        {
                          timecode: '00:50:11:21',
                          speaker: 'HEATHER DONAHUE',
                          line: 'Don’t touch them. Just roll the 16mm and let’s get out of this hollow.',
                          acousticNote: 'Rapid shallow breathing; footsteps retreating over leaf litter.'
                        }
                      ],
                      productionNote: 'Production designer Ben Rock constructed the humanoid stick figures ("twana") out of local deadwood and twine, hanging them in the dark before the actors arrived at the GPS coordinate [SRC-05].'
                    },
                    {
                      id: 'seg-04-apology',
                      reelCode: 'TAPE B // HI8 NTSC COLOR',
                      timecodeStart: '02:04:51:18',
                      timecodeEnd: '02:07:39:00',
                      gauge: 'hi8-ntsc-color',
                      fictionalDate: 'Oct 27, 1994 — 04:12 EST',
                      realShootDate: 'Oct 30, 1997 (Day 7)',
                      realLocation: 'Campsite Perimeter, Seneca Creek State Park',
                      title: 'Sequence 04: The Hi8 Tent Confessional',
                      proceduralScene: 'tent-apology',
                      transcript: [
                        {
                          timecode: '02:05:14:03',
                          speaker: 'HEATHER DONAHUE',
                          line: 'I just want to apologize to Mike’s mom, and Josh’s mom, and my mom. I am so sorry. Because it is my fault that we are out here.',
                          acousticNote: 'Extreme close-up proximity effect on internal Hi8 microphone; cold night wind against nylon tent wall.'
                        }
                      ],
                      productionNote: 'Heather Donahue framed this monologue herself inside the tent using the $400 Circuit City Hi8 camcorder. Unintentional framing error—cutting off the bottom half of her face due to lack of an LCD flip screen—made the shot one of the most recognizable images of 1990s cinema [SRC-03].'
                    },
                    {
                      id: 'seg-05-cellar',
                      reelCode: 'REEL 11 + TAPE B // DUAL SYNC',
                      timecodeStart: '02:38:10:00',
                      timecodeEnd: '02:41:59:29',
                      gauge: '16mm-cp16-bw',
                      fictionalDate: 'Oct 28, 1994 — 01:55 EST',
                      realShootDate: 'Oct 31, 1997 (Day 8 — Halloween Night)',
                      realLocation: 'Griggs House Cellar, Granite, Patapsco Valley State Park, MD',
                      title: 'Sequence 05: The Griggs House Cellar & Dropped Camera',
                      proceduralScene: 'griggs-cellar',
                      transcript: [
                        {
                          timecode: '02:40:12:06',
                          speaker: 'DISTANT VOICE (AUDIO PLAYBACK)',
                          line: '[Muffled cries echoing from the basement level below the wooden staircase]',
                          acousticNote: 'In-camera Hi8 audio separates from Michael’s dropped DAT recorder upstairs.'
                        },
                        {
                          timecode: '02:41:48:22',
                          speaker: 'FINAL FRAME TELEMETRY',
                          line: '[Subject 03 (Williams) observed standing motionless facing the northeast stone cellar corner. Subject 01 (Donahue) struck from behind; CP-16 16mm camera impacts dirt floor at 24fps.]',
                          acousticNote: 'Sudden mechanical shutter jam followed by 16mm tail-leader runout.'
                        }
                      ],
                      productionNote: 'To preserve genuine shock on Halloween night 1997, Heather Donahue was not told beforehand that Michael C. Williams would be standing facing the cellar corner recalling the 1941 Rustin Parr lore [SRC-03].'
                    }
                  ]
                }
              ]
            },
            {
              id: 'comp-05-a2',
              layout: 'split-investigative',
              elements: [
                {
                  id: 'el-05-doc-excavation',
                  type: 'document',
                  assetId: 'doc-excavation-log',
                  dossierCode: 'DOC-LORE-1995',
                  title: 'The Westerfield Cabin Excavation Paradox (October 1995 Lore)',
                  inUniverseDate: 'October 16, 1995 (In-Universe)',
                  realCreationContext: 'Post-production editing by Daniel Myrick & Eduardo Sánchez (1998–1999).',
                  summary:
                    'Examines the central temporal paradox of the found-footage lore: how October 1994 film cans and Hi8 tapes were supposedly excavated from beneath the undisturbed stone foundation of a cabin that burned down in 1941.',
                  transcriptExcerpt: [
                    'EVIDENCE INVENTORY: 11 cans of 16mm black-and-white film, 10 Hi8 8mm video cassettes, 9 DAT audio tapes, and 1 bound journal.',
                    'REAL EDITING RATIO: The actors shot roughly 19–20 hours of raw footage over 8 days, which Myrick and Sánchez edited down to 81 minutes.'
                  ],
                  factCheckVerdict: 'FICTIONAL FRAMING DEVICE EXPLAINING SURVIVAL OF THE FOOTAGE.'
                },
                {
                  id: 'el-05-img-camcorder',
                  type: 'image',
                  assetId: 'img-hi8-camcorder',
                  treatment: 'scanned-dossier',
                  caption: '1990s Hi8 8mm Analog Video Camcorder (Nabukodinosaure, CC BY-SA 4.0).',
                  archivalNote: 'In October 1997, the filmmakers bought an RCA Hi8 camcorder at a Circuit City in Maryland for $400—and returned it for a refund after wrapping principal photography to stay within their $35,000 budget [SRC-03].'
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // CHAPTER 06: THE REAL STORY (HAXAN FILMS & THE 1999 INTERNET PHENOMENON)
    // =========================================================================
    {
      id: 'chapter-06-the-real-story',
      number: '06',
      code: 'CH.06 // THE REAL STORY',
      title: 'The Real Story: Method Filmmaking & The 1999 Internet Mirage',
      subtitle: 'How five University of Central Florida graduates used GPS waypoints, milk crates, and a dial-up website to fool the world.',
      epigraph: {
        text: 'The campaign’s logic was simple: a website cost less than a trailer, and a legend was more persuasive when it looked like an archive found at two in the morning.',
        attribution: 'Editorial synthesis of the filmmakers’ marketing strategy · not a direct quotation'
      },
      truthLayer: 'PRODUCTION & MARKETING RECORD',
      introduction:
        'Strip away the supernatural mythology of Elly Kedward and Rustin Parr, and the true story of The Blair Witch Project becomes even more fascinating. It is a masterclass in guerrilla cinema, psychological method directing, and the exact historical moment in 1998–1999 when the World Wide Web transitioned from an academic network into a mass-cultural engine of belief.',
      theme: {
        bgHex: '#0c0f12',
        surfaceHex: '#14191e',
        accentHex: '#7097a8',
        borderHex: '#25303a',
        moodLabel: 'PRODUCTION ARCHIVE & MEDIA HISTORY'
      },
      ambientAudioId: 'aud-room-tone',
      transitionAsciiWord: 'HAXAN // 1999',
      transitionAsciiCoord: 'LAYER B: VERIFIED PRODUCTION & INTERNET HISTORY',
      scenes: [
        {
          id: 'scene-06-production',
          code: 'SCN 06.A',
          title: 'Phase I Directing Protocol & The Dial-Up Phenomenon',
          subtitle: 'From a $35,000 guerrilla shoot in October 1997 to a $248.6 million global watershed in July 1999',
          truthLayer: 'PRODUCTION & MARKETING RECORD',
          locationStamp: 'ORLANDO, FL / SUNDANCE, UT / BURKITTSVILLE, MD',
          dateStamp: '1993 – JULY 30, 1999 (VERIFIED)',
          compositions: [
            {
              id: 'comp-06-a1',
              layout: 'split-investigative',
              elements: [
                {
                  id: 'el-06-text-1',
                  type: 'text',
                  dropcap: true,
                  leadParagraph:
                    'The origins of the film date back to 1993 at the University of Central Florida’s film school, where students Daniel Myrick and Eduardo Sánchez realized that scary movies terrified them most not when showing rubber monsters, but when adopting the clinical, matter-of-fact tone of 1970s paranormal documentaries like "In Search of..." and "The Legend of Boggy Creek" [SRC-03].',
                  paragraphs: [
                    'Forming Haxan Films (named after Benjamin Christensen’s 1922 silent witchcraft documentary "Häxan") alongside producers Gregg Hale, Robin Cowie, and Michael Monello, they wrote a 35-page "Phase I" outline with zero scripted dialogue. Former military intelligence specialist Gregg Hale proposed treating the shoot like a military SERE (Survival, Evasion, Resistance, and Escape) field exercise: the actors would hike alone by day using a Garmin GPS tracker while the crew ambushed their sensory perimeter by night [SRC-03].',
                    'In June 1998—more than seven months before the film’s Sundance premiere—Michael Monello and the Haxan team launched BlairWitch.com [SRC-04]. Built for a few hundred dollars on dial-up web servers, the site never mentioned that a movie was being sold. Instead, it presented the 1785–1994 timeline, photographs of the recovered film cans, police chief interviews, and excerpted reels as an ongoing unsolved investigation.',
                    'When the film premiered at midnight on Saturday, January 23, 1999 at the Sundance Film Festival, Artisan Entertainment bought distribution rights for $1.1 million [SRC-06]. Pairing the expanded website with the July 11, 1999 Sci-Fi Channel documentary "Curse of the Blair Witch" [SRC-05], Artisan unleashed a transmedia feedback loop. Released wide on July 30, 1999, the film grossed $248.6 million worldwide—nearly 4,000 times its initial $60,000 pre-acquisition cost [SRC-06].'
                  ]
                },
                {
                  id: 'el-06-img-myrick',
                  type: 'image',
                  assetId: 'img-daniel-myrick',
                  treatment: 'editorial-large',
                  caption: 'Co-director and co-writer Daniel Myrick (Photograph by Hamedgamaoun, CC BY-SA 4.0).',
                  archivalNote: 'Alongside Eduardo Sánchez, Myrick pioneered the "method directing" GPS drop-box system that kept the actors unaware of each night’s acoustic and visual setups.'
                }
              ]
            },
            {
              id: 'comp-06-a2',
              layout: 'single-editorial',
              elements: [
                {
                  id: 'el-06-timeline-dual',
                  type: 'timeline',
                  title: 'Dual-Track Chronology: Fictional Mythology (1785–1995) vs. Real History (1824–1999)',
                  subtitle: 'Filter or compare both layers side by side to observe how Haxan Films braided a 200-year fictional legend around real Maryland geography.',
                  items: [
                    {
                      id: 'tl-1785',
                      date: 'Feb 1785',
                      title: 'Banishment of Elly Kedward in "Blair"',
                      layer: 'fictional-lore',
                      location: 'Fictional Town of Blair, MD',
                      summary: 'In-universe origin: Irish immigrant Elly Kedward is accused of drawing blood from children and banished into the Black Hills winter.',
                      verificationNote: 'FICTIONAL: Colonial Burkittsville was never named "Blair" and held no witch trials.',
                      sourceCode: 'SRC-04'
                    },
                    {
                      id: 'tl-1809',
                      date: '1809',
                      title: 'Publication of "The Blair Witch Cult"',
                      layer: 'fictional-lore',
                      location: 'Baltimore / Private Archive (Lore)',
                      summary: 'In-universe chapbook documenting the curse of Blair and the stick-effigy ("twana") markings.',
                      verificationNote: 'FICTIONAL PROP: Fabricated in 1999 by production designer Ben Rock for "Curse of the Blair Witch".',
                      sourceCode: 'SRC-05'
                    },
                    {
                      id: 'tl-1824',
                      date: '1824',
                      title: 'Real Founding of Burkittsville, Maryland',
                      layer: 'real-history',
                      location: 'Frederick County, Maryland',
                      summary: 'Major Henry Burkitt and Joshua Harley plat the two halves of the village at the base of South Mountain.',
                      verificationNote: 'VERIFIED HISTORY: Documented in the 1858 Isaac Bond Survey Map and 1975 National Register nomination.',
                      sourceCode: 'SRC-01'
                    },
                    {
                      id: 'tl-1850',
                      date: 'c. 1850',
                      title: 'Construction of the Historic Griggs House',
                      layer: 'real-history',
                      location: 'Granite, Baltimore County, MD',
                      summary: 'A two-story Federal-style stucco-over-wood house on a stone cellar foundation is built near the Patapsco River.',
                      verificationNote: 'VERIFIED HISTORY: Later incorporated into Patapsco Valley State Park and used for the film’s climax.',
                      sourceCode: 'SRC-07'
                    },
                    {
                      id: 'tl-1862',
                      date: 'Sep 14, 1862',
                      title: 'Battle of Crampton’s Gap (American Civil War)',
                      layer: 'real-history',
                      location: 'South Mountain / Burkittsville, MD',
                      summary: 'Union forces storm Crampton’s Gap above Burkittsville; the town’s churches serve as field hospitals for hundreds of wounded soldiers.',
                      verificationNote: 'VERIFIED HISTORY: Primary historical event in Burkittsville prior to 1999.',
                      sourceCode: 'SRC-01'
                    },
                    {
                      id: 'tl-1886',
                      date: 'Mar 1886',
                      title: 'Robin Weaver & The Coffin Rock Search Party',
                      layer: 'fictional-lore',
                      location: 'Coffin Rock / Tappy East Creek (Lore)',
                      summary: 'In-universe account of five searchers found bound and disemboweled on Coffin Rock before their bodies vanish.',
                      verificationNote: 'FICTIONAL LORE: Filmed in October 1997 at an outcrop along Seneca Creek State Park.',
                      sourceCode: 'SRC-04'
                    },
                    {
                      id: 'tl-1941',
                      date: 'May 25, 1941',
                      title: 'Confession of Rustin Parr ("The Burkittsville Seven")',
                      layer: 'fictional-lore',
                      location: 'Black Hills Hermitage (Lore)',
                      summary: 'In-universe hermit confesses to murdering seven children in his cellar while forcing one child to face the corner wall.',
                      verificationNote: 'FICTIONAL LORE: Invented by Myrick, Sánchez & Hale to set up the film’s final frame.',
                      sourceCode: 'SRC-04'
                    },
                    {
                      id: 'tl-1994',
                      date: 'Oct 20–28, 1994',
                      title: 'Disappearance of the Montgomery College Film Crew',
                      layer: 'fictional-lore',
                      location: 'Black Hills Forest (Lore)',
                      summary: 'In-universe disappearance of student filmmakers Heather Donahue, Joshua Leonard, and Michael C. Williams.',
                      verificationNote: 'FICTIONAL PLOT: The three actors were alive and filmed the movie three years later in October 1997.',
                      sourceCode: 'SRC-04'
                    },
                    {
                      id: 'tl-1997',
                      date: 'Oct 23–31, 1997',
                      title: '8-Day Principal Photography in Maryland State Parks',
                      layer: 'real-history',
                      location: 'Burkittsville, Seneca Creek & Patapsco Valley, MD',
                      summary: 'Myrick, Sánchez, and crew guide Donahue, Leonard, and Williams through an 8-day GPS-tracked guerrilla shoot on 16mm and Hi8.',
                      verificationNote: 'VERIFIED PRODUCTION RECORD: Roughly 20 hours of footage shot on a $35,000–$60,000 initial budget.',
                      sourceCode: 'SRC-03'
                    },
                    {
                      id: 'tl-1998',
                      date: 'Jun 1998 – Jul 1999',
                      title: 'Launch of BlairWitch.com, Sundance Premiere & Theatrical Release',
                      layer: 'real-history',
                      location: 'Park City, UT & Worldwide',
                      summary: 'BlairWitch.com sparks viral debate; Artisan acquires the film at Sundance (Jan 1999); worldwide release grosses $248.6 million.',
                      verificationNote: 'VERIFIED MEDIA HISTORY: Redefined modern viral film marketing and the found-footage genre.',
                      sourceCode: 'SRC-06'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // CHAPTER 07: WHAT REMAINS (EPILOGUE & FACT/FICTION LEDGER)
    // =========================================================================
    {
      id: 'chapter-07-what-remains',
      number: '07',
      code: 'CH.07 // WHAT REMAINS',
      title: 'What Remains: Aftermath in the Quiet Archive',
      subtitle: 'Distinguishing what belongs to cinema history, what belongs to folklore, and why the 1999 digital mirage cannot be repeated.',
      epigraph: {
        text: 'The house in Patapsco Valley State Park is gone now, dismantled stone by stone in December 1999. What survives is the blueprint of how the internet learned to dream in archival documents.',
        attribution: 'Curatorial conclusion · ENIGMA'
      },
      truthLayer: 'CRITICAL SYNTHESIS',
      introduction:
        'When the dust settled in late 1999, the collision between a fictional digital archive and physical Maryland geography left permanent marks on both. Here is our final investigative synthesis: a complete Fact vs. Fiction ledger, the real-world aftermath in Burkittsville and Patapsco Valley State Park, and full access to the primary source register.',
      theme: {
        bgHex: '#0d0e0d',
        surfaceHex: '#161816',
        accentHex: '#d8d2c5',
        borderHex: '#2c302c',
        moodLabel: 'INVESTIGATIVE SYNTHESIS & PROVENANCE ARCHIVE'
      },
      ambientAudioId: 'NONE',
      transitionAsciiWord: 'ARCHIVE // END',
      transitionAsciiCoord: 'EPILOGUE // COMPLETE FACT vs. FICTION LEDGER',
      scenes: [
        {
          id: 'scene-07-synthesis',
          code: 'SCN 07.A',
          title: 'The Epistemological Ledger & The Demolished House',
          subtitle: 'Why The Blair Witch Project worked at a singular historical threshold of the World Wide Web',
          truthLayer: 'CRITICAL SYNTHESIS',
          locationStamp: 'BURKITTSVILLE & GRANITE, MARYLAND',
          dateStamp: 'DECEMBER 1999 – PRESENT',
          compositions: [
            {
              id: 'comp-07-a1',
              layout: 'split-investigative',
              elements: [
                {
                  id: 'el-07-text-1',
                  type: 'text',
                  dropcap: true,
                  leadParagraph:
                    'Why did millions of intelligent readers and moviegoers in the summer of 1999 experience genuine epistemic uncertainty when browsing BlairWitch.com? Because the project arrived during a brief, unrepeatable historical window.',
                  paragraphs: [
                    'In 1998 and 1999, the World Wide Web possessed the institutional authority of an encyclopedia library, yet lacked centralized fact-checking ecosystems, Wikipedia, ubiquitous smartphone cameras, or public social media accounts for working actors. When Haxan Films uploaded grainy scans of "recovered 16mm film canisters," county sheriff interviews, and an 1809 woodcut book alongside IMDb pages marking Heather Donahue, Joshua Leonard, and Michael C. Williams as "Missing, presumed dead," the medium itself vouched for the message [SRC-04, SRC-06].',
                    'For the 150 real residents of Burkittsville, Maryland, the sudden convergence of fictional lore and physical geography proved overwhelming. In the autumn of 1999, tourists overran Main Street, trampled historic graves in the Burkittsville Union Cemetery looking for Rustin Parr, and repeatedly unbolted and stole the town’s wooden welcome signs [SRC-01, SRC-06].',
                    'Meanwhile, forty miles east in Patapsco Valley State Park, souvenir hunters stripped wood and plaster from the 150-year-old Griggs House where the film’s final cellar scene had been shot. In late December 1999, the State of Maryland quietly demolished the Griggs House completely [SRC-07]. The fictional house that could not exist in 1994 had caused the physical erasure of the real 1850 house that stood in for it.'
                  ]
                },
                {
                  id: 'el-07-img-patapsco',
                  type: 'image',
                  assetId: 'img-patapsco-tunnel',
                  treatment: 'monochrome-plate',
                  caption: 'Stonework in Patapsco Valley State Park, Maryland (Martymar1970, Public Domain).',
                  archivalNote: 'Patapsco Valley State Park housed the c. 1850 Griggs House in Granite, MD until its demolition in December 1999 following intense post-release trespassing [SRC-07].'
                }
              ]
            },
            {
              id: 'comp-07-a2',
              layout: 'single-editorial',
              elements: [
                {
                  id: 'el-07-matrix',
                  type: 'fact-fiction-matrix',
                  title: 'Definitive Fact vs. Fiction Verification Ledger',
                  subtitle: 'Every major claim of the Blair Witch phenomenon cross-referenced against primary historical, cartographic, and production records.',
                  rows: [
                    {
                      id: 'ff-01',
                      topic: 'Town of Blair (1785) vs. Burkittsville (1824)',
                      inUniverseClaim: 'Burkittsville was founded in 1824 atop the abandoned colonial settlement of "Blair," which fled in 1786 after the banishment of accused witch Elly Kedward.',
                      historicalReality: 'Burkittsville was never named "Blair." Settled by German-Swiss farmers in the 1700s, it was platted in 1824 by Major Henry Burkitt and Joshua Harley ("Harley’s Post Office"). No witch trials occurred there.',
                      primarySourceCode: 'SRC-01'
                    },
                    {
                      id: 'ff-02',
                      topic: '"The Blair Witch Cult" (1809 Book)',
                      inUniverseClaim: 'A rare 1809 chapbook preserved in historical collections documents the 1785 banishment and the stick-effigy curse.',
                      historicalReality: 'No such 1809 book exists. The volume shown in the 1999 Sci-Fi Channel broadcast was handcrafted in 1999 by production designer Ben Rock.',
                      primarySourceCode: 'SRC-05'
                    },
                    {
                      id: 'ff-03',
                      topic: 'Coffin Rock & Tappy East Creek (1825 / 1886)',
                      inUniverseClaim: 'Eileen Treacle drowned in Tappy East Creek in 1825, and five searchers were ritually murdered on Coffin Rock in March 1886.',
                      historicalReality: 'Both events and toponyms are fictional. The "Coffin Rock" scene in the film was shot at a gneiss rock outcrop along Seneca Creek State Park in Montgomery County, MD.',
                      primarySourceCode: 'SRC-07'
                    },
                    {
                      id: 'ff-04',
                      topic: 'Rustin Parr & The 1941 Cellar Murders',
                      inUniverseClaim: 'In May 1941, hermit Rustin Parr confessed to murdering seven Burkittsville children in his woodland basement while forcing a second child to face the corner.',
                      historicalReality: 'Entirely fictional character and crime invented by Daniel Myrick, Eduardo Sánchez, and Gregg Hale to create the visual grammar of the film’s ending.',
                      primarySourceCode: 'SRC-03'
                    },
                    {
                      id: 'ff-05',
                      topic: 'October 1994 Student Disappearance & 1995 Excavation',
                      inUniverseClaim: 'Film students Heather Donahue, Joshua Leonard, and Michael Williams vanished in Oct 1994; their 16mm/Hi8 reels were dug up beneath a burned cabin in Oct 1995.',
                      historicalReality: 'The three actors (using their real names) shot the footage themselves over 8 days (Oct 23–31, 1997) in Seneca Creek State Park guided by GPS waypoints left by the directors.',
                      primarySourceCode: 'SRC-03'
                    },
                    {
                      id: 'ff-06',
                      topic: 'The Ruined Woodland House in the Finale',
                      inUniverseClaim: 'The students stumble into the impossibly standing house of Rustin Parr (despite its having been burned down in 1941).',
                      historicalReality: 'Filmed on October 31, 1997 inside the historic c. 1850 Griggs House in Granite, Maryland (Patapsco Valley State Park). The State of Maryland demolished the house in December 1999.',
                      primarySourceCode: 'SRC-07'
                    }
                  ]
                },
                {
                  id: 'el-07-ascii-epilogue',
                  type: 'ascii-visual',
                  assetId: 'img-seneca-creek-lake',
                  title: 'Quiet Archive: Seneca Creek Waterline Dissolve',
                  subtitle: 'Final contemplative character field—water and late-October timber dissolving into sparse archival glyphs.',
                  narrativeContext:
                    'When the cameras stop rolling and the magnetic tape runs out, only the quiet Maryland woods remain—indifferent to the ghost stories projected onto their bark.',
                  storytellingMode: 'artifact-scan',
                  asciiConfig: {
                    palette: 'minimal-mono',
                    cols: 110,
                    contrast: 1.2,
                    brightness: 0.0,
                    threshold: 0.1,
                    invert: false,
                    colorMode: 'phosphor-bone',
                    animateDistortion: false,
                    initialRevealMix: 0.15
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
