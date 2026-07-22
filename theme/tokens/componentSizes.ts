export const componentSizes = {
  button: {
    sm: 32,
    md: 40,
    lg: 48,
  },
  input: {
    sm: 36,
    md: 44,
    lg: 52,
  },
  avatar: {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  },
  tabBar: 56,
  header: 56,
  bottomSheetHandle: 4,
} as const;

export type ComponentSizeToken = typeof componentSizes;
