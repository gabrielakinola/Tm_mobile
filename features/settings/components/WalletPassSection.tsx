import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { WALLET_PASS_PRICE_NGN } from '@/features/settings/constants';
import { colors, radius, spacing } from '@/theme/tokens';

interface WalletPassSectionProps {
  walletPassesRemaining: number;
  onPurchase: (quantity: number) => void;
}

export function WalletPassSection({ walletPassesRemaining, onPurchase }: WalletPassSectionProps) {
  const [quantity, setQuantity] = useState(1);

  const totalPrice = quantity * WALLET_PASS_PRICE_NGN;

  const decrement = () => setQuantity((current) => Math.max(1, current - 1));
  const increment = () => setQuantity((current) => Math.min(99, current + 1));

  const handlePurchase = () => {
    onPurchase(quantity);
    Alert.alert(
      'Wallet pass credits added',
      `${quantity} wallet pass credit${quantity === 1 ? '' : 's'} added. Payment processing is not connected yet.`,
    );
    setQuantity(1);
  };

  return (
    <View style={{ gap: spacing.md }}>
      <Typography style={{ color: colors.neutral[500], fontSize: 13, lineHeight: 20 }}>
        Buy Apple Wallet pass credits so recipients can add transferred tickets to Wallet on the
        acceptance website. Each pass costs $2 (₦3,000).
      </Typography>

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
          {walletPassesRemaining}
        </Typography>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.md,
        }}
      >
        <Typography style={{ color: colors.neutral[800], fontSize: 14, fontWeight: '600' }}>
          Quantity
        </Typography>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Decrease quantity"
            onPress={decrement}
            style={{
              width: 36,
              height: 36,
              borderRadius: radius.full,
              borderWidth: 1,
              borderColor: colors.neutral[300],
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.neutral[0],
            }}
          >
            <Minus size={16} color={colors.neutral[700]} />
          </Pressable>

          <View
            style={{
              minWidth: 44,
              height: 36,
              borderWidth: 1,
              borderColor: colors.neutral[300],
              borderRadius: radius.sm,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.neutral[0],
              paddingHorizontal: spacing.sm,
            }}
          >
            <Typography style={{ color: colors.neutral[900], fontSize: 15, fontWeight: '700' }}>
              {quantity}
            </Typography>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Increase quantity"
            onPress={increment}
            style={{
              width: 36,
              height: 36,
              borderRadius: radius.full,
              borderWidth: 1,
              borderColor: colors.neutral[300],
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.neutral[0],
            }}
          >
            <Plus size={16} color={colors.neutral[700]} />
          </Pressable>
        </View>

        <Typography style={{ color: colors.neutral[500], fontSize: 14, fontWeight: '600' }}>
          ₦{totalPrice.toLocaleString()}
        </Typography>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handlePurchase}
        style={{
          minHeight: 44,
          borderRadius: radius.md,
          backgroundColor: colors.pulse[600],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography style={{ color: colors.white, fontSize: 14, fontWeight: '700' }}>
          Buy {quantity} wallet pass credit{quantity === 1 ? '' : 's'}
        </Typography>
      </Pressable>
    </View>
  );
}
