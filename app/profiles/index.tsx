import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Check, ChevronLeft, Pencil, Plus, Trash2 } from 'lucide-react-native';
import { CountryFlagBadge } from '@/components/navigation/CountryFlagBadge';
import { Header, Typography } from '@/components/ui';
import { COUNTRY_OPTIONS } from '@/features/profile-location/constants';
import { useDeleteProfile, useProfiles, useSetDefaultProfile } from '@/hooks/profiles/useProfiles';
import { formatProfileName } from '@/lib/profile-name';
import type { DisplayProfile } from '@/services/profiles/types';
import { colors, radius, spacing } from '@/theme/tokens';

function countryLabel(code: string): string {
  return COUNTRY_OPTIONS.find((option) => option.value === code)?.label ?? code;
}

export default function ProfilesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: profiles = [], isLoading, isError, refetch } = useProfiles();
  const setDefaultMutation = useSetDefaultProfile();
  const deleteMutation = useDeleteProfile();
  const [successDefaultId, setSuccessDefaultId] = useState<string | null>(null);

  const pendingDefaultId =
    setDefaultMutation.isPending && typeof setDefaultMutation.variables === 'string'
      ? setDefaultMutation.variables
      : null;

  const handleSetDefault = (profile: DisplayProfile) => {
    if (setDefaultMutation.isPending) {
      return;
    }

    setSuccessDefaultId(null);
    setDefaultMutation.mutate(profile.id, {
      onSuccess: () => {
        setSuccessDefaultId(profile.id);
        Alert.alert(
          'Default updated',
          `“${formatProfileName(profile) || 'Untitled profile'}” is now your default profile.`,
        );
      },
      onError: () => {
        Alert.alert('Update failed', 'Could not set default profile.');
      },
    });
  };

  const handleDelete = (profile: DisplayProfile) => {
    if (profiles.length <= 1) {
      Alert.alert('Cannot delete', 'You must keep at least one profile.');
      return;
    }

    Alert.alert(
      'Delete profile',
      `Remove “${formatProfileName(profile) || 'Untitled profile'}”? This only affects in-app display.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteMutation.mutate(profile.id, {
              onError: (error) => {
                Alert.alert(
                  'Delete failed',
                  error instanceof Error ? error.message : 'Could not delete profile.',
                );
              },
            });
          },
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
      <Header
        title="Profiles"
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

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing['3xl'] + insets.bottom,
          gap: spacing.md,
        }}
      >
        <View
          style={{
            backgroundColor: colors.pulse[50],
            borderRadius: radius.md,
            padding: spacing.md,
            borderWidth: 1,
            borderColor: colors.pulse[100],
          }}
        >
          <Typography style={{ color: colors.neutral[800], fontSize: 13, lineHeight: 20 }}>
            Profiles are for in-app display only. They control what appears on My Account and which
            country flag is shown in the app. They do not change your login email or password.
          </Typography>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/profile-form')}
          style={{
            minHeight: 48,
            borderRadius: radius.md,
            backgroundColor: colors.pulse[600],
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
          }}
        >
          <Plus size={18} color={colors.white} strokeWidth={2.4} />
          <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
            Add profile
          </Typography>
        </Pressable>

        {isLoading ? (
          <Typography style={{ color: colors.neutral[500], fontSize: 14 }}>
            Loading profiles…
          </Typography>
        ) : null}

        {isError ? (
          <Pressable onPress={() => void refetch()}>
            <Typography style={{ color: colors.error[500], fontSize: 14 }}>
              Could not load profiles. Tap to retry.
            </Typography>
          </Pressable>
        ) : null}

        {profiles.map((profile) => {
          const isSettingDefault = pendingDefaultId === profile.id;
          const justSetDefault = successDefaultId === profile.id;

          return (
            <View
              key={profile.id}
              style={{
                backgroundColor: colors.white,
                borderRadius: radius.md,
                padding: spacing.md,
                borderWidth: 1,
                borderColor: colors.neutral[200],
                gap: spacing.sm,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <CountryFlagBadge countryCode={profile.country} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Typography
                    style={{ color: colors.neutral[950], fontSize: 16, fontWeight: '700' }}
                  >
                    {formatProfileName(profile) || 'Untitled profile'}
                  </Typography>
                  <Typography style={{ color: colors.neutral[500], fontSize: 13 }}>
                    {profile.displayEmail || 'No display email'}
                  </Typography>
                  <Typography style={{ color: colors.neutral[500], fontSize: 13 }}>
                    {[profile.city, countryLabel(profile.country)].filter(Boolean).join(' · ')}
                  </Typography>
                </View>
                {profile.isDefault ? (
                  <View
                    style={{
                      backgroundColor: colors.pulse[50],
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 4,
                      borderRadius: radius.full,
                    }}
                  >
                    <Typography
                      style={{ color: colors.pulse[700], fontSize: 12, fontWeight: '700' }}
                    >
                      {justSetDefault ? 'Default ✓' : 'Default'}
                    </Typography>
                  </View>
                ) : null}
              </View>

              <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs }}>
                {!profile.isDefault ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{
                      disabled: setDefaultMutation.isPending,
                      busy: isSettingDefault,
                    }}
                    disabled={setDefaultMutation.isPending}
                    onPress={() => handleSetDefault(profile)}
                    style={{
                      flex: 1,
                      minHeight: 40,
                      borderRadius: radius.sm,
                      borderWidth: 1,
                      borderColor: isSettingDefault ? colors.pulse[300] : colors.neutral[300],
                      backgroundColor: isSettingDefault ? colors.pulse[50] : colors.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 6,
                      opacity: setDefaultMutation.isPending && !isSettingDefault ? 0.5 : 1,
                    }}
                  >
                    {isSettingDefault ? (
                      <ActivityIndicator size="small" color={colors.pulse[600]} />
                    ) : (
                      <Check size={16} color={colors.neutral[800]} strokeWidth={2.2} />
                    )}
                    <Typography
                      style={{
                        color: isSettingDefault ? colors.pulse[700] : colors.neutral[800],
                        fontSize: 13,
                        fontWeight: '600',
                      }}
                    >
                      {isSettingDefault ? 'Setting…' : 'Set default'}
                    </Typography>
                  </Pressable>
                ) : null}

                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    router.push({ pathname: '/profile-form', params: { id: profile.id } })
                  }
                  style={{
                    flex: 1,
                    minHeight: 40,
                    borderRadius: radius.sm,
                    borderWidth: 1,
                    borderColor: colors.neutral[300],
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 6,
                  }}
                >
                  <Pencil size={15} color={colors.neutral[800]} strokeWidth={2.2} />
                  <Typography
                    style={{ color: colors.neutral[800], fontSize: 13, fontWeight: '600' }}
                  >
                    Edit
                  </Typography>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => handleDelete(profile)}
                  style={{
                    width: 44,
                    minHeight: 40,
                    borderRadius: radius.sm,
                    borderWidth: 1,
                    borderColor: colors.error[500],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trash2 size={16} color={colors.error[500]} strokeWidth={2.2} />
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
