// -----------------------------------------------------------------
//  Meetup.com links -- one place that decides where "RSVP" goes.
//
//  Workflow: create the event on Meetup, then paste its link into the
//  event on /admin. Until then, RSVP buttons fall back to the group's
//  events page, so nothing is ever a dead end.
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

export interface MeetupLink {
  url: string;
  label: string;
  /** Links to this exact event (not just the group) */
  specific: boolean;
}

/**
 * Where an event's Meetup button should go:
 * - upcoming: "RSVP on Meetup" -> the exact event, else the group's events page
 * - past: "View on Meetup" -> the exact event only (no button otherwise)
 * - cancelled / rescheduled: no button
 */
export function meetupLinkFor(e: MeetupEvent): MeetupLink | null {
  if ((e.state ?? 'active') !== 'active') return null;
  const specific = isMeetupEventUrl(e.meetupUrl);
  if (e.status === 'upcoming') {
    return { url: specific ? e.meetupUrl! : MEETUP_GROUP_EVENTS_URL, label: 'RSVP on Meetup', specific };
  }
  return specific ? { url: e.meetupUrl!, label: 'View on Meetup', specific } : null;
}
