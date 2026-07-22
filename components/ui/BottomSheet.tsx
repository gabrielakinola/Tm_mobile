import { forwardRef, useCallback, useMemo } from 'react';
import { View, type ViewProps } from 'react-native';
import BottomSheetLib, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
  type BottomSheetProps as GorhomBottomSheetProps,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@/theme';
import { componentSizes, radius, spacing } from '@/theme/tokens';

export interface BottomSheetProps extends Omit<
  GorhomBottomSheetProps,
  'backgroundStyle' | 'handleIndicatorStyle'
> {
  children: React.ReactNode;
}

export const BottomSheet = forwardRef<BottomSheetLib, BottomSheetProps>(
  ({ children, snapPoints, ...props }, ref) => {
    const { theme } = useTheme();
    const points = useMemo(() => snapPoints ?? ['50%'], [snapPoints]);

    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...backdropProps} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      [],
    );

    return (
      <BottomSheetLib
        ref={ref}
        snapPoints={points}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: theme.colors.card,
          borderTopLeftRadius: radius['2xl'],
          borderTopRightRadius: radius['2xl'],
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.mutedForeground,
          width: 40,
          height: componentSizes.bottomSheetHandle,
        }}
        {...props}
      >
        {children}
      </BottomSheetLib>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';

export interface BottomSheetContentProps extends ViewProps {
  children: React.ReactNode;
}

export function BottomSheetContent({ children, style, ...props }: BottomSheetContentProps) {
  return (
    <BottomSheetView>
      <View style={[{ padding: spacing.lg }, style]} {...props}>
        {children}
      </View>
    </BottomSheetView>
  );
}

export { BottomSheetLib };
