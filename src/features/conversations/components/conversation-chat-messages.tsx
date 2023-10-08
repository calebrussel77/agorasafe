import { Loader2, ServerCrash } from 'lucide-react';
import { type Session } from 'next-auth';
import { type ElementRef, Fragment, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { FadeAnimation } from '@/components/ui/fade-animation';

import {
  dateIsAfter,
  dateToReadableString,
  formatDateRelative,
} from '@/lib/date-fns';

import { socketEventsKey } from '@/server/api/constants';
import { type SimpleProfile } from '@/server/api/modules/profiles';

import { useConversationChatScroll } from '../hooks/use-conversation-chat-scroll';
import { useConversationChatSocket } from '../hooks/use-conversation-chat-socket';
import { useGetInfiniteDirectMessages } from '../services';
import { ConversationChatItem } from './conversation-chat-item';
import { ConversationChatWelcome } from './conversation-chat-welcome';

type ConversationChatMessagesProps = React.PropsWithChildren<{
  name: string;
  profile: SimpleProfile;
  socketUrl: string;
  conversationId: string;
  session: Session;
}>;

const ConversationChatMessages = ({
  name,
  profile,
  conversationId,
  session,
  socketUrl,
}: ConversationChatMessagesProps) => {
  const updateEventKey = socketEventsKey['updateDirectMessage'](conversationId);
  const createEventKey = socketEventsKey['createDirectMessage'](conversationId);

  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);

  const {
    directMessages,
    groupedDirectMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useGetInfiniteDirectMessages({ conversationId });

  useConversationChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage as never,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: directMessages?.length ?? 0,
  });

  useConversationChatSocket({ conversationId, createEventKey, updateEventKey });

  if (status === 'loading') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500">Chargement des messages...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500">Une erreur s'est produite!</p>
      </div>
    );
  }

  return (
    <div
      ref={chatRef}
      className="flex w-full flex-1 flex-col overflow-y-auto py-3"
    >
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ConversationChatWelcome name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="my-4 h-6 w-6 animate-spin text-zinc-500" />
          ) : (
            <Button
              onClick={() => void fetchNextPage()}
              variant="ghost"
              className="my-4 text-xs text-zinc-500 hover:text-zinc-600"
            >
              Charger les messages précédents
            </Button>
          )}
        </div>
      )}
      <div className="mt-auto">
        {Array.from(groupedDirectMessages).map(([date, messages]) => {
          return (
            <Fragment key={date}>
              {/* display date */}
              <div className="my-4 flex w-full items-center justify-center">
                <div className="block w-full flex-1 bg-gray-200 py-[0.5px]" />
                <span className="border border-gray-200 bg-white px-3 py-1 text-sm">
                  {dateToReadableString(date)}
                </span>
                <div className="block w-full flex-1 bg-gray-200 py-[0.5px]" />
              </div>

              {/* display messages */}
              <div className="">
                {messages?.map((message, idx) => {
                  return (
                    <FadeAnimation
                      isVisible={true}
                      key={message.id}
                      from={{ opacity: 0, y: -10 }}
                      duration={300 + idx * 4}
                    >
                      <ConversationChatItem
                        session={session}
                        id={message.id}
                        connectedProfile={profile}
                        profile={message.profile}
                        content={message.content || ''}
                        fileUrl={message.fileUrl}
                        isDeleted={!!message.deletedAt}
                        timestamp={formatDateRelative(message.createdAt)}
                        isUpdated={dateIsAfter(
                          message.updatedAt,
                          message.createdAt
                        )}
                        socketUrl={socketUrl}
                        socketQuery={{
                          conversationId,
                          directMessageId: message.id,
                        }}
                      />
                    </FadeAnimation>
                  );
                })}
              </div>
            </Fragment>
          );
        })}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export { ConversationChatMessages };
