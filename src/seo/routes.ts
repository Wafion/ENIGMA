import { getPublishedCaseManifests, resolveCase } from '../core/registry/caseRegistry';
import type { CaseManifest } from '../core/types/caseSchema';
import {
  SECTION_LABELS,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_LOGO_URL,
  SITE_MODIFIED_ISO,
  SITE_NAME,
  SITE_PUBLISHED_ISO,
  SITE_URL,
  absoluteUrl,
  isSupportingSection,
  type SupportingSection,
} from './siteConfig';

export type AppRoute =
  | { kind: 'home'; path: '/' }
  | { kind: 'archive'; path: '/archive' }
  | { kind: 'about'; path: '/about' }
  | { kind: 'case'; path: string; slug: string; manifest: CaseManifest }
  | {
      kind: 'case-supporting';
      path: string;
      slug: string;
      section: SupportingSection;
      manifest: CaseManifest;
    }
  | { kind: 'not-found'; path: string };

export function normalizePathname(pathname: string): string {
  const withoutIndex = pathname.replace(/\/index\.html$/i, '').replace(/\.html$/i, '');
  const trimmed = withoutIndex.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export function parseAppRoute(pathname: string): AppRoute {
  const path = normalizePathname(pathname);
  if (path === '/') return { kind: 'home', path: '/' };
  if (path === '/archive') return { kind: 'archive', path: '/archive' };
  if (path === '/about') return { kind: 'about', path: '/about' };

  const supportingMatch = path.match(/^\/case\/([^/]+)\/([^/]+)$/);
  if (supportingMatch) {
    const rawSlug = decodeURIComponent(supportingMatch[1]);
    const rawSection = decodeURIComponent(supportingMatch[2]).toLowerCase();
    const entry = resolveCase(rawSlug);
    if (entry && isSupportingSection(rawSection)) {
      const canonicalSlug = entry.manifest.slug;
      return {
        kind: 'case-supporting',
        path: `/case/${canonicalSlug}/${rawSection}`,
        slug: canonicalSlug,
        section: rawSection,
        manifest: entry.manifest,
      };
    }
    return { kind: 'not-found', path };
  }

  const caseMatch = path.match(/^\/case\/([^/]+)$/);
  if (caseMatch) {
    const rawSlug = decodeURIComponent(caseMatch[1]);
    const entry = resolveCase(rawSlug);
    if (entry) {
      const canonicalSlug = entry.manifest.slug;
      return {
        kind: 'case',
        path: `/case/${canonicalSlug}`,
        slug: canonicalSlug,
        manifest: entry.manifest,
      };
    }
    return { kind: 'not-found', path };
  }

  return { kind: 'not-found', path };
}

export interface RouteSeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  ogType: 'website' | 'article';
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt: string;
  ogImageWidth: number;
  ogImageHeight: number;
  twitterCard: 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterImageAlt: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  keywords?: string[];
  jsonLd: Record<string, unknown>[];
}

const ORGANIZATION_SCHEMA: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    url: SITE_LOGO_URL,
    width: 766,
    height: 766,
  },
  email: SITE_EMAIL,
  description: SITE_DESCRIPTION,
  publishingPrinciples: `${SITE_URL}/about#methodology`,
};

