import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui';
import { clearAccessToken } from '@/lib/secure-storage';
import {
  formatSessionExpiredMessage,
  onSessionExpired,
  type SessionExpiredPayload,
} from '@/lib/session-events';
import { connectSessionSocket, disconnectSessionSocket } from '@/lib/session-socket';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';

/**
 * Keeps a realtime session socket while authenticated and handles
 * remote session revocation (force login on another device).
 */
export function useSessionRealtime() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  const status = useAuthStore((state) => state.status);
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const handlingRef = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated' || !accessToken) {
      disconnectSessionSocket();
      return;
    }

    void connectSessionSocket(accessToken);

    return () => {
      disconnectSessionSocket();
    };
  }, [accessToken, status]);

  useEffect(() => {
    return onSessionExpired((payload: SessionExpiredPayload) => {
      if (handlingRef.current) {
        return;
      }

      const authStatus = useAuthStore.getState().status;
      if (authStatus !== 'authenticated') {
        return;
      }

      handlingRef.current = true;

      void (async () => {
        try {
          disconnectSessionSocket();
          await clearAccessToken();
          clearAuth();
          useProfileStore.getState().clearProfile();
          queryClient.clear();
          show({
            message: formatSessionExpiredMessage(payload),
            variant: 'warning',
            duration: 5000,
          });
        } finally {
          // Allow future events after a short delay (e.g. next login session).
          setTimeout(() => {
            handlingRef.current = false;
          }, 1000);
        }
      })();
    });
  }, [clearAuth, queryClient, show]);
}
