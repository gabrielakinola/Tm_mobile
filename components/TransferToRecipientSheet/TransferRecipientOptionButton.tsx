import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Plus, Users } from 'lucide-react-native';
import { colors, radius, spacing } from '@/theme/tokens';

export interface TransferRecipientOptionButtonProps {
  label: string;
  icon: 'contacts' | 'manual';
  onPress?: () => void;
}

export const TransferRecipientOptionButton = memo(function TransferRecipientOptionButton({
  label,
  icon,
  onPress,
}: TransferRecipientOptionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <View style={styles.borderBox}>
        <View style={styles.contentRow}>
          <Text style={styles.label}>{label}</Text>
          {icon === 'contacts' ? (
            <Users size={20} color={colors.neutral[900]} strokeWidth={2} />
          ) : (
            <Plus size={20} color={colors.neutral[900]} strokeWidth={2.2} />
          )}
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.7,
  },
  borderBox: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderStyle: 'solid',
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    height: 52,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    color: colors.neutral[900],
    fontSize: 17,
    lineHeight: 17,
    fontWeight: '600',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