function breadcrumbSchema(items: Array<{ name: string; path: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

interface CaseSeoProfile {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt: string;
  keywords: string[];
  about: Array<{ '@type': string; name: string }>;
  sectionMeta: Record<
    SupportingSection,
    { title: string; description: string; headline: string }
  >;
}

const CASE_SEO_PROFILES: Record<string, CaseSeoProfile> = {
  'blair-witch': {
    title: 'The Blair Witch Incident (Case 001) — ENIGMA Documentary',
    description:
      'An editorial documentary on The Blair Witch Incident: separating the 1998–1999 Elly Kedward mythology from the real 1997 Haxan Films production in Burkittsville and Seneca Creek, Maryland.',
    ogTitle: 'Case 001: The Blair Witch Incident — ENIGMA Documentary',
    ogDescription:
      'Tracing how a modern folklore was built, marketed as a real record, and filmed in Burkittsville and Seneca Creek State Park, Maryland.',
    ogImage: `${SITE_URL}/og/og-blair-witch.jpg`,
    ogImageAlt:
      'Case 001: The Blair Witch Incident — ENIGMA Documentary in Seneca Creek State Park, Maryland',
    keywords: [
      'Blair Witch Incident',
      'The Blair Witch Project',
      'Burkittsville Maryland',
      'Seneca Creek State Park',
      'Elly Kedward',
      'Haxan Films',
      'found footage documentary',
      'modern folklore',
    ],
    about: [
      { '@type': 'Thing', name: 'The Blair Witch Project' },
      { '@type': 'Place', name: 'Burkittsville, Maryland' },
      { '@type': 'Place', name: 'Seneca Creek State Park' },
    ],
    sectionMeta: {
      timeline: {
        title: 'Blair Witch Timeline: Folklore vs. Production History — ENIGMA Case 001',
        description:
          'Side-by-side chronology separating the fictional 1785–1995 Blair Witch lore from verified Burkittsville history and the October 1997 Seneca Creek shoot.',
        headline: 'The Blair Witch Incident — Dual Chronology & Investigation Timeline',
      },
      evidence: {
        title: 'Blair Witch Evidence & Fact–Fiction Matrix — ENIGMA Case 001',
        description:
          'Archival survey maps, 16mm and Hi8 camera records, fabricated props, and a claim-by-claim fact versus fiction audit of The Blair Witch Project.',
        headline: 'The Blair Witch Incident — Archival Evidence & Fact–Fiction Matrix',
      },
      transcript: {
        title: 'Blair Witch Documentary Transcript & Excerpts — ENIGMA Case 001',
        description:
          'Full chapter-by-chapter documentary transcript, archival recording notes, and annotated excerpts from The Blair Witch Incident dossier.',
        headline: 'The Blair Witch Incident — Documentary Transcript & Excerpts',
      },
      sources: {
        title: 'Blair Witch Sources, Maps & Further Reading — ENIGMA Case 001',
        description:
          'Primary bibliographic citations, Library of Congress maps, Wikimedia Commons licences, field recordings, and further reading for ENIGMA Case 001.',
        headline: 'The Blair Witch Incident — Primary Sources, Licences & Further Reading',
      },
    },
  },
  'db-cooper': {
    title: 'D.B. Cooper & Northwest Orient Flight 305 (Case 002) — ENIGMA Documentary',
    description:
      'Investigating the 1971 hijacking of Northwest Orient Flight 305 by Dan Cooper (D.B. Cooper): the $200,000 ransom, parachute jump, FBI NORJAK investigation, identity leads, and disappearance.',
    ogTitle: 'Case 002: D.B. Cooper & Flight 305 — ENIGMA Documentary',
    ogDescription:
      'An editorial documentary on the 1971 Northwest Orient Flight 305 hijacking, the $200,000 ransom, the Tina Bar find, and the unresolved FBI NORJAK investigation.',
    ogImage: `${SITE_URL}/og/og-db-cooper.jpg`,
    ogImageAlt:
      'Case 002: D.B. Cooper and Northwest Orient Airlines Boeing 727 Flight 305 — ENIGMA Documentary',
    keywords: [
      'D.B. Cooper',
      'Dan Cooper',
      'Northwest Orient Flight 305',
      '1971 hijacking',
      'ransom',
      'parachute',
      'FBI investigation',
      'NORJAK',
      'identity',
      'disappearance',
      'Tina Bar',
    ],
    about: [
      { '@type': 'Person', name: 'D. B. Cooper' },
      { '@type': 'Event', name: 'Hijacking of Northwest Orient Airlines Flight 305' },
      { '@type': 'Organization', name: 'Federal Bureau of Investigation' },
    ],
    sectionMeta: {
      timeline: {
        title: 'D.B. Cooper Timeline: Flight 305 Hijacking & FBI Investigation (1971–2016) — ENIGMA',
        description:
          'Minute-by-minute timeline of the 24 November 1971 Northwest Orient Flight 305 hijacking, parachute exit, 1980 Tina Bar money find, and 2016 FBI NORJAK suspension.',
        headline: 'D.B. Cooper & Flight 305 — Chronology of the 1971 Hijacking & Investigation',
      },
      evidence: {
        title: 'D.B. Cooper Evidence, Suspects & Disappearance Theories — ENIGMA Case 002',
        description:
          'Forensic review of the clip-on tie, parachutes, $200,000 ransom serial numbers, 66 latent prints, named suspects, and four competing disappearance theories.',
        headline: 'D.B. Cooper & Flight 305 — Physical Evidence, Suspects & Theories',
      },
      transcript: {
        title: 'D.B. Cooper Documentary Transcript & Witness Records — ENIGMA Case 002',
        description:
          'Complete readable documentary transcript covering Flight 305 crew accounts, the hijacking demand note, cockpit flight logs, and FBI NORJAK conclusions.',
        headline: 'D.B. Cooper & Flight 305 — Documentary Transcript & Witness Records',
      },
      sources: {
        title: 'D.B. Cooper Sources, FBI Files & Further Reading — ENIGMA Case 002',
        description:
          'Primary FBI Vault documents, NARA case files, contemporary New York Times reporting, forensic diatom studies, and image/music credits for Case 002.',
        headline: 'D.B. Cooper & Flight 305 — Primary Sources, Archival Records & Further Reading',
      },
    },
  },
};

export function getRouteSeo(route: AppRoute): RouteSeoMetadata {
  if (route.kind === 'home') {
    const title = 'ENIGMA — Independent Documentary Platform for Unsolved Cases & Mysteries';
    const description = SITE_DESCRIPTION;
    return {
      title,
      description,
      canonicalUrl: `${SITE_URL}/`,
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      ogType: 'website',
      ogTitle: title,
      ogDescription: description,
      ogImage: `${SITE_URL}/og/og-home.jpg`,
      ogImageAlt: 'ENIGMA — Independent Documentary Platform for Unsolved Cases and Mysteries',
      ogImageWidth: 1200,
      ogImageHeight: 630,
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: `${SITE_URL}/og/og-home.jpg`,
      twitterImageAlt: 'ENIGMA — Independent Documentary Platform for Unsolved Cases and Mysteries',
      jsonLd: [
        ORGANIZATION_SCHEMA,
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          description,
          publisher: { '@id': `${SITE_URL}/#organization` },
          inLanguage: 'en-US',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${SITE_URL}/archive?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        },
      ],
    };
  }

  if (route.kind === 'archive') {
    const cases = getPublishedCaseManifests();
    const title = 'Case Archive — ENIGMA Documentary Investigations';
    const description =
      'Browse the complete ENIGMA documentary archive. Every published investigation into unsolved cases, historical mysteries, and modern folklore traced from primary records.';
    return {
      title,
      description,
      canonicalUrl: `${SITE_URL}/archive`,
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      ogType: 'website',
      ogTitle: title,
      ogDescription: description,
      ogImage: `${SITE_URL}/og/og-archive.jpg`,
      ogImageAlt: 'ENIGMA Case Archive — Documentary Investigations',
      ogImageWidth: 1200,
      ogImageHeight: 630,
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: `${SITE_URL}/og/og-archive.jpg`,
      twitterImageAlt: 'ENIGMA Case Archive — Documentary Investigations',
      jsonLd: [
        ORGANIZATION_SCHEMA,
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Archive', path: '/archive' },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'ENIGMA Case Archive',
          url: `${SITE_URL}/archive`,
          description,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: cases.length,
            itemListElement: cases.map((manifest, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${SITE_URL}/case/${manifest.slug}`,
              name: `Case ${manifest.caseNumber}: ${manifest.title}`,
            })),
          },
        },
      ],
    };
  }

  if (route.kind === 'about') {
    const title = 'About ENIGMA — Editorial Philosophy, Sourcing Methodology & Credits';
    const description =
      'What ENIGMA investigates, our editorial standard separating verified records from reconstruction and legend, our primary-source methodology, and production credits.';
    return {
      title,
      description,
      canonicalUrl: `${SITE_URL}/about`,
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      ogType: 'website',
      ogTitle: title,
      ogDescription: description,
      ogImage: `${SITE_URL}/og/og-about.jpg`,
      ogImageAlt: 'About ENIGMA — Editorial Charter and Sourcing Methodology',
      ogImageWidth: 1200,
      ogImageHeight: 630,
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: `${SITE_URL}/og/og-about.jpg`,
      twitterImageAlt: 'About ENIGMA — Editorial Charter and Sourcing Methodology',
      jsonLd: [
        ORGANIZATION_SCHEMA,
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About ENIGMA',
          url: `${SITE_URL}/about`,
          description,
          mainEntity: { '@id': `${SITE_URL}/#organization` },
        },
      ],
    };
  }

  if (route.kind === 'case') {
    const profile = CASE_SEO_PROFILES[route.slug];
    const title = profile?.title ?? `${route.manifest.title} (Case ${route.manifest.caseNumber}) — ENIGMA`;
    const description = profile?.description ?? route.manifest.shortDescription;
    const ogTitle = profile?.ogTitle ?? title;
    const ogDescription = profile?.ogDescription ?? description;
    const ogImage = profile?.ogImage ?? `${SITE_URL}/og/og-home.jpg`;
    const ogImageAlt = profile?.ogImageAlt ?? `${route.manifest.title} — ENIGMA Documentary`;
    const canonicalUrl = `${SITE_URL}/case/${route.slug}`;

    return {
      title,
      description,
      canonicalUrl,
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      ogType: 'article',
      ogTitle,
      ogDescription,
      ogImage,
      ogImageAlt,
      ogImageWidth: 1200,
      ogImageHeight: 630,
      twitterCard: 'summary_large_image',
      twitterTitle: ogTitle,
      twitterDescription: ogDescription,
      twitterImage: ogImage,
      twitterImageAlt: ogImageAlt,
      publishedTime: SITE_PUBLISHED_ISO,
      modifiedTime: SITE_MODIFIED_ISO,
      section: route.manifest.category,
      keywords: profile?.keywords,
      jsonLd: [
        ORGANIZATION_SCHEMA,
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Archive', path: '/archive' },
          { name: `Case ${route.manifest.caseNumber}: ${route.manifest.title}`, path: `/case/${route.slug}` },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          '@id': `${canonicalUrl}#article`,
          headline: `${route.manifest.title} — Case ${route.manifest.caseNumber}`,
          alternativeHeadline: route.manifest.subtitle,
          description,
          url: canonicalUrl,
          mainEntityOfPage: canonicalUrl,
          image: [ogImage],
          datePublished: SITE_PUBLISHED_ISO,
          dateModified: SITE_MODIFIED_ISO,
          inLanguage: 'en-US',
          articleSection: route.manifest.category,
          keywords: profile?.keywords?.join(', '),
          about: profile?.about,
          author: { '@id': `${SITE_URL}/#organization` },
          publisher: { '@id': `${SITE_URL}/#organization` },
          hasPart: [
            { '@type': 'WebPage', url: `${canonicalUrl}/timeline`, name: `${route.manifest.title} — Timeline` },
            { '@type': 'WebPage', url: `${canonicalUrl}/evidence`, name: `${route.manifest.title} — Evidence` },
            { '@type': 'WebPage', url: `${canonicalUrl}/transcript`, name: `${route.manifest.title} — Transcript` },
            { '@type': 'WebPage', url: `${canonicalUrl}/sources`, name: `${route.manifest.title} — Sources` },
          ],
        },
      ],
    };
  }

  if (route.kind === 'case-supporting') {
    const profile = CASE_SEO_PROFILES[route.slug];
    const secMeta = profile?.sectionMeta[route.section];
    const sectionLabel = SECTION_LABELS[route.section];
    const title =
      secMeta?.title ?? `${route.manifest.title} — ${sectionLabel} | ENIGMA Case ${route.manifest.caseNumber}`;
    const description = secMeta?.description ?? route.manifest.shortDescription;
    const ogImage = profile?.ogImage ?? `${SITE_URL}/og/og-home.jpg`;
    const ogImageAlt = profile?.ogImageAlt ?? `${route.manifest.title} — ${sectionLabel}`;
    const canonicalUrl = `${SITE_URL}/case/${route.slug}/${route.section}`;
    const parentUrl = `${SITE_URL}/case/${route.slug}`;

    return {
      title,
      description,
      canonicalUrl,
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      ogType: 'article',
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogImageAlt,
      ogImageWidth: 1200,
      ogImageHeight: 630,
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: ogImage,
      twitterImageAlt: ogImageAlt,
      publishedTime: SITE_PUBLISHED_ISO,
      modifiedTime: SITE_MODIFIED_ISO,
      section: route.manifest.category,
      keywords: profile?.keywords,
      jsonLd: [
        ORGANIZATION_SCHEMA,
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Archive', path: '/archive' },
          { name: route.manifest.title, path: `/case/${route.slug}` },
          { name: sectionLabel, path: `/case/${route.slug}/${route.section}` },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: secMeta?.headline ?? `${route.manifest.title} — ${sectionLabel}`,
          description,
          url: canonicalUrl,
          mainEntityOfPage: canonicalUrl,
          image: [ogImage],
          datePublished: SITE_PUBLISHED_ISO,
          dateModified: SITE_MODIFIED_ISO,
          inLanguage: 'en-US',
          articleSection: sectionLabel,
          isPartOf: { '@id': `${parentUrl}#article` },
          author: { '@id': `${SITE_URL}/#organization` },
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
      ],
    };
  }

  return {
    title: 'Record Not Found (404) — ENIGMA',
    description: 'The requested ENIGMA dossier or archive record could not be found.',
    canonicalUrl: `${SITE_URL}${route.path}`,
    robots: 'noindex, nofollow',
    ogType: 'website',
    ogTitle: 'Record Not Found — ENIGMA',
    ogDescription: 'The requested ENIGMA dossier or archive record could not be found.',
    ogImage: `${SITE_URL}/og/og-home.jpg`,
    ogImageAlt: 'ENIGMA Independent Documentary Archive',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    twitterCard: 'summary_large_image',
    twitterTitle: 'Record Not Found — ENIGMA',
    twitterDescription: 'The requested ENIGMA dossier or archive record could not be found.',
    twitterImage: `${SITE_URL}/og/og-home.jpg`,
    twitterImageAlt: 'ENIGMA Independent Documentary Archive',
    jsonLd: [],
  };
}
