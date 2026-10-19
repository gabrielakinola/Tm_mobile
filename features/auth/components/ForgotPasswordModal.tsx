import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Modal as RNModal,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { isAxiosError } from 'axios';
import { Eye, EyeOff, KeyRound, LockKeyhole, Mail, X } from 'lucide-react-native';
import { Typography } from '@/components/ui';
import {
  APP_CARD_BG,
  APP_DARK_MUTED,
  APP_DARK_SURFACE,
  APP_INPUT_BG,
} from '@/constants/app-surface';
import { PasswordStrengthIndicator } from '@/features/auth/components/PasswordStrengthIndicator';
import { getNewPasswordValidationError } from '@/features/auth/utils/password-strength';
import { requestPasswordResetRequest, resetPasswordRequest } from '@/services/auth/auth.api';
import { colors, radius, spacing } from '@/theme/tokens';

export interface ForgotPasswordModalProps {
  visible: boolean;
  initialEmail?: string;
  onClose: () => void;
  onSuccess: () => void;
}

type ResetPasswordField = 'new' | 'confirm';
type ForgotPasswordStep = 'email' | 'reset';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  if (local.length <= 2) {
    return `${local[0] ?? ''}***@${domain}`;
  }
  return `${local.slice(0, 2)}***@${domain}`;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message) && typeof message[0] === 'string') return message[0];
  }

  return fallback;
}

export function ForgotPasswordModal({
  visible,
  initialEmail = '',
  onClose,
  onSuccess,
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState<ForgotPasswordStep>('email');
  const [email, setEmail] = useState(initialEmail.trim());
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visibleFields, setVisibleFields] = useState<Record<ResetPasswordField, boolean>>({
    new: false,
    confirm: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (!submitting) onClose();
  };

  const handleSendCode = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Enter the email for your account.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setInfo(null);

    try {
      await requestPasswordResetRequest(trimmedEmail);
      setEmail(trimmedEmail);
      setStep('reset');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to send a reset code. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setSubmitting(true);
    setError(null);
    setInfo(null);

    try {
      await requestPasswordResetRequest(email);
      setInfo('A new code was sent to your email.');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to send a reset code. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      setError('Enter the code and complete both password fields.');
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit code sent to your email.');
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

    setSubmitting(true);
    setError(null);
    setInfo(null);

    try {
      await resetPasswordRequest({ email, otp, newPassword });
      onSuccess();
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to reset your password. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const renderPasswordField = (
    field: ResetPasswordField,
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
            textContentType="newPassword"
            autoComplete="new-password"
            importantForAutofill="yes"
            editable={!submitting}
            style={styles.input}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`
            }
            hitSlop={8}
            disabled={submitting}
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
                {step === 'email' ? (
                  <Mail size={24} color={colors.pulse[700]} strokeWidth={2.2} />
                ) : (
                  <KeyRound size={24} color={colors.pulse[700]} strokeWidth={2.2} />
                )}
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={8}
                disabled={submitting}
                onPress={handleClose}
                style={styles.closeButton}
              >
                <X size={18} color={colors.white} strokeWidth={2.2} />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {step === 'email' ? (
                <>
                  <View style={styles.copy}>
                    <Typography style={styles.title}>Forgot password</Typography>
                    <Typography style={styles.message}>
                      {
                        "Enter the email for your account and we'll send a one-time code to reset your password."
                      }
                    </Typography>
                  </View>

                  <View style={styles.field}>
                    <Typography style={styles.fieldLabel}>Email</Typography>
                    <View style={styles.inputWrap}>
                      <Mail size={17} color={APP_DARK_MUTED} />
                      <TextInput
                        value={email}
                        onChangeText={(nextValue) => {
                          setError(null);
                          setEmail(nextValue);
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        spellCheck={false}
                        keyboardType="email-address"
                        textContentType="username"
                        autoComplete="username"
                        importantForAutofill="yes"
                        editable={!submitting}
                        style={styles.input}
                      />
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.copy}>
                    <Typography style={styles.title}>Reset password</Typography>
                    <Typography style={styles.message}>
                      We sent a 6-digit code to {maskEmail(email)}. Enter it below and choose a
                      strong new password.
                    </Typography>
                  </View>

                  <View style={styles.fields}>
                    <View style={styles.field}>
                      <Typography style={styles.fieldLabel}>One-time code</Typography>
                      <View style={styles.inputWrap}>
                        <KeyRound size={17} color={APP_DARK_MUTED} />
                        <TextInput
                          value={otp}
                          onChangeText={(nextValue) => {
                            setError(null);
                            setOtp(nextValue.replace(/\D/g, '').slice(0, 6));
                          }}
                          keyboardType="number-pad"
                          textContentType="oneTimeCode"
                          autoComplete="one-time-code"
                          maxLength={6}
                          editable={!submitting}
                          style={[styles.input, styles.otpInput]}
                        />
                      </View>
                    </View>

                    {renderPasswordField('new', 'New password', newPassword, setNewPassword)}
                    <PasswordStrengthIndicator password={newPassword} />
                    {renderPasswordField(
                      'confirm',
                      'Confirm new password',
                      confirmPassword,
                      setConfirmPassword,
                    )}
                  </View>
                </>
              )}

              {info ? <Typography style={styles.info}>{info}</Typography> : null}
              {error ? <Typography style={styles.error}>{error}</Typography> : null}

              <Pressable
                accessibilityRole="button"
                disabled={submitting}
                onPress={() => void (step === 'email' ? handleSendCode() : handleResetPassword())}
                style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Typography style={styles.saveLabel}>
                    {step === 'email' ? 'Send code' : 'Reset password'}
                  </Typography>
                )}
              </Pressable>

              {step === 'reset' ? (
                <Pressable
                  accessibilityRole="button"
                  disabled={submitting}
                  onPress={() => void handleResendCode()}
                  style={styles.resendButton}
                >
                  <Typography style={styles.resendLabel}>Resend code</Typography>
                </Pressable>
              ) : null}
            </ScrollView>
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
    maxHeight: '88%' as const,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
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
  scrollContent: {
    gap: spacing.lg,
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
  otpInput: {
    letterSpacing: 6,
    fontWeight: '700',
  },
  info: {
    color: APP_DARK_MUTED,
    fontSize: 13,
    lineHeight: 18,
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
  resendButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendLabel: {
    color: colors.pulse[500],
    fontSize: 14,
    fontWeight: '700',
  },
} as const;
