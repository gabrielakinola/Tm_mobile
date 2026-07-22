export type AccessType = 'LIFETIME' | 'MONTHLY';

export type DevicePlatform = 'ios' | 'android' | 'web';

export interface DefaultProfileSummary {
  id: string;
  displayName: string;
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

export interface ActiveSessionConflictError {
  statusCode: 409;
  message: string;
  code: 'ACTIVE_SESSION_CONFLICT';
  activeSession: ActiveSessionSummary;
  error: string;
  path: string;
  timestamp: string;
}
