import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AuthUser } from '@/services/auth/types';
import {
  createProfileRequest,
  deleteProfileRequest,
  getProfilesRequest,
  setDefaultProfileRequest,
  updateProfileRequest,
} from '@/services/profiles/profiles.api';
import type {
  CreateProfileInput,
  DisplayProfile,
  UpdateProfileInput,
} from '@/services/profiles/types';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';

export const profilesQueryKey = ['profiles'] as const;

function syncDefaultProfileIntoAuth(defaultProfile: DisplayProfile | null) {
  useProfileStore.getState().setDefaultProfile(defaultProfile);

  const { user, accessToken, setAuthenticated } = useAuthStore.getState();
  if (!user || !accessToken) {
    return;
  }

  const nextUser: AuthUser = {
    ...user,
    defaultProfile,
  };
  setAuthenticated(nextUser, accessToken);
}

function pickDefault(profiles: DisplayProfile[]): DisplayProfile | null {
  return profiles.find((profile) => profile.isDefault) ?? profiles[0] ?? null;
}

async function refreshProfilesAndSyncDefault(
  queryClient: ReturnType<typeof useQueryClient>,
  preferredDefault?: DisplayProfile | null,
) {
  await queryClient.invalidateQueries({ queryKey: profilesQueryKey });
  const profiles = await queryClient.fetchQuery({
    queryKey: profilesQueryKey,
    queryFn: ({ signal }) => getProfilesRequest(signal),
  });
  queryClient.setQueryData(profilesQueryKey, profiles);

  const nextDefault = preferredDefault?.isDefault ? preferredDefault : pickDefault(profiles);

  syncDefaultProfileIntoAuth(nextDefault);
  return profiles;
}

export function useProfiles() {
  return useQuery({
    queryKey: profilesQueryKey,
    queryFn: ({ signal }) => getProfilesRequest(signal),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnReconnect: true,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProfileInput) => createProfileRequest(input),
    onSuccess: async (created) => {
      await refreshProfilesAndSyncDefault(queryClient, created);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProfileInput }) =>
      updateProfileRequest(id, input),
    onSuccess: async (updated) => {
      await refreshProfilesAndSyncDefault(queryClient, updated);
    },
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProfileRequest(id),
    onSuccess: async () => {
      await refreshProfilesAndSyncDefault(queryClient);
    },
  });
}

export function useSetDefaultProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => setDefaultProfileRequest(id),
    onSuccess: async (profile) => {
      await refreshProfilesAndSyncDefault(queryClient, profile);
    },
  });
}
