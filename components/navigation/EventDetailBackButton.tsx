import { Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '@/theme/tokens';

export interface EventDetailBackButtonProps {
  onPress: () => void;
}

export function EventDetailBackButton({ onPress }: EventDetailBackButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={onPress}
      hitSlop={8}
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ArrowLeft size={18} color={colors.white} strokeWidth={2.2} />
    </Pressable>
  );
}
