import { Pressable, View } from 'react-native';
import { Layers } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import type { TicketLayout } from '@/features/settings/types';
import { colors, radius, spacing } from '@/theme/tokens';

interface LayoutPickerProps {
  value: TicketLayout;
  onChange: (value: TicketLayout) => void;
}

const LAYOUT_OPTIONS: { value: TicketLayout; title: string; subtitle: string }[] = [
  { value: 'american', title: 'Layout 1', subtitle: 'American' },
  { value: 'european', title: 'Layout 2', subtitle: 'European' },
];

export function LayoutPicker({ value, onChange }: LayoutPickerProps) {
  return (
    <View style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <Layers size={16} color={colors.neutral[600]} />
        <Typography style={{ color: colors.neutral[800], fontSize: 14, fontWeight: '600' }}>
          Ticket experience style
        </Typography>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {LAYOUT_OPTIONS.map((option) => {
          const active = value === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onChange(option.value)}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: active ? colors.pulse[500] : colors.neutral[300],
                borderRadius: radius.md,
                backgroundColor: active ? colors.pulse[50] : colors.neutral[0],
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.sm,
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography
                style={{
                  color: active ? colors.pulse[700] : colors.neutral[900],
                  fontSize: 14,
                  fontWeight: '700',
                }}
              >
                {option.title}
              </Typography>
              <Typography style={{ color: colors.neutral[500], fontSize: 12 }}>
                {option.subtitle}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
