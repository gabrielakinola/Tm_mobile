import { apiClient } from '@/services/api/client';
import type { AccessType, DefaultProfileSummary } from '@/services/auth/types';

export interface AdminUserSummary {
  id: string;
  email: string;
  accountName: string;
  accessType: AccessType;
  pendingAccessType?: AccessType | null;
  role: 'USER';
  subscriptionExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  defaultProfile: DefaultProfileSummary | null;
  /** Transfers created today in the admin's local timezone. */
  transfersToday: number;
  /** Screenshots + recordings today in the admin's local timezone. */
  capturesToday: number;
}

export interface AdminUserDetail extends AdminUserSummary {
  profiles: DefaultProfileSummary[];
  settings: {
    enableWalletForTicketTransfers: boolean;
    walletPassesRemaining: number;
    unlimitedWalletPasses: boolean;
    enableTransferFeeInterruption: boolean;
    transferFeePerTicket: string;
    transferFeeCurrency?: string;
    enableMinTicketsInterruption: boolean;
    minTicketsPerTransfer: string;
    enableTransferAcceptanceAuthorization: boolean;
    enableTicketScreenshotBlocking: boolean;
  };
}

export interface CreateAdminUserInput {
  email: string;
  accessType: AccessType;
}

export interface CreateAdminUserResponse extends AdminUserSummary {
  password: string;
}

export async function listAdminUsersRequest(
  timezoneOffsetMinutes = new Date().getTimezoneOffset(),
): Promise<AdminUserSummary[]> {
  const response = await apiClient.get<AdminUserSummary[]>('/admin/users', {
    params: { timezoneOffsetMinutes },
  });
  return response.data;
}

export async function getAdminUserRequest(userId: string): Promise<AdminUserDetail> {
  const response = await apiClient.get<AdminUserDetail>(`/admin/users/${userId}`);
  return response.data;
}

export async function createAdminUserRequest(
  input: CreateAdminUserInput,
): Promise<CreateAdminUserResponse> {
  const response = await apiClient.post<CreateAdminUserResponse>('/admin/users', input);
  return response.data;
}

export type AdminSubscriptionAction = 'renew' | 'topup';

export interface ExtendAdminUserSubscriptionResponse extends AdminUserSummary {
  action: AdminSubscriptionAction;
}

export async function extendAdminUserSubscriptionRequest(
  userId: string,
): Promise<ExtendAdminUserSubscriptionResponse> {
  const response = await apiClient.post<ExtendAdminUserSubscriptionResponse>(
    `/admin/users/${userId}/extend-subscription`,
  );
  return response.data;
}

export type AdminAccessChangeAction =
  'upgraded' | 'downgraded' | 'downgrade_scheduled' | 'cancelled_pending';

export type AdminAccessChangeEffective = 'immediate' | 'next_cycle';

export interface ChangeAdminUserAccessResponse extends AdminUserSummary {
  action: AdminAccessChangeAction;
  effective: AdminAccessChangeEffective;
  pendingAccessType?: AccessType | null;
  effectiveAt?: string | null;
}

export async function changeAdminUserAccessRequest(
  userId: string,
  accessType: AccessType,
): Promise<ChangeAdminUserAccessResponse> {
  const response = await apiClient.post<ChangeAdminUserAccessResponse>(
    `/admin/users/${userId}/change-access`,
    { accessType },
  );
  return response.data;
}

export async function deleteAdminUserRequest(
  userId: string,
): Promise<{ success: boolean; id: string }> {
  const response = await apiClient.delete<{ success: boolean; id: string }>(
    `/admin/users/${userId}`,
  );
  return response.data;
}

export type AdminUserActivitySort = 'most' | 'least';

export interface AdminUserActivityEvent {
  id: string;
  name: string;
  imageUrl: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  ticketCount: number;
  hidden: boolean;
  createdAt: string;
  lastTransferAt?: string;
  transferCount: number;
}

export interface AdminUserTopEvent {
  id: string;
  name: string;
  imageUrl: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  captureCount: number;
  screenshotCount: number;
  recordingCount: number;
}

export interface AdminUserActivityResponse {
  date: string;
  sort: AdminUserActivitySort;
  user: {
    id: string;
    email: string;
    accountName: string;
  };
  eventCount: number;
  transferCount: number;
  events: AdminUserActivityEvent[];
  topEvents: AdminUserTopEvent[];
  topEventCaptureCount: number;
}

export interface GetAdminUserActivityInput {
  userId: string;
  date: string;
  sort: AdminUserActivitySort;
  timezoneOffsetMinutes: number;
}

export async function getAdminUserActivityRequest(
  input: GetAdminUserActivityInput,
): Promise<AdminUserActivityResponse> {
  const response = await apiClient.get<AdminUserActivityResponse>(
    `/admin/users/${input.userId}/activity`,
    {
      params: {
        date: input.date,
        sort: input.sort,
        timezoneOffsetMinutes: input.timezoneOffsetMinutes,
      },
    },
  );
  return response.data;
}
