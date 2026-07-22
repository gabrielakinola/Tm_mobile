import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import {
  Header,
  KeyboardAwareScrollView,
  KeyboardAwareTextInput,
  Typography,
} from '@/components/ui';
import { UpcomingEventPicker } from '@/features/for-you/components/UpcomingEventPicker';
import type { MyEventSummary } from '@/services/events/types';
import { useTheme } from '@/theme';
import { colors, radius, spacing } from '@/theme/tokens';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ConfirmationEmailScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<MyEventSummary | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');

  const canSend = Boolean(selectedEventId) && EMAIL_PATTERN.test(recipientEmail.trim());

  const handleSelectEvent = (eventId: string, event?: MyEventSummary) => {
    setSelectedEventId(eventId);
    setSelectedEvent(event ?? null);
  };

  const handleSendConfirmationEmail = () => {
    if (!selectedEventId) {
      Alert.alert('Select an event', 'Choose an upcoming event before sending.');
      return;
    }

    const email = recipientEmail.trim();
    if (!EMAIL_PATTERN.test(email)) {
      Alert.alert('Invalid email', 'Enter a valid recipient email address.');
      return;
    }

    // Endpoint + template will be wired next; selection UI is ready.
    Alert.alert(
      'Ready to send',
      'Event and recipient are set. Confirmation email sending will be connected next.',
    );
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
          Choose an upcoming event and recipient email to send a confirmation. Sending will be
          connected next.
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
            <KeyboardAwareTextInput
              value={recipientEmail}
              onChangeText={setRecipientEmail}
              placeholder="recipient@email.com"
              placeholderTextColor={colors.neutral[400]}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                borderWidth: 1,
                borderColor: colors.neutral[300],
                borderRadius: radius.sm,
                minHeight: 40,
                paddingHorizontal: spacing.md,
                color: colors.neutral[900],
                fontSize: 14,
                backgroundColor: colors.neutral[0],
              }}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={!canSend}
            onPress={handleSendConfirmationEmail}
            style={{
              height: 40,
              borderRadius: radius.sm,
              backgroundColor: theme.colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: canSend ? 1 : 0.5,
            }}
          >
            <Typography style={{ color: colors.white, fontWeight: '700', fontSize: 14 }}>
              Send Confirmation Email
            </Typography>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
