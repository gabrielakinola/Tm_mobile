import 'react-native-gesture-handler';
import '../global.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { NotoSerif_400Regular } from '@expo-google-fonts/noto-serif';
import { AppProviders } from '@/providers/AppProviders';
import { AuthProvider } from '@/providers/AuthProvider';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ NotoSerif_400Regular });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProviders>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </AppProviders>
  );
}
