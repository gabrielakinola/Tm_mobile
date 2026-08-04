import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { DropdownMenu, Header, Typography, useToast } from '@/components/ui';
import { KeyboardAwareScrollView } from '@/components/ui/KeyboardAwareScrollView';
import { DatePickerField } from '@/features/create-event/components/DatePickerField';
import {
  FormCard,
  FormField,
  OrderNumberField,
  SectionLabel,
} from '@/features/create-event/components/FormFields';
import { TicketmasterSearch } from '@/features/create-event/components/ticketmaster-search';
import { TimePickerField } from '@/features/create-event/components/TimePickerField';
import { formatEventDateFromIso } from '@/features/create-event/date-utils';
import { formatEventTimeFrom24h } from '@/features/create-event/time-utils';
import {
  hasFormErrors,
  isTicketComplete,
  isValidImageFile,
  validateCreateEventForm,
  type CreateEventFormErrors,
  type TicketMode,
  type TicketRow,
} from '@/features/create-event/validation';
import { useCreateEvent } from '@/hooks/events/useCreateEvent';
import { useUpdateEvent } from '@/hooks/events/useManageEvents';
import { useMyEvent } from '@/hooks/events/useMyEvent';
import { getCreateEventErrorMessage } from '@/lib/event-errors';
import type { EventImageInput } from '@/services/events/types';
import type { TicketmasterEventDetails } from '@/services/ticketmaster/types';
import { colors, radius, spacing } from '@/theme/tokens';

const CURRENCY_OPTIONS = [
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'GBP', value: 'GBP' },
  { label: 'CAD', value: 'CAD' },
];

const SALE_LABEL_OPTIONS = [
  { label: 'General Sale', value: 'General Sale' },
  { label: 'Standard Ticket', value: 'Standard Ticket' },
  { label: 'Verified Fan Presale', value: 'Verified Fan Presale' },
  { label: 'American Express Presale', value: 'American Express Presale' },
  { label: 'VIP Package', value: 'VIP Package' },
  { label: 'Custom', value: 'Custom' },
];

const INITIAL_TICKETS: TicketRow[] = [{ id: '1', section: '', row: '', seat: '' }];

function createInitialFormState() {
  return {
    name: '',
    ticketmasterUrl: '',
    eventDate: '',
    eventTime: '',
    purchaseDate: '',
    purchaseTime: '',
    venue: '',
    entrance: '',
    lat: '',
    lng: '',
    timezone: '',
    seatMapUrl: '',
    currency: 'USD',
    price: '',
    fee: '',
    orderNumber: '',
    saleLabelOption: 'General Sale',
    customSaleLabel: '',
    ticketMode: 'seated' as TicketMode,
    tickets: INITIAL_TICKETS.map((ticket) => ({ ...ticket })),
    nextTicketId: 2,
    eventImage: null as EventImageInput | null,
    imageError: undefined as string | undefined,
    formErrors: {} as CreateEventFormErrors,
    submitAttempted: false,
  };
}

type EventImage =
  | {
      kind: 'local';
      uri: string;
      fileName: string;
      mimeType?: string;
    }
  | {
      kind: 'remote';
      url: string;
      fileName: string;
    };

function toEventImageInput(image: EventImage): EventImageInput {
  if (image.kind === 'local') {
    return {
      kind: 'local',
      uri: image.uri,
      fileName: image.fileName,
      mimeType: image.mimeType,
    };
  }

  return {
    kind: 'remote',
    url: image.url,
  };
}

