import { LucideDoorClosed, Search } from 'lucide-react';

import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { EmptyState } from '@/components/ui/empty-state';
import { Seo } from '@/components/ui/seo';

import {
  ServiceRequestButton,
  ServiceRequestCard,
  ServiceRequestsHero,
} from '@/features/service-requests';

import { api } from '@/utils/api';

import { createServerSideProps } from '@/server/utils/server-side';

import { type AppPageProps } from '../_app';

const ServiceRequestsPage: AppPageProps['Component'] = () => {
  //TODO: Need to add infinite scroll to this
  const { data, error, refetch, isLoading } =
    api.services.getAllServiceRequests.useQuery({});

  return (
    <>
      <Seo
        title="Nos Demandes de service"
        description="Découvrez une multitude de demandes de service sur Agorasafe. Trouvez des prestataires qualifiés et explorez des opportunités passionnantes. Simplifiez la manière de satisfaire vos besoins ou de développer votre entreprise."
      />
      <ServiceRequestsHero />
      <Container className="mt-16 space-y-10">
        <DebouncedInput
          value=""
          placeholder="Recherchez une demande de service..."
          iconAfter={<Search className="h-4 w-4" />}
          classNames={{ root: 'mx-auto w-full max-w-xl' }}
        />
        {/* <div className="mx-auto mt-6 flex w-full max-w-lg flex-wrap items-center gap-3">
          <Badge size="lg" className="cursor-pointer py-1.5" content="Douala" />
          <Badge
            size="lg"
            className="cursor-pointer py-1.5"
            content="Yaoundé"
          />
          <Badge
            size="lg"
            className="cursor-pointer py-1.5"
            content="Bafoussam"
          />
          <Badge size="lg" className="cursor-pointer py-1.5" content="Garoua" />
        </div> */}
        <AsyncWrapper
          isLoading={isLoading}
          error={error}
          onRetryError={refetch}
        >
          {data?.serviceRequests && data?.serviceRequests?.length > 0 && (
            <div className="grid w-full grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-2 xl:grid-cols-3">
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
    </>
  );
};

export const getServerSideProps = createServerSideProps({
  shouldUseSSG: true,
  resolver: async ({ ctx, ssg }) => {
    if (ssg) {
      await ssg?.services.getAllServiceRequests.prefetch({});
    }
    return { props: {} };
  },
});

export default ServiceRequestsPage;
