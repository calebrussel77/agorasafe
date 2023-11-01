import { useMountedState } from 'react-use';

import { formatDateDistance, formatYearMonthDay } from '@/lib/date-fns';

export const DaysFromNow = ({
  date,
  addSuffix = true,
  inUtc = false,
}: Props) => {
  //   const day = inUtc ? dayjs.utc(date) : dayjs(date);

  // TODO: support formatting
  const datetime = formatYearMonthDay(date);
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <time title={datetime} dateTime={datetime}>
      {formatDateDistance(date, new Date(), { addSuffix })}
    </time>
  );
};

type Props = {
  date: Date | number | string;
  addSuffix?: boolean;
  inUtc?: boolean;
};
