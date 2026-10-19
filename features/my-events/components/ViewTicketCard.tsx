import { Image, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { Image as ExpoImage } from 'expo-image';
import wordmark from '@/assets/images/ticketmaster-wordmark-white.png';
import { Typography } from '@/components/ui';
import { TicketAntiFraudBanner } from '@/features/my-events/components/TicketAntiFraudBanner';
import { TicketBarcode } from '@/features/my-events/components/TicketBarcode';
import { TicketCodeLockedBanner } from '@/features/my-events/components/TicketCodeLockedBanner';
import { TicketQrCode } from '@/features/my-events/components/TicketQrCode';
import {
  buildTicketQrValue,
  formatTicketCodeLockedMessage,
  formatTicketEntrance,
  getCodeAvailabilityLeadDays,
  getViewTicketTypeLabel,
  isTicketCodeLocked,
} from '@/features/my-events/utils/view-tickets';
import type { EventTicket, MyEventDetail } from '@/services/events/types';
import { colors, spacing } from '@/theme/tokens';

const STRIP_BLUE = '#026CDF';
const STRIP_HEIGHT = 28;
const DETAILS_BG = '#1A1A1A';
const LABEL_COLOR = '#8A8A8A';
const GATE_BG = '#FFFFFF';

export interface ViewTicketCardProps {
  event: MyEventDetail;
  ticket: EventTicket;
  index: number;
  width: number;
  height: number;
  scrollX: SharedValue<number>;
  snapInterval: number;
}

export function ViewTicketCard({
  event,
  ticket,
  index,
  width,
  height,
  scrollX,
  snapInterval,
}: ViewTicketCardProps) {
  const isSeated = event.ticketMode !== 'ga';
  const isBarcode = event.codeType === 'barcode';
  const codeLocked = isTicketCodeLocked(event);
  const lockedMessage = formatTicketCodeLockedMessage(
    event.codeType,
    getCodeAvailabilityLeadDays(event.eventDate, event.codeAvailableDate),
  );
  const saleLabel = event.saleLabel.trim();
  const entranceLabel = formatTicketEntrance(event.entrance);
  const imageHeight = Math.max(180, height - STRIP_HEIGHT);
  const qrSize = Math.round(width * 0.58);
  const detailsWidth = Math.round(width * 0.8);
  const saleTypeHeight = spacing.sm + spacing.xs + 18 + (saleLabel ? 16 : 0);
  const seatDetailsHeight = Math.round(saleTypeHeight * 2.5);
  const qrValue = buildTicketQrValue({
    eventId: event.id,
    orderNumber: event.orderNumber,
    ticket,
    index,
  });

  return (
    <View
      style={{
        width,
        height,
        backgroundColor: colors.black,
      }}
    >
      <View
        style={{
          height: STRIP_HEIGHT,
          backgroundColor: STRIP_BLUE,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={wordmark}
          accessibilityLabel="ticketmaster"
          resizeMode="contain"
          style={{ height: 11, width: 118 }}
        />
      </View>

      <View style={{ height: imageHeight, backgroundColor: colors.black }}>
        <ExpoImage
          source={{ uri: event.imageUrl }}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
          contentFit="cover"
        />
        <View
          style={{
            paddingTop: spacing.md,
            alignItems: 'center',
          }}
        >
          {codeLocked ? (
            <TicketCodeLockedBanner codeType={event.codeType} message={lockedMessage} />
          ) : isBarcode ? (
            <TicketBarcode value={qrValue} width={Math.round(width - 20)} />
          ) : (
            <View
              style={{
                backgroundColor: colors.white,
                padding: 10,
              }}
            >
              <TicketQrCode value={qrValue} size={qrSize} />
            </View>
          )}
        </View>

        {isBarcode || codeLocked ? null : (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              overflow: 'hidden',
            }}
          >
            <TicketAntiFraudBanner
              size={width / 2}
              boundsWidth={width}
              visibleHeight={imageHeight - saleTypeHeight - seatDetailsHeight}
              scrollX={scrollX}
              itemIndex={index}
              snapInterval={snapInterval}
            />
          </View>
        )}

        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <View
            style={{
              width: detailsWidth,
              height: saleTypeHeight,
              backgroundColor: DETAILS_BG,
              paddingHorizontal: spacing.lg,
              justifyContent: 'center',
            }}
          >
            <Typography
              style={{
                color: colors.white,
                fontSize: 15,
                lineHeight: 18,
                fontWeight: '700',
              }}
            >
              {getViewTicketTypeLabel(event.ticketMode)}
            </Typography>
            {saleLabel ? (
              <Typography
                style={{
                  color: LABEL_COLOR,
                  fontSize: 12,
                  lineHeight: 15,
                  fontWeight: '400',
                  marginTop: 1,
                }}
              >
                {saleLabel}
              </Typography>
            ) : null}
          </View>

          <View
            style={{
              height: seatDetailsHeight,
              backgroundColor: DETAILS_BG,
              paddingHorizontal: spacing.lg,
              justifyContent: 'center',
              gap: spacing.sm,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TicketField label="SECTION" value={ticket.section} align="left" />
              {isSeated ? (
                <>
                  <TicketField label="ROW" value={ticket.row ?? ''} align="center" />
                  <TicketField label="SEAT" value={ticket.seat ?? ''} align="right" />
                </>
              ) : null}
            </View>

            {entranceLabel ? (
              <View
                style={{
                  minHeight: 36,
                  backgroundColor: GATE_BG,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: spacing.md,
                }}
              >
                <Typography
                  style={{
                    color: colors.black,
                    fontSize: 12,
                    lineHeight: 15,
                    fontWeight: '800',
                    letterSpacing: 0.6,
                    textAlign: 'center',
                  }}
                  numberOfLines={1}
                >
                  {entranceLabel}
                </Typography>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

function TicketField({
  label,
  value,
  align,
}: {
  label: string;
  value: string;
  align: 'left' | 'center' | 'right';
}) {
  return (
    <View style={{ flex: 1, gap: 3 }}>
      <Typography
        style={{
          color: LABEL_COLOR,
          fontSize: 11,
          lineHeight: 13,
          fontWeight: '600',
          letterSpacing: 0.6,
          textAlign: align,
        }}
      >
        {label}
      </Typography>
      <Typography
        style={{
          color: colors.white,
          fontSize: 24,
          lineHeight: 28,
          fontWeight: '700',
          textAlign: align,
        }}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {value || '—'}
      </Typography>
    </View>
  );
}
