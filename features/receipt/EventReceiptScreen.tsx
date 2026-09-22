import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { ViewTicketsScanIcon } from '@/components/icons/ViewTicketsScanIcon';
import { ErrorState, Header, LoadingState, Typography } from '@/components/ui';
import {
  APP_CARD_BG,
  APP_DARK_BG,
  APP_DARK_DIVIDER,
  APP_DARK_MUTED,
} from '@/constants/app-surface';
import {
  buildReceiptTotals,
  formatReceiptBillingCityLine,
  formatReceiptEventWhen,
  formatReceiptMoney,
  formatReceiptPaymentMethod,
  formatReceiptShortDate,
  formatReceiptTicketSeat,
  formatReceiptVenueLine,
} from '@/features/receipt/format-receipt';
import { useMyEvent } from '@/hooks/events/useMyEvent';
import type { MyEventDetail } from '@/services/events/types';
import { colors, radius, spacing } from '@/theme/tokens';

const RECEIPT_BLUE = colors.pulse[500];
const INK = colors.white;
const META = APP_DARK_MUTED;
const MUTED = APP_DARK_MUTED;
const LINE = APP_DARK_DIVIDER;
const PAGE_BG = APP_DARK_BG;
const BAR_BG = '#1A1A1A';
const TEXT_PAD = 24;
const BAR_MARGIN = 12;
const CARD_RADIUS = radius.md;
const SECTION_GAP = 12;

const type = {
  eventTitle: { color: INK, fontSize: 16, fontWeight: '700' as const, lineHeight: 21 },
  eventMeta: { color: META, fontSize: 14, fontWeight: '400' as const, lineHeight: 19 },
  section: { color: INK, fontSize: 16, fontWeight: '700' as const, lineHeight: 20 },
  payment: { color: INK, fontSize: 18, fontWeight: '600' as const, lineHeight: 22 },
  row: { color: INK, fontSize: 14, fontWeight: '400' as const, lineHeight: 19 },
  seat: { color: MUTED, fontSize: 13, fontWeight: '400' as const, lineHeight: 17 },
  bar: { color: INK, fontSize: 14, fontWeight: '700' as const, lineHeight: 18 },
  totalBar: { color: INK, fontSize: 18, fontWeight: '700' as const, lineHeight: 22 },
  payLabel: { color: APP_DARK_MUTED, fontSize: 13, fontWeight: '400' as const, lineHeight: 16 },
  payValue: { color: colors.white, fontSize: 16, fontWeight: '400' as const, lineHeight: 21 },
  noticeTitle: { color: INK, fontSize: 16, fontWeight: '700' as const, lineHeight: 20 },
  noticeBody: { color: INK, fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
};

export interface EventReceiptScreenProps {
  eventId?: string;
}

function ReceiptField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 5 }}>
      <Typography style={type.payLabel}>{label}</Typography>
      {typeof children === 'string' ? (
        <Typography style={type.payValue}>{children}</Typography>
      ) : (
        children
      )}
    </View>
  );
}

function WhiteCard({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: 'upper' | 'lower';
}) {
  const isUpper = variant === 'upper';
  return (
    <View
      style={{
        backgroundColor: APP_CARD_BG,
        overflow: 'hidden',
        paddingHorizontal: TEXT_PAD,
        paddingVertical: 18,
        borderTopLeftRadius: isUpper ? 0 : CARD_RADIUS,
        borderTopRightRadius: isUpper ? 0 : CARD_RADIUS,
        borderBottomLeftRadius: isUpper ? CARD_RADIUS : 0,
        borderBottomRightRadius: isUpper ? CARD_RADIUS : 0,
      }}
    >
      {children}
    </View>
  );
}

