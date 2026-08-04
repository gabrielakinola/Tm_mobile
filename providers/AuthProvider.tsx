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

function isSuperAdmin(role: string | undefined | null): boolean {
  return role === 'SUPERADMIN';
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
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
    const inAdminGroup = segments[0] === 'admin';
    const adminUser = isSuperAdmin(user?.role);

    if (status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/login');
      return;
    }

    if (status !== 'authenticated') {
      return;
    }

    if (adminUser) {
      if (inAuthGroup || !inAdminGroup) {
        router.replace('/admin/users');
      }
      return;
    }

    if (inAdminGroup) {
      router.replace('/(tabs)/discover');
      return;
    }

    if (inAuthGroup) {
      router.replace('/(tabs)/discover');
    }
  }, [router, segments, status, user?.role]);

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
