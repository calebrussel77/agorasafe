/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SOCKET_API_BASE_URL } from '@/constants';
import { MainLayout } from '@/layouts';
import { type ElementRef, type ReactElement, useRef } from 'react';
import { z } from 'zod';

import { EmptyState } from '@/components/ui/empty-state';
import { Icons } from '@/components/ui/icons';
import { CenterContent } from '@/components/ui/layout';
import { Spinner } from '@/components/ui/spinner';
import { User } from '@/components/user';

import {
  ConversationChatFooter,
  ConversationChatHeader,
  ConversationChatMessages,
  ConversationList,
  ConversationsWrapper,
} from '@/features/conversations';
import { MainContent, Sidebar } from '@/features/user-dashboard';

import { api } from '@/utils/api';

import { createServerSideProps } from '@/server/utils/server-side';

type PageProps = Prettify<InferNextProps<typeof getServerSideProps>>;

const InboxPage = ({
  session,
  profile,
  profileOneId,
  profileTwoId,
}: PageProps) => {
  const bottomRef = useRef<ElementRef<'div'>>(null);

  const { data, isInitialLoading } = api.conversations.getOrCreate.useQuery(
    {
      profileOneId,
      profileTwoId: profileTwoId ?? '',
    },
    { enabled: !!profileTwoId }
  );

  const otherProfile =
    data?.profileOne?.id === profile?.id ? data.profileTwo : data?.profileOne;

  const canDisplayConversationDetails =
    profileTwoId && otherProfile && data?.id;

  if (isInitialLoading)
    return (
      <CenterContent>
        <Spinner variant="ghost" />
      </CenterContent>
    );

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
            conversationId={data?.id}
            bottomRef={bottomRef}
          />
          <ConversationChatFooter
            name={otherProfile?.name}
            bottomRef={bottomRef}
            socketUrl={`${SOCKET_API_BASE_URL}/direct-messages`}
            query={{ conversationId: data?.id }}
          />
        </>
      )}
      {!isInitialLoading && (!profileTwoId || !data) && (
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
  const profileId = page?.props?.profileTwoId;
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
  resolver: async ({ ctx, profile, session, ssg }) => {
    if (!session || !profile)
      return { redirect: { destination: '/', permanent: false } };

    const result = querySchema.safeParse(ctx.query);

    if (!result?.success) {
      return { redirect: { destination: '/', permanent: false } };
    }

    if (ssg && result?.data?.profileId) {
      await ssg.conversations.getOrCreate.prefetch({
        profileOneId: profile.id,
        profileTwoId: result?.data?.profileId,
      });
    }

    return {
      props: {
        profile,
        session,
        profileOneId: profile.id,
        profileTwoId: result?.data?.profileId || null,
      },
    };
  },
});

export default InboxPage;
