import { Pressable, Modal as RNModal, View } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { ticketCountLabel } from '@/features/transfers/utils/min-tickets-transfer.util';
import { hapticLight } from '@/lib/haptics';
import { colors, radius, spacing } from '@/theme/tokens';

export interface MinimumTicketsTransferModalProps {
  visible: boolean;
  minimumTickets: number;
  onClose: () => void;
}

export function MinimumTicketsTransferModal({
  visible,
  minimumTickets,
  onClose,
}: MinimumTicketsTransferModalProps) {
  const handleClose = () => {
    void hapticLight();
    onClose();
  };

  const requiredLabel = ticketCountLabel(minimumTickets);

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <AlertCircle size={26} color={colors.pulse[700]} strokeWidth={2.2} />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              onPress={handleClose}
              style={styles.closeButton}
            >
              <X size={18} color={colors.neutral[700]} strokeWidth={2.2} />
            </Pressable>
          </View>

          <View style={styles.copy}>
            <Typography style={styles.title}>Unable to Transfer</Typography>
            <Typography style={styles.message}>
              These are joint tickets. You are only allowed to transfer {requiredLabel} at a time.
              Select at least {requiredLabel} to continue your transfer.
            </Typography>
          </View>

          <Pressable accessibilityRole="button" onPress={handleClose} style={styles.primaryButton}>
            <Typography style={styles.primaryLabel}>Select Tickets</Typography>
          </Pressable>
        </Pressable>
      </Pressable>
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
    shadowColor: colors.neutral[950],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pulse[50],
    borderWidth: 1,
    borderColor: colors.pulse[100],
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral[100],
  },
  copy: {
    gap: spacing.sm,
  },
  title: {
    color: colors.neutral[950],
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  message: {
    color: colors.neutral[600],
    fontSize: 15,
    lineHeight: 22,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pulse[600],
  },
  primaryLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
} as const;
