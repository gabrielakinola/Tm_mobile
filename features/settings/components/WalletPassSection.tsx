import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { Typography, useToast } from '@/components/ui';
import {
  APP_CARD_BG,
  APP_DARK_BG,
  APP_DARK_MUTED,
  APP_DARK_SURFACE,
  APP_INPUT_BG,
} from '@/constants/app-surface';
import { openFlutterwaveCheckout } from '@/lib/flutterwave-checkout';
import { formatNaira } from '@/lib/format-currency';
import { hapticLight } from '@/lib/haptics';
import { INITIAL_FREE_WALLET_PASSES, WALLET_PASS_PRICE_NGN } from '@/lib/subscription';
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
  walletPassesRemaining: number;
  unlimitedWalletPasses: boolean;
  onPurchaseSuccess?: () => void | Promise<void>;
}

export function WalletLifetimeExplanation() {
  return (
    <Typography style={{ color: APP_DARK_MUTED, fontSize: 13, lineHeight: 20 }}>
      {WALLET_ACCEPTANCE_EXPLANATION} Your lifetime account includes unlimited wallet passes at no
      extra cost.
    </Typography>
  );
}

export function WalletPassSection({
  walletPassesRemaining,
  unlimitedWalletPasses,
  onPurchaseSuccess,
}: WalletPassSectionProps) {
  const { show: showToast } = useToast();
  const [passesToBuy, setPassesToBuy] = useState(MIN_PASSES_TO_BUY);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const remainingLabel = unlimitedWalletPasses ? '∞' : String(walletPassesRemaining);

  const adjustPasses = (delta: number) => {
    if (paying) {
      return;
    }

    void hapticLight();
    setPassesToBuy((current) =>
      Math.min(MAX_PASSES_TO_BUY, Math.max(MIN_PASSES_TO_BUY, current + delta)),
    );
  };

  const handleBuyPass = async () => {
    if (paying) {
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
      <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
        Buy Wallet (Apple / Google)
      </Typography>

      <Typography style={{ color: APP_DARK_MUTED, fontSize: 13, lineHeight: 20 }}>
        {WALLET_ACCEPTANCE_EXPLANATION} New accounts start with {INITIAL_FREE_WALLET_PASSES} free
        passes. Each transfer uses 1 pass ({formatNaira(WALLET_PASS_PRICE_NGN)}), regardless of how
        many tickets you send. You can buy more anytime.
      </Typography>

      <View
        style={{
          borderWidth: 1,
          borderColor: APP_DARK_SURFACE,
          borderRadius: radius.md,
          backgroundColor: APP_CARD_BG,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography style={{ color: APP_DARK_MUTED, fontSize: 14, fontWeight: '600' }}>
          Wallet passes remaining
        </Typography>
        <Typography style={{ color: colors.pulse[600], fontSize: 18, fontWeight: '700' }}>
          {remainingLabel}
        </Typography>
      </View>

      <View style={{ gap: spacing.xs }}>
        <Typography style={{ color: APP_DARK_MUTED, fontSize: 14, fontWeight: '600' }}>
          Passes to buy
        </Typography>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: APP_DARK_SURFACE,
            borderRadius: radius.md,
            backgroundColor: APP_INPUT_BG,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Decrease passes to buy"
            disabled={paying || passesToBuy <= MIN_PASSES_TO_BUY}
            onPress={() => adjustPasses(-1)}
            hitSlop={8}
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.sm,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: APP_DARK_BG,
              opacity: paying || passesToBuy <= MIN_PASSES_TO_BUY ? 0.45 : 1,
            }}
          >
            <Minus size={18} color={colors.white} strokeWidth={2.2} />
          </Pressable>

          <Typography
            style={{
              color: colors.white,
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
            disabled={paying || passesToBuy >= MAX_PASSES_TO_BUY}
            onPress={() => adjustPasses(1)}
            hitSlop={8}
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.sm,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: APP_DARK_BG,
              opacity: paying || passesToBuy >= MAX_PASSES_TO_BUY ? 0.45 : 1,
            }}
          >
            <Plus size={18} color={colors.white} strokeWidth={2.2} />
          </Pressable>
        </View>

        <Typography style={{ color: APP_DARK_MUTED, fontSize: 12, lineHeight: 18 }}>
          Total: {formatNaira(passesToBuy * WALLET_PASS_PRICE_NGN)}
        </Typography>
      </View>

      {payError ? (
        <Typography style={{ color: colors.error[500], fontSize: 13, lineHeight: 18 }}>
          {payError}
        </Typography>
      ) : null}

      <Pressable
        accessibilityRole="button"
        disabled={paying}
        onPress={() => void handleBuyPass()}
        style={{
          minHeight: 44,
          borderRadius: radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.pulse[600],
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
              color: colors.white,
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
