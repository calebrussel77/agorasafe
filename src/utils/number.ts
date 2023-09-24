export function abbreviateNumber(value: number): string {
  if (!value) return '0';

  const suffixes = ['', 'k', 'm', 'b', 't'];
  let index = 0;

  while (value >= 1000 && index < suffixes.length - 1) {
    value /= 1000;
    index++;
  }

  const formattedValue = value.toFixed(value < 10 && index > 0 ? 1 : 0);

  return `${formattedValue}${suffixes[index]}`;
}

export function numberWithCommas(value: number | string | undefined) {
  return value &&
    !Number.isNaN(typeof value === 'string' ? parseFloat(value) : value)
    ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '';
}

export function formatPrice(
  price: number | string | undefined | null,
  options: {
    currency?: 'USD' | 'EUR' | 'CFA' | 'BDT';
    notation?: Intl.NumberFormatOptions['notation'];
  } = {}
) {
  if (!price) return '';

  const { currency = 'CFA', notation = 'standard' } = options;

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    notation,
  }).format(Number(price));
}
