// Shared helpers for the organizer email sign-in functions.
//
// Flow: an allowed email asks for a 6-digit code, enters it, and gets a
// signed session cookie. The sign function then signs event records with
// the organizer Nostr key kept in NSP_SIGNING_KEY, so organizers never
// handle a private key themselves.
//
// Environment variables (set in Netlify, never committed):
//   NSP_SIGNING_KEY       organizer Nostr private key (nsec1... or 64-char hex)
//   NSP_ADMIN_EMAILS      comma-separated emails allowed to sign in
//   POSTMARK_SERVER_TOKEN Postmark server token used to email the codes
//   NSP_LOGIN_FROM        optional sender, e.g. Name <address> (default: Key for Northstar Pioneers <keys@northstarpioneers.com>)

import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { getPublicKey, nip19 } from 'nostr-tools';

export const SESSION_COOKIE = 'nsp_session';
export const SESSION_SECONDS = 14 * 24 * 60 * 60;
export const CODE_SECONDS = 10 * 60;
const MAX_CODE_ATTEMPTS = 5;
const MIN_SECONDS_BETWEEN_CODES = 30;
const MAX_CODES_PER_HOUR = 5;

/** The local dev server sets this so codes print to its log instead of being emailed. */
const isDev = () => process.env.NSP_DEV_AUTH === '1';

export class ConfigError extends Error {}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  });
}

// --- Configuration ------------------------------------------------

export const normalizeEmail = (value: unknown): string =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

export function adminEmails(): string[] {
  return (process.env.NSP_ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export const isAdminEmail = (email: string): boolean => !!email && adminEmails().includes(email);

export function signingKey(): Uint8Array {
  const raw = (process.env.NSP_SIGNING_KEY ?? '').trim();
  if (!raw) throw new ConfigError('Sign-in is not set up yet (missing signing key).');
  if (/^[0-9a-f]{64}$/i.test(raw)) return Uint8Array.from(Buffer.from(raw, 'hex'));
  try {
    const decoded = nip19.decode(raw);
    if (decoded.type === 'nsec') return decoded.data;
  } catch {
    // fall through
  }
  throw new ConfigError('The signing key is not a valid nsec or hex key.');
}

export const organizerPubkey = (): string => getPublicKey(signingKey());

/** Secret for codes and sessions, derived from the signing key so there's one fewer thing to configure. */
const secret = (): Buffer => createHmac('sha256', signingKey()).update('nsp-session-v1').digest();

const hmac = (value: string): string => createHmac('sha256', secret()).update(value).digest('base64url');

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// --- Storage (Netlify Blobs in production, memory in local dev) ----

interface Store {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
}

const memory = new Map<string, unknown>();

function store(): Store {
  if (isDev()) {
    return {
      get: async (key) => memory.get(key) ?? null,
      set: async (key, value) => void memory.set(key, value),
      delete: async (key) => void memory.delete(key),
    };
  }
  const blobs = getStore({ name: 'nsp-auth', consistency: 'strong' });
  return {
    get: (key) => blobs.get(key, { type: 'json' }),
    set: async (key, value) => void (await blobs.setJSON(key, value)),
    delete: (key) => blobs.delete(key),
  };
}

// --- Sign-in codes -------------------------------------------------

interface CodeRecord {
  hash: string;
  exp: number;
  attempts: number;
  sentAt: number;
}

interface SendCounter {
  count: number;
  windowStart: number;
}

const now = () => Math.floor(Date.now() / 1000);

/**
 * Create and email a code for an allowed address. Quietly does nothing when
 * the address isn't allowed or asked too recently, so the response never
 * reveals who the organizers are.
 */
export async function requestCode(email: string): Promise<void> {
  if (!isAdminEmail(email)) return;
  const db = store();
  const t = now();

  const existing = (await db.get(`code:${email}`)) as CodeRecord | null;
  if (existing && t - existing.sentAt < MIN_SECONDS_BETWEEN_CODES) return;

  const counter = ((await db.get(`sends:${email}`)) as SendCounter | null) ?? { count: 0, windowStart: t };
  const fresh = t - counter.windowStart >= 3600;
  const next: SendCounter = fresh ? { count: 1, windowStart: t } : { count: counter.count + 1, windowStart: counter.windowStart };
  if (next.count > MAX_CODES_PER_HOUR) return;

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  await db.set(`code:${email}`, { hash: hmac(`${email}:${code}`), exp: t + CODE_SECONDS, attempts: 0, sentAt: t } satisfies CodeRecord);
  await db.set(`sends:${email}`, next);
  await sendCodeEmail(email, code);
}

/** True when the code is right, unexpired and unused. Each code works once. */
export async function checkCode(email: string, code: string): Promise<boolean> {
  if (!isAdminEmail(email) || !/^\d{6}$/.test(code)) return false;
  const db = store();
  const record = (await db.get(`code:${email}`)) as CodeRecord | null;
  if (!record || record.exp < now()) return false;

  if (record.attempts >= MAX_CODE_ATTEMPTS) {
    await db.delete(`code:${email}`);
    return false;
  }
  if (!safeEqual(record.hash, hmac(`${email}:${code}`))) {
    await db.set(`code:${email}`, { ...record, attempts: record.attempts + 1 });
    return false;
  }
  await db.delete(`code:${email}`);
  return true;
}

async function sendCodeEmail(email: string, code: string): Promise<void> {
  const token = process.env.POSTMARK_SERVER_TOKEN;
  if (!token) {
    if (isDev()) {
      console.log(`\n[dev] Sign-in code for ${email}: ${code}\n`);
      return;
    }
    throw new ConfigError('Sign-in email is not set up yet (missing Postmark token).');
  }

  const minutes = CODE_SECONDS / 60;
  const res = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-postmark-server-token': token,
    },
    body: JSON.stringify({
      From: process.env.NSP_LOGIN_FROM ?? 'Key for Northstar Pioneers <keys@northstarpioneers.com>',
      To: email,
      Subject: `Your Northstar Pioneers sign-in code: ${code}`,
      TextBody: `Your sign-in code is ${code}\n\nIt works once and expires in ${minutes} minutes. If you didn't ask for it, you can ignore this email.\n`,
      HtmlBody: `<p>Your Northstar Pioneers sign-in code is</p><p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p><p>It works once and expires in ${minutes} minutes. If you didn't ask for it, you can ignore this email.</p>`,
      MessageStream: 'outbound',
    }),
  });
  if (!res.ok) {
    console.error('Postmark rejected the sign-in email:', res.status, await res.text());
    throw new Error('Could not send the sign-in email.');
  }
}

