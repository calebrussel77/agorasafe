import { LucideDoorClosed } from 'lucide-react';

import { CanView } from '@/components/can-view';
import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

import { LoginRedirect } from '@/features/auth';
import { AskServiceModal } from '@/features/services';

import { DEFAULT_SERVICE_REQUESTS_LIMIT } from '../constants';
import { useGetAllServiceRequests } from '../services';
import { ServiceRequestCard } from './service-request-card';

export function ServiceRequestsSection() {
  const { data, error, refetch, isLoading } = useGetAllServiceRequests({
    limit: DEFAULT_SERVICE_REQUESTS_LIMIT,
  });

  console.log({ data });

  return (
    <div className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Les dernières demandes
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Consultez les dernières demande de service publiées.
          </p>
        </div>
        <AsyncWrapper
          isLoading={isLoading}
          error={error}
          onRetryError={refetch}
        >
          {data?.serviceRequests && data?.serviceRequests?.length === 0 && (
            <EmptyState
              icon={<LucideDoorClosed />}
              className="my-3"
              name="Aucune demande publiée"
              description="Soyez le premier à créer et publier votre demande service."
              primaryAction={
                <CanView allowedProfiles={['CUSTOMER']} isPublic>
                  <AskServiceModal>
                    <LoginRedirect reason="create-service-request">
                      <Button size="sm">Créer ma demande</Button>
                    </LoginRedirect>
                  </AskServiceModal>
                </CanView>
              }
            />
          )}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {data?.serviceRequests?.map(serviceRequest => (
              <ServiceRequestCard
                key={serviceRequest?.id}
                serviceRequest={serviceRequest}
              />
            ))}
          </div>
        </AsyncWrapper>
      </div>
    </div>
  );
}
