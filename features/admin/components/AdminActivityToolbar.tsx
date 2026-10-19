import { Pressable, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import {
  APP_CARD_BG,
  APP_DARK_MUTED,
  APP_DARK_SURFACE,
  APP_INPUT_BG,
} from '@/constants/app-surface';
import { SortChip } from '@/features/admin/components/AdminActivityEventCard';
import { DatePickerField } from '@/features/create-event/components/DatePickerField';
import type { AdminUserActivitySort } from '@/services/admin/admin.api';
import { colors, radius, spacing } from '@/theme/tokens';

type AdminActivityToolbarProps = {
  userLabel?: string;
  dateLabel: string;
  dateDisplay: string;
  onDateChange: (value: string) => void;
  onShiftDate: (amount: number) => void;
  canGoNext: boolean;
  sort: AdminUserActivitySort;
  onSortChange: (sort: AdminUserActivitySort) => void;
  sortHint: string;
  stats?: { label: string; value: string }[];
};

export function AdminActivityToolbar({
  userLabel,
  dateLabel,
  dateDisplay,
  onDateChange,
  onShiftDate,
  canGoNext,
  sort,
  onSortChange,
  sortHint,
  stats,
}: AdminActivityToolbarProps) {
  return (
    <View style={{ gap: spacing.md, marginBottom: spacing.sm }}>
      {userLabel ? (
        <Typography style={{ color: APP_DARK_MUTED, fontSize: 14, fontWeight: '600' }}>
          {userLabel}
        </Typography>
      ) : null}

      <View
        style={{
          backgroundColor: APP_CARD_BG,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: APP_DARK_SURFACE,
          padding: spacing.md,
          gap: spacing.md,
        }}
      >
        <View style={{ gap: spacing.xs }}>
          <Typography style={{ color: colors.white, fontSize: 13, fontWeight: '700' }}>
            {dateLabel}
          </Typography>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <DateStepButton
              label="Previous date"
              onPress={() => onShiftDate(-1)}
              icon={<ChevronLeft size={20} color={colors.white} strokeWidth={2.2} />}
            />
            <DatePickerField
              value={dateDisplay}
              onChange={onDateChange}
              placeholder="Select date"
              containerStyle={{ flex: 1 }}
            />
            <DateStepButton
              label="Next date"
              onPress={() => onShiftDate(1)}
              disabled={!canGoNext}
              icon={
                <ChevronRight
                  size={20}
                  color={canGoNext ? colors.white : colors.neutral[600]}
                  strokeWidth={2.2}
                />
              }
            />
          </View>
        </View>

        <View style={{ gap: spacing.xs }}>
          <Typography style={{ color: colors.white, fontSize: 13, fontWeight: '700' }}>
            Sort
          </Typography>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <SortChip
              label="Most first"
              selected={sort === 'most'}
              onPress={() => onSortChange('most')}
            />
            <SortChip
              label="Least first"
              selected={sort === 'least'}
              onPress={() => onSortChange('least')}
            />
          </View>
          <Typography style={{ color: APP_DARK_MUTED, fontSize: 12 }}>{sortHint}</Typography>
        </View>
      </View>

      {stats && stats.length > 0 ? (
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {stats.map((stat) => (
            <SummaryStat key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function DateStepButton({
  label,
  onPress,
  icon,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={{
        width: 42,
        height: 42,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: APP_DARK_SURFACE,
        backgroundColor: APP_INPUT_BG,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {icon}
    </Pressable>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: APP_CARD_BG,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: APP_DARK_SURFACE,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        gap: 2,
      }}
    >
      <Typography style={{ color: APP_DARK_MUTED, fontSize: 12, fontWeight: '600' }}>
        {label}
      </Typography>
      <Typography style={{ color: colors.white, fontSize: 22, fontWeight: '800' }}>
        {value}
      </Typography>
    </View>
  );
}
