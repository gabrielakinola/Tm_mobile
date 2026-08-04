import { useCallback, useEffect, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native';
import { Typography } from '@/components/ui';
import { colors, radius } from '@/theme/tokens';

const ITEM_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;
const PADDING_ROWS = Math.floor(VISIBLE_ROWS / 2);

export interface TimePickerWheelColumnProps<T extends string | number> {
  items: readonly T[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  formatItem?: (item: T) => string;
}

export function TimePickerWheelColumn<T extends string | number>({
  items,
  selectedIndex,
  onSelectIndex,
  formatItem,
}: TimePickerWheelColumnProps<T>) {
  const scrollRef = useRef<ScrollView>(null);
  const lastSyncedIndexRef = useRef<number | null>(null);

  const scrollToIndex = useCallback((index: number, animated: boolean) => {
    scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated });
  }, []);

  useEffect(() => {
    if (lastSyncedIndexRef.current === selectedIndex) {
      return;
    }

    scrollToIndex(selectedIndex, false);
    lastSyncedIndexRef.current = selectedIndex;
  }, [scrollToIndex, selectedIndex]);

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.max(0, Math.min(items.length - 1, Math.round(offsetY / ITEM_HEIGHT)));

    lastSyncedIndexRef.current = index;
    if (index !== selectedIndex) {
      onSelectIndex(index);
    }
  };

  const renderItem = (item: T, index: number) => {
    const label = formatItem ? formatItem(item) : String(item);
    const selected = index === selectedIndex;

    return (
      <View
        style={{
          height: ITEM_HEIGHT,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          style={{
            color: selected ? colors.neutral[950] : colors.neutral[400],
            fontSize: selected ? 20 : 18,
            fontWeight: selected ? '700' : '500',
          }}
        >
          {label}
        </Typography>
      </View>
    );
  };

  return (
    <View style={{ height: WHEEL_HEIGHT, flex: 1 }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 4,
          right: 4,
          top: PADDING_ROWS * ITEM_HEIGHT,
          height: ITEM_HEIGHT,
          borderRadius: radius.md,
          backgroundColor: colors.neutral[100],
          borderWidth: 1,
          borderColor: colors.neutral[200],
          zIndex: 1,
        }}
      />
      <ScrollView
        ref={scrollRef}
        style={{ zIndex: 2 }}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        nestedScrollEnabled
        bounces={false}
        overScrollMode="never"
        disableIntervalMomentum
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollEndDrag={handleMomentumScrollEnd}
        contentContainerStyle={{
          paddingVertical: PADDING_ROWS * ITEM_HEIGHT,
        }}
      >
        {items.map((item, index) => (
          <View key={`${String(item)}-${index}`}>{renderItem(item, index)}</View>
        ))}
      </ScrollView>
    </View>
  );
}
