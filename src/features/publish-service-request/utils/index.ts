export const generateHoursBetweenSevenAmAndtwentyOnePm = () =>
  Array.from({ length: 42 }, (_, index) => index / 2 + 0.5)?.slice(13);
