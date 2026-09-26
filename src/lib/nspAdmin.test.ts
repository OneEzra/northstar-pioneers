import { describe, expect, test } from 'vitest';

import { events as backup, getEventBySlug, resolveEvent } from '@/data/events';
import {
  buildCalendarList,
  cleanProgram,
  defaultTitle,
  eventToForm,
  formToCalendarFields,
  newEventForm,
  normalizeShortName,
  planReschedule,
  suggestSlug,
  takenSlugs,
  textToParagraphs,
  paragraphsToText,
  validateEventForm,
} from './nspAdmin';

describe('event IDs', () => {
  const taken = takenSlugs(backup);

  test('a free date is used as-is', () => {
    expect(suggestSlug('2026-12-15', taken)).toBe('2026-12-15');
  });

  test('a second event on a taken date gets -2 (never overwrites)', () => {
    expect(suggestSlug('2026-10-27', taken)).toBe('2026-10-27-2');
    expect(suggestSlug('2026-10-27', [...taken, '2026-10-27-2'])).toBe('2026-10-27-3');
  });

  test('a short name is used when given', () => {
    expect(suggestSlug('2026-10-27', taken, 'Lunch & Learn Workshop!')).toBe('2026-10-27-lunch-learn-workshop');
    expect(normalizeShortName('  AI Workshop ')).toBe('ai-workshop');
  });

  test('old month aliases count as taken', () => {
    expect(taken.has('2026-10')).toBe(true);
  });

  test('default titles', () => {
    expect(defaultTitle('2026-10-27')).toBe('October 2026 Meetup');
    expect(defaultTitle('2027-01-05')).toBe('January 2027 Meetup');
  });
});

describe('event form', () => {
  test('new events default to 5:30-7:30 at the Nerdery', () => {
    const f = newEventForm('2026-12-15', []);
    expect(f).toMatchObject({ slug: '2026-12-15', startTime: '17:30', endTime: '19:30', venue: 'Nerdery', title: 'December 2026 Meetup' });
    expect(validateEventForm(f)).toEqual({});
  });

  test('round-trips an existing event through the form in Central time', () => {
    const sept = getEventBySlug('2026-09-23')!;
    const f = eventToForm(sept);
    expect(f).toMatchObject({ day: '2026-09-23', startTime: '17:30', endTime: '19:30' });
    const fields = formToCalendarFields(f, sept);
    expect(fields.date).toBe('2026-09-23T17:30');
    expect(fields.aliases).toEqual(['2026-09']);
  });

  test('catches common mistakes', () => {
    const f = newEventForm('2026-12-15', []);
    expect(validateEventForm({ ...f, endTime: '17:00' }).endTime).toBeDefined();
    expect(validateEventForm({ ...f, meetupUrl: 'http://meetup.com' }).meetupUrl).toBeDefined();
    expect(validateEventForm({ ...f, slug: '2026-12-16' }).slug).toBeDefined();
    expect(validateEventForm({ ...f, slug: 'december' }).slug).toBeDefined();
  });
});

describe('program cleanup', () => {
  test('drops blanks and unsafe links', () => {
    const p = cleanProgram({
      topics: [
        { title: '  Real topic ', description: ' ', resources: [{ type: 'link', label: 'x', url: 'javascript:1' }, { type: 'link', label: 'ok', url: 'https://a.com' }] },
        { title: '   ' },
      ],
      builderDemo: { title: '', presenter: '  ', description: '' },
      attendees: 0,
    });
    expect(p.topics).toHaveLength(1);
    expect(p.topics[0]).toMatchObject({ title: 'Real topic', description: undefined });
    expect(p.topics[0].resources).toEqual([{ type: 'link', label: 'ok', url: 'https://a.com/' }]);
    expect(p.builderDemo).toBeUndefined();
    expect(p.attendees).toBeUndefined();
  });

  test('paragraph text', () => {
    expect(textToParagraphs('One.\n\n\nTwo\nstill two.\n\n')).toEqual(['One.', 'Two\nstill two.']);
    expect(paragraphsToText(['a', 'b'])).toBe('a\n\nb');
  });
});

describe('reschedule', () => {
  const taken = takenSlugs(backup);

  test('moves Oct 27 to Nov 3: new event, old one forwards', () => {
    const oct = getEventBySlug('2026-10-27')!;
    const plan = planReschedule(oct, '2026-11-03', '17:30', '19:30', taken);
    expect(plan.next).toMatchObject({ slug: '2026-11-03', title: 'November 2026 Meetup', date: '2026-11-03T17:30', state: 'active' });
    expect(plan.next.aliases).toBeUndefined();
    expect(plan.old).toMatchObject({ slug: '2026-10-27', state: 'rescheduled', rescheduledTo: '2026-11-03', aliases: ['2026-10'] });
  });

  test('keeps a custom title and a workshop short name', () => {
    const ws = resolveEvent({ slug: '2026-10-27-workshop', title: 'Agents Workshop', date: '2026-10-27T12:00', venue: 'V', address: 'A', summary: 'S', topics: [] });
    const plan = planReschedule(ws, '2026-10-28', '12:00', '14:00', taken);
    expect(plan.next.slug).toBe('2026-10-28-workshop');
    expect(plan.next.title).toBe('Agents Workshop');
  });

  test('moving onto a date that is already taken does not collide', () => {
    const oct = getEventBySlug('2026-10-27')!;
    expect(planReschedule(oct, '2026-11-17', '17:30', '19:30', taken).next.slug).toBe('2026-11-17-2');
  });
});

test('calendar list references every meetup', () => {
  const cal = buildCalendarList([{ slug: '2026-10-27' }, { slug: '2026-09-23' }, { slug: '2026-10-27' }]);
  expect(cal.kind).toBe(31924);
  expect(cal.tags.filter(([t]) => t === 'a')).toHaveLength(2);
});
