import { create } from 'zustand';
import type { DefaultProfileSummary } from '@/services/auth/types';

export interface ProfileStore {
  defaultProfile: DefaultProfileSummary | null;
  setDefaultProfile: (profile: DefaultProfileSummary | null) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  defaultProfile: null,
  setDefaultProfile: (defaultProfile) => set({ defaultProfile }),
  clearProfile: () => set({ defaultProfile: null }),
}));
