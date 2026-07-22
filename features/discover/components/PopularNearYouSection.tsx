import { useCallback, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Typography } from '@/components/ui/Typography';
import { MOCK_POPULAR_NEAR_YOU_CONCERTS, type PopularNearYouEvent } from '@/mocks/popular-near-you';
import { useTheme } from '@/theme';
import { colors, radius, spacing } from '@/theme/tokens';

const NAV_BUTTON_SIZE = 40;

export function PopularNearYouSection() {
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const horizontalPadding = spacing.lg;
  const slideWidth = screenWidth - horizontalPadding * 2;
  const data = MOCK_POPULAR_NEAR_YOU_CONCERTS;
  const activeEvent = data[activeIndex];

  const scrollToIndex = useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(index, data.length - 1));
      scrollRef.current?.scrollTo({ x: nextIndex * slideWidth, animated: true });
      setActiveIndex(nextIndex);
    },
    [data.length, slideWidth],
  );

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
      setActiveIndex(Math.max(0, Math.min(index, data.length - 1)));
    },
    [data.length, slideWidth],
  );

  return (
    <View
      style={{
        backgroundColor: colors.neutral[100],
        paddingHorizontal: horizontalPadding,
        paddingTop: spacing['2xl'],
        paddingBottom: spacing['2xl'],
      }}
    >
      <View
        style={{
          width: 48,
          height: 4,
          backgroundColor: colors.neutral[900],
          marginBottom: spacing.md,
        }}
      />

      <Typography
        style={{
          color: colors.neutral[900],
          fontSize: 14,
          lineHeight: 20,
          fontWeight: '700',
          letterSpacing: 1,
          textTransform: 'uppercase',
          marginBottom: spacing.lg,
        }}
      >
        Popular Near You
      </Typography>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.md,
        }}
      >
        <Typography
          style={{
            color: colors.neutral[900],
            fontSize: 18,
            lineHeight: 24,
            fontWeight: '700',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          Concerts
        </Typography>
        <Pressable accessibilityRole="button" hitSlop={8}>
          <Typography
            style={{
              color: theme.colors.primary,
              fontSize: 16,
              lineHeight: 22,
              fontWeight: '600',
            }}
          >
            See All
          </Typography>
        </Pressable>
      </View>

      <View style={{ position: 'relative' }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          style={{ width: slideWidth }}
        >
          {data.map((event) => (
            <CarouselSlide key={event.id} event={event} width={slideWidth} />
          ))}
        </ScrollView>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous event"
          disabled={activeIndex === 0}
          onPress={() => scrollToIndex(activeIndex - 1)}
          style={{
            position: 'absolute',
            left: spacing.sm,
            top: '50%',
            marginTop: -NAV_BUTTON_SIZE / 2,
            width: NAV_BUTTON_SIZE,
            height: NAV_BUTTON_SIZE,
            borderRadius: radius.full,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: activeIndex === 0 ? 0.4 : 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <ChevronLeft color={colors.neutral[700]} size={22} strokeWidth={2.5} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next event"
          disabled={activeIndex === data.length - 1}
          onPress={() => scrollToIndex(activeIndex + 1)}
          style={{
            position: 'absolute',
            right: spacing.sm,
            top: '50%',
            marginTop: -NAV_BUTTON_SIZE / 2,
            width: NAV_BUTTON_SIZE,
            height: NAV_BUTTON_SIZE,
            borderRadius: radius.md,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: activeIndex === data.length - 1 ? 0.4 : 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <ChevronRight color={colors.neutral[0]} size={22} strokeWidth={2.5} />
        </Pressable>
      </View>

      {activeEvent ? (
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
            {activeEvent.category}
          </Typography>
          <Typography
            variant="h4"
            style={{
              color: colors.neutral[900],
              fontSize: 18,
              lineHeight: 24,
              fontWeight: '700',
            }}
          >
            {activeEvent.title}
          </Typography>
        </View>
      ) : null}
    </View>
  );
}

interface CarouselSlideProps {
  event: PopularNearYouEvent;
  width: number;
}

function CarouselSlide({ event, width }: CarouselSlideProps) {
  return (
    <View style={{ width }}>
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
    </View>
  );
}
