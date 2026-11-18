import { Share2 } from 'lucide-react';
import { ShareLinkDialog } from '@/components/ShareLinkDialog';

interface ShareEventButtonProps {
  slug: string;
  title: string;
  className?: string;
}

export function ShareEventButton({ slug, title, className = '' }: ShareEventButtonProps) {
  return (
    <ShareLinkDialog
      url={`https://northstarpioneers.com/events/${slug}`}
      title={title}
      description="Scan with your phone's camera to open this event."
    >
      <button
        title={`Share ${title}`}
        className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-[#1E8EFF] transition-colors ${className}`}
      >
        <Share2 size={13} strokeWidth={2.5} aria-hidden="true" />
        Share
      </button>
    </ShareLinkDialog>
  );
}
