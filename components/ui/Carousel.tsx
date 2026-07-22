import { useCallback, useState } from 'react';
import { Dimensions, View, type ViewProps } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { cn } from '@/lib/cn';
import { useTheme } from '@/theme';
import { radius, spacing } from '@/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface CarouselProps<T> extends ViewProps {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemWidth?: number;
  gap?: number;
  showPagination?: boolean;
  className?: string;
}

export function Carousel<T>({
  data,
  renderItem,
  itemWidth = SCREEN_WIDTH - spacing.lg * 2,
  gap = spacing.md,
  showPagination = true,
  className,
  style,
  ...props
}: CarouselProps<T>) {
  const { theme } = useTheme();
  const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const snapInterval = itemWidth + gap;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleMomentumScrollEnd = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / snapInterval);
      setActiveIndex(Math.max(0, Math.min(index, data.length - 1)));
    },
    [snapInterval, data.length],
  );

  return (
    <View className={cn(className)} style={style} {...props}>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapInterval}
        decelerationRate="fast"
        contentContainerStyle={{ gap, paddingHorizontal: spacing.lg }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {data.map((item, index) => (
          <View key={index} style={{ width: itemWidth }}>
            {renderItem(item, index)}
          </View>
        ))}
      </Animated.ScrollView>
      {showPagination && data.length > 1 ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: spacing.xs,
            marginTop: spacing.md,
          }}
        >
          {data.map((_, index) => (
            <View
              key={index}
              style={{
                width: index === activeIndex ? 16 : 6,
                height: 6,
                borderRadius: radius.full,
                backgroundColor: index === activeIndex ? theme.colors.primary : theme.colors.muted,
              }}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
