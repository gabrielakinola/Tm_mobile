import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Typography } from '@/components/ui/Typography';
import { APP_DARK_BG, APP_DARK_MUTED } from '@/constants/app-surface';
import { colors, spacing } from '@/theme/tokens';

export type EventDetailTab = 'tickets' | 'extras';
const EVENT_DETAIL_TAB_SIDE_MARGIN = 10;
const INDICATOR_INSET = 6;
const INDICATOR_SLOT_HEIGHT = 3;
const SLIDE_DURATION = 240;

export interface EventDetailTabsProps {
  activeTab: EventDetailTab;
  onChange: (tab: EventDetailTab) => void;
}

const TABS: { key: EventDetailTab; label: string }[] = [
  { key: 'tickets', label: 'Tickets' },
  { key: 'extras', label: 'Extras' },
];

export function EventDetailTabs({ activeTab, onChange }: EventDetailTabsProps) {
  const progress = useSharedValue(activeTab === 'extras' ? 1 : 0);
  const tabWidth = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(activeTab === 'extras' ? 1 : 0, {
      duration: SLIDE_DURATION,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [activeTab, progress]);

  const slidingStyle = useAnimatedStyle(() => ({
    width: Math.max(0, tabWidth.value - INDICATOR_INSET * 2),
    transform: [{ translateX: INDICATOR_INSET + progress.value * tabWidth.value }],
  }));

  return (
    <View
      style={{
        marginHorizontal: EVENT_DETAIL_TAB_SIDE_MARGIN,
        backgroundColor: APP_DARK_BG,
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => onChange(tab.key)}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingTop: spacing.md,
                paddingBottom: spacing.sm,
              }}
            >
              <Typography
                style={{
                  color: active ? colors.white : APP_DARK_MUTED,
                  fontSize: 16,
                  fontWeight: active ? '700' : '500',
                }}
              >
                {tab.label}
              </Typography>
            </Pressable>
          );
        })}
      </View>

      <View
        onLayout={(event) => {
          tabWidth.value = event.nativeEvent.layout.width / TABS.length;
        }}
        style={{ height: INDICATOR_SLOT_HEIGHT, justifyContent: 'flex-end' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          {TABS.map((tab) => (
            <View key={`${tab.key}-track`} style={{ flex: 1, paddingHorizontal: INDICATOR_INSET }}>
              <View style={{ height: 1, backgroundColor: APP_DARK_MUTED }} />
            </View>
          ))}
        </View>
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              left: 0,
              bottom: 0,
              height: INDICATOR_SLOT_HEIGHT,
              backgroundColor: colors.white,
            },
            slidingStyle,
          ]}
        />
      </View>
    </View>
  );
}
