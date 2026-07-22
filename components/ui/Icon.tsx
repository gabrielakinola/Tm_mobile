import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { iconSizes, type IconSizeToken } from '@/theme/tokens';

export type IconSize = keyof IconSizeToken;

export interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ icon: LucideComponent, size = 'md', color, strokeWidth = 2 }: IconProps) {
  const { theme } = useTheme();
  const pixelSize = iconSizes[size];

  return (
    <LucideComponent
      size={pixelSize}
      color={color ?? theme.colors.foreground}
      strokeWidth={strokeWidth}
    />
  );
}
