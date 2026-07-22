export function getSubscriptionDaysLeft(expiresAt: string | null): number {
  if (!expiresAt) {
    return 0;
  }

  const expiry = new Date(expiresAt);
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();

  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}
