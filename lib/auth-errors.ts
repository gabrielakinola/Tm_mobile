import axios, { type AxiosError } from 'axios';
import {
  SUBSCRIPTION_EXPIRED_CODE,
  type SubscriptionExpiredErrorResponse,
} from '@/lib/subscription-billing';
import type { ActiveSessionConflictError, DeviceChangeLimitError } from '@/services/auth/types';

export const ACTIVE_SESSION_CONFLICT_CODE = 'ACTIVE_SESSION_CONFLICT';
export const DEVICE_CHANGE_LIMIT_REACHED_CODE = 'DEVICE_CHANGE_LIMIT_REACHED';

export function isActiveSessionConflict(
  error: unknown,
): error is AxiosError<ActiveSessionConflictError> {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 409 &&
    error.response.data?.code === ACTIVE_SESSION_CONFLICT_CODE &&
    Boolean(error.response.data?.activeSession)
  );
}

export function isDeviceChangeLimitReached(
  error: unknown,
): error is AxiosError<DeviceChangeLimitError> {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 403 &&
    error.response.data?.code === DEVICE_CHANGE_LIMIT_REACHED_CODE
  );
}

export function isSubscriptionExpiredError(
  error: unknown,
): error is AxiosError<SubscriptionExpiredErrorResponse> {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 403 &&
    error.response.data?.code === SUBSCRIPTION_EXPIRED_CODE
  );
}

export function getLoginErrorMessage(error: unknown): string {
  if (isActiveSessionConflict(error)) {
    return error.response?.data.message ?? 'This account is already signed in on another device.';
  }

  if (isDeviceChangeLimitReached(error)) {
    return (
      error.response?.data.message ??
      'You have already changed devices once during this subscription period.'
    );
  }

  if (isSubscriptionExpiredError(error)) {
    return '';
  }

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Cannot reach the server. Make sure your phone and computer are on the same Wi-Fi and the backend is running.';
    }

    const message = error.response.data?.message;

    if (typeof message === 'string') {
      return message;
    }

    if (Array.isArray(message) && typeof message[0] === 'string') {
      return message[0];
    }
  }

  return 'Unable to sign in. Please check your credentials and try again.';
}
