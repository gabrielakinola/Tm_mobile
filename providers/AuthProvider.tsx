import { useEffect, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuthBootstrap } from '@/hooks/auth/useAuthBootstrap';
import { useSessionRealtime } from '@/hooks/auth/useSessionRealtime';
import { hideSplashOnce, preventSplashAutoHide } from '@/lib/splash';
import { useAuthStore } from '@/stores/auth-store';
import { useTheme } from '@/theme';

preventSplashAutoHide();

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const status = useAuthStore((state) => state.status);
  const { bootstrap } = useAuthBootstrap();

  useSessionRealtime();

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  // Hide splash only when leaving the initial auth bootstrap — not on later
  // login / logout / force-login navigations.
  useEffect(() => {
    if (status === 'idle' || status === 'loading') {
      return;
    }
    hideSplashOnce();
  }, [status]);

  useEffect(() => {
    if (status === 'idle' || status === 'loading') {
      return;
    }

    const inAuthGroup = segments[0] === 'login';

    if (status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/login');
    }

    if (status === 'authenticated' && inAuthGroup) {
      router.replace('/(tabs)/discover');
    }
  }, [router, segments, status]);

  if (status === 'idle' || status === 'loading') {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}
