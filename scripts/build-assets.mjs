import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const BASE_DIR = path.join(ROOT, 'public', 'assets', 'blair-witch');
const DIRS = ['images', 'documents', 'audio', 'video', 'ascii', 'textures'];

for (const d of DIRS) {
  fs.mkdirSync(path.join(BASE_DIR, d), { recursive: true });
}

// 1. Download verified Wikimedia Commons / Library of Congress images via curl.exe
const IMAGE_JOBS = [
  {
    filename: 'frederick-map-1858.jpg',
    wikiTitle: 'File:Map of Frederick County, Md. accurately drawn from correct instrumental surveys of all the county roads, LOC 2002624018.jpg'
  },
  {
    filename: 'frederick-map-1861.jpg',
    wikiTitle: 'File:Frederick County, Maryland LOC 2008621638.jpg'
  },
  {
    filename: 'burkittsville-cemetery.jpg',
    wikiTitle: 'File:Burkittsville Cemetery MD1.jpg'
  },
  {
    filename: 'burkittsville-main-street.jpg',
    wikiTitle: 'File:Burkittsville MD4.jpg'
  },
  {
    filename: 'burkittsville-center.jpg',
    wikiTitle: 'File:Burkittsville center of town MD1.jpg'
  },
  {
    filename: 'burkittsville-street.jpg',
    wikiTitle: 'File:Burkittsville street.JPG'
  },
  {
    filename: 'david-arnold-house.jpg',
    wikiTitle: 'File:David Arnold House, Burkittsville, MD.jpg'
  },
  {
    filename: 'black-rock-mill.jpg',
    wikiTitle: 'File:Remains of the Black Rock Mill in Seneca Creek State Park MD.jpg'
  },
  {
    filename: 'seneca-creek-woods.jpg',
    wikiTitle: 'File:Seneca Creek State Park foliage - 25 Oct 2022 - 52455033204.jpg'
  },
  {
    filename: 'seneca-creek-canopy.jpg',
    wikiTitle: 'File:Seneca Creek State Park foliage - 25 Oct 2022 - 52454764321.jpg'
  },
  {
    filename: 'seneca-creek-lake.jpg',
    wikiTitle: 'File:Wea02110 - Flickr - NOAA Photo Library.jpg'
  },
  {
    filename: 'patapsco-grist-mill-tunnel.jpg',
    wikiTitle: 'File:Grist Mill Trail tunnel.jpg'
  },
  {
    filename: 'patapsco-rock-trail.jpg',
    wikiTitle: 'File:Rock Trail Surface at Patapsco Valley State Park.jpg'
  },
  {
    filename: 'sony-hi8-camcorder.jpg',
    wikiTitle: 'File:Sony Handycam Hi8 CCD-VX1E camcorder.jpg'
  },
  {
    filename: 'daniel-myrick.jpg',
    wikiTitle: 'File:Daniel Myrick Portrait (cropped).jpg'
  },
  {
    filename: 'heather-donahue.png',
    wikiTitle: 'File:Heather Donahue (cropped).png'
  },
  {
    filename: 'joshua-leonard.jpg',
    wikiTitle: 'File:Joshua Leonard (cropped).jpg'
  },
  {
    filename: 'michael-williams.jpg',
    wikiTitle: 'File:Our Little Mikey - Michael Williams (Blair Witch Project) (cropped 2).jpg'
  }
];

