import { MainLayout } from '@/layouts';
import { type ReactElement } from 'react';

import { ContentTitle, MainContent, Sidebar } from '@/features/user-dashboard';

import { createServerSideProps } from '@/server/utils/server-side';

type PageProps = Prettify<InferNextProps<typeof getServerSideProps>>;

const DashboardPage = ({ profile, session }: PageProps) => {
  return (
    <>
      <MainContent>
        <ContentTitle>Tableau de bord</ContentTitle>
        <div className="mt-6">
          <p>
            Cette page est encore en cours de developpement.
          </p>
        </div>
      </MainContent>
    </>
  );
};

DashboardPage.getLayout = function getLayout(page: ReactElement<PageProps>) {
  const profile = page?.props?.profile;
  const pageTitle = `Tableau de bord - ${profile?.name}`;
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

export default DashboardPage;
