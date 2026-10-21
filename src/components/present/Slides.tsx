// -----------------------------------------------------------------
//  Presentation slides. Each slide is laid out on a fixed 1920×1080
//  stage (scaled to fit the screen by PresentPage), so sizes here are
//  real TV pixels: big enough to read from the back of the room.
//  Look follows the printed NSP decks: black background, white card
//  with a slate ribbon + star, blue star + wordmark.
// -----------------------------------------------------------------

import type { CSSProperties, ReactNode } from 'react';
import { QRCodeCanvas } from '@/components/ui/qrcode';
import type { MeetupEvent } from '@/data/events';
import { formatEventDate } from '@/data/events';
import { resourceVerb, shortUrl, type Slide } from '@/lib/presentation';

const BLUE = '#1E8EFF';
const NAVY = '#12457A';
const RIBBON = '#5B6577';
const CONDENSED: CSSProperties = { fontFamily: "'Barlow Condensed', 'Barlow', sans-serif" };
const SANS: CSSProperties = { fontFamily: "'Barlow', system-ui, sans-serif" };

const STAR_POINTS = '50,0 61.2,34.5 97.6,34.5 68.2,55.9 79.4,90.5 50,69.1 20.6,90.5 31.8,55.9 2.4,34.5 38.8,34.5';

function Star({ size, color, style }: { size: number; color: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size * 0.905} viewBox="0 0 100 90.5" style={style} aria-hidden="true">
      <polygon points={STAR_POINTS} fill={color} />
    </svg>
  );
}

/** Small "★ NORTHSTAR PIONEERS" lockup for slide corners. */
function Wordmark({ size = 40, style }: { size?: number; style?: CSSProperties }) {
  return (
    <div className="flex items-center" style={{ gap: size * 0.3, ...style }}>
      <Star size={size * 1.05} color={BLUE} />
      <span
        className="font-black uppercase leading-none text-white"
        style={{ ...CONDENSED, fontSize: size, letterSpacing: '0.01em' }}
      >
        Northstar <span style={{ color: BLUE }}>Pioneers</span>
      </span>
    </div>
  );
}

/** Slate ribbon with a white star, hanging off the card's top-right. */
function Ribbon() {
  return (
    <svg
      width={116}
      height={148}
      viewBox="0 0 116 148"
      className="absolute"
      style={{ top: 0, right: 22 }}
      aria-hidden="true"
    >
      <polygon points="0,0 116,0 116,120 58,148 0,120" fill={RIBBON} />
      <g transform="translate(26,30) scale(0.64)">
        <polygon points={STAR_POINTS} fill="#fff" />
      </g>
    </svg>
  );
}

/** The white content card on the right of most slides. */
function Card({ eyebrow, children, style }: { eyebrow: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className="absolute bg-white text-[#111] overflow-hidden"
      style={{ left: 980, top: 96, width: 844, height: 888, borderRadius: 16, padding: '84px 72px 64px', ...style }}
    >
      <Ribbon />
      <div
        className="uppercase"
        style={{ ...CONDENSED, fontWeight: 700, fontSize: 40, letterSpacing: '0.04em', marginBottom: 36, paddingRight: 140 }}
      >
        {eyebrow}
      </div>
      {children}
    </div>
  );
}

function Qr({ value, size, style }: { value: string; size: number; style?: CSSProperties }) {
  return (
    <div className="bg-white shrink-0" style={{ padding: size * 0.06, borderRadius: 12, lineHeight: 0, ...style }}>
      <QRCodeCanvas value={value} size={size} level="M" logo={false} />
    </div>
  );
}

/** Font size that steps down as text gets longer, so nothing overflows. */
function fit(text: string, steps: [number, number][], fallback: number): number {
  for (const [maxLen, px] of steps) if (text.length <= maxLen) return px;
  return fallback;
}

function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black text-white" style={SANS}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------- slides

