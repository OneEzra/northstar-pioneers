import { Link, useLocation } from 'react-router-dom';
import { Presentation } from 'lucide-react';
import { enterFullscreen } from '@/lib/presentation';
import { cn } from '@/lib/utils';

/** Small "Present" link that opens an event's topics as full-screen slides. */
export function PresentLink({ slug, className }: { slug: string; className?: string }) {
  const location = useLocation();
  return (
    <Link
      to={`/events/${slug}/present`}
      state={{ from: `${location.pathname}${location.search}` }}
      onClick={enterFullscreen}
      className={cn(
        'inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-[#1E8EFF] transition-colors',
        className,
      )}
      title="Show these topics as full-screen slides"
    >
      <Presentation className="size-3.5" />
      Presentation mode
    </Link>
  );
}
