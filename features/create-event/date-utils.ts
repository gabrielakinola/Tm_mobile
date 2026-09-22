/** Display format used in create/edit event date fields: "Sat, Jul 01, 2026" */
export function formatEventDateDisplay(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatEventDateFromIso(value: string): string {
  if (!value) return '';
  const parsed = parseEventDateValue(value);
  return parsed ? formatEventDateDisplay(parsed) : value;
}

const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

export function parseEventDateValue(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  // ISO date: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const date = new Date(`${trimmed}T12:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  // "Fri, Aug 21, 2026" | "Aug 21, 2026" | "Friday, August 21, 2026"
  const namedMatch = trimmed.match(
    /^(?:[A-Za-z]{3,9},?\s+)?([A-Za-z]{3,9})\s+(\d{1,2}),?\s+(\d{4})$/,
  );
  if (namedMatch) {
    const month = MONTH_INDEX[namedMatch[1].slice(0, 3).toLowerCase()];
    const day = Number(namedMatch[2]);
    const year = Number(namedMatch[3]);
    if (month !== undefined && Number.isFinite(day) && Number.isFinite(year)) {
      return new Date(year, month, day, 12, 0, 0);
    }
  }

  // Display format / other parseable strings
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
}

export function toIsoDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isSameCalendarDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1, 12, 0, 0);
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount, 12, 0, 0);
}

export function getCalendarCells(month: Date): (Date | null)[] {
  const first = startOfMonth(month);
  const startWeekday = first.getDay(); // 0 Sun
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [];

  for (let i = 0; i < startWeekday; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), day, 12, 0, 0));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}