function ConnectSlide({ slide, event }: { slide: Extract<Slide, { kind: 'connect' }>; event: MeetupEvent }) {
  const items = [
    { label: 'Telegram', blurb: 'Join the community chat', url: slide.telegramUrl },
    { label: 'Meetup', blurb: 'RSVP for future gatherings', url: slide.meetupUrl },
    { label: "Tonight's Topics", blurb: 'Links to everything we discuss', url: slide.topicsUrl },
  ];
  return (
    <Stage>
      <Wordmark size={44} style={{ position: 'absolute', left: 96, top: 80 }} />
      <div className="absolute uppercase" style={{ right: 96, top: 80, ...CONDENSED, fontWeight: 700, fontSize: 44, color: BLUE, letterSpacing: '0.04em' }}>
        Connect
      </div>
      <div className="absolute" style={{ left: 96, top: 196, right: 96 }}>
        <div style={{ ...CONDENSED, fontWeight: 900, fontSize: 112, lineHeight: 1 }} className="uppercase">
          Welcome, Pioneers
        </div>
        <div style={{ fontSize: 38, marginTop: 20, color: '#B8C0CC' }}>
          {event.title} · {formatEventDate(event.date)} · {event.venue}
        </div>
      </div>
      <div className="absolute flex" style={{ left: 96, right: 96, top: 440, gap: 48 }}>
        {items.map((it) => (
          <div key={it.label} className="flex-1 bg-white text-[#111] flex flex-col items-center" style={{ borderRadius: 16, padding: '44px 32px 40px' }}>
            <QRCodeCanvas value={it.url} size={330} level="M" logo={false} />
            <div className="uppercase" style={{ ...CONDENSED, fontWeight: 800, fontSize: 52, marginTop: 24, lineHeight: 1 }}>
              {it.label}
            </div>
            <div style={{ fontSize: 28, color: '#444', marginTop: 10 }}>{it.blurb}</div>
            <div style={{ fontSize: 24, color: '#1466C4', marginTop: 8, fontWeight: 600 }}>{shortUrl(it.url)}</div>
          </div>
        ))}
      </div>
    </Stage>
  );
}

function WelcomeSlide() {
  return (
    <Stage>
      <Star size={440} color={NAVY} style={{ position: 'absolute', left: 96, top: 330 }} />
      <div
        className="absolute font-black uppercase leading-none whitespace-nowrap"
        style={{ left: 330, top: 470, ...CONDENSED, fontSize: 68 }}
      >
        Northstar <span style={{ color: BLUE }}>Pioneers</span>
      </div>
      <Card eyebrow="Welcome">
        <div style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.25 }}>
          We take up the task eternal, and the burden and the lesson.
        </div>
        <div style={{ fontSize: 42, fontWeight: 300, lineHeight: 1.5, marginTop: 48 }}>
          NorthStar Pioneers is rooted in sovereign thinking, human flourishing, and the belief that the
          tools of this new age belong in the hands of those bold enough to use them.
        </div>
      </Card>
    </Stage>
  );
}

function VenueSlide({ slide }: { slide: Extract<Slide, { kind: 'venue' }> }) {
  const { sponsor, venue } = slide;
  const about = sponsor?.about ?? '';
  return (
    <Stage>
      <Wordmark size={40} style={{ position: 'absolute', left: 96, top: 96 }} />
      <div className="absolute flex items-center" style={{ left: 96, top: 300, width: 780, height: 300 }}>
        {sponsor?.logoUrl ? (
          <img src={sponsor.logoUrl} alt={venue} style={{ maxWidth: 780, maxHeight: 260, objectFit: 'contain' }} />
        ) : (
          <div style={{ ...CONDENSED, fontWeight: 900, fontSize: 130, lineHeight: 1 }} className="uppercase">
            {venue}
          </div>
        )}
      </div>
      {sponsor && (
        <div className="absolute flex items-end" style={{ left: 96, bottom: 96, gap: 32 }}>
          <Qr value={sponsor.url} size={170} />
          <div>
            <div style={{ fontSize: 30, fontWeight: 700 }}>Learn more:</div>
            <a
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
              style={{ fontSize: 36 }}
            >
              {shortUrl(sponsor.url)}
            </a>
          </div>
        </div>
      )}
      <Card eyebrow="Venue">
        <div style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.35 }}>
          We’re grateful to {venue} for hosting and sponsoring our space.
        </div>
        {about ? (
          <div style={{ fontSize: fit(about, [[260, 36], [380, 32]], 28), lineHeight: 1.5, marginTop: 40, color: '#222' }}>
            {about}
          </div>
        ) : (
          <div style={{ fontSize: 36, lineHeight: 1.5, marginTop: 40, color: '#222' }}>{slide.address}</div>
        )}
      </Card>
    </Stage>
  );
}

