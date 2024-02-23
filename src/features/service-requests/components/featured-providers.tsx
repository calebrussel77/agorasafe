import { ProfileType } from '@prisma/client';
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
import { UserProviderCard } from '@/components/user-provider-card';

import { api } from '@/utils/api';

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

export function FeaturedProviders() {
  const { swiperRef, onHandleNextSlide, onHandlePrevSlide } = useSwiperRef();

  const {
    data: profiles,
    error,
    refetch,
    isLoading,
  } = api.profiles.getAll.useQuery({
    type: ProfileType.PROVIDER,
    limit: 8,
  });

  return (
    <div className="bg-gray-50 py-12">
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nos meilleurs prestataires
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Consultez nos prestataires les plus actifs.
          </p>
        </div>
        <AsyncWrapper
          isLoading={isLoading}
          error={error}
          onRetryError={refetch}
        >
          {profiles && profiles?.length === 0 && (
            <EmptyState
              icon={<LucideDoorClosed />}
              className="my-8"
              description="Aucun prestataires trouvés."
              primaryAction={
                <Button href="/auth/login" size="sm">
                  Devenir un prestataire
                </Button>
              }
            />
          )}
          {profiles && profiles?.length > 0 && (
            <div className="mx-auto mt-8 max-w-2xl lg:mx-0 lg:max-w-none">
              {profiles?.length > 3 && (
                <div className="flex w-full justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    href="#"
                    className="w-auto text-brand-600 hover:bg-brand-100 hover:text-brand-700"
                  >
                    <span>Voir tous</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
              <div className="flex w-full flex-col gap-3">
                <SwiperCarousel
                  options={profiles}
                  autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                  }}
                  breakpoints={breakpoints}
                  modules={[Autoplay]}
                  renderItem={({ item: profile }) => (
                    <UserProviderCard
                      key={profile?.id}
                      className="w-full"
                      profile={profile as never}
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
