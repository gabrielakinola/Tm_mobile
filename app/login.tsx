import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import {
  Input,
  KeyboardAwareScrollView,
  TicketmasterHeaderLogo,
  Typography,
  useToast,
} from '@/components/ui';
import { API_BASE_URL } from '@/constants/app';
import { ActiveSessionConflictModal } from '@/features/auth/components/ActiveSessionConflictModal';
import { DeviceChangeLimitModal } from '@/features/auth/components/DeviceChangeLimitModal';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/login.schema';
import { SubscriptionExpiredModal } from '@/features/subscription/components/SubscriptionExpiredModal';
import { useForceLogin, useLogin } from '@/hooks/auth/useLogin';
import {
  getLoginErrorMessage,
  isActiveSessionConflict,
  isDeviceChangeLimitReached,
  isSubscriptionExpiredError,
} from '@/lib/auth-errors';
import { openFlutterwaveCheckout } from '@/lib/flutterwave-checkout';
import {
  toSubscriptionRenewalDetails,
  type SubscriptionRenewalDetails,
} from '@/lib/subscription-billing';
import type { ActiveSessionSummary, DeviceChangePolicy } from '@/services/auth/types';
import {
  getFlutterwavePaymentStatusRequest,
  initiateSubscriptionPaymentRequest,
} from '@/services/payments/payments.api';
import { useTheme } from '@/theme';
import { colors, radius, spacing } from '@/theme/tokens';

const API_URL_BANNER_MS = 8000;
const PAYMENT_STATUS_ATTEMPTS = 6;
const PAYMENT_STATUS_DELAY_MS = 1500;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForPaymentVerification(txRef: string): Promise<boolean> {
  for (let attempt = 0; attempt < PAYMENT_STATUS_ATTEMPTS; attempt += 1) {
    const status = await getFlutterwavePaymentStatusRequest(txRef);
    if (status.verified) {
      return true;
    }
    if (attempt < PAYMENT_STATUS_ATTEMPTS - 1) {
      await wait(PAYMENT_STATUS_DELAY_MS);
    }
  }
  return false;
}

