import { useEffect, useMemo } from 'react';
import { Animated, View, type ViewProps } from 'react-native';
import { cn } from '@/lib/cn';
import { useTheme } from '@/theme';
import { radius } from '@/theme/tokens';

export interface SkeletonProps extends ViewProps {
  width?: number | `${number}%`;
  height?: number;
  rounded?: boolean;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = 16,
  rounded = false,
  className,
  style,
  ...props
}: SkeletonProps) {
  const { theme } = useTheme();
  const opacity = useMemo(() => new Animated.Value(0.4), []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      className={cn(className)}
      style={[
        {
          width,
          height,
          borderRadius: rounded ? radius.full : radius.md,
          backgroundColor: theme.colors.muted,
          opacity,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function SkeletonGroup({ children, gap = 8 }: { children: React.ReactNode; gap?: number }) {
  return <View style={{ gap }}>{children}</View>;
}
