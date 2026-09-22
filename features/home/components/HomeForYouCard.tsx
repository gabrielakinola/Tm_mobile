import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { EllipsisVertical } from 'lucide-react-native';
import { LocationPinIcon } from '@/components/icons/DiscoverLocationPinIcon';
import { Typography } from '@/components/ui';
import { APP_CARD_BG } from '@/constants/app-surface';
import type { HomeForYouEvent } from '@/mocks/home-feed';
import { colors, spacing } from '@/theme/tokens';

const CARD_WIDTH = 300;
const IMAGE_HEIGHT = 180;

export function HomeForYouCard({
  event,
  showLocationPin,
}: {
  event: HomeForYouEvent;
  showLocationPin: boolean;
}) {
  return (
    <View
      style={{
        width: CARD_WIDTH,
        marginRight: spacing.sm,
        backgroundColor: APP_CARD_BG,
        borderWidth: 1,
        borderColor: '#343434',
      }}
    >
      <View style={{ height: IMAGE_HEIGHT, overflow: 'hidden' }}>
        <Image
          source={{ uri: event.imageUrl }}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#1C1C1E',
          }}
          contentFit="cover"
          transition={200}
        />
        <View
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            maxWidth: '95%',
            alignSelf: 'flex-start',
            justifyContent: 'center',
            minHeight: 39,
            paddingHorizontal: 10,
            paddingVertical: 8,
            backgroundColor: APP_CARD_BG,
          }}
        >
          <Typography
            style={{
              color: colors.white,
              fontSize: 16,
              lineHeight: 19,
              fontWeight: '900',
              letterSpacing: 0.2,
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {event.title.toUpperCase()}
          </Typography>
        </View>
      </View>

      <View
        style={{
          minHeight: 62,
          paddingLeft: 12,
          paddingRight: 7,
          paddingVertical: 7,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 39,
            height: 43,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            style={{
              color: colors.white,
              fontSize: 10,
              lineHeight: 15,
              fontWeight: '800',
              textTransform: 'uppercase',
            }}
          >
            {event.month}
          </Typography>
          <View>
            <Typography
              style={{
                color: colors.white,
                fontSize: 19,
                lineHeight: 20,
                fontWeight: '800',
              }}
            >
              {event.day}
            </Typography>
            <View
              style={{
                width: 29,
                height: 2,
                marginTop: 3,
                backgroundColor: event.accentColor ?? '#A84A52',
              }}
            />
          </View>
        </View>

        <View
          style={{
            flex: 1,
            minWidth: 0,
            height: 43,
            paddingLeft: 9,
            justifyContent: 'space-between',
          }}
        >
          <Typography
            style={{
              color: '#D0D0D0',
              fontSize: 13,
              lineHeight: 15,
            }}
            numberOfLines={1}
          >
            {event.weekdayTime}
          </Typography>
          <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 22, gap: 7 }}>
            {showLocationPin ? <LocationPinIcon size={14} /> : null}
            <Typography
              style={{
                flex: 1,
                color: colors.white,
                fontSize: 13,
                lineHeight: 17,
                fontWeight: '700',
              }}
              numberOfLines={1}
            >
              {event.venue}
            </Typography>
          </View>
        </View>

        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="More options"
          style={{
            width: 25,
            height: 42,
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <EllipsisVertical size={21} color={colors.white} strokeWidth={3} />
        </Pressable>
      </View>
    </View>
  );
}

export const HOME_FOR_YOU_CARD_WIDTH = CARD_WIDTH;
