import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Typography } from '@/components/ui/Typography';
import { colors, radius, spacing } from '@/theme/tokens';

const TICKETMASTER_BLUE = '#0057D9';
const RING_COLOR = colors.neutral[300];

export interface TransferTicketSeatCardProps {
  seatLabel: string;
  selected: boolean;
  onPress: () => void;
}

export const TransferTicketSeatCard = memo(function TransferTicketSeatCard({
  seatLabel,
  selected,
  onPress,
}: TransferTicketSeatCardProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={seatLabel}
      onPress={onPress}
      style={styles.cardShadow}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Typography style={styles.headerLabel} numberOfLines={1}>
            {seatLabel}
          </Typography>
        </View>
        <View style={styles.body}>
          <View
            style={[styles.indicator, selected ? styles.indicatorSelected : styles.indicatorIdle]}
          >
            {selected ? <Check size={16} color={colors.white} strokeWidth={3} /> : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
});

const CARD_SIZE = 88;
const HEADER_HEIGHT = 32;
const INDICATOR_SIZE = 28;

const styles = StyleSheet.create({
  cardShadow: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },
  card: {
    flex: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: TICKETMASTER_BLUE,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  body: {
    height: CARD_SIZE - HEADER_HEIGHT,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  indicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  indicatorIdle: {
    borderWidth: 2,
    borderColor: RING_COLOR,
    backgroundColor: colors.white,
  },
  indicatorSelected: {
    backgroundColor: TICKETMASTER_BLUE,
    borderWidth: 0,
  },
});
