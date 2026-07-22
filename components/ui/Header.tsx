import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SCREEN_HEADER_BG } from '@/constants/screen-header';
import { cn } from '@/lib/cn';
import { colors, componentSizes, spacing } from '@/theme/tokens';
import { IconButton } from './IconButton';
import { Typography } from './Typography';

export interface HeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  className?: string;
}

export function Header({
  title,
  subtitle,
  leftAction,
  rightAction,
  transparent = false,
  className,
  style,
  ...props
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <>
      {!transparent ? <StatusBar style="light" backgroundColor={SCREEN_HEADER_BG} /> : null}
      <View
        className={cn(className)}
        style={[
          {
            paddingTop: insets.top,
            backgroundColor: transparent ? 'transparent' : SCREEN_HEADER_BG,
            borderBottomWidth: 0,
          },
          style,
        ]}
        {...props}
      >
        <View
          style={{
            height: componentSizes.header,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            gap: spacing.md,
          }}
        >
          {leftAction ? (
            <View style={{ minWidth: 40, zIndex: 1 }}>{leftAction}</View>
          ) : (
            <View style={{ width: 40 }} />
          )}
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: spacing.xs }}>
            <Typography
              variant="h4"
              style={{ color: colors.white, textAlign: 'center' }}
              numberOfLines={1}
            >
              {title}
            </Typography>
            {subtitle ? (
              <Typography
                variant="caption"
                style={{ color: colors.neutral[400], textAlign: 'center' }}
                numberOfLines={1}
              >
                {subtitle}
              </Typography>
            ) : null}
          </View>
          {rightAction ? (
            <View style={{ minWidth: 40, zIndex: 1, alignItems: 'flex-end' }}>{rightAction}</View>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>
      </View>
    </>
  );
}

export { IconButton as HeaderIconButton };
