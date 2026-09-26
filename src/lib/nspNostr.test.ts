import { describe, expect, test } from 'vitest';
import type { NostrEvent } from '@nostrify/nostrify';

import { events as backup, parseEventTime, resolveAll, selectBySlug, selectHorizon, selectNext, selectPast } from '@/data/events';
import {
  NSP_ADMIN_PUBKEY,
  buildCalendarEvent,
  buildProgramEvent,
  mergeEvents,
  parseCalendarEvent,
  parseProgramEvent,
  type CalendarFields,
} from './nspNostr';

let counter = 0;
/** Pretend-sign a template (signatures are verified by the relay layer, not here). */
function sign(t: { kind: number; content: string; tags: string[][] }, opts: { pubkey?: string; created_at?: number } = {}): NostrEvent {
  counter += 1;
  return {
    ...t,
    pubkey: opts.pubkey ?? NSP_ADMIN_PUBKEY,
    created_at: opts.created_at ?? 1_790_000_000 + counter,
    id: counter.toString(16).padStart(64, '0'),
    sig: '0'.repeat(128),
  };
}

const october: CalendarFields = {
  slug: '2026-10-27',
  aliases: ['2026-10'],
  title: 'October 2026 Meetup',
  date: '2026-10-27T17:30',
  venue: 'Nerdery',
  address: '7700 France Ave S, Edina, MN',
  city: 'Edina',
  meetupUrl: 'https://www.meetup.com/northstar-pioneers/events/123/',
  summary: 'Our monthly gathering.',
};

describe('calendar event (NIP-52)', () => {
  test('round-trips the meetup logistics', () => {
    const ev = sign(buildCalendarEvent(october));
    expect(ev.kind).toBe(31923);
    expect(ev.tags).toContainEqual(['start', String(parseEventTime('2026-10-27T17:30') / 1000)]);
    expect(ev.tags).toContainEqual(['start_tzid', 'America/Chicago']);
    expect(ev.tags).toContainEqual(['location', 'Nerdery, 7700 France Ave S, Edina, MN']);

    const parsed = parseCalendarEvent(ev);
    expect(parsed).toMatchObject({ ...october, end: '2026-10-27T19:30', state: 'active' });
  });

  test('ignores records from any other account', () => {
    expect(parseCalendarEvent(sign(buildCalendarEvent(october), { pubkey: 'f'.repeat(64) }))).toBeNull();
  });

  test('drops unsafe links', () => {
    const ev = sign(buildCalendarEvent({ ...october, meetupUrl: 'javascript:alert(1)' }));
    expect(parseCalendarEvent(ev)?.meetupUrl).toBeUndefined();
  });

  test('supports a second event on the same day with a short name', () => {
    const ev = sign(buildCalendarEvent({ ...october, slug: '2026-10-27-workshop', date: '2026-10-27T12:00' }));
    expect(parseCalendarEvent(ev)?.slug).toBe('2026-10-27-workshop');
  });
});

describe('program record', () => {
  test('round-trips pioneer and topics', () => {
    const program = {
      topics: [{ title: 'Topic A', description: 'Why it matters', resources: [{ type: 'link' as const, label: 'Read', url: 'https://example.com/a' }] }],
      builderDemo: { title: 'Demo', presenter: 'Pat Pioneer', description: 'What they built', presenterUrl: 'https://example.com/pat' },
    };
    const parsed = parseProgramEvent(sign(buildProgramEvent('2026-10-27', program)));
    expect(parsed?.slug).toBe('2026-10-27');
    expect(parsed?.program.topics[0].resources?.[0].url).toBe('https://example.com/a');
    expect(parsed?.program.builderDemo?.presenter).toBe('Pat Pioneer');
  });

  test('rejects malformed JSON and strips unsafe URLs', () => {
    const bad = sign({ ...buildProgramEvent('2026-10-27', { topics: [] }), content: 'not json' });
    expect(parseProgramEvent(bad)).toBeNull();

    const sneaky = buildProgramEvent('2026-10-27', {
      topics: [{ title: 'T', resources: [{ type: 'link', label: 'x', url: 'javascript:alert(1)' }] }],
    });
    expect(parseProgramEvent(sign(sneaky))?.program.topics[0].resources).toEqual([]);
  });
});

