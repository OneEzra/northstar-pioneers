import { Link } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { SiteNav } from '@/components/SiteNav';
import { SiteFooter } from '@/components/SiteFooter';

const AboutPage = () => {
  useSeoMeta({
    title: 'About — Northstar Pioneers',
    description:
      'Northstar Pioneers is a monthly AI meetup in Minneapolis, MN for builders, thinkers, and pioneers.',
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Page header */}
      <div className="relative isolate overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#1E8EFF 1px, transparent 1px), linear-gradient(90deg, #1E8EFF 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="pioneer-label mb-3">Who We Are</div>
          <h1
            className="font-black uppercase text-4xl sm:text-5xl text-foreground"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            About <span className="text-[#1E8EFF]">Northstar Pioneers</span>
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-14">

        {/* Mission */}
        <section>
          <div className="pioneer-label mb-4">Our Mission</div>
          <blockquote className="border-l-4 border-[#1E8EFF] pl-6 text-xl text-foreground font-light leading-relaxed mb-6">
            "Take up the task eternal, the burden, and the lesson."
          </blockquote>
          <p className="text-[#D0D0D0] leading-relaxed text-base mb-4">
            Northstar Pioneers is a monthly gathering for builders, thinkers, and
            people who believe intelligence is becoming as essential — and as
            available — as electricity. We come together in the Twin Cities to
            learn, to build, and to push each other forward.
          </p>
          <p className="text-[#D0D0D0] leading-relaxed text-base">
            No gatekeepers. No fluff. Just people serious about shaping what comes
            next. We are rooted in sovereign thinking, human flourishing, and the
            conviction that the tools of this new age belong in the hands of those
            bold enough to use them.
          </p>
        </section>

        {/* Format */}
        <section>
          <div className="pioneer-label mb-6">How It Works</div>
          <p className="text-muted-foreground mb-8">
            Each month we meet for two hours with a simple, energizing format.
            Every session is designed to inform, inspire, and connect.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: '🍕',
                step: '01',
                label: 'Welcome',
                desc: 'Gather, connect, and grab a slice. The first 15 minutes are for arrivals and introductions — new faces always welcome.',
              },
              {
                icon: '🗞️',
                step: '02',
                label: 'Socratic News Review',
                desc: 'We walk through 5–10 of the most compelling stories, use cases, and ideas shaping the frontier. Group discussion, critical analysis, no lectures.',
              },
              {
                icon: '🛠️',
                step: '03',
                label: 'Builder Demo',
                desc: 'One of our own presents what they\'re building — a product, a proof of concept, a workflow, an experiment. 20 minutes + Q&A.',
              },
              {
                icon: '🤝',
                step: '04',
                label: 'Networking & Open Discussion',
                desc: 'Structured wrap-up turns into open floor. This is where the real connections happen.',
              },
            ].map((step) => (
              <div key={step.step} className="card-accent p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{step.icon}</div>
                  <div>
                    <div className="text-xs font-mono text-[#1E8EFF] mb-1">{step.step}</div>
                    <div className="font-bold text-foreground mb-2">{step.label}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="pioneer-label mb-6">What We Stand For</div>
          <div className="space-y-4">
            {[
              {
                title: 'Sovereign Thinking',
                desc: 'We believe in your right to think independently, access powerful tools, and build without asking permission. Centralized gatekeepers stifle innovation — we don\'t.',
              },
              {
                title: 'Radical Transparency',
                desc: 'We discuss what\'s actually happening — not the sanitized press release version. Critical analysis, open skepticism, and honest debate are features, not bugs.',
              },
              {
                title: 'Builder Culture',
                desc: 'Northstar Pioneers is for people who ship. Spectators welcome, but builders drive the agenda. If you\'re making something, we want to hear about it.',
              },
              {
                title: 'Human Flourishing',
                desc: 'Technology is a means, not an end. We care about what AI and emerging tools actually do for people, communities, and society — not just benchmark scores.',
              },
            ].map((v) => (
              <div key={v.title} className="border-l-[3px] border-[#1E8EFF]/30 pl-5 py-1">
                <h3 className="font-bold text-foreground mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Location */}
        <section>
          <div className="pioneer-label mb-4">Where We Meet</div>
          <div className="card-accent p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Venue
                </div>
                <div className="font-bold text-foreground text-lg mb-1">Improving</div>
                <div className="text-sm text-muted-foreground">
                  3033 Excelsior Blvd #180<br />
                  Minneapolis, MN 55416
                </div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Cadence
                </div>
                <div className="font-bold text-foreground text-lg mb-1">Monthly</div>
                <div className="text-sm text-muted-foreground">
                  Typically the third Monday of the month<br />
                  5:00 – 7:00 PM CDT
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community links */}
        <section>
          <div className="pioneer-label mb-6">Join the Collective</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://www.meetup.com/northstar-pioneers/"
              target="_blank"
              rel="noopener noreferrer"
              className="card-accent p-6 flex flex-col gap-2 group hover:border-[#1E8EFF]/50 transition-colors"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-[#5AB0FF]">
                Meetup
              </div>
              <div className="font-bold text-foreground group-hover:text-[#1E8EFF] transition-colors">
                northstar-pioneers ↗
              </div>
              <p className="text-sm text-muted-foreground">
                RSVP for upcoming events and see who's coming. 76+ members and growing.
              </p>
            </a>
            <a
              href="https://t.me/northstarpioneerscommunity"
              target="_blank"
              rel="noopener noreferrer"
              className="card-accent p-6 flex flex-col gap-2 group hover:border-[#1E8EFF]/50 transition-colors"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-[#5AB0FF]">
                Telegram
              </div>
              <div className="font-bold text-foreground group-hover:text-[#1E8EFF] transition-colors">
                @northstarpioneerscommunity ↗
              </div>
              <p className="text-sm text-muted-foreground">
                Day-to-day discussion, links, and announcements between meetups.
              </p>
            </a>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2
              className="font-black uppercase text-2xl text-foreground"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Ready to <span className="text-[#1E8EFF]">Pioneer</span>?
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Come ready to build. Pizza provided.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/events"
              className="bg-[#1E8EFF] text-black font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-[2px] hover:brightness-110 transition-all"
            >
              View Events
            </Link>
            <a
              href="https://www.meetup.com/northstar-pioneers/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1E8EFF] border border-[#1E8EFF]/40 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-[2px] hover:bg-[#1E8EFF]/10 transition-colors"
            >
              Join on Meetup ↗
            </a>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
};

export default AboutPage;
