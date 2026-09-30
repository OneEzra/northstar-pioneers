import { describe, expect, test } from 'vitest';
import { parseEventTime, resolveEvent, type MeetupEventInput } from '@/data/events';
import { MEETUP_GROUP_EVENTS_URL, isMeetupEventUrl, meetupLinkFor } from './meetup';

const base: MeetupEventInput = { slug: '2026-10-27', title: 'Oct', date: '2026-10-27T17:30', venue: 'V', address: 'A', summary: 'S', topics: [] };
const before = parseEventTime('2026-10-01T12:00');
const after = parseEventTime('2026-11-01T12:00');
const EVENT = 'https://www.meetup.com/northstar-pioneers/events/316723462/';

describe('Meetup links', () => {
  test('recognizes specific event pages only', () => {
    expect(isMeetupEventUrl(EVENT)).toBe(true);
    expect(isMeetupEventUrl('https://www.meetup.com/northstar-pioneers/')).toBe(false);
    expect(isMeetupEventUrl('https://www.meetup.com/northstar-pioneers/events/')).toBe(false);
    expect(isMeetupEventUrl('https://evil.example/northstar-pioneers/events/1/')).toBe(false);
  });

  test('upcoming with an event link: RSVP to that exact event', () => {
    expect(meetupLinkFor(resolveEvent({ ...base, meetupUrl: EVENT }, before))).toEqual({ url: EVENT, label: 'RSVP on Meetup', specific: true });
  });

  test('upcoming without one: RSVP goes to the group events page', () => {
    expect(meetupLinkFor(resolveEvent(base, before))).toMatchObject({ url: MEETUP_GROUP_EVENTS_URL, specific: false });
    expect(meetupLinkFor(resolveEvent({ ...base, meetupUrl: 'https://www.meetup.com/northstar-pioneers/' }, before))?.url).toBe(MEETUP_GROUP_EVENTS_URL);
  });

  test('past: "View on Meetup" only when there is an exact event link', () => {
    expect(meetupLinkFor(resolveEvent({ ...base, meetupUrl: EVENT }, after))?.label).toBe('View on Meetup');
    expect(meetupLinkFor(resolveEvent(base, after))).toBeNull();
  });

  test('cancelled events get no Meetup button', () => {
    expect(meetupLinkFor(resolveEvent({ ...base, meetupUrl: EVENT, state: 'cancelled' }, before))).toBeNull();
  });
});
