import { useMutation } from '@tanstack/react-query';
import { getLoginErrorMessage } from '@/lib/auth-errors';
import { getDeviceInfo } from '@/lib/device-info';
import { clearAccessToken, setAccessToken } from '@/lib/secure-storage';
import { forceLoginRequest, loginRequest, type LoginCredentials } from '@/services/auth/auth.api';
import type { AuthUser } from '@/services/auth/types';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';

function syncDefaultProfile(user: AuthUser) {
  useProfileStore.getState().setDefaultProfile(user.defaultProfile ?? null);
}

async function applyAuthSuccess(
  data: { accessToken: string; user: AuthUser },
  setAuthenticated: (user: AuthUser, accessToken: string) => void,
) {
  await setAccessToken(data.accessToken);
  setAuthenticated(data.user, data.accessToken);
  syncDefaultProfile(data.user);
}

export function useLogin() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const device = await getDeviceInfo();
      return loginRequest({ ...credentials, ...device });
    },
    onSuccess: async (data) => {
      await applyAuthSuccess(data, setAuthenticated);
    },
    onError: async (error) => {
      // Conflict means credentials are valid but another device holds the session —
      // do not treat it as a failed token write.
      if (error && typeof error === 'object' && 'response' in error) {
        const status = (error as { response?: { status?: number } }).response?.status;
        if (status === 409) {
          return;
        }
      }
      await clearAccessToken();
    },
    meta: {
      getErrorMessage: getLoginErrorMessage,
    },
  });
}

export function useForceLogin() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const device = await getDeviceInfo();
      return forceLoginRequest({ ...credentials, ...device });
    },
    onSuccess: async (data) => {
      await applyAuthSuccess(data, setAuthenticated);
    },
    onError: async () => {
      await clearAccessToken();
    },
    meta: {
      getErrorMessage: getLoginErrorMessage,
    },
  });
}
