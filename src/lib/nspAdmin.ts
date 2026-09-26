// -----------------------------------------------------------------
//  Admin helpers -- pure functions behind the /admin page.
// -----------------------------------------------------------------

import type { EventProgram, MeetupEvent, MeetupEventInput, Resource, Topic } from '@/data/events';
import {
  CALENDAR_D,
  KIND_CALENDAR,
  KIND_CALENDAR_EVENT,
  NSP_ADMIN_PUBKEY,
  SLUG_PATTERN,
  sanitizeUrl,
  toCentralWallTime,
  type CalendarFields,
  type EventTemplate,
} from '@/lib/nspNostr';

export const DEFAULTS = {
  startTime: '17:30',
  endTime: '19:30',
  venue: 'Nerdery',
  address: '7700 France Ave S, Edina, MN',
  city: 'Edina',
  meetupUrl: 'https://www.meetup.com/northstar-pioneers/',
  summary:
    'Our monthly gathering -- Socratic news review, builder demo, and open networking. Pizza provided.',
};

// --- IDs ---------------------------------------------------------

/** "Workshop!" -> "workshop", "Lunch & Learn" -> "lunch-learn" */
export function normalizeShortName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

/**
 * The ID for a new event on `day` ("2026-10-27"). Uses the date alone
 * when free; otherwise a short name ("2026-10-27-workshop") or the next
 * free number ("2026-10-27-2"). Never returns an ID already in use.
 */
