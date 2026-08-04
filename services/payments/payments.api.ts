import { apiClient } from '../api/client';

export interface InitiateSubscriptionPaymentInput {
  subscriptionId: string;
  email: string;
}

export interface InitiateSubscriptionPaymentResponse {
  checkoutUrl: string;
  txRef: string;
  amount?: number;
  currency?: string;
}

export interface InitiateWalletPassPaymentInput {
  quantity: number;
}

export interface InitiateWalletPassPaymentResponse {
  checkoutUrl: string;
  txRef: string;
  amount?: number;
  currency?: string;
  quantity?: number;
}

export interface FlutterwavePaymentStatusResponse {
  verified: boolean;
  paymentStatus?: string;
  purpose?: string;
  txRef?: string;
  passQuantity?: number | null;
}

export async function initiateSubscriptionPaymentRequest(
  input: InitiateSubscriptionPaymentInput,
): Promise<InitiateSubscriptionPaymentResponse> {
  const response = await apiClient.post<InitiateSubscriptionPaymentResponse>(
    '/payments/subscription/initiate',
    input,
  );
  return response.data;
}

export async function initiateWalletPassPaymentRequest(
  input: InitiateWalletPassPaymentInput,
): Promise<InitiateWalletPassPaymentResponse> {
  const response = await apiClient.post<InitiateWalletPassPaymentResponse>(
    '/payments/wallet-passes/initiate',
    input,
  );
  return response.data;
}

export async function getFlutterwavePaymentStatusRequest(
  txRef: string,
): Promise<FlutterwavePaymentStatusResponse> {
  const response = await apiClient.get<FlutterwavePaymentStatusResponse>(
    '/payments/flutterwave/status',
    { params: { tx_ref: txRef } },
  );
  return response.data;
}
