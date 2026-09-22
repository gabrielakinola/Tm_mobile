import { useState } from 'react';
import { Modal, Pressable, ScrollView, View, type ViewStyle } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Typography } from '@/components/ui/Typography';
import {
  APP_CARD_BG,
  APP_DARK_BG,
  APP_DARK_MUTED,
  APP_DARK_SURFACE,
  APP_INPUT_BG,
} from '@/constants/app-surface';
import { colors, radius, spacing } from '@/theme/tokens';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownMenuProps {
  label?: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  style?: ViewStyle;
}

export function DropdownMenu({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select',
  hint,
  style,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={[{ gap: spacing.xs }, style]}>
      {label ? (
        <Typography style={{ color: colors.white, fontSize: 14, fontWeight: '600' }}>
          {label}
        </Typography>
      ) : null}

      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={{
          minHeight: 42,
          borderWidth: 1,
          borderColor: APP_DARK_SURFACE,
          borderRadius: radius.md,
          backgroundColor: APP_INPUT_BG,
          paddingHorizontal: spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          style={{
            color: selected ? colors.white : APP_DARK_MUTED,
            fontSize: 14,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {selected?.label ?? placeholder}
        </Typography>
        <ChevronDown size={18} color={APP_DARK_MUTED} />
      </Pressable>

      {hint ? (
        <Typography style={{ color: APP_DARK_MUTED, fontSize: 12 }}>{hint}</Typography>
      ) : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.35)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setOpen(false)}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            style={{
              backgroundColor: APP_CARD_BG,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              paddingTop: spacing.md,
              paddingBottom: spacing['2xl'],
              maxHeight: '55%',
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: radius.full,
                backgroundColor: APP_DARK_SURFACE,
                alignSelf: 'center',
                marginBottom: spacing.md,
              }}
            />
            {label ? (
              <Typography
                style={{
                  color: colors.white,
                  fontSize: 16,
                  fontWeight: '700',
                  paddingHorizontal: spacing.lg,
                  marginBottom: spacing.sm,
                }}
              >
                {label}
              </Typography>
            ) : null}
            <ScrollView>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    style={{
                      paddingHorizontal: spacing.lg,
                      paddingVertical: spacing.md,
                      backgroundColor: isSelected ? APP_DARK_SURFACE : APP_INPUT_BG,
                      borderBottomWidth: 1,
                      borderBottomColor: APP_DARK_BG,
                    }}
                  >
                    <Typography
                      style={{
                        color: isSelected ? colors.pulse[600] : colors.white,
                        fontSize: 15,
                        fontWeight: isSelected ? '700' : '500',
                      }}
                    >
                      {option.label}
                    </Typography>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
