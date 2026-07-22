import { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Typography } from '@/components/ui/Typography';
import { colors, spacing } from '@/theme/tokens';

const TICKETMASTER_BLUE = '#0057D9';

export interface TransferToRecipientFooterProps {
  bottomInset?: number;
  showTransferButton?: boolean;
  ticketCount?: number;
  transferLoading?: boolean;
  onBack?: () => void;
  onTransfer?: () => void;
}

export const TransferToRecipientFooter = memo(function TransferToRecipientFooter({
  bottomInset = 0,
  showTransferButton = false,
  ticketCount = 0,
  transferLoading = false,
  onBack,
  onTransfer,
}: TransferToRecipientFooterProps) {
  const transferLabel = `Transfer ${ticketCount} ${ticketCount === 1 ? 'Ticket' : 'Tickets'}`;

  return (
    <View style={[styles.footer, { paddingBottom: Math.max(bottomInset, spacing.md) }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={8}
        disabled={transferLoading}
        onPress={onBack}
        style={styles.backPressable}
      >
        <ChevronLeft size={22} color={colors.pulse[500]} strokeWidth={2.4} />
        <Typography style={styles.backLabel}>Back</Typography>
      </Pressable>

      {showTransferButton ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={transferLabel}
          accessibilityState={{ disabled: transferLoading, busy: transferLoading }}
          disabled={transferLoading}
          onPress={onTransfer}
          style={({ pressed }) => pressed && !transferLoading && styles.pressed}
        >
          <View style={[styles.transferButton, transferLoading && styles.transferButtonDisabled]}>
            {transferLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.transferLabel}>{transferLabel}</Text>
            )}
          </View>
        </Pressable>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  backPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  backLabel: {
    color: colors.pulse[500],
    fontSize: 17,
    fontWeight: '500',
  },
  transferButton: {
    backgroundColor: TICKETMASTER_BLUE,
    height: 36,
    minWidth: 140,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transferButtonDisabled: {
    opacity: 0.7,
  },
  transferLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
