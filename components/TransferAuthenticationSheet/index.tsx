import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetSpringConfigs,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { AuthenticationFooter } from '@/components/TransferAuthenticationSheet/AuthenticationFooter';
import { AuthenticationHeader } from '@/components/TransferAuthenticationSheet/AuthenticationHeader';
import { AuthenticationIllustration } from '@/components/TransferAuthenticationSheet/AuthenticationIllustration';
import { OTPInput } from '@/components/TransferAuthenticationSheet/OTPInput';
import { ArcSpinner } from '@/components/ui/ArcSpinner';
import { Typography } from '@/components/ui/Typography';
import { colors, radius, spacing } from '@/theme/tokens';

const SNAP_POINTS = ['78%'];
const BACKDROP_OPACITY = 0.45;
const PREPARE_DELAY_MS = 2000;

/** Compatible with Transfer's `sheetRef.current?.expand()` call site. */
export interface TransferAuthenticationSheetRef {
  expand: () => void;
  close: () => void;
}

export interface TransferAuthenticationSheetProps {
  maskedPhone?: string;
  onAuthenticated?: () => void;
}

export const TransferAuthenticationSheet = memo(
  forwardRef<TransferAuthenticationSheetRef, TransferAuthenticationSheetProps>(
    function TransferAuthenticationSheet({ maskedPhone = '******0000', onAuthenticated }, ref) {
      const insets = useSafeAreaInsets();
      const sheetRef = useRef<BottomSheetModal>(null);
      const prepareTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
      const [code, setCode] = useState('');
      const [isConfirming, setIsConfirming] = useState(false);
      const [isPreparing, setIsPreparing] = useState(true);

      const clearPrepareTimeout = useCallback(() => {
        if (prepareTimeoutRef.current) {
          clearTimeout(prepareTimeoutRef.current);
          prepareTimeoutRef.current = null;
        }
      }, []);

      const startPrepareLoading = useCallback(() => {
        clearPrepareTimeout();
        setIsPreparing(true);
        prepareTimeoutRef.current = setTimeout(() => {
          setIsPreparing(false);
          prepareTimeoutRef.current = null;
        }, PREPARE_DELAY_MS);
      }, [clearPrepareTimeout]);

      useEffect(() => {
        return () => {
          clearPrepareTimeout();
        };
      }, [clearPrepareTimeout]);

      useImperativeHandle(
        ref,
        () => ({
          expand: () => {
            startPrepareLoading();
            sheetRef.current?.present();
          },
          close: () => {
            sheetRef.current?.dismiss();
          },
        }),
        [startPrepareLoading],
      );

      const animationConfigs = useBottomSheetSpringConfigs({
        damping: 80,
        overshootClamping: true,
        stiffness: 500,
      });

      const handleClose = useCallback(() => {
        if (isConfirming) {
          return;
        }
        sheetRef.current?.dismiss();
      }, [isConfirming]);

      const handleConfirm = useCallback(async () => {
        if (code.length !== 6 || isConfirming || isPreparing) {
          return;
        }

        setIsConfirming(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsConfirming(false);
        sheetRef.current?.dismiss();
        onAuthenticated?.();
      }, [code.length, isConfirming, isPreparing, onAuthenticated]);

      const renderBackdrop = useCallback(
        (backdropProps: BottomSheetBackdropProps) => (
          <BottomSheetBackdrop
            {...backdropProps}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={BACKDROP_OPACITY}
            pressBehavior={isConfirming ? 'none' : 'close'}
          />
        ),
        [isConfirming],
      );

      const description = useMemo(
        () =>
          `A one-time code has been sent to ${maskedPhone}. Please enter your code below to continue.`,
        [maskedPhone],
      );

      return (
        <BottomSheetModal
          ref={sheetRef}
          snapPoints={SNAP_POINTS}
          enablePanDownToClose={!isConfirming}
          enableDynamicSizing={false}
          animationConfigs={animationConfigs}
          backdropComponent={renderBackdrop}
          handleComponent={null}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
          backgroundStyle={styles.sheetBackground}
          onDismiss={() => {
            clearPrepareTimeout();
            setCode('');
            setIsConfirming(false);
            setIsPreparing(true);
          }}
        >
          <View style={styles.content}>
            <AuthenticationHeader onCancel={handleClose} />

            {isPreparing ? (
              <View style={styles.loadingState} accessibilityLabel="Loading authentication">
                <ArcSpinner size={44} color={colors.pulse[500]} strokeWidth={4} />
              </View>
            ) : (
              <>
                <BottomSheetScrollView
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                  bounces={false}
                >
                  <AuthenticationIllustration />

                  <View style={styles.form}>
                    <Typography style={styles.formTitle}>Authenticate Your Account</Typography>
                    <Typography style={styles.formDescription}>{description}</Typography>
                    <OTPInput value={code} onChangeText={setCode} />
                    <View style={styles.spacer} />
                  </View>
                </BottomSheetScrollView>

                <AuthenticationFooter
                  disabled={code.length !== 6}
                  loading={isConfirming}
                  bottomInset={insets.bottom}
                  onConfirm={() => {
                    void handleConfirm();
                  }}
                />
              </>
            )}
          </View>
        </BottomSheetModal>
      );
    },
  ),
);

TransferAuthenticationSheet.displayName = 'TransferAuthenticationSheet';

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius['3xl'],
    borderTopRightRadius: radius['3xl'],
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: radius['3xl'],
    borderTopRightRadius: radius['3xl'],
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    flexGrow: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  formTitle: {
    color: colors.neutral[950],
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  formDescription: {
    color: colors.neutral[800],
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    marginBottom: spacing.sm,
  },
  spacer: {
    flexGrow: 1,
    minHeight: spacing['3xl'],
  },
});
