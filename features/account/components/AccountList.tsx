import { Pressable, Switch, View } from 'react-native';
import { ChevronRight, SquarePen } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { colors, spacing } from '@/theme/tokens';

export function AccountSectionTitle({ children }: { children: string }) {
  return (
    <Typography
      style={{
        color: colors.neutral[900],
        fontSize: 16,
        fontWeight: '700',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
      }}
    >
      {children}
    </Typography>
  );
}

interface AccountListRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  badge?: number;
  showChevron?: boolean;
  showEdit?: boolean;
  destructive?: boolean;
  onPress?: () => void;
}

export function AccountListRow({
  icon,
  label,
  value,
  badge,
  showChevron = false,
  showEdit = false,
  destructive = false,
  onPress,
}: AccountListRowProps) {
  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        gap: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[200],
        backgroundColor: colors.neutral[0],
      }}
    >
      <View style={{ width: 28, alignItems: 'center' }}>{icon}</View>

      <Typography
        style={{
          flex: 1,
          color: destructive ? colors.error[500] : colors.neutral[900],
          fontSize: 16,
          fontWeight: '500',
        }}
      >
        {label}
      </Typography>

      {value ? (
        <Typography style={{ color: colors.pulse[500], fontSize: 15, fontWeight: '500' }}>
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

      {showEdit ? <SquarePen size={18} color={colors.pulse[500]} /> : null}

      {showChevron ? <ChevronRight size={18} color={colors.neutral[400]} /> : null}
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
  icon: React.ReactNode;
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
        paddingVertical: spacing.md,
        gap: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[200],
        backgroundColor: colors.neutral[0],
      }}
    >
      <View style={{ width: 28, alignItems: 'center' }}>{icon}</View>
      <Typography style={{ flex: 1, color: colors.neutral[900], fontSize: 16, fontWeight: '500' }}>
        {label}
      </Typography>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.neutral[300], true: colors.pulse[500] }}
        thumbColor={colors.white}
      />
    </View>
  );
}
