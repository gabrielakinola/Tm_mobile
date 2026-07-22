import { create } from 'zustand';

export type TicketLayout = 'american' | 'european';

export interface SettingsData {
  ticketLayout: TicketLayout;
  walletPassesRemaining: number;
  enableAppleWalletTransfers: boolean;
  useGoogleWalletBadge: boolean;
  showTransferAccepted: boolean;
  acceptedByName: string;
  enableTransferFeeInterruption: boolean;
  transferFeeAmount: string;
  enableMaxTicketsInterruption: boolean;
  maxTicketsThreshold: string;
}

interface SettingsStore extends SettingsData {
  updateSettings: (settings: Partial<SettingsData>) => void;
  addWalletPasses: (quantity: number) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  ticketLayout: 'american',
  walletPassesRemaining: 0,
  enableAppleWalletTransfers: false,
  useGoogleWalletBadge: false,
  showTransferAccepted: false,
  acceptedByName: 'Mary Flores',
  enableTransferFeeInterruption: false,
  transferFeeAmount: '110.10',
  enableMaxTicketsInterruption: false,
  maxTicketsThreshold: '2',
  updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
  addWalletPasses: (quantity) =>
    set((state) => ({ walletPassesRemaining: state.walletPassesRemaining + quantity })),
}));
