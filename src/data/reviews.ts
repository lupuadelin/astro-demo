export interface Review {
  quote: string;
  author: string;
  source: string;
  stars: number;
  apartmentSlug?: string;
}

export const reviews: Review[] = [
  {
    quote:
      'The most thoughtful stay we have had in years — the apartment felt like a small hotel run by one person who cared.',
    author: 'Léa & Julien',
    source: 'Airbnb',
    stars: 5,
    apartmentSlug: 'deluxe-suite',
  },
  {
    quote: 'Immaculate. The pool at sunset made the whole trip. Would book again in a heartbeat.',
    author: 'Alex D.',
    source: 'Booking.com',
    stars: 5,
  },
  {
    quote: 'Every corner is considered. Beds, towels, coffee, light — all correct.',
    author: 'Sofia P.',
    source: 'Direct guest',
    stars: 5,
    apartmentSlug: 'studio-arch',
  },
  {
    quote: 'A calm, considered stay. Everything worked, everything was where you would put it.',
    author: 'Marta & Ionuț',
    source: 'Airbnb',
    stars: 5,
    apartmentSlug: 'garden-residence',
  },
  {
    quote:
      'The arch, the light, the pool at sunset — this is what a boutique stay is meant to feel like.',
    author: 'Kasia W.',
    source: 'Booking.com',
    stars: 5,
    apartmentSlug: 'deluxe-suite',
  },
];

export function getReviews(count?: number, filterBySlug?: string): Review[] {
  const pool = filterBySlug
    ? reviews.filter((r) => !r.apartmentSlug || r.apartmentSlug === filterBySlug)
    : reviews;
  return count ? pool.slice(0, count) : pool;
}
