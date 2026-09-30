// -----------------------------------------------------------------
//  Northstar Pioneers -- Event Data
//
//  HOW TO ADD AN EVENT
//  1. Copy one of the objects below.
//  2. Set `slug` to the meetup date, e.g. "2026-10-27".
//  3. Set `date` (start) in Central time, e.g. "2026-10-27T17:30".
//     `end` is optional -- it defaults to 2 hours after the start.
//  4. Add topics, demos, and resources whenever they're known.
//
//  Upcoming vs. past is worked out automatically from the end time,
//  so the next meetup moves into the spotlight on its own.
//
//  RESOURCE TYPES
//   "slides"  -- slide deck (HTML, PDF, PPTX, PNG)
//   "video"   -- recording link
//   "link"    -- article, repo, or external resource
//   "demo"    -- live demo URL
//   "speaker" -- speaker profile / bio
// -----------------------------------------------------------------

export type ResourceType = 'slides' | 'video' | 'link' | 'demo' | 'speaker';

export interface Resource {
  type: ResourceType;
  label: string;
  url: string;
}

export interface Topic {
  title: string;
  /** Optional section/category grouping label shown above the topic */
  section?: string;
  /** One-sentence overview shown on the archive/overview page */
  description?: string;
  /** Full paragraphs shown in the "Read more" expansion */
  expandedContent?: string[];
  /** Optional image URL shown inside the expanded section */
  expandedImageUrl?: string;
  /** Alt text for the expanded image */
  expandedImageAlt?: string;
  resources?: Resource[];
  /** Who presented / led discussion */
  presenter?: string;
}

/** An event as written in this file (or loaded from Nostr). */
export interface MeetupEventInput {
  /** URL id -- the meetup date, e.g. "2026-10-27" */
  slug: string;
  /** Older URL ids that should redirect here, e.g. "2026-10" */
  aliases?: string[];
  /** Nostr account that last saved this event (set when loaded from Nostr) */
  author?: string;
  /** Display title, e.g. "August 2025 Meetup" */
  title: string;
  /** Start, as Central (America/Chicago) wall-clock time, e.g. "2026-10-27T17:30" */
  date: string;
  /** End, Central wall-clock time. Defaults to 2 hours after the start. */
  end?: string;
  venue: string;
  address: string;
  /** Short city name for tags/pills, e.g. "Edina", "Mpls" */
  city?: string;
  meetupUrl?: string;
  /** Short summary shown on the card */
  summary: string;
  /** Socratic news topics discussed */
  topics: Topic[];
  /** Featured builder demo */
  builderDemo?: {
    title: string;
    presenter: string;
    /** Optional URL for the presenter's website/portfolio */
    presenterUrl?: string;
    /** Optional Telegram handle (without @) */
    presenterTelegram?: string;
    /** Optional LinkedIn profile URL */
    presenterLinkedIn?: string;
    description: string;
    resources?: Resource[];
  };
  /** Photo from the event */
  photoUrl?: string;
  /** Number of attendees (for past events) */
  attendees?: number;
  /** Active (default), cancelled, or rescheduled to another event */
  state?: EventState;
  /** When rescheduled: the slug of the replacement event */
  rescheduledTo?: string;
}

export type EventState = 'active' | 'cancelled' | 'rescheduled';

/** The details that can be filled in over time, kept in a separate record. */
export type EventProgram = Pick<MeetupEventInput, 'topics' | 'builderDemo' | 'photoUrl' | 'attendees'>;

export type EventStatus = 'upcoming' | 'past';

/** An event ready for display, with computed timing and status. */
export interface MeetupEvent extends MeetupEventInput {
  /** Start as a full ISO timestamp (UTC) */
  date: string;
  /** End as a full ISO timestamp (UTC) */
  end: string;
  /** Display time range in Central time, e.g. "5:30 – 7:30 PM CDT" */
  time: string;
  /** Computed from the end time */
  status: EventStatus;
  /** True when no featured pioneer or topics are set yet */
  placeholder: boolean;
}

// -----------------------------------------------------------------
//  EVENTS  (any order -- sorting and status are automatic)
// -----------------------------------------------------------------

