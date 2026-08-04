export function formatNaira(amount: number): string {
  const rounded = Math.round(amount);
  return `₦${rounded.toLocaleString('en-NG')}`;
}
