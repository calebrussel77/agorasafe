import { MapPin } from 'lucide-react';
import { User2Icon } from 'lucide-react';
import Link from 'next/link';
import React, { type FC } from 'react';

import { Anchor } from '@/components/anchor';
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

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { useSliderControlsImages } from '@/hooks/use-slider-controls-images';

import { DEFAULT_SERVICE_REQUEST_COVER_IMAGE } from '../constants';

interface ServiceRequestCardProps {
  className?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  photos: Array<{ url: string; name: string }>;
  createdAt: Date;
  categoryName: string | undefined;
  categoryHref: string;
  title: string;
  slug: string;
  estimatedPriceText: string;
  location: string;
  nbOfProviderNeededText: string;
  description: string | null;
  author: SimpleProfile;
  commentAuthors: Array<{ name: string; src: string | null; href: string }>;
}

const ServiceRequestCard: FC<ServiceRequestCardProps> = ({
  photos: _photos,
  description,
  title,
  categoryHref,
  categoryName,
  createdAt,
  author,
  className,
  nbOfProviderNeededText,
  estimatedPriceText,
  commentAuthors,
  isFeatured,
  isNew,
  slug,
  location,
}) => {
  const photos = isEmptyArray(_photos)
    ? [
        {
          url: DEFAULT_SERVICE_REQUEST_COVER_IMAGE,
          name: "Photo de couverture d'une demande de service",
        },
      ]
    : _photos;

  const photosCount = photos?.length || 1;

  const { currentSlide, sliderRef, hasLoaded, instanceRef } =
    useSliderControlsImages();

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
            <img
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
            <AvatarGroup
              maxCount={3}
              size="xs"
              data={commentAuthors as never}
            />
          )}
        </div>
      </div>
    </article>
  );
};

export { ServiceRequestCard };
