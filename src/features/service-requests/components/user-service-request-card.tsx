import { type ServiceRequestStatus } from '@prisma/client';
import { MapPin, UserCheck2 } from 'lucide-react';
import { User2Icon } from 'lucide-react';
import React, { type FC } from 'react';

import { Anchor } from '@/components/anchor';
import { DaysFromNow } from '@/components/days-from-now';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { GroupItem } from '@/components/ui/group-item';
import { Image } from '@/components/ui/image';
import { Inline } from '@/components/ui/inline';
import { Typography } from '@/components/ui/typography';
import { User } from '@/components/user';

import { DEFAULT_SERVICE_REQUEST_COVER_IMAGE } from '@/features/service-requests';

import { abbreviateNumber } from '@/utils/number';

import { cn } from '@/lib/utils';

import { type GetAllServiceRequestsOutput } from '../types';

interface UserServiceRequestCardProps {
  className?: string;
  serviceRequest: GetAllServiceRequestsOutput['serviceRequests'][number];
}

export const mapUserServiceRequestStatus: Record<ServiceRequestStatus, string> =
  {
    OPEN: 'En cours',
    CLOSED: 'Terminée',
  };

const UserServiceRequestCard: FC<UserServiceRequestCardProps> = ({
  serviceRequest,
  className,
}) => {
  const stats = serviceRequest.stats;
  const isStatusOpen = serviceRequest?.status === 'OPEN';
  // const reservedProviders = serviceRequest?.providersReserved?.map(el => el.p)
  const serviceRequestStats = (
    <Inline>
      <Typography variant="small" className="text-xs">
        {abbreviateNumber(stats.commentCount)} Commentaires
      </Typography>
      <Typography variant="small" className="text-xs">
        {abbreviateNumber(stats.proposalCount)} Propositions
      </Typography>
      <Typography variant="small" className="text-xs">
        {abbreviateNumber(stats.providersReservedCount)} Réservés
      </Typography>
    </Inline>
  );

  return (
    <article
      className={cn(
        'grid w-full grid-cols-1 gap-y-4 rounded-md border p-3 shadow-md lg:grid-cols-2 lg:gap-y-0 lg:divide-x lg:divide-gray-200',
        className
      )}
    >
      <div className="lg:pr-6">
        <Image
          src={
            serviceRequest?.photos?.[0]?.url ||
            DEFAULT_SERVICE_REQUEST_COVER_IMAGE
          }
          alt="Service request card image"
          className="h-52 w-full object-top"
        />
        <div className="mt-3 flex items-center gap-x-1 text-xs sm:gap-x-3">
          <div className="flex items-center gap-x-1 text-muted-foreground">
            <DaysFromNow date={serviceRequest?.createdAt} />
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
          <Anchor
            className="mt-2 flex items-center gap-1"
            href={`/service-requests/${serviceRequest?.slug}`}
          >
            <Typography
              as="h4"
              truncate
              lines={2}
              className="group-hover:text-gray-600"
            >
              <span className="absolute inset-0" />
              {serviceRequest?.title}
            </Typography>
            <Badge
              content={
                mapUserServiceRequestStatus[serviceRequest?.status as never]
              }
              variant={isStatusOpen ? 'primary' : 'danger'}
            />
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
          <div className="">{serviceRequestStats}</div>
        </div>
      </div>
      <div className="max-h-[380px] overflow-y-auto overflow-x-hidden lg:pl-6">
        <Typography
          variant="h3"
          className="sticky inset-x-0 top-0 bg-white pb-3"
        >
          Prestataires réservés
        </Typography>
        {stats.providersReservedCount > 0 ? (
          <div className="mt-3 space-y-3">
            {serviceRequest?.reservedProviders?.map(profile => (
              <div
                key={profile.id}
                className="flex flex-nowrap items-center justify-between gap-2 rounded-md bg-gray-50 p-2"
              >
                <User
                  profile={profile}
                  avatarProps={{ size: 'md' }}
                  size="md"
                />
                <Button size="sm" variant="outline">
                  Rétirer
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<UserCheck2 />}
            name="Aucun prestataire reservé"
            description="Vous n'avez pas réservé de prestataire"
          />
        )}
      </div>
    </article>
  );
};

export { UserServiceRequestCard };
