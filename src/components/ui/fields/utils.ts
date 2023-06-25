import { makeRandomId } from '@/utils/misc';

/* eslint-disable no-undef */
const TYPES: { [key: string]: string } = {
  Checkbox: 'checkbox',
  Radio: 'radio',
  Input: 'input',
  RadioGroup: 'radio',
  DropdownComboBox: 'input',
  DebouncedInput: 'input',
  Switch: 'checkbox',
};

export const getBaseType = (type: string): string => TYPES[type] || type;

type VariantProps = {
  danger?: string | JSX.Element;
  warning?: string | JSX.Element;
  success?: string | JSX.Element;
  info?: string | JSX.Element;
};

export type VariantReturn =
  | 'danger'
  | 'warning'
  | 'success'
  | 'info'
  | undefined;

export const getVariant = ({
  danger,
  info,
  success,
  warning,
}: VariantProps): VariantReturn => {
  if (danger) return 'danger';
  if (warning) return 'warning';
  if (success) return 'success';
  if (info) return 'info';
  return undefined;
};

export const generateRandomId = (): string =>
  `agorasafe-field-${makeRandomId()}}`;
