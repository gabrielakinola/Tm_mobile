import { Children, Fragment, type ReactNode } from 'react';
import { Pressable, Switch, View, type StyleProp, type ViewStyle } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import {
  APP_ACCOUNT_CARD,
  APP_ACCOUNT_DIVIDER,
  APP_ACCOUNT_TOGGLE_OFF,
  APP_ACCOUNT_TOGGLE_ON,
  APP_DARK_MUTED,
} from '@/constants/app-surface';
import { colors, radius, spacing } from '@/theme/tokens';

export function AccountSectionTitle({ children }: { children: string }) {
  return (
    <Typography
      style={{
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.sm,
      }}
    >
      {children}
    </Typography>
  );
}

export function AccountGroup({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const items = Children.toArray(children).filter(Boolean);

  return (
    <View
      style={[
        {
          marginHorizontal: spacing.lg,
          backgroundColor: APP_ACCOUNT_CARD,
          borderRadius: radius.lg,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {items.map((child, index) => (
        <Fragment key={index}>
          {child}
          {index < items.length - 1 ? (
            <View
              style={{
                height: 1,
                backgroundColor: APP_ACCOUNT_DIVIDER,
                marginLeft: spacing.lg,
              }}
            />
          ) : null}
        </Fragment>
      ))}
    </View>
  );
}

interface AccountListRowProps {
  icon: ReactNode;
  label: string;
  value?: string;
  badge?: number;
  showChevron?: boolean;
  onPress?: () => void;
}

export function AccountListRow({
  icon,
  label,
  value,
  badge,
  showChevron = false,
  onPress,
}: AccountListRowProps) {
  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: 14,
        gap: spacing.md,
        backgroundColor: APP_ACCOUNT_CARD,
      }}
    >
      <View style={{ width: 28, alignItems: 'center' }}>{icon}</View>

      <Typography
        style={{
          flex: 1,
          color: colors.white,
          fontSize: 16,
          fontWeight: '400',
        }}
      >
        {label}
      </Typography>

      {value ? (
        <Typography style={{ color: APP_DARK_MUTED, fontSize: 15, fontWeight: '400' }}>
          {value}
        </Typography>
      ) : null}

      {badge !== undefined && badge > 0 ? (
        <View
          style={{
            minWidth: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: colors.error[500],
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 6,
          }}
        >
          <Typography style={{ color: colors.white, fontSize: 12, fontWeight: '700' }}>
            {badge}
          </Typography>
        </View>
      ) : null}

      {showChevron ? <ChevronRight size={18} color={APP_DARK_MUTED} strokeWidth={2} /> : null}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {content}
    </Pressable>
  );
}

interface AccountToggleRowProps {
  icon: ReactNode;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function AccountToggleRow({ icon, label, value, onValueChange }: AccountToggleRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: 10,
        gap: spacing.md,
        backgroundColor: APP_ACCOUNT_CARD,
      }}
    >
      <View style={{ width: 28, alignItems: 'center' }}>{icon}</View>
      <Typography style={{ flex: 1, color: colors.white, fontSize: 16, fontWeight: '400' }}>
        {label}
      </Typography>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: APP_ACCOUNT_TOGGLE_OFF, true: APP_ACCOUNT_TOGGLE_ON }}
        thumbColor={colors.white}
        ios_backgroundColor={APP_ACCOUNT_TOGGLE_OFF}
      />
    </View>
  );
}
