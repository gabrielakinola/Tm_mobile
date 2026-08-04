import { Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { ErrorState, Header, LoadingState } from '@/components/ui';
import { useMyEvent } from '@/hooks/events/useMyEvent';
import { colors } from '@/theme/tokens';

export default function ViewTicketsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventId = typeof id === 'string' ? id : undefined;
  const { data: event, isLoading, isError, refetch } = useMyEvent(eventId);

  const backAction = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => router.back()}
      hitSlop={8}
      style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
    >
      <ChevronLeft size={24} color={colors.white} strokeWidth={2.2} />
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
        <Header title="Tickets" leftAction={backAction} />
        <LoadingState message="Loading tickets…" />
      </View>
    );
  }

  if (isError || !event) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
        <Header title="Tickets" leftAction={backAction} />
        <ErrorState
          title="Event not found"
          message="This event may have been removed or is unavailable."
          onRetry={() => void refetch()}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
      <Header title={event.name} subtitle={event.venue} leftAction={backAction} />
    </View>
  );
}
