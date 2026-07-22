import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, View, type ViewStyle } from 'react-native';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import {
  addMonths,
  formatEventDateDisplay,
  formatMonthYear,
  getCalendarCells,
  isSameCalendarDay,
  parseEventDateValue,
  startOfMonth,
} from '@/features/create-event/date-utils';
import { colors, radius, spacing } from '@/theme/tokens';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export interface DatePickerFieldProps {
  label?: string;
  required?: boolean;
  value: string;
  onChange: (displayValue: string) => void;
  placeholder?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function DatePickerField({
  label,
  required,
  value,
  onChange,
  placeholder = 'Select date',
  error,
  containerStyle,
}: DatePickerFieldProps) {
  const hasError = Boolean(error);
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => parseEventDateValue(value), [value]);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selectedDate ?? new Date()));
  const [draftDate, setDraftDate] = useState<Date | null>(selectedDate);

  useEffect(() => {
    if (!open) return;
    const base = selectedDate ?? new Date();
    setVisibleMonth(startOfMonth(base));
    setDraftDate(selectedDate);
  }, [open, selectedDate]);

  const cells = useMemo(() => getCalendarCells(visibleMonth), [visibleMonth]);
  const today = useMemo(() => new Date(), []);

  const handleConfirm = () => {
    if (!draftDate) return;
    onChange(formatEventDateDisplay(draftDate));
    setOpen(false);
  };

  return (
    <View style={[{ gap: spacing.xs }, containerStyle]}>
      {label ? (
        <Typography style={{ color: colors.neutral[800], fontSize: 14, fontWeight: '600' }}>
          {label}
          {required ? (
            <Typography style={{ color: colors.error[500], fontSize: 14, fontWeight: '600' }}>
              {' '}
              *
            </Typography>
          ) : null}
        </Typography>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label ?? 'Select date'}
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
        <Calendar size={16} color={colors.neutral[500]} />
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
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.45)',
            justifyContent: 'center',
            padding: spacing.lg,
          }}
          onPress={() => setOpen(false)}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
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
                  Select date
                </Typography>
                <Typography
                  style={{ color: colors.neutral[950], fontSize: 20, fontWeight: '700' }}
                  numberOfLines={1}
                >
                  {draftDate ? formatEventDateDisplay(draftDate) : 'Pick a day'}
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

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Previous month"
                onPress={() => setVisibleMonth((current) => addMonths(current, -1))}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.neutral[100],
                }}
              >
                <ChevronLeft size={18} color={colors.neutral[800]} />
              </Pressable>
              <Typography style={{ color: colors.neutral[900], fontSize: 16, fontWeight: '700' }}>
                {formatMonthYear(visibleMonth)}
              </Typography>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Next month"
                onPress={() => setVisibleMonth((current) => addMonths(current, 1))}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.neutral[100],
                }}
              >
                <ChevronRight size={18} color={colors.neutral[800]} />
              </Pressable>
            </View>

            <View style={{ flexDirection: 'row' }}>
              {WEEKDAYS.map((day) => (
                <View key={day} style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}>
                  <Typography
                    style={{
                      color: colors.neutral[400],
                      fontSize: 12,
                      fontWeight: '700',
                    }}
                  >
                    {day}
                  </Typography>
                </View>
              ))}
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {cells.map((cell, index) => {
                if (!cell) {
                  return (
                    <View key={`empty-${index}`} style={{ width: `${100 / 7}%`, aspectRatio: 1 }} />
                  );
                }

                const selected = draftDate ? isSameCalendarDay(cell, draftDate) : false;
                const isToday = isSameCalendarDay(cell, today);

                return (
                  <Pressable
                    key={cell.toISOString()}
                    accessibilityRole="button"
                    onPress={() => setDraftDate(cell)}
                    style={{
                      width: `${100 / 7}%`,
                      aspectRatio: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 2,
                    }}
                  >
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                        maxWidth: 40,
                        maxHeight: 40,
                        borderRadius: radius.full,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: selected ? colors.pulse[600] : 'transparent',
                        borderWidth: !selected && isToday ? 1.5 : 0,
                        borderColor: colors.pulse[300],
                      }}
                    >
                      <Typography
                        style={{
                          color: selected
                            ? colors.white
                            : isToday
                              ? colors.pulse[700]
                              : colors.neutral[900],
                          fontSize: 14,
                          fontWeight: selected || isToday ? '700' : '500',
                        }}
                      >
                        {cell.getDate()}
                      </Typography>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  const now = new Date();
                  setVisibleMonth(startOfMonth(now));
                  setDraftDate(now);
                }}
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
                  Today
                </Typography>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={!draftDate}
                onPress={handleConfirm}
                style={{
                  flex: 1.4,
                  minHeight: 44,
                  borderRadius: radius.md,
                  backgroundColor: colors.pulse[600],
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: draftDate ? 1 : 0.5,
                }}
              >
                <Typography style={{ color: colors.white, fontSize: 14, fontWeight: '700' }}>
                  Confirm
                </Typography>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
