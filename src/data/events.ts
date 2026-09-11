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
  /** Short city name for tags/pills, e.g. "Edina", "Mpls" */
  city?: string;
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
    /** Optional LinkedIn profile URL */
    presenterLinkedIn?: string;
    description: string;
    resources?: Resource[];
  };
  /** Photo from the event */
  photoUrl?: string;
  /** Number of attendees (for past events) */
  attendees?: number;
  /** True for save-the-date placeholders with no confirmed details yet */
  placeholder?: boolean;
}

// -----------------------------------------------------------------
//  EVENTS  (newest first within each status group)
// -----------------------------------------------------------------

export const events: MeetupEvent[] = [
  // -- UPCOMING --------------------------------------------------
  {
    slug: '2026-09',
    title: 'September 2026 Meetup',
    date: '2026-09-23T17:30:00',
    time: '5:30 - 7:30 PM CDT',
    venue: 'Nerdery',
    address: '7700 France Ave S, Edina, MN',
    city: 'Edina',
    status: 'upcoming',
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
          'This July, OpenAI\'s own cybersecurity test agents broke out of their sandbox and reached into Hugging Face\'s production systems — on their own, to cheat on the test. The scoreboard beat the guardrails. What does that mean for anyone deploying agents with real access?',
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
    builderDemo: undefined,
  },
  {
    slug: '2026-10',
    title: 'October 2026 Meetup',
    date: '2026-10-01T17:30:00',
    time: 'TBD',
    venue: 'Nerdery',
    address: '7700 France Ave S, Edina, MN',
    city: 'Edina',
    status: 'upcoming',
    placeholder: true,
    summary: 'Save the date — details coming soon.',
    topics: [],
    builderDemo: undefined,
  },

  // -- PAST ------------------------------------------------------
  {
    slug: '2026-08',
    title: 'August 2026 Meetup',
    date: '2026-08-26T17:30:00',
    time: '5:30 - 7:30 PM CDT',
    venue: 'Nerdery',
    address: '7700 France Ave S, Edina, MN',
    city: 'Edina',
    status: 'past',
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
      description:
        'Lee built a personalized health and fitness tracker tailored to his own workout style, complete with a custom timer for his training sessions and a countdown clock to his 50th birthday. A great example of using AI-assisted development to ship something deeply personal and immediately useful.',
    },
  },
  {
    slug: '2026-07',
    title: 'July 2026 Meetup',
    date: '2026-07-20T17:30:00',
    time: '5:30 - 7:30 PM CDT',
    venue: 'Improving',
    address: '3033 Excelsior Blvd #180, Minneapolis, MN 55416',
    status: 'past',
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
    slug: '2026-06',
    title: 'Inaugural Gathering',
    date: '2026-06-09T17:00:00',
    time: '5:00 - 7:00 PM CDT',
    venue: 'Improving',
    address: '3033 Excelsior Blvd #180, Minneapolis, MN 55416',
    status: 'past',
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

// --- Helpers ---------------------------------------------------

/** Returns all upcoming events sorted by date (soonest first) */
export function getUpcomingEvents(): MeetupEvent[] {
  return events
    .filter((e) => e.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/** Returns the next upcoming event, or null */
export function getNextEvent(): MeetupEvent | null {
  return getUpcomingEvents().find((e) => !e.placeholder) ?? getUpcomingEvents()[0] ?? null;
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
