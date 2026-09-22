import { useQuery } from '@tanstack/react-query';
import { getTicketmasterPreferenceOptions } from '@/services/ticketmaster/ticketmaster.api';

export function useTicketmasterPreferenceOptions(enabled = true) {
  return useQuery({
    queryKey: ['ticketmaster', 'preferences', 'options'],
    enabled,
    queryFn: ({ signal }) => getTicketmasterPreferenceOptions(signal),
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
  });
}
