import {
  ArrowLeftCircle,
  ArrowRight,
  ArrowRightCircleIcon,
  LucideDoorClosed,
} from 'lucide-react';
import { Autoplay } from 'swiper/modules';

import {
  SwiperButton,
  SwiperCarousel,
  useSwiperRef,
} from '@/components/swiper-carousel';
import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

import { api } from '@/utils/api';

import { LATEST_SERVICE_REQUESTS_COUNT } from '../utils';
import { ServiceRequestButton } from './service-request-button';
import { ServiceRequestCard } from './service-request-card';

const breakpoints = {
  600: {
    slidesPerView: 2,
  },
  720: {
    slidesPerView: 3,
  },
  1024: {
    slidesPerView: 4,
  },
  1480: {
    slidesPerView: 4,
  },
};

export function LatestServiceRequests() {
  const { swiperRef, onHandleNextSlide, onHandlePrevSlide } = useSwiperRef();

  const { data, error, refetch, isLoading } =
    api.serviceRequests.getAll.useQuery({
      limit: LATEST_SERVICE_REQUESTS_COUNT,
    });

  return (
    <div className="bg-gray-50 py-12">
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
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
              {data?.totalCount > 3 && (
                <div className="flex w-full justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    href="/service-requests"
                    className="w-auto text-brand-600 hover:bg-brand-100 hover:text-brand-700"
                  >
                    <span>Voir tous</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
              <div className="flex w-full flex-col gap-3">
                <SwiperCarousel
                  options={data?.serviceRequests}
                  breakpoints={breakpoints}
                  renderItem={({ item: serviceRequest, idx }) => (
                    <ServiceRequestCard
                      key={serviceRequest?.id}
                      className="w-full"
                      idx={idx}
                      serviceRequest={serviceRequest}
                    />
                  )}
                  swiperRef={swiperRef}
                  className="h-full w-full"
                />
                <div className="flex w-full items-center justify-end gap-3">
                  <SwiperButton mode="prev" onClick={onHandlePrevSlide}>
                    <ArrowLeftCircle className="h-6 w-6" />
                  </SwiperButton>
                  <SwiperButton mode="next" onClick={onHandleNextSlide}>
                    <ArrowRightCircleIcon className="h-6 w-6" />
                  </SwiperButton>
                </div>
              </div>
            </div>
          )}
        </AsyncWrapper>
      </div>
    </div>
  );
}
