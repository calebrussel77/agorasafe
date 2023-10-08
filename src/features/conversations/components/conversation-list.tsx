import { Loader2, ServerCrash } from 'lucide-react';
import { type Session } from 'next-auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { CenterContent } from '@/components/ui/layout';

import { formatDateDistance } from '@/lib/date-fns';
import { cn } from '@/lib/utils';

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { useGetInfiniteConversations } from '../services';
import { ConversationListItem } from './conversation-list-item';

type ConversationListProps = React.PropsWithChildren<{
  profile: SimpleProfile;
  session: Session;
}>;

const ConversationList = ({ profile, session }: ConversationListProps) => {
  const router = useRouter();
  const profileId = router?.query?.profileId as string;
  const { ref, inView: isInView } = useInView();

  const {
    conversations,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    status,
  } = useGetInfiniteConversations({ profileId: profile?.id });

  useEffect(() => {
    if (isInView && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, isInView, isFetchingNextPage]);

  if (status === 'loading') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500">Chargement des conversations...</p>
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
    <div className="flex w-full flex-1 flex-col overflow-y-auto py-3">
      <div className="mt-auto divide-y divide-gray-200">
        {conversations?.map(conversation => {
          const otherProfile =
            conversation?.profileOneId === profile.id
              ? conversation?.profileTwo
              : conversation?.profileOne;

          const lastMessage = conversation?.directMessages[0];
          const isLastMessageDeleted = !!lastMessage?.deletedAt;
          const lastMessageUser =
            lastMessage?.profileId === profile.id
              ? 'Vous:'
              : `${otherProfile?.name}:`;

          const lastMessageContent = !isLastMessageDeleted
            ? `${lastMessageUser} ${lastMessage?.content}`
            : lastMessage?.content;

          return (
            <Link
              key={conversation.id}
              href={`/dashboard/inbox?profileId=${otherProfile?.id}`}
              className={cn(
                'block w-full',
                otherProfile?.id === profileId && 'bg-black/5'
              )}
            >
              <ConversationListItem
                session={session}
                connectedProfile={profile}
                profile={otherProfile}
                timestamp={formatDateDistance(lastMessage?.createdAt)}
                lastMessage={lastMessageContent}
                isLastMessageDeleted={isLastMessageDeleted}
              />
            </Link>
          );
        })}
        {hasNextPage && !isLoading && !isRefetching && (
          <CenterContent ref={ref} className="mt-3">
            {isInView && (
              <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
            )}
          </CenterContent>
        )}
      </div>
    </div>
  );
};

export { ConversationList };
