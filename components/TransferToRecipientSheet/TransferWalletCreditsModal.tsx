import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Modal as RNModal, View } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Typography } from '@/components/ui';
import { settingsQueryKey } from '@/features/settings/settings-query-key';
import { openFlutterwaveCheckout } from '@/lib/flutterwave-checkout';
import { formatNaira } from '@/lib/format-currency';
import { hapticLight } from '@/lib/haptics';
import { WALLET_PASS_PRICE_NGN } from '@/lib/subscription';
import {
  getFlutterwavePaymentStatusRequest,
  initiateWalletPassPaymentRequest,
} from '@/services/payments/payments.api';
import {
  getUserSettings,
  updateUserSettings,
  type UserSettingsResponse,
} from '@/services/settings/settings.api';
import { colors, radius, spacing } from '@/theme/tokens';

const PAYMENT_STATUS_ATTEMPTS = 6;
const PAYMENT_STATUS_DELAY_MS = 1500;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForPaymentVerification(txRef: string): Promise<boolean> {
  for (let attempt = 0; attempt < PAYMENT_STATUS_ATTEMPTS; attempt += 1) {
    const status = await getFlutterwavePaymentStatusRequest(txRef);
    if (status.verified) {
      return true;
    }
    if (attempt < PAYMENT_STATUS_ATTEMPTS - 1) {
      await wait(PAYMENT_STATUS_DELAY_MS);
    }
  }
  return false;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const message = (error as { response?: { data?: { message?: string | string[] } } }).response
      ?.data?.message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
    if (Array.isArray(message) && typeof message[0] === 'string') {
      return message[0];
    }
  }
  return fallback;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
      <Typography style={styles.detailLabel}>{label}</Typography>
      <Typography style={styles.detailValue}>{value}</Typography>
    </View>
  );
}

export interface TransferWalletCreditsModalProps {
  visible: boolean;
  ticketCount: number;
  availableCredits: number;
  walletEnabled: boolean;
  transferring?: boolean;
  onClose: () => void;
  onProceed: () => void;
  onSettingsUpdated?: (settings: UserSettingsResponse) => void;
}

