export function parseMinTicketsPerTransfer(value: string): number | null {
  const normalized = value.replace(/[^\d]/g, '');
  if (!normalized) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
}

export function ticketCountLabel(count: number): string {
  return count === 1 ? '1 ticket' : `${count} tickets`;
}
