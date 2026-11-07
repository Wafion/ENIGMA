export type DbcAssetStatus =
  | 'Genuine historical material'
  | 'Genuine photographic record'
  | 'Project-original reconstruction'
  | 'Diagrammatic reconstruction'
  | 'Representative photograph';

export interface DbcAsset {
  id: string;
  path: string;
  title: string;
  creator: string;
  date: string;
  license: string;
  licenseUrl?: string;
  sourceUrl: string;
  status: DbcAssetStatus;
  description: string;
  usage: string;
  note?: string;
}

const COMMONS = 'https://commons.wikimedia.org/wiki/File:';

export const DBC_ASSETS: DbcAsset[] = [
  {
    id: 'dbc-boeing-727-n467us',
    path: '/assets/db-cooper/images/northwest-727-n467us-1972.jpg',
    title: 'N467US, the Boeing 727-51 of Flight 305, in 1972',
    creator: 'Clint Groves',
    date: '29 December 1972',
    license: 'GFDL 1.2',
    licenseUrl: 'https://www.gnu.org/licenses/fdl-1.2.html',
    sourceUrl: `${COMMONS}Northwest_Airlines_Boeing_727-51_N467US.jpg`,
    status: 'Genuine photographic record',
    description:
      'The actual airframe, manufacturer serial number 18803, photographed at Miami in December 1972. The distinctive aft airstair is visible at the tail.',
    usage: 'Prologue, Flight 305, and Epilogue.',
    note: 'Attribution: Clint Groves, GFDL 1.2. The photograph is a historical record of the aircraft; it was not taken on the night of the hijacking.',
  },
  {
    id: 'dbc-plane-ticket-1971',
    path: '/assets/db-cooper/fbi/fbi-plane-ticket-1971.jpg',
    title: 'Northwest Orient Passenger Ticket issued to “Dan Cooper”',
    creator: 'Federal Bureau of Investigation / Northwest Orient Airlines',
    date: '24 November 1971',
    license: 'Public domain (U.S. Government / FBI Vault)',
    sourceUrl: `${COMMONS}DB_Cooper_plane_ticket.jpg`,
    status: 'Genuine historical material',
    description:
      'FBI evidence photograph of the one-way passenger ticket coupon purchased with cash at the Portland International Airport counter under the name “Dan Cooper” for Flight 305 to Seattle.',
    usage: 'Prologue, The Man, The Ground, The Evidence, and NORJAK Archive.',
    note: 'Primary physical document establishing that the hijacker gave the alias “Dan Cooper,” not “D.B. Cooper.”',
  },
  {
    id: 'dbc-composite-a',
    path: '/assets/db-cooper/fbi/fbi-composite-a-1971.jpg',
    title: 'FBI composite sketch A',
    creator: 'Federal Bureau of Investigation',
    date: 'November 1971',
    license: 'Public domain (U.S. Government work)',
    sourceUrl: `${COMMONS}Cooper_Composite_A.jpg`,
    status: 'Genuine historical material',
    description:
      'The first widely circulated artist’s impression of the hijacker, produced from witness descriptions in late November 1971.',
    usage: 'The Man; Suspects; Archive.',
    note: 'A composite is a memory rendered by an artist, not a photograph of a face.',
  },
  {
    id: 'dbc-composite-b',
    path: '/assets/db-cooper/fbi/fbi-composite-b-1973.jpg',
    title: 'FBI composite sketch B',
    creator: 'Roy Rose, Federal Bureau of Investigation',
    date: '1973',
    license: 'Public domain (U.S. Government work)',
    sourceUrl: `${COMMONS}CompositeB-FBI-1973.jpg`,
    status: 'Genuine historical material',
    description:
      'A later FBI composite drawn by Roy Rose. The two sketches are often printed side by side, though they were drawn years apart and from different recollections.',
    usage: 'The Man; Archive.',
  },
  {
    id: 'dbc-composite-b-sheet',
    path: '/assets/db-cooper/fbi/fbi-composite-b-sheet-1973.jpg',
    title: 'FBI Unidentified Flyer & Composite Sheet (1973)',
    creator: 'Federal Bureau of Investigation',
    date: '1973',
    license: 'Public domain (U.S. Government work)',
    sourceUrl: 'https://vault.fbi.gov/D-B-Cooper%20',
    status: 'Genuine historical material',
    description:
      'Full FBI circulation sheet pairing Composite B with physical descriptors and bureau identification notes.',
    usage: 'The Man; NORJAK Archive.',
  },
  {
    id: 'dbc-composite-age',
    path: '/assets/db-cooper/fbi/fbi-composite-age-progressed.jpg',
    title: 'Age-progressed FBI composite study',
    creator: 'Federal Bureau of Investigation',
    date: 'c. 2007',
    license: 'Public domain (U.S. Government work)',
    sourceUrl: 'https://www.fbi.gov/history/famous-cases/db-cooper-hijacking',
    status: 'Genuine historical material',
    description:
      'Later bureau age-progression rendering projecting how the subject described in 1971 might appear decades after the hijacking.',
    usage: 'The Man; Suspects.',
  },
  {
    id: 'dbc-wanted-poster',
    path: '/assets/db-cooper/fbi/fbi-wanted-poster.jpg',
    title: 'FBI wanted poster, “Dan Cooper”',
    creator: 'U.S. Federal Government',
    date: 'December 1971',
    license: 'Public domain (U.S. Government work)',
    sourceUrl: `${COMMONS}DB_Cooper_Wanted_Poster.jpg`,
    status: 'Genuine historical material',
    description:
      'A bureau notice issued under the alias “Dan Cooper.” The initials “D.B.” came from press reporting, not from the ticket.',
    usage: 'NORJAK Archive.',
  },
  {
    id: 'dbc-crew-cabin',
    path: '/assets/db-cooper/fbi/flight-305-crew-cabin-1971.jpg',
    title: 'Flight 305 crew inside the Boeing 727 aft cabin',
    creator: 'Federal Bureau of Investigation / Press Pool',
    date: 'November 1971',
    license: 'Public domain (U.S. Government / pre-1978 press release without notice)',
    sourceUrl: `${COMMONS}Flight_305_crew_in_cabin.jpg`,
    status: 'Genuine photographic record',
    description:
      'Captain William Scott, First Officer William Rataczak, Second Officer Harold Anderson, and flight attendant Tina Mucklow photographed inside the narrow rear aisle of the Boeing 727 near the ventral stairwell.',
    usage: 'Flight 305; The Note; NORJAK Archive.',
    note: 'Shows the exact physical confinement of the rear cabin where Cooper sat in Seat 18C.',
  },
  {
    id: 'dbc-crew-reno',
    path: '/assets/db-cooper/fbi/flight-305-crew-reno-1971.jpg',
    title: 'The crew of Flight 305 at Reno',
    creator: 'Hearst Newspapers / Seattle Post-Intelligencer',
    date: '24 November 1971',
    license: 'Public domain (published without copyright notice)',
    sourceUrl: `${COMMONS}Crew_of_Northwest_Airlines_Flight_305_after_D._B._Cooper_hijacking_2.jpg`,
    status: 'Genuine photographic record',
    description:
      'Captain William Scott, First Officer William Rataczak, flight attendant Tina Mucklow, and Second Officer Harold Anderson after the aircraft reached Reno. Tina Mucklow is the woman at centre.',
    usage: 'The Ground; The Second Takeoff; NORJAK Archive.',
    note: 'Mucklow was the last crew member to see the hijacker. She did not speak publicly for decades.',
  },
  {
    id: 'dbc-airstair-1975',
    path: '/assets/db-cooper/images/northwest-727-airstair-1975.jpg',
    title: 'Boeing 727 ventral aft airstair deployed',
    creator: 'U.S. National Archives / Aviation Record',
    date: '1975',
    license: 'Public domain / Archival record',
    sourceUrl: `${COMMONS}Boeing_727_aft_airstair.jpg`,
    status: 'Representative photograph',
    description:
      'Photograph looking directly up the deployed ventral aft airstair of a Boeing 727 under the T-tail and center engine exhaust—the narrow metal tunnel Cooper descended into a 200-knot slipstream.',
    usage: 'Flight 305; Second Flight; The Jump.',
  },
  {
    id: 'dbc-tina-bar-money-1980',
    path: '/assets/db-cooper/fbi/fbi-tina-bar-money-1980.jpg',
    title: 'Decomposing $20 ransom bills recovered at Tina Bar (1980)',
    creator: 'Federal Bureau of Investigation',
    date: 'February 1980',
    license: 'Public domain (U.S. Government work)',
    sourceUrl: `${COMMONS}DB_Cooper_money_found_in_1980.jpg`,
    status: 'Genuine photographic record',
    description:
      'FBI laboratory photograph of the decayed, sand-caked twenty-dollar bills uncovered by eight-year-old Brian Ingram at Tina Bar on the Columbia River on 10 February 1980. Serial numbers matched the 1971 Seattle ransom microfilm.',
    usage: 'The Money; The Evidence; NORJAK Archive.',
    note: 'The only confirmed physical trace of the hijacking ever recovered outside the aircraft.',
  },
  {
    id: 'dbc-lake-merwin-aerial',
    path: '/assets/db-cooper/images/lake-merwin-aerial.jpg',
    title: 'Aerial view of Lake Merwin and the Lewis River drainage',
    creator: 'U.S. Army Corps of Engineers / USGS Aerial Survey',
    date: 'Late 20th century',
    license: 'Public domain (U.S. Government work)',
    sourceUrl: `${COMMONS}Lake_Merwin_Washington_aerial.jpg`,
    status: 'Genuine photographic record',
    description:
      'High-altitude photograph of Lake Merwin, Ariel Dam, and the dense second-growth conifer ridges of Clark and Cowlitz Counties beneath the calculated 8:13 p.m. drop zone.',
    usage: 'The Search; The Landscape.',
  },
  {
    id: 'dbc-suspect-mccoy',
    path: '/assets/db-cooper/fbi/fbi-richard-mccoy-jr.jpg',
    title: 'Richard Floyd McCoy Jr. (FBI photograph, 1972)',
    creator: 'Federal Bureau of Investigation',
    date: 'April 1972',
    license: 'Public domain (U.S. Government work)',
    sourceUrl: `${COMMONS}Richard_Floyd_McCoy_Jr.jpg`,
    status: 'Genuine historical material',
    description:
      'FBI arrest photograph of Richard Floyd McCoy Jr., who hijacked United Airlines Flight 855 (also a Boeing 727) in April 1972 and parachuted via the aft stairs with $500,000.',
    usage: 'The Suspects.',
    note: 'Eliminated by the FBI as Cooper on the basis of flight-attendant witness comparison and a Thanksgiving family dinner alibi in Utah.',
  },
  {
    id: 'dbc-suspect-rackstraw',
    path: '/assets/db-cooper/fbi/us-army-robert-rackstraw-1970.jpg',
    title: 'Robert Wesley Rackstraw (U.S. Army photograph, 1970)',
    creator: 'United States Army',
    date: '1970',
    license: 'Public domain (U.S. Government work)',
    sourceUrl: `${COMMONS}Robert_Rackstraw_1970.jpg`,
    status: 'Genuine historical material',
    description:
      'Official U.S. Army portrait of Robert Wesley Rackstraw taken the year before the Flight 305 hijacking. Questioned and cleared by the FBI in 1978–1979.',
    usage: 'The Suspects.',
    note: 'Rackstraw was 28 in November 1971—roughly fifteen years younger than the mid-forties man described by both flight attendants.',
  },
  {
    id: 'dbc-cooper-vane',
    path: '/assets/db-cooper/images/cooper-vane-727.jpg',
    title: 'The “Cooper Vane” installed on a Boeing 727 ventral airstair',
    creator: 'Aviation Mechanical Archive / Wikimedia Commons',
    date: 'Post-1972',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    sourceUrl: `${COMMONS}Cooper_vane.jpg`,
    status: 'Genuine photographic record',
    description:
      'Close-up photograph of a spring-loaded aerodynamic wedge (“Cooper Vane”) fitted to the underside of Boeing 727 aircraft after 1972. In flight, airflow pushes the paddle over the aft stairwell lip, physically preventing the stairs from lowering.',
    usage: 'Epilogue.',
    note: 'The hijacker left no verified name, but his act permanently altered the mechanical design of the Boeing 727 fleet.',
  },
  {
    id: 'dbc-727-representative',
    path: '/assets/db-cooper/images/boeing-727-51-n838n.jpg',
    title: 'Boeing 727-51 of the same generation, 1979',
    creator: 'RuthAS',
    date: '30 September 1979',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    sourceUrl: `${COMMONS}Boeing_727-51_N838N_Piedmont_ORD_30.09.79_edited-2.jpg`,
    status: 'Representative photograph',
    description:
      'A Boeing 727-51 in Piedmont livery at Chicago O’Hare. This is not N467US and not the aircraft used on Flight 305; it is included only to show the type in its later operational life.',
    usage: 'Archive reference only.',
    note: 'Used sparingly. The documentary does not present this airframe as the Cooper aircraft.',
  },
  {
    id: 'dbc-recon-tie',
    path: '/assets/db-cooper/reconstructions/tie.svg',
    title: 'Reconstruction: the clip-on tie',
    creator: 'ENIGMA documentary studio',
    date: '2026',
    license: 'Project original',
    sourceUrl: '',
    status: 'Project-original reconstruction',
    description:
      'A measured drawing of the black J.C. Penney clip-on tie left aboard the aircraft. Proportions follow published descriptions; it is not a photograph of the object.',
    usage: 'The Evidence.',
  },
  {
    id: 'dbc-recon-money',
    path: '/assets/db-cooper/reconstructions/money-bundles.svg',
    title: 'Reconstruction: three ransom packets',
    creator: 'ENIGMA documentary studio',
    date: '2026',
    license: 'Project original',
    sourceUrl: '',
    status: 'Project-original reconstruction',
    description:
      'A diagram of the three bundles recovered at Tina Bar in 1980: two packets of one hundred $20 bills and a third of ninety.',
    usage: 'The Money; The Evidence.',
  },
  {
    id: 'dbc-recon-stairs',
    path: '/assets/db-cooper/reconstructions/aft-stairs.svg',
    title: 'Reconstruction: 727 aft airstair',
    creator: 'ENIGMA documentary studio',
    date: '2026',
    license: 'Project original',
    sourceUrl: '',
    status: 'Diagrammatic reconstruction',
    description:
      'A side-elevation diagram of the Boeing 727’s ventral aft airstair in the deployed position, based on the aircraft’s published geometry.',
    usage: 'The Jump; Flight 305.',
  },
];

export const DBC_ASSET_MAP: Record<string, DbcAsset> = Object.fromEntries(
  DBC_ASSETS.map((asset) => [asset.id, asset]),
);
