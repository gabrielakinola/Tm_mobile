export interface PopularNearYouEvent {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export const MOCK_POPULAR_NEAR_YOU_CONCERTS: PopularNearYouEvent[] = [
  {
    id: 'nearby-1',
    title: 'Usher',
    category: 'R&B',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&h=506&fit=crop',
  },
  {
    id: 'nearby-2',
    title: 'Bruno Mars',
    category: 'POP',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&h=506&fit=crop',
  },
  {
    id: 'nearby-3',
    title: 'The Weeknd',
    category: 'R&B',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&h=506&fit=crop',
  },
  {
    id: 'nearby-4',
    title: 'Kendrick Lamar',
    category: 'HIP-HOP',
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&h=506&fit=crop',
  },
  {
    id: 'nearby-5',
    title: 'Lizzo',
    category: 'POP',
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=900&h=506&fit=crop',
  },
];
