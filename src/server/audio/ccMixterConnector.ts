import { safeArchivalFetch } from '../security/ssrfGuard';
import type { CCAudioTrack } from './JamendoCCConnector';

export class CcMixterConnector {
  async search(query: string): Promise<CCAudioTrack[]> {
    const cleanQuery = encodeURIComponent(query.trim());
    const url = `http://ccmixter.org/api/query?tags=ambient,cinematic,soundtrack&search=${cleanQuery}&format=json&limit=3`;

    try {
      const res = await safeArchivalFetch(url);
      if (!res.ok) return [];

      const items = (await res.json()) as Array<{
        upload_id?: number;
        upload_name?: string;
        user_name?: string;
        files?: Array<{ download_url?: string }>;
        license_name?: string;
        license_url?: string;
      }>;

      if (!Array.isArray(items)) return [];

      return items
        .filter((item) => item.files && item.files.length > 0 && item.files[0].download_url)
        .map((item) => ({
          id: `ccmixter-${item.upload_id || Math.random()}`,
          title: item.upload_name || 'Ambient Cinematic Score',
          artist: item.user_name || 'ccMixter Collective',
          audioUrl: item.files![0].download_url!,
          durationSeconds: 180,
          license: item.license_name || 'Creative Commons CC-BY 3.0',
          licenseUrl: item.license_url || 'https://creativecommons.org/licenses/by/3.0/',
          genreOrTags: ['ambient', 'drone', 'cinematic'],
        }));
    } catch (err) {
      console.warn('[CcMixterConnector] Notice:', err);
      return [];
    }
  }
}

export const ccMixterConnector = new CcMixterConnector();
