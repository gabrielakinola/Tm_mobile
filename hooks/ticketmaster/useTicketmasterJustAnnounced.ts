import { useQuery } from '@tanstack/react-query';
import { getTicketmasterJustAnnouncedFeed } from '@/services/ticketmaster/ticketmaster.api';

export function useTicketmasterJustAnnounced(enabled: boolean, profileKey: string) {
  return useQuery({
    queryKey: ['ticketmaster', 'just-announced', profileKey],
    enabled,
    queryFn: ({ signal }) => getTicketmasterJustAnnouncedFeed(signal),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    retry: 1,
  });
}
