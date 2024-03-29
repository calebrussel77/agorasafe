import {
  add,
  format,
  formatDistance,
  formatRelative,
  isAfter,
  isBefore,
  parseISO,
  sub,
} from 'date-fns';
import { fr } from 'date-fns/locale';

import { invariant } from '../utils/misc';
import { isString } from '../utils/type-guards';

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

/**
 * Add the specified years, months, weeks, days, hours, minutes and seconds to the given date.
 * @param date
 * @param duration
 * @returns
 */
export const increaseDate = (
  date: Date | number | string,
  duration: Duration
) => {
  return add(new Date(date), duration);
};

/**
 * Subtract the specified years, months, weeks, days, hours, minutes and seconds from the given date.
 * @param date
 * @param duration
 * @returns date
 */
export const decreaseDate = (
  date: Date | number | string,
  duration: Duration
) => {
  return sub(new Date(date), duration);
};

export const formatDateDistance = (
  date: Date | number | string | undefined,
  baseDate: number | Date = new Date(),
  { addSuffix } = { addSuffix: true }
) => {
  if (!date) return '';
  return formatDistance(new Date(date), baseDate, { locale: fr, addSuffix });
};

export const formatDateRelative = (
  date: Date | number | string | undefined,
  baseDate: number | Date = new Date()
) => {
  if (!date) return '';
  return formatRelative(new Date(date), baseDate, { locale: fr });
};

/**
 * Check if the first date `before` the second one?
 * @param date
 * @param dateToCompare
 * @returns
 */
export const dateIsBefore = (
  date: Date | number | undefined,
  dateToCompare: number | Date
) => {
  invariant(date, 'Date no definie');
  invariant(dateToCompare, 'Date à comparée non definie');
  const parsedDate = isString(date) ? parseISO(date) : date;
  const parsedDateToCompare = isString(dateToCompare)
    ? parseISO(dateToCompare)
    : dateToCompare;

  return isBefore(parsedDate, parsedDateToCompare);
};

/**
 * Check if the first date `after` the second one?
 * @param date
 * @param dateToCompare
 * @returns
 */
export const dateIsAfter = (
  date: Date | number | string | undefined,
  dateToCompare: number | Date | string | undefined
) => {
  invariant(date, 'Date non definie');
  invariant(dateToCompare, 'Date à comparée non definie');
  const parsedDate = isString(date) ? parseISO(date) : date;
  const parsedDateToCompare = isString(dateToCompare)
    ? parseISO(dateToCompare)
    : dateToCompare;

  return isAfter(parsedDate, parsedDateToCompare);
};
