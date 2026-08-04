import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { DropdownMenu, Header, KeyboardAwareScrollView, Typography } from '@/components/ui';
import { FormCard, FormField, SectionLabel } from '@/features/create-event/components/FormFields';
import { COUNTRY_OPTIONS } from '@/features/profile-location/constants';
import { useCreateProfile, useProfiles, useUpdateProfile } from '@/hooks/profiles/useProfiles';
import type { ProfileCountry } from '@/services/profiles/types';
import { colors, radius, spacing } from '@/theme/tokens';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileFormScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const profileId = typeof params.id === 'string' ? params.id : undefined;
  const isEditing = Boolean(profileId);

  const { data: profiles = [], isLoading } = useProfiles();
  const createMutation = useCreateProfile();
  const updateMutation = useUpdateProfile();

  const existing = useMemo(
    () => profiles.find((profile) => profile.id === profileId),
    [profileId, profiles],
  );

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayEmail, setDisplayEmail] = useState('');
  const [city, setCity] = useState('');
  const [mobileLast4, setMobileLast4] = useState('');
  const [country, setCountry] = useState<string>('US');
  const [hydrated, setHydrated] = useState(!isEditing);

  useEffect(() => {
    if (!isEditing) {
      setHydrated(true);
      return;
    }
    if (!existing) {
      return;
    }
    setFirstName(existing.firstName);
    setLastName(existing.lastName);
    setDisplayEmail(existing.displayEmail);
    setCity(existing.city);
    setMobileLast4(existing.mobileLast4 ?? '');
    setCountry(existing.country);
    setHydrated(true);
  }, [existing, isEditing]);

  const saving = createMutation.isPending || updateMutation.isPending;

  const handleSave = () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = displayEmail.trim();
    const trimmedMobileLast4 = mobileLast4.trim();

    if (!trimmedFirstName) {
      Alert.alert('Missing first name', 'Enter a first name for this profile.');
      return;
    }

    if (trimmedEmail && !EMAIL_PATTERN.test(trimmedEmail)) {
      Alert.alert('Invalid display email', 'Enter a valid email or leave the field blank.');
      return;
    }

    if (trimmedMobileLast4 && !/^\d{4}$/.test(trimmedMobileLast4)) {
      Alert.alert(
        'Invalid mobile digits',
        'Enter exactly 4 digits, or leave blank to generate them.',
      );
      return;
    }

    const payload = {
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      displayEmail: trimmedEmail,
      city: city.trim(),
      mobileLast4: trimmedMobileLast4,
      country: country as ProfileCountry,
    };

    if (isEditing && profileId) {
      updateMutation.mutate(
        { id: profileId, input: payload },
        {
          onSuccess: (updated) => {
            setFirstName(updated.firstName);
            setLastName(updated.lastName);
            setDisplayEmail(updated.displayEmail);
            setCity(updated.city);
            setMobileLast4(updated.mobileLast4);
            setCountry(updated.country);
            Alert.alert('Profile updated', 'Your display profile has been saved.', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          },
          onError: () => {
            Alert.alert('Save failed', 'Could not update this profile.');
          },
        },
      );
      return;
    }

    createMutation.mutate(payload, {
      onSuccess: (created) => {
        setFirstName(created.firstName);
        setLastName(created.lastName);
        setDisplayEmail(created.displayEmail);
        setCity(created.city);
        setMobileLast4(created.mobileLast4);
        setCountry(created.country);
        Alert.alert('Profile created', 'Your display profile has been added.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      },
      onError: () => {
        Alert.alert('Save failed', 'Could not create this profile.');
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
      <Header
        title={isEditing ? 'Edit profile' : 'Add profile'}
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

      {isLoading && isEditing && !hydrated ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.pulse[600]} />
        </View>
      ) : (
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: spacing['3xl'] + insets.bottom,
            gap: spacing.lg,
          }}
        >
          <Typography style={{ color: colors.neutral[500], fontSize: 13, lineHeight: 20 }}>
            This profile is for in-app display only (My Account and country flag). It does not
            change your login email or password.
          </Typography>

          <FormCard>
            <SectionLabel>Profile name</SectionLabel>
            <Typography
              style={{ color: colors.neutral[500], fontSize: 12, marginTop: -spacing.sm }}
            >
              The default profile&apos;s first name is shown when you transfer tickets.
            </Typography>

            <FormField
              label="First name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Your first name"
              autoCapitalize="words"
            />

            <FormField
              label="Last name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Your last name"
              autoCapitalize="words"
            />

            <View style={{ gap: spacing.xs }}>
              <Typography style={{ color: colors.neutral[800], fontSize: 14, fontWeight: '600' }}>
                Display email
              </Typography>
              <Typography style={{ color: colors.neutral[500], fontSize: 12 }}>
                Shown on My Account. This is separate from the email you use to sign in.
              </Typography>
              <FormField
                value={displayEmail}
                onChangeText={setDisplayEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={{ gap: spacing.xs }}>
              <Typography style={{ color: colors.neutral[800], fontSize: 14, fontWeight: '600' }}>
                Mobile no. last 4 digits
              </Typography>
              <Typography style={{ color: colors.neutral[500], fontSize: 12 }}>
                Used when authenticating transfers. Leave blank to generate 4 digits.
              </Typography>
              <FormField
                value={mobileLast4}
                onChangeText={(value) => setMobileLast4(value.replace(/\D/g, '').slice(0, 4))}
                placeholder="e.g. 7793"
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>
          </FormCard>

          <FormCard>
            <SectionLabel>Location</SectionLabel>
            <Typography
              style={{ color: colors.neutral[500], fontSize: 12, marginTop: -spacing.sm }}
            >
              The default profile&apos;s country controls the flag in Discover, My Events, and My
              Account.
            </Typography>

            <FormField
              label="City"
              value={city}
              onChangeText={setCity}
              placeholder="e.g. Austin, TX"
              autoCapitalize="words"
            />

            <DropdownMenu
              label="Country"
              value={country}
              options={[...COUNTRY_OPTIONS]}
              onChange={setCountry}
              placeholder="Select country"
            />
          </FormCard>

          <Pressable
            accessibilityRole="button"
            disabled={saving}
            onPress={handleSave}
            style={{
              minHeight: 48,
              borderRadius: radius.md,
              backgroundColor: colors.pulse[600],
              alignItems: 'center',
              justifyContent: 'center',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
                Save
              </Typography>
            )}
          </Pressable>
        </KeyboardAwareScrollView>
      )}
    </View>
  );
}
