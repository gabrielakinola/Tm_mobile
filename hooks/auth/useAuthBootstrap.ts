import { useCallback } from 'react';
import { isSubscriptionExpiredError } from '@/lib/auth-errors';
import { clearAccessToken, getAccessToken } from '@/lib/secure-storage';
import { isMonthlySubscriptionExpired } from '@/lib/subscription';
import { isUnauthorizedError } from '@/services/api/client';
import { getCurrentUserRequest } from '@/services/auth/auth.api';
import type { AuthUser } from '@/services/auth/types';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';

function syncDefaultProfile(user: AuthUser) {
  useProfileStore.getState().setDefaultProfile(user.defaultProfile ?? null);
}

export function useAuthBootstrap() {
  const setLoading = useAuthStore((state) => state.setLoading);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const bootstrap = useCallback(async () => {
    setLoading();

    const token = await getAccessToken();

    if (!token) {
      clearAuth();
      useProfileStore.getState().clearProfile();
      return;
    }

    try {
      const user = await getCurrentUserRequest();

      if (user.role !== 'SUPERADMIN' && isMonthlySubscriptionExpired(user)) {
        await clearAccessToken();
        clearAuth();
        useProfileStore.getState().clearProfile();
        return;
      }

      setAuthenticated(user, token);
      syncDefaultProfile(user);
    } catch (error) {
      if (isUnauthorizedError(error) || isSubscriptionExpiredError(error)) {
        await clearAccessToken();
      }

      clearAuth();
      useProfileStore.getState().clearProfile();
    }
  }, [clearAuth, setAuthenticated, setLoading]);

  return { bootstrap };
}
