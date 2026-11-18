// -----------------------------------------------------------------
//  RSVP links -- one place that decides where "RSVP" goes.
//
//  Workflow: create the event on LinkedIn (or Meetup, for older events),
//  then paste its link into the event on /admin. Until then, upcoming
//  events fall back to the Meetup group's events page, so nothing is
//  ever a dead end.
// -----------------------------------------------------------------

import type { MeetupEvent } from '@/data/events';

export const MEETUP_GROUP_URL = 'https://www.meetup.com/northstar-pioneers/';
export const MEETUP_GROUP_EVENTS_URL = 'https://www.meetup.com/northstar-pioneers/events/';

/** True for a specific Meetup event page, e.g. …/northstar-pioneers/events/316723462/ */
export function isMeetupEventUrl(url?: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return /(^|\.)meetup\.com$/.test(u.hostname) && /^\/[^/]+\/events\/\d+\/?$/.test(u.pathname);
  } catch {
    return false;
  }
}

/** True for a specific LinkedIn event page, e.g. https://www.linkedin.com/events/7390123456789012345/ */
export function isLinkedInEventUrl(url?: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && /(^|\.)linkedin\.com$/.test(u.hostname) && /^\/events\/[^/]+\/?$/.test(u.pathname);
  } catch {
    return false;
  }
}

/** Where an event's own page lives: Meetup or LinkedIn. */
export type RsvpPlatform = 'meetup' | 'linkedin';

export function rsvpPlatformOf(url?: string): RsvpPlatform | null {
  if (isLinkedInEventUrl(url)) return 'linkedin';
  if (isMeetupEventUrl(url)) return 'meetup';
  return null;
}

/** True when the link is a specific Meetup or LinkedIn event page. */
export const isRsvpEventUrl = (url?: string): boolean => rsvpPlatformOf(url) !== null;

const PLATFORM_NAME: Record<RsvpPlatform, string> = { meetup: 'Meetup', linkedin: 'LinkedIn' };

export interface RsvpLink {
  url: string;
  label: string;
  /** Links to this exact event (not just the group) */
  specific: boolean;
}

/**
 * Where an event's RSVP button should go:
 * - upcoming: "RSVP on LinkedIn" / "RSVP on Meetup" -> the exact event, else the Meetup group's events page
 * - past: "View on LinkedIn" / "View on Meetup" -> the exact event only (no button otherwise)
 * - cancelled / rescheduled: no button
 */
export function rsvpLinkFor(e: MeetupEvent): RsvpLink | null {
  if ((e.state ?? 'active') !== 'active') return null;
  const platform = rsvpPlatformOf(e.meetupUrl);
  if (e.status === 'upcoming') {
    return platform
      ? { url: e.meetupUrl!, label: `RSVP on ${PLATFORM_NAME[platform]}`, specific: true }
      : { url: MEETUP_GROUP_EVENTS_URL, label: 'RSVP on Meetup', specific: false };
  }
  return platform ? { url: e.meetupUrl!, label: `View on ${PLATFORM_NAME[platform]}`, specific: true } : null;
}
