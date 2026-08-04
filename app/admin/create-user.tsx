import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Header, Input, KeyboardAwareScrollView, Typography } from '@/components/ui';
import { UserCreatedCredentialsModal } from '@/features/admin/components/UserCreatedCredentialsModal';
import { useCreateAdminUser } from '@/hooks/admin/useAdminUsers';
import type { AccessType } from '@/services/auth/types';
import { colors, radius, spacing } from '@/theme/tokens';

const ACCESS_OPTIONS: { value: AccessType; label: string; description: string }[] = [
  {
    value: 'MONTHLY',
    label: 'Monthly',
    description: 'Expires after one calendar month. ₦30,000 plan.',
  },
  {
    value: 'LIFETIME',
    label: 'Lifetime',
    description: 'Never expires. Unlimited wallet passes.',
  },
];

export default function CreateAdminUserScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const createMutation = useCreateAdminUser();
  const [email, setEmail] = useState('');
  const [accessType, setAccessType] = useState<AccessType>('MONTHLY');
  const [formError, setFormError] = useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const handleCreate = async () => {
    setFormError(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setFormError('Enter a valid email address.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync({ email: trimmed, accessType });
      setCreatedCredentials({ email: result.email, password: result.password });
      setEmail('');
      setAccessType('MONTHLY');
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? ((error as { response?: { data?: { message?: string | string[] } } }).response?.data
              ?.message ?? 'Unable to create user.')
          : 'Unable to create user.';
      setFormError(Array.isArray(message) ? message[0] : String(message));
    }
  };

  const handleCredentialsClose = () => {
    setCreatedCredentials(null);
    router.replace('/admin/users');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
      <Header
        title="Create User"
        leftAction={
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            hitSlop={8}
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft size={24} color={colors.white} strokeWidth={2.2} />
          </Pressable>
        }
      />

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing['3xl'] + insets.bottom,
          gap: spacing.lg,
        }}
      >
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="user@example.com"
        />

        <View style={{ gap: spacing.sm }}>
          <Typography style={{ color: colors.neutral[800], fontSize: 14, fontWeight: '600' }}>
            Access type
          </Typography>
          {ACCESS_OPTIONS.map((option) => {
            const selected = accessType === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                onPress={() => setAccessType(option.value)}
                style={{
                  borderWidth: 1,
                  borderColor: selected ? colors.pulse[600] : colors.neutral[300],
                  backgroundColor: selected ? colors.pulse[50] : colors.neutral[0],
                  borderRadius: radius.md,
                  padding: spacing.md,
                  gap: spacing.xs,
                }}
              >
                <Typography
                  style={{
                    color: colors.neutral[900],
                    fontSize: 15,
                    fontWeight: '700',
                  }}
                >
                  {option.label}
                </Typography>
                <Typography style={{ color: colors.neutral[500], fontSize: 13, lineHeight: 18 }}>
                  {option.description}
                </Typography>
              </Pressable>
            );
          })}
        </View>

        {formError ? (
          <Typography style={{ color: colors.error[500], fontSize: 14, fontWeight: '600' }}>
            {formError}
          </Typography>
        ) : null}

        <Pressable
          accessibilityRole="button"
          disabled={createMutation.isPending}
          onPress={() => void handleCreate()}
          style={{
            minHeight: 48,
            borderRadius: radius.lg,
            backgroundColor: colors.pulse[600],
            alignItems: 'center',
            justifyContent: 'center',
            opacity: createMutation.isPending ? 0.7 : 1,
          }}
        >
          {createMutation.isPending ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
              Create user
            </Typography>
          )}
        </Pressable>
      </KeyboardAwareScrollView>

      <UserCreatedCredentialsModal
        visible={Boolean(createdCredentials)}
        email={createdCredentials?.email ?? ''}
        password={createdCredentials?.password ?? ''}
        onClose={handleCredentialsClose}
      />
    </View>
  );
}
