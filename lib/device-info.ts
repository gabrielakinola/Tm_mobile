import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const DEVICE_ID_KEY = 'device_id';

export type DevicePlatform = 'ios' | 'android' | 'web';

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  platform: DevicePlatform;
}

function createDeviceId(): string {
  return `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

function resolvePlatform(): DevicePlatform {
  if (Platform.OS === 'ios') return 'ios';
  if (Platform.OS === 'android') return 'android';
  return 'web';
}

function resolveDeviceName(platform: DevicePlatform): string {
  if (platform === 'ios') return 'iPhone';
  if (platform === 'android') return 'Android';
  return 'Web';
}

export async function getDeviceInfo(): Promise<DeviceInfo> {
  let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = createDeviceId();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
  }

  const platform = resolvePlatform();

  return {
    deviceId,
    deviceName: resolveDeviceName(platform),
    platform,
  };
}
