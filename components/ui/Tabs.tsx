import { Pressable, ScrollView, View, type ViewProps } from 'react-native';
import { cn } from '@/lib/cn';
import { hapticSelection } from '@/lib/haptics';
import { useTheme } from '@/theme';
import { radius, spacing } from '@/theme/tokens';
import { Typography } from './Typography';

export interface TabItem {
  key: string;
  label: string;
}

export interface TabsProps extends ViewProps {
  items: TabItem[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
}

export function Tabs({ items, value, onChange, className, style, ...props }: TabsProps) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: spacing.sm }}
    >
      <View className={cn('flex-row', className)} style={style} {...props}>
        {items.map((item) => {
          const isActive = item.key === value;

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
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
                borderRadius: radius.full,
                backgroundColor: isActive ? theme.colors.primary : theme.colors.secondary,
              }}
            >
              <Typography
                variant="label"
                style={{
                  color: isActive
                    ? theme.colors.primaryForeground
                    : theme.colors.secondaryForeground,
                  textTransform: 'none',
                }}
              >
                {item.label}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
