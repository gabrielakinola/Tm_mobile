export interface TicketmasterShow {
  id: string;
  date: string;
  time?: string;
  venue: string;
  city: string;
  state: string;
}

export interface TicketmasterSearchGroup {
  title: string;
  artist: string;
  image: string;
  totalShows: number;
  shows: TicketmasterShow[];
}

export interface TicketmasterEventDetails {
  eventName: string;
  ticketmasterUrl: string;
  date: string;
  startTime: string;
  imageUrl: string;
  venue: string;
  location: string;
  latitude: string;
  longitude: string;
  timezone: string;
  seatMapUrl: string;
  orderNumber: string;
}

export interface TicketmasterFeedLocation {
  city: string;
  stateCode: string;
  countryCode: string;
}

export interface TicketmasterHomeEvent {
  id: string;
  title: string;
  imageUrl: string;
  localDate: string;
  localTime: string;
  venueName: string;
  city: string;
  stateCode: string;
  countryCode: string;
  ticketmasterUrl: string;
  attractionId: string;
  attractionName: string;
  segmentId: string;
  segment: string;
  genreId: string;
  genre: string;
}

export interface TicketmasterForYouFeed {
  location: TicketmasterFeedLocation | null;
  events: TicketmasterHomeEvent[];
}

export interface TicketmasterLastMinuteFeed {
  location: TicketmasterFeedLocation | null;
  events: TicketmasterHomeEvent[];
}

export interface TicketmasterWeekendFeed {
  location: TicketmasterFeedLocation | null;
  events: TicketmasterHomeEvent[];
}

export interface TicketmasterJustAnnouncedFeed {
  location: TicketmasterFeedLocation | null;
  events: TicketmasterHomeEvent[];
}

export interface TicketmasterTrendingItem {
  id: string;
  rank: string;
  name: string;
  genre: string;
  imageUrl: string;
  ticketmasterUrl: string;
}

export interface TicketmasterTrendingFeed {
  countryCode: string | null;
  items: TicketmasterTrendingItem[];
}

export interface TicketmasterPreferenceGenre {
  id: string;
  name: string;
}

export interface TicketmasterPreferenceCategory {
  id: string;
  name: string;
  genres: TicketmasterPreferenceGenre[];
}

export interface TicketmasterPreferenceOptions {
  categories: TicketmasterPreferenceCategory[];
}
