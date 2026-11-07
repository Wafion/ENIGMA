import type { DbcMapPlace } from './mapGeometry';

export type EvidenceStatus =
  | 'CONFIRMED'
  | 'DOCUMENTED'
  | 'REPORTED'
  | 'ALLEGED'
  | 'THEORY'
  | 'SPECULATION'
  | 'RECONSTRUCTION'
  | 'UNKNOWN';

export type DbcAudioScene =
  | 'prologue'
  | 'man'
  | 'flight'
  | 'note'
  | 'ground'
  | 'second-flight'
  | 'jump'
  | 'silence'
  | 'search'
  | 'money'
  | 'evidence'
  | 'archive'
  | 'suspects'
  | 'theories'
  | 'landscape'
  | 'unknowns'
  | 'epilogue'
  | 'sources';

export interface SceneMeta {
  id: string;
  number: string;
  title: string;
  short: string;
  audio: DbcAudioScene;
  theme: 'night' | 'steel' | 'paper' | 'archive';
  minutes: number;
}

export const SCENES: SceneMeta[] = [
  { id: 'dbc-prologue', number: '00', title: 'The Man Who Was Not There', short: 'Prologue', audio: 'prologue', theme: 'night', minutes: 2 },
  { id: 'dbc-the-man', number: '01', title: 'The Man in Seat 18C', short: 'The man', audio: 'man', theme: 'night', minutes: 2 },
  { id: 'dbc-flight-305', number: '02', title: 'Flight 305', short: 'Flight 305', audio: 'flight', theme: 'steel', minutes: 2 },
  { id: 'dbc-the-note', number: '03', title: 'The Note', short: 'The note', audio: 'note', theme: 'night', minutes: 2 },
  { id: 'dbc-the-ground', number: '04', title: 'Two Hours Over Puget Sound', short: 'The ground', audio: 'ground', theme: 'archive', minutes: 2 },
  { id: 'dbc-second-flight', number: '05', title: 'The Second Takeoff', short: 'The flight', audio: 'second-flight', theme: 'night', minutes: 2 },
  { id: 'dbc-the-jump', number: '06', title: 'The Aft Stairs', short: 'The jump', audio: 'jump', theme: 'night', minutes: 3 },
  { id: 'dbc-the-search', number: '07', title: 'The Search', short: 'The search', audio: 'search', theme: 'steel', minutes: 3 },
  { id: 'dbc-the-money', number: '08', title: 'The Money at Tina Bar', short: 'The money', audio: 'money', theme: 'paper', minutes: 3 },
  { id: 'dbc-the-evidence', number: '09', title: 'What Came Back', short: 'The evidence', audio: 'evidence', theme: 'night', minutes: 3 },
  { id: 'dbc-the-archive', number: '10', title: 'NORJAK', short: 'The archive', audio: 'archive', theme: 'archive', minutes: 3 },
  { id: 'dbc-the-suspects', number: '11', title: 'The Named', short: 'The suspects', audio: 'suspects', theme: 'paper', minutes: 3 },
  { id: 'dbc-the-theories', number: '12', title: 'Four Ways to Disappear', short: 'The theories', audio: 'theories', theme: 'night', minutes: 3 },
  { id: 'dbc-the-landscape', number: '13', title: 'The Ground Below', short: 'The landscape', audio: 'landscape', theme: 'steel', minutes: 2 },
  { id: 'dbc-the-unknowns', number: '14', title: 'The Shape of the Unknown', short: 'The unknowns', audio: 'unknowns', theme: 'night', minutes: 2 },
  { id: 'dbc-epilogue', number: '15', title: 'The Case That Stayed Open', short: 'Epilogue', audio: 'epilogue', theme: 'night', minutes: 2 },
  { id: 'dbc-sources', number: '16', title: 'The Register', short: 'Sources', audio: 'sources', theme: 'paper', minutes: 2 },
];

/* -------------------------------------------------------------------------- */
/* The man                                                                    */
/* -------------------------------------------------------------------------- */

export const MAN_FACTS = [
  { label: 'Age', value: 'mid-forties', status: 'REPORTED' as EvidenceStatus, source: 'SRC-01, SRC-15' },
  { label: 'Height', value: '5′10″–6′0″', status: 'REPORTED' as EvidenceStatus, source: 'SRC-15' },
  { label: 'Weight', value: '170–180 lb', status: 'REPORTED' as EvidenceStatus, source: 'SRC-15' },
  { label: 'Complexion', value: 'olive / swarthy', status: 'REPORTED' as EvidenceStatus, source: 'SRC-01' },
  { label: 'Eyes', value: 'brown, close-set', status: 'REPORTED' as EvidenceStatus, source: 'SRC-15' },
  { label: 'Hair', value: 'dark, short, combed back', status: 'REPORTED' as EvidenceStatus, source: 'SRC-15' },
  { label: 'Accent', value: 'none discernible', status: 'REPORTED' as EvidenceStatus, source: 'SRC-15' },
  { label: 'Given name', value: '“Dan Cooper”', status: 'CONFIRMED' as EvidenceStatus, source: 'SRC-01' },
];

export const CLOTHING = [
  'Dark suit or sport coat',
  'White shirt',
  'Black clip-on tie',
  'Mother-of-pearl tie clip',
  'Dark raincoat',
  'Brown shoes',
];

