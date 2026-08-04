import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, View, type ViewStyle } from 'react-native';
import { Clock, X } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { TimePickerWheelColumn } from '@/features/create-event/components/TimePickerWheelColumn';
import {
  defaultEventTime,
  formatEventTimeDisplay,
  HOUR12_OPTIONS,
  MERIDIEM_OPTIONS,
  MINUTE_OPTIONS,
  parsedTimeFromDate,
  parseEventTimeValue,
  type ParsedEventTime,
} from '@/features/create-event/time-utils';
import { colors, radius, spacing } from '@/theme/tokens';

export interface TimePickerFieldProps {
  value: string;
  onChange: (displayValue: string) => void;
  placeholder?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

function indexForDraft(draft: ParsedEventTime) {
  return {
    hourIndex: Math.max(0, HOUR12_OPTIONS.indexOf(draft.hour12)),
    minuteIndex: Math.max(0, MINUTE_OPTIONS.indexOf(draft.minutes)),
    meridiemIndex: draft.meridiem === 'PM' ? 1 : 0,
  };
}

function draftFromIndices(
  hourIndex: number,
  minuteIndex: number,
  meridiemIndex: number,
): ParsedEventTime {
  return {
    hour12: HOUR12_OPTIONS[hourIndex] ?? defaultEventTime().hour12,
    minutes: MINUTE_OPTIONS[minuteIndex] ?? 0,
    meridiem: MERIDIEM_OPTIONS[meridiemIndex] ?? 'AM',
  };
}

export function TimePickerField({
  value,
  onChange,
  placeholder = 'Select time',
  error,
  containerStyle,
}: TimePickerFieldProps) {
  const hasError = Boolean(error);
  const [open, setOpen] = useState(false);
  const parsedValue = useMemo(() => parseEventTimeValue(value), [value]);
  const [draft, setDraft] = useState<ParsedEventTime>(() => parsedValue ?? defaultEventTime());

  useEffect(() => {
    if (!open) return;
    setDraft(parsedValue ?? defaultEventTime());
  }, [open, parsedValue]);

  const { hourIndex, minuteIndex, meridiemIndex } = indexForDraft(draft);

  const handleConfirm = () => {
    onChange(formatEventTimeDisplay(draft));
    setOpen(false);
  };

  return (
    <View style={[{ gap: spacing.xs }, containerStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Select time"
        onPress={() => setOpen(true)}
        style={{
          minHeight: 42,
          borderWidth: 1,
          borderColor: hasError ? colors.error[500] : colors.neutral[300],
          borderRadius: radius.md,
          backgroundColor: colors.neutral[0],
          paddingHorizontal: spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        }}
      >
        <Clock size={16} color={colors.neutral[500]} />
        <Typography
          style={{
            flex: 1,
            color: value ? colors.neutral[800] : colors.neutral[400],
            fontSize: 14,
            paddingVertical: 10,
          }}
          numberOfLines={1}
        >
          {value || placeholder}
        </Typography>
      </Pressable>

      {error ? (
        <Typography style={{ color: colors.error[500], fontSize: 12 }}>{error}</Typography>
      ) : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.45)',
            justifyContent: 'center',
            padding: spacing.lg,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
            onPress={() => setOpen(false)}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          />
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: radius.xl,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.neutral[200],
              gap: spacing.md,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ gap: 2, flex: 1 }}>
                <Typography style={{ color: colors.neutral[500], fontSize: 12, fontWeight: '600' }}>
                  Select time
                </Typography>
                <Typography
                  style={{ color: colors.neutral[950], fontSize: 20, fontWeight: '700' }}
                  numberOfLines={1}
                >
                  {formatEventTimeDisplay(draft)}
                </Typography>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={8}
                onPress={() => setOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: radius.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.neutral[100],
                }}
              >
                <X size={16} color={colors.neutral[700]} />
              </Pressable>
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.xs }}>
              <TimePickerWheelColumn
                items={HOUR12_OPTIONS}
                selectedIndex={hourIndex}
                onSelectIndex={(index) => {
                  setDraft((current) =>
                    draftFromIndices(
                      index,
                      indexForDraft(current).minuteIndex,
                      indexForDraft(current).meridiemIndex,
                    ),
                  );
                }}
              />
              <TimePickerWheelColumn
                items={MINUTE_OPTIONS}
                selectedIndex={minuteIndex}
                formatItem={(minute) => String(minute).padStart(2, '0')}
                onSelectIndex={(index) => {
                  setDraft((current) =>
                    draftFromIndices(
                      indexForDraft(current).hourIndex,
                      index,
                      indexForDraft(current).meridiemIndex,
                    ),
                  );
                }}
              />
              <TimePickerWheelColumn
                items={MERIDIEM_OPTIONS}
                selectedIndex={meridiemIndex}
                onSelectIndex={(index) => {
                  setDraft((current) =>
                    draftFromIndices(
                      indexForDraft(current).hourIndex,
                      indexForDraft(current).minuteIndex,
                      index,
                    ),
                  );
                }}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setDraft(parsedTimeFromDate(new Date()))}
                style={{
                  flex: 1,
                  minHeight: 44,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: colors.neutral[300],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography style={{ color: colors.neutral[800], fontSize: 14, fontWeight: '600' }}>
                  Now
                </Typography>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={handleConfirm}
                style={{
                  flex: 1.4,
                  minHeight: 44,
                  borderRadius: radius.md,
                  backgroundColor: colors.pulse[600],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography style={{ color: colors.white, fontSize: 14, fontWeight: '700' }}>
                  Confirm
                </Typography>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