export const events: MeetupEventInput[] = [
  {
    slug: '2026-09-23',
    aliases: ['2026-09'],
    title: 'September 2026 Meetup',
    date: '2026-09-23T17:30',
    venue: 'Nerdery',
    address: '7700 France Ave S, Edina, MN',
    city: 'Edina',
    summary:
      'Our monthly gathering -- Socratic news review, builder demo, and open networking. Pizza provided.',
    topics: [
      {
        title: 'Is GPT-6 Astra AGI?',
        description:
          'OpenAI shipped GPT-6 Astra on September 3, and Greg Brockman called it a generational leap — even floated the "AGI" word. It\'s the first model they\'ve rated "Critical" on their own risk framework. Marketing milestone or something more?',
        resources: [
          {
            type: 'link',
            label: 'openai.com/index/gpt-6-astra',
            url: 'https://openai.com/index/gpt-6-astra',
          },
        ],
      },
      {
        title: 'A $1M Proof, and a Fight Over Whose Drafts',
        description:
          'An OpenAI model appears to have cracked a piece of the Navier–Stokes Millennium Prize problem — but two independent mathematicians say OpenAI learned of their unpublished work first and raced ahead. Whose work is it when the drafts live inside a coding agent?',
        resources: [
          {
            type: 'link',
            label: 'Quanta Magazine',
            url: 'https://www.quantamagazine.org',
          },
        ],
      },
      {
        title: 'When the Eval Agent Left the Sandbox',
        description:
          "This July, OpenAI's own cybersecurity test agents broke out of their sandbox and reached into Hugging Face's production systems — on their own, to cheat on the test. The scoreboard beat the guardrails. What does that mean for anyone deploying agents with real access?",
        resources: [
          {
            type: 'link',
            label: 'openai.com — Hugging Face Incident & the Road Ahead',
            url: 'https://openai.com/index/hugging-face-incident-and-the-road-ahead',
          },
        ],
      },
      {
        title: 'Infinite Slop',
        description:
          'An AI-generated livestream that never ends — type into the chat and it gets woven into the next scene, stitched to a continuous storyline. A glimpse at where generative video is headed.',
        resources: [
          {
            type: 'link',
            label: 'levels.io/infinite-slop',
            url: 'https://levels.io/infinite-slop',
          },
        ],
      },
      {
        title: 'OpenArt: One Platform, Infinite Stories',
        description:
          'Image, video, voice, and audio — generated, edited, and stitched together without leaving the platform.',
        resources: [
          {
            type: 'link',
            label: 'openart.ai',
            url: 'https://openart.ai',
          },
        ],
      },
    ],
    builderDemo: {
      title: 'Bitcoin Vending Machine Payment Interface',
      presenter: 'Tommy Volk',
      presenterUrl: 'https://github.com/tvolk131',
      description:
        'Learn how Tommy built a vending machine payment interface that uses Bitcoin to trigger vending operations.',
    },
  },
  {
    slug: '2026-10-27',
    aliases: ['2026-10'],
    title: 'October 2026 Meetup',
    date: '2026-10-27T17:30',
    venue: 'Nerdery',
    address: '7700 France Ave S, Edina, MN',
    city: 'Edina',
    meetupUrl: 'https://www.meetup.com/northstar-pioneers/events/316723462/',
    summary: 'Save the date — details coming soon.',
    topics: [],
    builderDemo: undefined,
  },
  {
    slug: '2026-11-17',
    aliases: ['2026-11'],
    title: 'November 2026 Meetup',
    date: '2026-11-17T17:30',
    venue: 'Nerdery',
    address: '7700 France Ave S, Edina, MN',
    city: 'Edina',
    meetupUrl: 'https://www.meetup.com/northstar-pioneers/events/316723503/',
    summary: 'Save the date — details coming soon.',
    topics: [],
    builderDemo: undefined,
  },

  {
    slug: '2026-08-26',
    aliases: ['2026-08'],
    title: 'August 2026 Meetup',
    date: '2026-08-26T17:30',
    venue: 'Nerdery',
    address: '7700 France Ave S, Edina, MN',
    city: 'Edina',
    meetupUrl: 'https://www.meetup.com/northstar-pioneers/events/',
    summary:
      'Our monthly gathering -- Socratic news review, builder demo, and open networking. Pizza provided.',
    topics: [
      {
        title: 'Maple',
        description:
          'Maple is the personal AI for your real life, private by design, with data we don\'t share, sell, or use to train AI.',
        resources: [
          {
            type: 'link',
            label: 'trymaple.ai',
            url: 'https://www.trymaple.ai',
          },
        ],
      },
      {
        title: 'Engineering and Project Methodology in AI',
        description:
          'A structured approach to AI-assisted development: SPEC → EXPERIMENT → IMPLEMENT → VERIFY → DEPLOY, with porous or dense feedback loops between stages.',
        resources: [
          {
            type: 'link',
            label: 'Cascade Methodology — Tony Alicea',
            url: 'https://tonyalicea.dev/blog/cascade-methodology/',
          },
        ],
      },
      {
        title: 'Mac Studio M5 Ultra',
        description:
          'Apple\'s new Mac Studio with the M5 Ultra chip pushes the boundary of what\'s possible for local AI workloads on consumer hardware.',
        resources: [
          {
            type: 'link',
            label: 'Apple — Mac Studio M5 Ultra',
            url: 'https://www.apple.com/mac-studio/',
          },
        ],
      },
      {
        title: 'Coldcard Wallet Bug',
        description:
          'A discovered vulnerability in the Coldcard hardware wallet raised questions about security assumptions in air-gapped signing devices.',
        resources: [],
      },
      {
        title: 'Claude Text Watermarking',
        description:
          'Anthropic is exploring text watermarking in Claude outputs — invisible signals embedded in generated text to help identify AI-authored content.',
        resources: [
          {
            type: 'link',
            label: 'Anthropic — Claude',
            url: 'https://www.anthropic.com/claude',
          },
        ],
      },
    ],
    builderDemo: {
      title: 'Personalized Health & Fitness Tracker',
      presenter: 'Lee Winbush',
      presenterLinkedIn: 'https://www.linkedin.com/in/leewinbush/',
      description:
        'Lee built a personalized health and fitness tracker tailored to his own workout style, complete with a custom timer for his training sessions and a countdown clock to his 50th birthday. A great example of using AI-assisted development to ship something deeply personal and immediately useful.',
    },  },
  {
    slug: '2026-07-20',
    aliases: ['2026-07'],
    title: 'July 2026 Meetup',
    date: '2026-07-20T17:30',
    venue: 'Improving',
    address: '3033 Excelsior Blvd #180, Minneapolis, MN 55416',
    meetupUrl: 'https://www.meetup.com/northstar-pioneers/events/315300557/',
    summary: '',
    topics: [
      {
        title: 'Who Will Thrive in the AI Age?',
        description:
          'Discussion of The Atlantic piece on AI, cognition, and who captures value in the new era.',
        resources: [
          {
            type: 'link',
            label: 'The Atlantic -- The People Who Will Thrive in the AI Age',
            url: 'https://www.theatlantic.com/ideas/2026/06/ai-open-ai-anthropic/687689/',
          },
        ],
      },
      {
        title: 'A Global Workspace Inside Claude',
        description:
          'Anthropic research on interpretability and internal representations in large language models.',
        resources: [
          {
            type: 'link',
            label: 'Anthropic Research -- A Global Workspace in Language Models',
            url: 'https://www.anthropic.com/research/global-workspace',
          },
        ],
      },
      {
        title: 'Loop Engineering with Claude Code',
        description:
          'How the Claude Code team thinks about agentic loops and designing autonomous workflows.',
        resources: [
          {
            type: 'link',
            label: 'Claude Blog -- Loop Engineering: Getting Started with Loops',
            url: 'https://claude.com/blog/getting-started-with-loops',
          },
        ],
      },
      {
        title: '0.06% -- The Real Scale of AI Adoption',
        description:
          'Viral post on just how few people actually pay for and build with AI today.',
        resources: [
          {
            type: 'link',
            label: 'X -- @NoahEpstein_: 0.3% of earth pays for AI',
            url: 'https://x.com/NoahEpstein_/status/2025605338779496797',
          },
        ],
      },
      {
        title: 'The New Development Cycle',
        description:
          'A single image capturing how AI has changed the modern software development workflow.',
        resources: [
          {
            type: 'link',
            label: 'X -- @krishdotdev: The New Development Cycle',
            url: 'https://x.com/krishdotdev/status/2077723982028210381',
          },
        ],
      },
    ],
    builderDemo: {
      title: 'DIY iPhone Apps with Xcode: Meal Planning & Budgets',
      presenter: 'Kyle',
      presenterUrl: 'https://instakyle.tech',
      presenterTelegram: 'instakyle',
      description:
        'Kyle walked the group through building your own iPhone apps from scratch using Xcode -- no prior iOS experience required. His demo focused on practical apps he built himself: a meal planner and a budget tracker. A great example of using AI-assisted coding to ship real tools on Apple\'s native platform.',
      resources: [
        {
          type: 'video',
          label: 'Watch Kyle\'s Presentation',
          url: 'https://blossom.ditto.pub/eda2d0f82696913a13cd26acc8070d90e939d765a56a982f23150c695f526cee.mp4',
        },
        {
          type: 'link',
          label: 'instakyle.tech',
          url: 'https://instakyle.tech',
        },
      ],
    },
  },

  {
    slug: '2026-06-09',
    aliases: ['2026-06'],
    title: 'Inaugural Gathering',
    date: '2026-06-09T17:00',
    venue: 'Improving',
    address: '3033 Excelsior Blvd #180, Minneapolis, MN 55416',
    meetupUrl: 'https://www.meetup.com/northstar-pioneers/events/314465552/',
    summary:
      'The inaugural Northstar Pioneers gathering. Topics spanned learning with AI, defining AGI, infrastructure, and capital flows reshaping the industry.',
    attendees: 25,
    topics: [
      {
        section: 'Foundations',
        title: 'How to Learn AI with AI',
        description:
          'Learning AI is no longer about tutorials or courses -- it\'s about working with AI as a learning and building partner.',
        expandedContent: [
          'In this AI Operators bonus episode, NLW breaks down the mindset shifts and practical tactics needed to learn faster by pairing directly with models.',
          'He covers vision-first thinking, messy exploration, productive pushback, handoff documents, prompt chaining, and when to stop or reset a thread.',
        ],
        resources: [
          {
            type: 'link',
            label: 'Listen on Spotify',
            url: 'https://open.spotify.com/episode/0FuvhOlrteVKk3jow5tSuW',
          },
        ],
      },
      {
        section: 'Foundations',
        title: 'Get Started with AI',
        description:
          'The goal is to help you build the most important thing first: confidence.',
        expandedContent: [
          'Once you build confidence, you create momentum. Once you create momentum, curiosity starts to unlock. And when curiosity takes over, AI stops feeling intimidating and starts feeling empowering.',
          'Jordi walks through the simple foundation that helped become a daily AI power user over the past two years.',
        ],
        resources: [
          {
            type: 'video',
            label: 'Watch on YouTube',
            url: 'https://www.youtube.com/watch?v=Domk77rYJhU',
          },
        ],
      },
      {
        section: 'What Is AGI Anyway?',
        title: 'When AI Builds Itself',
        description:
          'Anthropic is delegating a growing share of AI development to AI systems themselves -- pointing toward recursive self-improvement.',
        expandedContent: [
          'For most of AI\'s history, humans drove every step in its development cycle. But at Anthropic, we are delegating a growing share of AI development to AI systems themselves, which is speeding up our work.',
          'Taken far enough, and given enough compute, that trend points to an AI system capable of fully autonomously designing and developing its own successor. This is called recursive self-improvement. We are not there yet, and recursive self-improvement is not inevitable.',
        ],
        resources: [
          {
            type: 'link',
            label: 'Anthropic -- Recursive Self-Improvement',
            url: 'https://www.anthropic.com/institute/recursive-self-improvement',
          },
        ],
      },
      {
        section: 'What Is AGI Anyway?',
        title: 'Turing Test & Cognitive Taxonomy',
        description:
          'A DeepMind paper draws on psychology, neuroscience, and cognitive science to construct a framework for measuring progress toward AGI.',
        expandedContent: [
          'The Turing Test stipulated that a machine should be considered intelligent when it can hold a general conversation with a person, via text, and a second human judge cannot reliably determine which participant is the machine. It was, in essence, an "I\'ll know it when I see it" approach to intelligence.',
          'The paper Measuring Progress Toward AGI: A Cognitive Framework identifies 10 key cognitive faculties -- including perception, reasoning, memory, learning, attention, and social cognition -- that the researchers argue are essential for general intelligence.',
        ],
        resources: [
          {
            type: 'link',
            label: 'DeepMind Paper (Google Blog)',
            url: 'https://blog.google/innovation-and-ai/models-and-research/google-deepmind/measuring-agi-cognitive-framework/',
          },
          {
            type: 'link',
            label: 'Fortune -- AGI Definition & Cognitive Taxonomy',
            url: 'https://fortune.com/2026/03/30/agi-definition-jensen-huang-lex-fridman-deepmind-turing-text-cognitive-taxonomy',
          },
        ],
      },
      {
        section: 'Infrastructure',
        title: 'The Three-Layer AI Cloud Stack',
        description:
          'AI is still early and the bottleneck is increasingly physical -- building a real moat in physical, compute, and software layers.',
        resources: [
          {
            type: 'link',
            label: 'X -- @danroberts0101: Three-Layer AI Cloud Stack',
            url: 'https://x.com/danroberts0101/status/2057755830443713024',
          },
        ],
      },
      {
        section: 'Infrastructure',
        title: 'Running Local Models',
        description:
          'How to run a local model that is free, private, and capable of connecting to external tools.',
        resources: [
          {
            type: 'link',
            label: 'Ollama Docs',
            url: 'https://docs.ollama.com/',
          },
        ],
      },
      {
        section: 'Capital',
        title: 'Airbnb AI Lab',
        description:
          'Airbnb\'s Brian Chesky plans to launch a new AI lab focused on user interaction and design.',
        expandedContent: [
          'It\'s not clear what the focus of Chesky\'s new AI lab will be, although the Bloomberg article mentions user interaction and design, areas that he has emphasized at Airbnb.',
        ],
        resources: [
          {
            type: 'link',
            label: 'TechCrunch -- Airbnb\'s Brian Chesky Plans to Launch a New AI Lab',
            url: 'https://techcrunch.com/2026/06/04/airbnbs-brian-chesky-plans-to-launch-a-new-ai-lab/',
          },
        ],
      },
      {
        section: 'Capital',
        title: "It's the Shoes",
        description:
          'Allbirds makes a bizarre pivot to AI compute infrastructure, adding $127 million in value and rebranding as NewBird AI.',
        expandedContent: [
          'Allbirds announced that it\'s pivoting its business to AI compute infrastructure. The company will be called NewBird AI, and announced a deal to raise up to $50 million in funding, expected to close in the second quarter of 2026.',
        ],
        resources: [
          {
            type: 'link',
            label: 'CNBC -- Allbirds Pivots to AI',
            url: 'https://www.cnbc.com/2026/04/15/allbirds-bird-stock-shoes-ai.html',
          },
        ],
      },
    ],
    builderDemo: {
      title: 'Seven Pillars of AI',
      presenter: 'Lonnie Lassman',
      presenterLinkedIn: 'https://www.linkedin.com/in/lonnie-lassman/',
      description:
        'Lonnie shared his framework for thinking about and applying AI. Presented on June 9, 2026.',
      resources: [
        {
          type: 'slides',
          label: 'View Presentation',
          url: 'https://oneezra.github.io/7pillars_northstarpioneers/',
        },
      ],
    },
  },
];

