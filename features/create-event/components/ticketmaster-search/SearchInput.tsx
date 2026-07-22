import { Pressable, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { useKeyboardAwareInputFocus } from '@/components/ui/KeyboardAwareScrollView';
import { colors, radius, spacing } from '@/theme/tokens';

interface SearchInputProps {
  value: string;
  onChangeText: (value: string) => void;
  onClear: () => void;
}

export function SearchInput({ value, onChangeText, onClear }: SearchInputProps) {
  const { containerRef, onFocus } = useKeyboardAwareInputFocus();

  return (
    <View style={{ gap: spacing.xs }}>
      <Typography style={{ color: colors.neutral[800], fontSize: 14, fontWeight: '700' }}>
        Look up on Ticketmaster
      </Typography>
      <Typography style={{ color: colors.neutral[600], fontSize: 12 }}>
        Search artist, event, or tour.
      </Typography>
      <View
        ref={containerRef}
        collapsable={false}
        style={{
          minHeight: 44,
          borderWidth: 1,
          borderColor: colors.neutral[300],
          borderRadius: radius.md,
          backgroundColor: colors.neutral[0],
          paddingHorizontal: spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        }}
      >
        <Search size={16} color={colors.neutral[500]} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          placeholder="Artist, tour, or event name"
          placeholderTextColor={colors.neutral[400]}
          style={{
            flex: 1,
            color: colors.neutral[800],
            fontSize: 14,
            paddingVertical: 10,
          }}
        />
        {value ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear Ticketmaster search"
            onPress={onClear}
            hitSlop={8}
            style={{
              width: 20,
              height: 20,
              borderRadius: radius.full,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.neutral[100],
            }}
          >
            <X size={12} color={colors.neutral[600]} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
