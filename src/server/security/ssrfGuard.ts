import { URL } from 'node:url';

const ALLOWED_DOMAINS = [
  'archive.org',
  'api.openalex.org',
  'openalex.org',
  'api.crossref.org',
  'crossref.org',
  'doi.org',
  'loc.gov',
  'chroniclingamerica.loc.gov',
  'gutendex.com',
  'gutenberg.org',
  'commons.wikimedia.org',
  'upload.wikimedia.org',
  'en.wikipedia.org',
  'wikipedia.org',
  'api.jamendo.com',
  'jamendo.com',
  'jamendo-licensing.com',
  'mp3d.jamendo.com',
  'mp3l.jamendo.com',
  'ccmixter.org',
  'freesound.org',
  'api.si.edu',
  'si.edu',
  'collectionapi.metmuseum.org',
  'metmuseum.org',
];

const BLOCKED_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  /^169\.254\.\d+\.\d+$/, // AWS / GCP / Azure metadata
  /^::1$/,
  /^0\.0\.0\.0$/,
  /metadata\.google\.internal/i,
];

export function validateArchivalUrl(rawUrl: string): { isValid: boolean; sanitizedUrl?: string; error?: string } {
  try {
    const parsed = new URL(rawUrl);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: `Disallowed protocol: ${parsed.protocol}` };
    }

    const hostname = parsed.hostname.toLowerCase();

    for (const pattern of BLOCKED_HOST_PATTERNS) {
      if (pattern.test(hostname)) {
        return { isValid: false, error: `Access to private or local host is prohibited: ${hostname}` };
      }
    }

    const isAllowed = ALLOWED_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );

    if (!isAllowed) {
      return { isValid: false, error: `Domain not in archival whitelist: ${hostname}` };
    }

    return { isValid: true, sanitizedUrl: parsed.toString() };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { isValid: false, error: `Invalid URL structure: ${message}` };
  }
}

export async function safeArchivalFetch(url: string, init?: RequestInit): Promise<Response> {
  const check = validateArchivalUrl(url);
  if (!check.isValid || !check.sanitizedUrl) {
    throw new Error(`SSRF Guardrail Violation: ${check.error || 'Blocked URL'}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second archival timeout

  try {
    const response = await fetch(check.sanitizedUrl, {
      ...init,
      signal: controller.signal,
      headers: {
        'User-Agent': 'ENIGMA-Documentary-Engine/2.0 (Investigative Archival Ingest; scholarly/educational)',
        ...(init?.headers || {}),
      },
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}
