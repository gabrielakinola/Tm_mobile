import { apiClient } from '../api/client';
import type {
  CreatedEvent,
  CreateEventInput,
  EventListStatus,
  MyEventDetail,
  MyEventsListParams,
  MyEventsResponse,
  UpdateEventInput,
} from './types';

function appendIfPresent(formData: FormData, key: string, value?: string) {
  if (value?.trim()) {
    formData.append(key, value.trim());
  }
}

export function buildCreateEventFormData(input: CreateEventInput): FormData {
  const formData = new FormData();

  formData.append('name', input.name.trim());
  formData.append('eventDate', input.eventDate.trim());
  formData.append('eventTime', input.eventTime.trim());
  appendIfPresent(formData, 'purchaseDate', input.purchaseDate);
  appendIfPresent(formData, 'purchaseTime', input.purchaseTime);
  formData.append('venue', input.venue.trim());
  formData.append('currency', input.currency.trim());
  formData.append('orderNumber', input.orderNumber.trim());
  formData.append('saleLabel', input.saleLabel.trim());
  formData.append('ticketMode', input.ticketMode);
  formData.append('tickets', JSON.stringify(input.tickets));

  appendIfPresent(formData, 'entrance', input.entrance);
  appendIfPresent(formData, 'ticketmasterUrl', input.ticketmasterUrl);
  appendIfPresent(formData, 'latitude', input.latitude);
  appendIfPresent(formData, 'longitude', input.longitude);
  appendIfPresent(formData, 'timezone', input.timezone);
  appendIfPresent(formData, 'seatMapUrl', input.seatMapUrl);
  appendIfPresent(formData, 'price', input.price);
  appendIfPresent(formData, 'fee', input.fee);

  if (input.image.kind === 'remote') {
    formData.append('imageUrl', input.image.url);
  } else {
    formData.append('image', {
      uri: input.image.uri,
      name: input.image.fileName,
      type: input.image.mimeType ?? 'image/jpeg',
    } as unknown as Blob);
  }

  return formData;
}

export async function createEventRequest(input: CreateEventInput): Promise<CreatedEvent> {
  const formData = buildCreateEventFormData(input);
  const response = await apiClient.post<CreatedEvent>('/events', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function updateEventRequest(
  id: string,
  input: UpdateEventInput,
): Promise<MyEventDetail> {
  const formData = buildCreateEventFormData(input);
  const response = await apiClient.patch<MyEventDetail>(`/events/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function deleteEventRequest(id: string): Promise<void> {
  await apiClient.delete(`/events/${id}`);
}

export async function setEventHiddenRequest(id: string, hidden: boolean): Promise<MyEventDetail> {
  const response = await apiClient.patch<MyEventDetail>(`/events/${id}/hidden`, {
    hidden,
  });
  return response.data;
}

export async function getMyEventsRequest(
  params: EventListStatus | MyEventsListParams,
  signal?: AbortSignal,
): Promise<MyEventsResponse> {
  const query: MyEventsListParams = typeof params === 'string' ? { status: params } : params;

  const response = await apiClient.get<MyEventsResponse>('/events/mine', {
    params: {
      status: query.status,
      ...(query.search?.trim() ? { search: query.search.trim() } : {}),
      ...(query.page !== undefined ? { page: query.page } : {}),
      ...(query.limit !== undefined ? { limit: query.limit } : {}),
      ...(query.includeHidden ? { includeHidden: true } : {}),
    },
    signal,
  });

  return response.data;
}

export async function getMyEventByIdRequest(
  id: string,
  signal?: AbortSignal,
): Promise<MyEventDetail> {
  const response = await apiClient.get<MyEventDetail>(`/events/${id}`, { signal });
  return response.data;
}
