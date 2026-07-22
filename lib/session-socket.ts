import { io, type Socket } from 'socket.io-client';
import { getApiBaseUrl } from '@/lib/api-base-url';
import { getDeviceInfo } from '@/lib/device-info';
import { emitSessionExpired, type SessionExpiredPayload } from '@/lib/session-events';

const SESSION_REVOKED_EVENT = 'session:revoked';

let socket: Socket | null = null;
let connecting = false;

function getSocketOrigin(): string {
  // API base includes /api; Socket.IO mounts on the server root.
  return getApiBaseUrl().replace(/\/api\/?$/, '');
}

export async function connectSessionSocket(accessToken: string): Promise<void> {
  if (connecting) {
    return;
  }

  if (socket?.connected) {
    return;
  }

  connecting = true;

  try {
    const device = await getDeviceInfo();
    disconnectSessionSocket();

    socket = io(`${getSocketOrigin()}/sessions`, {
      transports: ['websocket'],
      auth: {
        token: accessToken,
        deviceId: device.deviceId,
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
    });

    socket.on(SESSION_REVOKED_EVENT, (payload: SessionExpiredPayload) => {
      emitSessionExpired({
        reason: 'logged_in_elsewhere',
        deviceName: payload.deviceName,
        platform: payload.platform,
      });
    });
  } finally {
    connecting = false;
  }
}

export function disconnectSessionSocket(): void {
  if (!socket) {
    return;
  }

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}
