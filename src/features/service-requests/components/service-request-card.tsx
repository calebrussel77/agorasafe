import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { User2Icon } from 'lucide-react';
import React, { type FC, useMemo } from 'react';
import { Autoplay } from 'swiper/modules';

import { Anchor } from '@/components/anchor';
import { DaysFromNow } from '@/components/days-from-now';
import { ImagesSlider } from '@/components/images-slider';
import {
  SwiperButton,
  SwiperCarousel,
  useSwiperRef,
} from '@/components/swiper-carousel';
import { Badge } from '@/components/ui/badge';
import { GroupItem } from '@/components/ui/group-item';
import { Image } from '@/components/ui/image';
import { Inline } from '@/components/ui/inline';
import { AbsolutePlacement } from '@/components/ui/layout';
import { Typography } from '@/components/ui/typography';
import { User } from '@/components/user';

import { abbreviateNumber } from '@/utils/number';
import { removeTags } from '@/utils/strings';
import { isEmptyArray } from '@/utils/type-guards';

import { decreaseDate } from '@/lib/date-fns';
import { cn } from '@/lib/utils';

import { type GetAllServiceRequestsOutput } from '../types';
import { DEFAULT_SERVICE_REQUEST_COVER_IMAGE } from '../utils';

interface ServiceRequestCardProps {
  className?: string;
  serviceRequest: GetAllServiceRequestsOutput['serviceRequests'][number];
  idx: number;
}

const aDayAgo = decreaseDate(new Date(), { days: 1 });

const activeStyles =
  'active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-30 place-items-center rounded-full border-2 bg-white border-zinc-300';

const pagination = {
  clickable: true,
  renderBullet: function (index: number, className: string) {
    return `<span class="rounded-full bg-brand-600 transition ${className}"></span>`;
  },
};

const defaultPhotoArray = [
  {
    url: DEFAULT_SERVICE_REQUEST_COVER_IMAGE,
    alt: "Photo de couverture d'une demande de service",
  },
];

const ServiceRequestCard: FC<ServiceRequestCardProps> = ({
  serviceRequest,
  className,
  idx,
}) => {
  const { swiperRef, onHandleNextSlide, onHandlePrevSlide } = useSwiperRef();

  const isNew = serviceRequest.createdAt > aDayAgo;
  const stats = serviceRequest.stats;

  const serviceRequestStats = (
    <Inline>
      <Typography variant="small">
        {abbreviateNumber(stats.commentCount)} Commentaires
      </Typography>
      <Typography variant="small">
        {abbreviateNumber(stats.proposalCount)} Propositions
      </Typography>
      <Typography variant="small">
        {abbreviateNumber(stats.providersReservedCount)} Réservés
      </Typography>
    </Inline>
  );

  const photos = useMemo(() => {
    if (!isEmptyArray(serviceRequest?.photos)) {
      return serviceRequest?.photos?.map(el => ({ url: el.url, alt: el.name }));
    }
    return defaultPhotoArray;
  }, [serviceRequest?.photos]);

  return (
    <article
      className={cn(
        'relative flex flex-col items-start justify-between overflow-hidden rounded-md border bg-white shadow-lg',
        className
      )}
    >
      <div
        className={cn(
          'group relative aspect-[16/9] w-full overflow-hidden bg-zinc-100'
        )}
      >
        <SwiperCarousel
          pagination={pagination}
          options={photos}
          autoplay={{
            delay: 2000 + (2 * idx + 1),
            disableOnInteraction: true,
          }}
          slidesPerView={1}
          breakpoints={undefined}
          modules={[Autoplay]}
          renderItem={({ item: image }) => (
            <Image
              fill
              loading="eager"
              className="absolute inset-0 h-full w-full overflow-hidden object-cover object-center"
              src={image.url}
              alt={image.alt}
            />
          )}
          swiperRef={swiperRef}
          className="h-full w-full"
        />
      </div>
      {isNew && (
        <AbsolutePlacement placement="top-right" className="right-7 top-2 z-30">
          <Badge content="Nouveauté" variant="success" shape="rounded" />
        </AbsolutePlacement>
      )}
      <div className="p-4">
        <div className="flex items-center gap-x-1 text-xs sm:gap-x-3">
          <User
            profile={serviceRequest?.author?.profile}
            classNames={{ text: 'text-sm' }}
            avatarProps={{ size: 'xs' }}
            subText={
              <DaysFromNow
                date={serviceRequest?.createdAt}
                className="text-muted-foreground"
              />
            }
          />
          <div
            aria-label="Prix estimé de la prestation"
            title="Prix estimé de la prestation"
            className="flex flex-1 items-end justify-end pl-1 font-semibold text-brand-600"
          >
            <span>{serviceRequest?.estimatedPriceFormatted}</span>
          </div>
        </div>
        <div className="group relative">
          <Anchor
            href={`/service-requests/${serviceRequest?.id}/${serviceRequest?.slug}`}
            className="mt-3 flex items-center gap-2"
          >
            <Typography
              as="h3"
              truncate={false}
              className="line-clamp-2 group-hover:text-gray-600"
            >
              <span className="absolute inset-0" />
              {serviceRequest?.title}
            </Typography>
            <Badge content={serviceRequest?.service?.categoryService?.name} />
          </Anchor>
          <Inline>
            <GroupItem
              isHoverDisabled
              classNames={{
                root: 'gap-x-1.5',
                name: 'text-sm text-muted-foreground font-normal line-clamp-1',
              }}
              iconBefore={<MapPin className="h-4 w-4" />}
              name={serviceRequest?.location?.address}
            />
            <GroupItem
              isHoverDisabled
              classNames={{
                root: 'gap-x-1.5',
                name: 'text-sm whitespace-nowrap text-muted-foreground font-normal',
                wrapper: 'flex-nowrap',
              }}
              iconBefore={<User2Icon className="h-4 w-4" />}
              name={serviceRequest?.nbProviderNeededFormattedText}
            />
          </Inline>
          <Typography
            truncate={false}
            className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600"
          >
            {removeTags(serviceRequest?.description as string)}
          </Typography>
        </div>
        <div className="relative mt-2 flex items-center justify-between gap-x-4">
          <div className="">{serviceRequestStats}</div>
        </div>
      </div>
    </article>
  );
};

export { ServiceRequestCard };
