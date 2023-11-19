import { MainLayout } from '@/layouts';
import { LucideDoorClosed, Search } from 'lucide-react';
import { type ReactElement, useState } from 'react';

import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs } from '@/components/ui/tabs';

import {
  ServiceRequestButton,
  UserServiceRequestCard,
} from '@/features/service-requests';
import { ContentTitle, MainContent, Sidebar } from '@/features/user-dashboard';

import { api } from '@/utils/api';

import { createServerSideProps } from '@/server/utils/server-side';

type PageProps = Prettify<InferNextProps<typeof getServerSideProps>>;

const mapEmptyMessageStatus = {
  ALL: "Vous n'avez créé aucune demande de service.",
  OPEN: "Vous n'avez aucune demande de service en cours.",
  CLOSED: "Vous n'avez aucune demande de service terminée.",
} as const;

const MyRequestsPage = ({ profile, session }: PageProps) => {
  const [status, setStatus] =
    useState<keyof typeof mapEmptyMessageStatus>('ALL');

  const [search, setSearch] = useState('');

  //TODO: Need to add infinite scroll to
  const { data, error, refetch, isLoading } =
    api.serviceRequests.getAll.useQuery({
      authorId: profile?.id,
      status: status,
      query: search,
    });

  return (
    <>
      <MainContent>
        <ContentTitle>Mes demandes</ContentTitle>
        <div className="mt-10 flex flex-wrap items-center space-y-3 px-4 lg:space-x-3 lg:space-y-0">
          <DebouncedInput
            value={search}
            type="search"
            onChange={event => setSearch(event.target.value)}
            iconAfter={<Search className="h-4 w-4" />}
            placeholder="Recherchez parmi mes demandes de service..."
            classNames={{ root: 'lg:max-w-md w-full' }}
          />
          <Tabs
            defaultValue="ALL"
            className="w-[500px]"
            onValueChange={setStatus as never}
          >
            <Tabs.List>
              <Tabs.Trigger value="ALL">Toutes</Tabs.Trigger>
              <Tabs.Trigger value="OPEN">En cours</Tabs.Trigger>
              <Tabs.Trigger value="CLOSED">Terminées</Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </div>
        <Container className="mt-10 space-y-16">
          <AsyncWrapper
            isLoading={isLoading}
            error={error}
            onRetryError={refetch}
          >
            {data?.serviceRequests && data?.serviceRequests?.length > 0 ? (
              <div className="mx-auto grid w-full max-w-5xl space-y-3">
                {data?.serviceRequests?.map(serviceRequest => {
                  return (
                    <UserServiceRequestCard
                      key={serviceRequest?.id}
                      className="w-full"
                      serviceRequest={serviceRequest}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={<LucideDoorClosed />}
                description={
                  search
                    ? `Aucun résultat trouvé pour " ${search} "`
                    : mapEmptyMessageStatus[status]
                }
                primaryAction={
                  <ServiceRequestButton>
                    <Button size="sm">Créer ma demande</Button>
                  </ServiceRequestButton>
                }
              />
            )}
          </AsyncWrapper>
        </Container>
      </MainContent>
    </>
  );
};

MyRequestsPage.getLayout = function getLayout(page: ReactElement<PageProps>) {
  const profile = page?.props?.profile;
  const pageTitle = `Mes demandes - ${profile?.name}`;
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
  resolver: async ({ ctx, ssg, profile, session }) => {
    if (!session || !profile) return { notFound: true };

    //TODO: Need to add infinite scroll to
    if (ssg) {
      await ssg?.serviceRequests.getAll.prefetch({
        authorId: profile?.id,
        status: 'ALL',
      });
    }
    return { props: { profile, session } };
  },
});

export default MyRequestsPage;