export function TransferWalletCreditsModal({
  visible,
  ticketCount,
  availableCredits,
  walletEnabled,
  transferring = false,
  onClose,
  onProceed,
  onSettingsUpdated,
}: TransferWalletCreditsModalProps) {
  const queryClient = useQueryClient();
  const [buying, setBuying] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [creditsOverride, setCreditsOverride] = useState<number | null>(null);

  const effectiveCredits = creditsOverride ?? availableCredits;
  const shortfall = Math.max(0, ticketCount - effectiveCredits);
  const hasEnoughCredits = effectiveCredits >= ticketCount;
  const buyAmount = shortfall * WALLET_PASS_PRICE_NGN;
  const busy = transferring || buying;

  useEffect(() => {
    if (!visible) {
      setCreditsOverride(null);
      setActionError(null);
      return;
    }
    setCreditsOverride(null);
  }, [visible]);

  useEffect(() => {
    // Keep override only until parent props catch up to the post-purchase balance.
    if (creditsOverride != null && availableCredits >= creditsOverride) {
      setCreditsOverride(null);
    }
  }, [availableCredits, creditsOverride]);

  const toggleWalletMutation = useMutation({
    mutationFn: (enableWalletForTicketTransfers: boolean) =>
      updateUserSettings({ enableWalletForTicketTransfers }),
    onSuccess: (response) => {
      queryClient.setQueryData<UserSettingsResponse>(settingsQueryKey, response);
      onSettingsUpdated?.(response);
      setActionError(null);
    },
    onError: (error) => {
      setActionError(getErrorMessage(error, 'Unable to update wallet setting.'));
    },
  });

  const title = useMemo(() => {
    if (!walletEnabled) {
      return 'Transfer tickets';
    }
    if (!hasEnoughCredits) {
      return 'Not enough wallet pass credits';
    }
    return 'Wallet pass credits';
  }, [hasEnoughCredits, walletEnabled]);

  const handleBuyPasses = async () => {
    if (busy || shortfall < 1) {
      return;
    }

    const quantityToBuy = shortfall;
    setBuying(true);
    setActionError(null);
    void hapticLight();

    try {
      const { checkoutUrl, txRef } = await initiateWalletPassPaymentRequest({
        quantity: quantityToBuy,
      });
      const browserResult = await openFlutterwaveCheckout(checkoutUrl);

      if (browserResult.type !== 'success') {
        setActionError('Payment was cancelled. You can try again when you are ready.');
        return;
      }

      const resolvedTxRef = browserResult.txRef ?? txRef;
      if (!resolvedTxRef) {
        setActionError('Payment finished, but we could not confirm the transaction.');
        return;
      }

      const verified = await waitForPaymentVerification(resolvedTxRef);
      if (!verified) {
        setActionError('Payment is still processing. Wait a moment, then tap Buy Pass again.');
        return;
      }

      // Bypass React Query staleTime so we always read the credited balance.
      let refreshed = await getUserSettings();
      if (refreshed.walletPassesRemaining < ticketCount) {
        await wait(PAYMENT_STATUS_DELAY_MS);
        refreshed = await getUserSettings();
      }

      queryClient.setQueryData<UserSettingsResponse>(settingsQueryKey, refreshed);
      setCreditsOverride(refreshed.walletPassesRemaining);
      onSettingsUpdated?.(refreshed);
      setActionError(null);
    } catch (error) {
      setActionError(getErrorMessage(error, 'Unable to buy wallet passes.'));
    } finally {
      setBuying(false);
    }
  };

  const handleToggleWallet = (enabled: boolean) => {
    if (busy || toggleWalletMutation.isPending) {
      return;
    }
    void hapticLight();
    toggleWalletMutation.mutate(enabled);
  };

  const handleProceed = () => {
    if (busy) {
      return;
    }
    void hapticLight();
    onProceed();
  };

  const handleClose = () => {
    if (busy) {
      return;
    }
    setActionError(null);
    onClose();
  };

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Typography style={styles.title}>{title}</Typography>

          {!walletEnabled ? (
            <Typography style={styles.message}>
              Wallet for ticket transfers is disabled. Recipients will receive ticket details only,
              without Add to Wallet.
            </Typography>
          ) : hasEnoughCredits ? (
            <View style={styles.details}>
              <DetailRow label="Available credits" value={String(effectiveCredits)} />
              <DetailRow
                label="Credits needed"
                value={`${ticketCount} pass${ticketCount === 1 ? '' : 'es'}`}
              />
            </View>
          ) : (
            <>
              <Typography style={styles.message}>
                This transfer needs {ticketCount} pass{ticketCount === 1 ? '' : 'es'}, but you only
                have {effectiveCredits} available.
              </Typography>
              <View style={styles.details}>
                <DetailRow label="Available credits" value={String(effectiveCredits)} />
                <DetailRow label="Credits needed" value={String(ticketCount)} />
                <DetailRow label="Shortfall" value={String(shortfall)} />
              </View>
            </>
          )}

          {actionError ? <Typography style={styles.errorText}>{actionError}</Typography> : null}

          <View style={styles.actions}>
            {!walletEnabled ? (
              <>
                <Pressable
                  accessibilityRole="button"
                  disabled={busy || toggleWalletMutation.isPending}
                  onPress={() => handleToggleWallet(true)}
                  style={styles.secondaryButton}
                >
                  {toggleWalletMutation.isPending ? (
                    <ActivityIndicator color={colors.pulse[600]} />
                  ) : (
                    <Typography style={styles.secondaryLabel}>Turn on</Typography>
                  )}
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={busy}
                  onPress={handleProceed}
                  style={styles.primaryButton}
                >
                  {transferring ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Typography style={styles.primaryLabel}>Proceed</Typography>
                  )}
                </Pressable>
              </>
            ) : hasEnoughCredits ? (
              <Pressable
                accessibilityRole="button"
                disabled={busy}
                onPress={handleProceed}
                style={styles.primaryButton}
              >
                {transferring ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Typography style={styles.primaryLabel}>Proceed</Typography>
                )}
              </Pressable>
            ) : (
              <>
                <Pressable
                  accessibilityRole="button"
                  disabled={busy}
                  onPress={() => void handleBuyPasses()}
                  style={styles.primaryButton}
                >
                  {buying ? (
                    <View style={styles.rowCenter}>
                      <ActivityIndicator color={colors.white} />
                      <Typography style={styles.primaryLabel}>Processing...</Typography>
                    </View>
                  ) : (
                    <Typography style={styles.primaryLabel}>
                      Buy {shortfall} Pass{shortfall === 1 ? '' : 'es'} · {formatNaira(buyAmount)}
                    </Typography>
                  )}
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={busy || toggleWalletMutation.isPending}
                  onPress={() => handleToggleWallet(false)}
                  style={styles.secondaryButton}
                >
                  {toggleWalletMutation.isPending ? (
                    <ActivityIndicator color={colors.pulse[600]} />
                  ) : (
                    <Typography style={styles.secondaryLabel}>
                      Turn off wallet for ticket transfers
                    </Typography>
                  )}
                </Pressable>
              </>
            )}

            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={handleClose}
              style={styles.ghostButton}
            >
              <Typography style={styles.ghostLabel}>Cancel</Typography>
            </Pressable>
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = {
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.neutral[0],
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    color: colors.neutral[950],
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  message: {
    color: colors.neutral[500],
    fontSize: 14,
    lineHeight: 20,
  },
  details: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  detailLabel: {
    flex: 1,
    color: colors.neutral[600],
    fontSize: 13,
    lineHeight: 18,
  },
  detailValue: {
    color: colors.neutral[900],
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  errorText: {
    color: colors.error[500],
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    gap: spacing.sm,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pulse[600],
    paddingHorizontal: spacing.md,
  },
  primaryLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.neutral[0],
    paddingHorizontal: spacing.md,
  },
  secondaryLabel: {
    color: colors.pulse[700],
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  ghostButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostLabel: {
    color: colors.neutral[500],
    fontSize: 14,
    fontWeight: '600',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
} as const;
