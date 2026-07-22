import { View } from 'react-native';
import { FlashList, type FlashListProps } from '@shopify/flash-list';
import { cn } from '@/lib/cn';
import { spacing } from '@/theme/tokens';

export interface HorizontalListProps<T> extends Omit<FlashListProps<T>, 'horizontal'> {
  itemWidth: number;
  gap?: number;
  containerClassName?: string;
}

export function HorizontalList<T>({
  itemWidth,
  gap = spacing.md,
  containerClassName,
  contentContainerStyle,
  ...props
}: HorizontalListProps<T>) {
  return (
    <View className={cn(containerClassName)} style={{ minHeight: 1 }}>
      <FlashList
        horizontal
        showsHorizontalScrollIndicator={false}
        overrideItemLayout={(layout) => {
          layout.span = itemWidth;
        }}
        ItemSeparatorComponent={() => <View style={{ width: gap }} />}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          ...(contentContainerStyle as object),
        }}
        {...props}
      />
    </View>
  );
}