describe('mergeEvents -- one list for the whole site', () => {
  const now = parseEventTime('2026-09-26T12:00');

  test('with nothing on Nostr, the backup list is used as-is', () => {
    expect(mergeEvents(backup, [])).toHaveLength(backup.length);
  });

  test('a Nostr edit replaces the backup details (e.g. venue change)', () => {
    const moved = sign(buildCalendarEvent({ ...october, venue: 'Somewhere New', address: '1 Main St' }));
    const all = resolveAll(mergeEvents(backup, [moved]), now);
    expect(selectNext(all)?.venue).toBe('Somewhere New');
    expect(all.filter((e) => e.slug === '2026-10-27')).toHaveLength(1);
  });

  test('the newest version of a record wins', () => {
    const older = sign(buildCalendarEvent({ ...october, title: 'Old title' }), { created_at: 100 });
    const newer = sign(buildCalendarEvent({ ...october, title: 'New title' }), { created_at: 200 });
    const all = resolveAll(mergeEvents(backup, [newer, older]), now);
    expect(selectBySlug(all, '2026-10-27')?.title).toBe('New title');
  });

  test('adding a pioneer later fills in the existing event', () => {
    const cal = sign(buildCalendarEvent(october));
    const prog = sign(buildProgramEvent('2026-10-27', {
      topics: [],
      builderDemo: { title: 'Demo', presenter: 'Pat Pioneer', description: 'd' },
    }));
    const next = selectNext(resolveAll(mergeEvents(backup, [cal, prog]), now));
    expect(next?.builderDemo?.presenter).toBe('Pat Pioneer');
    expect(next?.placeholder).toBe(false);
  });

  test('a new Nostr-only event appears in the right place', () => {
    const dec = sign(buildCalendarEvent({ ...october, slug: '2026-12-15', aliases: undefined, title: 'December', date: '2026-12-15T17:30' }));
    const all = resolveAll(mergeEvents(backup, [dec]), now);
    expect(selectHorizon(all).map((e) => e.slug)).toEqual(['2026-11-17', '2026-12-15']);
  });

  test('a same-day workshop and meetup are both listed, in time order', () => {
    const workshop = sign(buildCalendarEvent({ ...october, slug: '2026-10-27-workshop', aliases: undefined, title: 'Workshop', date: '2026-10-27T12:00', end: '2026-10-27T14:00' }));
    const all = resolveAll(mergeEvents(backup, [workshop]), now);
    expect(selectNext(all)?.slug).toBe('2026-10-27-workshop');
    expect(selectHorizon(all)[0].slug).toBe('2026-10-27');
  });

  test('cancelled and rescheduled events leave the spotlight and the archive', () => {
    const cancelled = sign(buildCalendarEvent({ ...october, state: 'cancelled' }));
    const all = resolveAll(mergeEvents(backup, [cancelled]), now);
    expect(selectNext(all)?.slug).toBe('2026-11-17');
    expect(selectBySlug(all, '2026-10-27')?.state).toBe('cancelled');

    const pastMoved = sign(buildCalendarEvent({
      slug: '2026-08-26', title: 'August', date: '2026-08-26T17:30', venue: 'V', address: 'A', summary: 'S',
      state: 'rescheduled', rescheduledTo: '2026-08-27',
    }));
    const all2 = resolveAll(mergeEvents(backup, [pastMoved]), now);
    expect(selectPast(all2).map((e) => e.slug)).not.toContain('2026-08-26');
    expect(selectBySlug(all2, '2026-08-26')?.rescheduledTo).toBe('2026-08-27');
  });
});
