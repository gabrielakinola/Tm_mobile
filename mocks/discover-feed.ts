export interface DiscoverFeedEvent {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export const MOCK_DISCOVER_FEED_EVENTS: DiscoverFeedEvent[] = [
  {
    id: 'feed-1',
    title: 'P!NK',
    category: 'POP',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&h=506&fit=crop',
  },
  {
    id: 'feed-2',
    title: 'Tim McGraw',
    category: 'COUNTRY',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27cc7d?w=900&h=506&fit=crop',
  },
  {
    id: 'feed-3',
    title: 'Cats: The Jellicle Ball (NY)',
    category: 'MUSICAL',
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=900&h=506&fit=crop',
  },
  {
    id: 'feed-4',
    title: 'Imagine Dragons',
    category: 'POP',
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&h=506&fit=crop',
  },
  {
    id: 'feed-5',
    title: 'The Spinners',
    category: 'R&B',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&h=506&fit=crop',
  },
  {
    id: 'feed-6',
    title: 'Kevin Hart',
    category: 'COMEDY',
    imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=900&h=506&fit=crop',
  },
  {
    id: 'feed-7',
    title: 'Chris Brown',
    category: 'POP',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&h=506&fit=crop',
  },
  {
    id: 'feed-8',
    title: 'Billie Eilish',
    category: 'POP',
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=900&h=506&fit=crop',
  },
  {
    id: 'feed-9',
    title: 'Hamilton',
    category: 'MUSICAL',
    imageUrl: 'https://images.unsplash.com/photo-1503099644801-0b45693416ca?w=900&h=506&fit=crop',
  },
  {
    id: 'feed-10',
    title: 'Lakers vs Warriors',
    category: 'SPORTS',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba821?w=900&h=506&fit=crop',
  },
  {
    id: 'feed-11',
    title: 'Coachella Valley Music Festival',
    category: 'FESTIVALS',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf52929827?w=900&h=506&fit=crop',
  },
  {
    id: 'feed-12',
    title: 'Trevor Noah',
    category: 'COMEDY',
    imageUrl: 'https://images.unsplash.com/photo-1527224857830-43a7bb13845a?w=900&h=506&fit=crop',
  },
];
