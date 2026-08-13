// -----------------------------------------------------------------
//  Northstar Pioneers -- Event Data
//
//  HOW TO ADD AN EVENT
//  1. Copy one of the objects below.
//  2. Set `status` to "upcoming" for future events, "past" for completed ones.
//  3. Add topics, demos, and resources (slides, links, etc.).
//  4. Set `slug` to a URL-friendly identifier (e.g. "2025-08").
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
    /** Optional URL for the presenter's website/portfolio */
    presenterUrl?: string;
    /** Optional Telegram handle (without @) */
    presenterTelegram?: string;
    description: string;
    resources?: Resource[];
  };
  /** Photo from the event */
  photoUrl?: string;
  /** Number of attendees (for past events) */
  attendees?: number;
}

// -----------------------------------------------------------------
//  EVENTS  (newest first within each status group)
// -----------------------------------------------------------------

export const events: MeetupEvent[] = [
  // -- UPCOMING --------------------------------------------------
  {
    slug: '2026-08',
    title: 'August 2026 Meetup',
    date: '2026-08-26T17:30:00',
    time: '5:30 - 7:30 PM CDT',
    venue: 'Nerdery',
    address: '7700 France Ave S, Edina, MN',
    status: 'upcoming',
    meetupUrl: 'https://www.meetup.com/northstar-pioneers/events/',
    summary:
      'Our monthly gathering -- Socratic news review, builder demo, and open networking. Pizza provided.',
    topics: [],
    builderDemo: undefined,
  },

  // -- PAST ------------------------------------------------------
  {
    slug: '2026-07',
    title: 'July 2026 Meetup',
    date: '2026-07-20T17:30:00',
    time: '5:30 - 7:30 PM CDT',
    venue: 'Nerdery',
    address: '7700 France Ave S, Edina, MN',
    status: 'past',
    meetupUrl: 'https://www.meetup.com/northstar-pioneers/events/315300557/',
    summary:
      'Socratic deep-dive on who thrives in the AI age, what is happening inside Claude\'s mind, loop engineering, and just how few people are actually building with AI.',
    topics: [
      {
        title: 'Who Will Thrive in the AI Age?',
        description:
          'David Brooks argues the differentiator is not intelligence -- it\'s your relationship to mental effort.',
        expandedContent: [
          'Research from ActivTrak across 10,000+ workers found that AI adoption made work more intense, not less -- email time doubled, business software use rose 94%. The time saved gets filled with more tasks.',
          'Brooks identifies three groups: Productive Passengers (low cognition, higher output but hollowing out), Reluctant Optimizers (good intentions, but seduced into over-reliance), and Mental Marathoners (high need for cognition, actively use AI to expand capacity rather than replace effort).',
          'Key finding: brain connectivity drops up to 55% when using ChatGPT vs. doing the same task unassisted (MIT Media Lab). A study of endoscopists saw lesion detection fall from 28.4% to 22.4% after AI dependency then removal.',
          'The prescription: ask for hints not answers, start with a blank page before consulting AI, rotate AI and non-AI tasks, and treat AI as a "brilliant librarian" rather than an oracle.',
        ],
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
          'Anthropic researchers found evidence of a "J-space" -- a privileged internal workspace in Claude analogous to conscious access in the human brain.',
        expandedContent: [
          'The "Jacobian lens" technique maps internal neural patterns that are uniquely reportable, controllable, and causally involved in multi-step reasoning. This small collection is called the J-space.',
          'The J-space was not designed in -- it emerged on its own during training. It holds only a few dozen concepts at a time and accounts for less than a tenth of Claude\'s total internal processing.',
          'Key experiment: swapping "spider" for "ant" in the J-space caused Claude to answer "6 legs" instead of "8." Swapping "France" for "China" changed the capital, language, continent, and currency answers across four independent prompts -- proving a shared broadcasting hub.',
          'Practical application: researchers can now catch Claude privately noticing it is being tested, flagging prompt injections, or pursuing hidden goals -- by reading the J-space rather than the model\'s output.',
        ],
        expandedImageUrl: 'https://www-cdn.anthropic.com/images/4zrzovbb/website/0ab926f491beb999ece405a03cc7684730156905-3824x2640.png',
        expandedImageAlt: 'Diagram showing J-space internal thoughts that do not appear in Claude\'s output',
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
          'The Claude Code team defines loops as agents repeating cycles of work until a stop condition is met -- and categorizes four distinct types.',
        expandedContent: [
          'Turn-based loops: you direct every turn. Best for exploration and short tasks. Improve them by encoding your manual verification steps into a SKILL.md file so Claude can check its own work end-to-end.',
          '/goal loops: you define a verifiable success condition; an evaluator keeps sending Claude back until it\'s met. Best for tasks with deterministic exit criteria -- "get the Lighthouse score to 90 or above, stop after 5 tries."',
          '/loop and /schedule (time-based): re-run a prompt on an interval. Best for recurring work or monitoring external systems like a PR waiting for CI or code review feedback.',
          'Proactive loops: triggered by events or schedule with no human in the loop. Compose /schedule, /goal, skills, and dynamic workflows for long-running streams of well-defined work like bug triage or dependency upgrades.',
          'Quality tip: use a second agent for code review -- a reviewer with fresh context is less biased and not influenced by the main agent\'s reasoning. Start simple; not all tasks need complex loops.',
        ],
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
          'Of 8.1 billion humans, only ~15-35 million pay for AI. The market is not crowded -- it has barely started.',
        expandedContent: [
          'Each dot in the viral image represents 3.2 million people. 2,500 dots = 8.1 billion humans. Grey: 6.8B who have never used AI. Green: 1.3B free chatbot users. Yellow: 15-35M who pay for it. The red sliver is the builder/developer community.',
          'Counter-argument raised in discussion: 2.2B have no internet, ~2B are children or elderly, ~2.5B are blue-collar workers where AI tools are not yet relevant -- narrowing the realistic addressable market to roughly 500-700M knowledge workers.',
          'The sharpest observation from the thread: "the gap between using AI and building with AI is bigger than the gap between not using AI at all." Most of that 1.3B free-user group is asking ChatGPT to write emails.',
        ],
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
          '"The new development cycle in one image" -- a single post sparked group discussion on what AI-native engineering looks like in 2026.',
        expandedContent: [
          'The image by @krishdotdev compresses the shift in how software gets built: ideate, spec, generate, verify, iterate -- with AI collapsing the middle steps but the human still owning the front (intent) and back (judgment).',
          'Notable reply in the thread: "AI conveniently cropped the orange section. Otherwise, it would\'ve been the same pain in the ass." The last 20% of quality still costs 80% of the effort.',
          'Group takeaway: the loop engineering patterns from Anthropic map directly onto this cycle -- the /goal primitive handles the "verify" layer, dynamic workflows handle the "generate" layer, and the human prompt remains the irreducible creative input.',
        ],
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
    slug: '2026-06',
    title: 'Inaugural Gathering',
    date: '2026-06-09T17:00:00',
    time: '5:00 - 7:00 PM CDT',
    venue: 'Improving',
    address: '3033 Excelsior Blvd #180, Minneapolis, MN 55416',
    status: 'past',
    meetupUrl: 'https://www.meetup.com/northstar-pioneers/events/314465552/',
    summary:
      'The first Northstar Pioneers gathering -- an introduction to the collective and a Socratic kick-off on where AI is actually heading.',
    attendees: 25,
    topics: [
      {
        title: 'Where AI is Actually Heading',
        description:
          'What separates genuine capability improvements from hype cycles -- examining the last 18 months through a critical lens.',
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
        'A retrieval-augmented generation pipeline that ingests PDFs, images, and web pages -- live demo with Q&A.',
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

// --- Helpers ---------------------------------------------------

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
