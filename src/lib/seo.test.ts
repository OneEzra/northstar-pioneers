import { describe, expect, test } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import { events, resolveEvent, type MeetupEventInput } from '@/data/events';
import { eventJsonLd, postalAddress } from './seo';

const publicFile = (name: string) => fs.readFileSync(path.resolve(__dirname, '../../public', name), 'utf8');

const base: MeetupEventInput = {
  slug: '2026-10-27',
  title: 'October 2026 Meetup',
  date: '2026-10-27T17:30',
  venue: 'Nerdery',
  address: '7700 France Ave S, Edina, MN',
  city: 'Edina',
  meetupUrl: 'https://www.meetup.com/northstar-pioneers/events/316723462/',
  summary: 'Our monthly gathering.',
  topics: [{ title: 'Local-first health data', description: 'd' }],
  builderDemo: { title: 'DecentHealth', presenter: 'Robert Phillips', description: 'd', presenterUrl: 'https://decenthealth.io' },
};

describe('structured data', () => {
  test('splits a street address', () => {
    expect(postalAddress('7700 France Ave S, Edina, MN')).toMatchObject({
      streetAddress: '7700 France Ave S', addressLocality: 'Edina', addressRegion: 'MN', addressCountry: 'US',
    });
  });

  test('builds a Google-ready Event', () => {
    const ld = eventJsonLd(resolveEvent(base));
    expect(ld).toMatchObject({
      '@type': 'Event',
      url: 'https://northstarpioneers.com/events/2026-10-27',
      startDate: '2026-10-27T22:30:00.000Z',
      endDate: '2026-10-28T00:30:00.000Z',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: 'Nerdery' },
      offers: { price: 0, url: base.meetupUrl },
      performer: { name: 'Robert Phillips', url: 'https://decenthealth.io' },
    });
    expect(String(ld.description)).toContain('Featured pioneer: Robert Phillips — DecentHealth.');
  });

  test('marks cancelled events', () => {
    expect(eventJsonLd(resolveEvent({ ...base, state: 'cancelled' })).eventStatus).toBe('https://schema.org/EventCancelled');
  });
});

describe('crawler files', () => {
  test('sitemap lists every page and every built-in event', () => {
    const xml = publicFile('sitemap.xml');
    for (const p of ['/', '/events', '/pioneers', '/about']) {
      expect(xml).toContain(`<loc>https://northstarpioneers.com${p}</loc>`);
    }
    for (const e of events) {
      expect(xml, `add /events/${e.slug} to public/sitemap.xml`).toContain(`<loc>https://northstarpioneers.com/events/${e.slug}</loc>`);
    }
  });

  test('robots.txt points at the sitemap', () => {
    expect(publicFile('robots.txt')).toContain('Sitemap: https://northstarpioneers.com/sitemap.xml');
  });

  test('index.html structured data is valid JSON', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');
    const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    const data = JSON.parse(json ?? '');
    expect(data['@graph'][0]).toMatchObject({ '@type': 'Organization', name: 'Northstar Pioneers' });
  });
});
