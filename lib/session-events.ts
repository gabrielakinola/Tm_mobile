export type SessionExpiredReason = 'logged_in_elsewhere' | 'unauthorized';

export interface SessionExpiredPayload {
  reason: SessionExpiredReason;
  deviceName?: string;
  platform?: string;
  message?: string;
}

type SessionExpiredListener = (payload: SessionExpiredPayload) => void;

const listeners = new Set<SessionExpiredListener>();

export function onSessionExpired(listener: SessionExpiredListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emitSessionExpired(payload: SessionExpiredPayload): void {
  listeners.forEach((listener) => {
    try {
      listener(payload);
    } catch {
      // Ignore listener errors so one bad subscriber cannot break others.
    }
  });
}

export function formatSessionExpiredMessage(payload: SessionExpiredPayload): string {
  if (payload.message) {
    return payload.message;
  }

  if (payload.reason === 'logged_in_elsewhere') {
    const platform =
      payload.platform === 'ios'
        ? 'iOS'
        : payload.platform === 'android'
          ? 'Android'
          : payload.platform === 'web'
            ? 'Web'
            : payload.platform;
    const device = payload.deviceName
      ? `${payload.deviceName}${platform ? ` (${platform})` : ''}`
      : 'another device';
    return `You signed in on ${device}. This session has expired.`;
  }

  return 'Your session has expired. Please sign in again.';
}
