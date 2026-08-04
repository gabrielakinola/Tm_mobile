export const SUBSCRIPTION_EXPIRED_CODE = 'SUBSCRIPTION_EXPIRED';

export interface ExpiredSubscriptionBilling {
  expiredAt: string;
  daysUntilBreakawayFeeStarts: number;
  breakawayFeeDays: number;
  renewalAmountNgn: number;
  breakawayFeeAmountNgn: number;
  totalAmountOwedNgn: number;
}

export interface SubscriptionRenewalDetails {
  requiresRenewal?: boolean;
  subscriptionId: string;
  subscriptionExpiryDate: string | null;
  gracePeriodRemaining?: number;
  subscriptionFee?: number;
  lateRenewalFee?: number;
  totalAmount?: number;
  billing?: ExpiredSubscriptionBilling;
}

export interface SubscriptionExpiredErrorResponse {
  message: string;
  code: typeof SUBSCRIPTION_EXPIRED_CODE;
  billing?: ExpiredSubscriptionBilling;
  requiresRenewal?: boolean;
  subscriptionId?: string;
  subscriptionExpiryDate?: string | null;
  gracePeriodRemaining?: number;
  subscriptionFee?: number;
  lateRenewalFee?: number;
  totalAmount?: number;
}

export function toSubscriptionRenewalDetails(
  data: SubscriptionExpiredErrorResponse,
): SubscriptionRenewalDetails | null {
  const subscriptionId = data.subscriptionId;
  if (!subscriptionId) {
    return null;
  }

  return {
    requiresRenewal: data.requiresRenewal ?? true,
    subscriptionId,
    subscriptionExpiryDate: data.subscriptionExpiryDate ?? data.billing?.expiredAt ?? null,
    gracePeriodRemaining: data.gracePeriodRemaining,
    subscriptionFee: data.subscriptionFee ?? data.billing?.renewalAmountNgn,
    lateRenewalFee: data.lateRenewalFee ?? data.billing?.breakawayFeeAmountNgn,
    totalAmount: data.totalAmount ?? data.billing?.totalAmountOwedNgn,
    billing: data.billing,
  };
}

export function formatNgnAmount(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}
