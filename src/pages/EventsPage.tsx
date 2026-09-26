import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useSeoMeta } from '@unhead/react';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { useMeetupEvents } from '@/hooks/useMeetupEvents';
import { ShareEventButton } from '@/components/ShareEventButton';
import { NextGatheringCard } from '@/components/events/NextGatheringCard';
import { HorizonEventCard } from '@/components/events/HorizonEventCard';
import {
  formatEventDateShort,
  type MeetupEvent,
} from '@/data/events';

const resourceIcon: Record<string, string> = {
  slides: '📄',
  video: '▶',
  link: '🔗',
  demo: '⚡',
  speaker: '🎤',
};

function EventCard({ event }: { event: MeetupEvent }) {
  const [topicsOpen, setTopicsOpen] = useState(false);
  return (
    <div className="card-accent overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 px-7 py-5 border-b border-border">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#5AB0FF] mb-1">
            {formatEventDateShort(event.date)} · {event.venue}
          </div>
          <Link to={`/events/${event.slug}`}>
            <h2 className="text-xl font-extrabold text-foreground hover:text-[#1E8EFF] transition-colors cursor-pointer">
              {event.title}
            </h2>
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0"></div>
      </div>

      {/* Summary */}
      {event.summary && (
        <div className="px-7 py-4 border-b border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">{event.summary}</p>
        </div>
      )}

      {/* Builder Demo */}
      {event.builderDemo && (
        <div className="px-7 py-5 border-b border-border bg-[rgba(30,142,255,0.04)]">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Featured Northstar Pioneer
          </div>
          <div className="text-sm font-bold text-foreground mb-1">
            {event.builderDemo.title}
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="text-xs text-[#5AB0FF] font-semibold">
              {event.builderDemo.presenter}
            </span>
            {event.builderDemo.presenterUrl && (
              <a
                href={event.builderDemo.presenterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-[#1E8EFF] transition-colors"
              >
                {event.builderDemo.presenterUrl.replace(/^https?:\/\//, '')} ↗
              </a>
            )}
            {event.builderDemo.presenterTelegram && (
              <a
                href={`https://t.me/${event.builderDemo.presenterTelegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-[#1E8EFF] transition-colors"
              >
                @{event.builderDemo.presenterTelegram}
              </a>
            )}
            {event.builderDemo.presenterLinkedIn && (
              <a
                href={event.builderDemo.presenterLinkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-[#1E8EFF] transition-colors"
              >
                LinkedIn ↗
              </a>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {event.builderDemo.description}
          </p>
          {event.builderDemo.resources && event.builderDemo.resources.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {event.builderDemo.resources.map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5AB0FF] hover:text-[#1E8EFF] transition-colors bg-[rgba(30,142,255,0.08)] border border-[rgba(30,142,255,0.2)] px-2.5 py-1 rounded-[2px]"
                >
                  <span>{resourceIcon[r.type] ?? '↗'}</span>
                  {r.label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3-column action row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border border-t border-border">
        {/* View Topics */}
        <div className="px-7 py-4 flex items-center">
          {event.topics.length > 0 ? (
            <button
              onClick={() => setTopicsOpen((o) => !o)}
              className="text-xs font-bold uppercase tracking-widest text-[#1E8EFF] hover:text-[#5AB0FF] transition-colors"
            >
              {topicsOpen ? 'Hide Topics ↑' : 'View Topics ↓'}
            </button>
          ) : (
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">No Topics</span>
          )}
        </div>

        {/* View Full Details */}
        <div className="px-7 py-4 flex items-center">
          <Link
            to={`/events/${event.slug}`}
            className="text-xs font-bold uppercase tracking-widest text-[#1E8EFF] hover:text-[#5AB0FF] transition-colors"
          >
            View Full Details →
          </Link>
        </div>

        {/* Share */}
        <div className="px-7 py-4 flex items-center">
          <ShareEventButton slug={event.slug} title={event.title} />
        </div>
      </div>

      {/* Topics panel */}
      {topicsOpen && event.topics.length > 0 && (
        <div className="px-7 py-5 border-t border-border">
          <div className="pioneer-label mb-4">Socratic Review Topics</div>
          <div className="space-y-4">
            {event.topics.map((topic, i) => (
              <div key={topic.title} className="card-accent p-6">
                <div className="flex items-start gap-4">
                  <div className="text-[#1E8EFF] font-mono text-sm font-bold shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    {topic.section && (
                      <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        {topic.section}
                      </div>
                    )}
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
                            <span>{resourceIcon[r.type] ?? '↗'}</span>
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
    </div>
  );
}

const EventsPage = () => {
  useSeoMeta({
    title: 'Events Archive — Northstar Pioneers',
    description:
      'Monthly meetup archive — topics, demos, and resources from every Northstar Pioneers gathering.',
  });

  const { past: pastEvents, next: nextEvent, horizon: placeholderEvents } = useMeetupEvents();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Page header */}
      <div className="relative isolate overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 -z-10 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(#1E8EFF 1px, transparent 1px), linear-gradient(90deg, #1E8EFF 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="pioneer-label mb-3">All Gatherings</div>
          <h1
            className="font-black uppercase text-4xl sm:text-5xl text-foreground"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Events <span className="text-[#1E8EFF]">Archive</span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-lg">
            Topics, demos, speaker resources, and slide decks from
            Northstar Pioneers meetups.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Upcoming */}
        {nextEvent && (
          <section className="mb-14">
            <div className="pioneer-label mb-4">Upcoming</div>
            <NextGatheringCard event={nextEvent} />
          </section>
        )}

        {/* On the Horizon — placeholder events */}
        {placeholderEvents.length > 0 && (
          <section className="mb-14">
            <div className="pioneer-label mb-4">On the Horizon</div>
            <div className="space-y-3">
              {placeholderEvents.map((event) => (
                <HorizonEventCard key={event.slug} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Past events */}
        <div>
          <div className="pioneer-label mb-6">Past Gatherings</div>
          {pastEvents.length === 0 ? (
            <div className="border border-dashed border-border rounded-[2px] py-16 px-8 text-center">
              <p className="text-muted-foreground">
                No past events yet. Check back after our inaugural gathering!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {pastEvents.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default EventsPage;