export default function LoginScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { show: showToast } = useToast();
  const loginMutation = useLogin();
  const forceLoginMutation = useForceLogin();
  const [renewalDetails, setRenewalDetails] = useState<SubscriptionRenewalDetails | null>(null);
  const [subscriptionModalDismissed, setSubscriptionModalDismissed] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [conflictSession, setConflictSession] = useState<ActiveSessionSummary | null>(null);
  const [deviceChangePolicy, setDeviceChangePolicy] = useState<DeviceChangePolicy | null>(null);
  const [deviceLimitMessage, setDeviceLimitMessage] = useState<string | null>(null);
  const [pendingCredentials, setPendingCredentials] = useState<LoginFormValues | null>(null);
  const [forceError, setForceError] = useState<string | null>(null);
  const [showApiUrlBanner, setShowApiUrlBanner] = useState(true);

  useEffect(() => {
    console.log(`[API] Login screen using base URL: ${API_BASE_URL}`);
    const timer = setTimeout(() => setShowApiUrlBanner(false), API_URL_BANNER_MS);
    return () => clearTimeout(timer);
  }, []);

  const {
    control,
    handleSubmit,
    getValues,
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
    setDeviceChangePolicy(null);
    setPendingCredentials(null);
    setForceError(null);
  };

  const openSubscriptionExpired = (details: SubscriptionRenewalDetails) => {
    setFormError(null);
    setPayError(null);
    setRenewalDetails(details);
    setSubscriptionModalDismissed(false);
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setForceError(null);
    setDeviceLimitMessage(null);

    try {
      await loginMutation.mutateAsync(values);
    } catch (error) {
      if (isSubscriptionExpiredError(error)) {
        const details = toSubscriptionRenewalDetails(
          error.response?.data ?? {
            message: '',
            code: 'SUBSCRIPTION_EXPIRED',
          },
        );
        if (!details) {
          setFormError('Your subscription has expired. Please contact the administrator to renew.');
          return;
        }
        openSubscriptionExpired(details);
        return;
      }
      if (isDeviceChangeLimitReached(error)) {
        setDeviceLimitMessage(getLoginErrorMessage(error));
        return;
      }
      if (isActiveSessionConflict(error)) {
        setPendingCredentials(values);
        setConflictSession(error.response?.data.activeSession ?? null);
        setDeviceChangePolicy(error.response?.data.deviceChangePolicy ?? null);
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
      setDeviceChangePolicy(null);
      setPendingCredentials(null);
    } catch (error) {
      if (isSubscriptionExpiredError(error)) {
        setConflictSession(null);
        setDeviceChangePolicy(null);
        setPendingCredentials(null);
        setForceError(null);
        const details = toSubscriptionRenewalDetails(
          error.response?.data ?? {
            message: '',
            code: 'SUBSCRIPTION_EXPIRED',
          },
        );
        if (!details) {
          setFormError('Your subscription has expired. Please contact the administrator to renew.');
          return;
        }
        openSubscriptionExpired(details);
        return;
      }
      if (isDeviceChangeLimitReached(error)) {
        setConflictSession(null);
        setDeviceChangePolicy(null);
        setPendingCredentials(null);
        setForceError(null);
        setDeviceLimitMessage(getLoginErrorMessage(error));
        return;
      }
      setForceError(getLoginErrorMessage(error));
    }
  };

  const handleSubscriptionExpiredClose = () => {
    if (paying) return;
    setSubscriptionModalDismissed(true);
    setPayError(null);
  };

  const handlePaySubscription = async () => {
    if (!renewalDetails?.subscriptionId || paying) {
      return;
    }

    const email = getValues('email').trim();
    if (!email) {
      setPayError('Enter your email on the login form before paying.');
      return;
    }

    setPaying(true);
    setPayError(null);

    try {
      const { checkoutUrl, txRef } = await initiateSubscriptionPaymentRequest({
        subscriptionId: renewalDetails.subscriptionId,
        email,
      });

      const browserResult = await openFlutterwaveCheckout(checkoutUrl);

      if (browserResult.type !== 'success') {
        setPayError('Payment was cancelled. You can try again when you are ready.');
        return;
      }

      const resolvedTxRef = browserResult.txRef ?? txRef;
      if (!resolvedTxRef) {
        setPayError('Payment finished, but we could not confirm the transaction reference.');
        return;
      }

      const verified = await waitForPaymentVerification(resolvedTxRef);
      if (!verified) {
        setPayError(
          'Payment is still processing. Wait a moment, then tap Pay again to retry verification.',
        );
        return;
      }

      setSubscriptionModalDismissed(true);
      setPayError(null);
      showToast({
        variant: 'success',
        duration: 5000,
        message: 'Payment successful. Your subscription has been renewed. Please sign in.',
      });
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? // axios-shaped
            ((error as { response?: { data?: { message?: string | string[] } } }).response?.data
              ?.message ?? null)
          : null;
      const normalized =
        typeof message === 'string'
          ? message
          : Array.isArray(message)
            ? message[0]
            : 'Unable to start payment. Please try again.';
      setPayError(normalized || 'Unable to start payment. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  const showSubscriptionExpiredModal = renewalDetails != null && !subscriptionModalDismissed;

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
            {showApiUrlBanner ? (
              <View
                style={{
                  backgroundColor: colors.neutral[100],
                  borderRadius: radius.md,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderWidth: 1,
                  borderColor: colors.neutral[200],
                }}
              >
                <Typography
                  variant="caption"
                  style={{ color: colors.neutral[600], fontSize: 11, lineHeight: 16 }}
                >
                  API: {API_BASE_URL}
                </Typography>
              </View>
            ) : null}

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
        deviceChangePolicy={deviceChangePolicy}
        loading={forceLoginMutation.isPending}
        error={forceError}
        onClose={closeConflictModal}
        onForceLogoutAndContinue={() => void handleForceLogoutAndContinue()}
      />

      <DeviceChangeLimitModal
        visible={deviceLimitMessage !== null}
        message={deviceLimitMessage}
        onClose={() => setDeviceLimitMessage(null)}
      />

      <SubscriptionExpiredModal
        visible={showSubscriptionExpiredModal}
        renewal={renewalDetails}
        paying={paying}
        payError={payError}
        onClose={handleSubscriptionExpiredClose}
        onPay={() => void handlePaySubscription()}
      />
    </View>
  );
}
