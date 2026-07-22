import { Pressable, View } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { colors, spacing } from '@/theme/tokens';

export type EventDetailTab = 'tickets' | 'extras';

export interface EventDetailTabsProps {
  activeTab: EventDetailTab;
  onChange: (tab: EventDetailTab) => void;
}

const TABS: { key: EventDetailTab; label: string }[] = [
  { key: 'tickets', label: 'Tickets' },
  { key: 'extras', label: 'Extras' },
];

export function EventDetailTabs({ activeTab, onChange }: EventDetailTabsProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.neutral[0],
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[200],
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
              borderBottomColor: colors.neutral[900],
            }}
          >
            <Typography
              style={{
                color: active ? colors.neutral[900] : colors.neutral[500],
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
  );
}
