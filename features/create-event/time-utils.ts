export type ParsedEventTime = {
  hour12: number;
  minutes: number;
  meridiem: 'AM' | 'PM';
};

export function defaultEventTime(): ParsedEventTime {
  return { hour12: 8, minutes: 0, meridiem: 'AM' };
}

export function formatEventTimeDisplay(parts: ParsedEventTime): string {
  return `${parts.hour12}:${String(parts.minutes).padStart(2, '0')} ${parts.meridiem}`;
}

/** Formats 24h HH:mm (e.g. from Ticketmaster) as "8:00 AM". */
export function formatEventTimeFrom24h(hours: number, minutes: number): string {
  const meridiem: 'AM' | 'PM' = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return formatEventTimeDisplay({ hour12, minutes, meridiem });
}

export function parseEventTimeValue(value: string): ParsedEventTime | null {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const twentyFourHourMatch = normalized.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    const hours = Number(twentyFourHourMatch[1]);
    const minutes = Number(twentyFourHourMatch[2]);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }
    return {
      hour12: hours % 12 || 12,
      minutes,
      meridiem: hours >= 12 ? 'PM' : 'AM',
    };
  }

  const twelveHourMatch = normalized.match(/^(\d{1,2}):(\d{2})\s*([APap][Mm])\.?$/);
  if (twelveHourMatch) {
    const hour12 = Number(twelveHourMatch[1]);
    const minutes = Number(twelveHourMatch[2]);
    if (Number.isNaN(hour12) || Number.isNaN(minutes)) {
      return null;
    }
    const meridiem = twelveHourMatch[3].toUpperCase() === 'PM' ? 'PM' : 'AM';
    return { hour12: hour12 % 12 || 12, minutes, meridiem };
  }

  return null;
}

export function parsedTimeFromDate(date: Date): ParsedEventTime {
  const hours = date.getHours();
  return {
    hour12: hours % 12 || 12,
    minutes: date.getMinutes(),
    meridiem: hours >= 12 ? 'PM' : 'AM',
  };
}

export const HOUR12_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);

export const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, index) => index);

export const MERIDIEM_OPTIONS: ParsedEventTime['meridiem'][] = ['AM', 'PM'];
