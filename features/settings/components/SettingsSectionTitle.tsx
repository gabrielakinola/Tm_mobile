import { Typography } from '@/components/ui';
import { colors } from '@/theme/tokens';

export function SettingsSectionTitle({ children }: { children: string }) {
  return (
    <Typography style={{ color: colors.neutral[900], fontSize: 16, fontWeight: '700' }}>
      {children}
    </Typography>
  );
}
