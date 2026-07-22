import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/constants/app';
import { clearAccessToken, getAccessToken } from '@/lib/secure-storage';
import { emitSessionExpired } from '@/lib/session-events';
import { useAuthStore } from '@/stores/auth-store';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function isUnauthorizedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

export async function handleUnauthorizedError(error: AxiosError): Promise<never> {
  if (error.response?.status === 401) {
    const wasAuthenticated = useAuthStore.getState().status === 'authenticated';
    await clearAccessToken();

    // Let the shared session-expired listener clear stores + show toast + navigate.
    if (wasAuthenticated) {
      emitSessionExpired({ reason: 'unauthorized' });
    }
  }

  return Promise.reject(error);
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => handleUnauthorizedError(error),
);
