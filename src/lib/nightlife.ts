export type Role = 'user' | 'manager' | 'admin';

export interface NUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  points: number;
}

export interface TicketTier {
  id: string;
  label: string;
  price: number;
  perks: string[];
  vip: boolean;
}

export interface NEvent {
  id: string;
  title: string;
  venue: string;
  city: string;
  date: string; // ISO
  genre: string;
  djs: string[];
  image: string;
  gallery: string[];
  description: string;
  dressCode: string;
  ageLimit: string;
  promo?: string;
  trending?: boolean;
  tiers: TicketTier[];
}

export interface Booking {
  id: string;
  eventId: string;
  tierId: string;
  guests: number;
  total: number;
  status: 'confirmed' | 'pending';
  date: string;
  code: string;
}

export interface NNotification {
  id: string;
  type: 'event' | 'vip' | 'promo' | 'booking';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export const GENRES = ['All', 'EDM', 'House', 'Hip-Hop', 'Techno', 'R&B', 'Afrobeats'];

const IMGS = [
  'https://d64gsuwffb70l.cloudfront.net/6a21f00107fd5fc041e6ea16_1780609398507_b7c7cbd0.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a21f00107fd5fc041e6ea16_1780609398873_2881556a.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a21f00107fd5fc041e6ea16_1780609402432_8a14f5dd.png',
  'https://d64gsuwffb70l.cloudfront.net/6a21f00107fd5fc041e6ea16_1780609399524_573c5958.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a21f00107fd5fc041e6ea16_1780609407015_3c6c9911.png',
  'https://d64gsuwffb70l.cloudfront.net/6a21f00107fd5fc041e6ea16_1780609403077_ed1f026b.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a21f00107fd5fc041e6ea16_1780609409653_6def2745.png',
  'https://d64gsuwffb70l.cloudfront.net/6a21f00107fd5fc041e6ea16_1780609404645_a72938c0.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a21f00107fd5fc041e6ea16_1780609434147_7270530b.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a21f00107fd5fc041e6ea16_1780609436970_4ec984d5.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a21f00107fd5fc041e6ea16_1780609433941_92227429.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a21f00107fd5fc041e6ea16_1780609443161_c71ed161.png',
];

export const HERO_IMG = 'https://d64gsuwffb70l.cloudfront.net/6a21f00107fd5fc041e6ea16_1780609372695_0e5a36b5.jpg';

function tiers(base: number): TicketTier[] {
  return [
    { id: 'ga', label: 'General Entry', price: base, vip: false, perks: ['Club access', 'Coat check'] },
    { id: 'vip', label: 'VIP Lounge', price: base * 3, vip: true, perks: ['Priority entry', 'VIP lounge', 'Welcome drink'] },
    { id: 'table', label: 'Table Service', price: base * 8, vip: true, perks: ['Private table', 'Bottle service', 'Dedicated host', 'Skip the line'] },
  ];
}

const titles = [
  ['Neon Pulse', 'Pulse Arena', 'Miami', 'EDM', ['DJ Voltage', 'Aurora']],
  ['Midnight Bass', 'The Vault', 'Los Angeles', 'House', ['Kasper', 'Nina K']],
  ['Golden Hour', 'Skyline Rooftop', 'New York', 'R&B', ['Soul Mate', 'Velvet']],
  ['Electric Dreams', 'Lumen Club', 'Las Vegas', 'EDM', ['Pyro', 'Echo']],
  ['Underground Sessions', 'Cellar 9', 'Berlin', 'Techno', ['Maschine', 'Drift']],
  ['Tropic Heat', 'Palm Lounge', 'Miami', 'Afrobeats', ['Kojo', 'Sade B']],
  ['After Dark', 'Obsidian', 'Chicago', 'Hip-Hop', ['Big Reign', 'Lyric']],
  ['Velocity', 'Hyper Dome', 'Toronto', 'EDM', ['Turbo', 'Nyx']],
  ['Smoke & Mirrors', 'Mirage', 'London', 'House', ['Glass', 'Mira']],
  ['Crown Royale', 'The Penthouse', 'Dubai', 'R&B', ['Regal', 'Aria']],
  ['Pulse After Party', 'Basement 12', 'Amsterdam', 'Techno', ['Static', 'Vex']],
  ['Sunset Soiree', 'Azure Deck', 'Ibiza', 'House', ['Marbella', 'Sol']],
];

export const EVENTS: NEvent[] = titles.map((t, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i * 2 + 1);
  d.setHours(22, 0, 0, 0);
  return {
    id: 'ev' + (i + 1),
    title: t[0] as string,
    venue: t[1] as string,
    city: t[2] as string,
    date: d.toISOString(),
    genre: t[3] as string,
    djs: t[4] as string[],
    image: IMGS[i],
    gallery: [IMGS[i], IMGS[(i + 1) % 12], IMGS[(i + 2) % 12], IMGS[(i + 3) % 12]],
    description: `An unforgettable night of ${t[3]} at ${t[1]}. Immerse yourself in world-class production, electric crowds and headline sets that go until sunrise.`,
    dressCode: i % 2 === 0 ? 'Smart / Stylish' : 'All Black / Elegant',
    ageLimit: '21+',
    promo: i % 3 === 0 ? 'Ladies free before 11PM' : i % 3 === 1 ? '2-for-1 VIP this week' : undefined,
    trending: i < 4,
    tiers: tiers(25 + (i % 4) * 10),
  };
});

export const INITIAL_NOTIFICATIONS: NNotification[] = [
  { id: 'n1', type: 'vip', title: 'VIP Drop: 2-for-1 Tables', body: 'Book a table tonight and bring a friend free at The Vault.', time: '2m ago', read: false },
  { id: 'n2', type: 'event', title: 'New Event Near You', body: 'Neon Pulse just announced surprise guest DJ Voltage.', time: '1h ago', read: false },
  { id: 'n3', type: 'promo', title: 'Earn 2x Loyalty Points', body: 'Double points on all bookings this weekend.', time: '5h ago', read: true },
];

export function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}
