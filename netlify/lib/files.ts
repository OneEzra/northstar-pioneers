// Files organizers upload (slides, PDFs, images), stored in Netlify Blobs and
// served from our own domain at /files/<key>. Only a short allow list of file
// types is accepted, and each is checked by its contents, not just its name.

import { createHash } from 'node:crypto';
import { getStore } from '@netlify/blobs';

/** Mirrors MAX_UPLOAD_BYTES in src/lib/organizerApi.ts. Netlify functions accept request bodies up to about 6 MB. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export interface FileKind {
  ext: string;
  contentType: string;
  /** Slides and documents download; images and PDFs open in the browser */
  inline: boolean;
}

const startsWith = (bytes: Uint8Array, signature: number[]) => signature.every((b, i) => bytes[i] === b);
const ascii = (bytes: Uint8Array, from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));

/** What a file really is, judged by its first bytes, or null when it isn't an allowed type. */
export function detectFileKind(bytes: Uint8Array, fileName: string): FileKind | null {
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { ext: 'png', contentType: 'image/png', inline: true };
  }
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return { ext: 'jpg', contentType: 'image/jpeg', inline: true };
  if (ascii(bytes, 0, 6) === 'GIF87a' || ascii(bytes, 0, 6) === 'GIF89a') {
    return { ext: 'gif', contentType: 'image/gif', inline: true };
  }
  if (ascii(bytes, 0, 5) === '%PDF-') return { ext: 'pdf', contentType: 'application/pdf', inline: true };

  // PowerPoint (.pptx) is a zip archive that contains a ppt/ folder
  if (startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]) && /\.pptx$/i.test(fileName)) {
    const text = Buffer.from(bytes).toString('latin1');
    if (text.includes('[Content_Types].xml') && text.includes('ppt/')) {
      return {
        ext: 'pptx',
        contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        inline: false,
      };
    }
  }
  return null;
}

export const FILE_KEY_PATTERN = /^[a-f0-9]{16}-[a-z0-9][a-z0-9._-]{0,99}$/;

/** `<hash of contents>-<safe name>.<real extension>`: the same file always gets the same link. */
export function fileKey(bytes: Uint8Array, fileName: string, kind: FileKind): string {
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  const base =
    fileName
      .replace(/\.[^.]*$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'file';
  return `${hash}-${base}.${kind.ext}`;
}

interface StoredFile {
  data: ArrayBuffer;
  contentType: string;
}

const memory = new Map<string, StoredFile>();
const isDev = () => process.env.NSP_DEV_AUTH === '1';
const blobs = () => getStore({ name: 'nsp-files', consistency: 'strong' });

export async function saveFile(key: string, bytes: Uint8Array, contentType: string): Promise<void> {
  const data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  if (isDev()) {
    memory.set(key, { data, contentType });
    return;
  }
  await blobs().set(key, data, { metadata: { contentType } });
}

export async function loadFile(key: string): Promise<StoredFile | null> {
  if (isDev()) return memory.get(key) ?? null;
  const found = await blobs().getWithMetadata(key, { type: 'arrayBuffer' });
  if (!found) return null;
  return { data: found.data, contentType: String(found.metadata.contentType ?? 'application/octet-stream') };
}
