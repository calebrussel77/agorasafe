import { MapPin } from 'lucide-react';
import { User2Icon } from 'lucide-react';
import React, { type FC } from 'react';

import { Anchor } from '@/components/anchor';
import { DaysFromNow } from '@/components/days-from-now';
import { ImagesSlider } from '@/components/images-slider';
import { Badge } from '@/components/ui/badge';
import { GroupItem } from '@/components/ui/group-item';
import { Inline } from '@/components/ui/inline';
import { AbsolutePlacement } from '@/components/ui/layout';
import { NoSSR } from '@/components/ui/no-ssr';
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
  isNew?: boolean;
}

const aDayAgo = decreaseDate(new Date(), { days: 1 });

const ServiceRequestCard: FC<ServiceRequestCardProps> = ({
  serviceRequest,
  className,
}) => {
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

  const photos = isEmptyArray(serviceRequest?.photos)
    ? [
        {
          url: DEFAULT_SERVICE_REQUEST_COVER_IMAGE,
          alt: "Photo de couverture d'une demande de service",
        },
      ]
    : serviceRequest?.photos?.map(el => ({ url: el.url, alt: el.name }));

  return (
    <article
      className={cn(
        'relative flex flex-col items-start justify-between overflow-hidden rounded-md border bg-white shadow-lg',
        className
      )}
    >
      <ImagesSlider images={photos} className="aspect-[16/9] w-full" />
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
