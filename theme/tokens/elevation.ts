export const elevation = {
  none: 0,
  sm: 1,
  md: 2,
  lg: 4,
  xl: 8,
} as const;

export type ElevationToken = typeof elevation;
