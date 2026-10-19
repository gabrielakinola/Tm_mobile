import type { AccessType, AuthUser } from '@/services/auth/types';

export const MONTHLY_SUBSCRIPTION_NGN = 30_000;
/** Two single monthly seats would be ₦60,000; this plan saves ₦10,000. */
export const MONTHLY_PLUS_DEVICE_SUBSCRIPTION_NGN = 50_000;
export const LATE_RENEWAL_FEE_PER_DAY_NGN = 500;
/** Days after expiry before late fees start accumulating. */
export const GRACE_PERIOD_DAYS = 1;
/** Starter wallet-pass credits granted when a user is onboarded. */
export const INITIAL_FREE_WALLET_PASSES = 3;
export const WALLET_PASS_PRICE_NGN = 2_500;

export function isSubscriptionAccessType(accessType: AccessType): boolean {
  return accessType === 'MONTHLY' || accessType === 'MONTHLY_PLUS_DEVICE';
}

export function getSubscriptionFeeNgn(accessType: AccessType): number {
  if (accessType === 'MONTHLY_PLUS_DEVICE') {
    return MONTHLY_PLUS_DEVICE_SUBSCRIPTION_NGN;
  }
  return MONTHLY_SUBSCRIPTION_NGN;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfLocalDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

/** Same calendar-month rule as backend (e.g. Jan 15 → Feb 15, Aug 31 → Sep 30). */
export function addCalendarMonths(date: Date, months: number): Date {
  const result = new Date(date);
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(day, lastDay));
  return result;
}

export function isLifetimeAccess(accessType: AccessType): boolean {
  return accessType === 'LIFETIME';
}

export function getSubscriptionExpiry(user: Pick<AuthUser, 'subscriptionExpiresAt'>): Date | null {
  if (!user.subscriptionExpiresAt) {
    return null;
  }

  const expiry = new Date(user.subscriptionExpiresAt);
  return Number.isNaN(expiry.getTime()) ? null : expiry;
}

export function isMonthlySubscriptionExpired(
  user: Pick<AuthUser, 'accessType' | 'subscriptionExpiresAt'>,
  now = new Date(),
): boolean {
  if (!isSubscriptionAccessType(user.accessType)) {
    return false;
  }

  const expiry = getSubscriptionExpiry(user);
  if (!expiry) {
    return true;
  }

  return now.getTime() > expiry.getTime();
}

export function isMonthlySubscriptionActive(
  user: Pick<AuthUser, 'accessType' | 'subscriptionExpiresAt'>,
  now = new Date(),
): boolean {
  return isSubscriptionAccessType(user.accessType) && !isMonthlySubscriptionExpired(user, now);
}

/** Full calendar days after the expiry date (local), when already expired. */
export function getDaysAfterExpiry(expiresAt: string | null, now = new Date()): number {
  const expiry = expiresAt ? new Date(expiresAt) : null;
  if (!expiry || Number.isNaN(expiry.getTime()) || now.getTime() <= expiry.getTime()) {
    return 0;
  }

  const expiryDay = startOfLocalDay(expiry);
  const nowDay = startOfLocalDay(now);
  return Math.max(0, Math.round((nowDay.getTime() - expiryDay.getTime()) / DAY_MS));
}

export function isInGracePeriod(
  expiresAt: string | null,
  now = new Date(),
  accessType: AccessType = 'MONTHLY',
): boolean {
  if (
    !expiresAt ||
    !isMonthlySubscriptionExpired({ accessType, subscriptionExpiresAt: expiresAt }, now)
  ) {
    return false;
  }

  const daysAfter = getDaysAfterExpiry(expiresAt, now);
  return daysAfter <= GRACE_PERIOD_DAYS;
}

export function getGracePeriodRemaining(expiresAt: string | null, now = new Date()): number {
  const daysAfter = getDaysAfterExpiry(expiresAt, now);
  if (daysAfter === 0 && expiresAt && new Date(expiresAt).getTime() < now.getTime()) {
    return GRACE_PERIOD_DAYS;
  }

  if (daysAfter < 1 || daysAfter > GRACE_PERIOD_DAYS) {
    return 0;
  }

  return GRACE_PERIOD_DAYS - daysAfter + 1;
}

export function getLateRenewalFeeStartsInDays(expiresAt: string | null, now = new Date()): number {
  if (!isInGracePeriod(expiresAt, now)) {
    return 0;
  }

  const daysAfter = getDaysAfterExpiry(expiresAt, now);
  return GRACE_PERIOD_DAYS - daysAfter + 1;
}

export function getLateRenewalFeeDays(expiresAt: string | null, now = new Date()): number {
  const daysAfter = getDaysAfterExpiry(expiresAt, now);
  return Math.max(0, daysAfter - GRACE_PERIOD_DAYS);
}

export function getLateRenewalFee(expiresAt: string | null, now = new Date()): number {
  return getLateRenewalFeeDays(expiresAt, now) * LATE_RENEWAL_FEE_PER_DAY_NGN;
}

export function getOutstandingAmount(
  expiresAt: string | null,
  now = new Date(),
  accessType: AccessType = 'MONTHLY',
): number {
  return getSubscriptionFeeNgn(accessType) + getLateRenewalFee(expiresAt, now);
}

export function getDaysSinceExpiry(expiresAt: string | null, now = new Date()): number {
  return getDaysAfterExpiry(expiresAt, now);
}

export function getSubscriptionDaysLeft(expiresAt: string | null, now = new Date()): number {
  if (!expiresAt) {
    return 0;
  }

  const expiry = new Date(expiresAt);
  if (Number.isNaN(expiry.getTime()) || now.getTime() > expiry.getTime()) {
    return 0;
  }

  return Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / DAY_MS));
}

export type SubscriptionDaysLeftTone = 'green' | 'warning' | 'danger' | 'lifetime';

export function getSubscriptionDaysLeftTone(daysLeft: number): SubscriptionDaysLeftTone {
  if (daysLeft > 20) {
    return 'green';
  }
  if (daysLeft >= 10) {
    return 'warning';
  }
  return 'danger';
}

export function formatSubscriptionExpiryDate(expiresAt: string | null): string {
  const expiry = expiresAt ? new Date(expiresAt) : null;
  if (!expiry || Number.isNaN(expiry.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(expiry);
}
