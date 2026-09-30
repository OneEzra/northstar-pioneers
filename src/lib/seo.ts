// -----------------------------------------------------------------
//  Search engines and link previews.
//
//  index.html carries a static title, description, share image and the
//  Organization/WebSite structured data, so crawlers and link previews
//  that don't run JavaScript still see who we are. Each page then sets
//  its own title, description and canonical URL with usePageSeo(), and
//  event pages add schema.org Event data built from the same Nostr/backup
//  events the page shows.
// -----------------------------------------------------------------

import { useHead, useSeoMeta } from '@unhead/react';

import type { MeetupEvent } from '@/data/events';
import { MEETUP_GROUP_URL } from '@/lib/meetup';

export const SITE_URL = 'https://northstarpioneers.com';
export const SITE_NAME = 'Northstar Pioneers';
export const OG_IMAGE = `${SITE_URL}/og-image.png`;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export const DEFAULT_TITLE = 'Northstar Pioneers — Monthly AI Meetup in Minneapolis & the Twin Cities';
export const DEFAULT_DESCRIPTION =
  'Northstar Pioneers is a free monthly AI meetup in the Twin Cities (Minneapolis–St. Paul, MN): Socratic AI news review, a live builder demo, and open networking.';

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

type JsonLd = Record<string, unknown>;

/** Split "7700 France Ave S, Edina, MN" into schema.org PostalAddress parts. */
export function postalAddress(address: string, city?: string): JsonLd {
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
  const region = parts.length >= 3 && /^[A-Z]{2}$/.test(parts[parts.length - 1]) ? parts.pop() : 'MN';
  const locality = parts.length >= 2 ? parts.pop() : city;
  return {
    '@type': 'PostalAddress',
    streetAddress: parts.join(', ') || address,
    ...(locality ? { addressLocality: locality } : {}),
    addressRegion: region,
    addressCountry: 'US',
  };
}

const EVENT_STATUS: Record<string, string> = {
  cancelled: 'https://schema.org/EventCancelled',
  rescheduled: 'https://schema.org/EventRescheduled',
};

/** schema.org Event for one meetup (Google's event search listings). */
export function eventJsonLd(e: MeetupEvent): JsonLd {
  const url = absoluteUrl(`/events/${e.slug}`);
  const demo = e.builderDemo;
  const topics = e.topics.map((t) => t.title).filter(Boolean);
  const description = [
    e.summary,
    demo?.presenter ? `Featured pioneer: ${demo.presenter}${demo.title ? ` — ${demo.title}` : ''}.` : '',
    topics.length ? `Topics: ${topics.join('; ')}.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${url}#event`,
    name: `${e.title} — ${SITE_NAME} AI Meetup`,
    description,
    url,
    startDate: e.date,
    endDate: e.end,
    eventStatus: EVENT_STATUS[e.state ?? ''] ?? 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: [e.photoUrl || OG_IMAGE],
    location: {
      '@type': 'Place',
      name: e.venue,
      address: postalAddress(e.address, e.city),
    },
    organizer: { '@type': 'Organization', '@id': ORGANIZATION_ID, name: SITE_NAME, url: SITE_URL },
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: e.meetupUrl || MEETUP_GROUP_URL,
    },
    ...(demo?.presenter
      ? { performer: { '@type': 'Person', name: demo.presenter, ...(demo.presenterUrl ? { url: demo.presenterUrl } : {}) } }
      : {}),
    ...(topics.length ? { about: topics } : {}),
  };
}

interface PageSeo {
  title: string;
  description?: string;
  /** Path of this page's canonical URL, e.g. "/events" */
  path: string;
  image?: string;
  /** Keep this page out of search results (admin, 404, style guide) */
  noindex?: boolean;
  /** schema.org objects to embed as JSON-LD */
  jsonLd?: JsonLd[];
}

/** Title, description, canonical URL, share tags and optional structured data for one page. */
export function usePageSeo({ title, description = DEFAULT_DESCRIPTION, path, image = OG_IMAGE, noindex, jsonLd = [] }: PageSeo) {
  const url = absoluteUrl(path);
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    ogUrl: url,
    ogSiteName: SITE_NAME,
    ogImage: image,
    twitterCard: 'summary_large_image',
    twitterImage: image,
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
  });
  useHead({
    link: noindex ? [] : [{ rel: 'canonical', href: url, key: 'canonical' }],
    // JSON.stringify output is data, not markup; escape "<" so a value can never close the <script> tag.
    script: jsonLd.map((data, i) => ({
      type: 'application/ld+json',
      key: `ld-${i}`,
      textContent: JSON.stringify(data).replace(/</g, '\\u003c'),
    })),
  });
}
