import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';
import { cn } from '@/lib/cn';
import { hapticSelection } from '@/lib/haptics';
import { useTheme } from '@/theme';
import { componentSizes, spacing } from '@/theme/tokens';
import { Icon } from './Icon';
import { Typography } from './Typography';

export interface BottomNavItem {
  key: string;
  label: string;
  icon: LucideIcon;
}

export interface BottomNavigationProps {
  items: BottomNavItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export function BottomNavigation({ items, activeKey, onChange, className }: BottomNavigationProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      className={cn(className)}
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.card,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingBottom: insets.bottom,
        height: componentSizes.tabBar + insets.bottom,
      }}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;

        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => {
              void hapticSelection();
              onChange(item.key);
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.xs,
              paddingTop: spacing.sm,
            }}
          >
            <Icon
              icon={item.icon}
              size="md"
              color={isActive ? theme.colors.primary : theme.colors.mutedForeground}
            />
            <Typography
              variant="label"
              style={{
                color: isActive ? theme.colors.primary : theme.colors.mutedForeground,
                textTransform: 'none',
              }}
            >
              {item.label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}
