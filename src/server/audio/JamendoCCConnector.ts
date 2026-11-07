import { safeArchivalFetch } from '../security/ssrfGuard';

export interface CCAudioTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  durationSeconds: number;
  license: string;
  licenseUrl: string;
  genreOrTags: string[];
}

export class JamendoCCConnector {
  // Public non-commercial developer client ID for Creative Commons query
  private clientId = '56d30c95';

  async search(query: string, tags: string[] = ['darkambient', 'cinematic']): Promise<CCAudioTrack[]> {
    const combinedTags = tags.join('+');
    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${this.clientId}&format=json&limit=3&fuzzytags=${combinedTags}&namesearch=${encodeURIComponent(query)}&include=musicinfo&audioformat=mp32`;

    try {
      const res = await safeArchivalFetch(url);
      if (!res.ok) return [];

      const data = (await res.json()) as {
        results?: Array<{
          id: string;
          name: string;
          artist_name: string;
          audio: string;
          duration: number;
          license_ccurl?: string;
          musicinfo?: { tags?: { genres?: string[] } };
        }>;
      };

      const results = data.results || [];
      return results.map((track) => ({
        id: `jamendo-${track.id}`,
        title: track.name,
        artist: track.artist_name,
        audioUrl: track.audio,
        durationSeconds: track.duration,
        license: 'Creative Commons (CC-BY-NC / CC-BY)',
        licenseUrl: track.license_ccurl || 'https://creativecommons.org/licenses/by/4.0/',
        genreOrTags: track.musicinfo?.tags?.genres || tags,
      }));
    } catch (err) {
      console.warn('[JamendoCCConnector] Search notice:', err);
      return [];
    }
  }
}

export const jamendoCCConnector = new JamendoCCConnector();
