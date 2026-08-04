import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminUserRequest,
  deleteAdminUserRequest,
  getAdminUserRequest,
  listAdminUsersRequest,
  type CreateAdminUserInput,
} from '@/services/admin/admin.api';

export const adminUsersQueryKey = ['admin', 'users'] as const;

export function useAdminUsers() {
  return useQuery({
    queryKey: adminUsersQueryKey,
    queryFn: listAdminUsersRequest,
  });
}

export function useAdminUser(userId: string | undefined) {
  return useQuery({
    queryKey: [...adminUsersQueryKey, userId],
    queryFn: () => getAdminUserRequest(userId!),
    enabled: Boolean(userId),
  });
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAdminUserInput) => createAdminUserRequest(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminUsersQueryKey });
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteAdminUserRequest(userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminUsersQueryKey });
    },
  });
}
