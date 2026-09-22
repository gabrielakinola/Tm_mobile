import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminUserRequest,
  deleteAdminUserRequest,
  extendAdminUserSubscriptionRequest,
  getAdminUserActivityRequest,
  getAdminUserRequest,
  listAdminUsersRequest,
  type AdminUserActivitySort,
  type CreateAdminUserInput,
} from '@/services/admin/admin.api';

export const adminUsersQueryKey = ['admin', 'users'] as const;

export function adminUserActivityQueryKey(
  userId: string | undefined,
  date: string,
  sort: AdminUserActivitySort,
) {
  return [...adminUsersQueryKey, userId, 'activity', date, sort] as const;
}

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

export function useAdminUserActivity(
  userId: string | undefined,
  date: string,
  sort: AdminUserActivitySort,
) {
  const timezoneOffsetMinutes = (() => {
    const [year, month, day] = date.split('-').map(Number);
    if (!year || !month || !day) {
      return new Date().getTimezoneOffset();
    }
    return new Date(year, month - 1, day, 12, 0, 0).getTimezoneOffset();
  })();

  return useQuery({
    queryKey: [...adminUserActivityQueryKey(userId, date, sort), timezoneOffsetMinutes],
    queryFn: () =>
      getAdminUserActivityRequest({
        userId: userId!,
        date,
        sort,
        timezoneOffsetMinutes,
      }),
    enabled: Boolean(userId && date),
    placeholderData: (previous) => previous,
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

export function useExtendAdminUserSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => extendAdminUserSubscriptionRequest(userId),
    onSuccess: async (_data, userId) => {
      await queryClient.invalidateQueries({ queryKey: adminUsersQueryKey });
      await queryClient.invalidateQueries({ queryKey: [...adminUsersQueryKey, userId] });
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
