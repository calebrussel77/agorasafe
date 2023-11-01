import { openContext } from '@/providers/custom-modal-provider';
import { LucideDoorClosed, Search } from 'lucide-react';

import { CanView } from '@/components/can-view';
import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { DebouncedInput } from '@/components/ui/debounced-input';
import { EmptyState } from '@/components/ui/empty-state';
import { Seo } from '@/components/ui/seo';

import { LoginRedirect } from '@/features/auth';
import {
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
      <Container className="mt-16">
        <div className="">
          <DebouncedInput
            value="sss"
            iconAfter={<Search className="h-4 w-4" />}
            placeholder="Recherchez une demande de sercice..."
            classNames={{ root: 'w-full max-w-md' }}
          />
          {/* <Tabs defaultValue="account" className="mt-10 w-full">
            <Tabs.List className="mx-auto grid w-[300px] grid-cols-2">
              <Tabs.Trigger value="account">Clients</Tabs.Trigger>
              <Tabs.Trigger value="password">Prestataires</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content
              value="account"
              className="flex items-center justify-center"
            ></Tabs.Content>
            <Tabs.Content
              value="password"
              className="flex items-center justify-center"
            >
              <div></div>
            </Tabs.Content>
          </Tabs> */}
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
              className="my-8"
              description="Aucune demande publiée pour l'instant."
              // description="Soyez le premier à créer et publier votre demande de service."
              primaryAction={
                <CanView allowedProfiles={['CUSTOMER']} isPublic>
                  <LoginRedirect reason="create-service-request">
                    <Button
                      onClick={() => openContext('createServiceRequest', {})}
                      size="sm"
                    >
                      Créer ma demande
                    </Button>
                  </LoginRedirect>
                </CanView>
              }
            />
          )}
        </AsyncWrapper>
      </Container>
      {/* <LatestServiceRequests /> */}
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
