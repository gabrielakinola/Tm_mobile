export type TicketMode = 'seated' | 'ga';

export interface TicketRow {
  id: string;
  section: string;
  row: string;
  seat: string;
}

export interface CreateEventFormValues {
  name: string;
  eventDate: string;
  eventTime: string;
  purchaseDate: string;
  purchaseTime: string;
  venue: string;
  orderNumber: string;
  ticketMode: TicketMode;
  tickets: TicketRow[];
}

export interface TicketFieldErrors {
  section?: string;
  row?: string;
  seat?: string;
}

export interface CreateEventFormErrors {
  name?: string;
  eventDate?: string;
  eventTime?: string;
  purchaseDate?: string;
  purchaseTime?: string;
  venue?: string;
  orderNumber?: string;
  tickets?: Record<string, TicketFieldErrors>;
}

const REQUIRED_MESSAGE = 'This field is required.';

export function isTicketComplete(ticket: TicketRow, ticketMode: TicketMode): boolean {
  if (ticketMode === 'seated') {
    return (
      ticket.section.trim().length > 0 &&
      ticket.row.trim().length > 0 &&
      ticket.seat.trim().length > 0
    );
  }
  return ticket.section.trim().length > 0;
}

export function validateCreateEventForm(values: CreateEventFormValues): CreateEventFormErrors {
  const errors: CreateEventFormErrors = {};

  if (!values.name.trim()) {
    errors.name = REQUIRED_MESSAGE;
  }

  if (!values.eventDate.trim()) {
    errors.eventDate = REQUIRED_MESSAGE;
  }

  if (!values.eventTime.trim()) {
    errors.eventTime = REQUIRED_MESSAGE;
  }

  if (!values.purchaseDate.trim()) {
    errors.purchaseDate = REQUIRED_MESSAGE;
  }

  if (!values.purchaseTime.trim()) {
    errors.purchaseTime = REQUIRED_MESSAGE;
  }

  if (!values.venue.trim()) {
    errors.venue = REQUIRED_MESSAGE;
  }

  if (!values.orderNumber.trim()) {
    errors.orderNumber = REQUIRED_MESSAGE;
  }

  const ticketErrors: Record<string, TicketFieldErrors> = {};

  values.tickets.forEach((ticket) => {
    const rowErrors: TicketFieldErrors = {};

    if (!ticket.section.trim()) {
      rowErrors.section = REQUIRED_MESSAGE;
    }

    if (values.ticketMode === 'seated') {
      if (!ticket.row.trim()) {
        rowErrors.row = REQUIRED_MESSAGE;
      }
      if (!ticket.seat.trim()) {
        rowErrors.seat = REQUIRED_MESSAGE;
      }
    }

    if (Object.keys(rowErrors).length > 0) {
      ticketErrors[ticket.id] = rowErrors;
    }
  });

  if (Object.keys(ticketErrors).length > 0) {
    errors.tickets = ticketErrors;
  }

  return errors;
}

export function hasFormErrors(errors: CreateEventFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

const ALLOWED_IMAGE_EXTENSION = /\.(jpe?g|png|webp)$/i;

export function isValidImageFile(fileName: string, mimeType?: string | null): boolean {
  if (mimeType && ALLOWED_IMAGE_MIME_TYPES.has(mimeType.toLowerCase())) {
    return true;
  }

  return ALLOWED_IMAGE_EXTENSION.test(fileName);
}
