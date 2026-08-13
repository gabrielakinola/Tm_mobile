import type { DeviceInfo } from '@/lib/device-info';
import { apiClient } from '../api/client';

export interface AltStoreRefreshStatus {
  deviceId: string;
  expiresAt: string | null;
  lastRefreshedAt: string | null;
  daysLeft: number | null;
  cycleDays: number;
}

export async function getAltStoreRefreshStatusRequest(
  deviceId: string,
): Promise<AltStoreRefreshStatus> {
  const response = await apiClient.get<AltStoreRefreshStatus>('/altstore-refresh', {
    params: { deviceId },
  });
  return response.data;
}

export async function markAltStoreRefreshedRequest(
  device: DeviceInfo,
): Promise<AltStoreRefreshStatus> {
  const response = await apiClient.post<AltStoreRefreshStatus>('/altstore-refresh/refreshed', {
    deviceId: device.deviceId,
    deviceName: device.deviceName,
    platform: device.platform,
  });
  return response.data;
}
