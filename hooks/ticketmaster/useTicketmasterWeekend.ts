import { useQuery } from '@tanstack/react-query';
import { getTicketmasterWeekendFeed } from '@/services/ticketmaster/ticketmaster.api';

export function useTicketmasterWeekend(enabled: boolean, profileKey: string) {
  return useQuery({
    queryKey: ['ticketmaster', 'weekend', profileKey],
    enabled,
    queryFn: ({ signal }) => getTicketmasterWeekendFeed(signal),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    retry: 1,
  });
}
