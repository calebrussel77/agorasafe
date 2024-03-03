/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MainLayout } from '@/layouts';
import { type ReactElement } from 'react';

import { CenterContent } from '@/components/ui/layout';
import { Spinner } from '@/components/ui/spinner';

import {
  CustomerAnalyticsDashboard,
  ProviderAnalyticsDashboard,
} from '@/features/analytics';
import { ContentTitle, MainContent, Sidebar } from '@/features/user-dashboard';

import { api } from '@/utils/api';

import { decreaseDate, getSubDate, increaseDate } from '@/lib/date-fns';

import { createServerSideProps } from '@/server/utils/server-side';

import { useCurrentUser } from '@/hooks/use-current-user';

type PageProps = Prettify<InferNextProps<typeof getServerSideProps>>;

const DashboardPage = ({ profile }: PageProps) => {
  const isCustomer = profile.type === 'CUSTOMER';

  // const totalPageviews = pageviews.reduce((acc, curr) => {
  //   return (
  //     acc +
  //     curr.events.reduce((acc, curr) => {
  //       return acc + Object.values(curr)[0]!;
  //     }, 0)
  //   );
  // }, 0);

  // const avgVisitorsPerDay = (totalPageviews / TRACKING_DAYS).toFixed(1);

  // const amtVisitorsToday = pageviews
  //   .filter(ev => ev.date === getSubDate())
  //   .reduce((acc, curr) => {
  //     return (
  //       acc +
  //       curr.events.reduce((acc, curr) => acc + Object.values(curr)[0]!, 0)
  //     );
  //   }, 0);

  return (
    <>
      <MainContent>
        <ContentTitle>Tableau de bord</ContentTitle>
        <div className="relative mx-auto mt-6 w-full max-w-6xl px-4 text-white">
          {isCustomer ? (
            <CustomerAnalyticsDashboard />
          ) : (
            <ProviderAnalyticsDashboard />
          )}
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
  resolver: ({ ctx, ssg, profile, session }) => {
    if (!session || !profile) return { notFound: true };
    return { props: { profile, session } };
  },
});

export default DashboardPage;