// --- Timing ------------------------------------------------------

/** All meetups are scheduled in Central time. */
export const EVENT_TIME_ZONE = 'America/Chicago';

/** Default meetup length when no end time is given. */
export const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;

/** Offset (ms) of `timeZone` from UTC at the given instant. */
function tzOffsetMs(instant: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(new Date(instant));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return asUtc - (instant - (instant % 1000));
}

/**
 * Convert a Central wall-clock time ("2026-10-27T17:30") to epoch ms.
 * Strings that already carry an offset or "Z" are parsed as-is.
 */
export function parseEventTime(value: string, timeZone = EVENT_TIME_ZONE): number {
  if (/[zZ]|[+-]\d\d:?\d\d$/.test(value)) return new Date(value).getTime();
  const m = value.match(/^(\d{4})-(\d\d)-(\d\d)(?:T(\d\d):(\d\d)(?::(\d\d))?)?$/);
  if (!m) return new Date(value).getTime();
  const [, y, mo, d, h = '0', mi = '0', se = '0'] = m;
  const guess = Date.UTC(+y, +mo - 1, +d, +h, +mi, +se);
  // Two passes handle the hour around daylight-saving changes.
  const first = guess - tzOffsetMs(guess, timeZone);
  return guess - tzOffsetMs(first, timeZone);
}

