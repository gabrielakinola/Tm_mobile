import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Typography } from '@/components/ui/Typography';
import type { DiscoverFeedEvent } from '@/mocks/discover-feed';
import { colors, radius, spacing } from '@/theme/tokens';

export interface DiscoverFeedCardProps {
  event: DiscoverFeedEvent;
  onPress?: () => void;
}

export function DiscoverFeedCard({ event, onPress }: DiscoverFeedCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.92 : 1,
        marginBottom: spacing['2xl'],
        width: '100%',
      })}
    >
      <Image
        source={{ uri: event.imageUrl }}
        style={{
          width: '100%',
          aspectRatio: 16 / 9,
          borderRadius: radius.md,
        }}
        contentFit="cover"
        transition={200}
      />
      <View style={{ marginTop: spacing.sm, gap: spacing.xs / 2 }}>
        <Typography
          style={{
            color: colors.neutral[500],
            fontSize: 12,
            lineHeight: 16,
            fontWeight: '700',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {event.category}
        </Typography>
        <Typography
          variant="h4"
          style={{
            color: colors.neutral[900],
            fontSize: 18,
            lineHeight: 24,
            fontWeight: '700',
          }}
          numberOfLines={2}
        >
          {event.title}
        </Typography>
      </View>
    </Pressable>
  );
}
