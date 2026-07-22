import type { ArtistCardData } from '@/components/ui/ArtistCard';
import type { EventCardData } from '@/components/ui/EventCard';
import type { VenueCardData } from '@/components/ui/VenueCard';

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const MOCK_CATEGORIES: Category[] = [
  { id: 'concerts', name: 'Concerts', icon: '🎵' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'theater', name: 'Theater', icon: '🎭' },
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'comedy', name: 'Comedy', icon: '😂' },
  { id: 'arts', name: 'Arts', icon: '🎨' },
];

export const MOCK_FEATURED_EVENTS: EventCardData[] = [
  {
    id: '1',
    title: 'Taylor Swift: The Eras Tour',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
    date: 'Fri, Nov 22 • 7:00 PM',
    venue: 'SoFi Stadium, Los Angeles',
    price: '$199',
    category: 'Concert',
  },
  {
    id: '2',
    title: 'Coldplay Music of the Spheres',
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&h=400&fit=crop',
    date: 'Sat, Nov 23 • 8:00 PM',
    venue: 'Rose Bowl, Pasadena',
    price: '$149',
    category: 'Concert',
  },
  {
    id: '3',
    title: 'NFL: Rams vs 49ers',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba821?w=600&h=400&fit=crop',
    date: 'Sun, Nov 24 • 1:00 PM',
    venue: 'SoFi Stadium, Los Angeles',
    price: '$89',
    category: 'Sports',
  },
];

export const MOCK_TRENDING_EVENTS: EventCardData[] = [
  {
    id: '4',
    title: 'Ed Sheeran: +–=÷× Tour',
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop',
    date: 'Thu, Dec 5 • 7:30 PM',
    venue: 'Crypto.com Arena',
    price: '$129',
    category: 'Concert',
  },
  {
    id: '5',
    title: 'Hamilton - Los Angeles',
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&h=300&fit=crop',
    date: 'Fri, Dec 6 • 8:00 PM',
    venue: 'Hollywood Pantages',
    price: '$119',
    category: 'Theater',
  },
  {
    id: '6',
    title: 'Trevor Noah: Back to Abnormal',
    imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400&h=300&fit=crop',
    date: 'Sat, Dec 7 • 7:00 PM',
    venue: 'Dolby Theatre',
    price: '$79',
    category: 'Comedy',
  },
  {
    id: '7',
    title: 'Disney on Ice: Magic in the Stars',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop',
    date: 'Sun, Dec 8 • 2:00 PM',
    venue: 'Kia Forum',
    price: '$49',
    category: 'Family',
  },
];

export const MOCK_POPULAR_ARTISTS: ArtistCardData[] = [
  {
    id: '1',
    name: 'Taylor Swift',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    genre: 'Pop',
    upcomingEvents: 4,
  },
  {
    id: '2',
    name: 'Coldplay',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop',
    genre: 'Alternative',
    upcomingEvents: 3,
  },
  {
    id: '3',
    name: 'Ed Sheeran',
    imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    genre: 'Pop',
    upcomingEvents: 5,
  },
  {
    id: '4',
    name: 'Billie Eilish',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    genre: 'Alternative',
    upcomingEvents: 2,
  },
];

export const MOCK_TOP_VENUES: VenueCardData[] = [
  {
    id: '1',
    name: 'SoFi Stadium',
    imageUrl: 'https://images.unsplash.com/photo-1518604666365-5e75a017c63c?w=400&h=300&fit=crop',
    city: 'Inglewood, CA',
    capacity: '70,240',
  },
  {
    id: '2',
    name: 'Crypto.com Arena',
    imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=300&fit=crop',
    city: 'Los Angeles, CA',
    capacity: '19,067',
  },
  {
    id: '3',
    name: 'Rose Bowl',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?w=400&h=300&fit=crop',
    city: 'Pasadena, CA',
    capacity: '90,888',
  },
];

export { MOCK_DISCOVER_FEED_EVENTS, type DiscoverFeedEvent } from './discover-feed';
export { MOCK_POPULAR_NEAR_YOU_CONCERTS, type PopularNearYouEvent } from './popular-near-you';
