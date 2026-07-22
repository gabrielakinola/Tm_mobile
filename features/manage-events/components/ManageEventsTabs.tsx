import { Pressable, View } from 'react-native';
import { Typography } from '@/components/ui';
import type { EventListStatus } from '@/services/events/types';
import { colors, radius, spacing } from '@/theme/tokens';

export interface ManageEventsTabsProps {
  activeTab: EventListStatus;
  allCount: number;
  upcomingCount: number;
  pastCount: number;
  onChange: (tab: EventListStatus) => void;
}

const TABS: { key: EventListStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
];

export function ManageEventsTabs({
  activeTab,
  allCount,
  upcomingCount,
  pastCount,
  onChange,
}: ManageEventsTabsProps) {
  const counts: Record<EventListStatus, number> = {
    all: allCount,
    upcoming: upcomingCount,
    past: pastCount,
  };

  return (
    <View style={{ flexDirection: 'row', gap: spacing.sm }}>
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
              minHeight: 36,
              borderRadius: radius.full,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: active ? colors.pulse[600] : colors.neutral[100],
              borderWidth: 1,
              borderColor: active ? colors.pulse[600] : colors.neutral[200],
              paddingHorizontal: spacing.sm,
            }}
          >
            <Typography
              style={{
                color: active ? colors.white : colors.neutral[700],
                fontSize: 12,
                fontWeight: '700',
              }}
              numberOfLines={1}
            >
              {tab.label} ({counts[tab.key]})
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}
