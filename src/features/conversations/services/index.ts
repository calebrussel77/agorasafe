import { useSocketStore } from '@/stores/socket-store';
import { useCallback, useMemo } from 'react';

import { api } from '@/utils/api';

import { type GetConversationsInput } from '@/server/api/modules/conversations/conversations.validations';
import { type GetDirectMessagesInput } from '@/server/api/modules/messages';

export const useGetInfiniteDirectMessages = (
  filters: GetDirectMessagesInput,
  options?: { keepPreviousData?: boolean; enabled?: boolean }
) => {
  const { isConnected } = useSocketStore();

  const { data, ...rest } = api.messages.getDirectMessages.useInfiniteQuery(
    { ...filters },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
      trpc: { context: { skipBatch: true } },
      keepPreviousData: true,
      refetchInterval: isConnected ? false : 1000,
      ...options,
    }
  );

  const directMessages = useMemo(
    () => data?.pages.flatMap(x => x.directMessages) ?? [],
    [data]
  );

  const sortDirectMessageByDate = useCallback(
    (entries: typeof directMessages) => {
      return [...entries].sort(
        (a, b) =>
          new Date(a?.createdAt).getTime() - new Date(b?.createdAt).getTime()
      );
    },
    []
  );

  // Groupez les messages par date
  const groupedDirectMessages = new Map<string, typeof directMessages>();

  sortDirectMessageByDate(directMessages).forEach(message => {
    const date = new Date(message?.createdAt).toLocaleDateString('fr', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    if (groupedDirectMessages.has(date)) {
      groupedDirectMessages?.get(date)?.push(message);
    } else {
      groupedDirectMessages.set(date, [message]);
    }
  });

  return { data, directMessages, groupedDirectMessages, ...rest };
};

export const useGetInfiniteConversations = (
  filters: GetConversationsInput,
  options?: { keepPreviousData?: boolean; enabled?: boolean }
) => {
  const { data, ...rest } = api.conversations.getConversations.useInfiniteQuery(
    { ...filters },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
      trpc: { context: { skipBatch: true } },
      keepPreviousData: true,
      ...options,
    }
  );
  const conversations = useMemo(
    () => data?.pages.flatMap(x => x.conversations) ?? [],
    [data]
  );

  return { data, conversations, ...rest };
};
