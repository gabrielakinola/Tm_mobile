import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/cn';
import { useTheme } from '@/theme';
import { spacing } from '@/theme/tokens';

export interface DividerProps extends ViewProps {
  vertical?: boolean;
  spacing?: number;
  className?: string;
}

export function Divider({
  vertical = false,
  spacing: dividerSpacing = spacing.md,
  className,
  style,
  ...props
}: DividerProps) {
  const { theme } = useTheme();

  return (
    <View
      className={cn(className)}
      style={[
        vertical
          ? {
              width: 1,
              height: '100%',
              backgroundColor: theme.colors.border,
              marginHorizontal: dividerSpacing,
            }
          : {
              height: 1,
              width: '100%',
              backgroundColor: theme.colors.border,
              marginVertical: dividerSpacing,
            },
        style,
      ]}
      {...props}
    />
  );
}
