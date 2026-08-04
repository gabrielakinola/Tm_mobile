import { Pressable, Modal as RNModal, View } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { hapticLight } from '@/lib/haptics';
import { colors, radius, spacing } from '@/theme/tokens';

interface TransferSuccessModalProps {
  visible: boolean;
  recipientEmail: string;
  ticketCount: number;
  onClose: () => void;
}

export function TransferSuccessModal({
  visible,
  recipientEmail,
  ticketCount,
  onClose,
}: TransferSuccessModalProps) {
  const ticketLabel = ticketCount === 1 ? 'ticket' : 'tickets';

  const handleClose = () => {
    void hapticLight();
    onClose();
  };

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.successIcon}>
              <Check size={28} color={colors.white} strokeWidth={3} />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close transfer confirmation"
              hitSlop={8}
              onPress={handleClose}
              style={styles.closeButton}
            >
              <X size={18} color={colors.neutral[700]} strokeWidth={2.2} />
            </Pressable>
          </View>

          <View style={styles.copy}>
            <Typography style={styles.title}>Transfer sent</Typography>
            <Typography style={styles.message}>
              {ticketCount} {ticketLabel} {ticketCount === 1 ? 'has' : 'have'} been sent to{' '}
              {recipientEmail}. They&apos;ll receive an email with instructions to accept them.
            </Typography>
          </View>

          <View style={styles.emailPill}>
            <Typography style={styles.emailText} numberOfLines={1}>
              {recipientEmail}
            </Typography>
          </View>

          <Pressable accessibilityRole="button" onPress={handleClose} style={styles.doneButton}>
            <Typography style={styles.doneLabel}>Done</Typography>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pulse[600],
    shadowColor: colors.pulse[700],
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
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
  emailPill: {
    borderRadius: radius.md,
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  emailText: {
    color: colors.neutral[800],
    fontSize: 14,
    fontWeight: '600',
  },
  doneButton: {
    minHeight: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pulse[600],
  },
  doneLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
} as const;
