import { Platform } from 'react-native';
import Constants from 'expo-constants';

const API_PORT = 3000;
const API_PREFIX = '/api';

function getDevServerHost(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.expoGoConfig?.debuggerHost ??
    (Constants.manifest2?.extra?.expoClient?.hostUri as string | undefined);

  if (!hostUri) {
    return null;
  }

  const host = hostUri.split(':')[0];
  return host || null;
}

function getFallbackLocalApiUrl(): string {
  if (Platform.OS === 'android' && !Constants.isDevice) {
    return `http://10.0.2.2:${API_PORT}${API_PREFIX}`;
  }

  return `http://localhost:${API_PORT}${API_PREFIX}`;
}

export function getApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const devHost = getDevServerHost();

  if (devHost && devHost !== 'localhost') {
    return `http://${devHost}:${API_PORT}${API_PREFIX}`;
  }

  return getFallbackLocalApiUrl();
}
