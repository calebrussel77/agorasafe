import { LocateIcon, MapPin, PinIcon } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import React, { type FC } from 'react';

import { cn } from '@/lib/utils';

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { type AvatarProps } from '../ui/avatar';
import { GroupItem, type GroupItemProps } from '../ui/group-item';
import { Truncate } from '../ui/truncate';
import { Typography } from '../ui/typography';
import { UserAvatar } from '../user-avatar';
import { UserBadge } from '../user-badge';

interface UserProps extends Partial<GroupItemProps> {
  shouldIncludeAvatar?: boolean;
  withBadges?: boolean;
  withLocation?: boolean;
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
  withBadges = true,
  withLocation = true,
  avatarProps,
  classNames,
  ...rest
}) => {
  if (!profile) return null;

  const isProfileDeleted = !!profile.deletedAt;
  const isAdmin = profile?.user?.role === 'ADMIN';

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
          <UserProfileLink
            profile={profile}
            canLinkToProfile={canLinkToProfile}
          >
            <div
              className={cn(
                'flex items-center gap-x-1 font-bold leading-none tracking-tight'
              )}
            >
              <Typography
                as="h3"
                variant="h4"
                truncate
                className={cn('line-clamp-1', classNames?.name)}
              >
                {profile?.name}
              </Typography>
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
        }
        description={
          withLocation ? (
            <div
              className={cn(
                'flex items-center gap-2 text-xs text-muted-foreground',
                classNames?.description
              )}
            >
              <MapPin className="h-4 w-4" />
              <Truncate>{profile?.location?.name}</Truncate>
            </div>
          ) : null
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
  children: React.ReactNode;
  profile?: UserProps['profile'];
  canLinkToProfile?: boolean;
}) => {
  if (!profile || !canLinkToProfile || !!profile.deletedAt)
    return <>{children}</>;

  const href = `/u/${profile.slug}`;

  return (
    <Link
      href={href}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
    >
      {children}
    </Link>
  );
};

export { User };