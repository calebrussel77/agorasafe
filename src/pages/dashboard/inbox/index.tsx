/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SOCKET_API_BASE_URL } from '@/constants';
import { MainLayout } from '@/layouts';
import { type ElementRef, type ReactElement, useRef } from 'react';
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

type PageProps = Prettify<InferNextProps<typeof getServerSideProps>>;

const InboxPage = ({
  profile,
  otherProfile,
  session,
  conversationId,
  profileId,
}: PageProps) => {
  const canDisplayConversationDetails =
    profileId && otherProfile && conversationId;
  const bottomRef = useRef<ElementRef<'div'>>(null);

  return (
    <>
      {canDisplayConversationDetails && (
        <>
          <ConversationChatHeader user={<User profile={otherProfile} />} />
          <ConversationChatMessages
            session={session}
            socketUrl={`${SOCKET_API_BASE_URL}/direct-messages`}
            name={otherProfile?.name}
            profile={profile}
            conversationId={conversationId}
            bottomRef={bottomRef}
          />
          <ConversationChatFooter
            name={otherProfile?.name}
            bottomRef={bottomRef}
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
    </>
  );
};

InboxPage.getLayout = function getLayout(page: ReactElement<PageProps>) {
  const profile = page?.props?.profile;
  const session = page?.props?.session;
  const profileId = page?.props?.profileId;
  const pageTitle = `Messagerie personnelle - ${profile?.name}`;

  return (
    <MainLayout title={pageTitle} footer={null}>
      <Sidebar />
      <MainContent className="my-0">
        <ConversationsWrapper
          conversationList={
            <ConversationList
              profileId={profileId}
              session={session}
              profile={profile}
            />
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
  resolver: async ({ ctx, profile, session }) => {
    if (!session || !profile)
      return { redirect: { destination: '/', permanent: false } };

    const result = querySchema.safeParse(ctx.query);
    let otherProfile = null;
    let conversationId = null;
    let profileTwoId = null;

    if (result?.success && result.data.profileId) {
      profileTwoId = result.data.profileId;

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

    return {
      props: {
        profile,
        session,
        otherProfile,
        conversationId,
        profileId: profileTwoId,
      },
    };
  },
});

export default InboxPage;
