import { apiClient } from '../api/client';

export interface UserSettingsResponse {
  enableWalletForTicketTransfers: boolean;
  walletPassesRemaining: number;
  unlimitedWalletPasses: boolean;
  enableTransferFeeInterruption: boolean;
  transferFeePerTicket: string;
  enableMinTicketsInterruption: boolean;
  minTicketsPerTransfer: string;
  enableTransferAcceptanceAuthorization: boolean;
}

export interface UpdateUserSettingsInput {
  enableWalletForTicketTransfers?: boolean;
  enableTransferFeeInterruption?: boolean;
  transferFeePerTicket?: string;
  enableMinTicketsInterruption?: boolean;
  minTicketsPerTransfer?: string;
  enableTransferAcceptanceAuthorization?: boolean;
}

export async function getUserSettings(): Promise<UserSettingsResponse> {
  const { data } = await apiClient.get<UserSettingsResponse>('/settings');
  return data;
}

export async function updateUserSettings(
  input: UpdateUserSettingsInput,
): Promise<UserSettingsResponse> {
  const { data } = await apiClient.patch<UserSettingsResponse>('/settings', input);
  return data;
}
