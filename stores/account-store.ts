import { create } from 'zustand';

interface AccountStore {
  notificationCount: number;
  receiveNotifications: boolean;
  locationBasedContent: boolean;
  setReceiveNotifications: (value: boolean) => void;
  setLocationBasedContent: (value: boolean) => void;
}

export const useAccountStore = create<AccountStore>((set) => ({
  notificationCount: 1,
  receiveNotifications: true,
  locationBasedContent: false,
  setReceiveNotifications: (receiveNotifications) => set({ receiveNotifications }),
  setLocationBasedContent: (locationBasedContent) => set({ locationBasedContent }),
}));