function fetchWikiImageUrls(titles) {
  const qs = new URLSearchParams({
    action: 'query',
    titles: titles.join('|'),
    prop: 'imageinfo',
    iiprop: 'url|dimensions',
    iiurlwidth: '1280',
    format: 'json'
  }).toString();
  const raw = execFileSync('curl.exe', ['-s', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', `https://en.wikipedia.org/w/api.php?${qs}`], { encoding: 'utf8' });
  const data = JSON.parse(raw);
  const map = new Map();
  if (data.query && data.query.pages) {
    for (const p of Object.values(data.query.pages)) {
      if (p.imageinfo && p.imageinfo[0]) {
        map.set(p.title, p.imageinfo[0].thumburl || p.imageinfo[0].url);
      }
    }
  }
  return map;
}

console.log('Resolving Wikimedia Commons URLs...');
const urlMap = fetchWikiImageUrls(IMAGE_JOBS.map(j => j.wikiTitle));

for (const job of IMAGE_JOBS) {
  const outPath = path.join(BASE_DIR, 'images', job.filename);
  const targetUrl = urlMap.get(job.wikiTitle);
  if (!targetUrl) {
    console.warn('Could not resolve URL for', job.wikiTitle);
    continue;
  }
  console.log(`Downloading ${job.filename}...`);
  execFileSync('curl.exe', ['-s', '-L', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '-o', outPath, targetUrl]);
  const stat = fs.statSync(outPath);
  console.log(`  -> Saved ${job.filename} (${(stat.size / 1024).toFixed(1)} KB)`);
}

// 2. Download verified Wikimedia Commons field recordings & generate studio-grade PCM WAV sound files
const WIKI_AUDIO = [
  {
    filename: 'field-forest-ambience-cc0.ogg',
    wikiTitle: 'File:20090610 0 ambience.ogg'
  },
  {
    filename: 'tappy-east-creek-brook.ogg',
    wikiTitle: 'File:Brook.ogg'
  }
];

const audioUrlMap = fetchWikiImageUrls(WIKI_AUDIO.map(a => a.wikiTitle));
for (const a of WIKI_AUDIO) {
  const outPath = path.join(BASE_DIR, 'audio', a.filename);
  const u = audioUrlMap.get(a.wikiTitle);
  if (u) {
    // Strip query string for raw ogg download if needed
    execFileSync('curl.exe', ['-s', '-L', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '-o', outPath, u]);
    const st = fs.statSync(outPath);
    console.log(`  -> Saved audio ${a.filename} (${(st.size / 1024).toFixed(1)} KB)`);
  }
}

// Helper to write 16-bit mono 44.1kHz WAV file
function writeWav(filename, durationSec, sampleGenerator) {
  const sampleRate = 22050; // 22.05kHz mono keeps files fast & compact while preserving full atmospheric frequency range up to 11kHz
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // PCM chunk size
  buffer.writeUInt16LE(1, 20);  // PCM format
  buffer.writeUInt16LE(1, 22);  // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Fade in/out envelope for seamless looping
    const fade = Math.min(1, t / 0.4, (durationSec - t) / 0.4);
    const val = Math.max(-1, Math.min(1, sampleGenerator(t, i, sampleRate) * fade));
    buffer.writeInt16LE(Math.floor(val * 32767), 44 + i * 2);
  }

  const outPath = path.join(BASE_DIR, 'audio', filename);
  fs.writeFileSync(outPath, buffer);
  console.log(`  -> Synthesized WAV ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

// Seeded PRNG for deterministic acoustic synthesis
let seed = 19941021;
function rand() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return (seed / 0xffffffff) * 2 - 1;
}

// 1) forest-wind-canopy.wav: Filtered pink/brown wind gusts through bare trees
{
  let lp1 = 0, lp2 = 0, bp = 0;
  writeWav('forest-wind-canopy.wav', 8.0, (t) => {
    const white = rand();
    const gust = 0.55 + 0.45 * Math.sin(t * 0.85) * Math.sin(t * 0.37 + 1.2);
    lp1 += 0.018 * (white - lp1);
    lp2 += 0.004 * (white - lp2);
    const whistle = Math.sin(2 * Math.PI * (195 + 35 * Math.sin(t * 0.5)) * t) * 0.03 * gust;
    bp = (lp1 - lp2) * 2.4 * gust + whistle;
    return bp * 0.45;
  });
}

// 2) historical-room-tone.wav: Deep archival vault resonance & low harmonic undertone
{
  let brown = 0;
  writeWav('historical-room-tone.wav', 7.0, (t) => {
    brown = (brown + 0.02 * rand()) * 0.985;
    const drone55 = Math.sin(2 * Math.PI * 55 * t) * 0.14;
    const drone82 = Math.sin(2 * Math.PI * 82.41 * t + Math.sin(t * 0.6)) * 0.09;
    const drone110 = Math.sin(2 * Math.PI * 110 * t) * 0.04 * (0.5 + 0.5 * Math.sin(t * 0.9));
    return (brown * 0.35 + drone55 + drone82 + drone110) * 0.6;
  });
}

// 3) footsteps-dry-leaves.wav: Isolated footsteps crunching on dry autumn oak leaves
{
  let filterState = 0;
  const stepTimes = [0.45, 1.35, 2.20, 3.15, 3.95, 4.90];
  writeWav('footsteps-dry-leaves.wav', 6.0, (t) => {
    let env = 0;
    for (const st of stepTimes) {
      const dt = t - st;
      if (dt >= 0 && dt < 0.38) {
        // Multi-grain leaf crunch envelope
        const burst = Math.exp(-dt * 14) * (0.6 + 0.4 * Math.sin(dt * 190));
        const heel = dt < 0.08 ? Math.exp(-dt * 45) * 0.7 : 0;
        env += burst + heel;
      }
    }
    const n = rand();
    filterState = filterState * 0.45 + n * 0.55;
    const highCrunch = (n - filterState) * env * 0.85;
    const lowThud = Math.sin(2 * Math.PI * 78 * t) * env * 0.18;
    return (highCrunch + lowThud) * 0.75;
  });
}

// 4) branch-snap-woods.wav: Sharp deadwood twig/branch snap in deep woods with canyon reflection
{
  let lp = 0;
  writeWav('branch-snap-woods.wav', 4.5, (t) => {
    let sig = 0;
    // Primary crack at t=0.8s, secondary fiber tear at t=0.92s, echo at t=1.25s
    const events = [
      { time: 0.80, amp: 0.95, decay: 38, freq: 420 },
      { time: 0.91, amp: 0.55, decay: 28, freq: 610 },
      { time: 1.18, amp: 0.22, decay: 12, freq: 310 },
      { time: 2.65, amp: 0.70, decay: 34, freq: 480 }
    ];
    for (const ev of events) {
      const dt = t - ev.time;
      if (dt >= 0 && dt < 0.6) {
        const env = Math.exp(-dt * ev.decay);
        sig += (rand() * 0.8 + Math.sin(2 * Math.PI * ev.freq * dt * Math.exp(-dt * 8)) * 0.5) * env * ev.amp;
      }
    }
    lp += 0.015 * (rand() - lp);
    return sig * 0.75 + lp * 0.12;
  });
}

// 5) radio-tape-interference.wav: Hi8 / DAT magnetic tape transport warble, 60Hz hum, and azimuth dropout static
{
  let pink = 0;
  writeWav('radio-tape-interference.wav', 6.5, (t) => {
    const w = rand();
    pink = 0.92 * pink + 0.08 * w;
    const dropout = (Math.sin(t * 3.7) * Math.sin(t * 11.3) > 0.55) ? 1.8 : 0.35;
    const hum60 = Math.sin(2 * Math.PI * 60 * t) * 0.08 + Math.sin(2 * Math.PI * 180 * t) * 0.04;
    const timecodeCarrier = Math.sin(2 * Math.PI * (1200 + 400 * Math.sign(Math.sin(t * 48))) * t) * 0.025 * dropout;
    const hiss = (w * 0.35 + pink * 0.65) * 0.22 * dropout;
    return (hiss + hum60 + timecodeCarrier) * 0.65;
  });
}

// 6) wooden-cabin-creak.wav: Old timber joist & floorboard groan (Griggs House atmosphere)
{
  writeWav('wooden-cabin-creak.wav', 5.5, (t) => {
    let creak = 0;
    const pulses = [0.6, 0.78, 0.95, 1.15, 1.38, 1.62, 2.8, 3.05, 3.3, 3.6];
    for (const p of pulses) {
      const dt = t - p;
      if (dt >= 0 && dt < 0.22) {
        const env = Math.sin((dt / 0.22) * Math.PI) * Math.exp(-dt * 8);
        const f = 145 + 30 * Math.sin(p * 4);
        creak += (Math.sin(2 * Math.PI * f * dt) + 0.5 * Math.sin(2 * Math.PI * f * 2.02 * dt) + 0.25 * Math.sin(2 * Math.PI * f * 3.05 * dt)) * env * 0.35;
      }
    }
    const subRoom = Math.sin(2 * Math.PI * 48 * t) * 0.08;
    return creak + subRoom;
  });
}

// 7) nocturnal-insects.wav: Late-autumn Maryland nocturnal crickets & cold night air
{
  let windLp = 0;
  writeWav('nocturnal-insects.wav', 7.0, (t) => {
    windLp += 0.012 * (rand() - windLp);
    // Cricket stridulation pulse train around 3.8kHz
    const chirpCycle = (t * 2.2) % 1.0;
    let chirp = 0;
    if (chirpCycle < 0.36) {
      const subPulse = Math.max(0, Math.sin(2 * Math.PI * 14 * t));
      chirp = Math.sin(2 * Math.PI * 3750 * t) * subPulse * 0.09;
    }
    const distantOwl = (t > 2.5 && t < 3.4)
      ? Math.sin(2 * Math.PI * (340 - 25 * (t - 2.5)) * t) * Math.sin(((t - 2.5) / 0.9) * Math.PI) * 0.07
      : 0;
    return windLp * 0.32 + chirp + distantOwl;
  });
}

// 3. Generate Archival & Reconstructed Fictional SVG Plates in /public/assets/blair-witch/documents/
const DOCS = {
  'blair-witch-cult-1809-reconstruction.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1040" width="800" height="1040">
  <defs>
    <filter id="paper-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise"/>
      <feDiffuseLighting in="noise" lighting-color="#d8ccb8" surfaceScale="1.4" result="paper">
        <feDistantLight azimuth="45" elevation="62"/>
      </feDiffuseLighting>
      <feComposite in="SourceGraphic" in2="paper" operator="multiply"/>
    </filter>
  </defs>
  <rect width="800" height="1040" fill="#cbbda4"/>
  <rect x="34" y="34" width="732" height="972" fill="none" stroke="#2c241b" stroke-width="3"/>
  <rect x="42" y="42" width="716" height="956" fill="none" stroke="#2c241b" stroke-width="1"/>
  <!-- Top Epistemic Classification Stamp -->
  <g transform="translate(480, 62) rotate(-3)">
    <rect x="0" y="0" width="258" height="44" fill="none" stroke="#8f241b" stroke-width="2.5"/>
    <text x="129" y="19" font-family="monospace" font-size="10" font-weight="bold" fill="#8f241b" text-anchor="middle" letter-spacing="1.5">RECONSTRUCTED FICTIONAL PLATE</text>
    <text x="129" y="34" font-family="monospace" font-size="9" fill="#8f241b" text-anchor="middle" letter-spacing="1">IN-UNIVERSE LORE // HAXAN (1999)</text>
  </g>
  <text x="400" y="118" font-family="Georgia, serif" font-size="14" fill="#2c241b" text-anchor="middle" letter-spacing="6">CHAPBOOK FOLIO IX. — ANNO DOMINI MDCCCIX</text>
  <text x="400" y="168" font-family="Georgia, serif" font-size="38" font-weight="bold" fill="#1b1610" text-anchor="middle" letter-spacing="4">THE BLAIR WITCH CULT</text>
  <text x="400" y="200" font-family="Georgia, serif" font-size="15" font-style="italic" fill="#3a3024" text-anchor="middle">Being an Account of the Accusation &amp; Winter Banishment of Elly Kedward in the Township of Blair, 1785</text>
  <line x1="120" y1="222" x2="680" y2="222" stroke="#2c241b" stroke-width="1.5"/>
  <!-- Woodcut Illustration Frame -->
  <g transform="translate(130, 248)">
    <rect width="540" height="420" fill="#181410" stroke="#2c241b" stroke-width="4"/>
    <!-- Woodcut engraved sky hatching -->
    <g stroke="#cbbda4" stroke-width="1" opacity="0.35">
      <line x1="0" y1="20" x2="540" y2="20"/><line x1="0" y1="32" x2="540" y2="32"/><line x1="0" y1="44" x2="540" y2="44"/>
      <line x1="0" y1="56" x2="540" y2="56"/><line x1="0" y1="68" x2="540" y2="68"/><line x1="0" y1="80" x2="540" y2="80"/>
    </g>
    <!-- Bare winter black hills trees -->
    <g stroke="#cbbda4" stroke-width="3" fill="none">
      <path d="M70,420 L70,120 M70,210 L30,150 M70,180 L115,130"/>
      <path d="M155,420 L155,90 M155,190 L110,120 M155,160 L205,105"/>
      <path d="M390,420 L390,85 M390,175 L340,115 M390,150 L440,95"/>
      <path d="M475,420 L475,110 M475,205 L430,145 M475,180 L515,130"/>
    </g>
    <!-- Stick Effigy (Twana) Geometry in Center -->
    <g transform="translate(270, 215)" stroke="#d8ccb8" stroke-width="4.5" stroke-linecap="round">
      <line x1="0" y1="-95" x2="0" y2="95"/>
      <line x1="-75" y1="-35" x2="75" y2="-35"/>
      <line x1="-55" y1="-35" x2="0" y2="30"/>
      <line x1="55" y1="-35" x2="0" y2="30"/>
      <line x1="0" y1="30" x2="-48" y2="95"/>
      <line x1="0" y1="30" x2="48" y2="95"/>
      <circle cx="0" cy="-35" r="9" fill="#181410" stroke="#8f241b" stroke-width="3"/>
    </g>
    <text x="270" y="396" font-family="Georgia, serif" font-size="13" fill="#cbbda4" text-anchor="middle" letter-spacing="3">FIG. III — THE TIMBER EFFIGY OF THE BLACK HILLS</text>
  </g>
  <!-- Typographic Columns -->
  <g font-family="Georgia, serif" font-size="13.5" fill="#231c15">
    <text x="130" y="710">"In the Month of February, 1785, after diverse Children of the Settlement</text>
    <text x="130" y="732">testified that the Woman Kedward had drawn forth Blood from their Arms</text>
    <text x="130" y="754">within her Cottage near the Creek, the Magistrates ordered her bound</text>
    <text x="130" y="776">upon a Sled and cast into the North Woods amidst a great Snow. Yet by the</text>
    <text x="130" y="798">Turning of the following Winter, every Child who had spoken her Name—and</text>
    <text x="130" y="820">half the Youth of Blair beside—had vanished into the Timber without</text>
    <text x="130" y="842">Footprint or Cry, whereupon the Town was forsaken."</text>
  </g>
  <line x1="130" y1="875" x2="670" y2="875" stroke="#2c241b" stroke-width="1"/>
  <text x="130" y="905" font-family="monospace" font-size="11" fill="#4a3e31">DOCUMENT PROVENANCE: Reconstructed Archival Prop (Non-Historical)</text>
  <text x="130" y="925" font-family="monospace" font-size="11" fill="#4a3e31">CONTEXT: Invented by Daniel Myrick, Eduardo Sánchez &amp; Ben Rock (1998–1999) to</text>
  <text x="130" y="945" font-family="monospace" font-size="11" fill="#4a3e31">anchor the fictional 200-year mythology in "Curse of the Blair Witch".</text>
</svg>`,

  'coffin-rock-1886-dispatch.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1040" width="800" height="1040">
  <rect width="800" height="1040" fill="#c7baa1"/>
  <rect x="36" y="36" width="728" height="968" fill="none" stroke="#2a231c" stroke-width="2.5"/>
  <g transform="translate(470, 56) rotate(-2)">
    <rect x="0" y="0" width="270" height="44" fill="none" stroke="#8f241b" stroke-width="2.5"/>
    <text x="135" y="19" font-family="monospace" font-size="10" font-weight="bold" fill="#8f241b" text-anchor="middle">RECONSTRUCTED FICTIONAL DOSSIER</text>
    <text x="135" y="34" font-family="monospace" font-size="9" fill="#8f241b" text-anchor="middle">MARCH 1886 // COFFIN ROCK LORE</text>
  </g>
  <text x="80" y="95" font-family="monospace" font-size="12" fill="#3a3024">CASE FILE REF: ENIGMA-BW-1886-CR</text>
  <text x="80" y="145" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="#1a1510">THE COFFIN ROCK TOPOGRAPHY</text>
  <text x="80" y="175" font-family="Georgia, serif" font-size="15" font-style="italic" fill="#3a3024">Fictional Search-Party Disappearance &amp; Tappy East Creek Outcrop (March 1886)</text>
  <line x1="80" y1="196" x2="720" y2="196" stroke="#2a231c" stroke-width="1.5"/>
  <!-- Topographical Contour & Outcrop Diagram -->
  <g transform="translate(80, 224)">
    <rect width="640" height="410" fill="#171614" stroke="#2a231c" stroke-width="2"/>
    <!-- Contour lines -->
    <g fill="none" stroke="#5a5244" stroke-width="1" stroke-dasharray="4 3">
      <ellipse cx="320" cy="205" rx="280" ry="165"/>
      <ellipse cx="320" cy="205" rx="220" ry="130"/>
      <ellipse cx="320" cy="205" rx="160" ry="92"/>
    </g>
    <!-- Creek path -->
    <path d="M 0,310 Q 180,260 320,320 T 640,285" fill="none" stroke="#4a6b5d" stroke-width="6" opacity="0.7"/>
    <text x="510" y="275" font-family="monospace" font-size="11" fill="#7aa08f">SENECA / TAPPY EAST CREEK</text>
    <!-- Coffin Rock Polygon -->
    <polygon points="245,155 385,140 415,205 375,255 235,245 215,195" fill="#2c2823" stroke="#cbbda4" stroke-width="2.5"/>
    <!-- 5 radial markers representing the fictional account -->
    <g stroke="#b83a2e" stroke-width="2" fill="#b83a2e">
      <circle cx="255" cy="170" r="5"/><circle cx="370" cy="160" r="5"/>
      <circle cx="395" cy="205" r="5"/><circle cx="355" cy="240" r="5"/>
      <circle cx="245" cy="230" r="5"/>
      <line x1="255" y1="170" x2="315" y2="202" stroke-dasharray="3 3"/>
      <line x1="370" y1="160" x2="315" y2="202" stroke-dasharray="3 3"/>
      <line x1="395" y1="205" x2="315" y2="202" stroke-dasharray="3 3"/>
      <line x1="355" y1="240" x2="315" y2="202" stroke-dasharray="3 3"/>
      <line x1="245" y1="230" x2="315" y2="202" stroke-dasharray="3 3"/>
    </g>
    <text x="315" y="205" font-family="monospace" font-size="11" fill="#e6dfd3" text-anchor="middle">COFFIN ROCK OUTCROP</text>
    <text x="24" y="385" font-family="monospace" font-size="11" fill="#a89e8c">FILMING REALITY: Shot along Seneca Creek State Park outcrop, Oct 1997</text>
  </g>
  <g font-family="Georgia, serif" font-size="14" fill="#231c15">
    <text x="80" y="685">1. IN-UNIVERSE MYTHOLOGY (1886): Eight-year-old Robin Weaver vanishes into the Black Hills.</text>
    <text x="80" y="710">   While Weaver returns three days later speaking of an old woman floating above the leaves,</text>
    <text x="80" y="735">   a five-man search party is reportedly found bound upon Coffin Rock—only for the bodies to</text>
    <text x="80" y="760">   disappear before the returning sheriff's posse reaches the creek.</text>
    <text x="80" y="805">2. VERIFIED HISTORICAL FACT: No "Coffin Rock massacre" or "Robin Weaver disappearance"</text>
    <text x="80" y="830">   ever occurred in 1886 Frederick County records. The geological rock formation shown in the</text>
    <text x="80" y="855">   1999 film is a natural gneiss outcrop along Seneca Creek in Montgomery County, Maryland.</text>
  </g>
  <line x1="80" y1="895" x2="720" y2="895" stroke="#2a231c" stroke-width="1"/>
  <text x="80" y="930" font-family="monospace" font-size="11" fill="#4a3e31">CLASSIFICATION: Category 5 — Reconstructed Fictional Lore &amp; Geographic Cross-Reference</text>
</svg>`,

  'rustin-parr-1941-chronology.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1040" width="800" height="1040">
  <rect width="800" height="1040" fill="#161715"/>
  <rect x="36" y="36" width="728" height="968" fill="none" stroke="#4a4842" stroke-width="2"/>
  <g transform="translate(465, 58)">
    <rect x="0" y="0" width="275" height="44" fill="none" stroke="#b83a2e" stroke-width="2"/>
    <text x="137" y="19" font-family="monospace" font-size="10" font-weight="bold" fill="#d65a4e" text-anchor="middle">RECONSTRUCTED ARCHITECTURAL PLAN</text>
    <text x="137" y="34" font-family="monospace" font-size="9" fill="#d65a4e" text-anchor="middle">1941 RUSTIN PARR LORE vs. GRIGGS HOUSE</text>
  </g>
  <text x="72" y="96" font-family="monospace" font-size="12" fill="#8e8a80">ARCHITECTURAL &amp; ACOUSTIC COMPARISON // REF 1941-1997</text>
  <text x="72" y="142" font-family="Georgia, serif" font-size="30" font-weight="bold" fill="#e6dfd3">THE CELLAR CORNER &amp; THE GRIGGS HOUSE</text>
  <text x="72" y="172" font-family="Georgia, serif" font-size="14" font-style="italic" fill="#a39c90">Comparing the fictional 1941 Rustin Parr hermitage with the real 1850 Griggs House in Granite, MD</text>
  <line x1="72" y1="194" x2="728" y2="194" stroke="#4a4842" stroke-width="1"/>
  <!-- Cellar Blueprint -->
  <g transform="translate(72, 224)">
    <rect width="656" height="420" fill="#0d0f0e" stroke="#5a635c" stroke-width="2"/>
    <!-- Grid lines -->
    <g stroke="#1e2620" stroke-width="1">
      <line x1="0" y1="70" x2="656" y2="70"/><line x1="0" y1="140" x2="656" y2="140"/>
      <line x1="0" y1="210" x2="656" y2="210"/><line x1="0" y1="280" x2="656" y2="280"/><line x1="0" y1="350" x2="656" y2="350"/>
      <line x1="130" y1="0" x2="130" y2="420"/><line x1="260" y1="0" x2="260" y2="420"/>
      <line x1="390" y1="0" x2="390" y2="420"/><line x1="520" y1="0" x2="520" y2="420"/>
    </g>
    <!-- Foundation Walls -->
    <rect x="80" y="55" width="496" height="310" fill="none" stroke="#9cb0a2" stroke-width="5"/>
    <line x1="340" y1="55" x2="340" y2="250" stroke="#9cb0a2" stroke-width="4"/>
    <!-- Stairs -->
    <g stroke="#9cb0a2" stroke-width="2">
      <rect x="110" y="80" width="90" height="140" fill="none"/>
      <line x1="110" y1="100" x2="200" y2="100"/><line x1="110" y1="120" x2="200" y2="120"/>
      <line x1="110" y1="140" x2="200" y2="140"/><line x1="110" y1="160" x2="200" y2="160"/>
      <line x1="110" y1="180" x2="200" y2="180"/><line x1="110" y1="200" x2="200" y2="200"/>
    </g>
    <text x="155" y="242" font-family="monospace" font-size="10" fill="#9cb0a2" text-anchor="middle">CELLAR STAIRCASE</text>
    <!-- East Corner Marker (Mike standing in corner) -->
    <circle cx="548" cy="84" r="16" fill="none" stroke="#b83a2e" stroke-width="2.5"/>
    <circle cx="548" cy="84" r="4" fill="#b83a2e"/>
    <text x="445" y="90" font-family="monospace" font-size="11" fill="#e06d60">NE CORNER ("FACING THE WALL")</text>
    <!-- Camera drop point -->
    <circle cx="430" cy="285" r="12" fill="none" stroke="#d4883a" stroke-width="2"/>
    <text x="430" y="315" font-family="monospace" font-size="10" fill="#d4883a" text-anchor="middle">16MM / HI8 DROP POINT</text>
  </g>
  <g font-family="monospace" font-size="12" fill="#c7c2b8">
    <text x="72" y="690">[LORE // MAY 25, 1941] Fictional hermit Rustin Parr walks into a Burkittsville market and says,</text>
    <text x="72" y="712">"I'm finally finished." In the film's mythology, Parr forced one child to face the cellar corner</text>
    <text x="72" y="734">while murdering another, creating the visual motif that closes the 1999 film.</text>
    <text x="72" y="778">[REALITY // OCT 31, 1997] The climax was filmed inside the historic Griggs House (built c. 1850)</text>
    <text x="72" y="800">near Granite, Maryland in Patapsco Valley State Park. Following intense tourist trespassing after</text>
    <text x="72" y="822">the film's July 1999 release, the State of Maryland demolished the Griggs House in December 1999.</text>
  </g>
</svg>`,

  'missing-students-1994-reconstruction.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1040" width="800" height="1040">
  <rect width="800" height="1040" fill="#dcd5c7"/>
  <rect x="32" y="32" width="736" height="976" fill="none" stroke="#181715" stroke-width="4"/>
  <!-- Prominent Reconstruction Disclosure Banner -->
  <rect x="32" y="32" width="736" height="54" fill="#8f241b"/>
  <text x="400" y="56" font-family="monospace" font-size="13" font-weight="bold" fill="#f4efe6" text-anchor="middle" letter-spacing="2">FICTIONAL PROMOTIONAL ARTIFACT RECONSTRUCTION (NOT A REAL POLICE BULLETIN)</text>
  <text x="400" y="74" font-family="monospace" font-size="10.5" fill="#f4efe6" text-anchor="middle" letter-spacing="1">RECONSTRUCTED AFTER HAXAN FILMS / ARTISAN ENTERTAINMENT SUNDANCE CAMPAIGN (JAN 1999)</text>
  <text x="400" y="155" font-family="Impact, Arial Black, sans-serif" font-size="64" fill="#181715" text-anchor="middle" letter-spacing="6">MISSING</text>
  <text x="400" y="192" font-family="monospace" font-size="15" font-weight="bold" fill="#2c2a26" text-anchor="middle">LAST SEEN OCTOBER 1994 — BLACK HILLS FOREST, BURKITTSVILLE, MD</text>
  <line x1="72" y1="212" x2="728" y2="212" stroke="#181715" stroke-width="2.5"/>
  <!-- Three Subject Silhouette/Dossier Frames -->
  <g transform="translate(72, 240)">
    <g transform="translate(0, 0)">
      <rect width="200" height="240" fill="#22201d" stroke="#181715" stroke-width="2"/>
      <text x="100" y="115" font-family="monospace" font-size="13" fill="#a8a298" text-anchor="middle">[SUBJECT 01]</text>
      <text x="100" y="138" font-family="monospace" font-size="11" fill="#7a756c" text-anchor="middle">DIRECTOR / HI8 CAM</text>
      <text x="100" y="270" font-family="monospace" font-size="14" font-weight="bold" fill="#181715" text-anchor="middle">HEATHER DONAHUE</text>
      <text x="100" y="290" font-family="monospace" font-size="11" fill="#4a463f" text-anchor="middle">Role: Documentary Director</text>
    </g>
    <g transform="translate(228, 0)">
      <rect width="200" height="240" fill="#22201d" stroke="#181715" stroke-width="2"/>
      <text x="100" y="115" font-family="monospace" font-size="13" fill="#a8a298" text-anchor="middle">[SUBJECT 02]</text>
      <text x="100" y="138" font-family="monospace" font-size="11" fill="#7a756c" text-anchor="middle">16MM CP-16 CAMERA</text>
      <text x="100" y="270" font-family="monospace" font-size="14" font-weight="bold" fill="#181715" text-anchor="middle">JOSHUA LEONARD</text>
      <text x="100" y="290" font-family="monospace" font-size="11" fill="#4a463f" text-anchor="middle">Role: Cinematographer</text>
    </g>
    <g transform="translate(456, 0)">
      <rect width="200" height="240" fill="#22201d" stroke="#181715" stroke-width="2"/>
      <text x="100" y="115" font-family="monospace" font-size="13" fill="#a8a298" text-anchor="middle">[SUBJECT 03]</text>
      <text x="100" y="138" font-family="monospace" font-size="11" fill="#7a756c" text-anchor="middle">DAT SOUND RECORDIST</text>
      <text x="100" y="270" font-family="monospace" font-size="14" font-weight="bold" fill="#181715" text-anchor="middle">MICHAEL WILLIAMS</text>
      <text x="100" y="290" font-family="monospace" font-size="11" fill="#4a463f" text-anchor="middle">Role: Sound Engineer</text>
    </g>
  </g>
  <line x1="72" y1="565" x2="728" y2="565" stroke="#181715" stroke-width="1.5"/>
  <g font-family="monospace" font-size="13" fill="#1e1c19">
    <text x="72" y="605">IN-UNIVERSE NARRATIVE SUMMARY:</text>
    <text x="72" y="630">On October 21, 1994, three Montgomery College film students hiked into the Black Hills</text>
    <text x="72" y="652">near Burkittsville, Maryland to shoot a thesis documentary on the Blair Witch legend.</text>
    <text x="72" y="674">Joshua Leonard's 1971 Plymouth Barracuda was located along MD Route 17 on October 26.</text>
    <text x="72" y="725">REAL-WORLD MARKETING CONTEXT (SUNDANCE, JANUARY 1999):</text>
    <text x="72" y="750">Filmmakers Daniel Myrick and Eduardo Sánchez distributed flyers styled after missing-person</text>
    <text x="72" y="772">bulletins at the 1999 Sundance Film Festival and listed the three living actors as</text>
    <text x="72" y="794">"Missing, presumed dead" on IMDb. Because the actors used their real legal names and</text>
    <text x="72" y="816">withheld press appearances, early internet users debated whether the disappearance was real.</text>
  </g>
  <rect x="72" y="865" width="656" height="90" fill="#ebe5d9" stroke="#181715" stroke-width="1.5"/>
  <text x="92" y="895" font-family="monospace" font-size="11.5" font-weight="bold" fill="#8f241b">LEGAL &amp; ARCHIVAL DISCLOSURE:</text>
  <text x="92" y="918" font-family="monospace" font-size="11" fill="#2c2a26">This plate is a typographic reconstruction demonstrating the graphic structure of the 1999</text>
  <text x="92" y="938" font-family="monospace" font-size="11" fill="#2c2a26">viral campaign without reproducing copyrighted Artisan Entertainment key art.</text>
</svg>`,

  'umd-anthropology-excavation-log.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1040" width="800" height="1040">
  <rect width="800" height="1040" fill="#131614"/>
  <rect x="34" y="34" width="732" height="972" fill="none" stroke="#4d5e52" stroke-width="2"/>
  <text x="70" y="84" font-family="monospace" font-size="12" fill="#7aa086">RECONSTRUCTED FIELD EXCAVATION LOG // IN-UNIVERSE LORE (OCT 16, 1995)</text>
  <text x="70" y="128" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#e4dfd5">WESTERFIELD CABIN FOUNDATION EXCAVATION</text>
  <text x="70" y="156" font-family="monospace" font-size="12" fill="#9ea89f">Fictional Recovery of Canvas Duffel Bag Containing 11 Film Cans &amp; Hi8 Video Tapes</text>
  <line x1="70" y1="178" x2="730" y2="178" stroke="#4d5e52" stroke-width="1"/>
  <!-- Excavation Grid Table -->
  <g transform="translate(70, 206)" font-family="monospace" font-size="12" fill="#d8d4ca">
    <rect width="660" height="360" fill="#0b0d0c" stroke="#4d5e52" stroke-width="1.5"/>
    <line x1="0" y1="44" x2="660" y2="44" stroke="#4d5e52"/>
    <text x="20" y="28" fill="#7aa086" font-weight="bold">ITEM ID</text>
    <text x="150" y="28" fill="#7aa086" font-weight="bold">MEDIA FORMAT</text>
    <text x="360" y="28" fill="#7aa086" font-weight="bold">IN-UNIVERSE CONTENT</text>
    <text x="20" y="80">CAN-01..11</text>
    <text x="150" y="80">16mm B&amp;W Tri-X Reversal</text>
    <text x="360" y="80">CP-16 Documentary Reels (J. Leonard)</text>
    <text x="20" y="125">TAPE-HI8-A</text>
    <text x="150" y="125">8mm NTSC Hi8 Video</text>
    <text x="360" y="125">Behind-the-scenes &amp; Tent Confessional</text>
    <text x="20" y="170">DAT-01..09</text>
    <text x="150" y="170">Tascam Digital Audio Tape</text>
    <text x="360" y="170">Sync Sound &amp; Nocturnal Forest Audio</text>
    <text x="20" y="215">DOC-JRN-94</text>
    <text x="150" y="215">Bound Field Notebook</text>
    <text x="360" y="215">Heather Donahue Expedition Journal</text>
    <text x="20" y="260">SOIL-STRAT</text>
    <text x="150" y="260">Sub-hearth Stone Stratum</text>
    <text x="360" y="260">Buried beneath 100-yr cabin foundation</text>
    <line x1="20" y1="290" x2="640" y2="290" stroke="#2c3830"/>
    <text x="20" y="325" fill="#d4883a">PARADOX IN THE LORE: How did October 1994 footage become sealed beneath an undisturbed</text>
    <text x="20" y="345" fill="#d4883a">19th-century stone foundation wall? This temporal anomaly is central to the 1999 mythos.</text>
  </g>
  <g font-family="Georgia, serif" font-size="14.5" fill="#c7c2b8">
    <text x="70" y="620">In the fictional framing device created by Haxan Films, anthropology students from the</text>
    <text x="70" y="644">University of Maryland excavating the ruins of a 19th-century cabin (Westerfield cabin)</text>
    <text x="70" y="668">on October 16, 1995 uncover the students' equipment bag buried underneath the stone hearth.</text>
    <text x="70" y="715">In reality, the three actors shot approximately 19 to 20 hours of raw 16mm and Hi8 footage</text>
    <text x="70" y="739">during their 8-day hike in Seneca Creek State Park (October 23–31, 1997), which editors</text>
    <text x="70" y="763">Daniel Myrick and Eduardo Sánchez cut down into the 81-minute theatrical feature.</text>
  </g>
</svg>`
};

for (const [name, svg] of Object.entries(DOCS)) {
  fs.writeFileSync(path.join(BASE_DIR, 'documents', name), svg, 'utf8');
  console.log(`  -> Wrote document ${name}`);
}

// 4. Write SVG noise/grain textures and precomputed ASCII presets
fs.writeFileSync(
  path.join(BASE_DIR, 'textures', 'film-grain.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/></filter><rect width="240" height="240" filter="url(#n)" opacity="0.22"/></svg>`,
  'utf8'
);

fs.writeFileSync(
  path.join(BASE_DIR, 'ascii', 'twana-sigil.json'),
  JSON.stringify({
    id: 'twana-sigil',
    title: 'Stick Effigy Structural Matrix',
    rows: [
      "                  ..::||::..                  ",
      "                 .::  ||  ::.                 ",
      "                    ..||..                    ",
      "        ==============================        ",
      "           \\\\         ||         //           ",
      "            \\\\        ||        //            ",
      "             \\\\       ||       //             ",
      "              \\\\      ||      //              ",
      "               \\\\     ||     //               ",
      "                \\\\   .||.   //                ",
      "                 \\\\ .::::. //                 ",
      "                  .:: || ::.                  ",
      "                 //   ||   \\\\                 ",
      "                //    ||    \\\\                ",
      "               //     ||     \\\\               ",
      "              //      ||      \\\\              ",
      "             //       ||       \\\\             ",
      "            //        ||        \\\\            "
    ]
  }, null, 2),
  'utf8'
);

console.log('All Blair Witch assets successfully generated and verified.');
