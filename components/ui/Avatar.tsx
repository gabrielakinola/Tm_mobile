import { View, type ViewProps } from 'react-native';
import { Image } from 'expo-image';
import { cn } from '@/lib/cn';
import { useTheme } from '@/theme';
import { componentSizes } from '@/theme/tokens';
import { Typography } from './Typography';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends ViewProps {
  source?: string | null;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: componentSizes.avatar.sm,
  md: componentSizes.avatar.md,
  lg: componentSizes.avatar.lg,
  xl: componentSizes.avatar.xl,
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({
  source,
  name = '',
  size = 'md',
  className,
  style,
  ...props
}: AvatarProps) {
  const { theme } = useTheme();
  const dimension = sizeMap[size];

  return (
    <View
      className={cn('items-center justify-center overflow-hidden', className)}
      style={[
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: theme.colors.accent,
        },
        style,
      ]}
      {...props}
    >
      {source ? (
        <Image
          source={{ uri: source }}
          style={{ width: dimension, height: dimension }}
          contentFit="cover"
          accessibilityLabel={name || 'Avatar'}
        />
      ) : (
        <Typography variant="caption" style={{ color: theme.colors.accentForeground }}>
          {getInitials(name) || '?'}
        </Typography>
      )}
    </View>
  );
}
