import { add, format, formatDistance, formatRelative } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatYearMonthDay = (
  date: Date | number | string,
  stringFormat = 'yyyy-MM-dd'
) => {
  return format(new Date(date), stringFormat, { locale: fr });
};

export const dateToReadableString = (
  date: Date | number | string,
  stringFormat = 'PP'
) => {
  return format(new Date(date), stringFormat, { locale: fr });
};

export const increaseDate = (
  date: Date | number | string,
  duration: Duration
) => {
  return add(new Date(date), duration);
};

export const formatDateDistance = (
  date: Date | number | string | undefined,
  baseDate: number | Date = new Date()
) => {
  if (!date) return '';
  return formatDistance(new Date(date), baseDate, { locale: fr });
};

export const formatDateRelative = (
  date: Date | number | string | undefined,
  baseDate: number | Date = new Date()
) => {
  if (!date) return '';
  return formatRelative(new Date(date), baseDate, { locale: fr });
};
