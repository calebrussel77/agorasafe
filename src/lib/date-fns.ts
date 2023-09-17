import { add, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDateToString = (
  date: Date | number | string,
  stringFormat = 'yyyy-MM-dd'
) => {
  return format(new Date(date), stringFormat, { locale: fr });
};

export const addDurationToDate = (
  date: Date | number | string,
  duration: Duration
) => {
  return add(new Date(date), duration);
};
