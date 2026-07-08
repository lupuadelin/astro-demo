import type { ImageMetadata } from 'astro';

const apartmentPhotoModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/apartments/*/*.jpg',
  { eager: true },
);

const complexPhotoModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/complex/*.jpg',
  { eager: true },
);

export function getApartmentPhotos(slug: string): ImageMetadata[] {
  return Object.entries(apartmentPhotoModules)
    .filter(([path]) => path.includes(`/apartments/${slug}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => mod.default);
}

export function getComplexPhotos(): ImageMetadata[] {
  return Object.entries(complexPhotoModules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => mod.default);
}

export type ApartmentType = 'Studio' | '2-room' | '3-room';

export interface Apartment {
  slug: string;
  type: ApartmentType;
  name: string;
  tagline: string;
  size: string;
  sizeSqm: number;
  guests: number;
  beds: string;
  baths: number;
  priceFrom: number;
  highlights: string[];
  gradient: string;
  gradientAlt: string;
  description: string;
  inApartment: string[];
  complexAccess: string[];
}

export const apartments: Apartment[] = [
  {
    slug: 'studio-arch',
    type: 'Studio',
    name: 'The Arch Studio',
    tagline: 'A calm one-room retreat with pool access.',
    size: '32 m²',
    sizeSqm: 32,
    guests: 2,
    beds: '1 queen',
    baths: 1,
    priceFrom: 59,
    highlights: ['Pool access', 'Rainfall shower', 'Nespresso'],
    gradient: 'linear-gradient(135deg,#DDD5C5,#6B7A5D)',
    gradientAlt: 'linear-gradient(135deg,#C4BAA5,#7F826E)',
    description:
      'A compact one-room stay finished in chalk and copper tones. Blackout curtains, a soft-arch reading nook and a rainfall shower — everything you need for a two-night city break or a slower solo stay.',
    inApartment: [
      'Nespresso',
      'Filtered water',
      'Rainfall shower',
      'Blackout curtains',
      'Fast Wi-Fi',
      'Smart TV',
      'Iron & board',
      'Hair dryer',
    ],
    complexAccess: ['Heated pool', 'Finnish sauna', 'Gym', 'Sports courts'],
  },
  {
    slug: 'deluxe-suite',
    type: '2-room',
    name: 'Deluxe Suite',
    tagline: 'Two rooms, a private balcony, room for four.',
    size: '55 m²',
    sizeSqm: 55,
    guests: 4,
    beds: '1 king · 1 sofa bed',
    baths: 1,
    priceFrom: 89,
    highlights: ['Pool access', 'Sauna access', 'Balcony'],
    gradient: 'linear-gradient(135deg,#C4BAA5,#6B7A5D)',
    gradientAlt: 'linear-gradient(135deg,#E7E1D0,#C4BAA5)',
    description:
      'A generous two-room suite with a king bedroom, an open living space and a west-facing balcony. Designed for couples who want a work corner or families of three-to-four sharing one apartment.',
    inApartment: [
      'Full kitchen',
      'Nespresso',
      'Filtered water',
      'Rainfall shower',
      'Balcony',
      'Blackout curtains',
      'Fast Wi-Fi',
      'Smart TV',
      'Washer',
    ],
    complexAccess: ['Heated pool', 'Finnish sauna', 'Gym', 'Sports courts', 'Indoor recreation'],
  },
  {
    slug: 'garden-residence',
    type: '3-room',
    name: 'Garden Residence',
    tagline: 'The family apartment — three rooms, two baths, garden view.',
    size: '82 m²',
    sizeSqm: 82,
    guests: 6,
    beds: '1 king · 2 twins · 1 sofa bed',
    baths: 2,
    priceFrom: 139,
    highlights: ['Pool access', 'Full kitchen', 'Two baths'],
    gradient: 'linear-gradient(135deg,#DDD5C5,#7F826E)',
    gradientAlt: 'linear-gradient(135deg,#DDD5C5,#C4BAA5)',
    description:
      'The largest apartment in the complex — three rooms, two full baths, an eat-in kitchen and a wide south-facing living room that opens to the garden. Sized for families of five to six or two couples travelling together.',
    inApartment: [
      'Full kitchen',
      'Dishwasher',
      'Nespresso',
      'Filtered water',
      'Two rainfall showers',
      'Garden view',
      'Blackout curtains',
      'Fast Wi-Fi',
      'Smart TV',
      'Washer',
      'Dryer',
    ],
    complexAccess: [
      'Heated pool',
      'Finnish sauna',
      'Gym',
      'Sports courts',
      'Indoor recreation',
      "Kids' play area",
    ],
  },
];

export const getApartmentBySlug = (slug: string) => apartments.find((a) => a.slug === slug);

export const getSimilarApartments = (slug: string, count = 2) =>
  apartments.filter((a) => a.slug !== slug).slice(0, count);
