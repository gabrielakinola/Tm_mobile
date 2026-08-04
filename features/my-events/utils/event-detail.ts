export function getSaleLabel(saleLabel: string): string {
  return saleLabel.trim() || 'Standard Ticket';
}

/** Prefer API `location`; otherwise split "Venue — City" style venue strings. */
export function resolveVenueDisplay(
  venue: string,
  location?: string,
): { venue: string; location: string } {
  const trimmedLocation = location?.trim() ?? '';
  if (trimmedLocation) {
    return { venue, location: trimmedLocation };
  }

  const separators = [' — ', ' - ', ' – '];
  for (const separator of separators) {
    const index = venue.indexOf(separator);
    if (index > 0) {
      return {
        venue: venue.slice(0, index).trim(),
        location: venue.slice(index + separator.length).trim(),
      };
    }
  }

  return { venue, location: '' };
}
