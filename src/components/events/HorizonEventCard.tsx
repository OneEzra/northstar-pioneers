import { ShareEventButton } from '@/components/ShareEventButton';
import { formatEventDate, formatEventDateShort, type MeetupEvent } from '@/data/events';

/**
 * A compact card for meetups after the next one ("On the Horizon").
 * Shared by the Home and Events pages.
 */
export function HorizonEventCard({ event }: { event: MeetupEvent }) {
  return (
    <div className="card-accent px-7 py-5 flex flex-col gap-3">
      {/* Row 1: title + pill */}
      <div className="flex items-center justify-between gap-3">
        <h3
          className="text-lg font-extrabold text-foreground leading-tight"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {event.title}
        </h3>
        <span className="tag-pill text-[10px]">
          {event.city
            ? `${formatEventDateShort(event.date)} · ${event.city}`
            : 'TBD'}
        </span>
      </div>
      {/* Row 2: metadata + button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          <span><span className="font-bold uppercase tracking-wider text-foreground/60">Date</span> — {formatEventDate(event.date)}</span>
          <span><span className="font-bold uppercase tracking-wider text-foreground/60">Venue</span> — {event.venue}</span>
          <span><span className="font-bold uppercase tracking-wider text-foreground/60">Pioneer</span> — {event.builderDemo?.presenter ?? 'TBD'}</span>
          <span><span className="font-bold uppercase tracking-wider text-foreground/60">Topics</span> — {event.topics.length > 0 ? `${event.topics.length} selected` : 'TBD'}</span>
        </div>
        <div className="flex items-center gap-4 shrink-0 self-start sm:self-auto">
          <ShareEventButton slug={event.slug} title={event.title} />
          <a
            href="https://t.me/northstarpioneerscommunity"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground border border-border font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-[2px] hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            Pioneers Telegram ↗
          </a>
        </div>
      </div>
    </div>
  );
}
