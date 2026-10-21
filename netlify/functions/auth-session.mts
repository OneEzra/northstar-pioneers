import { configErrorResponse, json, organizerPubkey, sessionEmail } from '../lib/auth.ts';

/** GET — who is signed in (if anyone) and which organizer account their saves are made under. */
export default async (req: Request): Promise<Response> => {
  try {
    const email = sessionEmail(req);
    if (!email) return json({ email: null });
    return json({ email, pubkey: organizerPubkey() });
  } catch (err) {
    return configErrorResponse(err);
  }
};
