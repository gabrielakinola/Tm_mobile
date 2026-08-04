import { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetSpringConfigs,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  TransferFeeSummary,
  type TransferEventSummary,
} from '@/components/TransferToRecipientSheet/TransferFeeSummary';
import {
  TransferRecipientForm,
  type TransferRecipientFormRef,
  type TransferRecipientFormValues,
} from '@/components/TransferToRecipientSheet/TransferRecipientForm';
import { TransferRecipientInfo } from '@/components/TransferToRecipientSheet/TransferRecipientInfo';
import { TransferRecipientOptionButton } from '@/components/TransferToRecipientSheet/TransferRecipientOptionButton';
import { TransferSuccessModal } from '@/components/TransferToRecipientSheet/TransferSuccessModal';
import { TransferToRecipientFooter } from '@/components/TransferToRecipientSheet/TransferToRecipientFooter';
import { TransferWalletCreditsModal } from '@/components/TransferToRecipientSheet/TransferWalletCreditsModal';
import { Typography } from '@/components/ui/Typography';
import { settingsQueryKey } from '@/features/settings/settings-query-key';
import { useUserSettings } from '@/hooks/settings/useUserSettings';
import { useCreateTransfer } from '@/hooks/transfers/useCreateTransfer';
import type { EventTicket, TicketMode } from '@/services/events/types';
import type { UserSettingsResponse } from '@/services/settings/settings.api';
import { useAuthStore } from '@/stores/auth-store';
import { colors, radius, spacing } from '@/theme/tokens';

const SNAP_POINTS = ['75%'];
const BACKDROP_OPACITY = 0.45;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SheetStep = 'options' | 'form' | 'feeSummary';

interface TransferSuccess {
  recipientEmail: string;
  ticketCount: number;
}

export interface TransferToRecipientSheetRef {
  expand: () => void;
  close: () => void;
}

export interface TransferToRecipientSheetProps {
  eventId: string;
  event: TransferEventSummary;
  tickets: EventTicket[];
  ticketMode: TicketMode;
  onBack?: () => void;
  onFlowCancel?: () => void;
  onTransferSuccess?: () => void;
}

function validateRecipientForm(
  values: TransferRecipientFormValues | undefined,
  ticketCount: number,
): string | null {
  if (!values) {
    return 'Please complete the recipient form.';
  }

  if (!values.firstName || !values.lastName || !values.contact) {
    return 'Please fill in first name, last name, and email.';
  }

  if (!EMAIL_PATTERN.test(values.contact)) {
    return 'Enter a valid recipient email address to send the transfer.';
  }

  if (ticketCount === 0) {
    return 'Select at least one ticket to transfer.';
  }

  return null;
}

