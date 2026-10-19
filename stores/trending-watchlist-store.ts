import { create } from 'zustand';

interface TrendingWatchlistState {
  likedIds: Record<string, true>;
  toggle: (id: string) => void;
}

export const useTrendingWatchlistStore = create<TrendingWatchlistState>((set) => ({
  likedIds: {},
  toggle: (id) =>
    set((state) => {
      const likedIds = { ...state.likedIds };

      if (likedIds[id]) {
        delete likedIds[id];
      } else {
        likedIds[id] = true;
      }

      return { likedIds };
    }),
}));
