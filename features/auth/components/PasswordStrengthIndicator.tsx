import { View } from 'react-native';
import { Typography } from '@/components/ui';
import { APP_DARK_MUTED, APP_DARK_SURFACE } from '@/constants/app-surface';
import { getPasswordStrength } from '@/features/auth/utils/password-strength';
import { radius, spacing } from '@/theme/tokens';

export function PasswordStrengthIndicator({ password }: { password: string }) {
  const { score, label, color } = getPasswordStrength(password);

  return (
    <View style={styles.strengthWrap}>
      <View style={styles.strengthHeader}>
        <Typography style={styles.strengthLabel}>Password strength</Typography>
        <Typography style={[styles.strengthValue, { color }]}>{label}</Typography>
      </View>
      <View style={styles.strengthBars}>
        {Array.from({ length: 5 }, (_, index) => (
          <View
            key={index}
            style={[styles.strengthBar, index < score && { backgroundColor: color }]}
          />
        ))}
      </View>
      <Typography style={styles.strengthHint}>
        8+ characters, uppercase, lowercase, number, and symbol.
      </Typography>
    </View>
  );
}

const styles = {
  strengthWrap: {
    gap: spacing.xs,
    marginTop: -spacing.xs,
  },
  strengthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  strengthLabel: {
    color: APP_DARK_MUTED,
    fontSize: 12,
    fontWeight: '600',
  },
  strengthValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  strengthBars: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  strengthBar: {
    flex: 1,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: APP_DARK_SURFACE,
  },
  strengthHint: {
    color: APP_DARK_MUTED,
    fontSize: 11,
    lineHeight: 15,
  },
} as const;
