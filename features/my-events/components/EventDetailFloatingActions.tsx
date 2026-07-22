import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ArrowUpRight, RefreshCw } from 'lucide-react-native';
import { Typography } from '@/components/ui/Typography';
import { colors, radius, spacing } from '@/theme/tokens';

const TICKETMASTER_BLUE = colors.pulse[500];
/** ~90% of previous pill height (was spacing.md vertical padding). */
const ACTION_PADDING_V = 9;

export interface EventDetailFloatingActionsProps {
  bottomInset?: number;
  onTransferPress?: () => void;
}

export function EventDetailFloatingActions({
  bottomInset = 0,
  onTransferPress,
}: EventDetailFloatingActionsProps) {
  const [sellActive, setSellActive] = useState(false);

  return (
    <View style={[styles.container, { bottom: spacing.lg + bottomInset }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Transfer"
        onPress={onTransferPress}
        style={styles.action}
      >
        <ArrowUpRight size={18} color={TICKETMASTER_BLUE} strokeWidth={2.2} />
        <Typography style={styles.transferLabel}>Transfer</Typography>
      </Pressable>

      <View style={styles.divider} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sell"
        onPress={() => setSellActive((active) => !active)}
        style={styles.action}
      >
        <RefreshCw
          size={18}
          color={sellActive ? TICKETMASTER_BLUE : colors.neutral[400]}
          strokeWidth={2.2}
        />
        <Typography
          style={[styles.sellLabel, sellActive ? styles.sellLabelActive : styles.sellLabelInactive]}
        >
          Sell
        </Typography>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '25%',
    width: '55%',
    flexDirection: 'row',
    backgroundColor: colors.neutral[0],
    borderRadius: radius.full,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  action: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: ACTION_PADDING_V,
  },
  divider: {
    width: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing.sm,
  },
  transferLabel: {
    color: colors.neutral[900],
    fontSize: 12,
    fontWeight: '600',
  },
  sellLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  sellLabelActive: {
    color: colors.neutral[900],
  },
  sellLabelInactive: {
    color: colors.neutral[400],
  },
});
