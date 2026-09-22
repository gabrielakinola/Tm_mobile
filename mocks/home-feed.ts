export interface HomeForYouEvent {
  id: string;
  title: string;
  imageUrl: string;
  month: string;
  day: string;
  weekdayTime: string;
  venue: string;
  city: string;
  countryCode: string;
  accentColor?: string;
}

export interface HomeTrendingItem {
  id: string;
  rank: string;
  name: string;
  genre: string;
  imageUrl: string;
}

export interface HomeLastMinuteEvent {
  id: string;
  dateLabel: string;
  title: string;
  time: string;
  venue: string;
  imageUrl: string;
}

export interface HomeWeekendEvent {
  id: string;
  title: string;
  imageUrl: string;
}

export interface HomeJustAnnouncedEvent {
  id: string;
  dateLabel: string;
  title: string;
  time: string;
  location: string;
  imageUrl: string;
}

export const MOCK_HOME_FOR_YOU: HomeForYouEvent[] = [
  {
    id: 'foryou-austin',
    title: 'AUSTIN CITY LIMITS MUSIC FESTIVAL',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf52929827?w=900&h=540&fit=crop',
    month: 'Oct',
    day: '02',
    weekdayTime: 'Friday · 7:00 PM',
    venue: 'Austin, TX, US - Zilker Metropolitan Park',
    city: 'Austin',
    countryCode: 'US',
    accentColor: '#25C1B6',
  },
  {
    id: 'foryou-formula-1',
    title: 'FORMULA 1 HEINEKEN LAS VEGAS GRAND PRIX',
    imageUrl: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&h=540&fit=crop',
    month: 'Nov',
    day: '19',
    weekdayTime: 'Thursday · 4:30 PM',
    venue: 'Las Vegas, US - Koval Zone by Heineken',
    city: 'Las Vegas',
    countryCode: 'US',
    accentColor: '#20E239',
  },
  {
    id: 'foryou-1',
    title: 'NOAH KAHAN',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=800&fit=crop',
    month: 'Jul',
    day: '10',
    weekdayTime: 'Friday · 6:30 PM',
    venue: 'Boston, US - Fenway Park',
    city: 'Boston',
    countryCode: 'US',
    accentColor: '#A84A52',
  },
  {
    id: 'foryou-2',
    title: 'JONAS BROTHERS',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27cc7d?w=600&h=800&fit=crop',
    month: 'Aug',
    day: '21',
    weekdayTime: 'Friday · 7:00 PM',
    venue: 'New York, US - Madison Square Garden',
    city: 'New York',
    countryCode: 'US',
    accentColor: '#E99A77',
  },
  {
    id: 'foryou-3',
    title: 'BILLIE EILISH',
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=800&fit=crop',
    month: 'Sep',
    day: '04',
    weekdayTime: 'Saturday · 8:00 PM',
    venue: 'Los Angeles, US - Hollywood Bowl',
    city: 'Los Angeles',
    countryCode: 'US',
    accentColor: '#4CB8B0',
  },
  {
    id: 'foryou-4',
    title: 'USHER',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=800&fit=crop',
    month: 'Oct',
    day: '18',
    weekdayTime: 'Saturday · 7:30 PM',
    venue: 'Los Angeles, US - Crypto.com Arena',
    city: 'Los Angeles',
    countryCode: 'US',
    accentColor: '#7B75C9',
  },
];

export const MOCK_HOME_TRENDING: HomeTrendingItem[] = [
  {
    id: 'trend-1',
    rank: '01',
    name: 'Doja Cat',
    genre: 'Pop',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&fit=crop',
  },
  {
    id: 'trend-2',
    rank: '02',
    name: 'Harry Styles',
    genre: 'Pop',
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&h=200&fit=crop',
  },
  {
    id: 'trend-3',
    rank: '03',
    name: 'Katseye',
    genre: 'Pop',
    imageUrl: 'https://images.unsplash.com/photo-1527224857830-43a7bb13845a?w=200&h=200&fit=crop',
  },
  {
    id: 'trend-4',
    rank: '04',
    name: 'SABRINA CARPENTER',
    genre: 'Pop',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
  },
  {
    id: 'trend-5',
    rank: '05',
    name: 'THE WEEKND',
    genre: 'R&B',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop',
  },
  {
    id: 'trend-6',
    rank: '06',
    name: 'KENDRICK LAMAR',
    genre: 'Hip-Hop',
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&h=200&fit=crop',
  },
  {
    id: 'trend-7',
    rank: '07',
    name: 'Weezer',
    genre: 'Rock',
    imageUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=200&h=200&fit=crop',
  },
  {
    id: 'trend-8',
    rank: '08',
    name: 'Malcolm Todd',
    genre: 'Alternative',
    imageUrl: 'https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?w=200&h=200&fit=crop',
  },
  {
    id: 'trend-9',
    rank: '09',
    name: 'WWE',
    genre: 'Wrestling',
    imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=200&h=200&fit=crop',
  },
];

export const MOCK_HOME_LAST_MINUTE: HomeLastMinuteEvent[] = [
  {
    id: 'last-minute-1',
    dateLabel: 'Tue 22 Sep',
    title: 'POND',
    time: '8:00 PM',
    venue: 'The Bellwether',
    imageUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=900&h=540&fit=crop',
  },
  {
    id: 'last-minute-2',
    dateLabel: 'Wed 23 Sep',
    title: 'CMAT',
    time: '8:00 PM',
    venue: 'The Bellwether',
    imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&h=540&fit=crop',
  },
  {
    id: 'last-minute-3',
    dateLabel: 'Mon 28 Sep',
    title: 'MUNA',
    time: '7:30 PM',
    venue: 'The Wiltern',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=900&h=540&fit=crop',
  },
  {
    id: 'last-minute-4',
    dateLabel: 'Tue 29 Sep',
    title: 'THE BETHS',
    time: '8:00 PM',
    venue: 'Teragram Ballroom',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&h=540&fit=crop',
  },
];

export const MOCK_HOME_JUST_ANNOUNCED: HomeJustAnnouncedEvent[] = [
  {
    id: 'just-announced-1',
    dateLabel: 'Wed 28 October',
    title: 'JACK ZEBRA',
    time: '7:00 PM',
    location: 'Los Angeles, CA',
    imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&h=720&fit=crop',
  },
  {
    id: 'just-announced-2',
    dateLabel: 'Fri 30 October',
    title: "DEVIL'S NIGHT: SOLD OUT",
    time: '6:30 PM',
    location: 'Los Angeles, CA',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&h=720&fit=crop',
  },
  {
    id: 'just-announced-3',
    dateLabel: 'Sat 31 October',
    title: 'KATSEYE',
    time: '8:00 PM',
    location: 'Inglewood, CA',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&h=720&fit=crop',
  },
];

export const MOCK_HOME_WEEKEND: HomeWeekendEvent[] = [
  {
    id: 'weekend-1',
    title: 'Lakers vs Warriors',
    imageUrl: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=700&h=400&fit=crop',
  },
  {
    id: 'weekend-2',
    title: 'Hamilton',
    imageUrl: 'https://images.unsplash.com/photo-1503099644801-0b45693416ca?w=700&h=400&fit=crop',
  },
  {
    id: 'weekend-3',
    title: 'Imagine Dragons',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf52929827?w=700&h=400&fit=crop',
  },
];
