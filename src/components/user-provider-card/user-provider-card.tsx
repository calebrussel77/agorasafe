import React, { type FC } from 'react';

import { api } from '@/utils/api';
import { abbreviateNumber } from '@/utils/number';

import { decreaseDate } from '@/lib/date-fns';
import { cn } from '@/lib/utils';

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { Badge } from '../ui/badge';
import { Image } from '../ui/image';
import { Skeleton } from '../ui/skeleton';
import { Truncate } from '../ui/truncate';
import { Typography } from '../ui/typography';
import { UserAvatar, UserName, UserRating } from '../user';

interface UserProviderCardProps {
  className?: string;
  profile: SimpleProfile;
}

const aDayAgo = decreaseDate(new Date(), { days: 1 });

const StatItem = ({
  label,
  count,
  isLoading,
}: {
  label: string;
  count: number | undefined;
  isLoading?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-1 px-3">
      <Skeleton isVisible={isLoading} className="aspect-square h-4 w-20">
        <Typography className="text-sm font-light text-gray-600" truncate>
          {label}
        </Typography>
      </Skeleton>
      <Skeleton isVisible={isLoading} className="aspect-square h-4 w-6 rounded">
        <Typography className="font-bold">
          {abbreviateNumber(count ?? 0)}
        </Typography>
      </Skeleton>
    </div>
  );
};

const UserProviderCard: FC<UserProviderCardProps> = ({
  profile,
  className,
}) => {
  const { data: stats, isInitialLoading } = api.profiles.getStats.useQuery(
    {
      id: profile?.id,
    },
    { enabled: !!profile?.id }
  );

  if (!profile) return null;

  if (profile?.type === 'CUSTOMER') return null;

  const userStats = (
    <div className="-mx-3 mt-3 flex w-full items-start divide-x divide-gray-300 px-4 pb-2">
      <StatItem
        label="Propositions"
        isLoading={isInitialLoading}
        count={stats?.providerServiceRequestProposalCount}
      />
      <StatItem
        label="Réservations"
        isLoading={isInitialLoading}
        count={stats?.providerServiceRequestReservedCount}
      />
      <StatItem
        label="Avis client"
        isLoading={isInitialLoading}
        count={stats?.reviewCount}
      />
    </div>
  );

  const skillsCount = profile?.providerInfo?.skills?.length ?? 0;

  return (
    <div
      className={cn(
        'relative flex flex-col items-start justify-between overflow-hidden rounded-md border bg-white shadow-lg',
        className
      )}
    >
      <div className="relative h-20 w-full overflow-hidden bg-slate-200">
        <Image
          className="h-20 w-full object-cover"
          src="/images/profile-background-01.jpg"
          alt="Profile Banner"
        />
      </div>
      <div className="relative -mt-8 px-4">
        <UserAvatar profile={profile} shape="circle" size="xl" />
        <UserName
          profile={profile}
          classNames={{ text: 'text-lg', root: 'mt-1' }}
          canLinkToProfile
        />
        <Typography truncate className={cn('text-sm text-muted-foreground')}>
          {profile?.location?.address}
        </Typography>
        <UserRating
          profileName={profile?.name}
          reviewsCount={profile?._count?.receivedReviews}
        />
        <div className="mt-2 flex w-full items-center">
          <div className="flex w-full flex-1 items-center gap-1">
            {profile?.providerInfo?.skills?.slice(0, 2)?.map(skill => (
              <Badge
                key={skill?.id}
                size="sm"
                variant="outline"
                className="py-1.5 text-center"
                truncate
                content={skill?.name}
              />
            ))}
          </div>
          {skillsCount > 2 ? (
            <div className="rounded-full p-1 text-sm font-bold text-brand-600">
              +1
            </div>
          ) : null}
        </div>
      </div>
      {userStats}
    </div>
  );
};

export { UserProviderCard };
