import { Pressable, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import { useKeyboardAwareInputFocus } from '@/components/ui/KeyboardAwareScrollView';
import {
  APP_DARK_BG,
  APP_DARK_MUTED,
  APP_DARK_SURFACE,
  APP_INPUT_BG,
} from '@/constants/app-surface';
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
      <Typography style={{ color: colors.white, fontSize: 14, fontWeight: '700' }}>
        Look up on Ticketmaster
      </Typography>
      <Typography style={{ color: APP_DARK_MUTED, fontSize: 12 }}>
        Search artist, event, or tour.
      </Typography>
      <View
        ref={containerRef}
        collapsable={false}
        style={{
          minHeight: 44,
          borderWidth: 1,
          borderColor: APP_DARK_SURFACE,
          borderRadius: radius.md,
          backgroundColor: APP_INPUT_BG,
          paddingHorizontal: spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        }}
      >
        <Search size={16} color={APP_DARK_MUTED} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          placeholder="Artist, tour, or event name"
          placeholderTextColor={APP_DARK_MUTED}
          style={{
            flex: 1,
            color: colors.white,
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
              backgroundColor: APP_DARK_BG,
            }}
          >
            <X size={12} color={APP_DARK_MUTED} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
