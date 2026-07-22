import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import {
  Input,
  KeyboardAwareScrollView,
  TicketmasterHeaderLogo,
  Typography,
} from '@/components/ui';
import { ActiveSessionConflictModal } from '@/features/auth/components/ActiveSessionConflictModal';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/login.schema';
import { useForceLogin, useLogin } from '@/hooks/auth/useLogin';
import { getLoginErrorMessage, isActiveSessionConflict } from '@/lib/auth-errors';
import type { ActiveSessionSummary } from '@/services/auth/types';
import { useTheme } from '@/theme';
import { colors, radius, spacing } from '@/theme/tokens';

export default function LoginScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const loginMutation = useLogin();
  const forceLoginMutation = useForceLogin();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [conflictSession, setConflictSession] = useState<ActiveSessionSummary | null>(null);
  const [pendingCredentials, setPendingCredentials] = useState<LoginFormValues | null>(null);
  const [forceError, setForceError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const closeConflictModal = () => {
    if (forceLoginMutation.isPending) return;
    setConflictSession(null);
    setPendingCredentials(null);
    setForceError(null);
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setForceError(null);

    try {
      await loginMutation.mutateAsync(values);
      router.replace('/(tabs)/discover');
    } catch (error) {
      if (isActiveSessionConflict(error)) {
        setPendingCredentials(values);
        setConflictSession(error.response?.data.activeSession ?? null);
        return;
      }
      setFormError(getLoginErrorMessage(error));
    }
  });

  const handleForceLogoutAndContinue = async () => {
    if (!pendingCredentials) return;
    setForceError(null);

    try {
      await forceLoginMutation.mutateAsync(pendingCredentials);
      setConflictSession(null);
      setPendingCredentials(null);
      router.replace('/(tabs)/discover');
    } catch (error) {
      setForceError(getLoginErrorMessage(error));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[950] }}>
      <LinearGradient
        colors={[colors.pulse[700], colors.neutral[950], '#000000']}
        locations={[0, 0.45, 1]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 360,
        }}
      />

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + spacing['3xl'],
          paddingBottom: insets.bottom + spacing.xl,
          paddingHorizontal: spacing.lg,
        }}
      >
        <View style={{ gap: spacing['2xl'] }}>
          <View style={{ gap: spacing.md }}>
            <TicketmasterHeaderLogo height={34} />
            <Typography
              style={{
                color: colors.neutral[300],
                fontSize: 16,
                lineHeight: 24,
              }}
            >
              Sign in to access your tickets, events, and account.
            </Typography>
          </View>

          <View
            style={{
              backgroundColor: colors.neutral[0],
              borderRadius: radius['2xl'],
              padding: spacing.xl,
              gap: spacing.lg,
              borderWidth: 1,
              borderColor: colors.neutral[200],
            }}
          >
            <View style={{ gap: spacing.xs }}>
              <Typography variant="h3" style={{ color: colors.neutral[900] }}>
                Welcome back
              </Typography>
              <Typography variant="body" style={{ color: colors.neutral[500] }}>
                Enter your credentials to continue.
              </Typography>
            </View>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  autoComplete="email"
                  leftIcon={<Mail size={18} color={theme.colors.mutedForeground} />}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  textContentType="password"
                  autoComplete="password"
                  leftIcon={<Lock size={18} color={theme.colors.mutedForeground} />}
                  rightIcon={
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                      hitSlop={8}
                      onPress={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} color={theme.colors.mutedForeground} />
                      ) : (
                        <Eye size={18} color={theme.colors.mutedForeground} />
                      )}
                    </Pressable>
                  }
                />
              )}
            />

            {formError ? (
              <Typography variant="caption" style={{ color: theme.colors.destructive }}>
                {formError}
              </Typography>
            ) : null}

            <Pressable
              accessibilityRole="button"
              disabled={loginMutation.isPending}
              onPress={() => void onSubmit()}
              style={{
                minHeight: 48,
                borderRadius: radius.lg,
                backgroundColor: colors.pulse[600],
                alignItems: 'center',
                justifyContent: 'center',
                opacity: loginMutation.isPending ? 0.7 : 1,
              }}
            >
              {loginMutation.isPending ? (
                <Typography style={{ color: colors.white, fontSize: 16, fontWeight: '700' }}>
                  Signing in...
                </Typography>
              ) : (
                <Typography style={{ color: colors.white, fontSize: 16, fontWeight: '700' }}>
                  Login
                </Typography>
              )}
            </Pressable>

            <Pressable disabled accessibilityState={{ disabled: true }}>
              <Typography
                variant="body"
                style={{
                  textAlign: 'center',
                  color: theme.colors.mutedForeground,
                  opacity: 0.7,
                }}
              >
                Forgot Password
              </Typography>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <ActiveSessionConflictModal
        visible={Boolean(conflictSession)}
        session={conflictSession}
        loading={forceLoginMutation.isPending}
        error={forceError}
        onClose={closeConflictModal}
        onForceLogoutAndContinue={() => void handleForceLogoutAndContinue()}
      />
    </View>
  );
}
