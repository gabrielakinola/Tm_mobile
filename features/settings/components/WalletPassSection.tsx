import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { Typography, useToast } from '@/components/ui';
import { openFlutterwaveCheckout } from '@/lib/flutterwave-checkout';
import { formatNaira } from '@/lib/format-currency';
import { hapticLight } from '@/lib/haptics';
import {
  formatWalletTrialCountdown,
  getWalletTrialRemainingMs,
  isWalletTrialActive,
  WALLET_PASS_PRICE_NGN,
  WALLET_TRIAL_DAYS,
} from '@/lib/subscription';
import {
  getFlutterwavePaymentStatusRequest,
  initiateWalletPassPaymentRequest,
} from '@/services/payments/payments.api';
import { colors, radius, spacing } from '@/theme/tokens';

const WALLET_ACCEPTANCE_EXPLANATION =
  'When a ticket transfer is accepted on the website, the recipient can add their tickets to a mobile wallet. Recipients on iOS receive an Apple Wallet pass; recipients on Android receive a Google Wallet pass.';

const MIN_PASSES_TO_BUY = 1;
const MAX_PASSES_TO_BUY = 99;
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

function getPaymentErrorMessage(error: unknown): string {
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

  return 'Unable to start payment. Please try again.';
}

interface WalletPassSectionProps {
  accountCreatedAt: string;
  walletPassesRemaining: number;
  unlimitedWalletPasses: boolean;
  onPurchaseSuccess?: () => void | Promise<void>;
}

export function WalletLifetimeExplanation() {
  return (
    <Typography style={{ color: colors.neutral[500], fontSize: 13, lineHeight: 20 }}>
      {WALLET_ACCEPTANCE_EXPLANATION} Your lifetime account includes unlimited wallet passes at no
      extra cost.
    </Typography>
  );
}

