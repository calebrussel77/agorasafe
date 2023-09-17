import { formatNumberToText } from '@/utils/text';

import { formatDateToString } from '@/lib/date-fns';

export const getFormattedDatePeriod = (
  date: Date | undefined,
  startHour: number | undefined
) => {
  if (!date || !startHour) return '';
  return (
    formatDateToString(date, 'PPP') +
    ' à ' +
    formatNumberToText(startHour, 'hours')
  );
};

export const getFormattedDuration = (
  nbreOfHours: number | null | undefined
) => {
  if (!nbreOfHours) return 'Non défini';

  return formatNumberToText(nbreOfHours, 'hours');
};

export const getFomattedProviderNeeded = (
  nbreProviderNeeded: number | undefined | null
) => {
  if (!nbreProviderNeeded) return '1 Prestataire';

  if (nbreProviderNeeded === 1) return `${nbreProviderNeeded} Prestataire`;

  return `${nbreProviderNeeded} Prestataires`;
};
