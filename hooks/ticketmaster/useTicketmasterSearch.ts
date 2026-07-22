import { useQuery } from '@tanstack/react-query';
import { searchTicketmasterEvents } from '@/services/ticketmaster/ticketmaster.api';

export function useTicketmasterSearch(keyword: string, enabled: boolean) {
  return useQuery({
    queryKey: ['ticketmaster', 'search', keyword],
    enabled,
    queryFn: ({ signal }) => searchTicketmasterEvents(keyword, signal),
    staleTime: 0,
    gcTime: 1000 * 60 * 3,
  });
}
