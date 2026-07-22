import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/auth-store';

export default function Index() {
  const status = useAuthStore((state) => state.status);

  if (status === 'authenticated') {
    return <Redirect href="/(tabs)/discover" />;
  }

  return <Redirect href="/login" />;
}
