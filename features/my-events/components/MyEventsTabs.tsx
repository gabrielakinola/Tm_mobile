import { Pressable, View } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { SCREEN_HEADER_BG } from '@/constants/screen-header';
import { colors, spacing } from '@/theme/tokens';

export type MyEventsTabKey = 'upcoming' | 'past';

export interface MyEventsTabsProps {
  activeTab: MyEventsTabKey;
  upcomingCount: number;
  pastCount: number;
  onChange: (tab: MyEventsTabKey) => void;
}

const TABS: { key: MyEventsTabKey; label: string }[] = [
  { key: 'upcoming', label: 'UPCOMING' },
  { key: 'past', label: 'PAST' },
];

export function MyEventsTabs({ activeTab, upcomingCount, pastCount, onChange }: MyEventsTabsProps) {
  const counts: Record<MyEventsTabKey, number> = {
    upcoming: upcomingCount,
    past: pastCount,
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: SCREEN_HEADER_BG,
      }}
    >
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
              borderBottomWidth: active ? 3 : 0,
              borderBottomColor: colors.white,
            }}
          >
            <Typography
              style={{
                color: active ? colors.white : colors.neutral[500],
                fontSize: 13,
                lineHeight: 18,
                fontWeight: '800',
                letterSpacing: 0.4,
              }}
            >
              {tab.label}({counts[tab.key]})
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}
