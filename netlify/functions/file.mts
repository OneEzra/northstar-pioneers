import { FILE_KEY_PATTERN, loadFile } from '../lib/files.ts';

/** GET ?k=<key> — serves an uploaded file. Reached as /files/<key> through a redirect in public/_redirects. */
export default async (req: Request): Promise<Response> => {
  const key = new URL(req.url).searchParams.get('k') ?? '';
  if (!FILE_KEY_PATTERN.test(key)) return new Response('Not found', { status: 404 });

  const file = await loadFile(key);
  if (!file) return new Response('Not found', { status: 404 });

  // The content type comes from our own allow list, never from the request. Files never run as pages.
  const inline = file.contentType.startsWith('image/') || file.contentType === 'application/pdf';
  const downloadName = key.slice(17);
  return new Response(file.data, {
    headers: {
      'content-type': file.contentType,
      'content-disposition': `${inline ? 'inline' : 'attachment'}; filename="${downloadName}"`,
      'x-content-type-options': 'nosniff',
      'cross-origin-resource-policy': 'cross-origin',
      // Content-addressed: a changed file gets a new link, so this one never changes.
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};
