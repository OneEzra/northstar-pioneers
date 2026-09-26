// -----------------------------------------------------------------
//  Northstar Pioneers <-> Nostr
//
//  Each meetup is stored on Nostr as two linked, replaceable records
//  that share the same ID (e.g. "2026-10-27"):
//
//   1. Calendar event  (NIP-52, kind 31923) -- the logistics: title,
//      start/end, venue, summary, Meetup link, status. Any NIP-52
//      calendar app (e.g. Plektos) can show it.
//   2. Program record  (NIP-78, kind 30078) -- the details filled in
//      over time: featured pioneer, Socratic topics, resources, photo.
//      JSON that only this site reads.
//
//  Publishing either record again with the same ID replaces it.
//  Only records signed by NSP_ADMIN_PUBKEY are trusted.
// -----------------------------------------------------------------

import type { NostrEvent } from '@nostrify/nostrify';
import { z } from 'zod';

import {
  EVENT_TIME_ZONE,
  parseEventTime,
  type EventProgram,
  type EventState,
  type MeetupEventInput,
} from '@/data/events';

/** Organizer account (hex of npub1s4257pzpeqzs0x74vpq44u8clu0qfed4ghmv6plmqvh4rdhkfnwqu7xqsr) */
export const NSP_ADMIN_PUBKEY = '85554f0441c805079bd560415af0f8ff1e04e5b545f6cd07fb032f51b6f64cdc';

/**
 * Relays events are published to and read from, for every visitor.
 * Several independent relays, so one being slow or down doesn't matter.
 * (relay.ditto.pub and relay.dreamith.to timed out in testing on
 * 2026-09-26, so they're not relied on here.)
 */
export const NSP_EVENT_RELAYS = [
  'wss://relay.primal.net/',
  'wss://nos.lol/',
  'wss://relay.damus.io/',
  'wss://relay.ditto.pub/',
];

export const KIND_CALENDAR_EVENT = 31923;
export const KIND_CALENDAR = 31924;
export const KIND_APP_DATA = 30078;

/** `t` tags that let us query just our records */
export const EVENT_TAG = 'northstarpioneers';
export const PROGRAM_TAG = 'northstarpioneers-program';

/** The NIP-52 calendar that groups all meetups */
export const CALENDAR_D = 'northstar-pioneers-meetups';
export const calendarCoord = (pubkey = NSP_ADMIN_PUBKEY) => `${KIND_CALENDAR}:${pubkey}:${CALENDAR_D}`;

const PROGRAM_D_PREFIX = 'northstarpioneers:program:';
export const programD = (slug: string) => `${PROGRAM_D_PREFIX}${slug}`;