export function suggestSlug(day: string, taken: Iterable<string>, shortName = ''): string {
  const used = new Set(taken);
  const name = normalizeShortName(shortName);
  const base = name ? `${day}-${name}` : day;
  if (!used.has(base)) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base}-${n}`;
    if (!used.has(candidate)) return candidate;
  }
}

/** Every ID and old alias in use, so new events can't collide with them. */
export function takenSlugs(events: MeetupEventInput[]): Set<string> {
  const set = new Set<string>();
  for (const e of events) {
    set.add(e.slug);
    for (const a of e.aliases ?? []) set.add(a);
  }
  return set;
}

/** "2026-10-27" -> "October 2026 Meetup" */
export function defaultTitle(day: string): string {
  const [y, m] = day.split('-').map(Number);
  const month = new Date(Date.UTC(y, m - 1, 15)).toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  return `${month} ${y} Meetup`;
}

// --- Logistics form ----------------------------------------------

export interface EventForm {
  slug: string;
  day: string; // YYYY-MM-DD
  startTime: string; // HH:mm (Central)
  endTime: string; // HH:mm (Central)
  title: string;
  venue: string;
  address: string;
  city: string;
  meetupUrl: string;
  summary: string;
}

export function newEventForm(day: string, taken: Iterable<string>): EventForm {
  return {
    slug: suggestSlug(day, taken),
    day,
    startTime: DEFAULTS.startTime,
    endTime: DEFAULTS.endTime,
    title: defaultTitle(day),
    venue: DEFAULTS.venue,
    address: DEFAULTS.address,
    city: DEFAULTS.city,
    meetupUrl: DEFAULTS.meetupUrl,
    summary: DEFAULTS.summary,
  };
}

/** Display event (UTC ISO times) -> editable form (Central wall time). */
export function eventToForm(e: MeetupEvent): EventForm {
  const start = toCentralWallTime(new Date(e.date).getTime() / 1000);
  const end = toCentralWallTime(new Date(e.end).getTime() / 1000);
  return {
    slug: e.slug,
    day: start.slice(0, 10),
    startTime: start.slice(11),
    endTime: end.slice(11),
    title: e.title,
    venue: e.venue,
    address: e.address,
    city: e.city ?? '',
    meetupUrl: e.meetupUrl ?? '',
    summary: e.summary,
  };
}

export function validateEventForm(f: EventForm): Partial<Record<keyof EventForm, string>> {
  const errors: Partial<Record<keyof EventForm, string>> = {};
  if (!SLUG_PATTERN.test(f.slug)) errors.slug = 'Use the date, optionally with a short name: 2026-10-27-workshop';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.day)) errors.day = 'Pick a date';
  if (!/^\d{2}:\d{2}$/.test(f.startTime)) errors.startTime = 'Pick a start time';
  if (!/^\d{2}:\d{2}$/.test(f.endTime)) errors.endTime = 'Pick an end time';
  else if (f.endTime <= f.startTime) errors.endTime = 'End must be after the start';
  if (!f.title.trim()) errors.title = 'Required';
  if (!f.venue.trim()) errors.venue = 'Required';
  if (f.meetupUrl && !sanitizeUrl(f.meetupUrl)) errors.meetupUrl = 'Must be an https:// link';
  if (f.slug && f.day && !f.slug.startsWith(f.day)) errors.slug = 'The ID must start with the event date';
  return errors;
}

/** Form -> calendar fields, keeping the existing event's aliases and status. */
export function formToCalendarFields(f: EventForm, existing?: MeetupEventInput): CalendarFields {
  return {
    slug: f.slug,
    aliases: existing?.aliases,
    title: f.title.trim(),
    date: `${f.day}T${f.startTime}`,
    end: `${f.day}T${f.endTime}`,
    venue: f.venue.trim(),
    address: f.address.trim(),
    city: f.city.trim() || undefined,
    meetupUrl: sanitizeUrl(f.meetupUrl.trim()),
    summary: f.summary.trim(),
    state: existing?.state ?? 'active',
    rescheduledTo: existing?.rescheduledTo,
  };
}

/** A display event's calendar fields in stored (Central wall time) form. */
export function toCalendarFields(e: MeetupEvent): CalendarFields {
  return formToCalendarFields(eventToForm(e), e);
}

// --- Program -----------------------------------------------------

export function programOf(e: MeetupEventInput): EventProgram {
  return {
    topics: e.topics,
    builderDemo: e.builderDemo,
    photoUrl: e.photoUrl,
    attendees: e.attendees,
  };
}

const trimOrUndef = (s?: string) => (s && s.trim() ? s.trim() : undefined);

function cleanResources(list?: Resource[]): Resource[] | undefined {
  const out = (list ?? [])
    .map((r) => ({ ...r, label: r.label.trim(), url: sanitizeUrl(r.url.trim()) ?? '' }))
    .filter((r) => r.url && r.label);
  return out.length ? out : undefined;
}

/** Drop blanks before publishing: empty topics, an empty pioneer, bad links. */
export function cleanProgram(p: EventProgram): EventProgram {
  const topics: Topic[] = p.topics
    .filter((t) => t.title.trim())
    .map((t) => ({
      title: t.title.trim(),
      section: trimOrUndef(t.section),
      description: trimOrUndef(t.description),
      expandedContent: t.expandedContent?.map((x) => x.trim()).filter(Boolean),
      expandedImageUrl: sanitizeUrl(t.expandedImageUrl?.trim()),
      expandedImageAlt: trimOrUndef(t.expandedImageAlt),
      resources: cleanResources(t.resources),
      presenter: trimOrUndef(t.presenter),
    }))
    .map((t) => ({ ...t, expandedContent: t.expandedContent?.length ? t.expandedContent : undefined }));

  const d = p.builderDemo;
  const builderDemo =
    d && d.presenter.trim()
      ? {
          title: d.title.trim(),
          presenter: d.presenter.trim(),
          description: d.description.trim(),
          presenterUrl: sanitizeUrl(d.presenterUrl?.trim()),
          presenterLinkedIn: sanitizeUrl(d.presenterLinkedIn?.trim()),
          presenterTelegram: trimOrUndef(d.presenterTelegram?.replace(/^@/, '')),
          resources: cleanResources(d.resources),
        }
      : undefined;

  return {
    topics,
    builderDemo,
    photoUrl: sanitizeUrl(p.photoUrl?.trim()),
    attendees: p.attendees && p.attendees > 0 ? Math.round(p.attendees) : undefined,
  };
}

/** Paragraph text <-> list of paragraphs (blank line between paragraphs). */
export const paragraphsToText = (list?: string[]) => (list ?? []).join('\n\n');
export const textToParagraphs = (text: string) =>
  text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

// --- Reschedule --------------------------------------------------

export interface ReschedulePlan {
  /** The replacement event */
  next: CalendarFields;
  /** The original, marked as rescheduled and pointing at the replacement */
  old: CalendarFields;
}

/** Move an event to a new date/time: a new event plus a forward from the old one. */
export function planReschedule(
  e: MeetupEvent,
  day: string,
  startTime: string,
  endTime: string,
  taken: Iterable<string>,
): ReschedulePlan {
  const current = toCalendarFields(e);
  const oldDay = current.date.slice(0, 10);
  const shortName = e.slug.slice(oldDay.length + 1).replace(/^\d+$/, '');
  const slug = suggestSlug(day, taken, shortName);
  const title = e.title === defaultTitle(oldDay) ? defaultTitle(day) : e.title;
  return {
    next: {
      ...current,
      slug,
      aliases: undefined,
      title,
      date: `${day}T${startTime}`,
      end: `${day}T${endTime}`,
      state: 'active',
      rescheduledTo: undefined,
    },
    old: { ...current, state: 'rescheduled', rescheduledTo: slug },
  };
}

// --- Calendar list (NIP-52 kind 31924) ---------------------------

/** The calendar that groups every meetup, so calendar apps can follow it. */
export function buildCalendarList(slugs: string[], pubkey = NSP_ADMIN_PUBKEY): EventTemplate {
  return {
    kind: KIND_CALENDAR,
    content: 'Monthly AI meetups in the Greater Twin Cities. northstarpioneers.com',
    tags: [
      ['d', CALENDAR_D],
      ['title', 'Northstar Pioneers Meetups'],
      ...[...new Set(slugs)].sort().map((s) => ['a', `${KIND_CALENDAR_EVENT}:${pubkey}:${s}`]),
    ],
  };
}
