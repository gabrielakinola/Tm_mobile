import { Pressable, View } from 'react-native';
import { Layers } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { APP_DARK_MUTED, APP_DARK_SURFACE, APP_INPUT_BG } from '@/constants/app-surface';
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
        <Layers size={16} color={APP_DARK_MUTED} />
        <Typography style={{ color: colors.white, fontSize: 14, fontWeight: '600' }}>
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
                borderColor: active ? colors.pulse[500] : APP_DARK_SURFACE,
                borderRadius: radius.md,
                backgroundColor: active ? APP_DARK_SURFACE : APP_INPUT_BG,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.sm,
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography
                style={{
                  color: active ? colors.pulse[300] : colors.white,
                  fontSize: 14,
                  fontWeight: '700',
                }}
              >
                {option.title}
              </Typography>
              <Typography style={{ color: APP_DARK_MUTED, fontSize: 12 }}>
                {option.subtitle}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
