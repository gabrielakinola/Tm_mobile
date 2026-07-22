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
  date: string;
  startTime: string;
  imageUrl: string;
  venue: string;
  location: string;
  latitude: string;
  longitude: string;
  seatMapUrl: string;
  orderNumber: string;
}
