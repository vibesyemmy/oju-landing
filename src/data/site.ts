export const SITE = {
  name: 'Ojú',
  tagline: 'Design and product studio',
  city: 'Lagos',
  country: 'Nigeria',
  timezone: 'Africa/Lagos',
  // TODO: real address once the domain is registered.
  email: 'hello@oju.studio',
  description:
    'Ojú is a design and product studio in Lagos. Interfaces, brand systems, ' +
    'and the software underneath — drawn and shipped by one team.',
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
    title: 'Design',
    line: 'From a first identity to a design system a team can actually hold on to.',
    items: ['UI/UX design', 'Brand & identity', 'Motion & graphics', 'Design systems', 'Figma libraries'],
  },
  {
    num: '02',
    title: 'Product',
    line: 'From a vague ambition to a scope somebody can actually build against.',
    items: ['Discovery & research', 'Product strategy', 'Roadmapping', 'Scoping & estimation', 'Usability testing'],
  },
  {
    num: '03',
    title: 'Engineering',
    line: 'From prototype to production traffic — and it stays up afterwards.',
    items: ['React / Next.js', 'Swift & React Native', 'Node / Python APIs', 'Postgres & infra', 'CI/CD & monitoring'],
  },
] as const;

export const FOOTER_COLUMNS = [
  { title: 'Studio', items: ['Work', 'Services', 'About', 'Journal'] },
  { title: 'Design', items: ['UI/UX', 'Brand & identity', 'Motion', 'Design systems'] },
  { title: 'Build', items: ['Web applications', 'Mobile apps', 'APIs', 'Infrastructure'] },
] as const;

/** TODO: replace with real client names. Empty array hides the strip entirely. */
export const CLIENTS: readonly string[] = [];

/* ── /services ─────────────────────────────────────────────────
   The three capability columns from the homepage, expanded. Same
   order, same numbering — a visitor arriving from the homepage
   should recognise where they landed. */
export const SERVICES = [
  {
    num: '01',
    id: 'design',
    title: 'Design',
    lede: 'The face of the thing — what a person sees, touches, and judges you by before they read a word.',
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
  },
  {
    num: '02',
    id: 'product',
    title: 'Product',
    lede: 'Working out what is worth building — and what to leave out — before anybody writes code.',
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
  },
  {
    num: '03',
    id: 'engineering',
    title: 'Engineering',
    lede: 'The part behind the face. Shipped, monitored, and still standing at month six.',
    includes: [
      'Web applications — React, Next.js, TypeScript',
      'Mobile — Swift and React Native',
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
  },
] as const;

/** How work is structured. Prices are a conversation, not a table. */
export const ENGAGEMENTS = [
  {
    title: 'Project',
    lede: 'A defined outcome with a start and an end. Most first engagements.',
    detail: 'Fixed scope, fixed timeline, staged payments. Typically [6–12] weeks.',
  },
  {
    title: 'Retainer',
    lede: 'Continuous design and engineering capacity, month to month.',
    detail: 'A set number of days each month. For teams shipping continuously. Minimum [3] months.',
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
  { num: '04', title: 'Support', body: 'Launch is the middle, not the end. We monitor, fix, and hand over cleanly — or stay on if you want us to.' },
] as const;

/* ── /studio ───────────────────────────────────────────────────── */
export const PRINCIPLES = [
  { title: 'One team, both crafts', body: 'The people who design it are the people who build it. No translation layer, no drawings thrown over a wall.' },
  { title: 'The seam is where products fail', body: 'Most work goes wrong between design and engineering — in the states nobody specced and the edge cases nobody drew. We own that gap because we are on both sides of it.' },
  { title: 'Show the build, not just the picture', body: 'Anyone can produce a beautiful mockup. We would rather show you the architecture, the load time, and the thing running.' },
  { title: 'Ship, then learn', body: 'A real thing in front of real users teaches more in a week than another month of internal debate.' },
] as const;

/**
 * PLACEHOLDER PEOPLE — these are invented names standing in so the team
 * section lays out correctly. Nobody here exists.
 *
 * Unlike the [BRACKETS] elsewhere, these look real, which makes them the most
 * dangerous placeholder on the site: shipped as-is the studio claims a team it
 * does not have. Replace before launch, or set this to [] to hide the section
 * entirely — the page handles an empty array.
 */
export const TEAM: readonly { name: string; role: string }[] = [
  { name: 'Adunni Bakare', role: 'Founder, Design' },
  { name: 'Chidi Okafor', role: 'Engineering Lead' },
  { name: 'Temilade Adeyemi', role: 'Product' },
];

export const STUDIO_FACTS = [
  { k: 'Founded', v: '2023' },
  { k: 'Based in', v: 'Lagos, Nigeria' },
  // Derived from TEAM, so the count cannot drift from the people listed.
  { k: 'Team', v: `${TEAM.length} people` },
  { k: 'Working with', v: '[REGIONS]' },
  { k: 'Languages', v: 'English, Yoruba' },
] as const;


/* ── /contact ──────────────────────────────────────────────────── */
export const BUDGET_BANDS = [
  'Under [$10k]',
  '[$10k–25k]',
  '[$25k–50k]',
  '[$50k+]',
  'Not sure yet',
] as const;
