import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

interface BottomSheetProviderProps {
  children: React.ReactNode;
}

/**
 * Wrap screens that use BottomSheetModal with this provider.
 * Import from '@/providers/BottomSheetProvider' — not loaded at app startup.
 */
export function BottomSheetProvider({ children }: BottomSheetProviderProps) {
  return <BottomSheetModalProvider>{children}</BottomSheetModalProvider>;
}
