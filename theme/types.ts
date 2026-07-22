import type { ShadowToken } from '@/theme/tokens/shadows';

export type ColorScheme = 'light' | 'dark';

export type ThemePreference = 'system' | ColorScheme;

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  success: string;
  warning: string;
  info: string;
}

export interface Theme {
  scheme: ColorScheme;
  colors: ThemeColors;
  shadow: ShadowToken;
}

export type ThemeCssVars = Record<string, string>;
