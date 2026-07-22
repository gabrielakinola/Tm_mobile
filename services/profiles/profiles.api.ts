import { apiClient } from '../api/client';
import type { CreateProfileInput, DisplayProfile, UpdateProfileInput } from './types';

export async function getProfilesRequest(signal?: AbortSignal): Promise<DisplayProfile[]> {
  const response = await apiClient.get<DisplayProfile[]>('/profiles', { signal });
  return response.data;
}

export async function createProfileRequest(input: CreateProfileInput): Promise<DisplayProfile> {
  const response = await apiClient.post<DisplayProfile>('/profiles', input);
  return response.data;
}

export async function updateProfileRequest(
  id: string,
  input: UpdateProfileInput,
): Promise<DisplayProfile> {
  const response = await apiClient.patch<DisplayProfile>(`/profiles/${id}`, input);
  return response.data;
}

export async function deleteProfileRequest(id: string): Promise<void> {
  await apiClient.delete(`/profiles/${id}`);
}

export async function setDefaultProfileRequest(id: string): Promise<DisplayProfile> {
  const response = await apiClient.post<DisplayProfile>(`/profiles/${id}/default`);
  return response.data;
}
