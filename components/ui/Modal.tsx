import { Pressable, Modal as RNModal, View, type ModalProps as RNModalProps } from 'react-native';
import { X } from 'lucide-react-native';
import { cn } from '@/lib/cn';
import { hapticLight } from '@/lib/haptics';
import { useTheme } from '@/theme';
import { radius, spacing } from '@/theme/tokens';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { Typography } from './Typography';

export interface ModalProps extends RNModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showClose?: boolean;
  contentClassName?: string;
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  showClose = true,
  contentClassName,
  ...props
}: ModalProps) {
  const { theme } = useTheme();

  const handleClose = () => {
    void hapticLight();
    onClose();
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      {...props}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          padding: spacing.lg,
        }}
        onPress={handleClose}
      >
        <Pressable
          className={cn(contentClassName)}
          style={{
            backgroundColor: theme.colors.card,
            borderRadius: radius.xl,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            ...theme.shadow.lg,
          }}
          onPress={(event) => event.stopPropagation()}
        >
          {(title || showClose) && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: spacing.md,
              }}
            >
              {title ? <Typography variant="h3">{title}</Typography> : <View />}
              {showClose ? (
                <IconButton
                  icon={<Icon icon={X} size="sm" color={theme.colors.foreground} />}
                  variant="ghost"
                  size="sm"
                  onPress={handleClose}
                />
              ) : null}
            </View>
          )}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
