import { openContext } from '@/providers/custom-modal-provider';
import {
  ArrowLeftCircle,
  ArrowRight,
  ArrowRightCircle,
  LucideDoorClosed,
} from 'lucide-react';

import { CanView } from '@/components/can-view';
import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

import { LoginRedirect } from '@/features/auth';

import { cn } from '@/lib/utils';

import { useSliderControlsImages } from '@/hooks/use-slider-controls-images';

import { LATEST_SERVICE_REQUESTS_COUNT } from '../constants';
import { useGetAllServiceRequests } from '../services';
import { ServiceRequestCard } from './service-request-card';

export function LatestServiceRequests() {
  const { currentSlide, sliderRef, hasLoaded, instanceRef } =
    useSliderControlsImages({
      autoSlide: false,
      loop: false,
      breakpoints: {
        '(min-width: 768px)': {
          slides: { perView: 2, spacing: 15 },
        },
        '(min-width: 1024px)': {
          slides: { perView: 3, spacing: 15 },
        },
      },
      slides: { perView: 1 },
    });

  const { data, error, refetch, isLoading } = useGetAllServiceRequests({
    limit: LATEST_SERVICE_REQUESTS_COUNT,
  });

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
          {data?.serviceRequests && data?.serviceRequests?.length > 0 && (
            <div className="mx-auto mt-8 max-w-2xl lg:mx-0 lg:max-w-none">
              {hasLoaded && instanceRef?.current && (
                <div className="flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e: any) =>
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                      e.stopPropagation() || instanceRef?.current?.prev()
                    }
                    disabled={currentSlide === 0}
                  >
                    <ArrowLeftCircle
                      className={cn(
                        'default__transition h-6 w-6 text-gray-700',
                        currentSlide === 0 && 'h-5 w-5'
                      )}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e: any) =>
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                      e.stopPropagation() || instanceRef?.current?.next()
                    }
                    disabled={
                      currentSlide === data?.serviceRequests?.length - 1
                    }
                  >
                    <ArrowRightCircle className="h-6 w-6 text-gray-700" />
                  </Button>
                </div>
              )}
              <div ref={sliderRef} className="keen-slider mt-2 w-full">
                {data?.serviceRequests?.map(serviceRequest => {
                  const commentAuhtors = serviceRequest?.comments?.map(
                    comment => ({
                      name: comment?.author?.name,
                      src: comment?.author?.avatar,
                      href: `/u/${comment?.author?.slug}`,
                    })
                  );

                  return (
                    <ServiceRequestCard
                      isNew
                      key={serviceRequest?.id}
                      className="keen-slider__slide w-full"
                      photos={serviceRequest?.photos}
                      description={serviceRequest?.description}
                      title={serviceRequest?.title}
                      categoryHref={`/service-requests?category=${serviceRequest?.service?.categoryService?.slug}`}
                      createdAt={serviceRequest?.createdAt}
                      location={serviceRequest?.location?.name}
                      slug={serviceRequest?.slug}
                      commentAuthors={commentAuhtors}
                      nbOfProviderNeededText={
                        serviceRequest?.nbProviderNeededFormattedText
                      }
                      estimatedPriceText={
                        serviceRequest?.estimatedPriceFormatted
                      }
                      categoryName={
                        serviceRequest?.service?.categoryService?.name
                      }
                      author={serviceRequest?.author?.profile}
                    />
                  );
                })}
              </div>
              {data?.totalCount > LATEST_SERVICE_REQUESTS_COUNT && (
                <Button
                  size="sm"
                  href="/explore"
                  className="mx-auto mt-12 flex justify-center"
                >
                  <span>Voir toutes les demandes</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}
        </AsyncWrapper>
      </div>
    </div>
  );
}
