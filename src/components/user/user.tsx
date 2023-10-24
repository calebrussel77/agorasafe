import { LocateIcon, MapPin, PinIcon } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import React, { type FC } from 'react';

import { cn } from '@/lib/utils';

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { Anchor } from '../anchor';
import { type AvatarProps } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { GroupItem, type GroupItemProps } from '../ui/group-item';
import { Rating } from '../ui/rating';
import { Truncate } from '../ui/truncate';
import { Typography } from '../ui/typography';
import { UserAvatar } from '../user-avatar';
import { UserBadge } from '../user-badge';

interface UserProps extends Partial<GroupItemProps> {
  shouldIncludeAvatar?: boolean;
  withBadges?: boolean;
  withLocation?: boolean;
  withRating?: boolean;
  withOwnerBadge?: boolean;
  withName?: boolean;
  canLinkToProfile?: boolean;
  profile: Partial<SimpleProfile> | null | undefined;
  withProfileTypeInitial?: boolean;
  avatarProps?: AvatarProps;
}

const User: FC<UserProps> = ({
  profile,
  canLinkToProfile = true,
  shouldIncludeAvatar = true,
  withProfileTypeInitial = false,
  withRating = true,
  withOwnerBadge = false,
  withBadges = true,
  withLocation = true,
  withName = true,
  avatarProps,
  classNames,
  ...rest
}) => {
  if (!profile) return null;

  const isProfileDeleted = !!profile.deletedAt;
  const isAdmin = profile?.user?.role === 'ADMIN';
  const isProvider = profile?.type === 'PROVIDER';

  return (
    <div>
      <GroupItem
        {...rest}
        classNames={{ root: cn('py-0', classNames?.root) }}
        isHoverDisabled
        iconBefore={
          shouldIncludeAvatar && (
            <UserProfileLink
              profile={profile}
              canLinkToProfile={canLinkToProfile}
            >
              <UserAvatar
                type={profile?.type as never}
                src={
                  profile.avatar && !isProfileDeleted
                    ? profile.avatar
                    : undefined
                }
                alt={
                  profile.name && !isProfileDeleted
                    ? `${profile.name}'s Avatar`
                    : undefined
                }
                {...avatarProps}
              />
            </UserProfileLink>
          )
        }
        name={
          withName && (
            <UserProfileLink
              profile={profile}
              canLinkToProfile={canLinkToProfile}
            >
              <div
                className={cn(
                  'flex items-center gap-x-1 leading-none tracking-tight'
                )}
              >
                <Typography
                  as="h3"
                  variant="h4"
                  truncate
                  className={cn(
                    'line-clamp-1 text-base font-semibold',
                    classNames?.name
                  )}
                >
                  {profile?.name}
                </Typography>
                {withOwnerBadge === true && <Badge content="Auteur" />}
                {withBadges && (
                  <UserBadge
                    type={profile?.type as never}
                    withProfileTypeInitial={withProfileTypeInitial}
                  />
                )}
                {isAdmin && (
                  <ShieldCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                )}
              </div>
            </UserProfileLink>
          )
        }
        description={
          <>
            {withLocation ? (
              <div
                className={cn(
                  'flex items-center gap-2 text-xs text-muted-foreground',
                  isProvider && withRating && 'mb-1',
                  classNames?.description
                )}
              >
                {/* <MapPin className="h-4 w-4" /> */}
                <Truncate>{profile?.location?.name}</Truncate>
              </div>
            ) : null}
            {isProvider && withRating && (
              <Rating
                readonly
                initialRating={4}
                size="xs"
                className="-mt-1.5"
              />
            )}
          </>
        }
      />
    </div>
  );
};

const UserProfileLink = ({
  children,
  profile,
  canLinkToProfile,
}: {
  children: JSX.Element;
  profile?: UserProps['profile'];
  canLinkToProfile?: boolean;
}) => {
  if (!profile || !canLinkToProfile || !!profile.deletedAt)
    return <>{children}</>;

  const href = `/u/${profile.slug}`;

  return (
    <Anchor
      href={href}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
    >
      {children}
    </Anchor>
  );
};

export { User };
