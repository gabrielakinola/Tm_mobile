import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { colors, spacing } from '@/theme/tokens';

const ICON_SIZE = 26;

export const TransferSafetyNotice = memo(function TransferSafetyNotice() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle} accessibilityElementsHidden>
        <Text style={styles.iconLetter}>i</Text>
      </View>
      <Typography style={styles.text}>
        Only transfer tickets to people you know and trust to ensure everyone stays safe.
      </Typography>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: colors.neutral[400],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLetter: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 15,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  text: {
    flex: 1,
    color: colors.neutral[950],
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
});
