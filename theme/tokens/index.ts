import { animation } from './animation';
import { borderWidth } from './borderWidth';
import { breakpoints } from './breakpoints';
import { colors } from './colors';
import { componentSizes } from './componentSizes';
import { elevation } from './elevation';
import { iconSizes } from './iconSizes';
import { opacity } from './opacity';
import { radius } from './radius';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';

export { animation, type AnimationToken } from './animation';
export { borderWidth, type BorderWidthToken } from './borderWidth';
export { breakpoints, type BreakpointToken } from './breakpoints';
export { colors, type ColorToken } from './colors';
export { componentSizes, type ComponentSizeToken } from './componentSizes';
export { elevation, type ElevationToken } from './elevation';
export { iconSizes, type IconSizeToken } from './iconSizes';
export { opacity, type OpacityToken } from './opacity';
export { radius, type RadiusToken } from './radius';
export { shadows, type ShadowToken } from './shadows';
export { spacing, type SpacingToken } from './spacing';
export { typography, type TypographyToken } from './typography';

export const tokens = {
  animation,
  borderWidth,
  breakpoints,
  colors,
  componentSizes,
  elevation,
  iconSizes,
  opacity,
  radius,
  shadows,
  spacing,
  typography,
} as const;

export type DesignTokens = typeof tokens;