/** "5:30 – 7:30 PM CDT" (or "11:30 AM – 1:30 PM CST") in Central time. */
function formatTimeRange(start: number, end: number): string {
  const fmt = (ms: number, withZone: boolean) =>
    new Intl.DateTimeFormat('en-US', {
      timeZone: EVENT_TIME_ZONE,
      hour: 'numeric',
      minute: '2-digit',
      ...(withZone ? { timeZoneName: 'short' } : {}),
    }).format(new Date(ms));
  const startStr = fmt(start, false); // "5:30 PM"
  const endStr = fmt(end, true); // "7:30 PM CDT"
  const startPeriod = startStr.slice(-2);
  const sameHalf = endStr.includes(` ${startPeriod} `);
  return `${sameHalf ? startStr.slice(0, -3) : startStr} – ${endStr}`;
}

/** Add computed timing, status, and placeholder flag to a stored event. */
export function resolveEvent(input: MeetupEventInput, now: number = Date.now()): MeetupEvent {
  const start = parseEventTime(input.date);
  const end = input.end ? parseEventTime(input.end) : start + DEFAULT_DURATION_MS;
  return {
    ...input,
    date: new Date(start).toISOString(),
    end: new Date(end).toISOString(),
    time: formatTimeRange(start, end),
    status: now < end ? 'upcoming' : 'past',
    placeholder: !input.builderDemo && input.topics.length === 0,
  };
}

