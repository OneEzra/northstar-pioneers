import { Link } from 'react-router-dom';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';
import { WelcomeVideo } from '@/components/WelcomeVideo';
import { useMeetupEvents } from '@/hooks/useMeetupEvents';
import { MEETUP_GROUP_URL, meetupLinkFor } from '@/lib/meetup';
import { usePageSeo, DEFAULT_TITLE, DEFAULT_DESCRIPTION, eventJsonLd } from '@/lib/seo';
import { NextGatheringCard } from '@/components/events/NextGatheringCard';
import { HorizonEventCard } from '@/components/events/HorizonEventCard';
import {
  type MeetupEvent,
  EVENT_TIME_ZONE,
} from '@/data/events';

/** Format date as "Jul 20, 2026" */
function formatDateWithYear(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    timeZone: EVENT_TIME_ZONE,
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
  const welcomeVideoUrl = import.meta.env.VITE_WELCOME_VIDEO_URL as string | undefined;
  const { next: nextEvent, horizon: placeholderEvents, past: allPastEvents, isLoading: eventsLoading } = useMeetupEvents();
  const pastEvents = allPastEvents.slice(0, 2);

  usePageSeo({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: '/',
    jsonLd: [nextEvent, ...placeholderEvents].filter((e): e is MeetupEvent => !!e && e.state !== 'cancelled').map(eventJsonLd),
  });

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

          <p className="text-foreground/80 text-lg sm:text-xl max-w-xl mb-4 leading-relaxed font-light">
            Northstar Pioneers are builders, thinkers, and storytellers who believe every generation inherits a task eternal: to learn deeply, to carry it honestly, and to leave the world a little more possible than we found it.
          </p>
          <p className="text-muted-foreground text-base max-w-xl mb-10 leading-relaxed">
            A free monthly AI meetup in the Twin Cities (Minneapolis–St. Paul): Socratic AI news review, a live builder demo, and open networking.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-4 items-center">
            <a
              href={(nextEvent && meetupLinkFor(nextEvent)?.url) ?? MEETUP_GROUP_URL}
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

      {welcomeVideoUrl && <WelcomeVideo src={welcomeVideoUrl} />}

      {/* ── NEXT EVENT ────────────────────────────────────────── */}
      {nextEvent && (
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <div className="pioneer-label mb-6">Next Gathering</div>
          <NextGatheringCard event={nextEvent} loading={eventsLoading} />
        </section>
      )}

      {/* ── ON THE HORIZON ────────────────────────────────────── */}
      {placeholderEvents.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mb-16">
          <div className="pioneer-label mb-4">On the Horizon</div>
          <div className="space-y-3">
            {placeholderEvents.map((event) => (
              <HorizonEventCard key={event.slug} event={event} />
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
                  num: String(allPastEvents.length),
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
