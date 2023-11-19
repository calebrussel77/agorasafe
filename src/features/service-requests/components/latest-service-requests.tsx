import { ArrowRight, LucideDoorClosed } from 'lucide-react';

import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

import { api } from '@/utils/api';

import { LATEST_SERVICE_REQUESTS_COUNT } from '../utils';
import { ServiceRequestButton } from './service-request-button';
import { ServiceRequestCard } from './service-request-card';

export function LatestServiceRequests() {
  const { data, error, refetch, isLoading } =
    api.serviceRequests.getAll.useQuery({
      limit: LATEST_SERVICE_REQUESTS_COUNT,
    });

  return (
    <div className="bg-white py-24">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
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
              className="my-8"
              description="Aucune demande publiée pour l'instant."
              primaryAction={
                <ServiceRequestButton>
                  <Button size="sm">Créer ma demande</Button>
                </ServiceRequestButton>
              }
            />
          )}
          {data?.serviceRequests && data?.serviceRequests?.length > 0 && (
            <div className="mx-auto mt-8 max-w-2xl lg:mx-0 lg:max-w-none">
              <div className="mt-2 grid w-full grid-cols-3 gap-3">
                {data?.serviceRequests?.map(serviceRequest => {
                  return (
                    <ServiceRequestCard
                      key={serviceRequest?.id}
                      className="w-full"
                      serviceRequest={serviceRequest}
                      isNew
                    />
                  );
                })}
              </div>

              {data?.totalCount > 0 && (
                <div className="mt-12 flex w-full justify-center">
                  <Button size="sm" href="/service-requests" className="w-auto">
                    <span>Voir toutes les demandes</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </AsyncWrapper>
      </div>
    </div>
  );
}
