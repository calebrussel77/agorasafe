import { useMemo } from 'react';

import { api } from '@/utils/api';

import { type GetInfiniteComments } from '../types';

export const useGetInfiniteComments = (
  filters: GetInfiniteComments,
  options?: { keepPreviousData?: boolean; enabled?: boolean }
) => {
  const { data, ...rest } = api.comments.getInfinite.useInfiniteQuery(
    { ...filters },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
      trpc: { context: { skipBatch: true } },
      keepPreviousData: true,
      ...options,
    }
  );

  const comments = useMemo(
    () => data?.pages.flatMap(x => x.comments) ?? [],
    [data]
  );

  return { data, comments, ...rest };
};
