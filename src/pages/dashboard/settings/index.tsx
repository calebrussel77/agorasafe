import { MainLayout } from '@/layouts';
import { type ReactElement } from 'react';

import { ContentTitle, MainContent, Sidebar } from '@/features/user-dashboard';

import { createServerSideProps } from '@/server/utils/server-side';

type PageProps = Prettify<InferNextProps<typeof getServerSideProps>>;

const SettingsPage = ({ profile, session }: PageProps) => {
  return (
    <>
      <MainContent>
        <ContentTitle>Paramètres</ContentTitle>
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

SettingsPage.getLayout = function getLayout(page: ReactElement<PageProps>) {
  const profile = page?.props?.profile;
  const pageTitle = `Paramètres - ${profile?.name}`;
  return (
    <MainLayout title={pageTitle}>
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

export default SettingsPage;
