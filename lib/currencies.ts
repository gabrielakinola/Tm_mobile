export const DEFAULT_CURRENCY = 'USD';

export const CURRENCY_OPTIONS = [
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'GBP', value: 'GBP' },
  { label: 'CAD', value: 'CAD' },
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  GBP: '£',
  EUR: '€',
  CAD: '$',
};

export function normalizeCurrency(currency?: string | null): string {
  const code = (currency || DEFAULT_CURRENCY).trim().toUpperCase() || DEFAULT_CURRENCY;
  return CURRENCY_OPTIONS.some((option) => option.value === code) ? code : DEFAULT_CURRENCY;
}

export function currencySymbol(currency?: string | null): string {
  return CURRENCY_SYMBOLS[normalizeCurrency(currency)] ?? '$';
}

export function formatCurrencyAmount(amount: number, currency?: string | null): string {
  return `${currencySymbol(currency)}${amount.toFixed(2)}`;
}
