import type { RouteSeoMetadata } from './routes';

function upsertMeta(attr: 'name' | 'property', key: string, content: string | undefined) {
  const selector = `meta[${attr}="${key}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);
  if (!content) {
    existing?.remove();
    return;
  }
  const el = existing ?? document.createElement('meta');
  el.setAttribute(attr, key);
  el.setAttribute('content', content);
  if (!existing) document.head.appendChild(el);
}

function upsertLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"]`;
  const existing = document.head.querySelector<HTMLLinkElement>(selector);
  const el = existing ?? document.createElement('link');
  el.setAttribute('rel', rel);
  el.setAttribute('href', href);
  if (!existing) document.head.appendChild(el);
}

export function applyDocumentHead(seo: RouteSeoMetadata) {
  document.title = seo.title;

  upsertMeta('name', 'description', seo.description);
  upsertMeta('name', 'robots', seo.robots);
  upsertLink('canonical', seo.canonicalUrl);

  upsertMeta('property', 'og:type', seo.ogType);
  upsertMeta('property', 'og:site_name', 'ENIGMA');
  upsertMeta('property', 'og:locale', 'en_US');
  upsertMeta('property', 'og:title', seo.ogTitle);
  upsertMeta('property', 'og:description', seo.ogDescription);
  upsertMeta('property', 'og:url', seo.canonicalUrl);
  upsertMeta('property', 'og:image', seo.ogImage);
  upsertMeta('property', 'og:image:width', String(seo.ogImageWidth));
  upsertMeta('property', 'og:image:height', String(seo.ogImageHeight));
  upsertMeta('property', 'og:image:alt', seo.ogImageAlt);

  if (seo.ogType === 'article') {
    upsertMeta('property', 'article:published_time', seo.publishedTime);
    upsertMeta('property', 'article:modified_time', seo.modifiedTime);
    upsertMeta('property', 'article:section', seo.section);
  } else {
    upsertMeta('property', 'article:published_time', undefined);
    upsertMeta('property', 'article:modified_time', undefined);
    upsertMeta('property', 'article:section', undefined);
  }

  upsertMeta('name', 'twitter:card', seo.twitterCard);
  upsertMeta('name', 'twitter:title', seo.twitterTitle);
  upsertMeta('name', 'twitter:description', seo.twitterDescription);
  upsertMeta('name', 'twitter:image', seo.twitterImage);
  upsertMeta('name', 'twitter:image:alt', seo.twitterImageAlt);

  document.head
    .querySelectorAll('script[data-enigma-jsonld="true"]')
    .forEach((node) => node.remove());

  for (const item of seo.jsonLd) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-enigma-jsonld', 'true');
    script.textContent = JSON.stringify(item);
    document.head.appendChild(script);
  }
}
