import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme, View, type ViewProps } from 'react-native';
import { vars } from 'nativewind';
import { useThemeStore } from '@/stores/theme-store';
import { darkTheme, darkThemeCssVars } from './dark';
import { lightTheme, lightThemeCssVars } from './light';
import type { ColorScheme, Theme, ThemePreference } from './types';

interface ThemeContextValue {
  theme: Theme;
  colorScheme: ColorScheme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps extends ViewProps {
  children: ReactNode;
}

export function ThemeProvider({ children, style, ...props }: ThemeProviderProps) {
  const systemColorScheme = useSystemColorScheme();
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);

  const colorScheme: ColorScheme =
    preference === 'system' ? (systemColorScheme ?? 'light') : preference;

  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const cssVars = colorScheme === 'dark' ? darkThemeCssVars : lightThemeCssVars;

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      colorScheme,
      preference,
      setPreference,
      isDark: colorScheme === 'dark',
    }),
    [theme, colorScheme, preference, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={[vars(cssVars), { flex: 1 }, style]} {...props}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
