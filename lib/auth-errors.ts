import axios, { type AxiosError } from 'axios';
import type { ActiveSessionConflictError } from '@/services/auth/types';

export const ACTIVE_SESSION_CONFLICT_CODE = 'ACTIVE_SESSION_CONFLICT';

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

export function getLoginErrorMessage(error: unknown): string {
  if (isActiveSessionConflict(error)) {
    return error.response?.data.message ?? 'This account is already signed in on another device.';
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
