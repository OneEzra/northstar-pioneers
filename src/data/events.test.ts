import { describe, expect, test } from 'vitest';
import {
  getEventBySlug,
  getHorizonEvents,
  getNextEvent,
  getPastEvents,
  parseEventTime,
  resolveEvent,
} from './events';

/** Central wall-clock time -> epoch ms, for readable test clocks */
const at = (wall: string) => parseEventTime(wall);

describe('parseEventTime', () => {
  test('reads Central daylight time (CDT, UTC-5)', () => {
    expect(new Date(at('2026-09-23T17:30')).toISOString()).toBe('2026-09-23T22:30:00.000Z');
  });
  test('reads Central standard time (CST, UTC-6)', () => {
    expect(new Date(at('2026-11-17T17:30')).toISOString()).toBe('2026-11-17T23:30:00.000Z');
  });
});

describe('resolveEvent', () => {
  const base = { slug: 'x', title: 'X', venue: 'V', address: 'A', summary: 'S', topics: [] };

  test('defaults to a 2-hour event and formats the time range', () => {
    const e = resolveEvent({ ...base, date: '2026-10-27T17:30' }, at('2026-10-01T12:00'));
    expect(e.time).toBe('5:30 – 7:30 PM CDT');
    expect(e.end).toBe('2026-10-28T00:30:00.000Z');
    expect(e.status).toBe('upcoming');
    expect(e.placeholder).toBe(true);
  });

  test('stays upcoming during the meetup and flips to past at the end time', () => {
    const input = { ...base, date: '2026-10-27T17:30' };
    expect(resolveEvent(input, at('2026-10-27T19:29')).status).toBe('upcoming');
    expect(resolveEvent(input, at('2026-10-27T19:30')).status).toBe('past');
  });

  test('honors a custom end time', () => {
    const e = resolveEvent({ ...base, date: '2026-10-27T11:30', end: '2026-10-27T13:00' });
    expect(e.time).toBe('11:30 AM – 1:00 PM CDT');
  });
});

describe('automatic spotlight rotation', () => {
  test('before Sept 23 ends, September is in the spotlight', () => {
    const now = at('2026-09-23T18:00');
    expect(getNextEvent(now)?.slug).toBe('2026-09-23');
    expect(getHorizonEvents(now).map((e) => e.slug)).toEqual(['2026-10-27', '2026-11-17']);
  });

  test('after Sept 23 ends, October moves up and September is archived', () => {
    const now = at('2026-09-23T19:31');
    expect(getNextEvent(now)?.slug).toBe('2026-10-27');
    expect(getHorizonEvents(now).map((e) => e.slug)).toEqual(['2026-11-17']);
    expect(getPastEvents(now)[0].slug).toBe('2026-09-23');
  });

  test('after the last scheduled meetup, nothing is in the spotlight', () => {
    const now = at('2026-12-01T12:00');
    expect(getNextEvent(now)).toBeNull();
    expect(getPastEvents(now)).toHaveLength(6);
  });
});

describe('getEventBySlug', () => {
  test('finds events by date slug and by old month slug', () => {
    expect(getEventBySlug('2026-08-26')?.title).toBe('August 2026 Meetup');
    expect(getEventBySlug('2026-08')?.slug).toBe('2026-08-26');
    expect(getEventBySlug('nope')).toBeUndefined();
  });
});

describe('selectPioneers', () => {
  test('lists every featured pioneer, newest first, skipping TBD events', async () => {
    const { getPioneers } = await import('./events');
    const list = getPioneers(parseEventTime('2026-09-29T12:00'));
    expect(list.map((e) => e.builderDemo?.presenter)).toEqual(['Tommy Volk', 'Lee Winbush', 'Kyle', 'Lonnie Lassman']);
    expect(list.map((e) => e.slug)).toEqual(['2026-09-23', '2026-08-26', '2026-07-20', '2026-06-09']);
  });
});
