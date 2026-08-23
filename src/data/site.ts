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
