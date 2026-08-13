export type AccessType = 'LIFETIME' | 'MONTHLY';

export type UserRole = 'USER' | 'SUPERADMIN';

export type DevicePlatform = 'ios' | 'android' | 'web';

export interface DefaultProfileSummary {
  id: string;
  firstName: string;
  lastName: string;
  displayEmail: string;
  city: string;
  mobileLast4: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  accountName: string;
  accessType: AccessType;
  role: UserRole;
  subscriptionExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  defaultProfile: DefaultProfileSummary | null;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LogoutResponse {
  success: boolean;
}

export interface ActiveSessionSummary {
  deviceName: string;
  platform: DevicePlatform | string;
  lastActiveAt: string;
}

export interface DeviceChangePolicy {
  applies: boolean;
  changeUsed: boolean;
  changesRemaining: number | null;
  cycleEndsAt: string | null;
}

export interface ActiveSessionConflictError {
  statusCode: 409;
  message: string;
  code: 'ACTIVE_SESSION_CONFLICT';
  activeSession: ActiveSessionSummary;
  deviceChangePolicy?: DeviceChangePolicy;
  error: string;
  path: string;
  timestamp: string;
}

export interface DeviceChangeLimitError {
  statusCode: 403;
  message: string;
  code: 'DEVICE_CHANGE_LIMIT_REACHED';
  deviceChangePolicy?: DeviceChangePolicy;
  error: string;
  path: string;
  timestamp: string;
}
