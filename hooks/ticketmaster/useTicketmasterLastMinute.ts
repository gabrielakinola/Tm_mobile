import { useQuery } from '@tanstack/react-query';
import { getTicketmasterLastMinuteFeed } from '@/services/ticketmaster/ticketmaster.api';

export function useTicketmasterLastMinute(enabled: boolean, profileKey: string) {
  return useQuery({
    queryKey: ['ticketmaster', 'last-minute', profileKey],
    enabled,
    queryFn: ({ signal }) => getTicketmasterLastMinuteFeed(signal),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    retry: 1,
  });
}
