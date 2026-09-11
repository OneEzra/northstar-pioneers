import { useState } from 'react';

interface ShareEventButtonProps {
  slug: string;
  title: string;
  /** Extra classes for the outer element */
  className?: string;
}

/**
 * Copies the event's direct URL to the clipboard (falls back to Web Share API
 * on mobile). Shows a brief "Copied!" confirmation.
 */
export function ShareEventButton({ slug, title, className = '' }: ShareEventButtonProps) {
  const [copied, setCopied] = useState(false);

  const url = `https://northstarpioneers.com/events/${slug}`;

  async function handleShare() {
    // Try native share sheet first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or not supported — fall through to clipboard
      }
    }
    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort: prompt
      window.prompt('Copy link:', url);
    }
  }

  return (
    <button
      onClick={handleShare}
      title={`Share ${title}`}
      className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-[#1E8EFF] transition-colors ${className}`}
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}
