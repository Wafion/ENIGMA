export const SITE_URL = 'https://www.enigma.buzz';
export const SITE_NAME = 'ENIGMA';
export const SITE_TAGLINE = 'Independent Documentary Platform for Unsolved Cases & Mysteries';
export const SITE_DESCRIPTION =
  'ENIGMA is an independent editorial documentary platform investigating unsolved cases, historical mysteries, and modern folklore from primary records and evidence.';
export const SITE_EMAIL = 'editorial@enigma.buzz';
export const SITE_LOGO_URL = `${SITE_URL}/assets/home/logo-2-lockup.png`;
export const SITE_ICON_URL = `${SITE_URL}/assets/home/logo-1-light.png`;
export const SITE_PUBLISHED_ISO = '2026-11-05T00:00:00Z';
export const SITE_MODIFIED_ISO = '2026-11-13T00:00:00Z';

export const SUPPORTING_SECTIONS = ['timeline', 'evidence', 'transcript', 'sources'] as const;
export type SupportingSection = (typeof SUPPORTING_SECTIONS)[number];

export const SECTION_LABELS: Record<SupportingSection, string> = {
  timeline: 'Timeline',
  evidence: 'Evidence',
  transcript: 'Transcript',
  sources: 'Sources & Further Reading',
};

export function isSupportingSection(value: string | undefined): value is SupportingSection {
  return Boolean(value && (SUPPORTING_SECTIONS as readonly string[]).includes(value));
}

export function absoluteUrl(path: string): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
