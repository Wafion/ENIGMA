export type DbcSourceCategory =
  | 'Primary federal record'
  | 'Official archive'
  | 'Contemporary journalism'
  | 'Aviation history'
  | 'Scholarly / forensic'
  | 'Specialist research'
  | 'Reference index';

export interface DbcSource {
  code: string;
  title: string;
  publisher: string;
  author?: string;
  date: string;
  url: string;
  category: DbcSourceCategory;
  obtained: string;
  caveat?: string;
}

/**
 * Every source listed here was checked during production. Where a source is
 * secondary, it is used for orientation or for reporting a claim that is
 * attributed in the text, not as proof of the claim itself.
 */
export const DBC_SOURCES: DbcSource[] = [
  {
    code: 'SRC-01',
    title: 'D.B. Cooper Hijacking',
    publisher: 'Federal Bureau of Investigation',
    date: '18 May 2016 (updated 12 July 2016)',
    url: 'https://www.fbi.gov/history/famous-cases/db-cooper-hijacking',
    category: 'Primary federal record',
    obtained:
      'Bureau summary of the hijacking, the note, the ransom, the parachutes, the 1980 money find, the McCoy elimination, and the bureau’s public position on Cooper’s likely fate.',
    caveat:
      'A public-facing summary, not the investigative file. It compresses disputed details and uses “D.B.” throughout.',
  },
  {
    code: 'SRC-02',
    title: 'Update on Investigation of 1971 Hijacking by D.B. Cooper',
    publisher: 'FBI Seattle Field Office',
    date: '12 July 2016',
    url: 'https://www.fbi.gov/contact-us/field-offices/seattle/news/press-releases/update-on-investigation-of-1971-hijacking-by-d.b.-cooper',
    category: 'Primary federal record',
    obtained:
      'The formal statement that the FBI redirected resources from the case on 8 July 2016 after a 45-year investigation, and that no tip had produced a definitive identification.',
  },
  {
    code: 'SRC-03',
    title: 'D.B. Cooper Redux',
    publisher: 'Federal Bureau of Investigation',
    date: '31 December 2007',
    url: 'https://www.fbi.gov/news/stories/2007/december/dbcooper_123107',
    category: 'Primary federal record',
    obtained:
      'Bureau statements on the absence of a ground accomplice, the cloud cover below 5,000 feet, the DNA sample from the tie (2001), and the elimination of Duane Weber, Kenneth Christiansen, and Richard McCoy.',
    caveat:
      'An advocacy-adjacent public affairs piece. It presents the bureau’s working view, not a finding of fact.',
  },
  {
    code: 'SRC-04',
    title: 'U.S. Attorney’s Case File, Western District of Washington, CR-0451',
    publisher: 'U.S. National Archives and Records Administration',
    date: '1971 (digitised; NAID 325594129)',
    url: 'https://catalog.archives.gov/id/325594129',
    category: 'Official archive',
    obtained:
      'The existence and scope of the federal case file, including the initial sketch and Air Force/FBI experiments into the jump.',
    caveat:
      'The digitised item is a selection from the file, not the complete investigative record.',
  },
  {
    code: 'SRC-05',
    title: 'Hijacker Collects Ransom of $200,000; Parachutes From Jet and Disappears',
    publisher: 'The New York Times',
    author: 'Earl Caldwell',
    date: '26 November 1971',
    url: 'https://www.nytimes.com/1971/11/26/archives/hijacker-collects-ransom-of-200000-parachutes-from-jet-and.html',
    category: 'Contemporary journalism',
    obtained:
      'First-day reporting on the route, the briefcase, the ransom, and the aircraft’s earlier stops. Used to establish what was publicly known in November 1971.',
    caveat:
      'Contemporary reporting contains details later corrected. It is evidence of the first account, not the final one.',
  },
  {
    code: 'SRC-06',
    title: 'D.B. Cooper',
    publisher: 'Encyclopaedia Britannica',
    date: '2016 (updated)',
    url: 'https://www.britannica.com/biography/D-B-Cooper',
    category: 'Reference index',
    obtained:
      'Orientation on the sequence, the altitude and speed instructions, the Ariel drop-zone estimate, and the Tina Bar distance.',
    caveat: 'A general reference work. Not used for any contested detail without corroboration.',
  },
  {
    code: 'SRC-07',
    title: '24 November 1971: Northwest Orient Airlines Flight 305',
    publisher: 'This Day in Aviation',
    author: 'Bryan R. Swopes',
    date: '2025 (updated)',
    url: 'https://www.thisdayinaviation.com/24-november-1971/',
    category: 'Aviation history',
    obtained:
      'Aircraft registration and type, crew names, departure and landing times, the 8:00 p.m. airstair warning, the 8:13 p.m. pitch change, and the Reno landing at 10:15 p.m.',
    caveat:
      'A meticulous aviation chronology that draws on secondary accounts. Times differ by minutes from other chronologies; those differences are shown in the documentary.',
  },
  {
    code: 'SRC-08',
    title: 'Skyjacking Northwest Flight #305 — D.B. Cooper’s Jump',
    publisher: 'Check-Six.com',
    date: 'n.d. (accessed 2026)',
    url: 'https://www.check-six.com/Crash_Sites/NWA305-DBCooper.htm',
    category: 'Specialist research',
    obtained:
      'Aircraft history, the parachute suppliers, the dummy reserve, the harness D-ring problem, and the F-106 escort detail.',
    caveat:
      'An enthusiast aviation archive. Its technical detail is useful; its conclusions are not treated as official findings.',
  },
  {
    code: 'SRC-09',
    title: '$5,800 of airplane hijacker D. B. Cooper’s ransom money is found near the Columbia River on February 10, 1980',
    publisher: 'HistoryLink',
    author: 'Casey McNerthney',
    date: '2020',
    url: 'https://www.historylink.org/File/23059',
    category: 'Official archive',
    obtained:
      'The date of the find, Brian Ingram’s age, the three packets (100 + 100 + 90 bills), the $5,800 total, the serial-number match, and the bank bag’s dimensions and weight.',
    caveat:
      'A state history encyclopedia entry. Its account agrees with the FBI summary on the total; some popular accounts round to $6,000 or $5,880.',
  },
  {
    code: 'SRC-10',
    title: 'Diatoms constrain forensic burial timelines: case study with DB Cooper money',
    publisher: 'Scientific Reports (Nature Portfolio)',
    date: '2020',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7400570/',
    category: 'Scholarly / forensic',
    obtained:
      'The diatom analysis indicating that the Tina Bar bundles entered the water in spring conditions, months after the November 1971 hijacking, and the limits of what that can establish.',
    caveat:
      'A forensic case study with a small sample. It constrains a timeline; it does not identify who handled the money.',
  },
  {
    code: 'SRC-11',
    title: 'FBI working new lead in D.B. Cooper hijacking case',
    publisher: 'CNN',
    date: '1 August 2011',
    url: 'https://www.cnn.com/2011/CRIME/08/01/fbi.db.cooper/index.html',
    category: 'Contemporary journalism',
    obtained:
      'The bureau’s statement that it had considered more than 800 suspects by the five-year anniversary and eliminated all but about two dozen; the DNA and description problems with Weber and Christiansen.',
    caveat: 'Reporting based on FBI statements; the underlying files were not public in 2011.',
  },
  {
    code: 'SRC-12',
    title: 'FBI no longer investigating D.B. Cooper skyjacking case',
    publisher: 'Associated Press / U.S. News & World Report',
    date: '12 July 2016',
    url: 'https://www.usnews.com/news/us/articles/2016-07-12/fbi-no-longer-investigating-db-cooper-skyjacking-case',
    category: 'Contemporary journalism',
    obtained:
      'Confirmation of the suspension, the preservation of evidence, the Rackstraw questioning in 1978, and the FBI’s 1979 statement that Rackstraw was no longer a suspect.',
    caveat: 'Wire reporting. Direct quotations are attributed to the bureau and to Rackstraw’s lawyer.',
  },
  {
    code: 'SRC-13',
    title: 'Richard Floyd McCoy, Jr.',
    publisher: 'Federal Bureau of Investigation',
    date: '2016',
    url: 'https://www.fbi.gov/history/cases-and-criminals/richard-floyd-mccoy-jr',
    category: 'Primary federal record',
    obtained:
      'McCoy’s April 1972 copycat hijacking, his arrest, the handwriting comparison, and the fact that the FBI did not treat him as Cooper.',
    caveat:
      'A bureau case page. It establishes McCoy’s own crime, not a link to Flight 305.',
  },
  {
    code: 'SRC-14',
    title: 'Wikimedia Commons file records for the FBI sketches, wanted poster, aircraft, and crew photograph',
    publisher: 'Wikimedia Commons',
    date: 'various',
    url: 'https://commons.wikimedia.org/wiki/Category:D._B._Cooper',
    category: 'Official archive',
    obtained:
      'Asset provenance, creator attribution, dates, and licence status for every downloaded image used in this documentary.',
    caveat:
      'Licence status was read from each file page at download time. Two images are U.S. Government works; one is GFDL 1.2; one is CC BY 3.0.',
  },
  {
    code: 'SRC-15',
    title: 'D. B. Cooper (encyclopedia entry)',
    publisher: 'Wikipedia',
    date: 'accessed November 2026',
    url: 'https://en.wikipedia.org/wiki/D._B._Cooper',
    category: 'Reference index',
    obtained:
      'A finding aid for dates, names, and the shape of the published literature. Every substantive claim used from it was checked against the FBI, the National Archives, or the cited reporting.',
    caveat:
      'Not treated as a primary source. The article itself flags disagreements among its sources; those disagreements are preserved in the documentary.',
  },
  {
    code: 'SRC-16',
    title: 'Amateur detectives fish for D.B. Cooper clues',
    publisher: 'The Oregonian / OregonLive',
    date: '5 March 2009',
    url: 'https://www.oregonlive.com/portland/2009/03/amateur_detectives_fish_for_db.html',
    category: 'Contemporary journalism',
    obtained:
      'The 1974 dredging operation off Tena Bar and the geological finding that the bills lay above the dredge material, placing their arrival after 1974.',
    caveat:
      'Feature reporting; the geologist’s underlying report is cited secondhand. The dredging is documented, but it does not by itself explain how the money arrived.',
  },
];

export const DBC_SOURCE_MAP: Record<string, DbcSource> = Object.fromEntries(
  DBC_SOURCES.map((source) => [source.code, source]),
);