function TopicSlide({ slide }: { slide: Extract<Slide, { kind: 'topic' }> }) {
  const { topic, number, total } = slide;
  const resources = topic.resources ?? [];
  const primary = resources[0];
  const image = topic.expandedImageUrl;
  const num = String(number).padStart(2, '0');
  const desc = topic.description ?? topic.expandedContent?.[0] ?? '';

  return (
    <Stage>
      <Wordmark size={40} style={{ position: 'absolute', left: 96, top: 96 }} />

      {/* Number (big when there's no image) */}
      <div className="absolute" style={{ left: 96, top: image ? 176 : 230 }}>
        <div className="flex items-baseline" style={{ gap: 20 }}>
          <span style={{ ...CONDENSED, fontWeight: 900, fontSize: image ? 120 : 280, lineHeight: 0.9, color: BLUE }}>{num}</span>
          <span style={{ ...CONDENSED, fontWeight: 700, fontSize: image ? 44 : 64, color: '#6B7380' }}>/ {String(total).padStart(2, '0')}</span>
        </div>
        <div className="uppercase" style={{ ...CONDENSED, fontWeight: 700, fontSize: 38, letterSpacing: '0.06em', color: '#B8C0CC', marginTop: image ? 8 : 24 }}>
          Socratic Review
        </div>
      </div>

      {/* Optional image */}
      {image && (
        <img
          src={image}
          alt={topic.expandedImageAlt ?? ''}
          className="absolute"
          style={{ left: 96, top: 400, width: 800, height: primary ? 340 : 560, objectFit: 'contain', objectPosition: 'left center' }}
        />
      )}

      {/* Link + QR for following along */}
      {primary && (
        <div className="absolute flex items-end" style={{ left: 96, bottom: 96, gap: 36, width: 820 }}>
          <Qr value={primary.url} size={190} />
          <div className="min-w-0">
            <div style={{ fontSize: 30, fontWeight: 700, color: '#B8C0CC' }}>{resourceVerb(primary)}:</div>
            {resources.map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block underline underline-offset-4 decoration-2 hover:text-[#5AB0FF]"
                style={{ fontSize: resources.length > 1 ? 34 : 42, fontWeight: 700, lineHeight: 1.25, marginTop: 6 }}
              >
                {r.label} ↗
              </a>
            ))}
            <div className="truncate" style={{ fontSize: 26, color: '#8A93A0', marginTop: 8 }}>{shortUrl(primary.url)}</div>
          </div>
        </div>
      )}

      <Card eyebrow={topic.section || `Topic ${num}`}>
        <div style={{ fontSize: fit(topic.title, [[40, 72], [70, 62], [110, 52]], 44), fontWeight: 800, lineHeight: 1.18 }}>
          {topic.title}
        </div>
        {desc && (
          <div style={{ fontSize: fit(desc + topic.title.repeat(2), [[220, 48], [330, 42], [450, 36], [580, 32]], 28), lineHeight: 1.5, marginTop: 44, color: '#222' }}>
            {desc}
          </div>
        )}
        {topic.presenter && (
          <div style={{ fontSize: 30, fontWeight: 600, color: '#1466C4', marginTop: 32 }}>
            Presented by {topic.presenter}
          </div>
        )}
      </Card>
    </Stage>
  );
}

function DemoSlide({ slide }: { slide: Extract<Slide, { kind: 'demo' }> }) {
  const demo = slide.demo;
  return (
    <Stage>
      {/* Big overlapping stars, like the printed demo slide */}
      <Star size={1300} color="#0B2A4E" style={{ position: 'absolute', left: -260, top: -60, opacity: 0.9 }} />
      <Star size={1100} color="#0A2240" style={{ position: 'absolute', left: 900, top: 260, opacity: 0.9 }} />
      <Star size={700} color="#123A68" style={{ position: 'absolute', left: -120, top: 520, opacity: 0.55 }} />
      <Wordmark size={40} style={{ position: 'absolute', right: 96, top: 96 }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ padding: '0 120px' }}>
        <div className="uppercase" style={{ ...CONDENSED, fontWeight: 700, fontSize: 52, letterSpacing: '0.12em', color: '#CFE4FF' }}>
          Featured Pioneer
        </div>
        <div className="uppercase" style={{ ...CONDENSED, fontWeight: 900, fontSize: 300, lineHeight: 0.9, color: '#DCEBFF', marginTop: 12 }}>
          Demo
        </div>
        {demo && (
          <>
            <div style={{ ...CONDENSED, fontWeight: 800, fontSize: 96, lineHeight: 1.05, marginTop: 40 }}>{demo.presenter}</div>
            {demo.title && (
              <div style={{ fontSize: fit(demo.title, [[60, 48], [110, 40]], 34), color: '#B8C8DC', marginTop: 20, maxWidth: 1400 }}>
                {demo.title}
              </div>
            )}
          </>
        )}
      </div>
    </Stage>
  );
}

export function SlideView({ slide, event }: { slide: Slide; event: MeetupEvent }) {
  switch (slide.kind) {
    case 'connect':
      return <ConnectSlide slide={slide} event={event} />;
    case 'welcome':
      return <WelcomeSlide />;
    case 'venue':
      return <VenueSlide slide={slide} />;
    case 'topic':
      return <TopicSlide slide={slide} />;
    case 'demo':
      return <DemoSlide slide={slide} />;
  }
}
