export type Variant =
  | 'danger'
  | 'system'
  | 'focused'
  | 'info'
  | 'success'
  | 'warning';

export const VARIANTS_COLORS: Record<Variant, string> = {
  danger: 'text-red-500',
  focused: 'text-primary-500',
  info: 'text-brand-600',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  system: 'text-secondary-500',
};

export const VARIANTS_BORDER_COLORS: Record<Variant, string> = {
  danger: 'border-red-500',
  focused: 'border-primary-500',
  info: 'border-green-500',
  success: 'border-green-500',
  warning: 'border-yellow-500',
  system: 'border-secondary-500',
};

export const VARIANTS_CSS_COLORS: Record<Variant, string> = {
  danger: 'rgb(239 68 68 / var(--tw-text-opacity))',
  focused: 'text-primary-500',
  info: 'blue',
  success: 'green',
  warning: 'yellow',
  system: 'blue',
};

export const getVariantCssColor = (variant: Variant) => {
  const key = VARIANTS_CSS_COLORS[variant];
  return key ? key : null;
};

export const getVariantColor = (variant: Variant) => {
  const key = VARIANTS_COLORS[variant];
  return key ? key : null;
};

export const getVariantBorderColor = (variant: Variant) => {
  const key = VARIANTS_BORDER_COLORS[variant];
  return key ? key : null;
};
