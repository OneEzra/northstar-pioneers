import { finalizeEvent } from 'nostr-tools';
import {
  configErrorResponse,
  json,
  organizerPubkey,
  readJsonPost,
  sessionEmail,
  signingKey,
} from '../lib/auth.ts';

// Only the records the admin page creates. Mirrors src/lib/nspNostr.ts.
const KIND_CALENDAR_EVENT = 31923;
const KIND_CALENDAR = 31924;
const CALENDAR_D = 'northstar-pioneers-meetups';
const SLUG_PATTERN = /^\d{4}-\d{2}-\d{2}(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?$/;

const MAX_RECORDS = 20;
const MAX_CONTENT = 20_000;
const MAX_TAGS = 80;
const MAX_TAG_VALUE = 8_000;
const MAX_CLOCK_DRIFT = 24 * 60 * 60;

interface Template {
  kind: number;
  content: string;
  tags: string[][];
  created_at: number;
}

/** Returns the problem with a record, or null when it's fine to sign. */
function problem(t: unknown, now: number): string | null {
  if (!t || typeof t !== 'object') return 'Invalid record.';
  const { kind, content, tags, created_at } = t as Partial<Template>;

  if (kind !== KIND_CALENDAR_EVENT && kind !== KIND_CALENDAR) return 'This kind of record cannot be saved here.';
  if (typeof content !== 'string' || content.length > MAX_CONTENT) return 'Record content is too long.';
  if (!Number.isInteger(created_at) || Math.abs((created_at as number) - now) > MAX_CLOCK_DRIFT) {
    return 'Record timestamp is off. Check your device clock.';
  }
  if (!Array.isArray(tags) || tags.length > MAX_TAGS) return 'Record has too many tags.';
  for (const tag of tags) {
    if (!Array.isArray(tag) || tag.length === 0 || tag.length > 10) return 'Invalid tag.';
    if (!tag.every((v) => typeof v === 'string' && v.length <= MAX_TAG_VALUE)) return 'Invalid tag value.';
  }

  const d = tags.find(([name]) => name === 'd')?.[1] ?? '';
  if (kind === KIND_CALENDAR_EVENT && !SLUG_PATTERN.test(d)) return 'Invalid event ID.';
  if (kind === KIND_CALENDAR && d !== CALENDAR_D) return 'Invalid calendar ID.';
  return null;
}

/** POST { records } — signs event records with the organizer key for a signed-in organizer. */
export default async (req: Request): Promise<Response> => {
  const parsed = await readJsonPost(req);
  if ('error' in parsed) return parsed.error;

  try {
    const email = sessionEmail(req);
    if (!email) return json({ error: 'Sign in first.' }, 401);

    const records = parsed.body.records;
    if (!Array.isArray(records) || records.length === 0 || records.length > MAX_RECORDS) {
      return json({ error: 'Invalid request.' }, 400);
    }
    const now = Math.floor(Date.now() / 1000);
    for (const r of records) {
      const issue = problem(r, now);
      if (issue) return json({ error: issue }, 400);
    }

    const key = signingKey();
    const events = (records as Template[]).map(({ kind, content, tags, created_at }) =>
      finalizeEvent({ kind, content, tags, created_at }, key),
    );
    console.log(`[sign] ${email} signed ${events.map((e) => `${e.kind}:${e.tags.find(([n]) => n === 'd')?.[1]}`).join(', ')}`);
    return json({ pubkey: organizerPubkey(), events });
  } catch (err) {
    return configErrorResponse(err);
  }
};