export const TransferToRecipientSheet = memo(
  forwardRef<TransferToRecipientSheetRef, TransferToRecipientSheetProps>(
    function TransferToRecipientSheet(
      { eventId, event, tickets, ticketMode, onBack, onFlowCancel, onTransferSuccess },
      ref,
    ) {
      const insets = useSafeAreaInsets();
      const queryClient = useQueryClient();
      const sheetRef = useRef<BottomSheetModal>(null);
      const formRef = useRef<TransferRecipientFormRef>(null);
      const returningToSeatsRef = useRef(false);
      const [step, setStep] = useState<SheetStep>('options');
      const [formKey, setFormKey] = useState(0);
      const [feeSummaryRecipient, setFeeSummaryRecipient] =
        useState<TransferRecipientFormValues | null>(null);
      const [pendingRecipient, setPendingRecipient] = useState<TransferRecipientFormValues | null>(
        null,
      );
      const [walletCreditsModalVisible, setWalletCreditsModalVisible] = useState(false);
      const [transferSuccess, setTransferSuccess] = useState<TransferSuccess | null>(null);
      const createTransfer = useCreateTransfer();
      const userSettingsQuery = useUserSettings();
      const accessType = useAuthStore((state) => state.user?.accessType);

      useImperativeHandle(
        ref,
        () => ({
          expand: () => {
            setStep('options');
            setFeeSummaryRecipient(null);
            setPendingRecipient(null);
            setWalletCreditsModalVisible(false);
            sheetRef.current?.present();
          },
          close: () => sheetRef.current?.dismiss(),
        }),
        [],
      );

      const animationConfigs = useBottomSheetSpringConfigs({
        damping: 80,
        overshootClamping: true,
        stiffness: 500,
      });

      const openForm = useCallback(() => {
        setFormKey((key) => key + 1);
        setFeeSummaryRecipient(null);
        setStep('form');
      }, []);

      const handleBack = useCallback(() => {
        if (createTransfer.isPending || walletCreditsModalVisible) {
          return;
        }
        if (step === 'feeSummary') {
          setStep('form');
          return;
        }
        if (step === 'form') {
          setStep('options');
          return;
        }
        returningToSeatsRef.current = true;
        sheetRef.current?.dismiss();
      }, [createTransfer.isPending, step, walletCreditsModalVisible]);

      const handleDismiss = useCallback(() => {
        setStep('options');
        setFeeSummaryRecipient(null);
        setPendingRecipient(null);
        setWalletCreditsModalVisible(false);
        if (returningToSeatsRef.current) {
          returningToSeatsRef.current = false;
          onBack?.();
          return;
        }
        onFlowCancel?.();
      }, [onBack, onFlowCancel]);

      const submitTransfer = useCallback(
        async (values: TransferRecipientFormValues) => {
          try {
            await createTransfer.mutateAsync({
              eventId,
              tickets,
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.contact,
              note: values.note,
            });

            setWalletCreditsModalVisible(false);
            setPendingRecipient(null);
            sheetRef.current?.dismiss();
            onTransferSuccess?.();
            await queryClient.invalidateQueries({ queryKey: settingsQueryKey });
            setTransferSuccess({
              recipientEmail: values.contact,
              ticketCount: tickets.length,
            });
          } catch (error) {
            const message = axios.isAxiosError(error)
              ? (error.response?.data?.message as string | string[] | undefined)
              : undefined;
            const normalized = Array.isArray(message)
              ? message.join('\n')
              : typeof message === 'string'
                ? message
                : 'Could not send the transfer. Please try again.';
            Alert.alert('Transfer failed', normalized);
          }
        },
        [createTransfer, eventId, onTransferSuccess, queryClient, tickets],
      );

      const shouldShowWalletCreditsModal = useCallback(() => {
        const settings = userSettingsQuery.data;
        return accessType === 'MONTHLY' && Boolean(settings?.enableWalletForTicketTransfers);
      }, [accessType, userSettingsQuery.data]);

      const continueTransfer = useCallback(
        (values: TransferRecipientFormValues) => {
          if (shouldShowWalletCreditsModal()) {
            setPendingRecipient(values);
            setWalletCreditsModalVisible(true);
            return;
          }

          void submitTransfer(values);
        },
        [shouldShowWalletCreditsModal, submitTransfer],
      );

      const handleTransfer = useCallback(async () => {
        const values = feeSummaryRecipient ?? formRef.current?.getValues();
        const validationError = validateRecipientForm(values, tickets.length);
        if (validationError) {
          Alert.alert('Missing details', validationError);
          return;
        }

        continueTransfer(values!);
      }, [continueTransfer, feeSummaryRecipient, tickets.length]);

      const handleTransferPress = useCallback(() => {
        const values = formRef.current?.getValues();
        const validationError = validateRecipientForm(values, tickets.length);
        if (validationError) {
          Alert.alert('Missing details', validationError);
          return;
        }

        const settings = userSettingsQuery.data;
        if (settings?.enableTransferFeeInterruption) {
          setFeeSummaryRecipient(values!);
          setStep('feeSummary');
          return;
        }

        continueTransfer(values!);
      }, [continueTransfer, tickets.length, userSettingsQuery.data]);

      const handleWalletModalProceed = useCallback(() => {
        if (!pendingRecipient) {
          return;
        }
        void submitTransfer(pendingRecipient);
      }, [pendingRecipient, submitTransfer]);

      const handleWalletSettingsUpdated = useCallback(
        (settings: UserSettingsResponse) => {
          queryClient.setQueryData<UserSettingsResponse>(settingsQueryKey, settings);
          void queryClient.invalidateQueries({ queryKey: settingsQueryKey });
        },
        [queryClient],
      );

      const renderBackdrop = useCallback(
        (backdropProps: BottomSheetBackdropProps) => (
          <BottomSheetBackdrop
            {...backdropProps}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={BACKDROP_OPACITY}
            pressBehavior={createTransfer.isPending || walletCreditsModalVisible ? 'none' : 'close'}
          />
        ),
        [createTransfer.isPending, walletCreditsModalVisible],
      );

      const transferLabel = `Transfer ${tickets.length} ${tickets.length === 1 ? 'Ticket' : 'Tickets'}`;
      const primaryAction =
        step === 'form'
          ? {
              label: transferLabel,
              loading: createTransfer.isPending,
              onPress: handleTransferPress,
            }
          : step === 'feeSummary'
            ? {
                label: 'Continue',
                loading: createTransfer.isPending,
                onPress: () => {
                  void handleTransfer();
                },
              }
            : null;

      const settings = userSettingsQuery.data;

      return (
        <>
          <BottomSheetModal
            ref={sheetRef}
            snapPoints={SNAP_POINTS}
            enablePanDownToClose={!createTransfer.isPending && !walletCreditsModalVisible}
            enableDynamicSizing={false}
            animationConfigs={animationConfigs}
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.sheetBackground}
            handleIndicatorStyle={styles.handle}
            onDismiss={handleDismiss}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustResize"
          >
            <View style={styles.content}>
              <Typography style={styles.title}>
                {step === 'feeSummary' ? 'TRANSFER SUMMARY' : 'TRANSFER TO'}
              </Typography>
              <View style={styles.headerDivider} />

              {step === 'options' ? (
                <>
                  <View style={styles.options}>
                    <TransferRecipientOptionButton
                      label="Select From Contacts"
                      icon="contacts"
                      onPress={openForm}
                    />
                    <TransferRecipientOptionButton
                      label="Manually Enter A Recipient"
                      icon="manual"
                      onPress={openForm}
                    />
                  </View>

                  <View style={styles.infoWrap}>
                    <TransferRecipientInfo />
                  </View>
                </>
              ) : null}

              {step === 'form' ? (
                <TransferRecipientForm
                  key={formKey}
                  ref={formRef}
                  tickets={tickets}
                  ticketMode={ticketMode}
                />
              ) : null}

              {step === 'feeSummary' && feeSummaryRecipient ? (
                <TransferFeeSummary
                  event={event}
                  tickets={tickets}
                  ticketMode={ticketMode}
                  recipient={feeSummaryRecipient}
                  transferFeePerTicket={settings?.transferFeePerTicket ?? ''}
                />
              ) : null}

              <TransferToRecipientFooter
                bottomInset={insets.bottom}
                primaryAction={primaryAction}
                onBack={handleBack}
              />
            </View>
          </BottomSheetModal>

          <TransferWalletCreditsModal
            visible={walletCreditsModalVisible}
            ticketCount={tickets.length}
            availableCredits={settings?.walletPassesRemaining ?? 0}
            walletEnabled={Boolean(settings?.enableWalletForTicketTransfers)}
            transferring={createTransfer.isPending}
            onClose={() => {
              if (createTransfer.isPending) {
                return;
              }
              setWalletCreditsModalVisible(false);
            }}
            onProceed={handleWalletModalProceed}
            onSettingsUpdated={handleWalletSettingsUpdated}
          />

          <TransferSuccessModal
            visible={transferSuccess !== null}
            recipientEmail={transferSuccess?.recipientEmail ?? ''}
            ticketCount={transferSuccess?.ticketCount ?? 0}
            onClose={() => setTransferSuccess(null)}
          />
        </>
      );
    },
  ),
);

TransferToRecipientSheet.displayName = 'TransferToRecipientSheet';

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius['3xl'],
    borderTopRightRadius: radius['3xl'],
  },
  handle: {
    backgroundColor: colors.neutral[400],
    width: 40,
    height: 5,
  },
  content: {
    flex: 1,
  },
  title: {
    color: colors.neutral[950],
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.neutral[200],
  },
  options: {
    alignSelf: 'stretch',
    width: '100%',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  infoWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
});
