import { CaseAsciiOpener } from '../../../experience/components/CaseAsciiOpener';

const CASE_002_OPENING_THEME = {
  imageSrc: '/assets/db-cooper/images/northwest-727-n467us-1972.jpg',
  telemetry: [
    'CASE // 002',
    'FLIGHT 305 // NORTHWEST ORIENT',
    'PORTLAND → SEATTLE',
    '24_NOV_1971 // 20:13 PST',
    'NORJAK // 60 VOLUMES',
    'RECORD_INCOMPLETE',
    'STATUS: SUSPENDED',
  ],
  denseRgb: '237, 230, 214',
  midRgb: '168, 181, 173',
  lightRgb: '113, 135, 142',
  inkRgb: '237, 230, 214',
  groundRgb: '9, 12, 15',
  fontFamily: '"IBM Plex Mono", "Geist Mono Variable", monospace',
  historyFromMelt: false,
};

/**
 * Case 002 opening — the same ASCII reconstruction gesture as Case 001,
 * retargeted to the Flight 305 airframe and NORJAK record.
 *
 * Glyph streams rise into vertical layers, then a decode sweep wipes the
 * characters back to the aircraft photograph as the case record resolves.
 */
export function Case002Opener() {
  return <CaseAsciiOpener theme={CASE_002_OPENING_THEME} />;
}
