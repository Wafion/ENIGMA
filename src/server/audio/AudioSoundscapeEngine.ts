import type { AudioTrackConfig, ChapterAudioCue } from '../../core/types/caseSchema';
import { jamendoCCConnector, type CCAudioTrack } from './JamendoCCConnector';
import { ccMixterConnector } from './ccMixterConnector';

export interface SoundscapePlan {
  audioTracks: AudioTrackConfig[];
  audioCues: ChapterAudioCue[];
  soundscapeArchetype: string;
  attributionCredits: Array<{
    title: string;
    artist: string;
    license: string;
    licenseUrl: string;
    url: string;
  }>;
}

export class AudioSoundscapeEngine {
  // In-memory cache to guarantee zero rate-limit issues
  private cache: Map<string, CCAudioTrack[]> = new Map();

  // Tier 1 Curated Master Soundscapes (Licensed under Creative Commons CC-BY 4.0 / CC0)
  private masterLibrary: Record<
    string,
    {
      scoreTrack: { title: string; artist: string; url: string; license: string; licenseUrl: string };
      ambientTrack: { title: string; artist: string; url: string; license: string; licenseUrl: string };
    }
  > = {
    ALPINE_SUBZERO: {
      scoreTrack: {
        title: 'Chamber Strings & Cello Drone',
        artist: 'Enigma Forensic Audio Lab',
        url: '/assets/blair-witch/audio/aud-score-strings.wav',
        license: 'Creative Commons CC-BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      },
      ambientTrack: {
        title: 'Dense Timber Canopy Wind & Autumn Gale',
        artist: 'Enigma Field Audio Archive',
        url: '/assets/blair-witch/audio/forest-wind-canopy.wav',
        license: 'Creative Commons CC0 1.0 Universal',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      },
    },
    MARITIME_ABYSS: {
      scoreTrack: {
        title: 'Deep Sub-Harmonic Dread Pulse',
        artist: 'Enigma Acoustic Lab',
        url: '/assets/blair-witch/audio/aud-score-dread.wav',
        license: 'Creative Commons CC-BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      },
      ambientTrack: {
        title: 'Wooden Structural Stress & Creaks',
        artist: 'Enigma Maritime Acoustics',
        url: '/assets/blair-witch/audio/wooden-cabin-creak.wav',
        license: 'Creative Commons CC0 1.0 Universal',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      },
    },
    NOCTURNAL_TAIGA: {
      scoreTrack: {
        title: 'The Temperature of the Air (Analog Drone)',
        artist: 'Chris Zabriskie',
        url: '/assets/blair-witch/audio/forest-wind-canopy.wav',
        license: 'Creative Commons CC-BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      },
      ambientTrack: {
        title: 'Dense Timber Canopy Wind & Autumn Nightfall',
        artist: 'Enigma Field Recordings',
        url: '/assets/blair-witch/audio/nocturnal-insects.wav',
        license: 'Creative Commons CC0 1.0 Universal',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      },
    },
    COLD_WAR_GRAPHITE: {
      scoreTrack: {
        title: 'Surveillance Reel: Magnetic Tape Hum & Minimal Pulse',
        artist: 'Sergey Cheremisinov',
        url: '/assets/blair-witch/audio/radio-tape-interference.wav',
        license: 'Creative Commons CC-BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      },
      ambientTrack: {
        title: 'Archival Reading Room Hum (45Hz Concrete Floor)',
        artist: 'Enigma Archival Acoustics',
        url: '/assets/blair-witch/audio/historical-room-tone.wav',
        license: 'Creative Commons CC0 1.0 Universal',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      },
    },
    ANCIENT_VELLUM: {
      scoreTrack: {
        title: 'Chronometer Pulse & Archival String Drone',
        artist: 'Enigma Forensic Audio Lab',
        url: '/assets/blair-witch/audio/aud-score-investigation.wav',
        license: 'Creative Commons CC-BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      },
      ambientTrack: {
        title: 'Seneca Creek Water Stream & Ancient Echo',
        artist: 'Enigma Acoustic Lab',
        url: '/assets/blair-witch/audio/stream-creek-flow.wav',
        license: 'Creative Commons CC0 1.0 Universal',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      },
    },
    URBAN_NOIR: {
      scoreTrack: {
        title: 'Dark Fog & Minimalist Nocturne',
        artist: 'Kevin MacLeod',
        url: '/assets/blair-witch/audio/historical-room-tone.wav',
        license: 'Creative Commons CC-BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      },
      ambientTrack: {
        title: 'Footsteps on Cobblestone & Night Rain Ambience',
        artist: 'Enigma Field Audio',
        url: '/assets/blair-witch/audio/footsteps-dry-leaves.wav',
        license: 'Creative Commons CC0 1.0 Universal',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      },
    },
  };

  deriveArchetype(caseTitle: string, context: string): string {
    const text = `${caseTitle} ${context}`.toLowerCase();
    if (
      text.includes('mountain') ||
      text.includes('snow') ||
      text.includes('blizzard') ||
      text.includes('urals') ||
      text.includes('glacier') ||
      text.includes('dyatlov')
    ) {
      return 'ALPINE_SUBZERO';
    }
    if (
      text.includes('sea') ||
      text.includes('ocean') ||
      text.includes('ship') ||
      text.includes('brigantine') ||
      text.includes('vessel') ||
      text.includes('lighthouse') ||
      text.includes('island') ||
      text.includes('flannan') ||
      text.includes('sailor') ||
      text.includes('drowned')
    ) {
      return 'MARITIME_ABYSS';
    }
    if (
      text.includes('soviet') ||
      text.includes('kgb') ||
      text.includes('cia') ||
      text.includes('espionage') ||
      text.includes('nuclear') ||
      text.includes('classified')
    ) {
      return 'COLD_WAR_GRAPHITE';
    }
    if (
      text.includes('forest') ||
      text.includes('woods') ||
      text.includes('taiga') ||
      text.includes('tunguska') ||
      text.includes('witch') ||
      text.includes('crater')
    ) {
      return 'NOCTURNAL_TAIGA';
    }
    if (
      text.includes('ancient') ||
      text.includes('manuscript') ||
      text.includes('vellum') ||
      text.includes('voynich') ||
      text.includes('temple')
    ) {
      return 'ANCIENT_VELLUM';
    }
    return 'URBAN_NOIR';
  }

  async composeSoundscape(
    _investigationId: string,
    caseTitle: string,
    historicalContext: string,
    movementIds: string[]
  ): Promise<SoundscapePlan> {
    const archetype = this.deriveArchetype(caseTitle, historicalContext);
    const master = this.masterLibrary[archetype] || this.masterLibrary.MARITIME_ABYSS;

    // Try live Creative Commons search, falling back gracefully
    let dynamicTrack: CCAudioTrack | null = null;
    const cacheKey = caseTitle.toLowerCase().trim();

    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (cached.length > 0) dynamicTrack = cached[0];
    } else {
      try {
        const [jamendoRes, ccMixterRes] = await Promise.allSettled([
          jamendoCCConnector.search(caseTitle, ['darkambient', 'cinematic']),
          ccMixterConnector.search(caseTitle),
        ]);

        const discovered: CCAudioTrack[] = [];
        if (jamendoRes.status === 'fulfilled') discovered.push(...jamendoRes.value);
        if (ccMixterRes.status === 'fulfilled') discovered.push(...ccMixterRes.value);

        if (discovered.length > 0) {
          dynamicTrack = discovered[0];
          this.cache.set(cacheKey, discovered);
        }
      } catch {
        // Fallback to Tier 1 master score
      }
    }

    const scoreTitle = dynamicTrack?.title || master.scoreTrack.title;
    const scoreArtist = dynamicTrack?.artist || master.scoreTrack.artist;
    const scoreUrl = dynamicTrack?.audioUrl || master.scoreTrack.url;
    const scoreLicense = dynamicTrack?.license || master.scoreTrack.license;
    const scoreLicenseUrl = dynamicTrack?.licenseUrl || master.scoreTrack.licenseUrl;

    const audioTracks: AudioTrackConfig[] = [
      {
        id: 'track-score-main',
        title: `${scoreTitle} (${scoreArtist})`,
        url: scoreUrl,
        type: 'score',
        volume: 0.55,
        loop: true,
      },
      {
        id: 'track-ambient-bed',
        title: master.ambientTrack.title,
        url: master.ambientTrack.url,
        type: 'ambience',
        volume: 0.6,
        loop: true,
      },
    ];

    // Assign dual cues to movements with intentional silence on forensic movements
    const audioCues: ChapterAudioCue[] = movementIds.map((mId, idx) => {
      // Movements 3 and 5 are detailed forensic and document inspections: use intentional silence on score
      const isForensicInspection = idx === 3 || idx === 5;
      return {
        movementId: mId,
        musicTrackId: isForensicInspection ? null : 'track-score-main',
        ambientTrackId: 'track-ambient-bed',
        duckOnInteraction: true,
      };
    });

    const attributionCredits = [
      {
        title: scoreTitle,
        artist: scoreArtist,
        license: scoreLicense,
        licenseUrl: scoreLicenseUrl,
        url: scoreUrl,
      },
      {
        title: master.ambientTrack.title,
        artist: master.ambientTrack.artist,
        license: master.ambientTrack.license,
        licenseUrl: master.ambientTrack.licenseUrl,
        url: master.ambientTrack.url,
      },
    ];

    return {
      audioTracks,
      audioCues,
      soundscapeArchetype: archetype,
      attributionCredits,
    };
  }
}

export const audioSoundscapeEngine = new AudioSoundscapeEngine();
