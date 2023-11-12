import { MainLayout } from '@/layouts';
import { LucideDoorClosed, Search } from 'lucide-react';
import { type ReactElement } from 'react';

import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { EmptyState } from '@/components/ui/empty-state';

import {
  ServiceRequestButton,
  ServiceRequestCard,
} from '@/features/service-requests';
import { ContentTitle, MainContent, Sidebar } from '@/features/user-dashboard';

import { api } from '@/utils/api';

import { createServerSideProps } from '@/server/utils/server-side';

type PageProps = Prettify<InferNextProps<typeof getServerSideProps>>;

const MyRequestsPage = ({ profile, session }: PageProps) => {
  //TODO: Need to add infinite scroll to this
  const { data, error, refetch, isLoading } =
    api.services.getAllServiceRequests.useQuery({});

  return (
    <>
      <MainContent>
        <ContentTitle>Mes demandes</ContentTitle>
        <div className="mt-6">
          <Container className="mt-16">
            <div className="mx-auto w-full max-w-xl">
              <DebouncedInput
                value="sss"
                iconAfter={<Search className="h-4 w-4" />}
                placeholder="Recherchez une demande de sercice..."
                classNames={{ root: 'w-full' }}
              />
            </div>

            <AsyncWrapper
              isLoading={isLoading}
              error={error}
              onRetryError={refetch}
            >
              {data?.serviceRequests && data?.serviceRequests?.length > 0 && (
                <div className="mt-6 grid w-full grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-2 xl:grid-cols-3">
                  {data?.serviceRequests?.map(serviceRequest => {
                    return (
                      <ServiceRequestCard
                        key={serviceRequest?.id}
                        className="w-full"
                        serviceRequest={serviceRequest}
                      />
                    );
                  })}
                </div>
              )}
              {data?.serviceRequests && data?.serviceRequests?.length === 0 && (
                <EmptyState
                  icon={<LucideDoorClosed />}
                  className="my-10"
                  description="Aucune demande publiée pour l'instant."
                  primaryAction={
                    <ServiceRequestButton>
                      <Button size="sm">Créer ma demande</Button>
                    </ServiceRequestButton>
                  }
                />
              )}
            </AsyncWrapper>
          </Container>
        </div>
      </MainContent>
    </>
  );
};

MyRequestsPage.getLayout = function getLayout(page: ReactElement<PageProps>) {
  const profile = page?.props?.profile;
  const pageTitle = `Mes demandes - ${profile?.name}`;
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
  resolver: async ({ ctx, ssg, profile, session }) => {
    if (!session || !profile) return { notFound: true };
    if (ssg) {
      await ssg?.services.getAllServiceRequests.prefetch({});
    }
    return { props: { profile, session } };
  },
});

export default MyRequestsPage;
