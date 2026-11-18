import { configErrorResponse, json, sameOrigin, sessionEmail } from '../lib/auth.ts';
import { MAX_UPLOAD_BYTES, detectFileKind, fileKey, saveFile } from '../lib/files.ts';

/** POST (file bytes as the body, ?name=original-file-name) — hosts a file for a signed-in organizer and returns its link. */
export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!sameOrigin(req)) return json({ error: 'Forbidden' }, 403);

  try {
    if (!sessionEmail(req)) return json({ error: 'Sign in with email to upload files.' }, 401);

    const declared = Number(req.headers.get('content-length') ?? 0);
    if (declared > MAX_UPLOAD_BYTES) return json({ error: 'That file is too large (5 MB limit).' }, 413);

    const bytes = new Uint8Array(await req.arrayBuffer());
    if (bytes.length === 0) return json({ error: 'That file is empty.' }, 400);
    if (bytes.length > MAX_UPLOAD_BYTES) return json({ error: 'That file is too large (5 MB limit).' }, 413);

    const url = new URL(req.url);
    const name = url.searchParams.get('name')?.slice(0, 200) ?? 'file';
    const kind = detectFileKind(bytes, name);
    if (!kind) {
      return json({ error: 'Only PDF, PowerPoint (.pptx), PNG, JPEG and GIF files can be uploaded.' }, 415);
    }

    const key = fileKey(bytes, name, kind);
    await saveFile(key, bytes, kind.contentType);
    console.log(`[upload] ${sessionEmail(req)} uploaded ${key} (${bytes.length} bytes)`);
    return json({ url: `https://${url.host}/files/${key}` });
  } catch (err) {
    return configErrorResponse(err);
  }
};
