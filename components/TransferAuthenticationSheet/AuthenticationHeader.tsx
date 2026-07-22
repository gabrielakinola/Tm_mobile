import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { colors, spacing } from '@/theme/tokens';

const HEADER_HEIGHT = 56;

export interface AuthenticationHeaderProps {
  onCancel: () => void;
}

export const AuthenticationHeader = memo(function AuthenticationHeader({
  onCancel,
}: AuthenticationHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cancel"
        hitSlop={8}
        onPress={onCancel}
        style={styles.cancelPressable}
      >
        <Typography style={styles.cancelLabel}>Cancel</Typography>
      </Pressable>

      <Typography style={styles.title}>Authentication</Typography>

      <View style={styles.trailingSpacer} />
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: colors.pulse[500],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  cancelPressable: {
    minWidth: 72,
    justifyContent: 'center',
  },
  cancelLabel: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '400',
  },
  title: {
    flex: 1,
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  trailingSpacer: {
    minWidth: 72,
  },
});
