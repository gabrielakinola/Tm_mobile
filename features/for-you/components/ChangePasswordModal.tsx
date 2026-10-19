import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Modal as RNModal,
  TextInput,
  View,
} from 'react-native';
import { isAxiosError } from 'axios';
import { Eye, EyeOff, LockKeyhole, X } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import {
  APP_CARD_BG,
  APP_DARK_MUTED,
  APP_DARK_SURFACE,
  APP_INPUT_BG,
} from '@/constants/app-surface';
import { PasswordStrengthIndicator } from '@/features/auth/components/PasswordStrengthIndicator';
import { getNewPasswordValidationError } from '@/features/auth/utils/password-strength';
import { changePasswordRequest } from '@/services/auth/auth.api';
import { colors, radius, spacing } from '@/theme/tokens';

export interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type PasswordField = 'current' | 'new' | 'confirm';

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message) && typeof message[0] === 'string') return message[0];
  }

  return 'Unable to update your password. Please try again.';
}

export function ChangePasswordModal({ visible, onClose, onSuccess }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visibleFields, setVisibleFields] = useState<Record<PasswordField, boolean>>({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    if (!saving) onClose();
  };

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Complete all password fields to continue.');
      return;
    }

    const passwordValidationError = getNewPasswordValidationError(newPassword);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await changePasswordRequest({ currentPassword, newPassword });
      onSuccess();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const renderPasswordField = (
    field: PasswordField,
    label: string,
    value: string,
    onChangeText: (nextValue: string) => void,
  ) => {
    const isVisible = visibleFields[field];

    return (
      <View style={styles.field}>
        <Typography style={styles.fieldLabel}>{label}</Typography>
        <View style={styles.inputWrap}>
          <LockKeyhole size={17} color={APP_DARK_MUTED} />
          <TextInput
            value={value}
            onChangeText={(nextValue) => {
              setError(null);
              onChangeText(nextValue);
            }}
            secureTextEntry={!isVisible}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            textContentType={field === 'current' ? 'password' : 'newPassword'}
            autoComplete={field === 'current' ? 'password' : 'new-password'}
            importantForAutofill="yes"
            editable={!saving}
            style={styles.input}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`
            }
            hitSlop={8}
            disabled={saving}
            onPress={() =>
              setVisibleFields((current) => ({ ...current, [field]: !current[field] }))
            }
          >
            {isVisible ? (
              <EyeOff size={19} color={APP_DARK_MUTED} />
            ) : (
              <Eye size={19} color={APP_DARK_MUTED} />
            )}
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <Pressable style={styles.backdropPressable} onPress={handleClose}>
          <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
            <View style={styles.header}>
              <View style={styles.iconWrap}>
                <LockKeyhole size={24} color={colors.pulse[700]} strokeWidth={2.2} />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={8}
                disabled={saving}
                onPress={handleClose}
                style={styles.closeButton}
              >
                <X size={18} color={colors.white} strokeWidth={2.2} />
              </Pressable>
            </View>

            <View style={styles.copy}>
              <Typography style={styles.title}>Change password</Typography>
              <Typography style={styles.message}>
                Use a strong password with at least 8 characters, including uppercase, lowercase, a
                number, and a special character.
              </Typography>
            </View>

            <View style={styles.fields}>
              {renderPasswordField(
                'current',
                'Current password',
                currentPassword,
                setCurrentPassword,
              )}
              {renderPasswordField('new', 'New password', newPassword, setNewPassword)}
              <PasswordStrengthIndicator password={newPassword} />
              {renderPasswordField(
                'confirm',
                'Confirm new password',
                confirmPassword,
                setConfirmPassword,
              )}
            </View>

            {error ? <Typography style={styles.error}>{error}</Typography> : null}

            <Pressable
              accessibilityRole="button"
              disabled={saving}
              onPress={() => void handleSave()}
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            >
              {saving ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Typography style={styles.saveLabel}>Save password</Typography>
              )}
            </Pressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

const styles = {
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  backdropPressable: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: APP_CARD_BG,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_DARK_SURFACE,
    borderWidth: 1,
    borderColor: colors.pulse[600],
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_DARK_SURFACE,
  },
  copy: {
    gap: spacing.xs,
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  message: {
    color: APP_DARK_MUTED,
    fontSize: 14,
    lineHeight: 20,
  },
  fields: {
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  inputWrap: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: APP_DARK_SURFACE,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: APP_INPUT_BG,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    paddingVertical: spacing.sm,
  },
  error: {
    color: colors.error[500],
    fontSize: 13,
    lineHeight: 18,
  },
  saveButton: {
    minHeight: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pulse[600],
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
} as const;
