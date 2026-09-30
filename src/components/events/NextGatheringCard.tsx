import { useState } from 'react';
import { ShareEventButton } from '@/components/ShareEventButton';
import { getVenueSponsor } from '@/data/venues';
import { meetupLinkFor } from '@/lib/meetup';
import { Skeleton } from '@/components/ui/skeleton';
import { formatEventDate, formatEventDateShort, type MeetupEvent } from '@/data/events';

/**
 * The spotlight card for the next meetup. Used on both the Home page
 * ("Next Gathering") and the Events page ("Upcoming") so they never drift.
 */
export function NextGatheringCard({ event, loading = false }: { event: MeetupEvent; loading?: boolean }) {
  const [topicsOpen, setTopicsOpen] = useState(false);
  const sponsor = getVenueSponsor(event.venue);
  const rsvp = meetupLinkFor(event);

  return (
    <div className="card-accent p-0 overflow-hidden">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-8 py-6 border-b border-border">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#5AB0FF] mb-1">
            Upcoming
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {event.title}
          </h2>
        </div>
        <span className="tag-pill self-start sm:self-auto">
          {formatEventDateShort(event.date)} · {event.city ?? 'Mpls'}
        </span>
      </div>

      {/* Date / Time / Venue */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="px-8 py-6">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Date
          </div>
          <div className="text-foreground font-semibold">
            {formatEventDate(event.date)}
          </div>
        </div>
        <div className="px-8 py-6">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Time
          </div>
          <div className="text-foreground font-semibold">{event.time}</div>
        </div>
        <div className="px-8 py-6">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Venue Sponsor
          </div>
          <div className="text-foreground font-semibold">{event.venue}</div>
          <div className="text-sm text-muted-foreground mt-0.5">
            {event.address}
          </div>
        </div>
      </div>

      {/* Venue Sponsor Bio */}
      {sponsor && (
        <div className="px-8 py-6 border-t border-border">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            About the Venue Sponsor
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {sponsor.about}{' '}
            <a
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1E8EFF] hover:underline"
            >
              {sponsor.urlLabel} ↗
            </a>
          </p>
        </div>
      )}

      {/* Featured Pioneer + Topics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border border-t border-border">
        <div className="px-8 py-6">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Featured Pioneer
          </div>
          {event.builderDemo ? (
            <a
              href={event.builderDemo.presenterUrl ?? event.builderDemo.presenterLinkedIn ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-semibold hover:text-[#1E8EFF] transition-colors"
            >
              {event.builderDemo.presenter} ↗
            </a>
          ) : (
            loading ? <Skeleton className="h-5 w-40" /> : <span className="text-sm text-muted-foreground">TBD</span>
          )}
        </div>
        <div className="px-8 py-6">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Socratic Topics
          </div>
          {event.topics.length > 0 ? (
            <button
              onClick={() => setTopicsOpen((o) => !o)}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-[#1E8EFF]/40 text-[#1E8EFF] px-4 py-2 rounded-[2px] hover:bg-[#1E8EFF]/10 transition-colors"
            >
              {topicsOpen ? 'Hide Topics ↑' : 'View Topics ↓'}
            </button>
          ) : (
            loading ? <Skeleton className="h-5 w-32" /> : <span className="text-sm text-muted-foreground">Topics coming soon</span>
          )}
        </div>
      </div>

      {/* Topics panel */}
      {topicsOpen && event.topics.length > 0 && (
        <div className="px-8 py-6 border-t border-border">
          <div className="pioneer-label mb-4">Socratic Review Topics</div>
          <div className="space-y-4">
            {event.topics.map((topic, i) => (
              <div key={topic.title} className="card-accent p-6">
                <div className="flex items-start gap-4">
                  <div className="text-[#1E8EFF] font-mono text-sm font-bold shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-foreground mb-2">{topic.title}</h3>
                    {topic.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {topic.description}
                      </p>
                    )}
                    {topic.resources && topic.resources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {topic.resources.map((r) => (
                          <a
                            key={r.url}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#5AB0FF] hover:text-[#1E8EFF] transition-colors bg-[rgba(30,142,255,0.08)] border border-[rgba(30,142,255,0.25)] px-4 py-2 rounded-[2px] hover:bg-[rgba(30,142,255,0.14)]"
                          >
                            <span>🔗</span>
                            {r.label}
                            <span className="text-xs opacity-60">↗</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Format */}
      <div className="px-8 py-6 border-t border-border">
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Format
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '🍕', label: 'Welcome', desc: 'Connect & grab a slice' },
            { icon: '🗞️', label: 'Socratic Review', desc: '5–10 frontier topics' },
            { icon: '🛠️', label: 'Builder Demo', desc: 'See what members are building' },
            { icon: '🤝', label: 'Networking', desc: 'Open discussion' },
          ].map((step) => (
            <div key={step.label} className="flex flex-col gap-1">
              <span className="text-2xl">{step.icon}</span>
              <span className="text-sm font-bold text-foreground">{step.label}</span>
              <span className="text-xs text-muted-foreground">{step.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RSVP */}
      <div className="px-8 py-5 border-t border-border flex flex-wrap gap-3 items-center">
        {rsvp && (
          <a
            href={rsvp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1E8EFF] text-black font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-[2px] hover:brightness-110 transition-all"
          >
            {rsvp.label} ↗
          </a>
        )}
        <a
          href="https://t.me/northstarpioneerscommunity"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground border border-border font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-[2px] hover:text-foreground hover:border-foreground/40 transition-colors"
        >
          Pioneers Telegram
        </a>
        <ShareEventButton slug={event.slug} title={event.title} className="ml-auto" />
      </div>
    </div>
  );
}
