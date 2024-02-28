import { useMemo } from 'react';

import { api } from '@/utils/api';

import { type GetInfiniteReviewsInput } from '../types';

export const useGetInfiniteReviews = (
  filters: GetInfiniteReviewsInput,
  options?: { keepPreviousData?: boolean; enabled?: boolean }
) => {
  const { data, ...rest } = api.reviews.getInfinite.useInfiniteQuery(
    { ...filters },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
      trpc: { context: { skipBatch: true } },
      keepPreviousData: true,
      ...options,
    }
  );

  const reviews = useMemo(
    () => data?.pages.flatMap(x => x.items) ?? [],
    [data]
  );

  return { data, reviews, ...rest };
};
