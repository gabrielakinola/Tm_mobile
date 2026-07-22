import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewProps,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

const KEYBOARD_GAP = 12;

type ScrollToInputFn = (node: View | null) => void;

const ScrollToInputContext = createContext<ScrollToInputFn | undefined>(undefined);

export function useScrollInputIntoView() {
  return useContext(ScrollToInputContext);
}

/**
 * Attach to any input wrapper so focused fields scroll above the keyboard
 * when inside a KeyboardAwareScrollView.
 */
export function useKeyboardAwareInputFocus(onFocus?: TextInputProps['onFocus']) {
  const containerRef = useRef<View>(null);
  const scrollToInput = useScrollInputIntoView();

  const handleFocus = useCallback<NonNullable<TextInputProps['onFocus']>>(
    (event) => {
      onFocus?.(event);

      if (!scrollToInput) {
        return;
      }

      const delay = Platform.OS === 'ios' ? 50 : 0;
      setTimeout(() => scrollToInput(containerRef.current), delay);
    },
    [onFocus, scrollToInput],
  );

  return {
    containerRef: containerRef as RefObject<View>,
    onFocus: handleFocus,
  };
}

export interface KeyboardAwareScrollViewProps extends ScrollViewProps {
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const KeyboardAwareScrollView = forwardRef<ScrollView, KeyboardAwareScrollViewProps>(
  function KeyboardAwareScrollView({ children, contentContainerStyle, onScroll, ...props }, ref) {
    const scrollRef = useRef<ScrollView>(null);
    const scrollOffsetRef = useRef(0);
    const keyboardHeightRef = useRef(0);
    const pendingInputRef = useRef<View | null>(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useImperativeHandle(ref, () => scrollRef.current as ScrollView);

    const performScroll = useCallback((node: View | null) => {
      if (!node || !scrollRef.current) {
        return false;
      }

      const keyboardHeight = keyboardHeightRef.current;
      if (Platform.OS === 'ios' && keyboardHeight === 0) {
        return false;
      }

      node.measureInWindow((_x, y, _width, height) => {
        const windowHeight = Dimensions.get('window').height;
        const visibleBottom =
          Platform.OS === 'ios'
            ? windowHeight - keyboardHeight - KEYBOARD_GAP
            : windowHeight - KEYBOARD_GAP;
        const inputBottom = y + height;

        if (inputBottom <= visibleBottom) {
          return;
        }

        const nextOffset = scrollOffsetRef.current + (inputBottom - visibleBottom);
        scrollOffsetRef.current = nextOffset;

        scrollRef.current?.scrollTo({
          y: nextOffset,
          animated: true,
        });
      });

      return true;
    }, []);

    const scrollToInput = useCallback<ScrollToInputFn>(
      (node) => {
        pendingInputRef.current = node;

        if (performScroll(node)) {
          return;
        }

        const delay = Platform.OS === 'ios' ? 100 : 50;
        setTimeout(() => performScroll(node), delay);
      },
      [performScroll],
    );

    useEffect(() => {
      const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
      const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

      const showSub = Keyboard.addListener(showEvent, (event) => {
        keyboardHeightRef.current = event.endCoordinates.height;
        setKeyboardHeight(event.endCoordinates.height);
      });
      const hideSub = Keyboard.addListener(hideEvent, () => {
        keyboardHeightRef.current = 0;
        setKeyboardHeight(0);
        pendingInputRef.current = null;
      });

      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, []);

    useEffect(() => {
      if (keyboardHeight === 0 || !pendingInputRef.current) {
        return;
      }

      const delay = Platform.OS === 'ios' ? 100 : 50;
      const timeoutId = setTimeout(() => performScroll(pendingInputRef.current), delay);

      return () => clearTimeout(timeoutId);
    }, [keyboardHeight, performScroll]);

    const handleScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
        onScroll?.(event);
      },
      [onScroll],
    );

    const contextValue = useMemo(() => scrollToInput, [scrollToInput]);
    const flattenedContentStyle = StyleSheet.flatten(contentContainerStyle);
    const basePaddingBottom =
      typeof flattenedContentStyle?.paddingBottom === 'number'
        ? flattenedContentStyle.paddingBottom
        : 0;

    return (
      <ScrollToInputContext.Provider value={contextValue}>
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={[
            contentContainerStyle,
            keyboardHeight > 0 ? { paddingBottom: basePaddingBottom + keyboardHeight } : undefined,
          ]}
          {...props}
        >
          {children}
        </ScrollView>
      </ScrollToInputContext.Provider>
    );
  },
);
