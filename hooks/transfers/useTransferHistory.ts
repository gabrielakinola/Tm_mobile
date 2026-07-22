import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  clearTransferHistoryRequest,
  deleteTransferRequest,
  getTransferByIdRequest,
  getTransferHistoryRequest,
  TRANSFER_HISTORY_PAGE_SIZE,
  type TransferHistoryFilters,
} from '@/services/transfers/transfers.api';

export const transferHistoryQueryKey = ['transfers', 'history'] as const;

export function transferHistoryListKey(search: string) {
  return [...transferHistoryQueryKey, 'list', search.trim()] as const;
}

export function transferDetailQueryKey(id: string) {
  return [...transferHistoryQueryKey, 'detail', id] as const;
}

export function useTransferHistory(filters: TransferHistoryFilters = {}) {
  const search = filters.search?.trim() ?? '';

  return useInfiniteQuery({
    queryKey: transferHistoryListKey(search),
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      getTransferHistoryRequest(
        {
          search: search || undefined,
          page: pageParam,
          limit: TRANSFER_HISTORY_PAGE_SIZE,
        },
        signal,
      ),
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.page * lastPage.limit;
      if (loaded >= lastPage.total) {
        return undefined;
      }
      return lastPage.page + 1;
    },
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useTransferDetail(id: string | undefined) {
  return useQuery({
    queryKey: transferDetailQueryKey(id ?? ''),
    queryFn: ({ signal }) => getTransferByIdRequest(id as string, signal),
    enabled: Boolean(id),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useDeleteTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTransferRequest(id),
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({ queryKey: transferHistoryQueryKey });
      queryClient.removeQueries({ queryKey: transferDetailQueryKey(id) });
    },
  });
}

export function useClearTransferHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearTransferHistoryRequest(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: transferHistoryQueryKey });
    },
  });
}
