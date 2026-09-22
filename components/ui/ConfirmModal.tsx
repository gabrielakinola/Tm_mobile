import { ActivityIndicator, Pressable, Modal as RNModal, View } from 'react-native';
import { CircleCheck, Trash2, X } from 'lucide-react-native';
import { Typography } from '@/components/ui/Typography';
import {
  APP_CARD_BG,
  APP_DARK_BG,
  APP_DARK_MUTED,
  APP_DARK_SURFACE,
} from '@/constants/app-surface';
import { hapticLight } from '@/lib/haptics';
import { colors, radius, spacing } from '@/theme/tokens';

export type ConfirmModalVariant = 'destructive' | 'default';

export interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: ConfirmModalVariant;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  variant = 'destructive',
  loading = false,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  const isDestructive = variant === 'destructive';
  const resolvedConfirmLabel = confirmLabel ?? (isDestructive ? 'Delete' : 'Confirm');
  const handleClose = () => {
    if (loading) return;
    void hapticLight();
    onClose();
  };

  const handleConfirm = () => {
    if (loading) return;
    void hapticLight();
    onConfirm();
  };

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.55)',
          justifyContent: 'center',
          padding: spacing.lg,
        }}
        onPress={handleClose}
      >
        <Pressable
          style={{
            backgroundColor: APP_CARD_BG,
            borderRadius: radius.xl,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: APP_DARK_SURFACE,
            gap: spacing.lg,
          }}
          onPress={(event) => event.stopPropagation()}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: spacing.md,
            }}
          >
            <View style={{ flex: 1, gap: spacing.sm }}>
              {isDestructive ? (
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.md,
                    backgroundColor: 'rgba(239, 68, 68, 0.18)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trash2 size={22} color={colors.error[500]} strokeWidth={2} />
                </View>
              ) : (
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.md,
                    backgroundColor: APP_DARK_SURFACE,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CircleCheck size={22} color={colors.pulse[600]} strokeWidth={2} />
                </View>
              )}
              <Typography
                style={{
                  color: colors.white,
                  fontSize: 20,
                  fontWeight: '700',
                  lineHeight: 26,
                }}
              >
                {title}
              </Typography>
              <Typography style={{ color: APP_DARK_MUTED, fontSize: 14, lineHeight: 20 }}>
                {message}
              </Typography>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              disabled={loading}
              onPress={handleClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: radius.full,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: APP_DARK_BG,
                opacity: loading ? 0.6 : 1,
              }}
            >
              <X size={16} color={APP_DARK_MUTED} strokeWidth={2.2} />
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={handleClose}
              style={{
                flex: 1,
                minHeight: 48,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: APP_DARK_SURFACE,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '600' }}>
                Cancel
              </Typography>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={handleConfirm}
              style={{
                flex: 1,
                minHeight: 48,
                borderRadius: radius.lg,
                backgroundColor: isDestructive ? colors.error[500] : colors.pulse[600],
                alignItems: 'center',
                justifyContent: 'center',
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
                  {resolvedConfirmLabel}
                </Typography>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
