import { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { colors, radius, spacing } from '@/theme/tokens';

export interface AuthenticationFooterProps {
  disabled?: boolean;
  loading?: boolean;
  bottomInset?: number;
  onConfirm?: () => void;
}

export const AuthenticationFooter = memo(function AuthenticationFooter({
  disabled = true,
  loading = false,
  bottomInset = 0,
  onConfirm,
}: AuthenticationFooterProps) {
  const isDisabled = disabled || loading;

  return (
    <View style={[styles.footer, { paddingBottom: Math.max(bottomInset, spacing.lg) }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        onPress={onConfirm}
        style={[
          styles.button,
          isDisabled && !loading ? styles.buttonDisabled : styles.buttonEnabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Typography style={styles.label}>Confirm Code</Typography>
        )}
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.transparent,
    borderTopWidth: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  button: {
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonEnabled: {
    backgroundColor: colors.pulse[500],
  },
  buttonDisabled: {
    backgroundColor: colors.pulse[200],
  },
  label: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
});
