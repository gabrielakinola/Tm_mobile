import { apiClient } from '../api/client';
import type { TicketmasterEventDetails, TicketmasterSearchGroup } from './types';

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
