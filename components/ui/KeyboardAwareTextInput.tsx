import { TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { useKeyboardAwareInputFocus } from '@/components/ui/KeyboardAwareScrollView';

export interface KeyboardAwareTextInputProps extends TextInputProps {
  /** Optional outer wrapper style (receives the measure target for scrolling). */
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Drop-in TextInput that scrolls itself above the keyboard when nested in
 * a KeyboardAwareScrollView.
 */
export function KeyboardAwareTextInput({
  containerStyle,
  onFocus,
  style,
  ...props
}: KeyboardAwareTextInputProps) {
  const { containerRef, onFocus: handleFocus } = useKeyboardAwareInputFocus(onFocus);

  return (
    <View ref={containerRef} collapsable={false} style={containerStyle}>
      <TextInput onFocus={handleFocus} style={style} {...props} />
    </View>
  );
}
