import { useQuery } from '@tanstack/react-query';
import { getMyEventByIdRequest } from '@/services/events/events.api';

export function useMyEvent(id: string | undefined) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: ({ signal }) => getMyEventByIdRequest(id!, signal),
    enabled: Boolean(id),
  });
}
