export const borderWidth = {
  none: 0,
  hairline: 0.5,
  thin: 1,
  medium: 2,
  thick: 3,
} as const;

export type BorderWidthToken = typeof borderWidth;
