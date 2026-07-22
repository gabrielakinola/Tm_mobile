import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import { ErrorState, Header, LoadingState, Typography } from '@/components/ui';
import { TransferConfirmModal } from '@/features/transfer-history/components/TransferConfirmModal';
import { useDeleteTransfer, useTransferDetail } from '@/hooks/transfers/useTransferHistory';
import {
  TRANSFER_STATUS_LABELS,
  type TransferHistoryTicket,
} from '@/services/transfers/transfers.api';
import { colors, radius, spacing } from '@/theme/tokens';

function formatEventDate(value: string): string {
  if (!value) return '';
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

function formatTransferredAt(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsed);
}

function formatTicketLine(ticket: TransferHistoryTicket, index: number): string {
  const parts: string[] = [];
  if (ticket.section) parts.push(`Section ${ticket.section}`);
  if (ticket.row) parts.push(`Row ${ticket.row}`);
  if (ticket.seat) parts.push(`Seat ${ticket.seat}`);
  return parts.length > 0 ? parts.join(', ') : `Ticket ${index + 1}`;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <View style={{ gap: 2 }}>
      <Typography style={{ color: colors.neutral[500], fontSize: 12, fontWeight: '600' }}>
        {label}
      </Typography>
      <Typography style={{ color: colors.neutral[900], fontSize: 15 }}>{value}</Typography>
    </View>
  );
}

export default function TransferHistoryDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const transferId = typeof id === 'string' ? id : undefined;
  const query = useTransferDetail(transferId);
  const deleteMutation = useDeleteTransfer();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const transfer = query.data;

  const handleConfirmDelete = () => {
    if (!transferId) return;
    deleteMutation.mutate(transferId, {
      onSuccess: () => {
        setConfirmVisible(false);
        router.back();
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
      <Header
        title="Transfer details"
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
        rightAction={
          transfer ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete transfer"
              disabled={deleteMutation.isPending}
              onPress={() => setConfirmVisible(true)}
              hitSlop={8}
              style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
            >
              <Trash2 size={20} color={colors.white} strokeWidth={2.2} />
            </Pressable>
          ) : (
            <View style={{ width: 40 }} />
          )
        }
      />

      {query.isLoading ? (
        <LoadingState message="Loading transfer…" />
      ) : query.isError || !transfer ? (
        <ErrorState
          title="Transfer not found"
          message="This transfer may have been removed or is unavailable."
          onRetry={() => void query.refetch()}
        />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: spacing['3xl'] + insets.bottom,
            gap: spacing.lg,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.neutral[200],
              overflow: 'hidden',
            }}
          >
            {transfer.event?.imageUrl ? (
              <Image
                source={{ uri: transfer.event.imageUrl }}
                style={{ width: '100%', height: 180 }}
                contentFit="cover"
              />
            ) : null}

            <View style={{ padding: spacing.lg, gap: spacing.md }}>
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: colors.pulse[50],
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 4,
                  borderRadius: radius.full,
                }}
              >
                <Typography style={{ color: colors.pulse[700], fontSize: 12, fontWeight: '700' }}>
                  {TRANSFER_STATUS_LABELS[transfer.status] ?? transfer.status}
                </Typography>
              </View>

              <Typography style={{ color: colors.neutral[950], fontSize: 22, fontWeight: '800' }}>
                {transfer.event?.name || 'Event unavailable'}
              </Typography>

              <DetailRow label="Venue" value={transfer.event?.venue || 'Unavailable'} />
              <DetailRow
                label="Event date"
                value={
                  transfer.event
                    ? `${formatEventDate(transfer.event.eventDate)}${
                        transfer.event.eventTime ? ` · ${transfer.event.eventTime}` : ''
                      }`
                    : 'Unavailable'
                }
              />
              <DetailRow label="Transferred" value={formatTransferredAt(transfer.transferredAt)} />
            </View>
          </View>

          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.neutral[200],
              padding: spacing.lg,
              gap: spacing.md,
            }}
          >
            <Typography
              style={{
                color: colors.neutral[400],
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 0.8,
                textTransform: 'uppercase',
              }}
            >
              Recipient
            </Typography>
            <DetailRow label="Name" value={transfer.recipient.name} />
            <DetailRow label="Email" value={transfer.recipient.email} />
            {transfer.recipient.note ? (
              <DetailRow label="Note" value={transfer.recipient.note} />
            ) : null}
          </View>

          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.neutral[200],
              padding: spacing.lg,
              gap: spacing.md,
            }}
          >
            <Typography
              style={{
                color: colors.neutral[400],
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 0.8,
                textTransform: 'uppercase',
              }}
            >
              Tickets ({transfer.ticketCount})
            </Typography>
            {transfer.tickets.map((ticket, index) => (
              <View
                key={`${ticket.section}-${ticket.row}-${ticket.seat}-${index}`}
                style={{
                  paddingVertical: spacing.sm,
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderTopColor: colors.neutral[100],
                }}
              >
                <Typography style={{ color: colors.neutral[900], fontSize: 15, fontWeight: '600' }}>
                  {formatTicketLine(ticket, index)}
                </Typography>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <TransferConfirmModal
        visible={confirmVisible}
        title="Delete transfer?"
        message={
          transfer
            ? `Remove the transfer to ${transfer.recipient.name} from your history? This can’t be undone.`
            : 'Remove this transfer from your history? This can’t be undone.'
        }
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onClose={() => {
          if (!deleteMutation.isPending) setConfirmVisible(false);
        }}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}
