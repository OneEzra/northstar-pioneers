// -----------------------------------------------------------------
//  Presentation mode -- turns one meetup into a slide deck.
//
//  Order (always built from the event's live data, so edits on /admin
//  show up in the slides with no extra work):
//    1. Connect   -- Telegram, Meetup, and tonight's topics as QR codes
//    2. Welcome   -- who we are
//    3. Venue     -- the venue sponsor (from src/data/venues.ts)
//    4. Topics    -- one slide per Socratic topic, in listed order
//    5. Demo      -- the featured pioneer
// -----------------------------------------------------------------

import type { MeetupEvent, Resource, Topic } from '@/data/events';
import { getVenueSponsor, type VenueSponsor } from '@/data/venues';
import { MEETUP_GROUP_URL } from '@/lib/meetup';
import { absoluteUrl } from '@/lib/seo';

export const TELEGRAM_URL = 'https://t.me/northstarpioneerscommunity';

export type Slide =
  | { kind: 'connect'; key: string; telegramUrl: string; meetupUrl: string; topicsUrl: string }
  | { kind: 'welcome'; key: string }
  | { kind: 'venue'; key: string; venue: string; address: string; sponsor?: VenueSponsor }
  | { kind: 'topic'; key: string; topic: Topic; number: number; total: number }
  | { kind: 'demo'; key: string; demo?: MeetupEvent['builderDemo'] };

export function buildSlides(event: MeetupEvent): Slide[] {
  const slides: Slide[] = [
    {
      kind: 'connect',
      key: 'connect',
      telegramUrl: TELEGRAM_URL,
      meetupUrl: MEETUP_GROUP_URL,
      topicsUrl: absoluteUrl(`/events/${event.slug}`),
    },
    { kind: 'welcome', key: 'welcome' },
    {
      kind: 'venue',
      key: 'venue',
      venue: event.venue,
      address: event.address,
      sponsor: getVenueSponsor(event.venue),
    },
  ];

  event.topics.forEach((topic, i) => {
    slides.push({
      kind: 'topic',
      key: `topic-${i}`,
      topic,
      number: i + 1,
      total: event.topics.length,
    });
  });

  slides.push({ kind: 'demo', key: 'demo', demo: event.builderDemo });
  return slides;
}

/** The verb shown above a topic's link, matching the printed decks. */
export function resourceVerb(r: Resource): string {
  switch (r.type) {
    case 'video':
      return 'Watch';
    case 'demo':
      return 'Explore';
    case 'slides':
      return 'Slides';
    case 'speaker':
      return 'Meet';
    default:
      return 'Read';
  }
}

/** "https://www.example.com/a/b/" -> "example.com/a/b" (for display only). */
export function shortUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/+$/, '');
    return `${u.hostname.replace(/^www\./, '')}${path}`;
  } catch {
    return url;
  }
}

/** Clamp a slide number from the URL (1-based) into range. */
export function clampSlide(value: string | null, count: number): number {
  const n = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(n) || count === 0) return 0;
  return Math.min(Math.max(n - 1, 0), count - 1);
}

/** Ask the browser for full screen (must run inside a click/tap). */
export function enterFullscreen() {
  if (typeof document === 'undefined' || document.fullscreenElement) return;
  void document.documentElement.requestFullscreen?.().catch(() => {});
}

export function toggleFullscreen() {
  if (document.fullscreenElement) {
    void document.exitFullscreen?.().catch(() => {});
  } else {
    enterFullscreen();
  }
}
