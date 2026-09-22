import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { EllipsisVertical } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import type { HomeLastMinuteEvent } from '@/mocks/home-feed';
import { colors, spacing } from '@/theme/tokens';

export function HomeLastMinuteCard({
  event,
  width,
}: {
  event: HomeLastMinuteEvent;
  width: number;
}) {
  const imageHeight = Math.round(width * 0.58);

  return (
    <View
      style={{
        width,
        marginRight: spacing.md,
        borderWidth: 1,
        borderColor: '#2D2D2D',
        backgroundColor: '#111111',
      }}
    >
      <View style={{ height: imageHeight }}>
        <Image
          source={{ uri: event.imageUrl }}
          style={{ width: '100%', height: '100%', backgroundColor: '#1C1C1E' }}
          contentFit="cover"
        />
        <View
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            minHeight: 32,
            justifyContent: 'center',
            paddingHorizontal: 10,
            backgroundColor: '#111111',
          }}
        >
          <Typography style={{ color: colors.white, fontSize: 13, lineHeight: 17 }}>
            {event.dateLabel}
          </Typography>
        </View>
      </View>

      <View style={{ minHeight: 78, paddingLeft: 10, paddingVertical: 8 }}>
        <View style={{ minHeight: 24, flexDirection: 'row', alignItems: 'center' }}>
          <Typography
            numberOfLines={1}
            style={{
              flex: 1,
              color: colors.white,
              fontSize: 14,
              lineHeight: 18,
              fontWeight: '800',
            }}
          >
            {event.title}
          </Typography>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`More options for ${event.title}`}
            hitSlop={8}
            style={{
              width: 34,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EllipsisVertical size={20} color={colors.white} strokeWidth={2.8} />
          </Pressable>
        </View>

        <Typography
          numberOfLines={1}
          style={{
            color: '#BDBDBD',
            fontSize: 12,
            lineHeight: 16,
            marginTop: 7,
            paddingRight: 8,
          }}
        >
          {event.time} · {event.venue}
        </Typography>
      </View>
    </View>
  );
}
