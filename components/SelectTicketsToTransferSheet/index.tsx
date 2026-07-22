import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetSpringConfigs,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { SelectTicketsFooter } from '@/components/SelectTicketsToTransferSheet/SelectTicketsFooter';
import { SelectTicketsMetaRow } from '@/components/SelectTicketsToTransferSheet/SelectTicketsMetaRow';
import { TransferSafetyNotice } from '@/components/SelectTicketsToTransferSheet/TransferSafetyNotice';
import { TransferTicketSeatCard } from '@/components/SelectTicketsToTransferSheet/TransferTicketSeatCard';
import { Typography } from '@/components/ui/Typography';
import type { EventTicket, TicketMode } from '@/services/events/types';
import { colors, radius, spacing } from '@/theme/tokens';

const SNAP_POINTS = ['58%'];
const BACKDROP_OPACITY = 0.45;

export interface SelectTicketsToTransferSheetRef {
  expand: () => void;
  close: () => void;
  clearSelection: () => void;
}

export interface SelectTicketsToTransferSheetProps {
  tickets: EventTicket[];
  ticketMode: TicketMode;
  onTransferTo?: (selectedTickets: EventTicket[]) => void;
}

function getSeatLabel(ticket: EventTicket, index: number, ticketMode: TicketMode): string {
  if (ticketMode === 'ga') {
    return `TICKET ${index + 1}`;
  }
  if (ticket.seat?.trim()) {
    return `SEAT ${ticket.seat.trim()}`;
  }
  return `SEAT ${index + 1}`;
}

export const SelectTicketsToTransferSheet = memo(
  forwardRef<SelectTicketsToTransferSheetRef, SelectTicketsToTransferSheetProps>(
    function SelectTicketsToTransferSheet({ tickets, ticketMode, onTransferTo }, ref) {
      const insets = useSafeAreaInsets();
      const sheetRef = useRef<BottomSheetModal>(null);
      const preserveSelectionRef = useRef(false);
      const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());

      useImperativeHandle(
        ref,
        () => ({
          expand: () => sheetRef.current?.present(),
          close: () => sheetRef.current?.dismiss(),
          clearSelection: () => setSelectedIndexes(new Set()),
        }),
        [],
      );

      const animationConfigs = useBottomSheetSpringConfigs({
        damping: 80,
        overshootClamping: true,
        stiffness: 500,
      });

      const renderBackdrop = useCallback(
        (backdropProps: BottomSheetBackdropProps) => (
          <BottomSheetBackdrop
            {...backdropProps}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={BACKDROP_OPACITY}
            pressBehavior="close"
          />
        ),
        [],
      );

      const toggleSeat = useCallback((index: number) => {
        setSelectedIndexes((prev) => {
          const next = new Set(prev);
          if (next.has(index)) {
            next.delete(index);
          } else {
            next.add(index);
          }
          return next;
        });
      }, []);

      const handleTransferTo = useCallback(() => {
        preserveSelectionRef.current = true;
        const selectedTickets = tickets.filter((_, index) => selectedIndexes.has(index));
        sheetRef.current?.dismiss();
        onTransferTo?.(selectedTickets);
      }, [onTransferTo, selectedIndexes, tickets]);

      const handleDismiss = useCallback(() => {
        if (preserveSelectionRef.current) {
          preserveSelectionRef.current = false;
          return;
        }
        setSelectedIndexes(new Set());
      }, []);

      const seatCards = useMemo(
        () =>
          tickets.map((ticket, index) => ({
            key: `${ticket.section}-${ticket.row}-${ticket.seat}-${index}`,
            label: getSeatLabel(ticket, index, ticketMode),
            index,
          })),
        [ticketMode, tickets],
      );

      return (
        <BottomSheetModal
          ref={sheetRef}
          snapPoints={SNAP_POINTS}
          enablePanDownToClose
          enableDynamicSizing={false}
          animationConfigs={animationConfigs}
          backdropComponent={renderBackdrop}
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={styles.handle}
          onDismiss={handleDismiss}
        >
          <View style={styles.content}>
            <Typography style={styles.title}>SELECT TICKETS TO TRANSFER</Typography>
            <View style={styles.headerDivider} />

            <TransferSafetyNotice />
            <View style={styles.headerDivider} />

            <SelectTicketsMetaRow tickets={tickets} ticketMode={ticketMode} />

            <BottomSheetScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.seatsRow}
              bounces={false}
            >
              {seatCards.map((seat) => (
                <TransferTicketSeatCard
                  key={seat.key}
                  seatLabel={seat.label}
                  selected={selectedIndexes.has(seat.index)}
                  onPress={() => toggleSeat(seat.index)}
                />
              ))}
            </BottomSheetScrollView>

            <View style={styles.flexSpacer} />

            <SelectTicketsFooter
              selectedCount={selectedIndexes.size}
              bottomInset={insets.bottom}
              onTransferTo={handleTransferTo}
            />
          </View>
        </BottomSheetModal>
      );
    },
  ),
);

SelectTicketsToTransferSheet.displayName = 'SelectTicketsToTransferSheet';

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius['3xl'],
    borderTopRightRadius: radius['3xl'],
  },
  handle: {
    backgroundColor: colors.neutral[400],
    width: 40,
    height: 5,
  },
  content: {
    flex: 1,
  },
  title: {
    color: colors.neutral[950],
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0.4,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.neutral[200],
  },
  seatsRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  flexSpacer: {
    flex: 1,
  },
});
