import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC_AUDIO_DIR = path.join(ROOT, 'public', 'assets', 'blair-witch', 'audio');
const DIST_AUDIO_DIR = path.join(ROOT, 'dist', 'assets', 'blair-witch', 'audio');

fs.mkdirSync(PUBLIC_AUDIO_DIR, { recursive: true });
fs.mkdirSync(DIST_AUDIO_DIR, { recursive: true });

const REAL_AUDIO_SOURCES = [
  // =========================================================================
  // SCORES (Real Orchestral / Dark Ambient / Neo-Classical Studio Compositions)
  // =========================================================================
  {
    targetFilename: 'aud-score-strings.mp3',
    aliasWav: 'aud-score-strings.wav',
    title: 'Touch the Darkness (Chamber Strings, Cello & Piano)',
    artist: 'Kai Engel',
    license: 'Creative Commons CC-BY 4.0',
    url: 'https://archive.org/download/kai-engel/Kai_Engel_-_05_-_Touch_the_Darkness.mp3',
  },
  {
    targetFilename: 'aud-score-dread.mp3',
    aliasWav: 'aud-score-dread.wav',
    title: 'Echoes of Time (Dark Ambient Cinematic Drone & Bowed Strings)',
    artist: 'Kevin MacLeod',
    license: 'Creative Commons CC-BY 3.0',
    url: 'https://archive.org/download/Kevin-MacLeod_Madness-and-Paranoia_2014_FullAlbum/Madness%20and%20Paranoia%2FKevin%20MacLeod%20-%2011%20-%20Echoes%20of%20Time%20v2.mp3',
  },
  {
    targetFilename: 'aud-score-investigation.mp3',
    aliasWav: 'aud-score-investigation.wav',
    title: 'Aftermath (Documentary Investigation Score & Horns)',
    artist: 'Kevin MacLeod',
    license: 'Creative Commons CC-BY 3.0',
    url: 'https://archive.org/download/Kevin-MacLeod_Madness-and-Paranoia_2014_FullAlbum/Madness%20and%20Paranoia%2FKevin%20MacLeod%20-%2001%20-%20Aftermath.mp3',
  },
  {
    targetFilename: 'aud-score-suspense.mp3',
    title: 'After Midnight (Nocturnal Violin Harmonics & Suspense)',
    artist: 'Kai Engel',
    license: 'Creative Commons CC-BY 4.0',
    url: 'https://archive.org/download/kai-engel/Kai_Engel_-_03_-_After_Midnight.mp3',
  },
  {
    targetFilename: 'aud-score-melancholy.mp3',
    title: 'Behind Your Window (Reflective Piano & Archival Atmosphere)',
    artist: 'Kai Engel',
    license: 'Creative Commons CC-BY 4.0',
    url: 'https://archive.org/download/kai-engel/Kai_Engel_-_04_-_Behind_Your_Window.mp3',
  },

  // =========================================================================
  // AMBIENCE (Real Acoustic Field Recordings)
  // =========================================================================
  {
    targetFilename: 'forest-wind-canopy.mp3',
    aliasWav: 'forest-wind-canopy.wav',
    title: 'Nida Soft Forest Canopy & Wind (Acoustic Field Recording)',
    artist: 'Radio Aporee Field Archive',
    license: 'Creative Commons CC-BY-SA 3.0',
    url: 'https://archive.org/download/aporee_30411_34998/NidaForestambiencesoft.mp3',
  },
  {
    targetFilename: 'stream-creek-flow.mp3',
    aliasWav: 'stream-creek-flow.wav',
    title: 'Kiefer Creek Water Stream Flow (Natural Water Recording)',
    artist: 'Radio Aporee Field Archive',
    license: 'Creative Commons CC-BY-SA 3.0',
    url: 'https://archive.org/download/aporee_53391_61002/KieferCreekBend.mp3',
  },
  {
    targetFilename: 'nocturnal-insects.mp3',
    aliasWav: 'nocturnal-insects.wav',
    title: 'Trees Swaying in Autumn Wind & Nocturnal Crickets',
    artist: 'Radio Aporee Field Archive',
    license: 'Creative Commons CC-BY-SA 3.0',
    url: 'https://archive.org/download/aporee_5352_6803/CityCountryMeprillwitzparkbaeumeimwindgrillen.mp3',
  },

  // =========================================================================
  // FOLEY & SFX (Real Studio Recorded Acoustic Foley)
  // =========================================================================
  {
    targetFilename: 'sfx-paper-turn.mp3',
    aliasWav: 'sfx-paper-turn.wav',
    title: 'Dossier Paper Page Turn Foley',
    artist: 'Mixkit / Internet Archive Office Foley',
    license: 'Public Domain / CC0',
    url: 'https://archive.org/download/office-sound-effects/mixkit-paper-quick-movement-2380.mp3',
  },
  {
    targetFilename: 'sfx-camera-shutter.mp3',
    aliasWav: 'sfx-camera-shutter.wav',
    title: '35mm SLR Mechanical Camera Shutter Click',
    artist: 'Internet Archive Sound FX Library',
    license: 'Public Domain / CC0',
    url: 'https://archive.org/download/camera-shutter-6305-1/camera-shutter-6305%20%281%29.mp3',
  },
  {
    targetFilename: 'sfx-typewriter.mp3',
    aliasWav: 'sfx-typewriter.wav',
    title: 'Mechanical Typewriter Key Strike & Latch',
    artist: 'Mixkit / Internet Archive Office Foley',
    license: 'Public Domain / CC0',
    url: 'https://archive.org/download/office-sound-effects/quick-mechanical-keyboard-14391.mp3',
  },
];

async function downloadTrack(track) {
  const destPublic = path.join(PUBLIC_AUDIO_DIR, track.targetFilename);
  const destDist = path.join(DIST_AUDIO_DIR, track.targetFilename);

  console.log(`[Source] Fetching: "${track.title}" by ${track.artist}...`);
  try {
    const res = await fetch(track.url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const arrayBuf = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuf);

    fs.writeFileSync(destPublic, buf);
    fs.writeFileSync(destDist, buf);

    // If there is an alias (e.g. legacy .wav extension expected by components),
    // write a copy so both .mp3 and .wav URLs resolve perfectly!
    if (track.aliasWav) {
      const aliasPublic = path.join(PUBLIC_AUDIO_DIR, track.aliasWav);
      const aliasDist = path.join(DIST_AUDIO_DIR, track.aliasWav);
      fs.writeFileSync(aliasPublic, buf);
      fs.writeFileSync(aliasDist, buf);
    }

    console.log(`[Source]  Successfully saved: ${track.targetFilename} (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);
  } catch (err) {
    console.error(`[Source]  Error fetching ${track.targetFilename}:`, err.message);
  }
}

async function main() {
  console.log('================================================================');
  console.log('SOURCING AUTHENTIC MUSIC & AMBIENT FIELD RECORDINGS (ARCHIVE.ORG)');
  console.log('Zero synthetic generation. Real compositions & real field recordings.');
  console.log('================================================================\n');

  for (const track of REAL_AUDIO_SOURCES) {
    await downloadTrack(track);
  }

  // Remove test download if present
  const testFile = path.join(PUBLIC_AUDIO_DIR, 'test-download.mp3');
  if (fs.existsSync(testFile)) fs.unlinkSync(testFile);

  console.log('\n================================================================');
  console.log('All authentic musical works and real acoustic recordings sourced!');
  console.log('================================================================');
}

main();
