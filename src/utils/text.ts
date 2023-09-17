import { type CounterInputProps } from '@/components/ui/counter-input';

import { isDecimal } from './type-guards';

export const truncate = (text: string, maxLength: number, ellipsis = true) => {
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength - 3)}${ellipsis ? '...' : ''}`;
};

export const truncateOnWord = (
  text = '',
  maxLength: number,
  ellipsis = true
) => {
  if (text?.length <= maxLength) return text;

  // First split on maxLength chars
  let truncatedText = text?.substring(0, 148);

  // Then split on the last space, this way we split on the last word,
  // which looks just a bit nicer.
  truncatedText = truncatedText.substring(
    0,
    Math.min(truncatedText.length, truncatedText.lastIndexOf(' '))
  );

  if (ellipsis) truncatedText += '...';

  return truncatedText;
};

export const formatNumberToText = (
  value: number,
  variant: CounterInputProps['variant']
) => {
  const numericValue = Number(value);

  if (!numericValue) return '';

  if (variant === 'hours') {
    if (!isDecimal(numericValue)) return `${numericValue}h 00`;

    const intPart = String(value).split('.')[0];
    const decPart = String(value).split('.')[1];
    return `${intPart ? `${intPart}h` : ''} ${
      decPart && Number(decPart) === 5 ? `30` : decPart || '00'
    }`;
  }

  return value.toString();
};

export const deSerialize = <T>(jsonString: string | null) => {
  if (!jsonString) return null;

  return JSON.parse(jsonString) as T;
};

export const serialize = (object: unknown) => {
  return JSON.stringify(object);
};

