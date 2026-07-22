import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Typography } from '@/components/ui/Typography';
import { colors, spacing } from '@/theme/tokens';

const TICKETMASTER_BLUE = '#0057D9';

export interface SelectTicketsFooterProps {
  selectedCount: number;
  bottomInset?: number;
  onTransferTo?: () => void;
}

export const SelectTicketsFooter = memo(function SelectTicketsFooter({
  selectedCount,
  bottomInset = 0,
  onTransferTo,
}: SelectTicketsFooterProps) {
  const canTransfer = selectedCount > 0;

  return (
    <View style={[styles.footer, { paddingBottom: Math.max(bottomInset, spacing.lg) }]}>
      <Typography style={styles.selectedLabel}>{selectedCount} Selected</Typography>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Transfer to"
        accessibilityState={{ disabled: !canTransfer }}
        disabled={!canTransfer}
        onPress={onTransferTo}
        style={styles.transferPressable}
      >
        <Typography style={[styles.transferLabel, !canTransfer && styles.transferLabelDisabled]}>
          TRANSFER TO
        </Typography>
        <ChevronRight
          size={16}
          color={canTransfer ? TICKETMASTER_BLUE : colors.neutral[300]}
          strokeWidth={2.4}
        />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.neutral[200],
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedLabel: {
    color: colors.neutral[500],
    fontSize: 14,
    fontWeight: '500',
  },
  transferPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  transferLabel: {
    color: TICKETMASTER_BLUE,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.4,
  },
  transferLabelDisabled: {
    color: colors.neutral[300],
  },
});
