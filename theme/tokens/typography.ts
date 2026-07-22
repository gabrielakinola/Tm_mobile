export const typography = {
  fontFamily: {
    sans: 'System',
    mono: 'Courier',
  },
  fontSize: {
    display: 36,
    h1: 30,
    h2: 24,
    h3: 20,
    h4: 18,
    body: 16,
    caption: 14,
    label: 12,
  },
  lineHeight: {
    display: 44,
    h1: 38,
    h2: 32,
    h3: 28,
    h4: 26,
    body: 24,
    caption: 20,
    label: 16,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;

export type TypographyToken = typeof typography;
