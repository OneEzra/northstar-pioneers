import type { NostrEvent } from '@nostrify/nostrify';

import type { EventTemplate } from '@/lib/nspNostr';

const FUNCTIONS = '/.netlify/functions';

export interface EmailSession {
  email: string;
  /** Organizer Nostr account the server saves under */
  pubkey: string;
}

async function call<T>(name: string, init?: { body?: unknown }): Promise<T> {
  const res = await fetch(`${FUNCTIONS}/${name}`, {
    method: init ? 'POST' : 'GET',
    headers: init ? { 'content-type': 'application/json' } : undefined,
    body: init ? JSON.stringify(init.body ?? {}) : undefined,
  });
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // not JSON (e.g. the site is running without its functions)
  }
  if (!res.ok) {
    const message = (data as { error?: string } | null)?.error;
    throw new Error(message ?? 'Sign-in is not available right now.');
  }
  return data as T;
}

/** The signed-in organizer for this browser, or null. Never throws: no functions means no session. */
export async function fetchEmailSession(): Promise<EmailSession | null> {
  try {
    const data = await call<{ email: string | null; pubkey?: string }>('auth-session');
    return data.email && data.pubkey ? { email: data.email, pubkey: data.pubkey } : null;
  } catch {
    return null;
  }
}

export const requestSignInCode = (email: string) => call<{ ok: true }>('auth-request', { body: { email } });

export const verifySignInCode = (email: string, code: string) =>
  call<EmailSession>('auth-verify', { body: { email, code } });

export const signOutOfEmailSession = () => call<{ ok: true }>('auth-logout', { body: {} });

/** Files organizers can upload. Mirrors the allow list in netlify/lib/files.ts, which checks file contents too. */
export const UPLOAD_ACCEPT = '.pdf,.pptx,.png,.jpg,.jpeg,.gif';
export const IMAGE_ACCEPT = '.png,.jpg,.jpeg,.gif';
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const UPLOAD_EXTENSIONS = /\.(pdf|pptx|png|jpe?g|gif)$/i;

/** Host a file on our own site. Returns the https link to it. */
export async function uploadHostedFile(file: File): Promise<string> {
  if (!UPLOAD_EXTENSIONS.test(file.name)) {
    throw new Error('Only PDF, PowerPoint (.pptx), PNG, JPEG and GIF files can be uploaded.');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('That file is over the 5 MB limit. Link to it instead (Google Drive, Dropbox, …).');
  }
  const res = await fetch(`${FUNCTIONS}/upload?name=${encodeURIComponent(file.name)}`, {
    method: 'POST',
    headers: { 'content-type': file.type || 'application/octet-stream' },
    body: file,
  });
  let data: { url?: string; error?: string } | null = null;
  try {
    data = await res.json();
  } catch {
    // not JSON
  }
  if (!res.ok || !data?.url) throw new Error(data?.error ?? 'The upload failed. Try again.');
  return data.url;
}

export type StampedTemplate = EventTemplate & { created_at: number };

/** Have the server sign records with the organizer key. */
export async function signOnServer(records: StampedTemplate[]): Promise<NostrEvent[]> {
  const data = await call<{ events: NostrEvent[] }>('sign', { body: { records } });
  return data.events;
}
