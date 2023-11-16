import { MainLayout } from '@/layouts';
import { type ReactElement } from 'react';

import { ContentTitle, MainContent, Sidebar } from '@/features/user-dashboard';

import { createServerSideProps } from '@/server/utils/server-side';

type PageProps = Prettify<InferNextProps<typeof getServerSideProps>>;

const NotificationsPage = ({ profile, session }: PageProps) => {
  return (
    <>
      <MainContent>
        <ContentTitle>Notifications</ContentTitle>
        <div className="mt-6">
          <p>
            Je suis mes messages. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Sit sapiente.
          </p>
        </div>
      </MainContent>
    </>
  );
};

NotificationsPage.getLayout = function getLayout(
  page: ReactElement<PageProps>
) {
  const profile = page?.props?.profile;
  const pageTitle = `Notifications - ${profile?.name}`;
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

export default NotificationsPage;
