import { useQuery } from '@tanstack/react-query';
import { getTicketmasterForYouFeed } from '@/services/ticketmaster/ticketmaster.api';

export function useTicketmasterForYou(enabled: boolean, locationKey: string) {
  return useQuery({
    queryKey: ['ticketmaster', 'for-you', locationKey],
    enabled,
    queryFn: ({ signal }) => getTicketmasterForYouFeed(signal),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    retry: 1,
  });
}
