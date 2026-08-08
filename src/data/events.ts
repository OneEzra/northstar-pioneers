// ─────────────────────────────────────────────────────────────────
//  Northstar Pioneers — Event Data
//
//  HOW TO ADD AN EVENT
//  1. Copy one of the objects below.
//  2. Set `status` to "upcoming" for future events, "past" for completed ones.
//  3. Add topics, demos, and resources (slides, links, etc.).
//  4. Set `slug` to a URL-friendly identifier (e.g. "2025-08").
//
//  RESOURCE TYPES
//   "slides"  — slide deck (HTML, PDF, PPTX, PNG)
//   "video"   — recording link
//   "link"    — article, repo, or external resource
//   "demo"    — live demo URL
//   "speaker" — speaker profile / bio
// ─────────────────────────────────────────────────────────────────

export type ResourceType = 'slides' | 'video' | 'link' | 'demo' | 'speaker';

export interface Resource {
  type: ResourceType;
  label: string;
  url: string;
}

export interface Topic {
  title: string;
  description?: string;
  resources?: Resource[];
  /** Who presented / led discussion */
  presenter?: string;
}

export interface MeetupEvent {
  slug: string;
  /** Display title, e.g. "August 2025 Meetup" */
  title: string;
  /** ISO 8601 date-time, e.g. "2025-08-18T17:00:00" */
  date: string;
  /** Human-readable time range */
  time: string;
  venue: string;
  address: string;
  status: 'upcoming' | 'past';
  meetupUrl?: string;
  /** Short summary shown on the card */
  summary: string;
  /** Socratic news topics discussed */
  topics: Topic[];
  /** Featured builder demo */
  builderDemo?: {
    title: string;
    presenter: string;
    description: string;
    resources?: Resource[];
  };
  /** Photo from the event */
  photoUrl?: string;
  /** Number of attendees (for past events) */
  attendees?: number;
}

// ─────────────────────────────────────────────────────────────────
//  EVENTS  (newest first within each status group)
// ─────────────────────────────────────────────────────────────────

export const events: MeetupEvent[] = [
  // ── UPCOMING ──────────────────────────────────────────────────
  {
    slug: '2026-09',
    title: 'September 2026 Meetup',
    date: '2026-09-21T17:00:00',
    time: '5:00 – 7:00 PM CDT',
    venue: 'Improving',
    address: '3033 Excelsior Blvd #180, Minneapolis, MN 55416',
    status: 'upcoming',
    meetupUrl: 'https://www.meetup.com/northstar-pioneers/events/',
    summary:
      'Our monthly gathering — Socratic news review, builder demo, and open networking. Pizza provided.',
    topics: [],
    builderDemo: undefined,
  },

  // ── PAST ──────────────────────────────────────────────────────
  {
    slug: '2025-07',
    title: 'July 2025 Meetup',
    date: '2025-07-20T17:30:00',
    time: '5:30 – 7:30 PM CDT',
    venue: 'Improving',
    address: '3033 Excelsior Blvd #180, Minneapolis, MN 55416',
    status: 'past',
    meetupUrl: 'https://www.meetup.com/northstar-pioneers/events/315300557/',
    summary:
      'Socratic deep-dive on autonomous agents, AI-native tooling, and the emerging compute frontier.',
    attendees: 12,
    topics: [
      {
        title: 'Autonomous Agents in Production',
        description:
          "Discussion on real-world agentic workflows — what's working, what's failing, and where the moats are forming.",
        resources: [
          {
            type: 'link',
            label: 'Anthropic: Building Effective Agents',
            url: 'https://www.anthropic.com/research/building-effective-agents',
          },
        ],
      },
      {
        title: 'AI-Native Development Tools',
        description:
          'How coding assistants are reshaping the software development lifecycle — pair programming, code review, and test generation.',
        resources: [
          {
            type: 'link',
            label: 'GitHub Copilot Workspace Overview',
            url: 'https://github.com/features/copilot',
          },
        ],
      },
      {
        title: 'The Compute Frontier',
        description:
          'GPU scarcity, inference costs, and the next wave of inference-optimized hardware.',
      },
    ],
    builderDemo: {
      title: 'Local LLM Setup on Consumer Hardware',
      presenter: 'Community Member',
      description:
        'A walkthrough of running 70B-class models locally using Ollama + llama.cpp on a consumer GPU, benchmarked against API providers.',
      resources: [
        {
          type: 'link',
          label: 'Ollama',
          url: 'https://ollama.com',
        },
      ],
    },
  },

  {
    slug: '2025-06',
    title: 'Inaugural Gathering',
    date: '2025-06-09T17:00:00',
    time: '5:00 – 7:00 PM CDT',
    venue: 'Improving',
    address: '3033 Excelsior Blvd #180, Minneapolis, MN 55416',
    status: 'past',
    meetupUrl: 'https://www.meetup.com/northstar-pioneers/events/314465552/',
    summary:
      'The first Northstar Pioneers gathering — an introduction to the collective and a Socratic kick-off on where AI is actually heading.',
    attendees: 25,
    topics: [
      {
        title: 'Where AI is Actually Heading',
        description:
          'What separates genuine capability improvements from hype cycles — examining the last 18 months through a critical lens.',
      },
      {
        title: 'Sovereign AI & the Compute Question',
        description:
          'Centralized vs. decentralized AI: who controls the model weights, the data, and the inference layer?',
        resources: [
          {
            type: 'link',
            label: 'Why Open Source AI Is the Path Forward',
            url: 'https://www.wired.com/story/open-source-ai-is-the-path-forward/',
          },
        ],
      },
      {
        title: 'Introductions & Pioneer Lightning Round',
        description:
          'Each attendee shares what they\'re building, exploring, or burning to talk about.',
      },
    ],
    builderDemo: {
      title: 'Multi-Modal RAG Pipeline',
      presenter: 'Community Member',
      description:
        'A retrieval-augmented generation pipeline that ingests PDFs, images, and web pages — live demo with Q&A.',
      resources: [
        {
          type: 'link',
          label: 'LangChain Docs',
          url: 'https://docs.langchain.com',
        },
      ],
    },
  },
];

// ─── Helpers ───────────────────────────────────────────────────

/** Returns the next upcoming event, or null */
export function getNextEvent(): MeetupEvent | null {
  const now = new Date();
  const upcoming = events
    .filter((e) => e.status === 'upcoming' && new Date(e.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return upcoming[0] ?? null;
}

/** Returns all past events, newest first */
export function getPastEvents(): MeetupEvent[] {
  return events
    .filter((e) => e.status === 'past')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Find an event by slug */
export function getEventBySlug(slug: string): MeetupEvent | undefined {
  return events.find((e) => e.slug === slug);
}

/** Format a date string for display, e.g. "Monday, June 9, 2025" */
export function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Format a date string to short form, e.g. "Jun 9" */
export function formatEventDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/** Format just the month+year, e.g. "June 2025" */
export function formatEventMonth(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}
