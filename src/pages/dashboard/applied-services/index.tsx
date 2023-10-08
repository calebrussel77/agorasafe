import { MainLayout } from '@/layouts';
import { type InferGetServerSidePropsType } from 'next';
import { type ReactElement } from 'react';

import { ContentTitle, MainContent, Sidebar } from '@/features/user-dashboard';

import { createServerSideProps } from '@/server/utils/server-side';

type AppliedServicesPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const AppliedServicesPage = ({
  profile,
  session,
}: AppliedServicesPageProps) => {
  return (
    <>
      <MainContent>
        <ContentTitle>Services postulés</ContentTitle>
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

AppliedServicesPage.getLayout = function getLayout(
  page: ReactElement<AppliedServicesPageProps>
) {
  const profile = page?.props?.profile;
  const pageTitle = `Services postulés - ${profile?.name}`;
  const pageDescription = `Services postulés - ${profile?.name}`;
  return (
    <MainLayout title={pageTitle} description={pageDescription}>
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

export default AppliedServicesPage;