// --- Sessions ------------------------------------------------------

export function createSessionCookie(email: string, secure: boolean): string {
  const payload = Buffer.from(JSON.stringify({ e: email, x: now() + SESSION_SECONDS })).toString('base64url');
  const value = `${payload}.${hmac(payload)}`;
  return `${SESSION_COOKIE}=${value}; Path=/; Max-Age=${SESSION_SECONDS}; HttpOnly; SameSite=Strict${secure ? '; Secure' : ''}`;
}

export const clearSessionCookie = (secure: boolean): string =>
  `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict${secure ? '; Secure' : ''}`;

/** The signed-in organizer's email, or null. Re-checks the allow list so removing an email ends its sessions. */
export function sessionEmail(req: Request): string | null {
  const cookie = req.headers.get('cookie') ?? '';
  const value = cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  if (!value) return null;

  const [payload, sig] = value.split('.');
  if (!payload || !sig || !safeEqual(sig, hmac(payload))) return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { e: string; x: number };
    return x > now() && isAdminEmail(e) ? e : null;
  } catch {
    return null;
  }
}

export const isSecureRequest = (req: Request): boolean => new URL(req.url).protocol === 'https:';

/** Rejects cross-site POSTs. The cookie is SameSite=Strict too; this is a second layer. */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  return !origin || new URL(origin).host === new URL(req.url).host;
}

/** Shared guard for the POST endpoints: checks method and origin, and parses the JSON body. */
export async function readJsonPost(req: Request): Promise<{ body: Record<string, unknown> } | { error: Response }> {
  if (req.method !== 'POST') return { error: json({ error: 'Method not allowed' }, 405) };
  if (!sameOrigin(req)) return { error: json({ error: 'Forbidden' }, 403) };
  try {
    const body = (await req.json()) as unknown;
    if (body && typeof body === 'object') return { body: body as Record<string, unknown> };
  } catch {
    // fall through
  }
  return { error: json({ error: 'Invalid request' }, 400) };
}

export function configErrorResponse(err: unknown): Response {
  if (err instanceof ConfigError) return json({ error: err.message }, 500);
  console.error(err);
  return json({ error: err instanceof Error ? err.message : 'Something went wrong.' }, 500);
}
