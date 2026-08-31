export const SITE = {
  name: 'Ojú',
  tagline: 'Design, product and engineering studio',
  city: 'Lagos',
  country: 'Nigeria',
  timezone: 'Africa/Lagos',
  // TODO: real address once the domain is registered.
  email: 'hello@oju.studio',
  description:
    'Ojú is a design, product and engineering studio in Lagos. Interfaces, brand systems, ' +
    'and the software underneath, drawn and shipped by one team.',
} as const;

export const NAV = [
  { label: 'Work', href: '/work' },
  { label: 'Studio', href: '/studio' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
] as const;

export const CAPABILITIES = [
  {
    num: '01',
    id: 'design',
    title: 'Design',
    line: 'From a first identity to a design system a team can actually hold on to.',
    items: ['UI/UX design', 'Brand & identity', 'Motion & graphics', 'Design systems', 'Figma libraries'],
  },
  {
    num: '02',
    id: 'product',
    title: 'Product',
    line: 'From a vague ambition to a scope somebody can actually build against.',
    items: ['Discovery & research', 'Product strategy', 'Roadmapping', 'Scoping & estimation', 'Usability testing'],
  },
  {
    num: '03',
    id: 'engineering',
    title: 'Engineering',
    line: 'From prototype to production traffic, and it stays up afterwards.',
    items: ['React / Next.js', 'Swift & React Native', 'Node / Python APIs', 'Postgres & infra', 'CI/CD & monitoring'],
  },
] as const;

export const FOOTER_COLUMNS = [
  { title: 'Studio', items: ['Work', 'Services', 'Contact'] },
  { title: 'Design', items: ['UI/UX', 'Brand & identity', 'Motion', 'Design systems'] },
  { title: 'Build', items: ['Web applications', 'Mobile apps', 'APIs', 'Infrastructure'] },
] as const;

export interface Client {
  name: string;
  /**
   * Filename in src/assets/clients/ — svg preferred, then png with real
   * transparency. Absent means the row renders the name as a wordmark, so a
   * missing logo degrades to something deliberate rather than a gap.
   */
  logo?: string;
}

/**
 * Real clients, ordered by how much recognition the name carries on its own.
 * The row scrolls, so first position matters less than it did for a static
 * list, but a visitor glancing once still reads left to right.
 *
 * An empty array hides the section entirely. Remove rather than blank out any
 * name you cannot stand behind.
 */
export const CLIENTS: readonly Client[] = [
  { name: 'GTBank', logo: 'gtbank.svg' },
  { name: 'MTN', logo: 'mtn.svg' },
  { name: 'Union Bank' },
  { name: 'Sterling Bank', logo: 'sterling-bank.png' },
  { name: 'KFC', logo: 'kfc.png' },
  { name: 'Sabi' },
  { name: 'HydrogenPay' },
  { name: 'VFD Microfinance Bank' },
  { name: 'Consolidated Hallmark Insurance' },
  { name: 'Kairos Capital' },
  { name: 'Lingawa' },
  { name: 'Gangan' },
  { name: 'Harcourt Hotels & Resorts' },
  { name: 'GeoTravel' },
  { name: 'NEPAL Oil & Gas' },
  { name: 'Insidify' },
  { name: 'Country Homes' },
  { name: 'Butchers & Bakers' },
];

/* ── /services ─────────────────────────────────────────────────
   The three capability columns from the homepage, expanded. Same
   order, same numbering — a visitor arriving from the homepage
   should recognise where they landed. */
export const SERVICES = [
  {
    num: '01',
    id: 'design',
    title: 'Design',
    lede: 'The face of the thing: what a person sees, touches, and judges you by before they read a word.',
    includes: [
      'Product UI and UX',
      'Brand identity and art direction',
      'Design systems and Figma libraries',
      'Motion and interaction design',
      'Prototyping and usability testing',
    ],
    deliverables: [
      'A component library your team can build from',
      'Screen designs for every state, not just the happy path',
      'Motion specs that survive handover',
      'Brand assets and usage guidelines',
    ],
    media: {
      kind: 'video' as const,
      ratio: '16/9',
      size: '1920×1080',
      label: 'Motion reel: interface transitions, a design system in use, a brand mark animating. Stills cannot show this half of the work.',
    },
  },
  {
    num: '02',
    id: 'product',
    title: 'Product',
    lede: 'Working out what is worth building, and what to leave out, before anybody writes code.',
    includes: [
      'Discovery and user research',
      'Product strategy and positioning',
      'Roadmapping and prioritisation',
      'Scoping and estimation',
      'Analytics and measurement plans',
    ],
    deliverables: [
      'Research synthesis you can act on',
      'A prioritised roadmap with reasons attached',
      'Scoped estimates engineering will stand behind',
      'The list of things you decided not to build',
    ],
    media: {
      kind: 'image' as const,
      ratio: '16/9',
      size: '1600×900',
      label: 'Research artefacts: a synthesis wall, a before/after flow, a roadmap with the cut items still visible.',
    },
  },
  {
    num: '03',
    id: 'engineering',
    title: 'Engineering',
    lede: 'The part behind the face. Shipped, monitored, and still standing at month six.',
    includes: [
      'Web applications: React, Next.js, TypeScript',
      'Mobile: Swift and React Native',
      'APIs and third-party integrations',
      'Infrastructure, CI/CD and monitoring',
      'Performance and accessibility work',
    ],
    deliverables: [
      'Production code, documented and handed over',
      'A deploy pipeline your team owns',
      'Architecture decisions written down',
      'Monitoring that pages someone when it breaks',
    ],
    media: {
      kind: 'image' as const,
      ratio: '16/9',
      size: '1600×900',
      label: 'Something running: a deploy pipeline, a monitoring dashboard, an architecture diagram from a real project.',
    },
  },
] as const;

/** How work is structured. Prices are a conversation, not a table. */
export const ENGAGEMENTS = [
  {
    title: 'Project',
    lede: 'A defined outcome with a start and an end. Most first engagements.',
    detail: 'Fixed scope, fixed timeline, staged payments. Typically 6 to 12 weeks.',
  },
  {
    title: 'Retainer',
    lede: 'Continuous design and engineering capacity, month to month.',
    detail: 'A set number of days each month. For teams shipping continuously. Minimum 3 months.',
  },
  {
    title: 'Embedded',
    lede: 'We join your team and work inside your process.',
    detail: 'Your tools, your standups, your repo. For companies with a team already in motion.',
  },
] as const;

export const PROCESS = [
  { num: '01', title: 'Discovery', body: 'We work out what the actual problem is, which is rarely the one in the brief. Research, stakeholder interviews, a look at what you already have.' },
  { num: '02', title: 'Design', body: 'Flows, then screens, then a system. We test the risky parts early and cheaply, before they are expensive to change.' },
  { num: '03', title: 'Build', body: 'The same team that drew it builds it, so nothing is lost at handover. Shipped in increments you can see, not one reveal at the end.' },
  { num: '04', title: 'Support', body: 'Launch is the middle, not the end. We monitor, fix, and hand over cleanly, or stay on if you want us to.' },
] as const;

/* ── /studio ───────────────────────────────────────────────────── */
export const PRINCIPLES = [
  { title: 'One team, both crafts', body: 'The people who design it are the people who build it. No translation layer, no drawings thrown over a wall.' },
  { title: 'The seam is where products fail', body: 'Most work goes wrong between design and engineering, in the states nobody specced and the edge cases nobody drew. We own that gap because we are on both sides of it.' },
  { title: 'Show the build, not just the picture', body: 'Anyone can produce a beautiful mockup. We would rather show you the architecture, the load time, and the thing running.' },
  { title: 'Ship, then learn', body: 'A real thing in front of real users teaches more in a week than another month of internal debate.' },
] as const;

export interface TeamMember {
  name: string;
  role: string;
  /** Card-length. Two sentences at most — the grid puts these side by side. */
  summary: string;
  /**
   * Filename inside src/assets/team, e.g. "dami-oloye.webp". Resolved on the
   * studio page, so a missing file falls back to the Media brief rather than
   * breaking the build.
   */
  portrait?: string;
  /**
   * A seat that is filled but not yet written up. Renders as a stated gap —
   * dashed, captioned with what is missing — rather than as a person, and is
   * excluded from the head-count so the fact stays true. Delete the flag once
   * the real name, role and summary land.
   */
  pending?: true;
}

/**
 * Real people only. The studio page hides the team section when this is empty,
 * and the head-count fact drops out with it — an unremarkable omission, where
 * invented people would have been a liability.
 */
export const TEAM: readonly TeamMember[] = [
  {
    name: 'Dami Oloye',
    role: 'Managing Director | Technical Program Manager',
    portrait: 'dami-oloye.webp',
    summary:
      'Technology leader with 10+ years delivering large-scale enterprise programs across AI, data, digital commerce and SaaS. Founder of the studio, translating business objectives into roadmaps teams can actually execute.',
  },
  {
    name: 'Akinyemi Ogungbaro',
    role: 'Creative Technology & Product Design',
    portrait: 'akinyemi-ogungbaro.webp',
    summary:
      'Brand designer, product designer and creative director who also leads technology delivery, turning ideas into brands, digital products and working systems. Sits where design, technology, business and strategy meet.',
  },
  {
    name: 'Third member',
    role: 'Role to come',
    summary: 'Name, role and two sentences. Portrait square, 1200×1200, same framing as the others.',
    pending: true,
  },
  {
    name: 'Fourth member',
    role: 'Role to come',
    summary: 'Name, role and two sentences. Portrait square, 1200×1200, same framing as the others.',
    pending: true,
  },
];

export const STUDIO_FACTS = [
  { k: 'Founded', v: '2023' },
  { k: 'Based in', v: 'Lagos, Nigeria' },
  // No head-count here. The team section below the facts already names
  // everyone, so a number restating it only invites the "only two?" read.
  { k: 'Working with', v: 'Teams in Nigeria, the UK, Germany and the US' },
  { k: 'Languages', v: 'English, Yoruba' },
] as const;


/* ── /contact ──────────────────────────────────────────────────── */
/* These filter enquiries harder than any other field on the form. */
export const BUDGET_BANDS = [
  'Under $10k',
  '$10k to $25k',
  '$25k to $50k',
  '$50k+',
  'Not sure yet',
] as const;