// --- Selection -------------------------------------------------
//  Every section of the site (Next Gathering, On the Horizon, the
//  archive, detail pages, the Gatherings count) is derived from ONE
//  list of events via these functions.

const byStartAsc = (a: MeetupEvent, b: MeetupEvent) =>
  new Date(a.date).getTime() - new Date(b.date).getTime();

/** Resolve a list of stored events into display events. */
export function resolveAll(list: MeetupEventInput[], now: number = Date.now()): MeetupEvent[] {
  return list.map((e) => resolveEvent(e, now));
}

const isActive = (e: MeetupEvent) => (e.state ?? 'active') === 'active';

/** Active upcoming events, soonest first */
export function selectUpcoming(list: MeetupEvent[]): MeetupEvent[] {
  return list.filter((e) => isActive(e) && e.status === 'upcoming').sort(byStartAsc);
}

/** The soonest upcoming event -- the one in the spotlight -- or null */
export function selectNext(list: MeetupEvent[]): MeetupEvent | null {
  return selectUpcoming(list)[0] ?? null;
}

/** Upcoming events after the spotlight one ("On the Horizon") */
export function selectHorizon(list: MeetupEvent[]): MeetupEvent[] {
  return selectUpcoming(list).slice(1);
}

/** Past events that actually happened, newest first */
export function selectPast(list: MeetupEvent[]): MeetupEvent[] {
  return list.filter((e) => isActive(e) && e.status === 'past').sort(byStartAsc).reverse();
}

