import { Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { hapticSelection } from '@/lib/haptics';
import { useTheme } from '@/theme';
import { Icon } from './Icon';
import { Input, type InputProps } from './Input';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  onClear?: () => void;
}

export function SearchInput({ value, onClear, onChangeText, ...props }: SearchInputProps) {
  const { theme } = useTheme();
  const showClear = Boolean(value && value.length > 0);

  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder="Search events, artists, venues..."
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="search"
      leftIcon={<Icon icon={Search} size="sm" color={theme.colors.mutedForeground} />}
      rightIcon={
        showClear ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={8}
            onPress={() => {
              void hapticSelection();
              onClear?.();
            }}
          >
            <Icon icon={X} size="sm" color={theme.colors.mutedForeground} />
          </Pressable>
        ) : undefined
      }
      {...props}
    />
  );
}
