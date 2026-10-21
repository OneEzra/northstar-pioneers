import { clearSessionCookie, isSecureRequest, json, readJsonPost } from '../lib/auth.ts';

/** POST — ends the session in this browser. */
export default async (req: Request): Promise<Response> => {
  const parsed = await readJsonPost(req);
  if ('error' in parsed) return parsed.error;
  return json({ ok: true }, 200, { 'set-cookie': clearSessionCookie(isSecureRequest(req)) });
};