export default function CreateEventScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { show } = useToast();
  const params = useLocalSearchParams<{ id?: string }>();
  const eventId = typeof params.id === 'string' ? params.id : undefined;
  const isEditing = Boolean(eventId);
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const existingEventQuery = useMyEvent(eventId);
  const [hydrated, setHydrated] = useState(!isEditing);

  const [name, setName] = useState('');
  const [ticketmasterUrl, setTicketmasterUrl] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchaseTime, setPurchaseTime] = useState('');
  const [venue, setVenue] = useState('');
  const [entrance, setEntrance] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [timezone, setTimezone] = useState('');
  const [seatMapUrl, setSeatMapUrl] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [price, setPrice] = useState('');
  const [fee, setFee] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [saleLabelOption, setSaleLabelOption] = useState('General Sale');
  const [customSaleLabel, setCustomSaleLabel] = useState('');
  const [ticketMode, setTicketMode] = useState<TicketMode>('seated');
  const [tickets, setTickets] = useState<TicketRow[]>([
    { id: '1', section: '', row: '', seat: '' },
  ]);
  const [nextTicketId, setNextTicketId] = useState(2);
  const [eventImage, setEventImage] = useState<EventImage | null>(null);
  const [imageError, setImageError] = useState<string | undefined>();
  const [formErrors, setFormErrors] = useState<CreateEventFormErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (!isEditing || !existingEventQuery.data || hydrated) {
      return;
    }

    const event = existingEventQuery.data;
    setName(event.name);
    setTicketmasterUrl(event.ticketmasterUrl ?? '');
    setEventDate(formatEventDateFromIso(event.eventDate));
    setEventTime(event.eventTime);
    setPurchaseDate(formatEventDateFromIso(event.purchaseDate ?? ''));
    setPurchaseTime(event.purchaseTime ?? '');
    setVenue(event.venue);
    setEntrance(event.entrance ?? '');
    setLat(event.latitude ?? '');
    setLng(event.longitude ?? '');
    setTimezone(event.timezone ?? '');
    setSeatMapUrl(event.seatMapUrl ?? '');
    setCurrency(event.currency || 'USD');
    setPrice(event.price ?? '');
    setFee(event.fee ?? '');
    setOrderNumber(event.orderNumber);
    const savedSaleLabel = event.saleLabel?.trim() || 'Standard Ticket';
    if (SALE_LABEL_OPTIONS.some((option) => option.value === savedSaleLabel)) {
      setSaleLabelOption(savedSaleLabel);
      setCustomSaleLabel('');
    } else {
      setSaleLabelOption('Custom');
      setCustomSaleLabel(savedSaleLabel);
    }
    setTicketMode((event.ticketMode as TicketMode) || 'seated');
    const mappedTickets =
      event.tickets.length > 0
        ? event.tickets.map((ticket, index) => ({
            id: String(index + 1),
            section: ticket.section ?? '',
            row: ticket.row ?? '',
            seat: ticket.seat ?? '',
          }))
        : [{ id: '1', section: '', row: '', seat: '' }];
    setTickets(mappedTickets);
    setNextTicketId(mappedTickets.length + 1);
    if (event.imageUrl) {
      setEventImage({
        kind: 'remote',
        url: event.imageUrl,
        fileName: 'Event image',
      });
    }
    setHydrated(true);
  }, [existingEventQuery.data, hydrated, isEditing]);

  const resetForm = () => {
    const initial = createInitialFormState();
    setName(initial.name);
    setTicketmasterUrl(initial.ticketmasterUrl);
    setEventDate(initial.eventDate);
    setEventTime(initial.eventTime);
    setPurchaseDate(initial.purchaseDate);
    setPurchaseTime(initial.purchaseTime);
    setVenue(initial.venue);
    setEntrance(initial.entrance);
    setLat(initial.lat);
    setLng(initial.lng);
    setTimezone(initial.timezone);
    setSeatMapUrl(initial.seatMapUrl);
    setCurrency(initial.currency);
    setPrice(initial.price);
    setFee(initial.fee);
    setOrderNumber(initial.orderNumber);
    setSaleLabelOption(initial.saleLabelOption);
    setCustomSaleLabel(initial.customSaleLabel);
    setTicketMode(initial.ticketMode);
    setTickets(initial.tickets);
    setNextTicketId(initial.nextTicketId);
    setEventImage(null);
    setImageError(initial.imageError);
    setFormErrors(initial.formErrors);
    setSubmitAttempted(initial.submitAttempted);
  };

  const currencyLabel = useMemo(
    () => CURRENCY_OPTIONS.find((option) => option.value === currency)?.label ?? 'USD',
    [currency],
  );

  const clearFieldError = (field: keyof Omit<CreateEventFormErrors, 'tickets'>) => {
    if (!formErrors[field]) return;
    setFormErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const clearTicketFieldError = (ticketId: string, key: 'section' | 'row' | 'seat') => {
    const ticketErrors = formErrors.tickets?.[ticketId];
    if (!ticketErrors?.[key]) return;

    setFormErrors((current) => {
      if (!current.tickets?.[ticketId]) return current;

      const nextTickets = { ...current.tickets };
      const nextTicketErrors = { ...nextTickets[ticketId] };
      delete nextTicketErrors[key];

      if (Object.keys(nextTicketErrors).length === 0) {
        delete nextTickets[ticketId];
      } else {
        nextTickets[ticketId] = nextTicketErrors;
      }

      const next = { ...current };
      if (Object.keys(nextTickets).length === 0) {
        delete next.tickets;
      } else {
        next.tickets = nextTickets;
      }
      return next;
    });
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setImageError('Photo library permission is required to choose an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) {
      return;
    }

    const asset = result.assets[0];
    const fileName = asset.fileName ?? asset.uri.split('/').pop() ?? 'image';

    if (!isValidImageFile(fileName, asset.mimeType)) {
      setEventImage(null);
      setImageError('Please select a JPEG, PNG, or WebP image.');
      return;
    }

    setEventImage({
      kind: 'local',
      uri: asset.uri,
      fileName,
      mimeType: asset.mimeType ?? undefined,
    });
    setImageError(undefined);
  };

  const removeImage = () => {
    setEventImage(null);
    setImageError(undefined);
  };

  const handleTicketmasterEventSelected = (event: TicketmasterEventDetails) => {
    setName(event.eventName);
    setTicketmasterUrl(event.ticketmasterUrl);
    setEventDate(formatEventDateFromIso(event.date));
    const [hoursText, minutesText] = event.startTime.split(':');
    setEventTime(formatEventTimeFrom24h(Number(hoursText), Number(minutesText)));
    setVenue(event.location ? `${event.venue} - ${event.location}` : event.venue);
    setLat(event.latitude);
    setLng(event.longitude);
    setTimezone(event.timezone ?? '');
    setSeatMapUrl(event.seatMapUrl);
    setOrderNumber(event.orderNumber);

    if (event.imageUrl) {
      setEventImage({
        kind: 'remote',
        url: event.imageUrl,
        fileName: 'Ticketmaster image',
      });
    } else {
      setEventImage(null);
    }

    setImageError(undefined);
    setFormErrors((current) => {
      const next = { ...current };
      delete next.name;
      delete next.eventDate;
      delete next.eventTime;
      delete next.venue;
      delete next.orderNumber;
      return next;
    });
  };

  const handleCreateEvent = async () => {
    setSubmitAttempted(true);

    const errors = validateCreateEventForm({
      name,
      eventDate,
      eventTime,
      purchaseDate,
      purchaseTime,
      venue,
      orderNumber,
      ticketMode,
      tickets,
    });

    if (!eventImage) {
      setImageError('An event image is required.');
    } else {
      setImageError(undefined);
    }

    setFormErrors(errors);

    if (hasFormErrors(errors) || !eventImage) {
      Alert.alert(
        'Missing required fields',
        `Please fill in all required fields before ${isEditing ? 'saving' : 'creating'} the event.`,
      );
      return;
    }

    const payload = {
      name,
      ticketmasterUrl,
      eventDate,
      eventTime,
      purchaseDate,
      purchaseTime,
      venue,
      entrance,
      latitude: lat,
      longitude: lng,
      timezone,
      seatMapUrl,
      currency,
      price,
      fee,
      orderNumber,
      saleLabel: saleLabelOption === 'Custom' ? customSaleLabel : saleLabelOption,
      ticketMode,
      tickets: tickets.map(({ section, row, seat }) => ({
        section,
        row,
        seat,
      })),
      image: toEventImageInput(eventImage),
    };

    try {
      if (isEditing && eventId) {
        await updateEventMutation.mutateAsync({ id: eventId, input: payload });
        show({
          message: 'Event updated successfully.',
          variant: 'success',
        });
      } else {
        await createEventMutation.mutateAsync(payload);
        show({
          message: 'Event created successfully.',
          variant: 'success',
        });
        resetForm();
      }
      router.back();
    } catch (error) {
      show({
        message: getCreateEventErrorMessage(error),
        variant: 'error',
      });
    }
  };

  const saving = createEventMutation.isPending || updateEventMutation.isPending;

  const isTicketRowComplete = (ticket: TicketRow): boolean => isTicketComplete(ticket, ticketMode);

  const canAddTicket = tickets.length < 8 && tickets.every(isTicketRowComplete);

  const resolveNextSeat = (seat: string): string => {
    const trimmed = seat.trim();
    if (/^\d+$/.test(trimmed)) {
      return String(Number(trimmed) + 1);
    }
    return '';
  };

  const addTicket = () => {
    if (!canAddTicket) return;

    const lastTicket = tickets[tickets.length - 1];
    if (!lastTicket) return;

    const newTicket: TicketRow =
      ticketMode === 'seated'
        ? {
            id: String(nextTicketId),
            section: lastTicket.section,
            row: lastTicket.row,
            seat: resolveNextSeat(lastTicket.seat),
          }
        : {
            id: String(nextTicketId),
            section: lastTicket.section,
            row: '',
            seat: '',
          };

    setNextTicketId((current) => current + 1);
    setTickets((current) => [...current, newTicket]);
  };

  const removeTicket = (id: string) => {
    setTickets((current) => {
      if (current.length <= 1) {
        return [{ id: '1', section: '', row: '', seat: '' }];
      }
      return current.filter((ticket) => ticket.id !== id);
    });
  };

  const updateTicket = (id: string, key: keyof Omit<TicketRow, 'id'>, value: string) => {
    clearTicketFieldError(id, key);
    setTickets((current) =>
      current.map((ticket) => (ticket.id === id ? { ...ticket, [key]: value } : ticket)),
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[100] }}>
      <Header
        title={isEditing ? 'Edit event' : 'Create event'}
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

      {isEditing && !hydrated ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.pulse[600]} />
        </View>
      ) : (
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: spacing['3xl'] + insets.bottom,
            gap: spacing.lg,
          }}
        >
          {/* EVENT */}
          <FormCard>
            <SectionLabel>Event</SectionLabel>

            <View style={{ gap: spacing.xs }}>
              <Typography style={{ color: colors.neutral[800], fontSize: 14, fontWeight: '600' }}>
                Image
              </Typography>
              <Typography style={{ color: colors.neutral[500], fontSize: 12 }}>
                Upload a file, or use Ticketmaster lookup — we fill a poster URL you can submit
                as-is.
              </Typography>
              {eventImage ? (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.neutral[300],
                    borderRadius: radius.md,
                    backgroundColor: colors.neutral[50],
                    padding: spacing.sm,
                    gap: spacing.sm,
                  }}
                >
                  <Image
                    source={{ uri: eventImage.kind === 'local' ? eventImage.uri : eventImage.url }}
                    contentFit="cover"
                    style={{
                      width: '100%',
                      aspectRatio: 16 / 9,
                      borderRadius: radius.md,
                      backgroundColor: colors.neutral[200],
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: spacing.sm,
                    }}
                  >
                    <Typography
                      style={{ color: colors.neutral[700], fontSize: 12, flex: 1 }}
                      numberOfLines={1}
                    >
                      {eventImage.fileName}
                    </Typography>
                    <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                      <Pressable
                        accessibilityRole="button"
                        onPress={removeImage}
                        style={{
                          borderWidth: 1,
                          borderColor: colors.neutral[300],
                          borderRadius: radius.sm,
                          paddingHorizontal: spacing.sm,
                          paddingVertical: 6,
                          backgroundColor: colors.neutral[0],
                        }}
                      >
                        <Typography
                          style={{ color: colors.neutral[700], fontSize: 12, fontWeight: '700' }}
                        >
                          Remove
                        </Typography>
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        onPress={pickImage}
                        style={{
                          borderWidth: 1,
                          borderColor: colors.pulse[300],
                          borderRadius: radius.sm,
                          paddingHorizontal: spacing.sm,
                          paddingVertical: 6,
                          backgroundColor: colors.pulse[50],
                        }}
                      >
                        <Typography
                          style={{ color: colors.pulse[700], fontSize: 12, fontWeight: '700' }}
                        >
                          Choose Another
                        </Typography>
                      </Pressable>
                    </View>
                  </View>
                </View>
              ) : null}
              <View
                style={{
                  minHeight: 42,
                  borderWidth: 1,
                  borderColor: imageError ? colors.error[500] : colors.neutral[300],
                  borderRadius: radius.md,
                  backgroundColor: colors.neutral[0],
                  paddingHorizontal: spacing.sm,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.sm,
                }}
              >
                <Pressable
                  accessibilityRole="button"
                  onPress={pickImage}
                  style={{
                    backgroundColor: colors.neutral[100],
                    borderRadius: radius.sm,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                  }}
                >
                  <Typography
                    style={{ color: colors.neutral[900], fontSize: 13, fontWeight: '600' }}
                  >
                    {eventImage ? 'Replace File' : 'Choose File'}
                  </Typography>
                </Pressable>
                <Typography
                  style={{
                    color: eventImage ? colors.neutral[800] : colors.neutral[500],
                    fontSize: 13,
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {eventImage?.fileName ?? 'no file selected'}
                </Typography>
              </View>
              {imageError ? (
                <Typography style={{ color: colors.error[500], fontSize: 12 }}>
                  {imageError}
                </Typography>
              ) : (
                <Typography style={{ color: colors.neutral[500], fontSize: 12 }}>
                  Uploading a file replaces the Ticketmaster poster for this submission. Only
                  picture files are accepted.
                </Typography>
              )}
            </View>

            <View
              style={{
                backgroundColor: colors.pulse[50],
                borderWidth: 1,
                borderColor: colors.pulse[200],
                borderRadius: radius.md,
                padding: spacing.md,
              }}
            >
              <TicketmasterSearch onEventSelected={handleTicketmasterEventSelected} />
            </View>

            <FormField
              label="Name"
              required
              value={name}
              onChangeText={(value) => {
                clearFieldError('name');
                setName(value);
              }}
              placeholder="e.g. Summer Night Live"
              error={formErrors.name}
            />

            <View style={{ gap: spacing.xs }}>
              <Typography style={{ color: colors.neutral[800], fontSize: 14, fontWeight: '600' }}>
                Date & start time
                <Typography style={{ color: colors.error[500], fontSize: 14, fontWeight: '600' }}>
                  {' '}
                  *
                </Typography>
              </Typography>
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <View style={{ flex: 1 }}>
                  <DatePickerField
                    value={eventDate}
                    onChange={(value) => {
                      clearFieldError('eventDate');
                      setEventDate(value);
                    }}
                    placeholder="Select date"
                    error={formErrors.eventDate}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TimePickerField
                    value={eventTime}
                    onChange={(value) => {
                      clearFieldError('eventTime');
                      setEventTime(value);
                    }}
                    placeholder="Select time"
                    error={formErrors.eventTime}
                  />
                </View>
              </View>
            </View>

            <View style={{ gap: spacing.xs }}>
              <Typography style={{ color: colors.neutral[800], fontSize: 14, fontWeight: '600' }}>
                Purchase date & time (optional)
              </Typography>
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <View style={{ flex: 1 }}>
                  <DatePickerField
                    value={purchaseDate}
                    onChange={(value) => {
                      clearFieldError('purchaseDate');
                      setPurchaseDate(value);
                    }}
                    placeholder="Select date"
                    error={formErrors.purchaseDate}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TimePickerField
                    value={purchaseTime}
                    onChange={(value) => {
                      clearFieldError('purchaseTime');
                      setPurchaseTime(value);
                    }}
                    placeholder="Select time"
                    error={formErrors.purchaseTime}
                  />
                </View>
              </View>
              <Typography style={{ color: colors.neutral[500], fontSize: 12 }}>
                Used in Order Details when a ticket seat is tapped.
              </Typography>
            </View>

            <FormField
              label="Venue & location"
              required
              value={venue}
              onChangeText={(value) => {
                clearFieldError('venue');
                setVenue(value);
              }}
              placeholder="e.g. Madison Square Garden — New York, NY"
              error={formErrors.venue}
            />

            <FormField
              label="Entrance details"
              value={entrance}
              onChangeText={setEntrance}
              placeholder="e.g. 5th 3rd Gate"
              hint="Shown in the Important Notes section on ticket information."
            />

            <View style={{ gap: spacing.xs }}>
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <FormField
                  label="Lat"
                  value={lat}
                  onChangeText={setLat}
                  placeholder="40.7505"
                  keyboardType="decimal-pad"
                  containerStyle={{ flex: 1 }}
                />
                <FormField
                  label="Lng"
                  value={lng}
                  onChangeText={setLng}
                  placeholder="-73.9934"
                  keyboardType="decimal-pad"
                  containerStyle={{ flex: 1 }}
                />
              </View>
              <Typography style={{ color: colors.neutral[500], fontSize: 12 }}>
                Map defaults to NYC if coordinates are blank.
              </Typography>
            </View>

            <FormField
              label="Seat map image URL (optional)"
              value={seatMapUrl}
              onChangeText={setSeatMapUrl}
              placeholder="https://..."
              autoCapitalize="none"
              hint="Filled automatically when you use Ticketmaster lookup and a map is available."
            />
          </FormCard>

          {/* PRICING & ORDER */}
          <FormCard>
            <SectionLabel>Pricing & order</SectionLabel>

            <DropdownMenu
              label="Currency"
              value={currency}
              options={CURRENCY_OPTIONS}
              onChange={setCurrency}
            />

            <View style={{ gap: spacing.xs }}>
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <FormField
                  label={`Price (${currencyLabel})`}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="49.99"
                  keyboardType="decimal-pad"
                  containerStyle={{ flex: 1 }}
                />
                <FormField
                  label={`Fee (${currencyLabel})`}
                  value={fee}
                  onChangeText={setFee}
                  placeholder="12.50"
                  keyboardType="decimal-pad"
                  containerStyle={{ flex: 1 }}
                />
              </View>
              <Typography style={{ color: colors.neutral[500], fontSize: 12 }}>
                Fee requires a ticket price. Shown on ticket details.
              </Typography>
            </View>

            <OrderNumberField
              value={orderNumber}
              onChangeText={(value) => {
                clearFieldError('orderNumber');
                setOrderNumber(value);
              }}
              error={formErrors.orderNumber}
            />

            <DropdownMenu
              label="Sale label"
              value={saleLabelOption}
              options={SALE_LABEL_OPTIONS}
              onChange={setSaleLabelOption}
            />

            {saleLabelOption === 'Custom' ? (
              <FormField
                label="Custom sale label"
                value={customSaleLabel}
                onChangeText={setCustomSaleLabel}
                placeholder="Enter sale label"
              />
            ) : null}
          </FormCard>

          {/* TICKETS */}
          <FormCard>
            <SectionLabel>Tickets</SectionLabel>
            <Typography
              style={{ color: colors.neutral[500], fontSize: 12, marginTop: -spacing.sm }}
            >
              1-8 tickets; each row is one seat assignment.
            </Typography>

            <View
              style={{
                flexDirection: 'row',
                borderWidth: 1,
                borderColor: colors.neutral[300],
                borderRadius: radius.md,
                overflow: 'hidden',
              }}
            >
              {(
                [
                  { key: 'seated', label: 'Seated' },
                  { key: 'ga', label: 'General Admission' },
                ] as const
              ).map((option) => {
                const active = ticketMode === option.key;
                return (
                  <Pressable
                    key={option.key}
                    onPress={() => setTicketMode(option.key)}
                    style={{
                      flex: 1,
                      paddingVertical: spacing.sm + 2,
                      alignItems: 'center',
                      backgroundColor: active ? colors.pulse[600] : colors.neutral[50],
                    }}
                  >
                    <Typography
                      style={{
                        color: active ? colors.white : colors.neutral[700],
                        fontSize: 13,
                        fontWeight: '700',
                      }}
                    >
                      {option.label}
                    </Typography>
                  </Pressable>
                );
              })}
            </View>

            {tickets.map((ticket, index) => (
              <View
                key={ticket.id}
                style={{
                  borderWidth: 1,
                  borderColor:
                    submitAttempted && formErrors.tickets?.[ticket.id]
                      ? colors.error[500]
                      : colors.neutral[300],
                  borderRadius: radius.md,
                  padding: spacing.md,
                  gap: spacing.sm,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    style={{ color: colors.neutral[900], fontSize: 14, fontWeight: '700' }}
                  >
                    Ticket {index + 1}
                  </Typography>
                  {tickets.length > 1 ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ticket ${index + 1}`}
                      onPress={() => removeTicket(ticket.id)}
                      hitSlop={8}
                    >
                      <Typography
                        style={{ color: colors.error[500], fontSize: 13, fontWeight: '600' }}
                      >
                        Remove
                      </Typography>
                    </Pressable>
                  ) : null}
                </View>
                {ticketMode === 'seated' ? (
                  <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                    <FormField
                      label="Section"
                      required
                      value={ticket.section}
                      onChangeText={(value) => updateTicket(ticket.id, 'section', value)}
                      placeholder="108"
                      containerStyle={{ flex: 1 }}
                      error={formErrors.tickets?.[ticket.id]?.section}
                    />
                    <FormField
                      label="Row"
                      required
                      value={ticket.row}
                      onChangeText={(value) => updateTicket(ticket.id, 'row', value)}
                      placeholder="12"
                      containerStyle={{ flex: 1 }}
                      error={formErrors.tickets?.[ticket.id]?.row}
                    />
                    <FormField
                      label="Seat"
                      required
                      value={ticket.seat}
                      onChangeText={(value) => updateTicket(ticket.id, 'seat', value)}
                      placeholder="3"
                      containerStyle={{ flex: 1 }}
                      error={formErrors.tickets?.[ticket.id]?.seat}
                    />
                  </View>
                ) : (
                  <FormField
                    label="Section"
                    required
                    value={ticket.section}
                    onChangeText={(value) => updateTicket(ticket.id, 'section', value)}
                    placeholder="GA1"
                    error={formErrors.tickets?.[ticket.id]?.section}
                  />
                )}
              </View>
            ))}

            {tickets.length < 8 ? (
              <Pressable
                onPress={addTicket}
                disabled={!canAddTicket}
                style={{
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: canAddTicket ? colors.pulse[300] : colors.neutral[300],
                  borderRadius: radius.md,
                  minHeight: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: canAddTicket ? 1 : 0.45,
                }}
              >
                <Typography
                  style={{
                    color: canAddTicket ? colors.pulse[600] : colors.neutral[400],
                    fontSize: 14,
                    fontWeight: '700',
                  }}
                >
                  + Add ticket
                </Typography>
              </Pressable>
            ) : null}
          </FormCard>

          <Pressable
            accessibilityRole="button"
            disabled={saving}
            onPress={() => void handleCreateEvent()}
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
                {isEditing ? 'Save changes' : 'Create event'}
              </Typography>
            )}
          </Pressable>
        </KeyboardAwareScrollView>
      )}
    </View>
  );
}
