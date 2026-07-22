import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteEventRequest,
  getMyEventsRequest,
  updateEventRequest,
} from '@/services/events/events.api';
import type { EventListStatus, UpdateEventInput } from '@/services/events/types';

export const MANAGE_EVENTS_PAGE_SIZE = 20;

export function manageEventsQueryKey(status: EventListStatus, search: string) {
  return ['events', 'manage', status, search] as const;
}

export function useManageEvents(status: EventListStatus, search: string) {
  const normalizedSearch = search.trim();

  return useInfiniteQuery({
    queryKey: manageEventsQueryKey(status, normalizedSearch),
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      getMyEventsRequest(
        {
          status,
          search: normalizedSearch || undefined,
          page: pageParam,
          limit: MANAGE_EVENTS_PAGE_SIZE,
        },
        signal,
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.page == null || lastPage.limit == null) {
        return undefined;
      }
      const loaded = lastPage.page * lastPage.limit;
      if (loaded >= lastPage.total) {
        return undefined;
      }
      return lastPage.page + 1;
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEventInput }) =>
      updateEventRequest(id, input),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['events', variables.id] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEventRequest(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['transfers'] });
    },
  });
}
