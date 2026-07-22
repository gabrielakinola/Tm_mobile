import { useMutation } from '@tanstack/react-query';
import { getTicketmasterEventDetails } from '@/services/ticketmaster/ticketmaster.api';

export function useTicketmasterEventDetails() {
  return useMutation({
    mutationFn: (id: string) => getTicketmasterEventDetails(id),
  });
}
