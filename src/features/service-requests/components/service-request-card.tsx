import { MapPin } from 'lucide-react';
import { User2Icon } from 'lucide-react';
import Link from 'next/link';
import React, { type FC } from 'react';

import { Anchor } from '@/components/anchor';
import { DaysFromNow } from '@/components/days-from-now';
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

import { cn } from '@/lib/utils';

import { useSliderControlsImages } from '@/hooks/use-slider-controls-images';

import { DEFAULT_SERVICE_REQUEST_COVER_IMAGE } from '../constants';
import { type GetAllServiceRequestsOutput } from '../types';

interface ServiceRequestCardProps {
  className?: string;
  serviceRequest: GetAllServiceRequestsOutput['serviceRequests'][number];
  isNew?: boolean;
}

const ServiceRequestCard: FC<ServiceRequestCardProps> = ({
  serviceRequest,
  isNew,
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
  const photosCount = photos?.length || 1;

  const { currentSlide, sliderRef, hasLoaded, instanceRef } =
    useSliderControlsImages({ autoSlide: false });

  return (
    <article
      className={cn(
        'relative flex flex-col items-start justify-between p-2',
        className
      )}
    >
      {photosCount > 1 ? (
        <div ref={sliderRef} className="keen-slider relative px-1">
          {photos.map((photo, idx) => (
            <Image
              key={idx}
              src={photo?.url}
              alt={photo?.name}
              loading="eager"
              className="keen-slider__slide aspect-[16/9] w-full bg-gray-50 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
            />
          ))}
          {hasLoaded && instanceRef?.current && (
            <AbsolutePlacement
              placement="bottom-center"
              className="flex flex-nowrap items-center gap-3"
            >
              {[...Array(photosCount).keys()].map(idx => {
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
        <Image
          src={photos[0]?.url as string}
          alt={photos[0]?.name as string}
          className="aspect-[16/9] w-full bg-gray-50 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
        />
      )}
      {isNew && (
        <AbsolutePlacement placement="top-right" className="right-7 top-2">
          <Badge content="Nouveauté" variant="success" shape="rounded" />
        </AbsolutePlacement>
      )}
      <div className="max-w-xl">
        <div className="mt-8 flex items-center gap-x-1 text-xs sm:gap-x-3">
          <div className="flex items-center gap-x-1 text-muted-foreground">
            Publiée <DaysFromNow date={serviceRequest?.createdAt} />
          </div>
          <Anchor
            href={`/service-requests?category=${serviceRequest?.service?.categoryService?.slug}`}
          >
            <Badge content={serviceRequest?.service?.categoryService?.name} />
          </Anchor>
          <div
            aria-label="Prix estimé de la prestation"
            title="Prix estimé de la prestation"
            className="flex flex-1 items-end justify-end pl-1 font-semibold text-brand-600"
          >
            <span>{serviceRequest?.estimatedPriceFormatted}</span>
          </div>
        </div>
        <div className="group relative">
          <Anchor href={`/service-requests/${serviceRequest?.slug}`}>
            <Typography
              as="h3"
              truncate
              lines={2}
              className="mt-3 group-hover:text-gray-600"
            >
              <span className="absolute inset-0" />
              {serviceRequest?.title}
            </Typography>
          </Anchor>
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
            subText={null}
            classNames={{ text: 'text-sm' }}
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

{
  /* <article
  className={cn(
    'relative flex flex-col items-start justify-between p-2',
    className
  )}
>
  {photosCount > 1 ? (
    <div ref={sliderRef} className="keen-slider relative px-1">
      {photos.map((photo, idx) => (
        <Image
          key={idx}
          src={photo?.url}
          alt={photo?.name}
          loading="eager"
          className="keen-slider__slide aspect-[16/9] w-full bg-gray-50 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
        />
      ))}
      {hasLoaded && instanceRef?.current && (
        <AbsolutePlacement
          placement="bottom-center"
          className="flex flex-nowrap items-center gap-3"
        >
          {[...Array(photosCount).keys()].map(idx => {
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
    <Image
      src={photos[0]?.url as string}
      alt={photos[0]?.name as string}
      className="aspect-[16/9] w-full bg-gray-50 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
    />
  )}
  {isNew && (
    <AbsolutePlacement placement="top-right" className="right-7 top-2">
      <Badge content="Nouveauté" variant="success" shape="rounded" />
    </AbsolutePlacement>
  )}
  <div className="max-w-xl">
    <div className="mt-8 flex items-center gap-x-3 text-xs">
      <time dateTime={createdAt.toString()} className="text-gray-500">
        Publiée {dateToReadableString(createdAt)}
      </time>
      <Anchor href={categoryHref}>
        <Badge content={categoryName} />
      </Anchor>
      <div
        aria-label="Prix estimé de la prestation"
        title="Prix estimé de la prestation"
        className="flex flex-1 items-end justify-end pl-1 font-semibold text-brand-600"
      >
        <span>{estimatedPriceText}</span>
      </div>
    </div>
    <div className="group relative">
      <Anchor href={`/service-requests/${slug}`}>
        <Typography
          as="h3"
          truncate
          lines={2}
          className="mt-3 group-hover:text-gray-600"
        >
          <span className="absolute inset-0" />
          {title}
        </Typography>
      </Anchor>
      <Inline>
        <GroupItem
          isHoverDisabled
          classNames={{
            root: 'gap-x-1.5',
            name: 'text-sm text-muted-foreground font-normal',
          }}
          iconBefore={<MapPin className="h-4 w-4" />}
          name={location}
        />
        <GroupItem
          isHoverDisabled
          classNames={{
            root: 'gap-x-1.5',
            name: 'text-sm whitespace-nowrap text-muted-foreground font-normal',
            wrapper: 'flex-nowrap',
          }}
          iconBefore={<User2Icon className="h-4 w-4" />}
          name={nbOfProviderNeededText}
        />
      </Inline>
      <Typography
        truncate
        lines={3}
        className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600"
      >
        {description}
      </Typography>
    </div>
    <div className="relative mt-6 flex items-center justify-between gap-x-4">
      <User
        profile={author}
        subText={null}
        classNames={{ text: 'text-sm' }}
        avatarProps={{ size: 'xs' }}
      />
      {commentAuthors && commentAuthors?.length > 0 && (
        <AvatarGroup maxCount={3} size="xs" data={commentAuthors as never} />
      )}
    </div>
  </div>
</article>; */
}
