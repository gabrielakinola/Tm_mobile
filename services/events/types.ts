export type TicketMode = 'seated' | 'ga';

export type EventListStatus = 'all' | 'upcoming' | 'past';

export interface EventTicket {
  section: string;
  row?: string;
  seat?: string;
}

export interface CreatedEvent {
  id: string;
  userId: string;
  imageUrl: string;
  name: string;
  ticketmasterUrl?: string;
  eventDate: string;
  eventTime: string;
  purchaseDate?: string;
  purchaseTime?: string;
  venue: string;
  location?: string;
  entrance: string;
  latitude: string;
  longitude: string;
  timezone?: string;
  seatMapUrl: string;
  currency: string;
  price: string | null;
  fee: string | null;
  orderNumber: string;
  saleLabel: string;
  ticketMode: TicketMode;
  tickets: EventTicket[];
  hidden?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EventImageInput =
  | {
      kind: 'local';
      uri: string;
      fileName: string;
      mimeType?: string;
    }
  | {
      kind: 'remote';
      url: string;
    };

export interface CreateEventInput {
  name: string;
  ticketmasterUrl?: string;
  eventDate: string;
  eventTime: string;
  purchaseDate?: string;
  purchaseTime?: string;
  venue: string;
  entrance?: string;
  latitude?: string;
  longitude?: string;
  timezone?: string;
  seatMapUrl?: string;
  currency: string;
  price?: string;
  fee?: string;
  orderNumber: string;
  saleLabel: string;
  ticketMode: TicketMode;
  tickets: EventTicket[];
  image: EventImageInput;
}

export type UpdateEventInput = CreateEventInput;

export interface MyEventSummary {
  id: string;
  name: string;
  imageUrl: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  ticketCount: number;
  hidden: boolean;
}

export interface MyEventsListParams {
  status: EventListStatus;
  search?: string;
  page?: number;
  limit?: number;
  /** When true, include hidden events (Manage Events). My Tickets omits this. */
  includeHidden?: boolean;
}

export interface MyEventsResponse {
  status: EventListStatus;
  search: string;
  page: number | null;
  limit: number | null;
  total: number;
  upcomingCount: number;
  pastCount: number;
  allCount: number;
  events: MyEventSummary[];
}

export type MyEventDetail = CreatedEvent;
