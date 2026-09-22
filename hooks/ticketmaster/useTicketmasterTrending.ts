import { useQuery } from '@tanstack/react-query';
import { getTicketmasterTrendingFeed } from '@/services/ticketmaster/ticketmaster.api';

export function useTicketmasterTrending(
  enabled: boolean,
  countryCode: string,
  preferenceKey: string,
) {
  return useQuery({
    queryKey: ['ticketmaster', 'trending', countryCode, preferenceKey],
    enabled,
    queryFn: ({ signal }) => getTicketmasterTrendingFeed(signal),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: 1,
  });
}
