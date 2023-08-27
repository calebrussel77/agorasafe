import { add, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDateToString = (
  date: Date | number | string | undefined,
  stringFormat = 'yyyy-MM-dd'
) => {
  return date
    ? format(new Date(date), stringFormat, { locale: fr })
    : undefined;
};

export const addDurationToDate = (
  date: Date | number | string,
  duration: Duration
) => {
  return date ? add(new Date(date), duration) : undefined;
};
