import { View } from 'react-native';
import { Image } from 'expo-image';
import { Typography } from '@/components/ui';
import type { HomeWeekendEvent } from '@/mocks/home-feed';
import { colors, radius, spacing } from '@/theme/tokens';

const CARD_WIDTH = 220;

export function HomeWeekendCard({ event }: { event: HomeWeekendEvent }) {
  return (
    <View style={{ width: CARD_WIDTH, marginRight: spacing.md }}>
      <Image
        source={{ uri: event.imageUrl }}
        style={{
          width: CARD_WIDTH,
          height: 124,
          borderRadius: radius.md,
          backgroundColor: '#1C1C1E',
        }}
        contentFit="cover"
      />
      <Typography
        style={{
          color: colors.white,
          fontSize: 14,
          lineHeight: 18,
          fontWeight: '700',
          marginTop: spacing.sm,
        }}
        numberOfLines={2}
      >
        {event.title}
      </Typography>
    </View>
  );
}
