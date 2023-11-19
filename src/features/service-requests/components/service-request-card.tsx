import { MapPin } from 'lucide-react';
import { User2Icon } from 'lucide-react';
import React, { type FC } from 'react';

import { Anchor } from '@/components/anchor';
import { DaysFromNow } from '@/components/days-from-now';
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
          name: "Photo de couverture d'une demande de service",
        },
      ]
    : serviceRequest?.photos;

  return (
    <article
      className={cn(
        'relative flex flex-col items-start justify-between overflow-hidden rounded-md p-1',
        className
      )}
    >
      <Image
        src={photos[0]?.url as string}
        alt={photos[0]?.name as string}
        className="aspect-[16/9] w-full overflow-hidden rounded-md bg-gray-50 object-cover transition duration-300 hover:scale-105 sm:aspect-[2/1] lg:aspect-[3/2]"
      />
      {isNew && (
        <AbsolutePlacement placement="top-right" className="right-7 top-2">
          <Badge content="Nouveauté" variant="success" shape="rounded" />
        </AbsolutePlacement>
      )}
      <div>
        <div className="mt-4 flex items-center gap-x-1 text-xs sm:gap-x-3">
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
            href={`/service-requests/${serviceRequest?.slug}`}
            className="mt-3 flex items-center gap-2"
          >
            <Typography
              as="h3"
              truncate
              lines={2}
              className="group-hover:text-gray-600"
            >
              <span className="absolute inset-0" />
              {serviceRequest?.title}
            </Typography>
            <Anchor
              href={`/service-requests?category=${serviceRequest?.service?.categoryService?.slug}`}
            >
              <Badge content={serviceRequest?.service?.categoryService?.name} />
            </Anchor>
          </Anchor>
          <Inline>
            <GroupItem
              isHoverDisabled
              classNames={{
                root: 'gap-x-1.5',
                name: 'text-sm text-muted-foreground font-normal',
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
            truncate
            lines={3}
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
