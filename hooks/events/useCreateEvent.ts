import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEventRequest } from '@/services/events/events.api';
import type { CreateEventInput } from '@/services/events/types';

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEventInput) => createEventRequest(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
