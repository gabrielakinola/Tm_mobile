import { useQuery } from '@tanstack/react-query';
import { getMyEventsRequest } from '@/services/events/events.api';
import type { EventListStatus } from '@/services/events/types';

export function useMyEvents(status: EventListStatus) {
  return useQuery({
    queryKey: ['events', 'mine', status],
    queryFn: ({ signal }) => getMyEventsRequest(status, signal),
  });
}

export function useMyEventsPrefetch() {
  const upcomingQuery = useMyEvents('upcoming');
  const pastQuery = useMyEvents('past');

  const upcomingCount = upcomingQuery.data?.upcomingCount ?? pastQuery.data?.upcomingCount ?? 0;
  const pastCount = upcomingQuery.data?.pastCount ?? pastQuery.data?.pastCount ?? 0;

  return {
    upcomingQuery,
    pastQuery,
    upcomingCount,
    pastCount,
  };
}
