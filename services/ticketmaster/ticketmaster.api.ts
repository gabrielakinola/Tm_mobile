import { apiClient } from '../api/client';
import type {
  TicketmasterEventDetails,
  TicketmasterForYouFeed,
  TicketmasterJustAnnouncedFeed,
  TicketmasterLastMinuteFeed,
  TicketmasterPreferenceOptions,
  TicketmasterSearchGroup,
  TicketmasterTrendingFeed,
  TicketmasterWeekendFeed,
} from './types';

export async function searchTicketmasterEvents(
  keyword: string,
  signal?: AbortSignal,
): Promise<TicketmasterSearchGroup[]> {
  const response = await apiClient.get<TicketmasterSearchGroup[]>('/ticketmaster/search', {
    params: { keyword },
    signal,
  });

  return response.data;
}

export async function getTicketmasterEventDetails(id: string): Promise<TicketmasterEventDetails> {
  const response = await apiClient.get<TicketmasterEventDetails>(`/ticketmaster/events/${id}`);
  return response.data;
}

export async function getTicketmasterForYouFeed(
  signal?: AbortSignal,
): Promise<TicketmasterForYouFeed> {
  const response = await apiClient.get<TicketmasterForYouFeed>('/ticketmaster/for-you', {
    signal,
  });
  return response.data;
}

export async function getTicketmasterLastMinuteFeed(
  signal?: AbortSignal,
): Promise<TicketmasterLastMinuteFeed> {
  const response = await apiClient.get<TicketmasterLastMinuteFeed>('/ticketmaster/last-minute', {
    signal,
  });
  return response.data;
}

export async function getTicketmasterWeekendFeed(
  signal?: AbortSignal,
): Promise<TicketmasterWeekendFeed> {
  const response = await apiClient.get<TicketmasterWeekendFeed>('/ticketmaster/weekend', {
    signal,
  });
  return response.data;
}

export async function getTicketmasterJustAnnouncedFeed(
  signal?: AbortSignal,
): Promise<TicketmasterJustAnnouncedFeed> {
  const response = await apiClient.get<TicketmasterJustAnnouncedFeed>(
    '/ticketmaster/just-announced',
    { signal },
  );
  return response.data;
}

export async function getTicketmasterTrendingFeed(
  signal?: AbortSignal,
): Promise<TicketmasterTrendingFeed> {
  const response = await apiClient.get<TicketmasterTrendingFeed>('/ticketmaster/trending', {
    signal,
  });
  return response.data;
}

export async function getTicketmasterPreferenceOptions(
  signal?: AbortSignal,
): Promise<TicketmasterPreferenceOptions> {
  const response = await apiClient.get<TicketmasterPreferenceOptions>(
    '/ticketmaster/preferences/options',
    { signal },
  );
  return response.data;
}
