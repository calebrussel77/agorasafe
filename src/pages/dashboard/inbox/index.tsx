import { MainLayout } from '@/layouts';
import { MessagesSquare } from 'lucide-react';
import { type InferGetServerSidePropsType } from 'next';
import { type ReactElement } from 'react';

import { EmptyState } from '@/components/ui/empty-state';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
  ContentTitle,
  ConversationSidebar,
  MainContent,
  Sidebar,
} from '@/features/user-dashboard';

import { createServerSideProps } from '@/server/utils/server-side';

import { useHeaderHeight } from '@/hooks/use-header-height';

type InboxPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const InboxPage = ({ profile, session }: InboxPageProps) => {
  const { height } = useHeaderHeight();

  return (
    <>
      <MainContent className="my-0">
        <div
          style={{
            height: `calc(100vh - ${height}px)`,
          }}
          className="flex w-full overflow-hidden"
        >
          <ConversationSidebar>
            <ContentTitle className="mt-3 border-transparent">
              Conversations
            </ContentTitle>
          </ConversationSidebar>
          <div className="flex h-full flex-1 items-center justify-center border px-3">
            <EmptyState
              icon={<MessagesSquare />}
              name="Aucune conversation selectionnée"
              description="Veuillez selectionner une conversation dans votre liste"
            />
          </div>
        </div>
      </MainContent>
    </>
  );
};

InboxPage.getLayout = function getLayout(page: ReactElement<InboxPageProps>) {
  const profile = page?.props?.profile;
  const pageTitle = `Messagerie personnelle - ${profile?.name}`;
  return (
    <MainLayout title={pageTitle} footer={null}>
      <Sidebar />
      {page}
    </MainLayout>
  );
};

export const getServerSideProps = createServerSideProps({
  shouldUseSSG: true,
  shouldUseSession: true,
  resolver: ({ ctx, profile, session }) => {
    if (!session || !profile) return { notFound: true };

    return { props: { profile, session } };
  },
});

export default InboxPage;
