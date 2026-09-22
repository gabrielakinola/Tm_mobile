import { Switch, View } from 'react-native';
import { Typography } from '@/components/ui';
import {
  APP_ACCOUNT_TOGGLE_OFF,
  APP_ACCOUNT_TOGGLE_ON,
  APP_DARK_MUTED,
} from '@/constants/app-surface';
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
          <Typography style={{ color: colors.white, fontSize: 14, fontWeight: '600', flex: 1 }}>
            {label}
          </Typography>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: APP_ACCOUNT_TOGGLE_OFF, true: APP_ACCOUNT_TOGGLE_ON }}
          thumbColor={colors.white}
          ios_backgroundColor={APP_ACCOUNT_TOGGLE_OFF}
        />
      </View>
      {description ? (
        <Typography style={{ color: APP_DARK_MUTED, fontSize: 12, lineHeight: 18 }}>
          {description}
        </Typography>
      ) : null}
    </View>
  );
}
