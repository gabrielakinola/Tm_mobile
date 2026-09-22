import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight, EllipsisVertical } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import type { HomeJustAnnouncedEvent } from '@/mocks/home-feed';
import { colors, spacing } from '@/theme/tokens';

const CARD_BG = '#111111';
const DETAILS_BG = '#242424';
const DIVIDER = '#2A2A2A';
const META_COLOR = '#E6E6E6';

export function HomeJustAnnouncedCard({
  event,
  width,
}: {
  event: HomeJustAnnouncedEvent;
  width: number;
}) {
  const [titleWidth, setTitleWidth] = useState(0);

  return (
    <View
      style={{
        width,
        height: width,
        marginRight: spacing.md,
        backgroundColor: CARD_BG,
        overflow: 'hidden',
      }}
    >
      <View style={{ flex: 1 }}>
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
            minHeight: 34,
            justifyContent: 'center',
            paddingHorizontal: 14,
            paddingVertical: 8,
            backgroundColor: DETAILS_BG,
          }}
        >
          <Typography
            style={{
              color: colors.white,
              fontSize: 15,
              lineHeight: 19,
              fontWeight: '400',
            }}
          >
            {event.dateLabel}
          </Typography>
        </View>
      </View>

      <View
        style={{
          paddingLeft: 14,
          paddingTop: 10,
          paddingBottom: 12,
          backgroundColor: DETAILS_BG,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
            <Typography
              numberOfLines={1}
              onLayout={(eventLayout) => {
                const nextWidth = Math.ceil(eventLayout.nativeEvent.layout.width);
                if (nextWidth !== titleWidth) {
                  setTitleWidth(nextWidth);
                }
              }}
              style={{
                alignSelf: 'flex-start',
                color: colors.white,
                fontSize: 20,
                lineHeight: 24,
                fontWeight: '800',
              }}
            >
              {event.title}
            </Typography>
            <View
              style={{
                width: titleWidth,
                height: 3,
                marginTop: 5,
                backgroundColor: colors.white,
              }}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`More options for ${event.title}`}
            hitSlop={8}
            style={{
              width: 40,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EllipsisVertical size={22} color={colors.white} strokeWidth={2.6} />
          </Pressable>
        </View>

        <Typography
          numberOfLines={1}
          style={{
            color: META_COLOR,
            fontSize: 15,
            lineHeight: 20,
            fontWeight: '400',
            marginTop: 11,
            paddingRight: 12,
          }}
        >
          {event.time} • {event.location}
        </Typography>
      </View>

      <View
        style={{
          height: 52,
          borderTopWidth: 1,
          borderTopColor: DIVIDER,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Typography
          style={{
            flex: 1,
            color: colors.white,
            fontSize: 16,
            lineHeight: 20,
            fontWeight: '400',
            paddingHorizontal: 14,
          }}
        >
          View Presales
        </Typography>
        <View
          style={{
            width: 52,
            height: '100%',
            borderLeftWidth: 1,
            borderLeftColor: DIVIDER,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronRight size={24} color={colors.white} strokeWidth={1.8} />
        </View>
      </View>
    </View>
  );
}