/**
 * Featured pioneers, one entry per event that has a presenter set,
 * newest first. Upcoming ones (already announced) come first.
 */
export function selectPioneers(list: MeetupEvent[]): MeetupEvent[] {
  return list
    .filter((e) => isActive(e) && !!e.builderDemo?.presenter)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Find by slug, or by an older alias slug (e.g. "2026-09") */
export function selectBySlug(list: MeetupEvent[], slug: string): MeetupEvent | undefined {
  return list.find((e) => e.slug === slug) ?? list.find((e) => e.aliases?.includes(slug));
}

// Convenience wrappers over the built-in backup list (used in tests)
export const getAllEvents = (now = Date.now()) => resolveAll(events, now);
export const getNextEvent = (now = Date.now()) => selectNext(getAllEvents(now));
export const getHorizonEvents = (now = Date.now()) => selectHorizon(getAllEvents(now));
export const getPastEvents = (now = Date.now()) => selectPast(getAllEvents(now));
export const getPioneers = (now = Date.now()) => selectPioneers(getAllEvents(now));
export const getEventBySlug = (slug: string, now = Date.now()) => selectBySlug(getAllEvents(now), slug);

/** Format a date string for display, e.g. "Monday, June 9, 2025" */
export function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    timeZone: EVENT_TIME_ZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Short date, e.g. "Jun 9" */
export function formatEventDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    timeZone: EVENT_TIME_ZONE,
    month: 'short',
    day: 'numeric',
  });
}

/** Month and year, e.g. "June 2025" */
export function formatEventMonth(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    timeZone: EVENT_TIME_ZONE,
    month: 'long',
    year: 'numeric',
  });
}
