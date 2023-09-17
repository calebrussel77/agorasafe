import { type ServiceRequestStatus } from '@prisma/client';

export const generateHoursBetweenSevenAmAndtwentyOnePm = () =>
  Array.from({ length: 42 }, (_, index) => index / 2 + 0.5)?.slice(13);

export const mapServiceRequestStatusToString = (
  status: ServiceRequestStatus | null | undefined
) => {
  if (status === 'OPEN') return 'Ouvert';
  if (status === 'CLOSED') return 'Fermé';
  return '';
};
