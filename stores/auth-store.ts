import { create } from 'zustand';
import type { AuthUser } from '@/services/auth/types';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  accessToken: string | null;
  setLoading: () => void;
  setAuthenticated: (user: AuthUser, accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'idle',
  user: null,
  accessToken: null,
  setLoading: () => set({ status: 'loading' }),
  setAuthenticated: (user, accessToken) =>
    set({
      status: 'authenticated',
      user,
      accessToken,
    }),
  clearAuth: () =>
    set({
      status: 'unauthenticated',
      user: null,
      accessToken: null,
    }),
}));
