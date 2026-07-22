import { View } from 'react-native';
import { Header, Typography } from '@/components/ui';
import { useTheme } from '@/theme';
import { spacing } from '@/theme/tokens';

export default function SellScreen() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Sell" />
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}
      >
        <Typography variant="h2">Sell</Typography>
        <Typography variant="body" muted style={{ marginTop: spacing.sm }}>
          Coming soon.
        </Typography>
      </View>
    </View>
  );
}
