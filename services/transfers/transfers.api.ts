import { apiClient } from '../api/client';
import type { EventTicket } from '../events/types';

export type TransferStatus = 'email_received' | 'tickets_accepted' | 'transfer_completed';

export interface CreateTransferInput {
  eventId: string;
  tickets: EventTicket[];
  firstName: string;
  lastName: string;
  email: string;
  note?: string;
}

export interface CreateTransferResponse {
  id: string;
  status: TransferStatus;
}

export interface TransferHistoryTicket {
  section: string;
  row: string;
  seat: string;
}

export interface TransferHistoryItem {
  id: string;
  status: TransferStatus;
  ticketCount: number;
  transferredAt: string;
  requiresSenderAuthorization: boolean;
  senderAuthorizationGranted: boolean;
  pendingSenderAuthorization: boolean;
  recipient: {
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    note: string;
  };
  event: {
    id: string;
    name: string;
    imageUrl: string;
    eventDate: string;
    eventTime: string;
    venue: string;
  } | null;
  tickets: TransferHistoryTicket[];
}

export interface TransferHistoryFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface TransferHistoryListResponse {
  search: string;
  page: number;
  limit: number;
  total: number;
  transfers: TransferHistoryItem[];
}

export const TRANSFER_STATUS_LABELS: Record<TransferStatus, string> = {
  email_received: 'Email received',
  tickets_accepted: 'Tickets Accepted',
  transfer_completed: 'Transfer Completed',
};

export const TRANSFER_PENDING_AUTHORIZATION_LABEL = 'Pending authorization';

export function getTransferHistoryStatusLabel(
  transfer: Pick<TransferHistoryItem, 'status' | 'pendingSenderAuthorization'>,
): string {
  if (transfer.pendingSenderAuthorization) {
    return TRANSFER_PENDING_AUTHORIZATION_LABEL;
  }

  return TRANSFER_STATUS_LABELS[transfer.status] ?? transfer.status;
}

export async function authorizeTransferAcceptanceRequest(id: string): Promise<TransferHistoryItem> {
  const response = await apiClient.post<TransferHistoryItem>(
    `/transfers/${id}/authorize-acceptance`,
  );
  return response.data;
}

export const TRANSFER_HISTORY_PAGE_SIZE = 20;

export async function createTransferRequest(
  input: CreateTransferInput,
): Promise<CreateTransferResponse> {
  const response = await apiClient.post<CreateTransferResponse>('/transfers', {
    eventId: input.eventId,
    tickets: input.tickets,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim(),
    note: input.note?.trim() || undefined,
  });

  return response.data;
}

export async function getTransferHistoryRequest(
  filters: TransferHistoryFilters = {},
  signal?: AbortSignal,
): Promise<TransferHistoryListResponse> {
  const response = await apiClient.get<TransferHistoryListResponse>('/transfers', {
    signal,
    params: {
      search: filters.search?.trim() || undefined,
      page: filters.page ?? 1,
      limit: filters.limit ?? TRANSFER_HISTORY_PAGE_SIZE,
    },
  });
  return response.data;
}

export async function getTransferByIdRequest(
  id: string,
  signal?: AbortSignal,
): Promise<TransferHistoryItem> {
  const response = await apiClient.get<TransferHistoryItem>(`/transfers/${id}`, {
    signal,
  });
  return response.data;
}

export async function deleteTransferRequest(id: string): Promise<{ success: true }> {
  const response = await apiClient.delete<{ success: true }>(`/transfers/${id}`);
  return response.data;
}

export async function clearTransferHistoryRequest(): Promise<{
  success: true;
  deletedCount: number;
}> {
  const response = await apiClient.delete<{ success: true; deletedCount: number }>('/transfers');
  return response.data;
}
