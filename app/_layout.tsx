import 'react-native-gesture-handler';
import '../global.css';
import { Stack } from 'expo-router';
import { AppProviders } from '@/providers/AppProviders';
import { AuthProvider } from '@/providers/AuthProvider';

export default function RootLayout() {
  return (
    <AppProviders>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </AppProviders>
  );
}
