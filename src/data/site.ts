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

/**
 * Footer navigation. Every item carries an href — these rendered as plain
 * <span> before, which looks exactly like navigation and does nothing, so a
 * visitor who aimed at "Services" got no feedback at all.
 *
 * The service entries deep-link into the matching section of /services rather
 * than inventing pages that do not exist.
 */
export const FOOTER_COLUMNS = [
  {
    title: 'Studio',
    items: [
      { label: 'Work', href: '/work' },
      { label: 'Campaigns', href: '/work/campaigns' },
      { label: 'About', href: '/studio' },
      { label: 'Services', href: '/services' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Design',
    items: [
      { label: 'UI/UX', href: '/services#design' },
      { label: 'Brand & identity', href: '/services#design' },
      { label: 'Motion', href: '/services#design' },
      { label: 'Design systems', href: '/services#design' },
    ],
  },
  {
    title: 'Build',
    items: [
      { label: 'Web applications', href: '/services#engineering' },
      { label: 'Mobile apps', href: '/services#engineering' },
      { label: 'APIs', href: '/services#engineering' },
      { label: 'Infrastructure', href: '/services#engineering' },
    ],
  },
] as const;

export interface Client {
  name: string;
  /**
   * Filename in src/assets/clients/ — svg preferred, then png with real
   * transparency. Absent means the row renders the name as a wordmark, so a
   * missing logo degrades to something deliberate rather than a gap.
   */
  logo?: string;
  /**
   * Solid-background logos — a mark locked inside a filled square rather than
   * floating on transparency. The row's mono treatment flattens these into grey
   * blocks, so they keep their weight instead.
   */
  tile?: boolean;
  /**
   * Domain for the Brandfetch Logo API, used only when no self-hosted `logo`
   * exists. Their terms require hotlinking, so these load from their CDN at
   * runtime rather than through Astro's pipeline.
   *
   * Only add a domain you can actually evidence. A wrong guess that happens to
   * belong to a real company puts a stranger's logo in the client wall, which
   * is far worse than a wordmark.
   */
  domain?: string;
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
  { name: 'GTBank', logo: 'gtbank.svg', tile: true },
  { name: 'MTN', logo: 'mtn.svg' },
  { name: 'Union Bank', logo: 'union-bank.png', tile: true },
  { name: 'Sterling Bank', logo: 'sterling-bank.png' },
  { name: 'KFC', logo: 'kfc.png' },
  { name: 'Sabi', logo: 'sabi.svg' },
  { name: 'HydrogenPay', logo: 'hydrogen.svg' },
  { name: 'VFD Microfinance Bank', logo: 'vfd.png' },
  { name: 'Consolidated Hallmark Insurance', logo: 'consolidated-hallmark.svg' },
  { name: 'Kairos Capital', domain: 'kairoscapitalng.com' },
  { name: 'Lingawa', logo: 'lingawa.svg' },
  { name: 'Gangan', logo: 'gangan.png' },
  { name: 'Harcourt Hotels & Resorts', logo: 'harcourt.svg' },
  { name: 'GeoTravel', domain: 'geotravel.tours' },
  { name: 'NEPAL Oil & Gas' },
  { name: 'Belvia', logo: 'belvia.svg' },
  { name: 'FundPatients', logo: 'fundpatients.svg' },
  { name: 'Insidify', logo: 'insidify.svg' },
  { name: 'Country Homes', logo: 'country-homes.svg' },
  { name: 'Butchers & Bakers' },
];

/* ── /work, second tier ────────────────────────────────────────
   Brand and interface projects that have a brief but not a case
   study. They render as cards on /work below the case studies,
   with no detail pages of their own: there is a paragraph of
   substance behind each, and a page built on that would read
   thinner than the card does. */
export interface SelectedProject {
  name: string;
  /** Filename in src/assets/work-selected. */
  image: string;
  services: string[];
  line: string;
  /**
   * These are Figma prototypes, not shipped sites — the portfolio calls them
   * "link to project", but every one resolves to figma.com/proto. Labelled as
   * prototypes on the card, because "view the site" would be a false promise.
   * Omitted where the link is dead.
   */
  prototype?: string;
}

export const SELECTED_WORK: readonly SelectedProject[] = [
  {
    name: 'Harcourt Hotels & Resorts',
    image: 'harcourt.webp',
    services: ['Brand identity', 'Web design', 'Advertising'],
    line: 'Positioning a hotel group as a luxury brand, and building the online presence to carry it.',
  },
  {
    name: 'Insidify',
    image: 'insidify.webp',
    services: ['Logo', 'Brand identity', 'Marketing design'],
    line: 'A careers and technology platform that needed an identity people remember, and a way to explain what it actually does.',
  },
  {
    name: 'GeoTravel',
    image: 'geotravel.webp',
    services: ['UI design', 'Web'],
    line: 'Flights, hotels, holidays and airport transfers folded into one booking flow.',
    prototype: 'https://www.figma.com/proto/fFJ4N6W268k6nrH0avqd8E/Hotel-Booking-NEW?node-id=1%3A3',
  },
  {
    name: 'Kairos Capital',
    image: 'kairos-capital.webp',
    services: ['UI design', 'Web'],
    line: 'A financial advisory firm, structured around what they actually offer rather than how they describe themselves.',
    prototype: 'https://www.figma.com/proto/8IfDvAzuZw2YNIHIVJPRAw/Kairos-Capital?node-id=7%3A8',
  },
  {
    name: 'NEPAL Oil & Gas',
    image: 'nepal-oil-gas.webp',
    services: ['UI design', 'Web'],
    line: 'A corporate site carrying a great deal of business detail without burying any of it.',
  },
  {
    name: 'FundPatients',
    image: 'fundpatients.webp',
    services: ['Logo', 'Digital advertising'],
    line: 'Logo, brand tokens and advert elements for a healthcare start-up, built to launch with.',
  },
  {
    name: 'Belvia',
    image: 'belvia.webp',
    services: ['Logo', 'Brand identity'],
    line: 'A kids’ fashion label that had to read as fun and hip without talking down to teenagers.',
  },
  {
    name: 'Country Homes',
    image: 'country-homes.webp',
    services: ['Logo', 'Brand identity'],
    line: 'An identity for a property company that states the business proposition rather than decorating it.',
  },
];

/* ── /work/campaigns ───────────────────────────────────────────
   Print, social and digital advertising. No briefs behind these,
   so they are shown as a gallery rather than dressed up as case
   studies: the work is the argument. Grouped by client. */
export interface CampaignPiece {
  /** Filename in src/assets/campaigns. */
  image: string;
  client: string;
  /** Alt text, and the caption on hover. Describe the piece, not the file. */
  caption: string;
}

export const CAMPAIGNS: readonly CampaignPiece[] = [
  { image: 'gtbank-737-mobile.webp', client: 'GTBank', caption: '*737 mobile banking launch' },
  { image: 'gtbank-737-valentine.webp', client: 'GTBank', caption: '*737 Valentine’s campaign' },
  { image: 'gtbank-737-family.webp', client: 'GTBank', caption: '*737, “Its Banking; Only Easier”' },
  { image: 'mtn-traveling-abroad.webp', client: 'MTN', caption: 'Roaming, “Traveling abroad or staying home?”' },
  { image: 'sterling-multiverse-passion.webp', client: 'Sterling Bank', caption: 'Multiverse of Opportunities, “Passion meets opportunities”' },
  { image: 'sterling-multiverse-portrait.webp', client: 'Sterling Bank', caption: 'Multiverse of Opportunities, portrait treatment' },
  { image: 'sterling-multiverse-magic.webp', client: 'Sterling Bank', caption: 'Multiverse of Opportunities, “Unleash the magic in you”' },
  { image: 'sterling-teambonding.webp', client: 'Sterling Bank', caption: '#TeamBonding, “Engage, Bond, Connect”' },
  { image: 'sterling-trade-toons.webp', client: 'Sterling Bank', caption: 'Trade Toons, an illustrated service series' },
  { image: 'sterling-mechanic-series.webp', client: 'Sterling Bank', caption: 'Spare parts campaign, “T for Tenks”' },
  { image: 'kfc-doublicious.webp', client: 'KFC', caption: 'Doublicious launch' },
  { image: 'eat-drink-ribs.webp', client: 'Eat Drink Festival', caption: '“Crack your ribs”' },
  { image: 'eat-drink-sweet-tooth.webp', client: 'Eat Drink Festival', caption: '“Sweet Tooth”' },
  { image: 'eat-drink-appetite.webp', client: 'Eat Drink Festival', caption: '“Indulge your appetite”' },
  { image: 'vfd-avoid-contact.webp', client: 'VFD Microfinance Bank', caption: 'Contactless payments, “Avoid contact with cash”' },
  { image: 'vfd-quick-cash.webp', client: 'VFD Microfinance Bank', caption: 'Loans, “Need quick cash?”' },
  { image: 'kairos-ramadan.webp', client: 'Kairos Capital', caption: 'Ramadan Kareem' },
  { image: 'kairos-womens-day.webp', client: 'Kairos Capital', caption: 'International Women’s Day' },
  { image: 'geotravel-dubai.webp', client: 'GeoTravel', caption: 'Dubai flash sale' },
  { image: 'geotravel-easter.webp', client: 'GeoTravel', caption: 'Easter Fiesta, seven destinations' },
  { image: 'country-homes-pride.webp', client: 'Country Homes', caption: 'Brand advertising' },
  { image: 'insidify-childs-play.webp', client: 'Insidify', caption: '“Getting a job, easy like child’s play”' },
  { image: 'butchers-bakers-heaven.webp', client: 'Butchers & Bakers', caption: '“A slice of heaven”' },
  { image: 'harcourt-app.webp', client: 'Harcourt Hotels & Resorts', caption: 'App launch' },
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
