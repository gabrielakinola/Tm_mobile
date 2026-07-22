import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Animated, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { radius, spacing } from '@/theme/tokens';
import { Typography } from './Typography';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning';

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  show: (options: ToastOptions) => void;
  dismiss: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 3000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const opacity = useMemo(() => new Animated.Value(0), []);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setToast(null);
    });
  }, [opacity]);

  const show = useCallback(
    (options: ToastOptions) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setToast(options);
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();

      timeoutRef.current = setTimeout(dismiss, options.duration ?? DEFAULT_DURATION);
    },
    [dismiss, opacity],
  );

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  const variantColors: Record<ToastVariant, string> = {
    default: theme.colors.foreground,
    success: theme.colors.success,
    error: theme.colors.destructive,
    warning: theme.colors.warning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            top: insets.top + spacing.lg,
            left: spacing.lg,
            right: spacing.lg,
            opacity,
            zIndex: 9999,
          }}
        >
          <Pressable
            onPress={dismiss}
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: radius.lg,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderLeftWidth: 4,
              borderLeftColor: variantColors[toast.variant ?? 'default'],
              ...theme.shadow.md,
            }}
          >
            <Typography variant="body">{toast.message}</Typography>
          </Pressable>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
