import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import NotFound from './NotFound';
import {
  getEventBySlug,
  getPastEvents,
  formatEventDate,
  type Resource,
  type Topic,
} from '@/data/events';

const resourceIcon: Record<string, string> = {
  slides: '📄',
  video: '▶',
  link: '🔗',
  demo: '⚡',
  speaker: '🎤',
};

function ResourceBadge({ resource }: { resource: Resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-sm font-bold text-[#5AB0FF] hover:text-[#1E8EFF] transition-colors bg-[rgba(30,142,255,0.08)] border border-[rgba(30,142,255,0.25)] px-4 py-2 rounded-[2px] hover:bg-[rgba(30,142,255,0.14)]"
    >
      <span className="text-base">{resourceIcon[resource.type] ?? '↗'}</span>
      {resource.label}
      <span className="text-xs opacity-60">↗</span>
    </a>
  );
}

function TopicCard({ topic, index }: { topic: Topic; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore =
    (topic.expandedContent && topic.expandedContent.length > 0) ||
    !!topic.expandedImageUrl;

  return (
    <div className="card-accent p-6">
      <div className="flex items-start gap-4">
        <div className="text-[#1E8EFF] font-mono text-sm font-bold shrink-0 mt-0.5">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-foreground mb-2">{topic.title}</h3>

          {/* One-sentence description always visible */}
          {topic.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {topic.description}
            </p>
          )}

          {/* Presenter */}
          {topic.presenter && (
            <div className="text-xs text-[#5AB0FF] font-semibold mt-2">
              Presented by {topic.presenter}
            </div>
          )}

          {/* Expanded content */}
          {expanded && hasMore && (
            <div className="mt-4 space-y-3 border-t border-border pt-4">
              {topic.expandedContent?.map((para, i) => (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                  {para}
                </p>
              ))}
              {topic.expandedImageUrl && (
                <img
                  src={topic.expandedImageUrl}
                  alt={topic.expandedImageAlt ?? topic.title}
                  className="w-full rounded-[2px] border border-border mt-4"
                  loading="lazy"
                />
              )}
            </div>
          )}

          {/* Read more / less toggle */}
          {hasMore && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-xs font-bold uppercase tracking-widest text-[#1E8EFF] hover:text-[#5AB0FF] transition-colors"
            >
              {expanded ? '− Read less' : '+ Read more'}
            </button>
          )}

          {/* Resources */}
          {topic.resources && topic.resources.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {topic.resources.map((r) => (
                <ResourceBadge key={r.url} resource={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const event = slug ? getEventBySlug(slug) : undefined;

  useSeoMeta({
    title: event
      ? `${event.title} -- Northstar Pioneers`
      : 'Event Not Found -- Northstar Pioneers',
    description: event?.summary,
  });

  if (!event) return <NotFound />;

  const pastEvents = getPastEvents();
  const currentIndex = pastEvents.findIndex((e) => e.slug === event.slug);
  const prevEvent = currentIndex < pastEvents.length - 1 ? pastEvents[currentIndex + 1] : null;
  const nextEventInList = currentIndex > 0 ? pastEvents[currentIndex - 1] : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>›</span>
          <Link to="/events" className="hover:text-foreground transition-colors">
            Events
          </Link>
          <span>›</span>
          <span className="text-foreground">{event.title}</span>
        </div>
      </div>

      {/* Event header */}
      <div className="relative isolate overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#1E8EFF 1px, transparent 1px), linear-gradient(90deg, #1E8EFF 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`tag-pill ${event.status === 'upcoming' ? 'border-[#1E8EFF] text-[#1E8EFF]' : ''}`}
            >
              {event.status === 'upcoming' ? 'Upcoming' : 'Past Event'}
            </span>
          </div>
          <h1
            className="font-black uppercase text-3xl sm:text-5xl text-foreground leading-tight mb-6"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {event.title}
          </h1>

          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Date', value: formatEventDate(event.date) },
              { label: 'Time', value: event.time },
              { label: 'Venue', value: event.venue },
              { label: 'Location', value: event.address },
            ].map((m) => (
              <div key={m.label}>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                  {m.label}
                </div>
                <div className="text-sm text-foreground font-medium">{m.value}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          {event.meetupUrl && (
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={event.meetupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1E8EFF] text-black font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-[2px] hover:brightness-110 transition-all"
              >
                {event.status === 'upcoming' ? 'RSVP on Meetup ↗' : 'View on Meetup ↗'}
              </a>
              <a
                href="https://t.me/northstarpioneerscommunity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground border border-border font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-[2px] hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                Join Telegram
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        {/* Summary */}
        <section>
          <p className="text-lg text-[#D0D0D0] leading-relaxed border-l-4 border-[#1E8EFF] pl-6">
            {event.summary}
          </p>
        </section>

        {/* Builder Demo */}
        {event.builderDemo && (
          <section>
            <div className="pioneer-label mb-5">Builder Demo</div>
            <div
              className="card-accent p-6 border-l-4"
              style={{ borderLeftColor: '#1E8EFF' }}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl shrink-0">🛠️</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground leading-tight">
                    {event.builderDemo.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="text-sm text-[#5AB0FF] font-semibold">
                      {event.builderDemo.presenter}
                    </span>
                    {event.builderDemo.presenterUrl && (
                      <a
                        href={event.builderDemo.presenterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-[#1E8EFF] transition-colors"
                      >
                        {event.builderDemo.presenterUrl.replace(/^https?:\/\//, '')} ↗
                      </a>
                    )}
                    {event.builderDemo.presenterTelegram && (
                      <a
                        href={`https://t.me/${event.builderDemo.presenterTelegram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-[#1E8EFF] transition-colors"
                      >
                        @{event.builderDemo.presenterTelegram}
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {event.builderDemo.description}
              </p>
              {event.builderDemo.resources && event.builderDemo.resources.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {event.builderDemo.resources.map((r) => (
                    <ResourceBadge key={r.url} resource={r} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Socratic Topics */}
        {event.topics.length > 0 && (
          <section>
            <div className="pioneer-label mb-5">Socratic Review Topics</div>
            <div className="space-y-4">
              {event.topics.map((topic, i) => (
                <TopicCard key={topic.title} topic={topic} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* No topics yet for upcoming events */}
        {event.status === 'upcoming' && event.topics.length === 0 && (
          <section>
            <div className="border border-dashed border-border rounded-[2px] py-12 px-8 text-center">
              <div className="text-3xl mb-3">📋</div>
              <p className="text-muted-foreground font-medium">
                Topics will be announced closer to the event.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Join the{' '}
                <a
                  href="https://t.me/northstarpioneerscommunity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1E8EFF] hover:underline"
                >
                  Telegram group
                </a>{' '}
                to stay up to date.
              </p>
            </div>
          </section>
        )}
      </div>

      {/* Prev / Next navigation */}
      {(prevEvent || nextEventInList) && (
        <div className="border-t border-border">
          <div className="max-w-4xl mx-auto px-6 py-8 flex justify-between gap-4">
            {prevEvent ? (
              <Link
                to={`/events/${prevEvent.slug}`}
                className="flex-1 group text-left"
              >
                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Previous
                </div>
                <div className="text-sm font-bold text-foreground group-hover:text-[#1E8EFF] transition-colors">
                  {prevEvent.title}
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {nextEventInList && (
              <Link
                to={`/events/${nextEventInList.slug}`}
                className="flex-1 group text-right"
              >
                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Next
                </div>
                <div className="text-sm font-bold text-foreground group-hover:text-[#1E8EFF] transition-colors">
                  {nextEventInList.title}
                </div>
              </Link>
            )}
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
};

export default EventDetailPage;
