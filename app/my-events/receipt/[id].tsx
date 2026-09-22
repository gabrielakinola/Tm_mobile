import { useLocalSearchParams } from 'expo-router';
import { EventReceiptScreen } from '@/features/receipt/EventReceiptScreen';

export default function EventReceiptRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventId = typeof id === 'string' ? id : undefined;
  return <EventReceiptScreen eventId={eventId} />;
}
