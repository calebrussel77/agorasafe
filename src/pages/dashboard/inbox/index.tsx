/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SOCKET_API_BASE_URL } from '@/constants';
import { MainLayout } from '@/layouts';
import { type InferGetServerSidePropsType } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { type ReactElement } from 'react';
import { z } from 'zod';

import { EmptyState } from '@/components/ui/empty-state';
import { Icons } from '@/components/ui/icons';
import { User } from '@/components/user';

import {
  ConversationChatFooter,
  ConversationChatHeader,
  ConversationChatMessages,
  ConversationList,
  ConversationsWrapper,
} from '@/features/conversations';
import { MainContent, Sidebar } from '@/features/user-dashboard';

import { cn } from '@/lib/utils';

import { getOrCreateConversation } from '@/server/api/modules/conversations';
import { createServerSideProps } from '@/server/utils/server-side';

type InboxPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const InboxPage = ({
  profile,
  otherProfile,
  session,
  conversationId,
}: InboxPageProps) => {
  const query = useSearchParams();
  const profileId = query.get('profileId') as string;
  const canDisplayConversationDetails =
    profileId && otherProfile && conversationId;

  return (
    <>
      <div
        className={cn(
          'flex h-full w-full flex-1 flex-col',
          !profileId && 'items-center justify-center'
        )}
      >
        {canDisplayConversationDetails && (
          <>
            <ConversationChatHeader user={<User profile={otherProfile} />} />
            <ConversationChatMessages
              session={session}
              socketUrl={`${SOCKET_API_BASE_URL}/direct-messages`}
              name={otherProfile?.name}
              profile={profile}
              conversationId={conversationId}
            />
            <ConversationChatFooter
              name={otherProfile?.name}
              socketUrl={`${SOCKET_API_BASE_URL}/direct-messages`}
              query={{ conversationId }}
            />
          </>
        )}
        {!profileId && (
          <EmptyState
            className="px-3"
            icon={<Icons.message />}
            name="Aucune conversation selectionnée"
            description="Veuillez selectionner une conversation pour commencer."
          />
        )}
      </div>
    </>
  );
};

InboxPage.getLayout = function getLayout(page: ReactElement<InboxPageProps>) {
  const profile = page?.props?.profile;
  const session = page?.props?.session;
  const pageTitle = `Messagerie personnelle - ${profile?.name}`;

  return (
    <MainLayout title={pageTitle} footer={null}>
      <Sidebar />
      <MainContent className="my-0">
        <ConversationsWrapper
          conversationList={
            <ConversationList session={session} profile={profile} />
          }
          conversationDetails={page}
        />
      </MainContent>
    </MainLayout>
  );
};

const querySchema = z.object({
  profileId: z.string().optional(),
});

export const getServerSideProps = createServerSideProps({
  shouldUseSSG: true,
  shouldUseSession: true,
  resolver: async ({ ctx, profile, session, ssg }) => {
    if (!session || !profile)
      return { redirect: { destination: '/', permanent: false } };

    const result = querySchema.safeParse(ctx.query);
    let otherProfile = null;
    let conversationId = null;

    if (result?.success && result.data.profileId) {
      const profileTwoId = result.data.profileId;

      const conversation = await getOrCreateConversation({
        inputs: { profileOneId: profile.id, profileTwoId },
      });

      if (!conversation) {
        return { redirect: { destination: '/', permanent: false } };
      }

      const { profileOne, profileTwo, id } = conversation;

      otherProfile = profileOne?.id === profile?.id ? profileTwo : profileOne;
      conversationId = id;
    }

    return { props: { profile, session, otherProfile, conversationId } };
  },
});

export default InboxPage;
