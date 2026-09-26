import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import type { NostrEvent } from '@nostrify/nostrify';

const COFOUNDER = 'c0'.repeat(32);
const STRANGER = 'ee'.repeat(32);

let mod: typeof import('./nspNostr');
let events: typeof import('@/data/events');

beforeAll(async () => {
  vi.stubEnv('VITE_NSP_EXTRA_ADMIN_PUBKEYS', COFOUNDER);
  vi.resetModules();
  mod = await import('./nspNostr');
  events = await import('@/data/events');
});
afterAll(() => vi.unstubAllEnvs());

let n = 0;
const sign = (t: { kind: number; content: string; tags: string[][] }, pubkey: string, created_at: number): NostrEvent => ({
  ...t, pubkey, created_at, id: (++n).toString(16).padStart(64, '0'), sig: '0'.repeat(128),
});

const oct = {
  slug: '2026-10-27', title: 'October 2026 Meetup', date: '2026-10-27T17:30',
  venue: 'Nerdery', address: '7700 France Ave S, Edina, MN', summary: 'S',
};

describe('multiple admins', () => {
  test('the organizer and the co-organizer are both admins; a stranger is not', () => {
    expect(mod.NSP_ADMIN_PUBKEYS[0]).toBe(mod.NSP_ADMIN_PUBKEY);
    expect(mod.NSP_ADMIN_PUBKEYS).toContain(COFOUNDER);
    expect(mod.isNspAdmin(COFOUNDER)).toBe(true);
    expect(mod.isNspAdmin(STRANGER)).toBe(false);
  });

  test('a co-organizer edit made later wins over the organizer version', () => {
    const mine = sign(mod.buildCalendarEvent({ ...oct, title: 'Organizer title' }), mod.NSP_ADMIN_PUBKEY, 100);
    const theirs = sign(mod.buildCalendarEvent({ ...oct, title: 'Co-organizer title' }, COFOUNDER), COFOUNDER, 200);
    const merged = mod.mergeEvents(events.events, [mine, theirs]);
    const e = merged.find((x) => x.slug === '2026-10-27')!;
    expect(e.title).toBe('Co-organizer title');
    expect(e.author).toBe(COFOUNDER);
  });

  test('a co-organizer can cancel an event the organizer created', () => {
    const created = sign(mod.buildCalendarEvent(oct), mod.NSP_ADMIN_PUBKEY, 100);
    const cancelled = sign(mod.buildCalendarEvent({ ...oct, state: 'cancelled' }, COFOUNDER), COFOUNDER, 300);
    const e = mod.mergeEvents(events.events, [created, cancelled]).find((x) => x.slug === '2026-10-27')!;
    expect(e.state).toBe('cancelled');
  });

  test('records from a stranger are ignored, even if newer', () => {
    // A Nostr-only event (not in the backup file), so the backup can't mask a bug
    const dec = { ...oct, slug: '2026-12-15', title: 'December Meetup', date: '2026-12-15T17:30' };
    const real = sign(mod.buildCalendarEvent(dec), mod.NSP_ADMIN_PUBKEY, 100);
    const fake = sign(mod.buildCalendarEvent({ ...dec, title: 'HACKED', state: 'cancelled' }), STRANGER, 999);
    const e = mod.mergeEvents(events.events, [real, fake]).find((x) => x.slug === '2026-12-15');
    expect(e?.title).toBe('December Meetup');
    expect(e?.state).toBe('active');
  });
});

test("Ezra's personal account is a configured admin", async () => {
  const { nip19 } = await import('nostr-tools');
  const hex = nip19.decode('npub1qpudfjck2f2jgad6v8ky88x4psmu8gay8xznmqcd0jwn8zpx4h3qrxqkv4').data as string;
  expect(mod.isNspAdmin(hex)).toBe(true);
});
