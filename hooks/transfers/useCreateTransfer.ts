import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transferHistoryQueryKey } from '@/hooks/transfers/useTransferHistory';
import {
  createTransferRequest,
  type CreateTransferInput,
  type CreateTransferResponse,
} from '@/services/transfers/transfers.api';

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation<CreateTransferResponse, Error, CreateTransferInput>({
    mutationFn: (input) => createTransferRequest(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transferHistoryQueryKey });
    },
  });
}
