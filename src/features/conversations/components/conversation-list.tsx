import { ServerCrash } from 'lucide-react';
import { type Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { Anchor } from '@/components/anchor';
import { InViewLoader } from '@/components/in-view/in-view-loader';
import { EmptyState } from '@/components/ui/empty-state';
import { Icons } from '@/components/ui/icons';
import { CenterContent } from '@/components/ui/layout';
import { Spinner } from '@/components/ui/spinner';

import { formatDateDistance } from '@/lib/date-fns';
import { cn } from '@/lib/utils';

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { useGetInfiniteConversations } from '../services';
import { ConversationListItem } from './conversation-list-item';

type ConversationListProps = React.PropsWithChildren<{
  profile: SimpleProfile;
  session: Session;
  profileId?: string | null;
}>;

const ConversationList = ({
  profile,
  session,
  profileId,
}: ConversationListProps) => {
  const router = useRouter();
  const profileIdQuery = profileId || router?.query?.profileId;

  const { conversations, fetchNextPage, hasNextPage, isRefetching, status } =
    useGetInfiniteConversations({ profileId: profile?.id });

  if (status === 'loading') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Spinner className="my-4" variant="ghost" />
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
          // const lastMessageUser =
          //   lastMessage?.profileId === profile.id
          //     ? 'Vous:'
          //     : `${otherProfile?.name}:`;

          const lastMessageContent = !lastMessage?.content
            ? '...'
            : !isLastMessageDeleted
            ? `${lastMessage?.content}`
            : lastMessage?.content;

          return (
            <Anchor
              key={conversation.id}
              href={`/dashboard/inbox?profileId=${otherProfile?.id}`}
              className={cn(
                'block w-full',
                otherProfile?.id === profileIdQuery && 'bg-black/5'
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
            </Anchor>
          );
        })}
        {hasNextPage && (
          <InViewLoader loadFn={fetchNextPage} loadCondition={!isRefetching}>
            <CenterContent className="my-3">
              <Spinner variant="ghost" />
            </CenterContent>
          </InViewLoader>
        )}
        {conversations?.length === 0 && (
          <EmptyState
            className="mt-6 px-3"
            icon={<Icons.message />}
            name="Vous n'avez pas de conversations"
            description="Commencez à discuter avec des personnes."
          />
        )}
      </div>
    </div>
  );
};

export { ConversationList };
