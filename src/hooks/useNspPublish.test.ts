import { describe, expect, test } from 'vitest';
import type { NostrEvent } from '@nostrify/nostrify';
import { nextCreatedAt } from './useNspPublish';

const ev = (d: string, created_at: number, kind = 31923): NostrEvent =>
  ({ id: d + created_at, pubkey: 'p', sig: 's', content: '', kind, created_at, tags: [['d', d]] });
const oct = { kind: 31923, content: '', tags: [['d', '2026-10-27']] };

describe('save timestamps', () => {
  test('uses now when nothing newer is known', () => {
    expect(nextCreatedAt(oct, [ev('2026-10-27', 100)], 500)).toBe(500);
  });
  test('an edit right after "Publish to Nostr" beats the published version', () => {
    // The batch publish gave October a timestamp a few seconds in the future
    expect(nextCreatedAt(oct, [ev('2026-10-27', 503), ev('2026-11-17', 509)], 500)).toBe(504);
  });
  test('only compares the same record', () => {
    expect(nextCreatedAt(oct, [ev('2026-11-17', 900), ev('2026-10-27', 900, 30078)], 500)).toBe(500);
  });
});
