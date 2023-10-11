import { MapPin } from 'lucide-react';
import { User2Icon } from 'lucide-react';
import Link from 'next/link';
import React, { type FC } from 'react';

import { NavigationDot } from '@/components/slide';
import { AvatarGroup } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GroupItem } from '@/components/ui/group-item';
import { Image } from '@/components/ui/image';
import { Inline } from '@/components/ui/inline';
import { AbsolutePlacement } from '@/components/ui/layout';
import { Typography } from '@/components/ui/typography';
import { User } from '@/components/user';

import { isEmptyArray } from '@/utils/type-guards';

import { dateToReadableString } from '@/lib/date-fns';
import { cn } from '@/lib/utils';

import { useSliderControlsImages } from '@/hooks/use-slider-controls-images';

import { DEFAULT_SERVICE_REQUEST_COVER_IMAGE } from '../constants';
import { type GetAllServiceRequestsOutput } from '../types';

interface ServiceRequestCardProps {
  className?: string;
  serviceRequest: GetAllServiceRequestsOutput['serviceRequests'][number];
}

const ServiceRequestCard: FC<ServiceRequestCardProps> = ({
  serviceRequest,
  className,
}) => {
  const photos = isEmptyArray(serviceRequest?.photos)
    ? [
        {
          url: DEFAULT_SERVICE_REQUEST_COVER_IMAGE,
          name: "Photo de couverture d'une demande de service",
        },
      ]
    : serviceRequest?.photos;

  const { currentSlide, sliderRef, hasLoaded, instanceRef } =
    useSliderControlsImages();

  return (
    <article
      className={cn(
        'flex flex-col items-start justify-between overflow-hidden p-2',
        className
      )}
    >
      {photos?.length > 1 ? (
        <div
          ref={sliderRef}
          className="keen-slider relative aspect-[16/9] w-full rounded-2xl sm:aspect-[2/1] lg:aspect-[3/2]"
        >
          {photos.map((photo, idx) => (
            <div
              key={idx}
              className="keen-slider__slide absolute inset-0 h-full w-full"
            >
              <Image
                src={photo?.url}
                alt={photo?.name}
                className="h-full w-full rounded-2xl bg-gray-100 object-cover"
              />
            </div>
          ))}
          {hasLoaded && instanceRef?.current && (
            <AbsolutePlacement
              placement="bottom-center"
              className="flex flex-nowrap items-center gap-3"
            >
              {[
                ...Array(
                  instanceRef?.current?.track?.details?.slides?.length
                ).keys(),
              ].map(idx => {
                return (
                  <NavigationDot
                    key={idx}
                    onClick={() => {
                      instanceRef?.current?.moveToIdx(idx);
                    }}
                    isActive={currentSlide === idx}
                  />
                );
              })}
            </AbsolutePlacement>
          )}
        </div>
      ) : (
        <div className="relative aspect-[16/9] w-full rounded-2xl sm:aspect-[2/1] lg:aspect-[3/2]">
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={photos[0]?.url as string}
              alt={photos[0]?.name as string}
              className="h-full w-full rounded-2xl bg-gray-100 object-cover"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
          </div>
        </div>
      )}
      <div className="max-w-xl">
        <div className="mt-8 flex items-center gap-x-3 text-xs">
          <time
            dateTime={serviceRequest?.createdAt.toString()}
            className="text-gray-500"
          >
            Publiée {dateToReadableString(serviceRequest?.createdAt)}
          </time>
          <Link
            href={`/service-requests?category=${serviceRequest?.service?.categoryService?.slug}`}
          >
            <Badge content={serviceRequest?.service?.categoryService?.name} />
          </Link>
          <div
            aria-label="Prix estimé de la prestation"
            title="Prix estimé de la prestation"
            className="flex flex-1 items-end justify-end pl-1 font-semibold text-brand-600"
          >
            <span>{serviceRequest?.estimatedPriceFormatted}</span>
          </div>
        </div>
        <div className="group relative">
          <Link href={`/service-requests/${serviceRequest?.slug}`}>
            <Typography
              as="h3"
              truncate
              lines={2}
              className="mt-3 group-hover:text-gray-600"
            >
              <span className="absolute inset-0" />
              {serviceRequest?.title}
            </Typography>
          </Link>
          <Inline>
            <GroupItem
              isHoverDisabled
              classNames={{
                root: 'gap-x-1.5',
                name: 'text-sm text-muted-foreground font-normal',
              }}
              iconBefore={<MapPin className="h-4 w-4" />}
              name={serviceRequest?.location?.name}
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
            truncate
            lines={3}
            className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600"
          >
            {serviceRequest?.description}
          </Typography>
        </div>
        <div className="relative mt-6 flex items-center justify-between gap-x-4">
          <User
            profile={serviceRequest?.author?.profile}
            withProfileTypeInitial
            withLocation={false}
            classNames={{ name: 'text-sm' }}
            avatarProps={{ size: 'xs' }}
          />
          {serviceRequest?.comments && serviceRequest?.comments?.length > 0 && (
            <AvatarGroup
              maxCount={3}
              size="xs"
              data={serviceRequest?.comments?.map(comment => ({
                name: comment.author.name,
                src: comment.author.avatar as string,
                href: `/u/${comment.author.slug}`,
              }))}
            />
          )}
        </div>
      </div>
    </article>
  );
};

export { ServiceRequestCard };
