import {
  getWalletTrialRemaining,
  isWalletTrialActive as isWalletTrialActiveFromCreatedAt,
} from '@/lib/subscription';

export function getWalletPassTrialDaysLeft(accountCreatedAt: string | null | undefined): number {
  if (!accountCreatedAt) {
    return 0;
  }

  return getWalletTrialRemaining(accountCreatedAt);
}

export function isWalletPassTrialActive(accountCreatedAt: string | null | undefined): boolean {
  if (!accountCreatedAt) {
    return false;
  }

  return isWalletTrialActiveFromCreatedAt(accountCreatedAt);
}