function useWalletTrialCountdown(accountCreatedAt: string) {
  const [remainingMs, setRemainingMs] = useState(() => getWalletTrialRemainingMs(accountCreatedAt));

  useEffect(() => {
    setRemainingMs(getWalletTrialRemainingMs(accountCreatedAt));

    if (!isWalletTrialActive(accountCreatedAt)) {
      return;
    }

    const interval = setInterval(() => {
      setRemainingMs(getWalletTrialRemainingMs(accountCreatedAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [accountCreatedAt]);

  return {
    trialActive: remainingMs > 0,
    countdown: formatWalletTrialCountdown(remainingMs),
  };
}

export function WalletPassSection({
  accountCreatedAt,
  walletPassesRemaining,
  unlimitedWalletPasses,
  onPurchaseSuccess,
}: WalletPassSectionProps) {
  const { show: showToast } = useToast();
  const { trialActive, countdown } = useWalletTrialCountdown(accountCreatedAt);
  const purchaseEnabled = !trialActive;
  const [passesToBuy, setPassesToBuy] = useState(MIN_PASSES_TO_BUY);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const remainingLabel = unlimitedWalletPasses ? '∞' : String(walletPassesRemaining);

  const adjustPasses = (delta: number) => {
    if (!purchaseEnabled || paying) {
      return;
    }

    void hapticLight();
    setPassesToBuy((current) =>
      Math.min(MAX_PASSES_TO_BUY, Math.max(MIN_PASSES_TO_BUY, current + delta)),
    );
  };

  const handleBuyPass = async () => {
    if (!purchaseEnabled || paying) {
      return;
    }

    setPaying(true);
    setPayError(null);
    void hapticLight();

    try {
      const { checkoutUrl, txRef } = await initiateWalletPassPaymentRequest({
        quantity: passesToBuy,
      });

      const browserResult = await openFlutterwaveCheckout(checkoutUrl);

      if (browserResult.type !== 'success') {
        setPayError('Payment was cancelled. You can try again when you are ready.');
        return;
      }

      const resolvedTxRef = browserResult.txRef ?? txRef;
      if (!resolvedTxRef) {
        setPayError('Payment finished, but we could not confirm the transaction reference.');
        return;
      }

      const verified = await waitForPaymentVerification(resolvedTxRef);
      if (!verified) {
        setPayError(
          'Payment is still processing. Wait a moment, then tap Buy Pass again to retry verification.',
        );
        return;
      }

      await onPurchaseSuccess?.();
      showToast({
        variant: 'success',
        duration: 4500,
        message: `Payment successful. ${passesToBuy} wallet pass${passesToBuy === 1 ? '' : 'es'} added.`,
      });
      setPassesToBuy(MIN_PASSES_TO_BUY);
    } catch (error) {
      setPayError(getPaymentErrorMessage(error));
    } finally {
      setPaying(false);
    }
  };

  return (
    <View style={{ gap: spacing.md }}>
      <Typography style={{ color: colors.neutral[800], fontSize: 15, fontWeight: '700' }}>
        Buy Wallet (Apple / Google)
      </Typography>

      <Typography style={{ color: colors.neutral[500], fontSize: 13, lineHeight: 20 }}>
        {WALLET_ACCEPTANCE_EXPLANATION} Each pass costs {formatNaira(WALLET_PASS_PRICE_NGN)} after
        your {WALLET_TRIAL_DAYS}-day free trial.
      </Typography>

      {trialActive ? (
        <View
          style={{
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.neutral[200],
            backgroundColor: colors.neutral[50],
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm + 2,
            gap: spacing.xs,
          }}
        >
          <Typography style={{ color: colors.neutral[600], fontSize: 12, fontWeight: '600' }}>
            Wallet Pass trial ends in
          </Typography>
          <Typography
            style={{
              color: colors.pulse[700],
              fontSize: 20,
              fontWeight: '700',
              fontVariant: ['tabular-nums'],
              letterSpacing: 0.5,
            }}
          >
            {countdown}
          </Typography>
        </View>
      ) : null}

      <View
        style={{
          borderWidth: 1,
          borderColor: colors.neutral[300],
          borderRadius: radius.md,
          backgroundColor: colors.neutral[0],
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography style={{ color: colors.neutral[700], fontSize: 14, fontWeight: '600' }}>
          Wallet passes remaining
        </Typography>
        <Typography style={{ color: colors.pulse[600], fontSize: 18, fontWeight: '700' }}>
          {remainingLabel}
        </Typography>
      </View>

      <View style={{ gap: spacing.xs }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography style={{ color: colors.neutral[700], fontSize: 14, fontWeight: '600' }}>
            Passes to buy
          </Typography>
          {!purchaseEnabled ? (
            <Typography
              style={{
                color: colors.neutral[500],
                fontSize: 11,
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: 0.4,
              }}
            >
              Pending
            </Typography>
          ) : null}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: colors.neutral[300],
            borderRadius: radius.md,
            backgroundColor: purchaseEnabled ? colors.neutral[0] : colors.neutral[100],
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            opacity: purchaseEnabled ? 1 : 0.85,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Decrease passes to buy"
            disabled={!purchaseEnabled || paying || passesToBuy <= MIN_PASSES_TO_BUY}
            onPress={() => adjustPasses(-1)}
            hitSlop={8}
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.sm,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.neutral[100],
              opacity: !purchaseEnabled || paying || passesToBuy <= MIN_PASSES_TO_BUY ? 0.45 : 1,
            }}
          >
            <Minus size={18} color={colors.neutral[800]} strokeWidth={2.2} />
          </Pressable>

          <Typography
            style={{
              color: purchaseEnabled ? colors.neutral[900] : colors.neutral[500],
              fontSize: 18,
              fontWeight: '700',
              fontVariant: ['tabular-nums'],
              minWidth: 32,
              textAlign: 'center',
            }}
          >
            {passesToBuy}
          </Typography>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Increase passes to buy"
            disabled={!purchaseEnabled || paying || passesToBuy >= MAX_PASSES_TO_BUY}
            onPress={() => adjustPasses(1)}
            hitSlop={8}
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.sm,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.neutral[100],
              opacity: !purchaseEnabled || paying || passesToBuy >= MAX_PASSES_TO_BUY ? 0.45 : 1,
            }}
          >
            <Plus size={18} color={colors.neutral[800]} strokeWidth={2.2} />
          </Pressable>
        </View>

        {purchaseEnabled ? (
          <Typography style={{ color: colors.neutral[500], fontSize: 12, lineHeight: 18 }}>
            Total: {formatNaira(passesToBuy * WALLET_PASS_PRICE_NGN)}
          </Typography>
        ) : (
          <Typography style={{ color: colors.neutral[500], fontSize: 12, lineHeight: 18 }}>
            Pass selection unlocks when your free trial ends.
          </Typography>
        )}
      </View>

      {payError ? (
        <Typography style={{ color: colors.error[500], fontSize: 13, lineHeight: 18 }}>
          {payError}
        </Typography>
      ) : null}

      <Pressable
        accessibilityRole="button"
        disabled={!purchaseEnabled || paying}
        onPress={() => void handleBuyPass()}
        style={{
          minHeight: 44,
          borderRadius: radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: purchaseEnabled ? colors.pulse[600] : colors.neutral[200],
          opacity: paying ? 0.75 : 1,
        }}
      >
        {paying ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <ActivityIndicator color={colors.white} />
            <Typography style={{ color: colors.white, fontSize: 14, fontWeight: '700' }}>
              Processing...
            </Typography>
          </View>
        ) : (
          <Typography
            style={{
              color: purchaseEnabled ? colors.white : colors.neutral[500],
              fontSize: 14,
              fontWeight: '700',
            }}
          >
            Buy Pass · {formatNaira(passesToBuy * WALLET_PASS_PRICE_NGN)}
          </Typography>
        )}
      </Pressable>
    </View>
  );
}