export const MAN_PROSE = {
  lede:
    'There is no photograph of the man who boarded Flight 305. There are two sketches, a ticket in a false name, and the recollections of two flight attendants who were interviewed separately on the same night and described almost the same person.',
  paragraphs: [
    'Florence Schaffner and Tina Mucklow spent the most time with him. Their accounts, given in separate cities hours after the aircraft landed, are unusually consistent: a white man in his mid-forties, five feet ten to six feet tall, 170 to 180 pounds, with olive skin, brown eyes, short dark hair combed back, and no distinguishable accent. He wore a dark suit, a white shirt, a black tie, a raincoat, and brown shoes. [SRC-15]',
    'He bought a one-way ticket at the Northwest Orient counter at Portland International Airport with cash. The name on the ticket was Dan Cooper. He carried a black attaché case and a brown paper bag. He sat in an aisle seat near the rear of the cabin — usually recorded as 18C, though some summaries list 18E. The discrepancy is small and unresolved. [SRC-01, SRC-15]',
    'The initials “D.B.” were not his. A reporter for The Oregon Journal, working against a deadline, recorded “Dan Cooper” as “D.B. Cooper.” Walter Cronkite read “D. A. Cooper” on the CBS Evening News. The mistake hardened into the name the world would use. The FBI would later say the initials were “apparently a myth created by the press.” [SRC-01, SRC-15]',
    'The composite sketches are not portraits. They are memories converted into line by an artist’s hand. The first was circulated within days; a second was drawn in 1973. They are useful as a family resemblance, not as a face. Everything the case knows about its subject begins with that limit.',
  ],
  quote: {
    text: 'He was not nervous. He seemed rather nice and he was not cruel or nasty.',
    attribution: 'Tina Mucklow, flight attendant, to the FBI',
    source: 'SRC-15',
  },
  margin: [
    'The two attendants did not compare notes before their interviews. Their agreement is the strongest evidence that the description is broadly right — and the reason the sketches keep circulating.',
    'A description can be consistent and still be wrong. Memory is reconstructive. The witnesses were frightened, and they were describing a man they had known for minutes.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Flight 305                                                                 */
/* -------------------------------------------------------------------------- */

export const AIRCRAFT_FACTS = [
  { label: 'Type', value: 'Boeing 727-51' },
  { label: 'Registration', value: 'N467US' },
  { label: 'Manufacturer serial', value: '18803' },
  { label: 'Delivered', value: '22 April 1965' },
  { label: 'Engines', value: 'three Pratt & Whitney JT8D turbofans' },
  { label: 'Distinction', value: 'ventral aft airstair' },
  { label: 'Route', value: 'Portland (PDX) → Seattle–Tacoma (SEA)' },
  { label: 'Scheduled block', value: 'about 30 minutes' },
];

export const CREW = [
  { name: 'William A. Scott', role: 'Captain', note: 'Kept a written chronology of the flight; noted the pitch change at 8:13 p.m.', status: 'DOCUMENTED' as EvidenceStatus },
  { name: 'William Rataczak', role: 'First Officer', note: 'Flew the aircraft after Seattle; reported the cabin oscillations by radio.', status: 'DOCUMENTED' as EvidenceStatus },
  { name: 'Harold E. Anderson', role: 'Second Officer / flight engineer', note: 'Managed the aircraft systems and fuel calculations.', status: 'DOCUMENTED' as EvidenceStatus },
  { name: 'Tina Mucklow', role: 'Flight attendant', note: 'Sat with Cooper for much of the flight; the last crew member to see him.', status: 'DOCUMENTED' as EvidenceStatus },
  { name: 'Florence Schaffner', role: 'Flight attendant', note: 'Received the note; carried Cooper’s demands to the cockpit.', status: 'DOCUMENTED' as EvidenceStatus },
  { name: 'Alice Hancock', role: 'Senior flight attendant', note: 'Released at Seattle with Schaffner; not aboard for the second flight.', status: 'DOCUMENTED' as EvidenceStatus },
];

export const FLIGHT_PROSE = {
  lede:
    'The aircraft was ordinary, and that was the point. A Boeing 727-51 with three engines at the rear and a staircase that folded down from the belly. It was the only commercial jet of its generation from which a man could step into the night.',
  paragraphs: [
    'Flight 305 was a short scheduled hop: Portland to Seattle, roughly thirty minutes in the air. On 24 November 1971 it carried six crew and either 36 or 37 passengers, depending on whether the hijacker is counted in the total. The FBI consistently says 36 passengers were released at Seattle. Other chronologies list 36 passengers including Cooper. The difference is one person and an unresolved convention, and it survives in almost every account of the case. [SRC-01, SRC-07, SRC-15]',
    'The 727’s aft airstair was a design feature, not a security flaw. It allowed passengers to board from the tail when an airport lacked jet bridges. It also opened the cabin to the air at 10,000 feet. Cooper would use it as an exit.',
    'He sat near the rear. Schaffner was on the jump seat behind him. The cabin was routine: business travellers, holiday traffic, a short flight before Thanksgiving. The first sign that anything was wrong was a piece of paper.',
  ],
  margin: [
    'The aircraft later flew for Piedmont as N383N and for Key Airlines as N29KA. It was not preserved. The history of the airframe is documented; the history of its most famous passenger is not. [SRC-08]',
    'The 727 was not a skydiving aircraft. It was a passenger jet that happened to have a door in the floor. Cooper’s plan depended on that accident of design.',
  ],
};

/* -------------------------------------------------------------------------- */
/* The note                                                                   */
/* -------------------------------------------------------------------------- */

export const NOTE_TEXT =
  'Miss — I have a bomb in my briefcase and want you to sit by me.';

export const DEMANDS = [
  { n: '01', text: '$200,000 in “negotiable American currency”', note: 'Ten thousand unmarked $20 bills, delivered in a knapsack or bag.' },
  { n: '02', text: 'Four parachutes', note: 'Two back packs, two chest reserves. The request implied a hostage would jump too.' },
  { n: '03', text: 'A fuel truck waiting at Seattle', note: 'The aircraft would need to leave again without delay.' },
  { n: '04', text: 'No police near the aircraft', note: 'Only one airline representative to approach the plane.' },
  { n: '05', text: 'Passengers remain seated', note: 'They would be released only after the money was aboard.' },
  { n: '06', text: 'Course for Mexico City', note: 'Later changed in practice: the aircraft flew south, then diverted to Reno for fuel.' },
  { n: '07', text: 'Altitude below 10,000 feet', note: 'Slow enough, and low enough, to open a ventral door.' },
  { n: '08', text: 'Airspeed under 200 knots', note: 'Flaps at 15 degrees. The cabin would not be pressurised.' },
];

export const NOTE_PROSE = {
  lede:
    'The note was short, printed in capitals with a felt-tip pen. Schaffner first put it in her purse, assuming it was a telephone number from a lonely man. Then she read it.',
  paragraphs: [
    'She sat down beside him and asked to see the bomb. Cooper opened the attaché case: a battery, wires, and what she described as eight red cylinders. He closed it. He was calm. He gave her a second set of instructions to carry to the cockpit. [SRC-07]',
    'The demands were specific in the way a checklist is specific: money, parachutes, fuel, course, altitude, speed, flaps, the release of passengers only after the ransom was aboard. He asked for four parachutes, not two. Investigators later concluded the request was a piece of theatre designed to make the crew believe a hostage might jump with him — and therefore to discourage anyone from handing over sabotaged equipment. [SRC-15]',
    'The plan had a flaw he could not control. One of the four parachutes supplied at Seattle was a training dummy, its canopy sewn shut. The harnesses supplied with the main parachutes also lacked the D-rings needed to attach a reserve. Cooper took the dummy anyway. He cut the canopy out of one reserve and used the bag for the money. [SRC-01, SRC-08]',
    'When Mucklow asked why he was doing it, he gave an answer that has never been explained: “It’s not because I have a grudge against your airlines, it’s just because I have a grudge.” [SRC-15]',
  ],
  quote: {
    text: 'It’s not because I have a grudge against your airlines, it’s just because I have a grudge.',
    attribution: 'The hijacker, as recalled by Tina Mucklow',
    source: 'SRC-15',
  },
  margin: [
    'The note is a reconstruction in this scene. The wording is quoted from the record; the paper, handwriting, and felt-tip texture are not.',
    'A bomb was never found. The case file treats the device as plausible, not proven. Cooper’s threat worked because no one was willing to test it.',
  ],
};

/* -------------------------------------------------------------------------- */
/* The ground                                                                 */
/* -------------------------------------------------------------------------- */

export const GROUND_PROSE = {
  lede:
    'For nearly two hours, Flight 305 circled over Puget Sound while a bank, an airline, a police department, and a parachute loft assembled the contents of a ransom.',
  paragraphs: [
    'The aircraft landed at Sea-Tac at 5:39 p.m. — some accounts say 5:46 — and parked on a partially lit runway away from the terminal. Northwest’s president, Donald Nyrop, had authorized compliance. The FBI and Seattle police gathered $200,000 from Seattle First National Bank: 10,000 unmarked $20 bills, most with serial numbers beginning with “L,” issued by the Federal Reserve Bank of San Francisco. The bag weighed about 19 pounds and measured roughly 11 by 12 by 6.5 inches. Before it left the bank, the FBI photographed the serial numbers onto microfilm. [SRC-01, SRC-09, SRC-15]',
    'The parachutes came from two directions. Two chest reserves were obtained from a skydiving school at Issaquah; two back packs from a local pilot, Norman Hayden. Earl Cossey, a master rigger, packed all four. In the rush, a dummy reserve used for ground training was included. It was marked with an X. Its canopy was sewn shut. [SRC-08, SRC-15]',
    'Northwest’s Seattle operations manager, Al Lee, carried the money to the aircraft in civilian clothes so that Cooper would not mistake him for a police officer. Mucklow collected the bag at the forward door and brought it to the rear. The passengers were released. Schaffner and Hancock left. Mucklow stayed. [SRC-15]',
    'Then the aircraft took off again, with five people aboard: Cooper, Mucklow, Scott, Rataczak, and Anderson.',
  ],
  stats: [
    { value: '$200,000', label: 'ransom', note: '10,000 × $20' },
    { value: '19 lb', label: 'bank bag', note: '≈ 8.5 kg' },
    { value: '4', label: 'parachutes', note: 'one was a dummy' },
    { value: '36', label: 'passengers released', note: 'FBI figure' },
  ],
  margin: [
    'The serial numbers were recorded before the money left the bank. That single administrative act is why the 1980 find could be identified nine years later.',
    'The dummy parachute is the detail that turns a caper into a forensic problem. Cooper appears to have known parachutes. The equipment he received was not a matched set.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Second flight                                                              */
/* -------------------------------------------------------------------------- */

export const SECOND_FLIGHT_PROSE = {
  lede:
    'The second takeoff was at about 7:40 p.m. The cabin was almost empty. Cooper told Mucklow to go forward and stay with the crew. A few minutes later, he was alone in the back of the aircraft.',
  paragraphs: [
    'The crew had been ordered to fly to Mexico City. In practice, the aircraft headed south at 10,000 feet and roughly 200 knots, flaps at 15 degrees, the landing gear left down, the cabin unpressurised. The route took it over southwestern Washington on airway V-23. The weather below was poor: rain, cloud, and a ceiling that put the ground out of sight. [SRC-01, SRC-07]',
    'Mucklow was the last person to see him. She recalled him standing in the aisle, tying what appeared to be the money bag around his waist. He declined an offer of help over the intercom at 8:00 p.m., when a cockpit warning light indicated that the aft airstair had been deployed. At 8:11 or 8:12 the crew reported oscillations in the cabin; at 8:13 the aircraft pitched nose-down and had to be re-trimmed. The crew inferred what had happened. They did not go back to look. [SRC-07, SRC-08]',
    'Two Air Force F-106s from McChord were in the air behind the 727. Their pilots saw nothing leave the aircraft. The sky was dark, the cloud was low, and the gap between the jets was too great. No human being watched Cooper jump. [SRC-08]',
    'The aircraft reached Reno at 10:15 p.m. The cabin was empty. Two parachutes remained: one reserve with three shroud lines cut from its canopy, and one intact main. The money, the attaché case, and the man were gone.',
  ],
  instruments: [
    { label: 'Altitude', value: '10,000 ft', note: 'ordered by Cooper' },
    { label: 'Airspeed', value: '≈ 200 kt', note: 'flaps 15°' },
    { label: 'Warning light', value: '20:00', note: 'aft airstair deployed' },
    { label: 'Oscillation', value: '20:11–20:13', note: 'crew report / trim change' },
    { label: 'Reno landing', value: '22:15', note: 'cabin empty' },
  ],
};

/* -------------------------------------------------------------------------- */
/* Timeline                                                                   */
/* -------------------------------------------------------------------------- */

export const TIMELINE = [
  { time: '14:50', title: 'Flight 305 departs Portland', detail: 'A scheduled 30-minute hop to Seattle. Cooper is aboard under the name Dan Cooper.', status: 'CONFIRMED' as EvidenceStatus, source: 'SRC-07' },
  { time: '≈15:00', title: 'The note', detail: 'Schaffner reads the note, sees the briefcase, and carries the demands to the cockpit.', status: 'DOCUMENTED' as EvidenceStatus, source: 'SRC-01' },
  { time: '15:00–17:30', title: 'Holding over Puget Sound', detail: 'The aircraft circles while the ransom and parachutes are assembled in Seattle.', status: 'CONFIRMED' as EvidenceStatus, source: 'SRC-15' },
  { time: '17:39–17:46', title: 'Landing at Sea-Tac', detail: 'The aircraft parks away from the terminal. The money and parachutes are brought aboard. Passengers are released.', status: 'CONFIRMED' as EvidenceStatus, source: 'SRC-01, SRC-07' },
  { time: '≈19:40', title: 'Second takeoff', detail: 'Five people aboard. Course south; altitude 10,000 feet; speed about 200 knots.', status: 'CONFIRMED' as EvidenceStatus, source: 'SRC-07' },
  { time: '20:00', title: 'Aft airstair warning light', detail: 'The cockpit asks whether Cooper needs assistance. He declines.', status: 'DOCUMENTED' as EvidenceStatus, source: 'SRC-07' },
  { time: '20:11–20:13', title: 'Oscillation and trim change', detail: 'The crew reports cabin oscillations; the aircraft pitches nose-down and is re-trimmed. The jump is inferred from this moment.', status: 'DOCUMENTED' as EvidenceStatus, source: 'SRC-07, SRC-08' },
  { time: '22:15', title: 'Landing at Reno', detail: 'The cabin is empty. Cooper, the money, and two parachutes are gone.', status: 'CONFIRMED' as EvidenceStatus, source: 'SRC-07' },
];

/* -------------------------------------------------------------------------- */
/* The search                                                                 */
/* -------------------------------------------------------------------------- */

export const SEARCH_PROSE = {
  lede:
    'The search began in the dark and continued for two years. It covered Clark and Cowlitz Counties, the Lewis River drainage, Lake Merwin, and the timbered ridges between them. It found no parachute, no body, and no money.',
  paragraphs: [
    'In the first days, FBI agents and local officers searched roads, clearings, and the area beneath the aircraft’s calculated path. In the spring of 1972, after the thaw, the effort expanded: about 200 soldiers from Fort Lewis, Air Force personnel, National Guardsmen, and civilian volunteers, working 18 days in March and another 18 in April. They moved through second-growth conifer, ravines, logging roads, and private timberland. [SRC-15]',
    'The terrain was not empty. It was inhabited, logged, and crossed by roads. That made the absence of evidence more striking, not less. A parachute is large. A body is not easy to miss forever. The search found neither.',
    'A calculated drop zone is not a location. It is a probability distribution drawn from heading, speed, wind, and the moment the aircraft pitched. The FBI’s estimate centred near Ariel, Washington, close to Lake Merwin and the Lewis River. The aircraft’s crew never saw the ground. The search was a best inference, not an observation. [SRC-01, SRC-15]',
    'In 2019 the FBI released a report describing a burglary at a grocery store near Heisson, Washington, about three hours after the jump. Heisson sits inside the calculated drop zone. The report is a lead, not a solution: no person was charged, and nothing recovered from the store was tied to the ransom. [SRC-15]',
  ],
  stats: [
    { value: '≈200', label: 'soldiers from Fort Lewis', note: 'spring 1972' },
    { value: '36', label: 'days of ground search', note: '18 in March, 18 in April' },
    { value: '2', label: 'counties searched', note: 'Clark and Cowlitz' },
    { value: '0', label: 'confirmed traces', note: 'no chute, body, or money' },
  ],
  margin: [
    'The search is often described as a failure. It is more accurate to call it an experiment in how quickly a forest can absorb an event.',
    'The FBI later said remaining physical clues may have been destroyed by the 1980 eruption of Mount St. Helens. That is a plausible explanation for some of the absence. It is not evidence of what happened.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Money                                                                     */
/* -------------------------------------------------------------------------- */

export const MONEY_PROSE = {
  lede:
    'Nine years later, on 10 February 1980, an eight-year-old boy dug a fire pit in the sand at Tina Bar on the Columbia River and uncovered three packets of decomposing twenty-dollar bills.',
  paragraphs: [
    'Brian Ingram was camping with his parents about nine miles downstream from Vancouver, Washington, and roughly twenty miles southwest of Ariel. The packets held two bundles of one hundred $20 bills and a third bundle of ninety: 290 bills, $5,800. The rubber bands were still in place. The edges had rotted. The serial numbers matched the ransom list the FBI had photographed in 1971. [SRC-01, SRC-09]',
    'It is the only confirmed ransom money ever recovered outside the aircraft. The FBI searched the bar and found fragments. No other bundles surfaced. The remaining $194,200 has never been identified in circulation.',
    'How the money reached Tina Bar is unresolved. One possibility is that Cooper lost it on landing and the river carried it downstream. Another is that it was buried in dredge spoil: sand was dredged from the Columbia and dumped on the bar in 1974. A 2020 study of diatoms on the bills found only species that bloom in spring, suggesting the bundles entered the water months after the November 1971 hijacking, not on the night of the jump. [SRC-10]',
    'That finding complicates the simplest story. It does not identify a hand, a boat, or a second crime. It only says: the money’s journey was not necessarily the parachute’s journey.',
  ],
  stats: [
    { value: '$5,800', label: 'recovered', note: '290 bills' },
    { value: '2.9%', label: 'of the ransom', note: 'of $200,000' },
    { value: '3', label: 'packets', note: '100 + 100 + 90 bills' },
    { value: '9 mi', label: 'downstream of Vancouver', note: '≈ 14 km' },
  ],
  interpretations: [
    {
      title: 'Lost on landing',
      status: 'THEORY' as EvidenceStatus,
      body: 'Cooper landed in or near the Columbia, lost part of the ransom, and the current deposited it at Tina Bar. Supports: the packets were bundled as delivered. Contradicts: the diatom evidence points to a later entry, and the drop zone is twenty miles from the bar.',
    },
    {
      title: 'Moved by dredging',
      status: 'THEORY' as EvidenceStatus,
      body: 'The bundles lay in river sediment, were dredged in 1974, and were redeposited on the bar with the sand. Supports: the Corps of Engineers dredged the area and pumped spoil onto Tina Bar. Contradicts: no direct record ties the bundles to that operation.',
    },
    {
      title: 'Placed later',
      status: 'SPECULATION' as EvidenceStatus,
      body: 'Someone other than Cooper handled the money and deposited it at the bar years afterward. Supports: nothing directly. Contradicts: nothing directly. It is a possibility generated by the evidence, not a finding.',
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Evidence                                                                  */
/* -------------------------------------------------------------------------- */

export interface EvidenceItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  status: EvidenceStatus;
  assetId?: string;
  summary: string;
  facts: string[];
  limits: string[];
  source: string;
  x: number;
  y: number;
}

export const EVIDENCE: EvidenceItem[] = [
  {
    id: 'tie',
    number: 'E-01',
    title: 'The tie',
    subtitle: 'Black clip-on, J.C. Penney',
    status: 'CONFIRMED',
    assetId: 'dbc-recon-tie',
    summary:
      'Cooper removed his tie before jumping. It was recovered aboard the aircraft and became the case’s most useful biological artefact.',
    facts: [
      'A black clip-on tie with a mother-of-pearl tie clip, sold by J.C. Penney. [SRC-01]',
      'The FBI lifted a DNA sample from the tie in 2001. [SRC-03]',
      'Trace examination reported uncommon metal particles, including titanium, on the fabric. [SRC-15]',
    ],
    limits: [
      'DNA can exclude a suspect. It cannot name a man with no comparison sample.',
      'The tie proves Cooper was aboard. It does not prove who he was.',
    ],
    source: 'SRC-01, SRC-03',
    x: 50,
    y: 41,
  },
  {
    id: 'parachutes',
    number: 'E-02',
    title: 'The parachutes',
    subtitle: 'Four supplied; two left behind',
    status: 'CONFIRMED',
    assetId: 'dbc-airstair-1975',
    summary:
      'Two main back packs and two chest reserves were delivered at Seattle. One reserve was a dummy with a sewn-shut canopy. Two parachutes were still aboard at Reno.',
    facts: [
      'Mains supplied by pilot Norman Hayden; reserves from a skydiving school; all four packed by Earl Cossey. [SRC-08, SRC-15]',
      'The reserve left aboard had three shroud lines cut from its canopy. The main left aboard was intact. [SRC-15]',
      'The harnesses lacked D-rings, so a reserve could not be attached to the main harness. [SRC-08, SRC-15]',
    ],
    limits: [
      'The parachute Cooper used was never found.',
      'It is unknown whether his canopy opened, whether he cut away, or how fast he was descending.',
    ],
    source: 'SRC-01, SRC-08',
    x: 27,
    y: 62,
  },
  {
    id: 'money',
    number: 'E-03',
    title: 'The money',
    subtitle: '$200,000; $5,800 recovered',
    status: 'CONFIRMED',
    assetId: 'dbc-tina-bar-money-1980',
    summary:
      'Ten thousand unmarked $20 bills, serials recorded on microfilm. In 1980, 290 of those bills were found at Tina Bar.',
    facts: [
      'Ransom assembled at Seattle First National Bank; bag weighed about 19 pounds. [SRC-09]',
      '1980 find: two packets of 100 bills and one of 90, still bundled. [SRC-01, SRC-09]',
      'The serial numbers matched the 1971 microfilm. [SRC-09]',
    ],
    limits: [
      'The route from the drop zone to Tina Bar is not established.',
      'The remaining 9,710 bills have never been identified in circulation.',
    ],
    source: 'SRC-01, SRC-09, SRC-10',
    x: 73,
    y: 63,
  },
  {
    id: 'note',
    number: 'E-04',
    title: 'The ticket & note',
    subtitle: 'Cash coupon & hand-printed demand',
    status: 'DOCUMENTED',
    assetId: 'dbc-plane-ticket-1971',
    summary:
      'A one-way cash ticket issued to “Dan Cooper” at Portland and a short handwritten note shown to Florence Schaffner. Cooper retrieved the note; the ticket coupon survived.',
    facts: [
      'Ticket coupon issued at Portland counter for $20.00 cash under “Dan Cooper.” [SRC-01]',
      '“Miss — I have a bomb in my briefcase and want you to sit by me.” [SRC-07]',
      'Cooper opened the case to show a battery, wires, and red cylinders. [SRC-07]',
    ],
    limits: [
      'Cooper took the physical demand note back from Schaffner.',
      'A handwriting exclusion on the ticket is not an identification.',
    ],
    source: 'SRC-01, SRC-07, SRC-13',
    x: 50,
    y: 17,
  },
  {
    id: 'prints',
    number: 'E-05',
    title: 'The fingerprints',
    subtitle: '66 latent prints',
    status: 'DOCUMENTED',
    assetId: 'dbc-composite-b-sheet',
    summary:
      'The FBI recovered 66 latent fingerprints from the aircraft. None produced a match to a known suspect.',
    facts: [
      'Prints were lifted from surfaces Cooper is believed to have touched. [SRC-15]',
      'Duane Weber was eliminated in 1998 when his prints did not match. [SRC-15]',
    ],
    limits: [
      'A print is only useful if the person is already in a comparison file.',
      'The absence of a match is not the absence of a man.',
    ],
    source: 'SRC-15',
    x: 26,
    y: 29,
  },
  {
    id: 'absence',
    number: 'E-06',
    title: 'The missing',
    subtitle: 'What was never found',
    status: 'UNKNOWN',
    summary:
      'No bomb, no body, no used parachute, no attaché case, no confirmed sighting, and no ground accomplice have ever been established.',
    facts: [
      'The bomb was described by a witness; it was never recovered. [SRC-07]',
      'No parachute attributable to Cooper has been found. [SRC-01]',
      'The FBI has said it found no evidence of a ground accomplice. [SRC-03]',
    ],
    limits: [
      'Absence is evidence of absence only when the search is complete. This one was not.',
      'The 1980 eruption of Mount St. Helens altered the search landscape. [SRC-15]',
    ],
    source: 'SRC-01, SRC-03',
    x: 73,
    y: 30,
  },
];

/* -------------------------------------------------------------------------- */
/* Suspects                                                                  */
/* -------------------------------------------------------------------------- */

export interface Suspect {
  id: string;
  name: string;
  life: string;
  role: string;
  status: EvidenceStatus;
  badge: string;
  portraitAssetId?: string;
  ageIn1971: string;
  why: string;
  support: string[];
  contradict: string[];
  outcome: string;
  source: string;
}

export const SUSPECTS: Suspect[] = [
  {
    id: 'mccoy',
    name: 'Richard Floyd McCoy Jr.',
    life: '1942–1974',
    role: 'Convicted copycat hijacker',
    status: 'DOCUMENTED',
    badge: 'Investigated by the FBI',
    portraitAssetId: 'dbc-suspect-mccoy',
    ageIn1971: '29 yrs (Witnesses: mid-40s)',
    why:
      'In April 1972, less than five months after Flight 305, McCoy hijacked a United Airlines 727, took $500,000, and jumped over Utah. The similarity was immediate.',
    support: [
      'A 727 with aft stairs; a parachute escape; a ransom demand; military jump training. [SRC-13]',
      'His family and some investigators later argued the tie and tie clip left aboard belonged to him. [SRC-15]',
      'A 2024 claim by his children, after a parachute was reportedly found on family property, renewed the theory. [SRC-15]',
    ],
    contradict: [
      'McCoy was 29 in 1971; the witnesses described a man in his mid-forties. [SRC-01]',
      'He did not match the physical description, and the FBI ruled him out. [SRC-01]',
      'He was at home in Utah for Thanksgiving the day after the hijacking. [SRC-03]',
    ],
    outcome:
      'McCoy was convicted for the United Airlines hijacking, not for Flight 305. He escaped from prison in 1974 and was killed by FBI agents. The FBI has never treated him as Cooper.',
    source: 'SRC-01, SRC-03, SRC-13',
  },
  {
    id: 'weber',
    name: 'Duane L. Weber',
    life: '1924–1995',
    role: 'Career criminal; deathbed claimant',
    status: 'ALLEGED',
    badge: 'Claimed on his deathbed',
    ageIn1971: '47 yrs (Matches age range)',
    why:
      'Three days before his death in 1995, Weber told his wife, “I am Dan Cooper.” She did not know what the name meant until a friend explained it months later.',
    support: [
      'He matched the general physical description. [SRC-15]',
      'He had a long criminal record, including burglary and forgery. [SRC-15]',
      'His widow reported that he had once mentioned a name that sounded like Cooper and had unexplained knowledge of the case. [SRC-15]',
    ],
    contradict: [
      'His fingerprints did not match any of the 66 latents from the aircraft. [SRC-15]',
      'DNA testing on the tie ruled him out. [SRC-03]',
      'A deathbed confession is a claim, not corroboration.',
    ],
    outcome:
      'The FBI eliminated Weber in 1998. He remains the most frequently cited “confession” in the case, and the one most clearly closed by physical evidence.',
    source: 'SRC-03, SRC-15',
  },
  {
    id: 'christiansen',
    name: 'Kenneth Christiansen',
    life: '1926–1994',
    role: 'Army paratrooper; Minnesota warehouse worker',
    status: 'ALLEGED',
    badge: 'Named by his brother',
    ageIn1971: '45 yrs (Matches age range)',
    why:
      'In 2003, Kenneth’s brother Lyle watched a documentary and became convinced that his late brother was the hijacker. He approached the FBI and later co-operated with a book.',
    support: [
      'Christiansen was a paratrooper and had jump experience. [SRC-15]',
      'He had worked for Northwest Orient and had knowledge of the 727. [SRC-15]',
      'Family photographs were said to resemble the composite. [SRC-15]',
    ],
    contradict: [
      'He did not match the witnesses’ physical description (shorter, thinner, lighter complexion). [SRC-03]',
      'The FBI said he was a skilled paratrooper, which cut against the profile of an amateur. [SRC-03]',
      'No physical evidence ties him to the aircraft or the money.',
    ],
    outcome:
      'The FBI did not name him as a suspect. The theory rests on family recollection and circumstantial resemblance, not on evidence.',
    source: 'SRC-03, SRC-15',
  },
  {
    id: 'rackstraw',
    name: 'Robert W. Rackstraw',
    life: '1948–2019',
    role: 'Vietnam veteran; pilot; con man',
    status: 'ALLEGED',
    badge: 'Questioned, then dropped',
    portraitAssetId: 'dbc-suspect-rackstraw',
    ageIn1971: '28 yrs (Witnesses: mid-40s)',
    why:
      'Rackstraw resembled the sketches, had military parachute training, and had a criminal record. The FBI questioned him in 1978 after explosives were found in a Stockton warehouse he leased.',
    support: [
      'Physical resemblance to the composite sketches. [SRC-15]',
      'Parachute training and aviation knowledge. [SRC-12]',
      'A 2016 History Channel series argued his case; a civil action later sought FBI records. [SRC-12]',
    ],
    contradict: [
      'He was 28 in 1971; the witnesses described a man in his forties. [SRC-15]',
      'Tina Mucklow did not identify him. [SRC-15]',
      'The FBI said in 1979 that he was no longer a suspect. [SRC-12]',
    ],
    outcome:
      'Rackstraw denied being Cooper, called a later admission a stunt, and was never charged. He died in 2019. The FBI has not reopened the identification.',
    source: 'SRC-12, SRC-15',
  },
  {
    id: 'gossett',
    name: 'William Pratt Gossett',
    life: '1930–2003',
    role: 'Marine, soldier, jump-trained veteran',
    status: 'ALLEGED',
    badge: 'Named by researchers',
    ageIn1971: '41 yrs (Close to range)',
    why:
      'Gossett was a jump-trained veteran with wilderness experience who was reportedly obsessed with the Cooper case. A lawyer and researcher, Galen Cook, collected accounts from his family.',
    support: [
      'Military jump training and survival experience. [SRC-15]',
      'He reportedly showed his sons a safe-deposit key in Vancouver, British Columbia, and claimed it held the ransom. [SRC-15]',
      'Family accounts placed him under financial pressure. [SRC-15]',
    ],
    contradict: [
      'The FBI said it had no direct evidence implicating him. [SRC-15]',
      'It could not reliably place him in the Pacific Northwest at the time. [SRC-15]',
      'The safe-deposit box was never shown to contain the money.',
    ],
    outcome:
      'Gossett was never charged or officially named as a suspect. The case against him is a set of family anecdotes, not a chain of evidence.',
    source: 'SRC-15',
  },
  {
    id: 'catalano',
    name: 'Fred Catalano',
    life: '1935–2006',
    role: 'TWA purser; pilot',
    status: 'REPORTED',
    badge: 'Never formally eliminated',
    ageIn1971: '36 yrs',
    why:
      'Airlines were asked to identify employees who might fit the profile. Catalano, a TWA purser with flying experience and money troubles, was reported. A passenger picked his photograph from a line-up.',
    support: [
      'A passenger, Robert Gregory, identified him as a strong resemblance. [SRC-15]',
      'The FBI could not account for his whereabouts between 22 and 28 November 1971. [SRC-15]',
      'He had aviation knowledge and financial pressure. [SRC-15]',
    ],
    contradict: [
      'No physical evidence connects him to the aircraft or the ransom.',
      'A photograph identification decades later is weak evidence.',
      'The FBI never obtained a DNA sample before his death, so he could not be tested against the tie. [SRC-15]',
    ],
    outcome:
      'Catalano was one of the few suspects the FBI had not formally eliminated by 2004. That is a statement about the limits of the file, not about his guilt. He died in 2006.',
    source: 'SRC-15',
  },
];

export const SUSPECT_NOTE =
  'A suspect is not a solution. The names below are included because they were investigated, formally named, or publicly claimed — not because any of them has been established as the hijacker. The FBI has never identified a culprit.';

/* -------------------------------------------------------------------------- */
/* Theories                                                                  */
/* -------------------------------------------------------------------------- */

export interface Theory {
  id: string;
  number: string;
  title: string;
  claim: string;
  why: string;
  support: string[];
  contradict: string[];
  unknown: string[];
  verdict: string;
}

export const THEORIES: Theory[] = [
  {
    id: 'died',
    number: 'T-01',
    title: 'He did not survive',
    claim: 'Cooper was killed by the jump, the landing, or the cold, and his remains were never found.',
    why:
      'It is the FBI’s stated leaning and the simplest explanation for the absence of a body, a parachute, and any spent ransom money.',
    support: [
      'The reserve was a dummy with a sewn-shut canopy; the harness could not take a reserve. [SRC-08]',
      'He jumped at night, in rain, over forest, in street clothes and brown shoes. [SRC-01]',
      'The FBI notes the parachute could not be steered. [SRC-01]',
      'No ransom bill beyond the 1980 find has ever surfaced in circulation. [SRC-09]',
    ],
    contradict: [
      'No body, harness, or used canopy was ever found. [SRC-01]',
      'Other hijackers survived comparable jumps from 727s, including McCoy. [SRC-15]',
      'The 1980 money find proves at least part of the ransom reached the ground; it does not prove Cooper did not.',
    ],
    unknown: [
      'Whether the main canopy opened.',
      'Whether he was conscious on landing.',
      'Where he landed.',
    ],
    verdict: 'Plausible, unproven, and officially favoured.',
  },
  {
    id: 'survived',
    number: 'T-02',
    title: 'He survived and disappeared',
    claim: 'Cooper landed, left the region, and lived under another identity. The money was never spent openly.',
    why:
      'It is the version the culture prefers: the competent man who beat the system. It is also the version most dependent on what did not happen.',
    support: [
      'The 727’s aft stairs made a controlled exit possible. [SRC-15]',
      'Some experienced jumpers and investigators argue the drop was survivable. [SRC-15]',
      'The area below the flight path included open ground as well as forest. [SRC-15]',
      'No confirmed body was ever recovered.',
    ],
    contradict: [
      'No confirmed sighting or credible later identity has been established. [SRC-01]',
      'The ransom money did not enter circulation. [SRC-09]',
      'He had no known ground support and did not know his exact position. [SRC-03]',
      'The physical description and the planning suggest a man who prepared, not a man who guaranteed his own escape.',
    ],
    unknown: [
      'How he would have left the search area without a vehicle or accomplice.',
      'Why he would never spend or launder the money.',
      'Whether anyone helped him afterward.',
    ],
    verdict: 'Possible; supported by absence, not by evidence.',
  },
  {
    id: 'accomplice',
    number: 'T-03',
    title: 'Someone was waiting',
    claim: 'Cooper had ground support: a vehicle, a boat, or a person who knew where he would land.',
    why:
      'It solves the hardest problem in the case — how a man in city clothes crosses miles of dark timber and reaches safety.',
    support: [
      'The plan shows detailed knowledge of the 727, the route, and the ransom procedure.',
      'A vehicle or boat would explain the lack of a body and the failure to find a parachute.',
      'The drop zone was near roads and the Lewis River.',
    ],
    contradict: [
      'The FBI said it found no evidence of a ground accomplice. [SRC-03]',
      'Cooper did not know his position: he told the crew to fly to Mexico and had no way to fix a drop point. [SRC-03]',
      'Cloud cover below 5,000 feet made visual signalling impossible. [SRC-03]',
      'No witness, vehicle, or boat was ever tied to the case.',
    ],
    unknown: [
      'Whether an accomplice existed at all.',
      'How a rendezvous could have been coordinated without radio contact.',
      'Whether the 1980 money find reflects a second handler.',
    ],
    verdict: 'A theory that explains the gaps by adding an unobserved actor. Not evidence.',
  },
  {
    id: 'money',
    number: 'T-04',
    title: 'The money moved later',
    claim: 'The Tina Bar bundles did not arrive in 1971. They entered the river months or years afterward, possibly through dredging or a second hand.',
    why:
      'Because the physical condition of the bills and the diatoms on them do not fit a simple “lost on landing” story.',
    support: [
      'The 2020 diatom study found spring-bloom species, not the November assemblage expected from a 1971 immersion. [SRC-10]',
      'The Columbia was dredged near Tina Bar in 1974, and spoil was deposited on the beach. [SRC-16]',
      'The drop zone is about twenty miles from the bar; the Lewis River enters the Columbia downstream of the jump area. [SRC-09]',
    ],
    contradict: [
      'No document directly ties the bundles to the dredging. [SRC-10]',
      'The packets were still banded in the order delivered, which suggests they were not widely handled. [SRC-09]',
      'The diatom study constrains timing; it does not establish a mechanism.',
    ],
    unknown: [
      'Where the bundles were between 1971 and their entry into the water.',
      'Whether Cooper or someone else put them there.',
      'How much of the ransom was ever in the river.',
    ],
    verdict: 'The most interesting forensic problem in the case, and the least resolved.',
  },
];

/* -------------------------------------------------------------------------- */
/* Landscape                                                                 */
/* -------------------------------------------------------------------------- */

export const LANDSCAPE_PLACES: { id: DbcMapPlace; name: string; code: string; note: string }[] = [
  { id: 'portland', name: 'Portland, Oregon', code: 'PDX', note: 'Ticket purchased; Flight 305 departs 2:50 p.m.' },
  { id: 'vancouver', name: 'Vancouver, Washington', code: 'VAN', note: 'Columbia River crossing; Tina Bar lies downstream.' },
  { id: 'woodland', name: 'Woodland, Washington', code: 'WDL', note: 'Lewis River joins the Columbia here.' },
  { id: 'ariel', name: 'Ariel, Washington', code: 'ARL', note: 'Centre of the FBI’s calculated drop zone.' },
  { id: 'lakeMerwin', name: 'Lake Merwin', code: 'MRW', note: 'Reservoir on the Lewis River; repeatedly searched.' },
  { id: 'heisson', name: 'Heisson, Washington', code: 'HEI', note: 'Inside the drop zone; site of a reported post-jump burglary.' },
  { id: 'tinaBar', name: 'Tina Bar', code: 'TNB', note: '1980 money find, about 9 miles downstream of Vancouver.' },
  { id: 'seattle', name: 'Seattle–Tacoma', code: 'SEA', note: 'Ransom exchange; second takeoff at about 7:40 p.m.' },
];

export const LANDSCAPE_PROSE = {
  lede:
    'The drop zone is a shape drawn on a map after the fact. It is not a place Cooper chose. It is where the aircraft’s speed, heading, wind, and the 8:13 p.m. trim change put him, within a margin of miles.',
  paragraphs: [
    'The terrain below the route is a patchwork of second-growth conifer, logging roads, private timber holdings, small lakes, and the Lewis River drainage. Lake Merwin and Yale Lake are reservoirs. The Columbia lies to the south and west. Tina Bar is on the Columbia, about twenty miles from the centre of the estimated drop zone. [SRC-09, SRC-15]',
    'A man landing in that country at night would have had three problems: water, timber, and orientation. Lake Merwin is cold in November. The forest is dense enough to swallow a parachute. Without a light or a radio, there is no easy way to establish which ridge is which. None of this proves he died. It describes the ground he chose.',
    'The map in this scene is a reconstruction drawn from public boundary data and documented coordinates. The route is diagrammatic. The drop zone is a probability field, not a pin.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Unknowns                                                                  */
/* -------------------------------------------------------------------------- */

export const UNKNOWNS = [
  {
    n: '01',
    title: 'Who was he?',
    body: 'No name, no confirmed photograph, no fingerprint match, no DNA identification. The file contains a description and a set of exclusions.',
  },
  {
    n: '02',
    title: 'Where exactly did he leave the aircraft?',
    body: 'The 8:11–8:13 oscillation is the best available marker. It locates an event within minutes and miles, not a point on the ground.',
  },
  {
    n: '03',
    title: 'Did he survive?',
    body: 'The FBI leans no. The physical record contains no body, no used parachute, and no proof either way.',
  },
  {
    n: '04',
    title: 'Where is the rest of the money?',
    body: 'Only $5,800 has been recovered. The other $194,200 has never been identified in circulation. It may have been destroyed, buried, spent abroad, or never left the aircraft.',
  },
  {
    n: '05',
    title: 'Why Tina Bar?',
    body: 'The bundles’ presence on the Columbia is explained by several competing mechanisms. None has been demonstrated.',
  },
  {
    n: '06',
    title: 'Was there a bomb?',
    body: 'A witness saw a case containing a battery, wires, and red cylinders. The device was never recovered. The threat was real enough to shape every decision made that night.',
  },
];

/* -------------------------------------------------------------------------- */
/* Narrative copy for the archive, epilogue, and prologue                    */
/* -------------------------------------------------------------------------- */

export const PROLOGUE = {
  opening:
    'On the afternoon before Thanksgiving, 1971, a man bought a one-way ticket to Seattle, carried a briefcase onto a Boeing 727, and asked a flight attendant to sit beside him.',
  second:
    'Five hours later, the aircraft landed in Reno with an empty cabin, two parachutes, and a ransom missing. The man had stepped out of the back of the plane somewhere over Washington. No one saw him go.',
  note: 'Sixteen movements · ≈ 28 minutes · sound optional · reconstructions labelled',
};

export const ARCHIVE_PROSE = {
  lede:
    'The FBI called the investigation NORJAK. The name is a compression of NORTHWEST hijacking. The file grew to more than sixty volumes and became one of the longest investigations in the bureau’s history.',
  paragraphs: [
    'By the fifth anniversary, the FBI had considered more than 800 suspects and eliminated all but about two dozen. Agents followed tips from psychics, prisoners, neighbours, and family members. They compared handwriting, fingerprints, and later DNA. They excavated, dredged, and searched. They never established a name. [SRC-11]',
    'The archive is not a solution. It is a record of attempts: teletypes, 302 interview reports, composite sketches, serial-number lists, lab reports, and photographs of objects that survived the aircraft. It is also a record of the culture the case produced — copycats, bounty hunters, confessions, and a tourist festival in a small Washington town.',
    'On 8 July 2016, the FBI redirected its resources. The case was not solved or formally closed in the way a prosecution is closed; it was suspended. The bureau said it would preserve the evidence and would accept new physical evidence related to the parachutes or the ransom money. [SRC-02]',
    'The record is open to the public in fragments. What it shows most clearly is how much investigative work can accumulate around a person who is never identified.',
  ],
};

export const EPILOGUE_PROSE = {
  lede:
    'The case did not end. It stopped being worked.',
  paragraphs: [
    'There is no grave, no confirmed photograph, no family that has been proven to be his. There is a name invented by a newspaper, a pair of sketches, a tie in a federal evidence room, and a small stack of decomposed twenties that surfaced on a riverbank nine years later.',
    'The mystery survives because the evidence is genuinely insufficient — not because the crime was elegant. A man threatened to blow up an aircraft filled with people, took money from a bank, and stepped into a freezing night. Whatever happened next, the record does not say.',
    'That is the honest ending: not a solution withheld, but a case file with a page missing. The rest is inference.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Sound                                                                     */
/* -------------------------------------------------------------------------- */

export const AUDIO_LABELS: Record<DbcAudioScene, string> = {
  prologue: 'Low air, distant engines',
  man: 'A room tone with no room',
  flight: 'Turbofan pulse',
  note: 'Paper, held breath',
  ground: 'Radio traffic and rain',
  'second-flight': 'Engine drone, shallow altitude',
  jump: 'Wind, then almost nothing',
  silence: 'Intentional silence',
  search: 'Wide, cold field',
  money: 'River and metal',
  evidence: 'Laboratory hum',
  archive: 'Fluorescent cold, paper',
  suspects: 'Unresolved interval',
  theories: 'Slow harmonic drift',
  landscape: 'Topographic wind',
  unknowns: 'Single sustained tone',
  epilogue: 'Unresolved chord',
  sources: 'Room tone',
};