function SummaryBar({ children, tall = false }: { children: React.ReactNode; tall?: boolean }) {
  return (
    <View
      style={{
        backgroundColor: BAR_BG,
        marginHorizontal: BAR_MARGIN - TEXT_PAD,
        paddingHorizontal: TEXT_PAD - BAR_MARGIN,
        paddingVertical: tall ? 14 : 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {children}
    </View>
  );
}

function ReceiptBody({
  event,
  onViewTickets,
}: {
  event: MyEventDetail;
  onViewTickets: () => void;
}) {
  const insets = useSafeAreaInsets();
  const totals = buildReceiptTotals(event);
  const venueLine = formatReceiptVenueLine(event.venue, event.location);
  const whenLine = formatReceiptEventWhen(event.eventDate, event.eventTime);
  const paymentDate = formatReceiptShortDate(event.purchaseDate);
  const paymentMethod = formatReceiptPaymentMethod(event.paymentMethod, event.cardLast4);
  const holderName = event.cardHolderName?.trim().toUpperCase() ?? '';
  const billingStreet = event.billingStreet?.trim() ?? '';
  const billingCityLine = formatReceiptBillingCityLine(event);
  const saleLabel = event.saleLabel?.trim() || 'Tickets';
  const feeCountLabel =
    totals.ticketCount > 1
      ? `Service Fee: ${formatReceiptMoney(totals.unitFee, totals.currency)} x ${totals.ticketCount}`
      : `Service Fee: ${formatReceiptMoney(totals.unitFee, totals.currency)}`;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: PAGE_BG }}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: PAGE_BG,
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }}
      showsVerticalScrollIndicator={false}
    >
      <WhiteCard variant="upper">
        <View style={{ gap: 8, marginBottom: 16 }}>
          <Typography style={[type.eventTitle, { textTransform: 'uppercase' }]}>
            {event.name}
          </Typography>
          {venueLine ? <Typography style={type.eventMeta}>{venueLine}</Typography> : null}
          {whenLine ? <Typography style={type.eventMeta}>{whenLine}</Typography> : null}
        </View>

        <View style={{ height: 1, backgroundColor: LINE, marginBottom: 16 }} />

        <Typography style={[type.section, { marginBottom: 12 }]}>Tickets</Typography>
        <View style={{ gap: 14, marginBottom: 16 }}>
          {event.tickets.map((ticket, index) => (
            <View
              key={`${ticket.section}-${ticket.row}-${ticket.seat}-${index}`}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flex: 1, paddingRight: 16, gap: 2 }}>
                <Typography style={type.row}>{saleLabel}</Typography>
                <Typography style={type.seat}>{formatReceiptTicketSeat(ticket)}</Typography>
              </View>
              <Typography style={type.row}>
                {formatReceiptMoney(totals.unitPrice, totals.currency)}
              </Typography>
            </View>
          ))}
        </View>

        <SummaryBar>
          <Typography style={type.bar}>Subtotal</Typography>
          <Typography style={type.bar}>{totals.subtotalLabel}</Typography>
        </SummaryBar>

        <View style={{ marginTop: 20, marginBottom: 8 }}>
          <Typography style={type.section}>Fees</Typography>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <Typography style={[type.row, { flex: 1 }]}>{feeCountLabel}</Typography>
          <Typography style={type.row}>
            {formatReceiptMoney(totals.fees, totals.currency)}
          </Typography>
        </View>

        <View style={{ marginTop: 18, marginBottom: 8 }}>
          <Typography style={type.section}>Delivery</Typography>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
          <Typography style={type.row}>Mobile</Typography>
          <Typography style={type.row}>FREE</Typography>
        </View>

        <SummaryBar tall>
          <Typography style={type.totalBar}>Total</Typography>
          <Typography style={type.totalBar}>{totals.totalLabel}</Typography>
        </SummaryBar>

        <View
          style={{
            borderTopWidth: 1,
            borderStyle: 'dashed',
            borderColor: APP_DARK_DIVIDER,
            marginTop: 28,
            paddingTop: 22,
            gap: 22,
          }}
        >
          <Typography style={type.payment}>Payment</Typography>
          {paymentDate ? <ReceiptField label="Date">{paymentDate}</ReceiptField> : null}
          {paymentMethod ? (
            <ReceiptField label="Payment Method">{paymentMethod}</ReceiptField>
          ) : null}
          <ReceiptField label="Total">{totals.totalLabel}</ReceiptField>
          {holderName ? <ReceiptField label="Name">{holderName}</ReceiptField> : null}
          {billingStreet || billingCityLine ? (
            <ReceiptField label="Billing Address">
              <View style={{ gap: 1 }}>
                {billingStreet ? (
                  <Typography style={type.payValue}>{billingStreet}</Typography>
                ) : null}
                {billingCityLine ? (
                  <Typography style={type.payValue}>{billingCityLine}</Typography>
                ) : null}
              </View>
            </ReceiptField>
          ) : null}
        </View>
      </WhiteCard>

      <View style={{ height: SECTION_GAP, minHeight: SECTION_GAP, flexGrow: 1 }} />

      <WhiteCard variant="lower">
        <Typography style={[type.noticeTitle, { marginBottom: 6 }]}>
          This is not a ticket
        </Typography>
        <Typography style={type.noticeBody}>
          Please be aware, this page cannot be used for entry to an event
        </Typography>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View tickets"
          onPress={onViewTickets}
          style={{
            marginTop: 16,
            marginBottom: Math.max(insets.bottom, 12),
            minHeight: 48,
            borderRadius: 6,
            backgroundColor: RECEIPT_BLUE,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
          }}
        >
          <ViewTicketsScanIcon size={20} color={colors.white} />
          <Typography style={{ color: colors.white, fontSize: 16, fontWeight: '700' }}>
            View tickets
          </Typography>
        </Pressable>
      </WhiteCard>
    </ScrollView>
  );
}

function HelpButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Help"
        hitSlop={8}
        onPress={() => setOpen(true)}
        style={{ minWidth: 44, height: 40, alignItems: 'flex-end', justifyContent: 'center' }}
      >
        <Typography style={{ color: colors.white, fontSize: 16, fontWeight: '500' }}>
          Help
        </Typography>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          onPress={() => setOpen(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.45)',
            justifyContent: 'center',
            padding: spacing.lg,
          }}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            style={{
              backgroundColor: APP_CARD_BG,
              borderRadius: radius.lg,
              padding: spacing.xl,
              gap: spacing.md,
            }}
          >
            <Typography style={type.payment}>Receipt help</Typography>
            <Typography style={{ color: APP_DARK_MUTED, fontSize: 15, lineHeight: 22 }}>
              This receipt is for your records. It cannot be used for entry to an event.
            </Typography>
            <Pressable
              onPress={() => setOpen(false)}
              style={{
                minHeight: 44,
                borderRadius: radius.md,
                backgroundColor: RECEIPT_BLUE,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: spacing.sm,
              }}
            >
              <Typography style={{ color: colors.white, fontSize: 15, fontWeight: '700' }}>
                OK
              </Typography>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

export function EventReceiptScreen({ eventId }: EventReceiptScreenProps) {
  const router = useRouter();
  const { data: event, isLoading, isError, refetch } = useMyEvent(eventId);

  const backAction = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => router.back()}
      hitSlop={8}
      style={{
        minWidth: 56,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <ChevronLeft size={22} color={colors.white} strokeWidth={2.2} />
      <Typography style={{ color: colors.white, fontSize: 16, fontWeight: '500', marginLeft: -2 }}>
        Back
      </Typography>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
      <Header title="Receipt" leftAction={backAction} rightAction={<HelpButton />} />
      {isLoading ? (
        <LoadingState inverted message="Loading receipt…" />
      ) : isError || !event ? (
        <ErrorState
          inverted
          title="Receipt not found"
          message="This event may have been removed or is unavailable."
          onRetry={() => void refetch()}
        />
      ) : (
        <ReceiptBody event={event} onViewTickets={() => router.push(`/my-events/${event.id}`)} />
      )}
    </View>
  );
}
