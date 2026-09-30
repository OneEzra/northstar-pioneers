import { Link } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';

import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { useMeetupEvents } from '@/hooks/useMeetupEvents';
import { EVENT_TIME_ZONE, type MeetupEvent } from '@/data/events';
import { meetupLinkFor } from '@/lib/meetup';

const resourceIcon: Record<string, string> = {
  slides: '📄',
  video: '▶',
  link: '🔗',
  demo: '⚡',
  speaker: '🎤',
};

const linkClass =
  'text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-[#1E8EFF] transition-colors';

function dateParts(iso: string) {
  const d = new Date(iso);
  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    d.toLocaleDateString('en-US', { timeZone: EVENT_TIME_ZONE, ...opts });
  return { month: fmt({ month: 'short' }), day: fmt({ day: 'numeric' }), year: fmt({ year: 'numeric' }) };
}

function PioneerCard({ event }: { event: MeetupEvent }) {
  const demo = event.builderDemo!;
  const { month, day, year } = dateParts(event.date);
  const upcoming = event.status === 'upcoming';
  const meetup = meetupLinkFor(event);

  return (
    <article className="card-accent overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr]">
        {/* Date column */}
        <div className="flex sm:flex-col items-baseline sm:items-start gap-2 sm:gap-0 px-7 pt-6 sm:py-7 sm:border-r border-border">
          <div
            className="text-[#1E8EFF] font-black uppercase leading-none text-3xl"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {month} {day}
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground sm:mt-1">{year}</div>
        </div>

        {/* Pioneer */}
        <div className="px-7 py-6 sm:py-7 space-y-3 min-w-0">
          <h2
            className="font-black uppercase text-3xl text-foreground leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {demo.presenter}
          </h2>

          {demo.title && <div className="text-base font-bold text-foreground">{demo.title}</div>}

          {demo.description && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{demo.description}</p>
          )}

          {(demo.presenterUrl || demo.presenterLinkedIn || demo.presenterTelegram) && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
              {demo.presenterUrl && (
                <a href={demo.presenterUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {demo.presenterUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
                </a>
              )}
              {demo.presenterLinkedIn && (
                <a href={demo.presenterLinkedIn} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  LinkedIn ↗
                </a>
              )}
              {demo.presenterTelegram && (
                <a
                  href={`https://t.me/${demo.presenterTelegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  @{demo.presenterTelegram}
                </a>
              )}
            </div>
          )}

          {demo.resources && demo.resources.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {demo.resources.map((r) => (
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
      </div>

      {/* Event + Meetup links */}
      <div className="px-7 py-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          {upcoming ? 'Presenting at' : 'Presented at'} the {event.title} · {event.venue}
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to={`/events/${event.slug}`}
            className="text-xs font-bold uppercase tracking-widest text-[#1E8EFF] hover:text-[#5AB0FF] transition-colors"
          >
            View Event →
          </Link>
          {meetup &&
            (upcoming ? (
              <a
                href={meetup.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1E8EFF] text-black font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-[2px] hover:brightness-110 transition-all"
              >
                {meetup.label} ↗
              </a>
            ) : (
              <a
                href={meetup.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground border border-border font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-[2px] hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                {meetup.label} ↗
              </a>
            ))}
        </div>
      </div>
    </article>
  );
}

const PioneersPage = () => {
  useSeoMeta({
    title: 'Pioneers — Northstar Pioneers',
    description:
      'Featured Northstar Pioneers — the builders who have demoed their work at our monthly Twin Cities AI meetup.',
  });

  const { pioneers } = useMeetupEvents();
  // Upcoming: soonest first. Past: newest first.
  const upcoming = pioneers.filter((e) => e.status === 'upcoming').reverse();
  const past = pioneers.filter((e) => e.status === 'past');

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
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="pioneer-label mb-3">The Builders</div>
          <h1
            className="font-black uppercase text-4xl sm:text-5xl text-foreground"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Featured <span className="text-[#1E8EFF]">Pioneers</span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl">
            Every meetup, one member shows what they've built. See who's up next, and everyone who has
            taken the stage.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {upcoming.length > 0 && (
          <section className="space-y-5">
            <div className="pioneer-label">Upcoming</div>
            {upcoming.map((e) => (
              <PioneerCard key={e.slug} event={e} />
            ))}
          </section>
        )}

        <section className="space-y-5">
          <div className="pioneer-label">Past Pioneers</div>
          {past.length === 0 ? (
            <p className="text-muted-foreground">Our first featured pioneer will be announced soon.</p>
          ) : (
            past.map((e) => <PioneerCard key={e.slug} event={e} />)
          )}
        </section>

        <div className="card-accent p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-foreground">Built something worth showing?</div>
            <p className="text-sm text-muted-foreground">Tell us in the Pioneers Telegram — we'd love to feature you.</p>
          </div>
          <a
            href="https://t.me/northstarpioneerscommunity"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-muted-foreground border border-border font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-[2px] hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            Pioneers Telegram ↗
          </a>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default PioneersPage;
