import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clearAccessToken } from '@/lib/secure-storage';
import { logoutRequest } from '@/services/auth/auth.api';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';

export function useLogout() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logoutRequest,
    onSettled: async () => {
      await clearAccessToken();
      clearAuth();
      useProfileStore.getState().clearProfile();
      queryClient.clear();
    },
  });
}
