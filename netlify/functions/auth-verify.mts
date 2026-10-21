import {
  checkCode,
  configErrorResponse,
  createSessionCookie,
  isSecureRequest,
  json,
  normalizeEmail,
  organizerPubkey,
  readJsonPost,
} from '../lib/auth.ts';

/** POST { email, code } — trades a valid code for a session cookie. */
export default async (req: Request): Promise<Response> => {
  const parsed = await readJsonPost(req);
  if ('error' in parsed) return parsed.error;

  try {
    const email = normalizeEmail(parsed.body.email);
    const code = typeof parsed.body.code === 'string' ? parsed.body.code.trim() : '';
    if (!(await checkCode(email, code))) {
      return json({ error: 'That code is wrong or has expired.' }, 401);
    }
    return json({ email, pubkey: organizerPubkey() }, 200, {
      'set-cookie': createSessionCookie(email, isSecureRequest(req)),
    });
  } catch (err) {
    return configErrorResponse(err);
  }
};
