import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { QRCodeCanvas } from '@/components/ui/qrcode';

interface ShareEventButtonProps {
  slug: string;
  title: string;
  className?: string;
}

export function ShareEventButton({ slug, title, className = '' }: ShareEventButtonProps) {
  const [copied, setCopied] = useState(false);
  const url = `https://northstarpioneers.com/events/${slug}`;
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy link:', url);
    }
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // user cancelled
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          title={`Share ${title}`}
          className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-[#1E8EFF] transition-colors ${className}`}
        >
          <Share2 size={13} strokeWidth={2.5} aria-hidden="true" />
          Share
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader className="items-center text-center sm:text-center">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Scan with your phone's camera to open this event.</DialogDescription>
        </DialogHeader>
        <div className="mx-auto rounded-xl bg-white p-3 shadow-sm ring-1 ring-border" style={{ lineHeight: 0 }}>
          <QRCodeCanvas value={url} size={240} level="M" />
        </div>
        <p className="break-all text-xs text-muted-foreground">{url.replace('https://', '')}</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={handleCopy}>
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            {copied ? 'Copied!' : 'Copy link'}
          </Button>
          {canNativeShare && (
            <Button variant="outline" onClick={handleNativeShare}>
              <Share2 aria-hidden="true" />
              Share via…
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
