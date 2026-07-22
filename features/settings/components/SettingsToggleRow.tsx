import { Switch, View } from 'react-native';
import { Typography } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';

interface SettingsToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  leftIcon?: React.ReactNode;
}

export function SettingsToggleRow({
  label,
  description,
  value,
  onValueChange,
  leftIcon,
}: SettingsToggleRowProps) {
  return (
    <View style={{ gap: spacing.xs }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.md,
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          {leftIcon}
          <Typography
            style={{ color: colors.neutral[800], fontSize: 14, fontWeight: '600', flex: 1 }}
          >
            {label}
          </Typography>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.neutral[300], true: colors.pulse[400] }}
          thumbColor={colors.white}
        />
      </View>
      {description ? (
        <Typography style={{ color: colors.neutral[500], fontSize: 12, lineHeight: 18 }}>
          {description}
        </Typography>
      ) : null}
    </View>
  );
}
