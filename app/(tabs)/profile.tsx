import { View } from 'react-native';
import { Header, Typography } from '@/components/ui';
import { useTheme } from '@/theme';
import { spacing } from '@/theme/tokens';

export default function ProfileScreen() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Profile" />
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}
      >
        <Typography variant="h2">Profile</Typography>
        <Typography variant="body" muted style={{ marginTop: spacing.sm }}>
          Coming soon.
        </Typography>
      </View>
    </View>
  );
}
