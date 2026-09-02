import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import {
  getNextEvent,
  getUpcomingEvents,
  getPastEvents,
  formatEventDate,
  formatEventDateShort,
  type MeetupEvent,
} from '@/data/events';

/** Format date as "Jul 20, 2026" */
function formatDateWithYear(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Build a one-paragraph topic summary from all topic titles */
function buildTopicSummary(event: MeetupEvent): string {
  const titles = event.topics.map((t) => t.title);
  if (titles.length === 0) return '';
  if (titles.length === 1) return `Topics covered: ${titles[0]}.`;
  const last = titles[titles.length - 1];
  const rest = titles.slice(0, -1);
  return `Topics covered: ${rest.join(', ')}, and ${last}.`;
}

/** Get presenter name and primary contact link from builderDemo */
function getPresenterInfo(event: MeetupEvent): { name: string; url: string } | null {
  const d = event.builderDemo;
  if (!d || !d.presenter) return null;
  const url = d.presenterUrl ?? d.presenterLinkedIn ?? (d.presenterTelegram ? `https://t.me/${d.presenterTelegram}` : null);
  if (!url) return { name: d.presenter, url: '' };
  return { name: d.presenter, url };
}

const Index = () => {
  useSeoMeta({
    title: 'Northstar Pioneers — Twin Cities AI Collective',
    description:
      'Northstar Pioneers are builders, thinkers, and storytellers who believe every generation inherits a task eternal: to learn deeply, to carry it honestly, and to leave the world a little more possible than we found it.',
  });

  const nextEvent = getNextEvent();
  const upcomingEvents = getUpcomingEvents();
  const placeholderEvents = upcomingEvents.filter((e) => e.placeholder);
  const pastEvents = getPastEvents().slice(0, 2);
  const [topicsOpen, setTopicsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        {/* Background gradients */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(30,142,255,0.18) 0%, transparent 60%)',
          }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#1E8EFF 1px, transparent 1px), linear-gradient(90deg, #1E8EFF 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <svg
              className="glow-star"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <polygon
                points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
                fill="#1E8EFF"
              />
            </svg>
            <span className="pioneer-label">AI Monthly Mastermind · Greater Twin Cities, MN</span>
          </div>

          {/* Headline */}
          <h1
            className="font-black uppercase text-foreground mb-6 leading-none"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(48px, 8vw, 96px)',
              letterSpacing: '0.01em',
            }}
          >
            We Take Up<br />
            The Task <span className="text-[#1E8EFF]">Eternal.</span>
          </h1>

          <p className="text-foreground/80 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed font-light">
            Northstar Pioneers are builders, thinkers, and storytellers who believe every generation inherits a task eternal: to learn deeply, to carry it honestly, and to leave the world a little more possible than we found it.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="https://www.meetup.com/northstar-pioneers/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#1E8EFF] text-black font-bold text-sm uppercase tracking-widest px-7 py-3.5 rounded-[2px] hover:brightness-110 transition-all"
            >
              RSVP on Meetup
            </a>
            <Link
              to="/events"
              className="inline-block text-[#1E8EFF] border border-[#1E8EFF]/40 font-bold text-sm uppercase tracking-widest px-7 py-3.5 rounded-[2px] hover:bg-[#1E8EFF]/10 transition-colors"
            >
              Event Archive
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEXT EVENT ────────────────────────────────────────── */}
      {nextEvent && (
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <div className="pioneer-label mb-6">Next Gathering</div>
          <div className="card-accent p-0 overflow-hidden">
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-8 py-6 border-b border-border">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#5AB0FF] mb-1">
                  Upcoming
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {nextEvent.title}
                </h2>
              </div>
              <span className="tag-pill self-start sm:self-auto">
                {formatEventDateShort(nextEvent.date)} · {nextEvent.city ?? 'Mpls'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="px-8 py-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Date
                </div>
                <div className="text-foreground font-semibold">
                  {formatEventDate(nextEvent.date)}
                </div>
              </div>
              <div className="px-8 py-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Time
                </div>
                <div className="text-foreground font-semibold">{nextEvent.time}</div>
              </div>
              <div className="px-8 py-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Venue Sponsor
                </div>
                <div className="text-foreground font-semibold">{nextEvent.venue}</div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  {nextEvent.address}
                </div>
              </div>
            </div>

            {/* Venue Sponsor Bio */}
            <div className="px-8 py-6 border-t border-border">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                About the Venue Sponsor
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nerdery is a digital solutions provider with over 20 years of experience
                building business-critical software for when off-the-shelf solutions won't
                work and failure is not an option. As a strategic ally, we provide the Digital
                Strategy, System Modernization, and AI Optimization needed to bridge the gap
                between executive vision and technical execution.{' '}
                <a
                  href="https://www.nerdery.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1E8EFF] hover:underline"
                >
                  nerdery.com ↗
                </a>
              </p>
            </div>

            {/* Featured Pioneer + Topics row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border border-t border-border">
              <div className="px-8 py-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Featured Pioneer
                </div>
                <a
                  href="https://www.linkedin.com/in/leewinbush/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-semibold hover:text-[#1E8EFF] transition-colors"
                >
                  Lee Winbush ↗
                </a>
              </div>
              <div className="px-8 py-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Socratic Topics
                </div>
                {nextEvent.topics.length > 0 ? (
                  <button
                    onClick={() => setTopicsOpen((o) => !o)}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-[#1E8EFF]/40 text-[#1E8EFF] px-4 py-2 rounded-[2px] hover:bg-[#1E8EFF]/10 transition-colors"
                  >
                    {topicsOpen ? 'Hide Topics ↑' : 'View Topics ↓'}
                  </button>
                ) : (
                  <span className="text-sm text-muted-foreground">Topics coming soon</span>
                )}
              </div>
            </div>

            {/* Topics panel */}
            {topicsOpen && nextEvent.topics.length > 0 && (
              <div className="px-8 py-6 border-t border-border">
                <div className="pioneer-label mb-4">Socratic Review Topics</div>
                <div className="space-y-4">
                  {nextEvent.topics.map((topic, i) => (
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
                  {
                    icon: '🗞️',
                    label: 'Socratic Review',
                    desc: '5–10 frontier topics',
                  },
                  {
                    icon: '🛠️',
                    label: 'Builder Demo',
                    desc: 'See what members are building',
                  },
                  {
                    icon: '🤝',
                    label: 'Networking',
                    desc: 'Open discussion',
                  },
                ].map((step) => (
                  <div key={step.label} className="flex flex-col gap-1">
                    <span className="text-2xl">{step.icon}</span>
                    <span className="text-sm font-bold text-foreground">
                      {step.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{step.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RSVP */}
            <div className="px-8 py-5 border-t border-border flex flex-wrap gap-3 items-center">
              {nextEvent.meetupUrl && (
                <a
                  href={nextEvent.meetupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1E8EFF] text-black font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-[2px] hover:brightness-110 transition-all"
                >
                  RSVP on Meetup ↗
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
            </div>
          </div>
        </section>
      )}

      {/* ── ON THE HORIZON ────────────────────────────────────── */}
      {placeholderEvents.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mb-16">
          <div className="pioneer-label mb-4">On the Horizon</div>
          <div className="space-y-3">
            {placeholderEvents.map((event) => (
              <div key={event.slug} className="card-accent px-7 py-5 flex flex-col gap-3">
                {/* Row 1: title + pill */}
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className="text-lg font-extrabold text-foreground leading-tight"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {event.title}
                  </h3>
                  <span className="tag-pill text-[10px]">{event.city ? `Sept · ${event.city}` : 'TBD'}</span>
                </div>
                {/* Row 2: metadata + button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span><span className="font-bold uppercase tracking-wider text-foreground/60">Date</span> — TBD</span>
                    <span><span className="font-bold uppercase tracking-wider text-foreground/60">Venue</span> — {event.venue}</span>
                    <span><span className="font-bold uppercase tracking-wider text-foreground/60">Pioneer</span> — TBD</span>
                    <span><span className="font-bold uppercase tracking-wider text-foreground/60">Topics</span> — TBD</span>
                  </div>
                  <a
                    href="https://t.me/northstarpioneerscommunity"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 self-start sm:self-auto text-muted-foreground border border-border font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-[2px] hover:text-foreground hover:border-foreground/40 transition-colors"
                  >
                    Pioneers Telegram ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── ABOUT STRIP ───────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-card border-y border-border py-20 mb-20">
        <div
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#1E8EFF 1px, transparent 1px), linear-gradient(90deg, #1E8EFF 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="pioneer-label mb-4">Who We Are</div>
              <h2
                className="font-black uppercase text-3xl sm:text-4xl text-foreground mb-6 leading-tight"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Sovereign Thinking.<br />
                Human <span className="text-[#1E8EFF]">Flourishing.</span>
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Northstar Pioneers is rooted in the belief that the tools of
                this new age belong in the hands of those bold enough to use
                them. We gather in the Twin Cities to learn, to build, and to
                push each other forward.
              </p>
              <Link
                to="/about"
                className="text-[#1E8EFF] border border-[#1E8EFF]/40 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-[2px] hover:bg-[#1E8EFF]/10 transition-colors inline-block"
              >
                Learn More
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  num: '76+',
                  label: 'Members',
                  desc: 'Builders across the Twin Cities',
                },
                {
                  num: '2',
                  label: 'Gatherings',
                  desc: 'And growing every month',
                },
                {
                  num: 'Monthly',
                  label: 'Cadence',
                  desc: 'Consistent, focused, thoughtful',
                },
                {
                  num: '2 hrs',
                  label: 'Format',
                  desc: 'Tight, energizing, actionable',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-background border border-border rounded-[2px] p-5"
                >
                  <div className="text-2xl font-extrabold text-[#1E8EFF] mb-1">
                    {stat.num}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RECENT EVENTS PREVIEW ─────────────────────────────── */}
      {pastEvents.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="pioneer-label mb-1">Past Gatherings</div>
              <h2
                className="font-black uppercase text-2xl sm:text-3xl text-foreground"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                From the Archive
              </h2>
            </div>
            <Link
              to="/events"
              className="hidden sm:block text-xs font-bold uppercase tracking-widest text-[#1E8EFF] hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pastEvents.map((event) => {
              const presenter = getPresenterInfo(event);
              const topicSummary = buildTopicSummary(event);
              return (
                <Link
                  key={event.slug}
                  to={`/events/${event.slug}`}
                  className="card-accent p-6 block group hover:border-[#1E8EFF]/50 transition-colors"
                >
                  {/* Date with year */}
                  <div className="text-xs font-bold uppercase tracking-widest text-[#5AB0FF] mb-3">
                    {formatDateWithYear(event.date)}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground group-hover:text-[#1E8EFF] transition-colors mb-3">
                    {event.title}
                  </h3>

                  {/* Presenter */}
                  {presenter && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Featured Pioneer:
                      </span>
                      {presenter.url ? (
                        <span
                          className="text-xs font-bold text-[#5AB0FF]"
                          onClick={(e) => { e.preventDefault(); window.open(presenter.url, '_blank', 'noopener,noreferrer'); }}
                        >
                          {presenter.name} ↗
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-[#5AB0FF]">{presenter.name}</span>
                      )}
                    </div>
                  )}

                  {/* Topic paragraph */}
                  {topicSummary && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {topicSummary}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="sm:hidden mt-4">
            <Link
              to="/events"
              className="text-xs font-bold uppercase tracking-widest text-[#1E8EFF] hover:underline"
            >
              View All Events →
            </Link>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
};

export default Index;
