import { configErrorResponse, json, normalizeEmail, readJsonPost, requestCode } from '../lib/auth.ts';

/** POST { email } — emails a sign-in code if the address is an organizer. Always answers the same way. */
export default async (req: Request): Promise<Response> => {
  const parsed = await readJsonPost(req);
  if ('error' in parsed) return parsed.error;

  try {
    await requestCode(normalizeEmail(parsed.body.email));
    return json({ ok: true });
  } catch (err) {
    return configErrorResponse(err);
  }
};
