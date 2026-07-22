import { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetSpringConfigs,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import axios from 'axios';
import {
  TransferRecipientForm,
  type TransferRecipientFormRef,
} from '@/components/TransferToRecipientSheet/TransferRecipientForm';
import { TransferRecipientInfo } from '@/components/TransferToRecipientSheet/TransferRecipientInfo';
import { TransferRecipientOptionButton } from '@/components/TransferToRecipientSheet/TransferRecipientOptionButton';
import { TransferToRecipientFooter } from '@/components/TransferToRecipientSheet/TransferToRecipientFooter';
import { Typography } from '@/components/ui/Typography';
import { useCreateTransfer } from '@/hooks/transfers/useCreateTransfer';
import type { EventTicket, TicketMode } from '@/services/events/types';
import { colors, radius, spacing } from '@/theme/tokens';

const SNAP_POINTS = ['75%'];
const BACKDROP_OPACITY = 0.45;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SheetStep = 'options' | 'form';

export interface TransferToRecipientSheetRef {
  expand: () => void;
  close: () => void;
}

export interface TransferToRecipientSheetProps {
  eventId: string;
  tickets: EventTicket[];
  ticketMode: TicketMode;
  onBack?: () => void;
  onFlowCancel?: () => void;
  onTransferSuccess?: () => void;
}

export const TransferToRecipientSheet = memo(
  forwardRef<TransferToRecipientSheetRef, TransferToRecipientSheetProps>(
    function TransferToRecipientSheet(
      { eventId, tickets, ticketMode, onBack, onFlowCancel, onTransferSuccess },
      ref,
    ) {
      const insets = useSafeAreaInsets();
      const sheetRef = useRef<BottomSheetModal>(null);
      const formRef = useRef<TransferRecipientFormRef>(null);
      const returningToSeatsRef = useRef(false);
      const [step, setStep] = useState<SheetStep>('options');
      const [formKey, setFormKey] = useState(0);
      const createTransfer = useCreateTransfer();

      useImperativeHandle(
        ref,
        () => ({
          expand: () => {
            setStep('options');
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
        setStep('form');
      }, []);

      const handleBack = useCallback(() => {
        if (createTransfer.isPending) {
          return;
        }
        if (step === 'form') {
          setStep('options');
          return;
        }
        returningToSeatsRef.current = true;
        sheetRef.current?.dismiss();
      }, [createTransfer.isPending, step]);

      const handleDismiss = useCallback(() => {
        setStep('options');
        if (returningToSeatsRef.current) {
          returningToSeatsRef.current = false;
          onBack?.();
          return;
        }
        onFlowCancel?.();
      }, [onBack, onFlowCancel]);

      const handleTransfer = useCallback(async () => {
        const values = formRef.current?.getValues();
        if (!values) {
          return;
        }

        if (!values.firstName || !values.lastName || !values.contact) {
          Alert.alert('Missing details', 'Please fill in first name, last name, and email.');
          return;
        }

        if (!EMAIL_PATTERN.test(values.contact)) {
          Alert.alert(
            'Email required',
            'Enter a valid recipient email address to send the transfer.',
          );
          return;
        }

        if (tickets.length === 0) {
          Alert.alert('No tickets selected', 'Select at least one ticket to transfer.');
          return;
        }

        try {
          await createTransfer.mutateAsync({
            eventId,
            tickets,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.contact,
            note: values.note,
          });

          sheetRef.current?.dismiss();
          onTransferSuccess?.();
          Alert.alert(
            'Transfer sent',
            `An email was sent to ${values.contact} to accept the tickets.`,
          );
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
      }, [createTransfer, eventId, onTransferSuccess, tickets]);

      const renderBackdrop = useCallback(
        (backdropProps: BottomSheetBackdropProps) => (
          <BottomSheetBackdrop
            {...backdropProps}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={BACKDROP_OPACITY}
            pressBehavior={createTransfer.isPending ? 'none' : 'close'}
          />
        ),
        [createTransfer.isPending],
      );

      return (
        <BottomSheetModal
          ref={sheetRef}
          snapPoints={SNAP_POINTS}
          enablePanDownToClose={!createTransfer.isPending}
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
            <Typography style={styles.title}>TRANSFER TO</Typography>
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
            ) : (
              <TransferRecipientForm
                key={formKey}
                ref={formRef}
                tickets={tickets}
                ticketMode={ticketMode}
              />
            )}

            <TransferToRecipientFooter
              bottomInset={insets.bottom}
              showTransferButton={step === 'form'}
              ticketCount={tickets.length}
              transferLoading={createTransfer.isPending}
              onBack={handleBack}
              onTransfer={() => {
                void handleTransfer();
              }}
            />
          </View>
        </BottomSheetModal>
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
