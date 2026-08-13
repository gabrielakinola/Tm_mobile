import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react-native';
import { Header, KeyboardAwareScrollView, Typography } from '@/components/ui';
import { ConfirmationEmailErrorModal } from '@/features/for-you/components/ConfirmationEmailErrorModal';
import { ConfirmationEmailSuccessModal } from '@/features/for-you/components/ConfirmationEmailSuccessModal';
import { UpcomingEventPicker } from '@/features/for-you/components/UpcomingEventPicker';
import { sendEventConfirmationEmailRequest } from '@/services/events/events.api';
import type { MyEventSummary } from '@/services/events/types';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';
import { useTheme } from '@/theme';
import { colors, radius, spacing } from '@/theme/tokens';

export default function ConfirmationEmailScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<MyEventSummary | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultProfileFromAuth = useAuthStore((state) => state.user?.defaultProfile);
  const defaultProfileFromStore = useProfileStore((state) => state.defaultProfile);
  const recipientEmail =
    defaultProfileFromStore?.displayEmail?.trim() ||
    defaultProfileFromAuth?.displayEmail?.trim() ||
    '';

  const canSend = Boolean(selectedEventId) && Boolean(recipientEmail);

  const sendMutation = useMutation({
    mutationFn: (eventId: string) => sendEventConfirmationEmailRequest(eventId),
    onSuccess: (result) => {
      setErrorMessage(null);
      setSuccessEmail(result.to);
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message as string | string[] | undefined)
        : undefined;
      const normalized = Array.isArray(message)
        ? message.join('\n')
        : typeof message === 'string'
          ? message
          : 'Could not send the confirmation email. Please try again.';
      setSuccessEmail(null);
      setErrorMessage(normalized);
    },
  });

  const handleSelectEvent = (eventId: string, event?: MyEventSummary) => {
    setSelectedEventId(eventId);
    setSelectedEvent(event ?? null);
  };

  const handleSendConfirmationEmail = () => {
    if (!selectedEventId) {
      setErrorMessage('Choose an upcoming event before sending.');
      return;
    }

    if (!recipientEmail) {
      setErrorMessage(
        'Your default profile needs a display email before you can send a confirmation.',
      );
      return;
    }

    sendMutation.mutate(selectedEventId);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
      <Header
        title="Confirmation email"
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing['3xl'] + insets.bottom,
          gap: spacing.lg,
        }}
      >
        <Typography style={{ color: colors.neutral[500], fontSize: 13, lineHeight: 20 }}>
          Choose an upcoming event to send a Ticketmaster-style confirmation email to your default
          profile email.
        </Typography>

        <View
          style={{
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.neutral[200],
            backgroundColor: colors.neutral[0],
            padding: spacing.md,
            gap: spacing.md,
          }}
        >
          <View style={{ gap: spacing.xs }}>
            <Typography style={{ color: colors.neutral[700], fontWeight: '600', fontSize: 13 }}>
              Select Event
            </Typography>
            <UpcomingEventPicker
              selectedEventId={selectedEventId}
              selectedEvent={selectedEvent}
              onSelect={handleSelectEvent}
            />
          </View>

          <View style={{ gap: spacing.xs }}>
            <Typography style={{ color: colors.neutral[700], fontWeight: '600', fontSize: 13 }}>
              Recipient Email
            </Typography>
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.neutral[200],
                borderRadius: radius.sm,
                minHeight: 40,
                paddingHorizontal: spacing.md,
                justifyContent: 'center',
                backgroundColor: colors.neutral[50],
              }}
            >
              <Typography
                style={{
                  color: recipientEmail ? colors.neutral[800] : colors.neutral[400],
                  fontSize: 14,
                }}
                numberOfLines={1}
              >
                {recipientEmail || 'No default profile email set'}
              </Typography>
            </View>
            <Typography style={{ color: colors.neutral[400], fontSize: 12, lineHeight: 16 }}>
              Sent to your default profile display email.
            </Typography>
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={!canSend || sendMutation.isPending}
            onPress={handleSendConfirmationEmail}
            style={{
              height: 40,
              borderRadius: radius.sm,
              backgroundColor: theme.colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: canSend && !sendMutation.isPending ? 1 : 0.5,
            }}
          >
            {sendMutation.isPending ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Typography style={{ color: colors.white, fontWeight: '700', fontSize: 14 }}>
                Send Confirmation Email
              </Typography>
            )}
          </Pressable>
        </View>
      </KeyboardAwareScrollView>

      <ConfirmationEmailSuccessModal
        visible={successEmail !== null}
        recipientEmail={successEmail ?? ''}
        eventName={selectedEvent?.name}
        onClose={() => setSuccessEmail(null)}
      />
      <ConfirmationEmailErrorModal
        visible={errorMessage !== null}
        message={errorMessage ?? ''}
        onClose={() => setErrorMessage(null)}
      />
    </View>
  );
}
