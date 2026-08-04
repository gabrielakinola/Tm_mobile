import { apiClient } from '@/services/api/client';
import type { AccessType, DefaultProfileSummary } from '@/services/auth/types';

export interface AdminUserSummary {
  id: string;
  email: string;
  accountName: string;
  accessType: AccessType;
  role: 'USER';
  subscriptionExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  defaultProfile: DefaultProfileSummary | null;
}

export interface AdminUserDetail extends AdminUserSummary {
  profiles: DefaultProfileSummary[];
  settings: {
    enableWalletForTicketTransfers: boolean;
    walletPassesRemaining: number;
    unlimitedWalletPasses: boolean;
    enableTransferFeeInterruption: boolean;
    transferFeePerTicket: string;
    enableMinTicketsInterruption: boolean;
    minTicketsPerTransfer: string;
    enableTransferAcceptanceAuthorization: boolean;
  };
}

export interface CreateAdminUserInput {
  email: string;
  accessType: AccessType;
}

export interface CreateAdminUserResponse extends AdminUserSummary {
  password: string;
}

export async function listAdminUsersRequest(): Promise<AdminUserSummary[]> {
  const response = await apiClient.get<AdminUserSummary[]>('/admin/users');
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

export async function deleteAdminUserRequest(
  userId: string,
): Promise<{ success: boolean; id: string }> {
  const response = await apiClient.delete<{ success: boolean; id: string }>(
    `/admin/users/${userId}`,
  );
  return response.data;
}
