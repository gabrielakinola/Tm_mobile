import { Pressable, Modal as RNModal, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Check, Copy, X } from 'lucide-react-native';
import { Typography, useToast } from '@/components/ui';
import {
  APP_CARD_BG,
  APP_DARK_BG,
  APP_DARK_MUTED,
  APP_DARK_SURFACE,
  APP_INPUT_BG,
} from '@/constants/app-surface';
import { hapticLight } from '@/lib/haptics';
import { colors, radius, spacing } from '@/theme/tokens';

interface UserCreatedCredentialsModalProps {
  visible: boolean;
  email: string;
  password: string;
  onClose: () => void;
}

function CredentialRow({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <View style={styles.credentialRow}>
      <View style={{ flex: 1, gap: 4 }}>
        <Typography style={styles.credentialLabel}>{label}</Typography>
        <Typography style={styles.credentialValue} selectable>
          {value}
        </Typography>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Copy ${label.toLowerCase()}`}
        hitSlop={8}
        onPress={onCopy}
        style={styles.copyIconButton}
      >
        <Copy size={18} color={colors.pulse[300]} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}

export function UserCreatedCredentialsModal({
  visible,
  email,
  password,
  onClose,
}: UserCreatedCredentialsModalProps) {
  const { show } = useToast();

  const handleClose = () => {
    void hapticLight();
    onClose();
  };

  const copyText = async (label: string, value: string) => {
    void hapticLight();
    await Clipboard.setStringAsync(value);
    show({ message: `${label} copied.`, variant: 'success' });
  };

  const copyAll = async () => {
    void hapticLight();
    await Clipboard.setStringAsync(`Email: ${email}\nPassword: ${password}`);
    show({ message: 'Login details copied.', variant: 'success' });
  };

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.successIcon}>
              <Check size={28} color={colors.white} strokeWidth={3} />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              onPress={handleClose}
              style={styles.closeButton}
            >
              <X size={18} color={APP_DARK_MUTED} strokeWidth={2.2} />
            </Pressable>
          </View>

          <View style={styles.copy}>
            <Typography style={styles.title}>User created</Typography>
            <Typography style={styles.message}>
              Share these login details securely. The password is only shown once.
            </Typography>
          </View>

          <View style={styles.details}>
            <CredentialRow
              label="Email"
              value={email}
              onCopy={() => void copyText('Email', email)}
            />
            <CredentialRow
              label="Password"
              value={password}
              onCopy={() => void copyText('Password', password)}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => void copyAll()}
            style={styles.secondaryButton}
          >
            <Copy size={16} color={colors.pulse[300]} strokeWidth={2.2} />
            <Typography style={styles.secondaryLabel}>Copy all details</Typography>
          </Pressable>

          <Pressable accessibilityRole="button" onPress={handleClose} style={styles.doneButton}>
            <Typography style={styles.doneLabel}>Done</Typography>
          </Pressable>
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
    backgroundColor: APP_CARD_BG,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: APP_DARK_SURFACE,
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
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_DARK_BG,
  },
  copy: {
    gap: spacing.sm,
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  message: {
    color: APP_DARK_MUTED,
    fontSize: 15,
    lineHeight: 22,
  },
  details: {
    gap: spacing.sm,
  },
  credentialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: APP_DARK_SURFACE,
    borderRadius: radius.md,
    backgroundColor: APP_INPUT_BG,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  credentialLabel: {
    color: APP_DARK_MUTED,
    fontSize: 12,
    fontWeight: '600',
  },
  credentialValue: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  copyIconButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 108, 223, 0.18)',
  },
  secondaryButton: {
    minHeight: 44,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: APP_DARK_SURFACE,
    backgroundColor: APP_INPUT_BG,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryLabel: {
    color: colors.pulse[300],
    fontSize: 14,
    fontWeight: '700',
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
