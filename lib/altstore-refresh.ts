import * as SecureStore from 'expo-secure-store';
import { getDeviceInfo } from '@/lib/device-info';
import type { SubscriptionDaysLeftTone } from '@/lib/subscription';
import { getAltStoreRefreshStatusRequest } from '@/services/altstore/altstore.api';

export const ALTSTORE_REFRESH_CYCLE_DAYS = 7;
export const ALTSTORE_REFRESH_EXPIRES_AT_KEY = 'altstore_refresh_expires_at';

const DAY_MS = 24 * 60 * 60 * 1000;

export async function getAltStoreRefreshExpiresAt(): Promise<string | null> {
  const value = await SecureStore.getItemAsync(ALTSTORE_REFRESH_EXPIRES_AT_KEY);
  return value?.trim() || null;
}

export async function setAltStoreRefreshExpiresAtLocal(expiresAt: string | null): Promise<void> {
  if (!expiresAt?.trim()) {
    await SecureStore.deleteItemAsync(ALTSTORE_REFRESH_EXPIRES_AT_KEY);
    return;
  }
  await SecureStore.setItemAsync(ALTSTORE_REFRESH_EXPIRES_AT_KEY, expiresAt.trim());
}

/** Prefer server value when logged in; keep a local cache for this device. */
export async function syncAltStoreRefreshExpiresAt(): Promise<string | null> {
  const device = await getDeviceInfo();
  const local = await getAltStoreRefreshExpiresAt();

  try {
    const remote = await getAltStoreRefreshStatusRequest(device.deviceId);
    if (remote.expiresAt) {
      await setAltStoreRefreshExpiresAtLocal(remote.expiresAt);
      return remote.expiresAt;
    }

    // Server has no record yet — keep local cache if present (pre-backend installs).
    return local;
  } catch {
    return local;
  }
}

export function getAltStoreRefreshDaysLeft(
  expiresAt: string | null | undefined,
  now = new Date(),
): number | null {
  if (!expiresAt?.trim()) {
    return null;
  }

  const expiry = new Date(expiresAt);
  if (Number.isNaN(expiry.getTime())) {
    return null;
  }

  if (now.getTime() >= expiry.getTime()) {
    return 0;
  }

  return Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / DAY_MS));
}

/** Tone scale for a 7-day AltStore refresh cycle. */
export function getAltStoreRefreshDaysLeftTone(
  daysLeft: number,
): Exclude<SubscriptionDaysLeftTone, 'lifetime'> {
  if (daysLeft >= 5) {
    return 'green';
  }
  if (daysLeft >= 3) {
    return 'warning';
  }
  return 'danger';
}
