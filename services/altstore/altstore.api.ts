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
