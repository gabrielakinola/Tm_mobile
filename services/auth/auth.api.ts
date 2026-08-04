import type { DeviceInfo } from '@/lib/device-info';
import { apiClient } from '../api/client';
import type { AuthUser, LoginResponse, LogoutResponse } from './types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export type LoginInput = LoginCredentials & DeviceInfo;

export async function loginRequest(input: LoginInput): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', input);
  return response.data;
}

export async function forceLoginRequest(input: LoginInput): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login/force', input);
  return response.data;
}

export async function logoutRequest(): Promise<LogoutResponse> {
  const response = await apiClient.post<LogoutResponse>('/auth/logout');
  return response.data;
}

export async function changePasswordRequest(
  input: ChangePasswordInput,
): Promise<{ success: true }> {
  const response = await apiClient.post<{ success: true }>('/auth/change-password', input);
  return response.data;
}

export async function getCurrentUserRequest(): Promise<AuthUser> {
  const response = await apiClient.get<AuthUser>('/auth/me');
  return response.data;
}