/** Valid event IDs: a date, optionally followed by a short name ("2026-10-27-workshop") */
export const SLUG_PATTERN = /^\d{4}-\d{2}-\d{2}(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?$/;

// --- Safety helpers ---------------------------------------------

/** Only https URLs survive; everything else is dropped. */
export function sanitizeUrl(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

const tag = (ev: NostrEvent, name: string) => ev.tags.find(([n]) => n === name)?.[1];
const tagAll = (ev: NostrEvent, name: string) => ev.tags.filter(([n]) => n === name).map(([, v]) => v);

/** Unix seconds -> Central wall-clock "YYYY-MM-DDTHH:mm" */
export function toCentralWallTime(unixSeconds: number): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: EVENT_TIME_ZONE,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(new Date(unixSeconds * 1000));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '00';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

// --- Calendar event (kind 31923) ---------------------------------

export type CalendarFields = Omit<MeetupEventInput, keyof EventProgram>;

export interface EventTemplate {
  kind: number;
  content: string;
  tags: string[][];
}

/** Build the NIP-52 calendar event for a meetup. */
export function buildCalendarEvent(e: CalendarFields, pubkey = NSP_ADMIN_PUBKEY): EventTemplate {
  const start = Math.floor(parseEventTime(e.date) / 1000);
  const end = e.end ? Math.floor(parseEventTime(e.end) / 1000) : start + 2 * 60 * 60;
  const days = new Set([Math.floor(start / 86400), Math.floor(end / 86400)]);

  const tags: string[][] = [
    ['d', e.slug],
    ['title', e.title],
    ['summary', e.summary],
    ['start', String(start)],
    ['end', String(end)],
    ['start_tzid', EVENT_TIME_ZONE],
    ['end_tzid', EVENT_TIME_ZONE],
    ...[...days].map((d) => ['D', String(d)]),
    ['location', [e.venue, e.address].filter(Boolean).join(', ')],
    ['venue', e.venue],
    ['address', e.address],
    ['a', calendarCoord(pubkey)],
    ['t', EVENT_TAG],
    ['t', 'ai'],
    ['t', 'meetup'],
    ['status', e.state ?? 'active'],
  ];
  if (e.city) tags.push(['city', e.city]);
  if (e.meetupUrl) tags.push(['r', e.meetupUrl]);
  if (e.rescheduledTo) tags.push(['rescheduled_to', e.rescheduledTo]);
  for (const alias of e.aliases ?? []) tags.push(['alias', alias]);

  return { kind: KIND_CALENDAR_EVENT, content: e.summary, tags };
}

/** Parse a calendar event we published. Returns null if it isn't one of ours or is malformed. */
export function parseCalendarEvent(ev: NostrEvent): CalendarFields | null {
  if (ev.kind !== KIND_CALENDAR_EVENT || ev.pubkey !== NSP_ADMIN_PUBKEY) return null;
  const slug = tag(ev, 'd');
  const title = tag(ev, 'title');
  const start = Number(tag(ev, 'start'));
  if (!slug || !SLUG_PATTERN.test(slug) || !title || !Number.isFinite(start) || start <= 0) return null;

  const endRaw = Number(tag(ev, 'end'));
  const stateRaw = tag(ev, 'status');
  const state: EventState =
    stateRaw === 'cancelled' || stateRaw === 'rescheduled' ? stateRaw : 'active';
  const rescheduledTo = tag(ev, 'rescheduled_to');
  const aliases = tagAll(ev, 'alias').filter((a) => /^[a-z0-9-]+$/.test(a));

  return {
    slug,
    title,
    date: toCentralWallTime(start),
    end: Number.isFinite(endRaw) && endRaw > start ? toCentralWallTime(endRaw) : undefined,
    venue: tag(ev, 'venue') ?? tag(ev, 'location') ?? 'TBD',
    address: tag(ev, 'address') ?? '',
    city: tag(ev, 'city'),
    meetupUrl: sanitizeUrl(tag(ev, 'r')),
    summary: tag(ev, 'summary') ?? ev.content ?? '',
    state,
    rescheduledTo: rescheduledTo && SLUG_PATTERN.test(rescheduledTo) ? rescheduledTo : undefined,
    aliases: aliases.length ? aliases : undefined,
  };
}

// --- Program record (kind 30078) ---------------------------------

const resourceSchema = z.object({
  type: z.enum(['slides', 'video', 'link', 'demo', 'speaker']),
  label: z.string(),
  url: z.string(),
});

const programSchema = z.object({
  v: z.literal(1),
  topics: z
    .array(
      z.object({
        title: z.string(),
        section: z.string().optional(),
        description: z.string().optional(),
        expandedContent: z.array(z.string()).optional(),
        expandedImageUrl: z.string().optional(),
        expandedImageAlt: z.string().optional(),
        resources: z.array(resourceSchema).optional(),
        presenter: z.string().optional(),
      }),
    )
    .default([]),
  builderDemo: z
    .object({
      title: z.string(),
      presenter: z.string(),
      presenterUrl: z.string().optional(),
      presenterTelegram: z.string().optional(),
      presenterLinkedIn: z.string().optional(),
      description: z.string(),
      resources: z.array(resourceSchema).optional(),
    })
    .optional(),
  photoUrl: z.string().optional(),
  attendees: z.number().int().nonnegative().optional(),
});

type Resource = z.infer<typeof resourceSchema>;
const cleanResources = (list?: Resource[]) =>
  list
    ?.map((r) => ({ ...r, url: sanitizeUrl(r.url) }))
    .filter((r): r is Resource => !!r.url);

/** Build the program record for a meetup. */
export function buildProgramEvent(slug: string, program: EventProgram, pubkey = NSP_ADMIN_PUBKEY): EventTemplate {
  return {
    kind: KIND_APP_DATA,
    content: JSON.stringify({ v: 1, ...program }),
    tags: [
      ['d', programD(slug)],
      ['a', `${KIND_CALENDAR_EVENT}:${pubkey}:${slug}`],
      ['t', PROGRAM_TAG],
      ['alt', `Northstar Pioneers meetup program for ${slug}`],
    ],
  };
}

/** Parse a program record we published. URLs are sanitized; bad data returns null. */
export function parseProgramEvent(ev: NostrEvent): { slug: string; program: EventProgram } | null {
  if (ev.kind !== KIND_APP_DATA || ev.pubkey !== NSP_ADMIN_PUBKEY) return null;
  const d = tag(ev, 'd');
  if (!d?.startsWith(PROGRAM_D_PREFIX)) return null;
  const slug = d.slice(PROGRAM_D_PREFIX.length);
  if (!SLUG_PATTERN.test(slug)) return null;

  let json: unknown;
  try {
    json = JSON.parse(ev.content);
  } catch {
    return null;
  }
  const parsed = programSchema.safeParse(json);
  if (!parsed.success) return null;
  const p = parsed.data;

  return {
    slug,
    program: {
      topics: p.topics.map((t) => ({
        ...t,
        expandedImageUrl: sanitizeUrl(t.expandedImageUrl),
        resources: cleanResources(t.resources),
      })),
      builderDemo: p.builderDemo && {
        ...p.builderDemo,
        presenterUrl: sanitizeUrl(p.builderDemo.presenterUrl),
        presenterLinkedIn: sanitizeUrl(p.builderDemo.presenterLinkedIn),
        resources: cleanResources(p.builderDemo.resources),
      },
      photoUrl: sanitizeUrl(p.photoUrl),
      attendees: p.attendees,
    },
  };
}

// --- Merge -------------------------------------------------------

/** Keep only the newest version of each replaceable record (relays may return several). */
export function latestByD(events: NostrEvent[]): NostrEvent[] {
  const best = new Map<string, NostrEvent>();
  for (const ev of events) {
    const key = `${ev.kind}:${ev.pubkey}:${tag(ev, 'd') ?? ''}`;
    const cur = best.get(key);
    if (!cur || ev.created_at > cur.created_at || (ev.created_at === cur.created_at && ev.id < cur.id)) {
      best.set(key, ev);
    }
  }
  return [...best.values()];
}

/**
 * Combine the built-in backup list with what's on Nostr.
 * Nostr wins wherever it has a record; the backup fills any gaps
 * (e.g. before an event has been published, or if relays are down).
 */
export function mergeEvents(backup: MeetupEventInput[], nostrEvents: NostrEvent[]): MeetupEventInput[] {
  const latest = latestByD(nostrEvents);
  const calendar = new Map<string, CalendarFields>();
  const programs = new Map<string, EventProgram>();
  for (const ev of latest) {
    const cal = parseCalendarEvent(ev);
    if (cal) calendar.set(cal.slug, cal);
    const prog = parseProgramEvent(ev);
    if (prog) programs.set(prog.slug, prog.program);
  }

  const bySlug = new Map<string, MeetupEventInput>();
  for (const e of backup) bySlug.set(e.slug, e);

  for (const [slug, cal] of calendar) {
    const base = bySlug.get(slug);
    bySlug.set(slug, {
      topics: [],
      ...base,
      ...cal,
      aliases: cal.aliases ?? base?.aliases,
    });
  }
  for (const [slug, program] of programs) {
    const base = bySlug.get(slug);
    if (base) bySlug.set(slug, { ...base, ...program });
  }
  return [...bySlug.values()];
}
